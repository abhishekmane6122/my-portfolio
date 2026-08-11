const f="224",e="prompt-caching-the-discount-most-teams-leave-on-the-table",n="Prompt Caching: The Discount Most Teams Leave on the Table",t="One line in the wrong position can cost most of your input bill, and nothing in your stack will tell you.",s=`One line in the wrong position can cost most of your input bill, and nothing in your stack will tell you.

Here is a real example, from an internal coding tool whose spend was three times the projection. Line 12 of the system prompt read:

\`\`\`
"Current time: 2026-08-01T09:14:22Z. Repo: payments-api. Branch: feat/refunds."
\`\`\`

Below it sat 14,000 tokens of coding standards, conventions and 30 tool schemas, all identical on every request.

Prompt caching matches on prefix. A variable line at position 12 invalidates everything after it, so the cache hit rate was zero and had always been zero. No error, no metric, no alert.

Moving those three fields to the bottom of the prompt took an afternoon. Hit rate went to 94 percent and input cost fell by roughly 70 percent.

The economics here are unusually favourable:

\`\`\`
Cache write   small premium over standard input
Cache read    typically 50 to 90 percent discount
Break even    ~1.1 to 1.5 reuses of the prefix
\`\`\`

Break-even at roughly one reuse means almost any repeated prefix is worth caching. When teams miss this, it is never for economic reasons. It is prompt construction.

The ordering rule is basically the whole technique:

\`\`\`
1  System instructions        identical every call
2  Tool schemas               identical per task class
3  Few shot examples          stable
4  Long lived facts           changes slowly
5  Conversation summary       changes at compaction boundaries
6  Recent turns               changes every turn
7  Retrieved evidence         changes every turn
8  Current user question      last
\`\`\`

Most stable first, most variable last. Conveniently this is also what attention wants — recall is strongest at the edges of a long context, so putting the strongest evidence and the question last improves accuracy at the same time. Two independent forces pointing at one ordering.

Four things silently kill a cache hit:

\`\`\`
A timestamp, request ID or user name near the top
Tool schemas reordered non deterministically between calls
JSON serialised with unordered keys
Load balancer routing a follow up turn to a different replica
\`\`\`

That last one deserves its own mention. Session affinity on conversation ID is a real latency optimisation, not just a nicety. One support platform's follow-up TTFT went from around 900 ms to around 120 ms purely by routing turn 2 back to the replica that already held the warm cache.

One metric makes all of this visible:

\`\`\`
cache_hit_rate on the prefix, logged per request
\`\`\`

Without it this failure mode stays invisible indefinitely. With it, it is a one-line dashboard that pays for the instrumentation on day one.

---

## Diagrams

### Prefix ordering decides the hit rate

\`\`\`mermaid
---
title: "Prefix Ordering Decides the Cache Hit Rate"
---
flowchart TD
    subgraph SG1["Broken: 0 percent hit rate"]
    A["Timestamp and branch<br/>changes every call"] --> B["System prompt 9,000"]
    B --> C["Tool schemas 4,000"]
    C --> D["Examples 1,000"]
    D --> E["User question"]
    E --> F["ALL 14,000 tokens reprocessed<br/>every single request"]
    end

    subgraph SG2["Correct: 94 percent hit rate"]
    G["System prompt 9,000"] --> H["Tool schemas 4,000"]
    H --> I["Examples 1,000"]
    I --> J["Retrieved evidence"]
    J --> K["Timestamp and branch"]
    K --> L["User question"]
    L --> M["Only the tail is reprocessed<br/>14,000 tokens read from cache"]
    end

    F --> N["3x projected spend"]
    M --> O["~70 percent input cost reduction<br/>plus lower TTFT"]

    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A,B,C,D,E,F,N risk
    class G,H,I,J,K,L process
    class M,O output
\`\`\`

### Session affinity keeps the cache warm

\`\`\`mermaid
---
title: "Session Affinity Keeps the Prefix Cache Warm"
---
flowchart TD
    A["Turn 2 arrives"] --> B["Router reads conversation ID"]
    B --> C{"Replica holding this conversation<br/>still healthy"}

    C -->|Yes| D["Route to the SAME replica"]
    C -->|No| E["Route to least loaded"]

    D --> F["Prefix cache warm<br/>prefill only the ~400 new tokens"]
    E --> G["Cold cache<br/>prefill the full ~9,400 tokens"]

    F --> H["TTFT ~120 ms"]
    G --> I["TTFT ~900 ms"]

    H --> J["Log cache_hit_rate per request<br/>this is the only way the<br/>failure mode is ever visible"]
    I --> J

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,D,F process
    class C decision
    class E,G,I risk
    class H,J output
\`\`\``,o="/blog/series/production-reality-24.svg",r={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},i="2026-07-24",a=4,l="Inference",c=["Prompt Caching","Cost Optimization","TTFT","Inference","AI Engineering","LLMOps","Performance","System Design"],h=!1,p="Production Reality",d="production-reality",u=24,m=30,y={id:"224",slug:e,title:n,excerpt:t,content:s,featuredImage:o,author:r,publishedAt:i,readTime:a,category:l,tags:c,featured:h,series:p,seriesSlug:d,seriesPart:u,seriesTotal:m};export{r as author,l as category,s as content,y as default,t as excerpt,h as featured,o as featuredImage,f as id,i as publishedAt,a as readTime,p as series,u as seriesPart,d as seriesSlug,m as seriesTotal,e as slug,c as tags,n as title};
