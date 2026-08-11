const g="202",e="buffer-memory-perfect-recall-quadratic-bill",n="Buffer Memory: Perfect Recall, Quadratic Bill",t="The simplest way to give an LLM memory is also the first one everyone writes. Keep a list, append every message, resend the whole list.",s=`The simplest way to give an LLM memory is also the first one everyone writes. Keep a list, append every message, resend the whole list.

\`\`\`python
history.append({"role": "user", "content": msg})
resp = client.chat(messages=[system] + history)
history.append({"role": "assistant", "content": resp})
\`\`\`

Nothing is lost. No compression, no summarisation, no retrieval that can miss. For a prototype it is genuinely hard to beat.

The problem shows up when you look at what the API is actually receiving.

\`\`\`
Turn  1  ->     50 tokens
Turn  5  ->    450 tokens
Turn 20  ->  3,800 tokens
Turn 50  -> 11,000 tokens
\`\`\`

Turn N resends turns 1 through N-1. Per-turn cost grows linearly, so total conversation cost grows quadratically. That is structural, not something you tune away.

On a real invoice this shows up as a distribution problem rather than an average one. A support product averaging 12 turns per conversation is comfortable. The same product where 4 percent of sessions run past 60 turns will find those sessions eating 40 percent of the token budget.

Two things people tend to miss.

The context window is a cliff, not a slope. Cross it and the call fails outright. It fails during the longest conversations, which in most products correlate with the most engaged customers.

Every resent token is also latency. Prefill time is proportional to prompt length, so turn 50 has a visibly longer pause before the first character appears than turn 5 did, on identical hardware.

There is one mitigation that genuinely applies here, and it is routinely left on the table. If the transcript is a stable prefix and only the newest turn changes, prompt caching makes those resent tokens 50 to 90 percent cheaper. Break-even is around 1.1 reuses, so almost any multi-turn conversation clears it easily.

The catch is prompt ordering. Put a timestamp, a session ID or a request ID near the top of the prompt and the prefix changes on every call. Your cache hit rate is zero and nothing errors, so nobody notices.

\`\`\`
Stable first   system, tools, examples, history
Variable last  retrieved context, current user turn
\`\`\`

On a chat product that ordering rule is often worth more than a model upgrade.

Buffer memory plus prefix caching is a defensible design for short and medium sessions. Worth being clear about what it does though: caching bounds the price of unbounded growth. It does not bound the growth - that still needs an eviction strategy, and skipping that step is how a "cheap" design turns into an unbounded one anyway.

---

## Diagrams

### Why the cost is quadratic

\`\`\`mermaid
---
title: "Why Buffer Memory Cost Grows Quadratically"
---
flowchart TD
    A["Turn 1<br/>sends: T1"] --> B["Turn 2<br/>sends: T1 + T2"]
    B --> C["Turn 3<br/>sends: T1 + T2 + T3"]
    C --> D["Turn N<br/>sends: T1 ... TN"]

    D --> E["Per turn cost grows linearly"]
    D --> F["Total conversation cost<br/>grows quadratically"]

    F --> G{"Two ceilings hit"}
    G -->|Budget| H["4 percent of sessions<br/>consume 40 percent of spend"]
    G -->|Context window| I["Hard failure, not degradation"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933

    class A input
    class B,C,D,E process
    class G decision
    class F,H,I risk
\`\`\`

### Prompt ordering decides your cache hit rate

\`\`\`mermaid
---
title: "Prompt Ordering Decides Your Cache Hit Rate"
---
flowchart LR
    subgraph SG1["Broken ordering, 0 percent cache hit"]
    A["Session ID and timestamp"] --> B["System prompt<br/>9,000 tokens"]
    B --> C["Tool schemas<br/>4,000 tokens"]
    C --> D["History"]
    D --> E["All 13,000 tokens<br/>reprocessed every call"]
    end

    subgraph SG2["Correct ordering, 90 percent plus cache hit"]
    F["System prompt<br/>9,000 tokens"] --> G["Tool schemas<br/>4,000 tokens"]
    G --> H["History"]
    H --> I["Session ID and timestamp"]
    I --> J["Only the tail is reprocessed"]
    end

    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A,B,C,D risk
    class E risk
    class F,G,H,I process
    class J output
\`\`\``,o="/blog/series/agent-memory-lineage-02.svg",r={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},a="2026-07-02",i=4,l="Agent Memory",c=["Buffer Memory","Token Cost","Agent Memory","Scaling","AI Engineering","LLMOps","Agentic AI","Cost Optimization","Software Architecture"],h=!1,p="Agent Memory Lineage",u="agent-memory-lineage",d=2,m=30,f={id:"202",slug:e,title:n,excerpt:t,content:s,featuredImage:o,author:r,publishedAt:a,readTime:i,category:l,tags:c,featured:h,series:p,seriesSlug:u,seriesPart:d,seriesTotal:m};export{r as author,l as category,s as content,f as default,t as excerpt,h as featured,o as featuredImage,g as id,a as publishedAt,i as readTime,p as series,d as seriesPart,u as seriesSlug,m as seriesTotal,e as slug,c as tags,n as title};
