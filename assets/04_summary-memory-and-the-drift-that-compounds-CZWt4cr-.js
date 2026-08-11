const f="204",e="summary-memory-and-the-drift-that-compounds",t="Summary Memory and the Drift That Compounds",s="If dropping old turns loses too much, the next idea is to compress them instead. When history crosses a threshold, a second model call summarises the oldest turns and the raw turns are...",n=`If dropping old turns loses too much, the next idea is to compress them instead. When history crosses a threshold, a second model call summarises the oldest turns and the raw turns are replaced by that summary.

Cost stays bounded, and unlike a sliding window the agent keeps the arc of the session. It is a good technique. It also has a failure mode that gets worse the longer the system runs and produces no error at any point.

The issue is that each cycle summarises a summary. Here is one fact moving through four compaction cycles in a long research session:

\`\`\`
Turn  8 (original):  "We're planning a trial for the compound next quarter."
Turn 19 (summary 1): "A trial is underway for the compound."
Turn 31 (summary 2): "Trial results for the compound were discussed."
Turn 45 (summary 3): "The compound showed efficacy in trial."
\`\`\`

No single step made a large error. Each made a small one, and each subsequent step treated the previous error as source material. By turn 45 the context asserts a finding that never existed. It reads well, it cites nothing, and nothing in the stack flagged it.

Three mitigations, roughly in order of how much they buy you.

Anchor facts outside the summary. Identifiers, numbers, stated constraints and decisions go into a structured store that is never compressed. The summary carries narrative, the store carries truth, and on conflict the store wins. This is the highest-return change of the three.

Regenerate from source rather than from the previous summary. Every fifth compaction or so, rebuild from the archived original turns instead of incrementally updating. It costs more per event and it resets accumulated drift to zero, which bounds your worst case permanently.

Probe for it. Keep ten questions whose answers you know from the original transcript, ask them against the compacted context every ten turns, and score them. A drop in accuracy is drift, made visible. Almost nobody builds this, and it is the only mechanism by which you would find out before a user does.

The principle underneath all three is not really about LLMs. Any lossy transformation applied recursively to its own output needs either a periodic reset from ground truth or a measurement that detects divergence, preferably both.

If your system compacts context and you have not checked which of these three it does, that is the next thing to check - not whether it summarizes well, but whether it can tell you when the summary has quietly become wrong.

---

## Diagrams

### How drift compounds

\`\`\`mermaid
---
title: "How Summarisation Drift Compounds"
---
flowchart TD
    A["Turn 8 original<br/>a trial is PLANNED"] --> B["Compaction 1<br/>summarise turns 1 to 12"]
    B --> C["Summary v1<br/>a trial is UNDERWAY"]

    C --> D["Compaction 2<br/>summarise v1 plus turns 13 to 24"]
    D --> E["Summary v2<br/>trial RESULTS discussed"]

    E --> F["Compaction 3<br/>summarise v2 plus turns 25 to 38"]
    F --> G["Summary v3<br/>compound showed EFFICACY"]

    G --> H["Model answers from v3<br/>confident, fluent, false"]

    A -.->|"ground truth never re-read"| G

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933

    class A input
    class B,D,F process
    class C,E,G,H risk
\`\`\`

### Bounding drift with anchors, resets and probes

\`\`\`mermaid
---
title: "Bounding Drift With Anchors, Resets and Probes"
---
flowchart TD
    A["Turn stream"] --> B["Claim extractor"]
    B --> C[("Fact Store<br/>typed, sourced by turn number<br/>NEVER summarised")]
    A --> D["Archive of original turns"]

    A --> E{"History over budget"}
    E -->|Yes| F{"Compaction count mod 5"}
    F -->|Not zero| G["Incremental summarise<br/>previous summary plus new turns"]
    F -->|Zero| H["Regenerate from archive<br/>drift resets to zero"]

    D --> H
    G --> I["Active summary"]
    H --> I

    C --> J["Prompt assembly<br/>facts injected verbatim<br/>summary provides narrative"]
    I --> J

    J --> K{"Drift probe due"}
    K -->|Yes| L["Ask 10 known-answer questions<br/>score against ground truth"]
    K -->|No| M["Model call"]
    L --> N{"Accuracy dropped"}
    N -->|Yes| H
    N -->|No| M

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef store fill:#F3F0F8,stroke:#8880AE,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,G,H,I,J,L process
    class C,D store
    class E,F,K,N decision
    class M output
\`\`\``,r="/blog/series/agent-memory-lineage-04.svg",o={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},a="2026-07-04",i=3,c="Agent Memory",u=["Summary Memory","Context Drift","Agent Memory","Compression","AI Engineering","Agentic AI","LLMOps","Context Engineering","System Design"],m=!1,l="Agent Memory Lineage",h="agent-memory-lineage",d=4,p=30,y={id:"204",slug:e,title:t,excerpt:s,content:n,featuredImage:r,author:o,publishedAt:a,readTime:i,category:c,tags:u,featured:m,series:l,seriesSlug:h,seriesPart:d,seriesTotal:p};export{o as author,c as category,n as content,y as default,s as excerpt,m as featured,r as featuredImage,f as id,a as publishedAt,i as readTime,l as series,d as seriesPart,h as seriesSlug,p as seriesTotal,e as slug,u as tags,t as title};
