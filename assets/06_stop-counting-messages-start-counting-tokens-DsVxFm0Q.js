const m="206",e="stop-counting-messages-start-counting-tokens",t="Stop Counting Messages. Start Counting Tokens",n='"Keep the last 10 messages" feels like a budget. It is really a guess that holds until it does not. Two conversations, both with exactly ten messages in the window:',s=`"Keep the last 10 messages" feels like a budget. It is really a guess that holds until it does not.

Two conversations, both with exactly ten messages in the window:

\`\`\`
Conversation A   ten short exchanges                  ~180 tokens
Conversation B   one message contains a stack trace
                 and a pasted YAML config           ~7,400 tokens
\`\`\`

Same configuration, roughly 40x difference in actual context size. One wastes almost the entire budget, the other overflows the window. The message counter catches neither, because it is measuring the wrong unit.

Token buffer memory replaces the proxy with the measurement: run the real tokenizer, sum the history, evict oldest-first until it fits under a hard ceiling.

It is deliberately unsophisticated. No summarisation, no embeddings, no retrieval. That is the point — it is deterministic, fast, and it is the floor everything else sits on. Summary buffer decides what to keep. Token buffer enforces how much fits.

Five details decide whether it actually holds up.

Pin the tokenizer to the deployed model version. A counter using a different version will be within a few percent, pass every test in staging, and fail at the tail in production. This is a real source of overflow errors and it is close to invisible until it bites.

Reserve output space before allocating input. Fill the input to the window edge, then request a 4,000-token answer, and you get a truncation or a hard error.

Account for message formatting overhead. The API adds tokens per message for role markers and structure. Counting content only undercounts by a few percent, which is about the size of most safety margins.

Evict at message boundaries. Half a message in context is worse than none, because the model will reason from a truncated fragment and you will spend an afternoon working out why.

Emit the count per segment, not just the total. When a system starts overflowing, which segment grew is the entire diagnosis.

\`\`\`
context.tokens.system      6,120
context.tokens.tools       3,880
context.tokens.retrieved   9,440   <- this one grew
context.tokens.history    11,200
context.tokens.reserved    4,000
\`\`\`

Estimation has its place. \`chars / 4\` is fine for capacity planning and sizing a cluster.

It is not fine for enforcement. The gap between a heuristic and a real tokenizer is small in English prose and large in Hindi, in code, in JSON and in anything with long identifiers — which is to say, large in exactly the traffic that overflows.

Estimate to plan, measure to enforce, and not the other way round.

---

## Diagrams

### The eviction loop

\`\`\`mermaid
---
title: "The Token Budget Eviction Loop"
---
flowchart TD
    A["New message"] --> B["Tokenize with the model's own tokenizer<br/>pinned to the deployed version"]
    B --> C["Sum history plus system plus tools"]
    C --> D["Add per message formatting overhead"]
    D --> E["Add safety margin, 2 to 3 percent"]

    E --> F{"Total plus output reserve<br/>over context limit"}
    F -->|No| G["Send to model"]
    F -->|Yes| H["Evict oldest message<br/>at a message boundary"]

    H --> I[("Archive<br/>evicted, not deleted")]
    H --> C

    G --> J["Emit per segment token metrics"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef store fill:#F3F0F8,stroke:#8880AE,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,C,D,E process
    class F decision
    class H risk
    class I store
    class G,J output
\`\`\`

### When to estimate and when to measure

\`\`\`mermaid
---
title: "Estimate to Plan, Measure to Enforce"
---
flowchart TD
    A["Need a token count"] --> B{"What is it for"}

    B -->|Capacity planning| C["Character heuristic<br/>chars divided by 4"]
    B -->|Prompt assembly and eviction| D["Real tokenizer<br/>pinned to model version"]
    B -->|Billing reconciliation| E["Provider usage response<br/>authoritative"]

    C --> F["Acceptable error<br/>10 to 30 percent<br/>much worse on Hindi, code, JSON"]
    D --> G["Exact for that model"]
    E --> H["Exact and auditable"]

    F --> I["Safe: sizing a cluster"]
    F --> J["Unsafe: deciding what to evict"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class C,D,E process
    class B decision
    class F,J risk
    class G,H,I output
\`\`\``,o="/blog/series/agent-memory-lineage-06.svg",i={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},r="2026-07-06",a=3,l="Agent Memory",c=["Token Counting","Context Budget","Agent Memory","Cost","AI Engineering","LLMOps","Agentic AI","Context Engineering","Software Architecture"],d=!1,h="Agent Memory Lineage",u="agent-memory-lineage",g=6,f=30,p={id:"206",slug:e,title:t,excerpt:n,content:s,featuredImage:o,author:i,publishedAt:r,readTime:a,category:l,tags:c,featured:d,series:h,seriesSlug:u,seriesPart:g,seriesTotal:f};export{i as author,l as category,s as content,p as default,n as excerpt,d as featured,o as featuredImage,m as id,r as publishedAt,a as readTime,h as series,g as seriesPart,u as seriesSlug,f as seriesTotal,e as slug,c as tags,t as title};
