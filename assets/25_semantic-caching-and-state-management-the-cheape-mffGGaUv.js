const g="125",e="semantic-caching-and-state-management-the-cheapest-performance-win",n="Semantic Caching and State Management: The Cheapest Performance Win",t="A large fraction of the questions any AI system answers have been asked before. Not word for word, but in meaning.",a=`A large fraction of the questions any AI system answers have been asked before. Not word for word, but in meaning. "How do I reset my password?" and "I forgot my login details, what now?" are the same request wearing different clothes, and most systems pay full price for both.

Caching in AI systems is not the same problem as caching in ordinary services, because the cache key is a meaning rather than a string. That difference makes it powerful and makes it dangerous in a specific way that has to be designed against.

---

## Three levels of caching

They are complementary, not alternatives, and they intercept at different points.

| Level | Key | Hit rate typical | Saves |
|---|---|---|---|
| **Exact response cache** | Normalised query string | 5 to 15 percent | Everything |
| **Semantic response cache** | Query embedding, similarity threshold | 20 to 40 percent | Everything |
| **Prefix cache** | Stable prompt prefix | 60 to 95 percent | Prefill only |

Prefix caching, covered in earlier chapters, reduces the cost of computing a request. Response caching removes the request entirely. Both belong in a serious system.

---

## How semantic caching works

\`\`\`mermaid
---
title: "Semantic Cache Lookup With Validation Checks"
---
flowchart TD
    A["Incoming query"] --> B["Normalise<br/>trim, lowercase, strip filler"]
    B --> C{"Exact match in cache"}
    C -->|Yes| D["Return cached response<br/>latency under 10 ms"]
    C -->|No| E["Embed the query"]

    E --> F["Vector search over cached query embeddings<br/>scoped by tenant and user context"]
    F --> G{"Similarity above threshold"}

    G -->|No| H["Full pipeline<br/>retrieve and generate"]
    G -->|Yes| I["Candidate cache hit"]

    I --> J{"Validation checks"}
    J -->|Entities differ| H
    J -->|Negation differs| H
    J -->|Entry stale| H
    J -->|Permissions differ| H
    J -->|All pass| K["Return cached response"]

    H --> L["Generate response"]
    L --> M["Write to cache<br/>with embedding, TTL, scope, source version"]
    M --> N["Return response"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,E,F,H,L,M process
    class C,G,J decision
    class I risk
    class D,K,N output
\`\`\`

The validation block after a candidate hit is the part that separates a working cache from an incident generator. Everything below explains why.

---

## The false positive problem

A traditional cache either has the key or it does not. A semantic cache decides that two different questions are close enough, and "close enough" is a threshold that can be wrong.

The failures are specific and they cluster.

**Negation.** "Can I cancel my subscription?" and "Can I *not* cancel my subscription?" embed very closely. The answers are opposite. Embedding models are notoriously weak at negation.

**Entity substitution.** "What is the price of the Pro plan?" and "What is the price of the Enterprise plan?" differ by one token and embed close together. The answers differ entirely.

**Quantity and time.** "What were sales in Q1?" versus "Q2". "Orders over $100" versus "over $1000".

**Scope.** "How do I reset *my* password?" from two different users may need different answers if the system is personalised.

The mitigations, applied together:

**Set the threshold high.** 0.95 or above on cosine similarity, tuned against a labelled set of query pairs where the correct answer is known to be the same or different. A threshold chosen by intuition will be too low.

**Extract and compare entities.** Before accepting a hit, check that named entities, numbers, dates and product names match between the incoming query and the cached one. This single check removes most entity-substitution errors and is cheap.

**Detect negation explicitly.** A simple check for negation markers, and a rule that a hit requires matching negation polarity.

**Scope the cache key.** Tenant, locale, user role and anything else that changes the correct answer must be part of the lookup, not just the embedding.

**Never cache personalised responses in a shared namespace.** This is a data leak, not a quality issue.

---

## Invalidation, which is the harder half

A cache that returns yesterday's correct answer today is a correctness bug that no monitoring will catch unless someone designed for it.

Four strategies, and production systems need more than one.

| Strategy | Mechanism | Suits |
|---|---|---|
| **TTL** | Every entry expires after N | Everything, as a backstop |
| **Source versioning** | Entry records the document versions used; invalidated when any changes | RAG responses |
| **Event-driven** | Content update publishes an invalidation event | Systems with a clean update pipeline |
| **Confidence-weighted TTL** | High-confidence, stable answers live longer | Mixed-volatility content |

Source versioning is the one most worth building and most often skipped. If a cached answer was generated from documents A, B and C, and document B is updated, that entry must go. Storing the source chunk IDs and their versions with the cache entry makes this a straightforward reverse lookup.

Content volatility should drive TTL rather than a single global value:

\`\`\`
Product pricing:        1 hour     (changes rarely, costly if wrong)
Policy documents:       24 hours   (changes rarely, low volatility)
Inventory availability: do not cache
Account-specific data:  do not cache
General how-to content: 7 days
\`\`\`

The "do not cache" rows are as important as the others. Some content is simply not cacheable, and an all-or-nothing cache design either loses the wins or produces wrong answers.

---

## State management: the other half of the problem

Caching answers what has been asked. State management answers where a workflow is.

For anything longer than one turn, state must be explicit, typed and persisted. Three patterns matter.

**The state object.** One typed structure carrying everything the workflow knows. Not a growing transcript. Fields with defined types, updated by each step.

**Checkpointing.** The state persisted at every transition. This buys crash recovery, human-in-the-loop suspension, and the ability to reconstruct what the system knew at any point.

**Time travel.** Because checkpoints are a history, a run can be rewound to an earlier state, a value edited, and execution resumed from there. This is the single most useful debugging capability in agentic systems, and it is a free consequence of checkpointing properly.

\`\`\`mermaid
---
title: "Checkpointing Enables Rewind, Edit and Resume"
---
flowchart LR
    A["Step 1"] --> B[("Checkpoint 1")]
    B --> C["Step 2"]
    C --> D[("Checkpoint 2")]
    D --> E["Step 3"]
    E --> F[("Checkpoint 3")]
    F --> G["Step 4 fails"]

    F --> H["Rewind to checkpoint 3"]
    H --> I["Edit state<br/>correct the bad value"]
    I --> J["Resume from step 4"]
    J --> K["Success"]

    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef store fill:#F3F0F8,stroke:#8880AE,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A,C,E,I,J process
    class B,D,F store
    class G,H risk
    class K output
\`\`\`

The practical consequence for debugging: instead of reproducing a failure by rerunning a nondeterministic agent and hoping it fails the same way, you load the checkpoint immediately before the failure and inspect exactly what the system knew.

---

## What this looks like in three real systems

### The insurance FAQ bot where the threshold was the whole story

An insurer deployed semantic caching on a customer-facing assistant. Hit rate at a 0.85 similarity threshold was an encouraging 44 percent, and costs dropped accordingly.

Then complaints started. A customer asking about coverage for a *rented* vehicle received the cached answer for an *owned* vehicle. Another asking whether a policy covered flood damage received the answer for fire damage.

Sampling 500 cache hits against freshly generated answers found a 9 percent false positive rate. On insurance coverage questions, 9 percent wrong is not a cost saving, it is a liability.

The rebuild:

| Change | Hit rate | False positive rate |
|---|---|---|
| Baseline, threshold 0.85 | 44 percent | 9.0 percent |
| Threshold raised to 0.96 | 26 percent | 2.1 percent |
| Plus entity match check | 24 percent | 0.4 percent |
| Plus negation polarity check | 23 percent | 0.1 percent |
| Plus per-product-line scoping | 21 percent | under 0.05 percent |

Hit rate halved. That was the correct trade. A 21 percent hit rate with a negligible error rate is worth far more than 44 percent with 9 percent wrong.

The entity match check was the largest single improvement and the cheapest to implement: extract product names, vehicle types and peril types from both queries and require them to match exactly.

**Tune the threshold against measured false positives, not against hit rate.** Hit rate is the metric that looks good and the wrong one to optimise.

### The documentation site that cached its way out of a scaling problem

A developer platform's documentation assistant served roughly 90,000 questions a day. Traffic was heavily skewed: the top 400 question meanings accounted for about 60 percent of volume.

Layering the caches:

\`\`\`
Layer 1  Exact match (normalised string)      hit  11 percent
Layer 2  Semantic, threshold 0.96             hit  31 percent
Layer 3  Prefix cache on system prompt        hit  96 percent of remaining
Layer 4  Full generation                            58 percent of traffic

Effective cost per question:  down 61 percent
Median latency:               1.9 s -> 0.6 s
p95 latency:                  4.2 s -> 2.1 s
\`\`\`

The latency improvement mattered more to the product than the cost saving. A cached answer returns in under 50 milliseconds, which changes the interaction from "ask and wait" to "ask and see".

Invalidation was tied to the documentation build pipeline. Every cache entry stored the document version IDs used to generate it. A docs deploy published the changed document IDs, and a reverse lookup evicted every affected entry. Roughly 3 percent of the cache turned over per deploy, which is far better than the alternative of flushing everything.

\`\`\`mermaid
---
title: "Source-Version Invalidation Instead of a Full Flush"
---
flowchart TD
    A["Docs build completes"] --> B["Publish changed document IDs"]
    B --> C["Reverse lookup<br/>cache entries referencing those docs"]
    C --> D["Evict matched entries only"]
    D --> E["Remaining cache stays warm"]

    F["Cache entry"] --> G["response text"]
    F --> H["query embedding"]
    F --> I["source_doc_ids and versions"]
    F --> J["scope: locale, product, role"]
    F --> K["ttl and created_at"]

    I --> C

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef store fill:#F3F0F8,stroke:#8880AE,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,C,D process
    class F,G,H,I,J,K store
    class E output
\`\`\`

**A cache entry that does not record its sources cannot be invalidated precisely.** Storing source IDs at write time costs nothing and turns invalidation from a blunt flush into a surgical eviction.

### The loan processing workflow where checkpointing saved the audit

A lender automated a multi-day loan assessment workflow: document collection, verification, credit assessment, underwriting review, decision.

The original implementation held state in memory for the duration of a run. Runs spanning days across service restarts were fragile, and when a decision was questioned three months later, nobody could reconstruct what the system had known at the point of decision.

The rebuild used a typed state object checkpointed at every transition:

\`\`\`
LoanApplicationState
  application_id
  stage:              DOCUMENTS_PENDING | VERIFYING | ASSESSING | REVIEW | DECIDED
  documents:          [{type, received_at, verification_status, verified_by}]
  credit_assessment:  {score, factors[], model_version, computed_at}
  policy_checks:      [{rule_id, result, evidence}]
  human_decisions:    [{step, decision, approver, reason, timestamp}]
  decision:           {outcome, rationale, decided_at}
\`\`\`

Four capabilities followed directly, and only one of them was the original goal:

| Capability | How the checkpoint provides it |
|---|---|
| Resume after restart | Load the last checkpoint, continue |
| Suspend for human review | State serialised while awaiting an underwriter |
| Reconstruct any decision | The checkpoint at decision time is the record |
| Debug a bad outcome | Rewind, inspect, replay with a corrected input |

The audit capability turned out to be the one that mattered most. When a regulator asked why a specific application was declined, the answer was the checkpoint: the exact documents held, the exact policy checks run, the exact model version, and the exact human decisions with their reasons.

**Checkpointing is usually built for crash recovery and turns out to be worth more as an audit trail.** In regulated workflows it is not optional infrastructure.

---

## Metrics that describe a cache

Hit rate alone is misleading. Five numbers:

| Metric | Why |
|---|---|
| Hit rate | Volume served without generation |
| **False positive rate** | Sampled cached answers compared to fresh generation |
| Staleness rate | Entries served after their source changed |
| Cost saved | Hit rate times average generation cost |
| Latency at p50 and p95 | Split by hit and miss |

The false positive rate is the one that requires deliberate work: periodically sample cache hits, regenerate the answer fresh, and compare. Without this measurement a semantic cache's error rate is unknown, and unknown error rates in customer-facing systems are how the insurance example above happened.

---

## Failure modes

| Symptom | Cause |
|---|---|
| Wrong but plausible answers to similar questions | Threshold too low, no entity check |
| Opposite answers to negated questions | No negation polarity check |
| Users see other users' data | Cache not scoped by tenant or user |
| Answers reflect outdated content | No source versioning, TTL only |
| Hit rate high but complaints rising | False positive rate never measured |
| Cache flushed entirely on every content update | No source ID tracking |
| Long workflow restarts from zero after a deploy | No checkpointing |
| Cannot explain a past decision | State not persisted at decision time |
| Debugging requires reproducing a nondeterministic run | No time-travel capability |

---

## The cheapest win comes with a catch

Semantic caching is one of the few changes that improves latency and cost at the same time, which makes it unusually attractive and unusually easy to deploy carelessly.

The discipline it needs is specific: a threshold tuned against measured false positives rather than hit rate, entity and negation checks on top of similarity, scope keys that include tenant and role, and invalidation driven by recorded source versions rather than TTL alone.

State management is the same idea applied to workflows rather than answers. A typed state object checkpointed at every transition buys crash recovery, human-in-the-loop suspension, precise debugging and an audit trail, and the audit trail is frequently the one that turns out to matter most.

Both are infrastructure that looks optional until the day it is not.

---

*Next in this series: Evaluating AI systems — golden sets, judges and statistical honesty.*`,s="/blog/series/ai-systems-track-25.svg",i={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},r="2026-06-25",o=11,c="LLMOps",h=["Semantic Caching","State Management","Cost Optimization","Latency","AI Engineering","LLMOps","System Design","Performance"],l=!1,d="AI Systems Track",p="ai-systems-track",u=25,m=30,y={id:"125",slug:e,title:n,excerpt:t,content:a,featuredImage:s,author:i,publishedAt:r,readTime:o,category:c,tags:h,featured:l,series:d,seriesSlug:p,seriesPart:u,seriesTotal:m};export{i as author,c as category,a as content,y as default,t as excerpt,l as featured,s as featuredImage,g as id,r as publishedAt,o as readTime,d as series,u as seriesPart,p as seriesSlug,m as seriesTotal,e as slug,h as tags,n as title};
