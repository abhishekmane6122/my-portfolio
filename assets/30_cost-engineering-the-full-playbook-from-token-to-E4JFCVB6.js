const m="130",e="cost-engineering-the-full-playbook-from-token-to-invoice",n="Cost Engineering: The Full Playbook From Token to Invoice",t="AI cost conversations usually start at the wrong end. Someone compares published per-token prices, picks the cheaper model, and the invoice barely moves.",s=`AI cost conversations usually start at the wrong end. Someone compares published per-token prices, picks the cheaper model, and the invoice barely moves. Meanwhile the actual drivers sit untouched: a prompt ordered so that caching never engages, a cascade that was never built, a retrieval stage returning forty passages where five would do, and an agent with no step budget.

Cost in an AI system is an architectural property. It is set by a dozen decisions, most of which are not about which model is used.

---

## The only metric that matters

\`\`\`
cost per resolved task =
      (input_tokens x input_price + output_tokens x output_price)
    / success_rate
    + retry_cost
    + escalation_cost
    + human_handling_cost x escalation_rate
\`\`\`

Cost per token is an input to this. It is not the thing being optimised.

A cheaper model with a 70 percent success rate, whose failures escalate to a human at forty dollars a case, is more expensive than a model costing five times as much at 92 percent. The token line falls, the support line rises by more, and a dashboard showing only token spend records this as a win.

**Put cost per resolved task on the business dashboard.** Every other cost metric is diagnostic.

---

## Where the money actually goes

A rough breakdown for a typical production RAG or agent system, before any optimisation:

| Component | Share of spend | Optimisable |
|---|---|---|
| Input tokens on the generation call | 45 to 65 percent | Heavily |
| Output tokens on the generation call | 15 to 30 percent | Moderately |
| Reasoning tokens | 0 to 25 percent | Heavily, by routing |
| Embedding at ingestion | 2 to 8 percent | One-time, moderately |
| Embedding at query time | 1 to 3 percent | Barely worth it |
| Reranking | 1 to 4 percent | Usually pays for itself |
| Guardrails and classifiers | 1 to 5 percent | Barely worth it |

Input tokens dominate, which is why prompt construction and retrieval breadth matter more than model choice for most systems. It is also why prefix caching is the single highest-return lever available.

---

## The playbook, ordered by return

### 1. Order the prompt for caching

The cheapest change with the largest effect, and the one most often missed.

Prompt caching matches on prefix. Any variable content early in the prompt invalidates everything after it. A timestamp at position 12 destroys the discount on 14,000 tokens of system prompt and tool schemas.

\`\`\`
Correct order, most stable first:
  1. System instructions
  2. Tool schemas
  3. Few-shot examples
  4. Long-lived facts
  5. Conversation summary
  6. Recent turns
  7. Retrieved evidence
  8. Current user question
\`\`\`

Cached input typically prices at 10 to 50 percent of standard input, and break-even sits at roughly 1.1 to 1.5 reuses. Almost any repeated prefix is worth caching.

**Expected saving on systems with a large stable prefix: 50 to 75 percent of input cost.**

### 2. Route by difficulty

Real traffic is heavily skewed toward easy requests. Running everything at the hardest request's requirement overpays on the majority.

A cascade with a cheap first pass, a confidence check, and escalation to a stronger model on failure typically blends down to 20 to 40 percent of single-tier cost while preserving quality on the hard tail.

The confidence signal is the engineering work. Structural validation failure, reranker score, verifier disagreement, or an explicit escalation tool call all work better than a model's self-reported confidence.

**Expected saving: 40 to 70 percent of generation cost.**

### 3. Turn reasoning on selectively

Extended thinking enabled globally is the fastest way to triple a bill. Reasoning tokens bill at output rates, and output rates are several times input rates.

Measure accuracy against reasoning budget on a golden set split by difficulty. The curve is almost always flat on easy items, which means reasoning on those is pure cost.

**Expected saving: 30 to 60 percent where reasoning was globally enabled.**

### 4. Retrieve less, rank better

A pipeline sending fifteen passages to the generator where five would suffice is paying for ten passages on every request, forever.

A reranker costs 30 to 60 milliseconds and lets you cut the passage count roughly in half at equal or better accuracy. It frequently pays for itself in reduced generation cost alone, before counting the quality improvement.

**Expected saving: 20 to 40 percent of input tokens.**

### 5. Compact the wrapper, not the content

JSON injected into context is largely punctuation and repeated field names. Converting injected records to compact key-value lines or a table typically halves the token count with zero information loss.

This is free quality preservation, unlike summarisation which trades quality for space.

**Expected saving: 10 to 30 percent on systems injecting structured data.**

### 6. Cache responses semantically

A meaningful share of questions have been asked before in different words. A properly scoped semantic cache with a high threshold and entity checks typically serves 20 to 35 percent of traffic at near-zero cost and near-zero latency.

The discipline required is covered in the caching chapter: threshold tuned against measured false positives, entity and negation checks, tenant scoping, and source-version invalidation.

**Expected saving: 20 to 35 percent of total generation cost.**

### 7. Bound the agent

Agent loops are the largest source of cost variance in any system that has them. One request can cost a hundred times another.

Four budgets, all necessary: steps, cumulative tokens, wall clock, and a no-progress detector. Without them, a single non-converging task can consume a meaningful fraction of a daily budget.

**Expected saving: eliminates the tail, which is frequently 30 to 50 percent of agent spend.**

---

## The optimisation sequence

\`\`\`mermaid
---
title: "The Cost Optimisation Sequence"
---
flowchart TD
    A["Cost is too high"] --> B["Instrument first<br/>tokens per segment, per feature, per tenant, per request"]
    B --> C{"Where is the spend"}

    C -->|Input tokens dominate| D["Order prompt for caching"]
    C -->|Output or reasoning dominates| E["Route reasoning by difficulty"]
    C -->|Long tail of expensive requests| F["Bound agent loops"]
    C -->|Flat across everything| G["Build a cascade"]

    D --> H["Measure again"]
    E --> H
    F --> H
    G --> H

    H --> I{"Within budget"}
    I -->|No| J["Reduce retrieved passages<br/>add reranker, compact injected data"]
    J --> K{"Within budget"}
    K -->|No| L["Add semantic caching"]
    L --> M{"Within budget"}
    M -->|No| N["Now consider model change<br/>or self hosting"]
    M -->|Yes| O["Done"]
    K -->|Yes| O
    I -->|Yes| O

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,D,E,F,G,H,J,L process
    class C,I,K,M decision
    class N risk
    class O output
\`\`\`

**Model change is last, not first.** It is the change that requires the most revalidation and it is rarely the largest lever. A system that has not ordered its prompt for caching is leaving more on the table than any model swap will recover.

---

## Self-hosting: the break-even is utilisation, not volume

The spreadsheet that says self-hosting is cheaper usually divides GPU cost by peak throughput. Real systems do not run at peak.

\`\`\`
GPU cost:                  $3.00/hour  =  $2,190/month
Peak throughput:           3,000 tokens/sec
Peak monthly capacity:     ~7.8 billion tokens
Cost at 100% utilisation:  $0.00028 per 1k tokens
Cost at  15% utilisation:  $0.00187 per 1k tokens
\`\`\`

At full utilisation, self-hosting is dramatically cheaper. At 15 percent, which is where most self-hosted deployments actually sit, the advantage largely disappears, and that is before counting engineering time, on-call burden and the cost of an outage.

The honest inputs to the decision:

| Factor | Favours API | Favours self-hosting |
|---|---|---|
| Utilisation | Below 40 percent | Above 60 percent sustained |
| Traffic shape | Spiky | Steady |
| Data residency | No constraint | Constraint exists |
| Team capacity | No ML infrastructure experience | Existing capability |
| Model needs | Frontier capability required | Open weights sufficient |
| Fine-tuning | Not needed | Central to the product |

**Data residency and fine-tuning are better reasons to self-host than cost.** Cost works out only at high sustained utilisation, and the way to get there is usually to consolidate several workloads onto one pool rather than to run one workload on dedicated hardware.

---

## What this looks like in three real systems

### The support platform that cut spend 81 percent without changing models

A SaaS company's assistant cost roughly $38,000 a month across 1.4 million conversations. The proposal on the table was migrating to a cheaper model, which would have required re-tuning every prompt.

Instrumenting per-segment token usage first showed where the money was:

\`\`\`
Per request, average:
  System prompt and tool schemas   9,400 tokens   (identical every call)
  Retrieved passages (15)         11,200 tokens
  Conversation history             3,100 tokens
  User message                       180 tokens
  Output                             340 tokens
\`\`\`

Nine thousand four hundred tokens of identical content on every request, uncached because a session ID sat near the top of the system prompt.

The changes, in the order applied:

| Change | Monthly cost | Cumulative saving |
|---|---|---|
| Baseline | $38,000 | — |
| Move session ID to the end, enable prefix caching | $19,600 | 48 percent |
| Add reranker, cut passages from 15 to 6 | $13,100 | 66 percent |
| Semantic cache at threshold 0.96 with entity checks | $9,800 | 74 percent |
| Cascade: fast tier first, escalate on low confidence | $7,200 | 81 percent |

Model unchanged. Prompts substantively unchanged. Answer accuracy improved by four points, because the reranker and the cascade both improved quality as a side effect.

**The single largest change was moving one line to the bottom of the prompt.**

### The document pipeline where the cascade was the whole story

An insurer processed 50,000 policy documents a month through a frontier model, extracting 22 fields per document. Roughly $61,000 a month.

Analysis of the extraction task showed that most of it was not hard:

| Field group | Count | Nature |
|---|---|---|
| Structured header fields | 9 | Fixed position, printed, high contrast |
| Table values | 7 | Structured, verifiable by arithmetic |
| Free-text clauses | 4 | Requires genuine reading comprehension |
| Anomaly and exception flags | 2 | Requires judgement |

Sixteen of 22 fields were mechanical extraction that a small model handles well, especially with schema constraints and a groundedness check.

\`\`\`mermaid
---
title: "Tiered Document Extraction With Field-Level Retry"
---
flowchart TD
    A["Document"] --> B["Stage 1 fast tier<br/>16 mechanical fields, schema constrained"]
    B --> C["Deterministic validation<br/>format, arithmetic, source string presence"]

    C --> D{"All 16 validated"}
    D -->|Yes| E["Stage 2 workhorse tier<br/>4 clause fields plus 2 judgement fields"]
    D -->|No| F["Retry failed fields on workhorse tier<br/>only the failures, not the document"]

    F --> E
    E --> G["Cross field consistency check"]
    G --> H{"Consistent"}
    H -->|Yes| I["Committed record"]
    H -->|No| J["Human review queue<br/>with the specific conflict"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,C,E,G process
    class D,H decision
    class F,J risk
    class I output
\`\`\`

Monthly cost fell from $61,000 to $9,400. Field-level accuracy rose slightly, because the deterministic validation on the 16 mechanical fields caught errors the single monolithic call had produced and nobody had checked.

Two design points did the work. **Retry only the failed fields**, not the whole document, so a failure costs one field's worth of workhorse-tier tokens rather than a full re-extraction. And **validate with code wherever the field allows it**, which is both free and more reliable than a model checking itself.

### The agent platform where the tail was the bill

A developer tools company offered an agentic assistant. Monthly spend was $47,000 and rising faster than usage.

The distribution explained it:

\`\`\`
Cost per task:
  p50    $0.03
  p90    $0.19
  p99    $4.80
  max   $62.00

Top 1 percent of tasks:  41 percent of total spend
\`\`\`

Tracing the expensive runs showed a consistent pattern: the agent looping, re-reading the same files, re-running the same searches, until it hit a 40-step limit that was the only bound in place.

Four bounds introduced:

| Bound | Value |
|---|---|
| Step budget | 40, unchanged |
| Cumulative token budget per task | 150,000 |
| Wall-clock deadline | 120 seconds |
| No-progress detector | Terminate after 3 iterations with no state change |

The no-progress detector did most of the work. Median steps on previously expensive tasks fell from 38 to 11, because those tasks had been looping rather than working.

\`\`\`
After:
  p50    $0.03    (unchanged)
  p90    $0.17    (unchanged)
  p99    $0.71    (down from $4.80)
  max    $1.90    (down from $62.00)

Monthly spend:  $47,000 -> $21,300
\`\`\`

Task success rate went *up* by two points, because tasks that had been looping to exhaustion now terminated early and escalated with a useful partial result instead of failing after 40 steps.

**In agentic systems, the tail is the bill. Bounding it costs nothing when things work and saves most of the spend when they do not.**

---

## Governance that keeps costs from drifting back

Optimisation without governance decays. Three practices:

**Cost per resolved task on a dashboard someone owns.** Not cost per token, and not an unowned dashboard.

**Budget alerts at page severity.** A runaway agent loop or a caching regression can spend a month's budget in an afternoon. This is one of the few cost alerts that genuinely justifies waking someone.

**A cost line in every AI feature review.** Estimated tokens per request, expected volume, cache reuse rate, and cost per resolved task at projected volume. A feature whose unit economics do not work at scale is better identified before it ships.

And a quarterly re-check of the model tier assignments, because prices fall and capabilities shift, and a cascade tuned nine months ago is tuned for a market that no longer exists.

---

## Failure modes

| Symptom | Cost-engineering cause |
|---|---|
| Cost roughly flat after a model change | Model was never the dominant term |
| Caching enabled but no discount appears | Variable content ahead of stable content |
| Cost per user varies wildly by region | Language token inflation, unmeasured |
| Bill triples with no traffic change | Reasoning enabled globally |
| p99 cost 100x the median | Unbounded agent loops |
| Self-hosting more expensive than the API | Utilisation far below break-even |
| Token spend down, total cost up | Escalation to humans not counted |
| Optimisations decay within two quarters | No ownership, no cost gate in feature review |

---

## The invoice is an architecture review

Cost in AI systems is set by architecture, not by price lists. The largest levers are prompt ordering for cache reuse, difficulty-based routing, reasoning applied selectively, retrieval breadth, and bounded agent loops. All five are available without changing models and without revalidating prompts.

Measure cost per resolved task, because that is the number the business experiences. Instrument before optimising, because the intuition about where spend sits is wrong more often than not. And do the model change last, when the cheaper structural levers are exhausted.

Systems that follow that order routinely reach a fifth of their original spend with better quality than they started with. Systems that start with the model change usually find the invoice barely moved.

---

*This is the final entry in the 30-day blog series. The backlog of the next 45 topics is mapped in the content plan, beginning with training and adaptation.*`,o="/blog/series/ai-systems-track-30.svg",a={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},i="2026-06-30",r=13,c="LLMOps",l=["Cost Engineering","FinOps","Token Economics","Optimization","AI Engineering","LLMOps","Cost Optimization","System Design","Fin Ops"],h=!1,d="AI Systems Track",u="ai-systems-track",p=30,g=30,f={id:"130",slug:e,title:n,excerpt:t,content:s,featuredImage:o,author:a,publishedAt:i,readTime:r,category:c,tags:l,featured:h,series:d,seriesSlug:u,seriesPart:p,seriesTotal:g};export{a as author,c as category,s as content,f as default,t as excerpt,h as featured,o as featuredImage,m as id,i as publishedAt,r as readTime,d as series,p as seriesPart,u as seriesSlug,g as seriesTotal,e as slug,l as tags,n as title};
