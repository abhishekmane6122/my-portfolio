const g="213",e="memory-routing-not-every-message-belongs-in-every-store",n="Memory Routing: Not Every Message Belongs in Every Store",t="Once you have five or six memory stores, a question worth asking is which of them a given turn actually needs. Most systems never ask it, and query all of them every time.",s=`Once you have five or six memory stores, a question worth asking is which of them a given turn actually needs. Most systems never ask it, and query all of them every time.

Here is what that costs, per turn, before the user's message is even read:

\`\`\`
Entity store        150 tokens
Vector archive      200 tokens
Episodic store      250 tokens
Semantic facts      200 tokens
Reflection buffer   150 tokens
------------------------------
                    950 tokens   regardless of relevance
\`\`\`

On "thanks, that worked", all 950 are waste.

Routing works more like an air traffic controller than a broadcast. Look at the message, determine its type and intent, dispatch only to the stores that apply.

Read routing decides what to query before generating:

\`\`\`
"What is my current salary?"           -> entity store          150
"What did we decide last April?"       -> episodic store        250
"How does an index fund work?"         -> vector archive        200
"I'm nervous about volatility"         -> semantic patterns     200
"Thanks, that helps"                   -> none                    0
\`\`\`

Write routing decides what to update afterwards:

\`\`\`
User states a new fact          -> entity + semantic upsert
User states a hard constraint   -> procedural / pinned write
Session ends                    -> episodic write + reflection
Pattern confirmed over sessions -> semantic promotion
Conversational filler           -> no write
\`\`\`

The write half matters as much as the read half, and gets less attention. Writing indiscriminately fills the semantic store with noise that competes with real facts at retrieval time. An unrouted write path degrades every future read.

What this is worth, measured on a developer assistant that added a routing classifier:

\`\`\`
Average memory overhead   1,250 tokens  ->  310 tokens
Turns needing no memory   ~45 percent of traffic
Answer quality            statistically unchanged on a labelled set
Classifier cost           ~30 tokens per turn, fast tier
\`\`\`

Roughly a 75 percent reduction in memory overhead, paid for with a 30-token classifier call.

Two design points worth borrowing.

Treat always-read stores as their own category. Some things should bypass routing entirely — hard constraints, consent flags, safety-relevant preferences. "Never recommend equity products to me" isn't retrieved when it seems relevant; it's injected every turn, unconditionally.

Route on intent rather than keywords. A regex on "last week" catches some temporal queries and misses most. A small classifier over intent categories generalises properly - one of the clearer cases where a 30-token model call beats a heuristic.

The principle isn't specific to memory. A system that queries every backend on every request isn't really an architecture - it's a fan-out with a token bill attached.

---

## Diagrams

### Read and write routing

\`\`\`mermaid
---
title: "Memory Routing: Read and Write Dispatch"
---
flowchart TD
    A["Incoming message"] --> B["Router<br/>classify content type and intent<br/>fast tier, ~30 tokens"]

    B --> C{"READ routing"}
    C -->|Fact question| D[("Entity store")]
    C -->|Past session reference| E[("Episodic store")]
    C -->|General knowledge| F[("Vector archive")]
    C -->|Behavioural pattern| G[("Semantic store")]
    C -->|Conversational filler| H["No retrieval"]

    I[("ALWAYS READ<br/>hard constraints, consent flags<br/>bypasses routing entirely")] --> J["Prompt assembly"]

    D --> J
    E --> J
    F --> J
    G --> J
    H --> J

    J --> K["Model call"]
    K --> L["Response"]

    L --> M{"WRITE routing"}
    M -->|New durable fact| D
    M -->|Hard constraint stated| I
    M -->|Session ended| E
    M -->|Pattern confirmed| G
    M -->|Nothing durable| N["No write"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef store fill:#F3F0F8,stroke:#8880AE,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,J,K process
    class D,E,F,G,I store
    class C,M decision
    class H,L,N output
\`\`\`

### Overhead with and without routing

\`\`\`mermaid
---
title: "Memory Token Overhead With and Without Routing"
---
flowchart LR
    subgraph SG1["Unrouted, query everything"]
    A["Any message"] --> B["Entity 150"]
    A --> C["Vector 200"]
    A --> D["Episodic 250"]
    A --> E["Semantic 200"]
    A --> F["Reflection 150"]
    B --> G["950 tokens every turn<br/>relevant or not"]
    C --> G
    D --> G
    E --> G
    F --> G
    end

    subgraph SG2["Routed by intent"]
    H["Thanks, that helps"] --> I["0 tokens"]
    J["What is my salary"] --> K["Entity only, 150"]
    L["What did we decide in April"] --> M["Episodic plus semantic, 450"]
    N["Novel multi step request"] --> O["All tiers, 950"]
    end

    G --> P["Average 950"]
    I --> Q["Average 310<br/>quality unchanged"]
    K --> Q
    M --> Q
    O --> Q

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A,H,J,L,N input
    class B,C,D,E,F,I,K,M,O process
    class G,P risk
    class Q output
\`\`\``,r="/blog/series/agent-memory-lineage-13.svg",o={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},a="2026-07-13",i=4,l="Agent Memory",c=["Memory Routing","Agent Memory","Write Policy","Architecture","AI Engineering","Agentic AI","LLMOps","Cost Optimization","Software Architecture"],d=!1,h="Agent Memory Lineage",u="agent-memory-lineage",m=13,y=30,p={id:"213",slug:e,title:n,excerpt:t,content:s,featuredImage:r,author:o,publishedAt:a,readTime:i,category:l,tags:c,featured:d,series:h,seriesSlug:u,seriesPart:m,seriesTotal:y};export{o as author,l as category,s as content,p as default,t as excerpt,d as featured,r as featuredImage,g as id,a as publishedAt,i as readTime,h as series,m as seriesPart,u as seriesSlug,y as seriesTotal,e as slug,c as tags,n as title};
