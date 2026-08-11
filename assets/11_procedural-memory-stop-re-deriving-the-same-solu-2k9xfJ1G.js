const g="211",e="procedural-memory-stop-re-deriving-the-same-solution",t="Procedural Memory: Stop Re-Deriving the Same Solution",s="Episodic memory stores what happened. Semantic memory stores what is true. Neither of them stores how to do anything.",n=`Episodic memory stores what happened. Semantic memory stores what is true. Neither of them stores how to do anything.

When an agent solves a multi-step task, the successful action sequence is arguably the most valuable thing it produced, and most systems throw it away. The next similar task gets re-derived from scratch at full reasoning cost, with a fresh opportunity to get it wrong.

Procedural memory is the skill library. Worth noting that a stored procedure is more than a list of steps:

\`\`\`
name           reconcile_payment_discrepancy
signature      task involves a payment amount mismatch
               between the gateway and the ledger
preconditions  [gateway_api_access, ledger_read, period_not_locked]
steps
  1  Pull gateway transactions for the period
  2  Pull ledger entries for the same period
  3  Match on transaction REFERENCE, not amount
  4  Classify unmatched: timing / fee / genuine gap
  5  Draft adjusting entries for genuine gaps only
success_rate   0.91 over 34 uses
last_failure   multi-currency case, step 3 matched wrong currency
last_verified  2026-07-22
\`\`\`

Four of those fields do the real work, and skipping any of them turns the library into a folder of stale notes.

The signature is how retrieval works — you match on task shape, not on similarity across the whole procedure text. Get this wrong and the agent will confidently load a plausible-looking procedure for the wrong problem.

Preconditions get checked before the procedure is applied. This is the guard against the technique's main failure, which is overgeneralisation: a procedure extracted from one context, applied to a superficially similar one where a precondition quietly does not hold.

Success rate is tracked per procedure, per use. A procedure whose rate is falling has drifted out of alignment with the systems it operates on.

Last failure records the specific case that broke it, which is what tells a human whether to fix the procedure or narrow its signature.

Success tracking is what makes the difference between a library and a liability. On one telecom support agent a procedure ran at 0.94 for months. An upstream firmware fix shipped, the rate fell to 0.61 over two weeks, and the procedure was flagged automatically. Nobody had to notice it manually.

Without that tracking, the procedure keeps executing confidently against a world that changed, and the failure surfaces as customer complaints three months later.

The payoff on the same system was concrete: for matched cases, resolution went from 11 tool calls to 4, because the agent stopped rediscovering the diagnostic order every single time.

A skill library with no success tracking is not really memory. It is technical debt that gives instructions.

---

## Diagrams

### Retrieve, guard, apply, score

\`\`\`mermaid
---
title: "Procedural Memory: Retrieve, Guard, Apply, Score"
---
flowchart TD
    A["New task arrives"] --> B["Build task signature<br/>intent, entities, tool domain"]
    B --> C["Match against procedure signatures"]
    D[("Skill Library")] --> C

    C --> E{"Match found"}
    E -->|No| F["Solve from first principles<br/>full reasoning cost"]
    E -->|Yes| G["Check preconditions<br/>deterministic, code enforced"]

    G --> H{"All preconditions hold"}
    H -->|No| I["Reject procedure<br/>log the precondition that failed"]
    H -->|Yes| J["Apply procedure<br/>adapt arguments to this case"]

    I --> F
    J --> K["Execute steps"]
    F --> K

    K --> L{"Outcome"}
    L -->|Success| M["Increment success count<br/>update last_verified"]
    L -->|Failure| N["Record last_failure with the case<br/>decrement rate"]

    M --> D
    N --> D
    F --> O{"Novel solution succeeded"}
    O -->|Yes| P["Extract new procedure<br/>write signature and preconditions"]
    P --> D

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef store fill:#F3F0F8,stroke:#8880AE,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,C,G,J,K,M,P process
    class D store
    class E,H,L,O decision
    class I,N,F risk
\`\`\`

### Success-rate decay is the staleness alarm

\`\`\`mermaid
---
title: "Success-Rate Decay as a Staleness Alarm"
---
flowchart LR
    A["Procedure in service<br/>success rate 0.94"] --> B["Upstream system changes<br/>firmware fix ships"]
    B --> C["Rate falls<br/>0.94 to 0.61 over two weeks"]

    C --> D{"Rate below alert band"}
    D -->|Yes| E["Auto flag for review"]
    D -->|No| F["Continue serving"]

    E --> G{"Diagnosis"}
    G -->|World changed| H["Update steps"]
    G -->|Applied too broadly| I["Narrow the signature"]
    G -->|No longer needed| J["Deprecate"]

    H --> K["Re-enter service<br/>rate counter reset"]
    I --> K
    J --> L["Removed from library"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class F,H,I process
    class B,C,E risk
    class D,G decision
    class K,J,L output
\`\`\``,r="/blog/series/agent-memory-lineage-11.svg",o={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},a="2026-07-11",i=3,c="Agent Memory",l=["Procedural Memory","Skill Registry","Agent Memory","Reuse","AI Engineering","Agentic AI","LLMOps","System Design","Software Architecture"],d=!1,h="Agent Memory Lineage",u="agent-memory-lineage",p=11,m=30,f={id:"211",slug:e,title:t,excerpt:s,content:n,featuredImage:r,author:o,publishedAt:a,readTime:i,category:c,tags:l,featured:d,series:h,seriesSlug:u,seriesPart:p,seriesTotal:m};export{o as author,c as category,n as content,f as default,s as excerpt,d as featured,r as featuredImage,g as id,a as publishedAt,i as readTime,h as series,p as seriesPart,u as seriesSlug,m as seriesTotal,e as slug,l as tags,t as title};
