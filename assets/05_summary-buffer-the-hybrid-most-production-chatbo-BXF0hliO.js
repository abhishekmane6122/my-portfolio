const g="205",e="summary-buffer-the-hybrid-most-production-chatbots-actually-run",n="Summary Buffer: The Hybrid Most Production Chatbots Actually Run",t="Think about how you remember a long phone call. The last few sentences come back almost word for word. The first ten minutes come back as gist.",s=`Think about how you remember a long phone call. The last few sentences come back almost word for word. The first ten minutes come back as gist.

That split is not just a quirk of biology, it is also the right engineering answer, and summary buffer memory implements it directly. The context gets two regions:

\`\`\`
[ ROLLING SUMMARY ]          everything older, compressed
[ BUFFER: last k tokens ]    verbatim, exact wording intact
[ CURRENT TURN ]
\`\`\`

Recent turns stay exact because precision matters most for what was just said. A user who says "no, the second one" needs the previous turn verbatim; a summary of it is useless. Older history becomes narrative, because there only the arc matters.

Pure buffer gives you exact recall and compounding cost. Pure summary gives you bounded cost and loses recent nuance. The hybrid keeps the strength of each, which is why most serious chat systems end up here.

Nearly all the engineering is in one parameter: the transition threshold, the point where messages age out of the buffer and into the summary. Set it too high and you pay for verbatim history nobody reads. Set it too low and you lose nuance exactly where nuance is load-bearing.

Four things worth getting right in the implementation.

Measure the buffer in tokens, not messages. "Last 8 messages" varies enormously in actual size depending on whether one of them contains a pasted log.

Summarise incrementally, folding in only the turns that just left the buffer. Regenerating from the full transcript on every eviction is expensive, and it is also where drift accelerates.

Reset from source periodically. Incremental summarisation drifts, so every fifth cycle or so rebuild from the archive. That bounds your worst case permanently.

Reserve output space before you allocate either region. Filling the input to the window edge and then asking for a long answer gets you a truncated response or a hard error. Subtract the reservation first, then split what remains.

A reasonable starting allocation on a 128k window for a chat product:

\`\`\`
System + tools     6,000    stable, cached
Pinned facts         400    never compressed
Rolling summary    2,000    hard cap, triggers reset if exceeded
Verbatim buffer   12,000    the tuning knob
Retrieved context  8,000    if RAG is in the loop
Output reserve     4,000    hard reserve
\`\`\`

Where this still fails quietly is a critical fact stated once, early, that the summariser judges unimportant. Account tier, hard constraints, consent flags. Those never belonged in a summary in the first place — they belong in the pinned block, injected verbatim and immune to compression.

That store is the next layer, and it removes more user-visible frustration than any other single change you can make.

---

## Diagrams

### The two-region context

\`\`\`mermaid
---
title: "Summary Buffer: The Two-Region Context"
---
flowchart TD
    A["Turn N arrives"] --> B{"Buffer over token threshold"}

    B -->|No| C["Append to verbatim buffer"]
    B -->|Yes| D["Evict oldest turns from buffer"]

    D --> E["Incremental summariser<br/>fold ONLY the evicted turns"]
    E --> F["Rolling summary updated"]
    D --> G[("Archive<br/>original turns retained")]

    C --> H["Assemble prompt"]
    F --> H
    I[("Pinned facts<br/>never compressed")] --> H

    H --> J["System and tools, cached prefix"]
    J --> K["Pinned facts, verbatim"]
    K --> L["Rolling summary"]
    L --> M["Verbatim buffer"]
    M --> N["Current turn"]
    N --> O["Model call"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef store fill:#F3F0F8,stroke:#8880AE,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class C,D,E,F,H,J,K,L,M,N process
    class G,I store
    class B decision
    class O output
\`\`\`

### Token budget allocation on a 128k window

\`\`\`mermaid
---
title: "Token Budget Allocation on a 128k Window"
---
flowchart LR
    A["128k context window"] --> B["Reserve output FIRST<br/>4,000 tokens"]
    B --> C["Remaining input budget"]

    C --> D["System and tool schemas<br/>6,000, stable, cacheable"]
    C --> E["Pinned facts<br/>400, never compressed"]
    C --> F["Rolling summary<br/>2,000 hard cap"]
    C --> G["Verbatim buffer<br/>12,000, the tuning knob"]
    C --> H["Retrieved context<br/>8,000, reranked"]
    C --> I["Safety margin<br/>2 to 3 percent"]

    F --> J{"Summary exceeds cap"}
    J -->|Yes| K["Trigger regeneration from archive"]
    J -->|No| L["Proceed"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef store fill:#F3F0F8,stroke:#8880AE,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,C,D,G,H process
    class E,F store
    class I risk
    class J decision
    class K risk
    class L output
\`\`\``,r="/blog/series/agent-memory-lineage-05.svg",o={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},a="2026-07-05",i=3,c="Agent Memory",l=["Summary Buffer","Hybrid Memory","Chatbots","Agent Memory","AI Engineering","Agentic AI","LLMOps","Context Engineering","Software Architecture"],u=!1,h="Agent Memory Lineage",m="agent-memory-lineage",d=5,f=30,p={id:"205",slug:e,title:n,excerpt:t,content:s,featuredImage:r,author:o,publishedAt:a,readTime:i,category:c,tags:l,featured:u,series:h,seriesSlug:m,seriesPart:d,seriesTotal:f};export{o as author,c as category,s as content,p as default,t as excerpt,u as featured,r as featuredImage,g as id,a as publishedAt,i as readTime,h as series,d as seriesPart,m as seriesSlug,f as seriesTotal,e as slug,l as tags,n as title};
