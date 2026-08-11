const w="203",e="sliding-window-memory-capped-cost-silent-amnesia",n="Sliding Window Memory: Capped Cost, Silent Amnesia",t="The obvious fix for quadratic conversation cost is to stop sending everything. Keep the last N turns, let the oldest fall out as new ones arrive.",s=`The obvious fix for quadratic conversation cost is to stop sending everything. Keep the last N turns, let the oldest fall out as new ones arrive.

\`\`\`
Window = 3

After T3:   [T1][T2][T3]
After T4:       [T2][T3][T4]
After T5:           [T3][T4][T5]
After T6:               [T4][T5][T6]
\`\`\`

Turn 100 now sends the same token count as turn 10. Cost is constant, the window cannot overflow, and it is about four lines of code. For what it costs, that is a lot of problems closed.

The thing to understand before shipping it is what you traded away: the agent has no representation of what it forgot.

A customer states their account tier at turn 2. At turn 15 with a window of 10, that fact simply does not exist. The agent asks again. From inside the system nothing is wrong — knowing something is missing requires a record of the absence, and eviction leaves none. Summarisation at least leaves a compressed trace. A window leaves nothing.

Three implementation details separate a production build from a tutorial one.

Size the window in tokens, not turns. A turn containing a pasted stack trace is 3,000 tokens; a turn containing "yes" is one. "Last 10 turns" has roughly 40x variance in actual size, which means your cost is not really capped and overflow is not really prevented. You have the illusion of a bound.

Evicted should not mean deleted. Naive implementations drop old turns on the floor. Write them to durable storage first - that single decision is what makes recovery possible when the window turns out to have been sized wrong.

Pin the facts that must survive. Some things should never be subject to eviction at all — account tier, verified identity status, stated hard constraints, consent flags, accessibility needs. Extract those into a small structured block and inject it verbatim on every turn. On one banking product that list came to eleven fields and about 200 tokens, and it removed an entire category of complaint.

That points at the general principle: narrative can be compressed, but facts have to be extracted - a summary of "the user mentioned their account tier" is not the same as the account tier being retrievable.

Sliding window plus an archive plus a pinned fact block is a real architecture. Sliding window on its own is a demo that will embarrass you around turn 15.

---

## Diagrams

### The window, the archive and the pinned facts

\`\`\`mermaid
---
title: "Sliding Window With an Archive and Pinned Facts"
---
flowchart TD
    A["New turn arrives"] --> B["Fact extractor<br/>small model, schema constrained"]
    B --> C{"Matches a pinned fact type"}
    C -->|Yes| D[("Pinned Fact Store<br/>never evicted, injected verbatim")]
    C -->|No| E["Append to active window"]

    E --> F{"Window over token budget"}
    F -->|No| G["Keep verbatim"]
    F -->|Yes| H["Evict oldest turn"]

    H --> I[("Archive<br/>durable, searchable")]
    H --> J["Removed from active context"]

    D --> K["Prompt assembly"]
    G --> K
    K --> L["Model call"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef store fill:#F3F0F8,stroke:#8880AE,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,E,G,K process
    class D,I store
    class C,F decision
    class H,J risk
    class L output
\`\`\`

### Turn-based windows do not bound anything

\`\`\`mermaid
---
title: "Turn-Based Windows Do Not Bound Context Size"
---
flowchart LR
    A["Window = last 10 turns"] --> B{"What is in those turns"}

    B -->|Short exchanges| C["~180 tokens<br/>window wastes 98 percent of budget"]
    B -->|One pasted stack trace| D["~7,400 tokens<br/>window overflows"]

    C --> E["Same config, 40x variance"]
    D --> E

    E --> F["Fix: measure the window in tokens<br/>reserve output space first<br/>keep a 2 to 3 percent safety margin"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B decision
    class C,D,E risk
    class F output
\`\`\``,o="/blog/series/agent-memory-lineage-03.svg",i={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},a="2026-07-03",r=3,c="Agent Memory",l=["Sliding Window","Agent Memory","Context Window","Trade-offs","AI Engineering","Agentic AI","LLMOps","Context Engineering","Software Architecture"],d=!1,h="Agent Memory Lineage",u="agent-memory-lineage",p=3,f=30,m={id:"203",slug:e,title:n,excerpt:t,content:s,featuredImage:o,author:i,publishedAt:a,readTime:r,category:c,tags:l,featured:d,series:h,seriesSlug:u,seriesPart:p,seriesTotal:f};export{i as author,c as category,s as content,m as default,t as excerpt,d as featured,o as featuredImage,w as id,a as publishedAt,r as readTime,h as series,p as seriesPart,u as seriesSlug,f as seriesTotal,e as slug,l as tags,n as title};
