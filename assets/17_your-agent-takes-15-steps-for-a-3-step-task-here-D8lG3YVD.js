const f="217",e="your-agent-takes-15-steps-for-a-3-step-task-here-is-how-to-debug-it",t="Your Agent Takes 15 Steps for a 3-Step Task. Here Is How to Debug It",n="When an agent takes fifteen steps for a three-step task, the instinct is to blame reasoning and reach for a bigger model.",s=`When an agent takes fifteen steps for a three-step task, the instinct is to blame reasoning and reach for a bigger model. Nine times out of ten it is a tools problem or a state problem, and one trace will tell you which in about two minutes.

The method is simple. Read a bad trace and put every step into exactly one bucket:

\`\`\`
PROGRESS     produced information the agent did not have
REDUNDANT    re-fetched something already in context
EXPLORATORY  searching for a capability or a schema
RECOVERY     retrying after an error
NOISE        no effect on the outcome
\`\`\`

The distribution is the diagnosis, and there are four common shapes.

Mostly exploratory means the agent is spending turns discovering what it can do.

\`\`\`
turn 1:  list_tables       -> 400 names, 3,000 tokens
turn 4:  describe sales    -> 60 columns
turn 7:  describe customer -> 40 columns
turn 11: list_tables       -> the same 3,000 tokens again
\`\`\`

The cause is tools that return haystacks. A \`list_tables\` returning 400 names forces a multi-turn search. Replace discovery with retrieval: \`find_relevant_tables(description)\` returning the five that matter ends the exploration in one call.

Mostly redundant means the agent is re-reading what it already read - usually because state is a raw transcript, so by turn 8 the useful conclusions are buried under 16,000 tokens of tool output. Strip stale output once extracted, and keep an explicit progress record instead of re-deriving it.

\`\`\`
Before: 16,000 tokens of accumulated tool dumps
After:    400 tokens of structured state

GOAL:     fix failing test in refund_test.py
PROGRESS: located assertion line 84
          root cause: amount not rounded before compare
          edit applied to refund.py line 31
OPEN:     tests not re-run
LAST OUT: ...200 tokens...
\`\`\`

Mostly recovery means errors that do not explain themselves.

\`\`\`
Bad:   Error: 400 Bad Request
Good:  Error: customer_id 'j@x.com' is invalid.
       IDs look like 'C-12345'. Use resolve_customer(email=...) first.
\`\`\`

The second one contains the fix. Agents recover well from errors that were written for a reader.

Oscillation looks like A, B, A, B. By turn 14 the failures at turns 12 and 13 are no longer salient in a long context, so the agent rediscovers the same two dead ends. The fix is an attempt register injected near the end of the context, where attention is reliable:

\`\`\`
ATTEMPTED AND FAILED (do not repeat)
  search_internal("competitor pricing")  -> 0 results, x2
  search_web("competitor pricing")       -> paywalled, x2
UNTRIED
  analyst_reports, filings_db, sales_notes
\`\`\`

On one research agent, that register combined with oscillation detection took median turns on hard queries from 40, which was the budget ceiling, down to 9.

The model was never the problem. It just could not see what it had already done.

---

## Diagrams

### The trace triage tree

\`\`\`mermaid
---
title: "Agent Trace Triage: Four Patterns, Four Fixes"
---
flowchart TD
    A["Agent takes too many steps"] --> B["Classify every step in one trace"]
    B --> C{"Dominant category"}

    C -->|EXPLORATORY| D["Tools return haystacks"]
    C -->|REDUNDANT| E["State is a raw transcript"]
    C -->|RECOVERY| F["Errors do not explain the fix"]
    C -->|"Oscillating A B A B"| G["Failure history buried in context"]

    D --> H["Replace discovery tools with<br/>retrieval tools that return the answer"]
    E --> I["Strip stale output, maintain<br/>an explicit progress record"]
    F --> J["Rewrite error messages<br/>to name the correction"]
    G --> K["Attempt register near end of context<br/>plus oscillation detection"]

    H --> L["Re measure steps to completion"]
    I --> L
    J --> L
    K --> L

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,H,I,J,K process
    class C decision
    class D,E,F,G risk
    class L output
\`\`\`

### Non-convergence detection with escalating intervention

\`\`\`mermaid
---
title: "Non-Convergence Detection With Escalating Intervention"
---
flowchart TD
    A["Iteration completes"] --> B["Action signature<br/>tool name plus normalised args"]
    B --> C{"Signature seen before"}
    C -->|Yes| D["Repetition detected"]
    C -->|No| E["Hash meaningful state"]

    E --> F{"State unchanged for N iterations"}
    F -->|Yes| G["Stagnation detected"]
    F -->|No| H{"Cycle of length 2 or 3 in history"}

    H -->|Yes| I["Oscillation detected"]
    H -->|No| J["Continue"]

    D --> K{"Intervention count"}
    G --> K
    I --> K

    K -->|First| L["Inject nudge<br/>list what was tried and failed"]
    K -->|Second| M["Restrict the repeated tool<br/>force a strategy change"]
    K -->|Third| N["Terminate and escalate<br/>with the full loop trace"]

    L --> J
    M --> J

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,E,L,M process
    class C,F,H,K decision
    class D,G,I,N risk
    class J output
\`\`\``,o="/blog/series/production-reality-17.svg",r={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},a="2026-07-17",i=4,l="Agentic AI",c=["Debugging","AI Agents","Step Count","Tool Use","Agentic AI","AI Engineering","LLMOps","Software Architecture"],d=!1,u="Production Reality",h="production-reality",p=17,g=30,m={id:"217",slug:e,title:t,excerpt:n,content:s,featuredImage:o,author:r,publishedAt:a,readTime:i,category:l,tags:c,featured:d,series:u,seriesSlug:h,seriesPart:p,seriesTotal:g};export{r as author,l as category,s as content,m as default,n as excerpt,d as featured,o as featuredImage,f as id,a as publishedAt,i as readTime,u as series,p as seriesPart,h as seriesSlug,g as seriesTotal,e as slug,c as tags,t as title};
