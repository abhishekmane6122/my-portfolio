const w="201",e="llms-are-stateless-memory-is-your-problem-not-the-models",t="LLMs Are Stateless. Memory Is Your Problem, Not the Model's",s="Something worth getting clear on early, because a lot of design decisions follow from it. An LLM has no memory. Not limited memory — none.",n=`Something worth getting clear on early, because a lot of design decisions follow from it.

An LLM has no memory. Not limited memory — none. Every API call is a pure function: tokens in, tokens out, nothing kept. The model that answered a question 400 milliseconds ago has no record that it happened.

So when a product "remembers" you, that is application code. Someone decided what to store, what to throw away, and what to replay on the next call.

It helps to stop treating this as a model capability and start treating it as a storage architecture, because that is what it is. Once you frame it that way, the design questions become ones you already know how to answer:

- What is the cost model? Replaying full history makes per-conversation cost grow quadratically, not linearly.
- What is the eviction policy? Something has to leave. What, and on what signal?
- What happens when two stores disagree about the user's account tier?
- Is retrieval by recency or by relevance? Those give different answers.
- How do you know a stored fact is still true?

Most teams meet this the same way. The prototype is great at 5 turns. At 40 turns it is either expensive or it has forgotten something important, and usually both in the same week.

There are four tiers worth knowing, and most systems ship with one.

L1, working memory. The context window and KV cache. Under 50 ms. The only thing the model actually sees.

L2, episodic. What happened, with timestamps. Vector store, 100 to 300 ms.

L3, semantic. What is true, regardless of when it was learned. Structured store with deduplication and conflict resolution.

L4, procedural. How to perform a task. Loaded when the task signature matches.

The tier most systems are missing is L3, and it is also the one that removes the most user-visible frustration. "The assistant asked me my account type for the third time" looks like a context window problem. It is almost always a missing fact store.

Over the next fourteen posts I want to walk through the full lineage of agent memory, in the order the techniques were actually invented. Each one exists because the previous one broke somewhere specific, and knowing which break you have is most of the skill.

It starts with the simplest possible answer, which is to keep everything.

That one has a bill attached.

---

## Diagrams

### Why the model has no memory

\`\`\`mermaid
---
title: "LLMs Are Stateless: Your Application Holds the Memory"
---
flowchart TD
    H["YOUR APPLICATION<br/>stores, selects and replays history"] --> A["Turn 1 request<br/>system + turn 1"]
    A --> B["LLM<br/>stateless function"]
    B --> C["Turn 1 response"]
    C --> H
    B --> D["Nothing retained<br/>inside the model"]

    H --> E["Turn 2 request<br/>system + turn 1 + turn 2"]
    E --> F["LLM<br/>same weights, zero recall"]
    F --> G["Turn 2 response"]
    G --> H

    D -.->|"no link exists"| F

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef store fill:#F3F0F8,stroke:#8880AE,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A,E input
    class B,F process
    class C,G output
    class D risk
    class H store
\`\`\`

### The four memory tiers

\`\`\`mermaid
---
title: "The Four Agent Memory Tiers"
---
flowchart TD
    A["Incoming turn"] --> B["L1 WORKING<br/>context window and KV cache<br/>under 50 ms"]

    B --> C{"What does this turn need"}
    C -->|References the past| D[("L2 EPISODIC<br/>vector store with timestamps<br/>100 to 300 ms")]
    C -->|Mentions a known entity| E[("L3 SEMANTIC<br/>structured facts, deduped<br/>200 to 500 ms")]
    C -->|Matches a known task| F[("L4 PROCEDURAL<br/>skill registry<br/>loaded on match")]
    C -->|Pure conversation| G["No retrieval"]

    D --> B
    E --> B
    F --> B
    G --> B

    B --> H["Model call"]
    H --> I["Response"]

    I --> J{"Anything durable produced"}
    J -->|New fact| E
    J -->|Session ended| D
    J -->|Task succeeded| F
    J -->|Nothing| K["No write"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef store fill:#F3F0F8,stroke:#8880AE,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,H process
    class D,E,F store
    class C,J decision
    class G,I,K output
\`\`\``,o="/blog/series/agent-memory-lineage-01.svg",r={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},a="2026-07-01",i=3,l="Agent Memory",c=["Stateless LLM","Agent Memory","Architecture","Context","AI Engineering","Agentic AI","LLMOps","System Design","Software Architecture"],h=!1,m="Agent Memory Lineage",d="agent-memory-lineage",u=1,p=30,g={id:"201",slug:e,title:t,excerpt:s,content:n,featuredImage:o,author:r,publishedAt:a,readTime:i,category:l,tags:c,featured:h,series:m,seriesSlug:d,seriesPart:u,seriesTotal:p};export{r as author,l as category,n as content,g as default,s as excerpt,h as featured,o as featuredImage,w as id,a as publishedAt,i as readTime,m as series,u as seriesPart,d as seriesSlug,p as seriesTotal,e as slug,c as tags,t as title};
