const g="209",e="episodic-memory-what-did-we-decide-on-tuesday",n='Episodic Memory: "What Did We Decide on Tuesday"',s="People do not remember their lives as a flat list of facts. They remember bounded experiences — the meeting where the pivot was decided, the debugging session that ate an afternoon.",t=`People do not remember their lives as a flat list of facts. They remember bounded experiences — the meeting where the pivot was decided, the debugging session that ate an afternoon.

Episodic memory gives an agent the same unit. Not messages, not facts, but episodes with a start, an end, a summary, topic labels and an importance score.

\`\`\`
EPISODE  ep_2026_07_14_a
  span         2026-07-14 09:12 to 09:48
  participants [user, agent]
  topics       [vendor_selection, q3_migration]
  summary      Evaluated three vendors against the migration
               timeline. Selected Vendor B on delivery date.
               Deferred the pricing negotiation.
  decisions    [vendor_b_selected]
  open_items   [pricing_negotiation]
  importance   0.82
  turn_range   [88, 141]
\`\`\`

There are two engineering problems here, and between them they are basically the whole technique.

The first is deciding where an episode ends. Three strategies, and they are not equivalent:

\`\`\`
Session-based   one session = one episode
                simple, correct for most products

Time-based      gap of N minutes starts a new episode
                good for async and long-lived threads

Topic-based     detected subject shift starts a new episode
                needed for long sessions covering
                unrelated ground
\`\`\`

Start session-based. Move to topic-based only once you can point at real sessions where three unrelated subjects got fused into one useless summary.

The second problem is retrieval, and this is where most implementations under-deliver. Episodic memory has a temporal axis, and cosine similarity is blind to it. A useful scorer blends several signals:

\`\`\`
score = w1 * semantic_similarity(query, episode_summary)
      + w2 * recency_decay(episode_age)
      + w3 * importance
      + w4 * explicit_reference_match      # "last Tuesday", "in our March call"
\`\`\`

That fourth term is worth building on its own. When someone asks about "what we discussed last Tuesday", the strongest retrieval signal is a date filter, not an embedding. Parse the temporal reference and query the index directly. Without it, the common failure is that the user asks about last Tuesday and gets a semantically similar session from four months ago, because that one happened to share more vocabulary.

One more thing that separates a good implementation from an adequate one: index and retrieve the summary, and fetch the full transcript only on demand. Injecting whole past sessions into context is how a memory feature quietly becomes the largest line on the token bill.

Episodic memory answers "when did this happen" - it's the wrong tier to reach for when the actual question is "what is currently true," and conflating the two is the most common design mistake in this layer.

---

## Diagrams

### Boundary detection and episode write

\`\`\`mermaid
---
title: "Episode Boundary Detection and Write Path"
---
flowchart TD
    A["Turn stream"] --> B{"Boundary strategy"}

    B -->|Session based| C["Session close event"]
    B -->|Time based| D["Gap over N minutes"]
    B -->|Topic based| E["Topic shift detected<br/>embedding distance over threshold"]

    C --> F["Close current episode"]
    D --> F
    E --> F

    F --> G["Generate episode summary<br/>fast tier model"]
    F --> H["Extract decisions and open items"]
    F --> I["Score importance<br/>decisions made, entities touched, user signals"]

    G --> J[("Episode Index<br/>summary embedded, temporal metadata")]
    H --> J
    I --> J
    F --> K[("Transcript Archive<br/>full turns, fetched on demand only")]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef store fill:#F3F0F8,stroke:#8880AE,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933

    class A input
    class C,D,E,F,G,H,I process
    class B decision
    class J,K store
\`\`\`

### Retrieval: temporal reference beats similarity

\`\`\`mermaid
---
title: "Episodic Retrieval: Temporal Reference Beats Similarity"
---
flowchart TD
    A["Query: what did we decide last Tuesday"] --> B["Temporal reference parser"]
    B --> C{"Explicit date or period found"}

    C -->|Yes| D["Filter episode index by date range<br/>hard constraint, not a score"]
    C -->|No| E["Semantic search over episode summaries"]

    D --> F["Candidate episodes"]
    E --> F

    F --> G["Blended rescoring<br/>similarity + recency decay<br/>+ importance + reference match"]
    G --> H["Top k episode summaries"]

    H --> I{"User asks for detail"}
    I -->|No| J["Inject summaries only<br/>~200 tokens each"]
    I -->|Yes| K["Fetch full transcript for one episode<br/>from archive"]

    J --> L["Prompt assembly"]
    K --> L

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,D,E,F,G,H process
    class C,I decision
    class K risk
    class J,L output
\`\`\``,o="/blog/series/agent-memory-lineage-09.svg",i={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},r="2026-07-09",a=3,d="Agent Memory",c=["Episodic Memory","Timestamps","Agent Memory","Recall","AI Engineering","Agentic AI","LLMOps","Vector Search","Software Architecture"],l=!1,m="Agent Memory Lineage",h="agent-memory-lineage",p=9,u=30,f={id:"209",slug:e,title:n,excerpt:s,content:t,featuredImage:o,author:i,publishedAt:r,readTime:a,category:d,tags:c,featured:l,series:m,seriesSlug:h,seriesPart:p,seriesTotal:u};export{i as author,d as category,t as content,f as default,s as excerpt,l as featured,o as featuredImage,g as id,r as publishedAt,a as readTime,m as series,p as seriesPart,h as seriesSlug,u as seriesTotal,e as slug,c as tags,n as title};
