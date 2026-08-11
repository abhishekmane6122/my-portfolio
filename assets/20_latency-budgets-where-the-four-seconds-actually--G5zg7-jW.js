const f="220",e="latency-budgets-where-the-four-seconds-actually-go",n="Latency Budgets: Where the Four Seconds Actually Go",t='"The AI feature is slow" is not a diagnosis. Generation runs in two phases with different bottlenecks, and an optimisation for one does nothing for the other.',s=`"The AI feature is slow" is not a diagnosis. Generation runs in two phases with different bottlenecks, and an optimisation for one does nothing for the other.

\`\`\`
PREFILL   processes the whole prompt at once
          compute bound, runs once
          -> this is TIME TO FIRST TOKEN

DECODE    one token per forward pass
          memory bound, strictly sequential
          -> this is TOKENS PER SECOND

Total = TTFT + (TPOT x output_tokens)
\`\`\`

Reporting only total latency hides which one you actually have. Split them and the fix usually becomes obvious.

Here is a real span breakdown from a support widget sitting at 3.1 seconds:

\`\`\`
guardrail input check      40 ms
query rewrite (model)     180 ms
retrieval                 620 ms
  dense search             90 ms
  lexical search           40 ms
  rerank                  480 ms   <- invisible without nested spans
generation              2,180 ms
  TTFT                    900 ms   <- prefill on a 12,200 token prompt
  streaming             1,280 ms
guardrail output check    120 ms
\`\`\`

Two findings in there, neither of which is visible from "retrieval is slow" or "generation is slow".

The 900 ms of TTFT is prefill on a prompt that is 9,000 tokens of identical system instructions. Move the session ID out of the header, enable prefix caching, and TTFT drops to around 250 ms without touching the model.

And 480 of the 620 ms of retrieval is the reranker. Worth keeping, since it is usually the largest accuracy gain available, but it should be scoring 50 candidates rather than 500 and running on a right-sized model.

Sorted by phase, so you stop applying the wrong lever:

\`\`\`
TTFT too high        -> cache the stable prefix
                     -> shorten the prompt, retrieve fewer passages
                     -> chunked prefill so big prompts stop
                        stalling everyone else in the batch

Streaming too slow   -> smaller KV cache (GQA, INT8 cache)
                     -> speculative decoding
                     -> cap max_tokens; the worst case defines your tail

Neither, it queues   -> that is a batching problem, not a model problem
\`\`\`

That last row deserves attention. Queue wait shows up inside TTFT and stays invisible unless you log it as its own field. Latency that is fine in testing and terrible in production is almost always this — testing measured one request against an idle GPU.

Four fields per request make all of the above visible:

\`\`\`
ttft_ms   tpot_ms   queue_wait_ms   input_tokens   output_tokens
\`\`\`

Plot TTFT against input tokens. A clean line means prefill dominates. Flat with spikes means queueing dominates. Two scatter plots will tell you more than a week of intuition.

---

## Diagrams

### The span breakdown you need

\`\`\`mermaid
---
title: "The AI Request Span Breakdown"
---
flowchart TD
    A["Request span<br/>total 3,140 ms"] --> B["Guardrail input<br/>40 ms"]
    A --> C["Query rewrite, model call<br/>180 ms"]
    A --> D["Retrieval<br/>620 ms"]
    A --> E["Generation<br/>2,180 ms"]
    A --> F["Guardrail output<br/>120 ms"]

    D --> G["Dense search 90 ms"]
    D --> H["Lexical search 40 ms"]
    D --> I["Rerank 480 ms"]

    E --> J["TTFT 900 ms<br/>prefill on 12,200 tokens"]
    E --> K["Streaming 1,280 ms<br/>decode at token rate"]

    J --> L["Fix: prefix caching<br/>900 to ~250 ms"]
    I --> M["Fix: cap candidates at 50<br/>right size the reranker"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,C,D,E,F,G,H,K process
    class I,J risk
    class L,M output
\`\`\`

### Which lever, by phase

\`\`\`mermaid
---
title: "Latency Levers by Phase: Prefill, Decode or Queue"
---
flowchart TD
    A["Latency complaint"] --> B["Split TTFT, TPOT and queue wait"]
    B --> C{"Which dominates"}

    C -->|TTFT and it scales with prompt size| D["PREFILL bound"]
    C -->|Total scales with output length| E["DECODE bound"]
    C -->|TTFT flat with spikes| F["QUEUE bound"]

    D --> G["Order prompt for prefix caching"]
    D --> H["Retrieve fewer passages"]
    D --> I["Chunked prefill"]

    E --> J["Smaller KV cache<br/>GQA and INT8"]
    E --> K["Speculative decoding"]
    E --> L["Cap max_tokens"]

    F --> M["Continuous batching"]
    F --> N["Separate pools per workload class"]
    F --> O["Session affinity so the cache stays warm"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B process
    class C decision
    class D,E,F risk
    class G,H,I,J,K,L,M,N,O output
\`\`\``,o="/blog/series/production-reality-20.svg",i={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},a="2026-07-20",r=4,l="Inference",c=["Latency Budget","Performance","TTFT","Streaming","AI Engineering","LLMOps","ML Infrastructure","System Design"],h=!1,u="Production Reality",p="production-reality",d=20,m=30,g={id:"220",slug:e,title:n,excerpt:t,content:s,featuredImage:o,author:i,publishedAt:a,readTime:r,category:l,tags:c,featured:h,series:u,seriesSlug:p,seriesPart:d,seriesTotal:m};export{i as author,l as category,s as content,g as default,t as excerpt,h as featured,o as featuredImage,f as id,a as publishedAt,r as readTime,u as series,d as seriesPart,p as seriesSlug,m as seriesTotal,e as slug,c as tags,n as title};
