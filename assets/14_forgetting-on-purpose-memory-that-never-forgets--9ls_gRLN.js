const f="214",e="forgetting-on-purpose-memory-that-never-forgets-becomes-a-liability",t="Forgetting on Purpose: Memory That Never Forgets Becomes a Liability",n="More memory is not better memory. An agent that remembers everything becomes slower to retrieve from, noisier in its answers, and progressively worse at distinguishing what matters now from...",s=`More memory is not better memory. An agent that remembers everything becomes slower to retrieve from, noisier in its answers, and progressively worse at distinguishing what matters now from what mattered two years ago.

Consider one assistant serving one user for three years:

\`\`\`
500+  conversation turns      vector archive
 36   episode records         episodic store
 20+  semantic facts          fact store
 15+  procedures              skill library
\`\`\`

By year three most of those 500 turns are actively harmful. The market view from 2023 is wrong. The salary is three promotions stale. The question about tax-saving instruments has been answered twenty times since.

Keeping all of it does four things, none of them good:

\`\`\`
Slows retrieval      more vectors to search, worse ANN recall
Adds noise           stale facts compete with current ones in top-k
Wastes storage       linear growth, forever
Surfaces bad advice  outdated context injected as if current
\`\`\`

Forgetting on purpose addresses all four. Worth being precise that this is a different step from time-decay scoring — decay weights old memories lower but still stores them, whereas forgetting removes them.

\`\`\`
                 Temporal decay          Forgetting
Old memories     stored, scored lower    pruned or archived
Mechanism        score weighting         physical eviction
Store size       grows indefinitely      bounded
Storage cost     grows with time         controlled
\`\`\`

There are four strategies, and production systems need more than one of them.

TTL gives each entry a fixed expiry. Deterministic and predictable, and fatal on its own — critical facts like allergies and consent flags must never age out on a schedule.

LRU evicts what hasn't been accessed recently, mirroring OS caches. Same flaw though: a critical fact not retrieved lately isn't the same as a fact that stopped mattering.

Importance-weighted eviction scores each memory on \`f(recency, access_count, explicit_importance, entity_criticality)\` and evicts from the bottom - better, but it requires assigning that score at write time.

A pinned tier sits outside all of the above. Small, explicit, never evicted.

The architecture that works uses all four: pinned first, importance-weighted eviction as the main policy, TTL as a backstop on high-churn categories, and LRU only inside a category where everything is equally replaceable.

One rule applies across all of them. Eviction should be archival, not deletion. Pruned memories move to cold storage and stay retrievable on explicit request. Otherwise the first time a policy turns out to be wrong, the data is gone and there is no path back.

Memory systems can fail in two directions. Everyone plans for forgetting too much. Almost nobody plans for remembering too much.

---

## Diagrams

### The layered forgetting policy

\`\`\`mermaid
---
title: "The Layered Forgetting Policy"
---
flowchart TD
    A["Memory store over budget"] --> B{"Is this entry pinned"}
    B -->|Yes| C["Exempt<br/>allergies, consent, hard constraints"]
    B -->|No| D{"Category has a TTL"}

    D -->|"Yes, expired"| E["Archive by TTL<br/>market views, session notes, search results"]
    D -->|"Yes, not expired"| F["Compute importance score"]
    D -->|No| F

    F --> G["score = f(recency, access_count,<br/>explicit_importance, entity_criticality)"]
    G --> H{"Score below eviction threshold"}
    H -->|No| I["Retain in active store"]
    H -->|Yes| J["Archive"]

    E --> K[("Cold Archive<br/>retrievable on explicit request<br/>NEVER hard deleted")]
    J --> K

    C --> L["Active store<br/>bounded, high signal"]
    I --> L

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef store fill:#F3F0F8,stroke:#8880AE,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class F,G,I process
    class K store
    class B,D,H decision
    class E,J risk
    class C,L output
\`\`\`

### What unbounded memory costs

\`\`\`mermaid
---
title: "What Unbounded Memory Costs Over Three Years"
---
flowchart LR
    A["Year 1<br/>80 turns, 6 facts"] --> B["Year 2<br/>260 turns, 14 facts"]
    B --> C["Year 3<br/>500+ turns, 20+ facts"]

    C --> D["Retrieval latency rises<br/>larger ANN index, worse recall at k"]
    C --> E["Top k fills with stale entries<br/>2023 market view competes with 2026"]
    C --> F["Storage grows linearly, forever"]
    C --> G["Outdated context injected<br/>as if it were current"]

    D --> H{"Fix"}
    E --> H
    F --> H
    G --> H

    H --> I["Bounded active store<br/>plus cold archive<br/>plus a pinned exemption tier"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,C process
    class D,E,F,G risk
    class H decision
    class I output
\`\`\``,r="/blog/series/agent-memory-lineage-14.svg",o={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},i="2026-07-14",a=4,c="Agent Memory",l=["Forgetting","Retention Policy","Agent Memory","Privacy","AI Engineering","Agentic AI","LLMOps","System Design","Software Architecture"],h=!1,d="Agent Memory Lineage",m="agent-memory-lineage",g=14,p=30,u={id:"214",slug:e,title:t,excerpt:n,content:s,featuredImage:r,author:o,publishedAt:i,readTime:a,category:c,tags:l,featured:h,series:d,seriesSlug:m,seriesPart:g,seriesTotal:p};export{o as author,c as category,s as content,u as default,n as excerpt,h as featured,r as featuredImage,f as id,i as publishedAt,a as readTime,d as series,g as seriesPart,m as seriesSlug,p as seriesTotal,e as slug,l as tags,t as title};
