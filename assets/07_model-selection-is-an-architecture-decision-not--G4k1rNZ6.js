const f="107",e="model-selection-is-an-architecture-decision-not-a-preference",t="Model Selection Is an Architecture Decision, Not a Preference",n="Model choice usually gets made in the first week of a project, based on a leaderboard and whatever the team used last time, and then never revisited.",a=`Model choice usually gets made in the first week of a project, based on a leaderboard and whatever the team used last time, and then never revisited. Six months later the system has a cost structure nobody planned, a latency profile nobody wants, and a hard dependency on one vendor that nobody wrote down as a risk.

The choice is not a preference. It is a set of coupled architectural commitments: to a cost curve, a latency budget, a context ceiling, a tool-calling contract, a data residency posture and a deprecation cycle. Treating it as configuration is how those commitments get made by accident.

---

## The dimensions that actually decide it

Capability is one axis of seven. The other six kill more projects.

| Dimension | Question it answers | Why it constrains architecture |
|---|---|---|
| **Capability** | Can it do the task at acceptable quality | Sets whether the feature is possible at all |
| **Cost** | What does a resolved task cost, not a token | Sets the business model |
| **Latency** | TTFT and tokens per second under real load | Sets which UX patterns are available |
| **Context window** | How much can be passed per call | Sets retrieval and memory design |
| **Tool use quality** | Does it call functions reliably over many turns | Sets whether agents are viable |
| **Data residency** | Where do the tokens physically go | Frequently decided by legal before engineering |
| **Operational** | Rate limits, uptime, deprecation cadence | Sets reliability engineering effort |

A model that wins on capability and loses on tool-calling reliability is the wrong model for an agent. A model that wins on cost and cannot meet a 300 ms first-token budget is the wrong model for voice. Neither of those shows up on a benchmark table.

---

## The tiers, and what each is for

Rather than naming specific models, which change every few months, it is more durable to reason in tiers and re-populate them at review time.

**Frontier tier.** Highest capability, highest price, typically the strongest at long-horizon agentic work and complex reasoning. Correct choice for the hardest 5 to 15 percent of requests, and for anything where a wrong answer is expensive.

**Production workhorse tier.** Roughly 80 to 90 percent of frontier quality at 10 to 20 percent of the price. This is where the bulk of production traffic belongs and where most teams should start.

**Fast and cheap tier.** Small models tuned for latency. Correct for classification, routing, extraction, guardrail checks and anything with a tight structural output. Frequently deployed as the first stage of a cascade.

**Open weights tier.** Self-hosted. The reason to pick this is rarely raw cost and almost always control: data residency, no per-token pricing, freedom to fine-tune, and no deprecation imposed from outside. It buys those things with real infrastructure work.

**Specialist tier.** Embedding models, rerankers, vision-first document models, speech models. Not substitutes for a general model, and generally not worth replacing with one.

The mistake is running the entire product on one tier. The frontier tier for classification is money set on fire. The cheap tier for a multi-step agent produces a system that fails in ways that are hard to attribute.

---

## Routing beats choosing

The single highest-leverage pattern here is not picking the right model. It is refusing to pick one.

\`\`\`mermaid
---
title: "Model Cascading: Route by Difficulty, Escalate on Doubt"
---
flowchart TD
    A["Incoming Request"] --> B["Classifier<br/>small fast model or heuristic"]
    B --> C{"Task complexity"}
    C -->|Simple lookup or classification| D["Fast tier model"]
    C -->|Standard generation| E["Workhorse tier model"]
    C -->|Complex reasoning or long horizon| F["Frontier tier model"]

    D --> G{"Confidence acceptable"}
    E --> G
    G -->|Yes| H["Return response"]
    G -->|No| I["Escalate one tier"]
    I --> E
    F --> H

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,D,E,F process
    class C,G decision
    class I risk
    class H output
\`\`\`

Real traffic distributions are heavily skewed. A large share of requests are simple and a small share are hard, and running everything at the hardest request's requirement means overpaying on the majority.

Cascading with escalation typically cuts blended cost by 60 to 80 percent while keeping quality on the hard tail, because the hard tail still reaches the frontier model. The engineering cost is a confidence signal and a routing layer, both of which are modest.

The confidence signal is the part that needs care. Self-reported confidence from a model is weakly calibrated. Better signals in practice: structural validation failure, a verifier model's score, retrieval score distribution, or simply whether the cheap model requested escalation as an explicit tool call.

---

## Cost is not price per token

Comparing models on published input and output pricing is comparing the wrong number. The number that matters is **cost per successfully resolved task**.

\`\`\`
cost per resolved task =
    (input_tokens × input_price + output_tokens × output_price)
    ÷ success_rate
    + retry_cost
    + escalation_cost
    + human_handling_cost × escalation_rate
\`\`\`

A cheaper model with a 70 percent success rate, where the 30 percent failure escalates to a human, is frequently more expensive than a costlier model at 92 percent. The token line goes down and the support line goes up by more.

Two other terms that get omitted:

**Reasoning tokens.** Models that produce extended internal reasoning bill for those tokens. A model advertised at a low output price can produce five times the output tokens for the same visible answer. The effective price is what matters.

**Cached input.** A workload with a large stable prefix and prompt caching enabled can have an effective input price that is a small fraction of the list price. Two models with identical list pricing can differ by a factor of three in real cost purely on cache discount structure and prefix reuse rate.

---

## Evaluating candidates properly

Public benchmarks answer a question nobody in production is asking. They are contaminated, they are averaged over tasks unlike yours, and they measure a static snapshot of a model that gets updated.

The replacement is not complicated.

\`\`\`mermaid
---
title: "Evaluating Model Candidates Against a Golden Set"
---
flowchart TD
    A["Collect 100 to 300 real requests<br/>from logs or user research"] --> B["Label the correct outcome<br/>human, with a written rubric"]
    B --> C["Freeze as the golden set"]
    C --> D["Run every candidate model<br/>identical prompt, identical scaffold"]
    D --> E["Score with the rubric<br/>code checks plus judge plus human sample"]
    E --> F["Record cost and p95 latency per candidate"]
    F --> G{"Meets quality bar"}
    G -->|No| H["Reject or move down the shortlist"]
    G -->|Yes| I{"Meets cost and latency bar"}
    I -->|No| J["Try cascade or caching before rejecting"]
    I -->|Yes| K["Shortlist candidate"]
    J --> E
    K --> L["Shadow deploy on live traffic"]
    L --> M["Compare on production distribution"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,C,D,E,F,J,L process
    class G,I decision
    class H risk
    class K,M output
\`\`\`

The golden set built in the first two steps is the durable asset. It answers the model question today, it answers it again in four months when a new release lands, and it catches regressions when a provider silently updates a model behind a stable name. Every hour spent on it is repaid several times.

"Identical prompt, identical scaffold" in step four deserves emphasis. Prompts that were iteratively tuned against one model will underrate another. Either write a neutral prompt or tune per candidate and disclose that in the comparison, but do not compare a tuned prompt against an untuned one and call it a model result.

---

## Portability and the abstraction question

Vendor lock-in in AI systems is not primarily about the API surface. Chat completion shapes are similar enough that swapping is a small job. The lock-in lives in four less obvious places:

1. **Prompt tuning.** Prompts optimised over months against one model's quirks do not transfer cleanly.
2. **Tool-calling semantics.** Parallel calls, streaming behaviour, schema strictness and error formats differ.
3. **Structured output enforcement.** Guaranteed-schema modes are implemented differently and have different failure behaviour.
4. **Caching structure.** What counts as a cacheable prefix, and the minimum size, varies.

The pragmatic posture is a thin internal interface that covers generation, tool calling and structured output, with provider-specific adapters behind it. Not a heavyweight abstraction that flattens away everything useful. The goal is that swapping a model is a week of eval work, not a quarter of rewriting.

That interface is also what makes multi-provider failover possible, which matters more than most teams expect. Providers have outages. A system with a single hard dependency on one vendor has that vendor's uptime as its ceiling.

---

## Data residency, which frequently decides everything

For regulated workloads this dimension is not a tradeoff, it is a filter applied before any other consideration. Health, financial and public sector work frequently requires that data stay within a jurisdiction, or never leave owned infrastructure at all.

The options, in descending order of control:

- **Self-hosted open weights on owned hardware.** Full control, full operational burden.
- **Self-hosted in a private cloud tenancy.** Most of the control, less of the hardware burden.
- **Provider regional endpoints with contractual guarantees.** Practical for many enterprise cases, requires reading the contract rather than the marketing page.
- **Standard API.** Fine for most workloads, unavailable for some.

Determine this before evaluating capability. Running a three-week model evaluation and then discovering legal will not approve the endpoint is an avoidable waste.

---

## Review cadence

The single most useful operational habit here is treating model choice as a reviewed decision rather than a settled one.

- **Quarterly:** re-run the golden set against current versions of the shortlist. Prices fall, capabilities shift, and a tier can change hands.
- **On every provider release:** check deprecation notices. A model reaching end of life with sixty days' notice is a planned migration or an unplanned incident depending on whether anyone was watching.
- **On every significant cost change:** re-check whether the cascade thresholds are still optimal. A cheaper workhorse tier changes where the escalation boundary should sit.

Write the decision down with its reasons. A decision record that says which dimensions drove the choice makes the next review a thirty-minute job instead of a fresh investigation.

---

## What this looks like in three real systems

### An insurance claims triage that was paying frontier prices for sorting

A general insurer ran every incoming claim through a frontier model. The task: classify the claim type, extract the policy number and incident date, flag potential fraud indicators, and draft an acknowledgement.

Volume was 120,000 claims a month. The bill was roughly what you would expect from running the most expensive available model on every one of them.

Breaking the single call into four stages revealed how little of the work was actually hard:

| Stage | Task | Tier used | Share of volume |
|---|---|---|---|
| 1 | Classify claim type | Fast tier | 100 percent |
| 2 | Extract policy number and date | Fast tier, schema constrained | 100 percent |
| 3 | Draft acknowledgement | Workhorse tier | 100 percent |
| 4 | Fraud indicator analysis | Frontier tier | 9 percent, flagged only |

Stages 1 and 2 are structured extraction with verifiable outputs, which small models do well. Stage 4 is genuinely hard reasoning over inconsistent narrative, and it is the stage where being wrong is expensive, so it stays on the frontier tier. It also only runs on the 9 percent of claims that stage 1 flags as worth examining.

Blended cost fell by roughly 78 percent. Fraud detection accuracy was unchanged, because the hard cases still reached the model that was good at them.

**The pattern generalises: most "AI features" are three cheap tasks and one expensive one glued together, priced as if all four were expensive.**

### The migration that failed because of the prompt, not the model

A content team spent four months tuning prompts against one model. Every quirk, every phrasing that reliably produced the right tone, every workaround for a specific formatting habit.

When a cheaper model appeared at comparable benchmark scores, they swapped the model and quality collapsed. The conclusion drawn in the room was that the cheaper model was worse.

It was not, or at least the test did not show that. The prompt had been overfitted to one model's behaviour. Instructions written to correct quirks the new model did not have were now actively harmful.

The honest comparison requires equal effort on both sides:

\`\`\`mermaid
---
title: "A Fair Model Comparison Needs Equal Prompt Effort"
---
flowchart TD
    A["Golden set<br/>200 labelled real requests"] --> B["Baseline<br/>current model, current prompt"]
    A --> C["Candidate<br/>new model, current prompt"]
    A --> D["Candidate tuned<br/>new model, prompt re-tuned"]

    B --> E["Score with same rubric"]
    C --> E
    D --> E

    E --> F{"Candidate tuned within quality bar"}
    F -->|Yes| G["Compare cost and p95 latency"]
    F -->|No| H["Reject on evidence, not on impression"]

    G --> I["Shadow deploy on live traffic"]
    I --> J{"Production distribution agrees"}
    J -->|Yes| K["Canary then rollout"]
    J -->|No| L["Golden set does not represent traffic<br/>fix the set first"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,C,D,E,G,I process
    class F,J decision
    class H,L risk
    class K output
\`\`\`

The row that matters is D. Comparing an untuned candidate against a heavily tuned baseline is not a model comparison, and it will keep a team on an expensive model for years.

### The healthcare product where residency decided everything

A clinical documentation startup selling into European hospitals ran a six-week model evaluation. Capability, cost, latency, tool use, all measured properly. A clear winner emerged.

Procurement then blocked it. Patient data could not leave the hospital's own infrastructure, which eliminated every hosted API regardless of quality.

The real shortlist had always been open-weights models that could run on-premise, and it was three models long rather than nine. Six weeks of evaluation went into a decision that was already constrained to a set nobody had checked.

The ordering that avoids this:

\`\`\`
1. Residency and compliance filter   -> what is even permitted
2. Latency and context filter        -> what can meet the UX requirement
3. Capability evaluation             -> which of the survivors is good enough
4. Cost comparison                   -> which of the good ones is cheapest
5. Operational review                -> rate limits, deprecation, support
\`\`\`

Filters before evaluation. Every step that eliminates candidates should run before the step that measures them carefully, because measurement is the expensive part.

---

## Failure modes

| Symptom | Model-selection cause |
|---|---|
| Cost per user far above plan | One tier serving all traffic, no cascade |
| Agent loops or calls tools wrongly | Model weak at multi-turn tool use, benchmark did not test it |
| Quality regressed with no code change | Provider updated the model behind a stable alias |
| Cannot meet latency SLO despite optimisation | Model choice incompatible with the UX pattern |
| Migration to a cheaper model failed | Prompts overfitted to the original model |
| Feature blocked at launch | Residency requirement discovered after model choice |

---

## Treat model choice like the architecture decision it is

Model selection sets the cost curve, the latency envelope and the failure surface of everything built on top of it. Made once with a leaderboard, it becomes a constraint nobody chose. Made deliberately, with a golden set and a routing layer, it becomes a knob that can be turned every quarter as the market moves.

The two artefacts that make this possible are small: a labelled evaluation set drawn from real traffic, and a thin internal interface with adapters behind it. Neither takes long to build. Both keep paying out for the life of the system.

---

*Next in this series: Context engineering — designing the window, not the prompt.*`,o="/blog/series/ai-systems-track-07.svg",i={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},r="2026-06-07",s=12,l="AI Engineering",c=["Model Selection","Benchmarks","Cost","Architecture","AI Engineering","LLMOps","System Design","Cost Optimization","AIArchitecture"],d=!1,h="AI Systems Track",u="ai-systems-track",p=7,m=30,g={id:"107",slug:e,title:t,excerpt:n,content:a,featuredImage:o,author:i,publishedAt:r,readTime:s,category:l,tags:c,featured:d,series:h,seriesSlug:u,seriesPart:p,seriesTotal:m};export{i as author,l as category,a as content,g as default,n as excerpt,d as featured,o as featuredImage,f as id,r as publishedAt,s as readTime,h as series,p as seriesPart,u as seriesSlug,m as seriesTotal,e as slug,c as tags,t as title};
