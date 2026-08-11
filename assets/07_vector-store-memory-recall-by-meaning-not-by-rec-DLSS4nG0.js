const g="207",e="vector-store-memory-recall-by-meaning-not-by-recency",n="Vector Store Memory: Recall by Meaning, Not by Recency",t="Six techniques in, and all six select context the same way: by when something was said. Buffer, sliding window, summary, summary buffer, token buffer — every one uses recency as a proxy for...",r=`Six techniques in, and all six select context the same way: by when something was said.

Buffer, sliding window, summary, summary buffer, token buffer — every one uses recency as a proxy for relevance. It is a cheap proxy and it works most of the time. It fails in one specific place: a fact stated at turn 3 and needed at turn 47.

Vector store memory changes the selection criterion. Embed every turn as it happens. At query time, embed the current message, run approximate nearest-neighbour search over the history, and return the top-k by meaning rather than by position. It is the same machinery as RAG, pointed at the conversation's own archive instead of at external documents.

Three things tend to bite within a week of shipping it.

Similarity ignores time, and time usually matters. A decision from last week should outrank a near-identical one from two years ago, and pure cosine similarity has no idea. Production scoring blends three signals:

\`\`\`
score = w1 * cosine_similarity
      + w2 * recency_decay(age)
      + w3 * importance
\`\`\`

Skip this and the system will keep surfacing stale sessions that happen to share vocabulary. It looks like the retriever is broken, but the retriever is doing exactly what it was asked to do.

A retrieved turn reads like an overheard sentence. Pull one message out of a conversation and you get something like:

\`\`\`
"Yeah, go with the second option, but not for the EU accounts."
\`\`\`

Which option, which decision, which accounts? Fluent and unusable. The fix belongs at write time rather than read time: store each turn along with its neighbours, or generate a one-line description of what the exchange was about and prepend it. That costs one cheap model call per turn at ingestion, and it is probably the largest single quality lever in conversational memory.

The failure mode is probabilistic rather than deterministic. A sliding window forgets predictably — you know exactly what is gone. Semantic retrieval might miss, depending on how the question was phrased. That is harder to reason about and considerably harder to test.

Which is why the right architecture is not vector memory instead of a window, it is both:

\`\`\`
Recent thread   sliding window, verbatim, deterministic
Anything older  semantic retrieval over the archive
Critical facts  pinned store, never subject to either
\`\`\`

Three read paths with three different guarantees. Any system that relies on one of them to do all three jobs will fail at whichever job it was not designed for - and that failure will look like a model problem long before anyone checks which store actually answered the question.

---

## Diagrams

### Three read paths, three guarantees

\`\`\`mermaid
---
title: "Three Memory Read Paths, Three Guarantees"
---
flowchart TD
    A["Turn arrives"] --> B["Recent thread<br/>sliding window, verbatim"]
    A --> C{"Does this reference something older"}

    C -->|Yes| D["Embed the query"]
    D --> E["ANN search over archive"]
    F[("Turn Archive<br/>embedded, enriched, timestamped")] --> E
    E --> G["Blended scoring<br/>similarity + recency decay + importance"]
    G --> H["Top k enriched turns"]

    C -->|No| I["Skip retrieval"]

    J[("Pinned Facts<br/>deterministic, always injected")] --> K["Prompt assembly"]
    B --> K
    H --> K
    I --> K

    K --> L["Model call"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef store fill:#F3F0F8,stroke:#8880AE,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,D,E,G,H,K process
    class F,J store
    class C decision
    class I,L output
\`\`\`

### Enrichment at write time is what makes retrieval usable

\`\`\`mermaid
---
title: "Write-Time Enrichment Makes Turns Retrievable"
---
flowchart LR
    A["Raw turn<br/>go with the second option<br/>but not for the EU accounts"] --> B["Enrichment model<br/>fast tier, document cached as prefix"]
    C["Surrounding turns<br/>plus session metadata"] --> B

    B --> D["Context line generated<br/>decision on vendor selection<br/>for the Q3 migration, Acme account"]

    D --> E["Enriched turn<br/>context line plus original text"]
    A --> E

    E --> F["Embed"]
    E --> G["Lexical index"]
    F --> H[("Dense archive")]
    G --> I[("BM25 archive")]

    J["Query: what did we decide about vendors"] --> K["Hybrid search"]
    H --> K
    I --> K
    K --> L["Now retrievable<br/>was invisible before enrichment"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef store fill:#F3F0F8,stroke:#8880AE,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A,C,J input
    class B,D,E,F,G,K process
    class H,I store
    class L output
\`\`\``,s="/blog/series/agent-memory-lineage-07.svg",i={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},o="2026-07-07",a=4,c="Agent Memory",l=["Vector Memory","Semantic Recall","Embeddings","Agent Memory","AI Engineering","Agentic AI","Vector Search","RAG","Software Architecture"],h=!1,d="Agent Memory Lineage",m="agent-memory-lineage",u=7,y=30,p={id:"207",slug:e,title:n,excerpt:t,content:r,featuredImage:s,author:i,publishedAt:o,readTime:a,category:c,tags:l,featured:h,series:d,seriesSlug:m,seriesPart:u,seriesTotal:y};export{i as author,c as category,r as content,p as default,t as excerpt,h as featured,s as featuredImage,g as id,o as publishedAt,a as readTime,d as series,u as seriesPart,m as seriesSlug,y as seriesTotal,e as slug,l as tags,n as title};
