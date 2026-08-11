const b="230",e="the-architects-pre-ship-checklist-for-an-ai-feature",t="The Architect's Pre-Ship Checklist for an AI Feature",n="Thirty posts compressed into the questions worth asking before an AI feature goes live. If more than three of these have no answer, it is probably not ready.",s=`Thirty posts compressed into the questions worth asking before an AI feature goes live. If more than three of these have no answer, it is probably not ready.

**CORRECTNESS**
\`\`\`
[ ] 150+ labelled examples, sampled from real traffic, stratified
[ ] Two labellers agree above 80 percent on a 30-item subset
[ ] Dev and test split; test touched rarely
[ ] The target score is agreed and written down
[ ] Code checks used wherever code will do
[ ] Any LLM judge is calibrated against human labels
[ ] Comparisons are paired, with confidence intervals
\`\`\`

**RETRIEVAL** *(if applicable)*
\`\`\`
[ ] context_recall@10 and @1 measured separately
[ ] A lexical channel exists alongside dense
[ ] A reranker is in the pipeline
[ ] Access filters are query constraints, not post-filters
[ ] A confidence threshold triggers a designed refusal
[ ] Source-to-index document counts reconcile on a schedule
\`\`\`

**CONTEXT AND COST**
\`\`\`
[ ] Prompt ordered most-stable-first; cache_hit_rate logged
[ ] Output space reserved before input is allocated
[ ] Token counts emitted per segment, not just total
[ ] A cascade routes easy work to cheap models
[ ] Reasoning budget set per task class, not globally
[ ] Cost tracked per resolved task, per user, per tenant
\`\`\`

**AGENTS** *(if applicable)*
\`\`\`
[ ] Lowest agency level that solves the problem, and you can say why
[ ] Budgets on steps, tokens, wall clock — and a no-progress detector
[ ] Tools return answers, not haystacks
[ ] Error messages name the correction
[ ] Every terminal state produces a useful output
[ ] State checkpointed at every transition
\`\`\`

**SECURITY**
\`\`\`
[ ] Threat model written: what enters context, what can the agent do,
    what is the egress path
[ ] Authorisation against the USER's identity, never a service account
[ ] Actions classified by reversibility, gates at the boundary
[ ] Irreversible steps ordered last
[ ] External links and images not rendered from model output
[ ] Every proposal logged, including refused ones
\`\`\`

**OPERATIONS**
\`\`\`
[ ] Model AND prompt version recorded on every span
[ ] Nested spans, not one flat request timer
[ ] finish_reason logged (truncation is invisible without it)
[ ] Output quality monitored: sampled judging or canary queries
[ ] A named owner for the eval set
[ ] Cost alert at page severity
[ ] Fallback path exercised by real traffic, not just written down
\`\`\`

If you only have time for three, these catch the most:

Can you name the model version that produced yesterday's output?
Does any rule live only in the prompt that should live in code?
Has the fallback path served a real request this month?

That closes the series — fifteen posts on memory, fifteen on production reality. The through-line has been the same throughout: the model is the least interesting component, and almost everything that determines whether it works in production sits around it.

---

## Diagrams

### The pre-ship gate

\`\`\`mermaid
---
title: "The Pre-Ship Gate for an AI Feature"
---
flowchart TD
    A["Feature ready to ship"] --> B{"Correctness"}
    B -->|"No labelled set"| C["BLOCK<br/>nobody knows what working means"]
    B -->|Pass| D{"Retrieval, if applicable"}

    D -->|"Post filtering on access"| E["BLOCK<br/>security finding, not a quality one"]
    D -->|Pass| F{"Context and cost"}

    F -->|"Cache hit rate unknown"| G["BLOCK<br/>likely leaving 50 to 70 percent on the table"]
    F -->|Pass| H{"Agents, if applicable"}

    H -->|"No progress detector"| I["BLOCK<br/>the tail will be your bill"]
    H -->|Pass| J{"Security"}

    J -->|"Service account permissions"| K["BLOCK<br/>escalation path"]
    J -->|"Rule lives only in the prompt"| K
    J -->|Pass| L{"Operations"}

    L -->|"Model version not recorded"| M["BLOCK<br/>quality changes will be unattributable"]
    L -->|"Fallback never exercised"| M
    L -->|Pass| N["SHIP<br/>shadow, then canary, then rollout"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,D,F,H,J,L decision
    class C,E,G,I,K,M risk
    class N output
\`\`\`

### The reference architecture the series describes

\`\`\`mermaid
---
title: "AI Product Reference Architecture"
---
flowchart TD
    A["User request"] --> B["Gateway<br/>auth, rate limit, tenant resolution"]
    B --> C["Input guardrails<br/>PII, injection classifier, scope"]
    C --> D["Router<br/>task class, difficulty, memory tiers needed"]

    D --> E["Context assembler<br/>stable prefix first, evidence last<br/>output space reserved"]

    F[("Memory L2 L3 L4<br/>routed reads and writes")] --> E
    G["Retrieval<br/>hybrid search plus rerank<br/>tenant filter INSIDE the query"] --> E

    E --> H["Model call<br/>tier by difficulty, reasoning by task class"]
    H --> I{"Tool call proposed"}

    I -->|Yes| J["Policy gate<br/>schema, USER authorisation, action class"]
    J --> K["Sandboxed execution<br/>egress allowlist"]
    K --> E

    I -->|No| L["Output guardrails<br/>groundedness, PII, link validation"]
    L --> M["Response, streamed in validated chunks"]

    N[("Trace store<br/>model version, prompt version,<br/>tokens per segment, finish_reason,<br/>cache hit, cost")] --> O["Observability<br/>canary evals, drift, cost per resolved task"]
    B --> N
    E --> N
    H --> N
    J --> N
    L --> N

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef store fill:#F3F0F8,stroke:#8880AE,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,C,D,E,G,H,J,K,L,O process
    class F,N store
    class I decision
    class M output
\`\`\``,r="/blog/series/production-reality-30.svg",o={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},a="2026-07-30",i=4,l="LLMOps",c=["Checklist","Production Readiness","Shipping","Architecture","AI Engineering","Software Architecture","LLMOps","System Design","Agentic AI"],d=!1,h="Production Reality",u="production-reality",p=30,f=30,g={id:"230",slug:e,title:t,excerpt:n,content:s,featuredImage:r,author:o,publishedAt:a,readTime:i,category:l,tags:c,featured:d,series:h,seriesSlug:u,seriesPart:p,seriesTotal:f};export{o as author,l as category,s as content,g as default,n as excerpt,d as featured,r as featuredImage,b as id,a as publishedAt,i as readTime,h as series,p as seriesPart,u as seriesSlug,f as seriesTotal,e as slug,c as tags,t as title};
