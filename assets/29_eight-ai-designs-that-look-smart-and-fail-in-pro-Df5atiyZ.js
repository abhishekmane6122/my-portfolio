const g="229",e="eight-ai-designs-that-look-smart-and-fail-in-production",t="Eight AI Designs That Look Smart and Fail in Production",n="Eight designs that pass a demo comfortably and fail on contact with real traffic. Most of these show up more than once in a career.",o=`Eight designs that pass a demo comfortably and fail on contact with real traffic. Most of these show up more than once in a career.

The agent that should have been a pipeline. If the sequence of steps is identical on every run, there is no decision for an agent to make. One retailer's nightly ETL agent worked 92 percent of the time, and the failing 8 percent skipped validation because a file "looked fine". Rewritten as ordinary code with model calls only where judgement was genuinely required, it went to effectively 100 percent and 95 percent cheaper. The test is whether the sequence varies with the input.

Prompt instructions used as enforcement. "Only approve under $500" is a hint. It belongs in a schema constraint and a server-side check. Every rule that exists only in a prompt will eventually be bypassed by an ambiguous request.

Post-filtering instead of query constraints. Retrieving 20 results and then filtering by tenant means another tenant's content was already in process memory, and you are one filter bug away from a leak. The filter belongs inside the search, injected by the data layer so an unscoped query cannot be written in the first place.

Multi-agent systems split on personas. Researcher, writer, editor — three prompts wearing process boundaries. Each boundary destroys the context that made the output good, and the researcher's nuance never survives an 800-token handoff. Split on parallelism, runtime capability, security boundary or tool count. Not on role.

Retrieval with no confidence threshold. When the corpus does not cover a question, the retriever returns the five least-irrelevant documents and the model writes a confident, well-cited answer about a different system. Users cannot distinguish it from a correct one. A reranker score, a threshold and a designed refusal fix it.

The unbounded agent loop. Turn limits alone are not enough — you also need a token budget across the loop, a wall-clock deadline and a no-progress detector. On one platform the top 1 percent of tasks accounted for 41 percent of total spend, and all of them were looping rather than working.

Fine-tuning to install facts. This produces a model that absorbed the style of your documents and will invent facts in that style. It cannot cite, update or revoke them. Facts are a retrieval problem.

Evaluating on invented examples. A set written from imagination tests the author's assumptions. Sample from production logs, stratify in the real proportions, split dev from test. Otherwise four months of iteration produces a prompt fitted to 60 items and a regression in production.

The through-line across all eight is the same: each one substitutes a probabilistic component for a deterministic one that already worked.

---

## Diagrams

### The eight, and where each one actually belongs

\`\`\`mermaid
---
title: "Eight AI Anti-Patterns and Where Each Belongs"
---
flowchart TD
    A["Anti pattern"] --> B{"What was substituted"}

    B -->|"Code replaced by an agent"| C["1 Agent that should be a pipeline"]
    B -->|"Enforcement replaced by a prompt"| D["2 Rules in the system prompt"]
    B -->|"A constraint replaced by a filter"| E["3 Post filtering tenant data"]
    B -->|"Context replaced by a handoff"| F["4 Multi agent split on personas"]
    B -->|"A signal replaced by an assumption"| G["5 No retrieval confidence threshold"]
    B -->|"A bound replaced by hope"| H["6 Unbounded agent loop"]
    B -->|"Retrieval replaced by weights"| I["7 Fine tuning to install facts"]
    B -->|"Measurement replaced by intuition"| J["8 Invented eval examples"]

    C --> K["Move to: deterministic code"]
    D --> L["Move to: schema plus server side check"]
    E --> M["Move to: filter inside the query"]
    F --> N["Move to: one agent, better tools"]
    G --> O["Move to: reranker score plus refusal"]
    H --> P["Move to: token, clock and progress budgets"]
    I --> Q["Move to: retrieval with citations"]
    J --> R["Move to: stratified sample from logs"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B decision
    class C,D,E,F,G,H,I,J risk
    class K,L,M,N,O,P,Q,R output
\`\`\`

### The agency level test

\`\`\`mermaid
---
title: "The Agency Level Test"
---
flowchart TD
    A["Considering an agent"] --> B{"Does the sequence of steps<br/>vary with the input"}

    B -->|No| C["LEVEL 1 pipeline<br/>deterministic code<br/>model calls only where judgement is needed"]
    B -->|"Only the first choice varies"| D["LEVEL 2 router<br/>one model decision, then fixed"]
    B -->|"Every step varies"| E{"How many steps typically"}

    E -->|"3 to 8"| F["LEVEL 3 tool calling loop"]
    E -->|"5 to 20, knowable structure"| G["LEVEL 4 planning agent"]
    E -->|"Needs delegation across domains"| H{"Why"}

    H -->|"Genuinely parallel work"| I["LEVEL 5 multi agent, justified"]
    H -->|"Different runtime capability"| I
    H -->|"Security boundary"| I
    H -->|"Over 20 tools"| J["Try FILTERING tools first<br/>cheaper than splitting"]
    H -->|"Different personas"| K["NOT a reason to split<br/>stay single agent"]

    C --> L["Use the LOWEST level that solves it<br/>every level up costs determinism,<br/>cost, latency and debuggability"]
    D --> L
    F --> L
    G --> L
    I --> L
    J --> L
    K --> L

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class C,D,F,G,I,J process
    class B,E,H decision
    class K risk
    class L output
\`\`\``,s="/blog/series/production-reality-29.svg",a={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},i="2026-07-29",r=3,l="AI Engineering",c=["Anti-Patterns","Architecture","Production AI","Lessons","AI Engineering","Agentic AI","Software Architecture","System Design","LLMOps"],d=!1,h="Production Reality",p="production-reality",u=29,f=30,m={id:"229",slug:e,title:t,excerpt:n,content:o,featuredImage:s,author:a,publishedAt:i,readTime:r,category:l,tags:c,featured:d,series:h,seriesSlug:p,seriesPart:u,seriesTotal:f};export{a as author,l as category,o as content,m as default,n as excerpt,d as featured,s as featuredImage,g as id,i as publishedAt,r as readTime,h as series,u as seriesPart,p as seriesSlug,f as seriesTotal,e as slug,c as tags,t as title};
