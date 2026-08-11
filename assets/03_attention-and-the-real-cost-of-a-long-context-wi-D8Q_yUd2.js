const g="103",e="attention-and-the-real-cost-of-a-long-context-window",t="Attention and the Real Cost of a Long Context Window",n="Context windows grew from 4,000 tokens to two million in about three years, and a widespread assumption came along for the ride: that a large enough window makes retrieval, memory and...",a=`Context windows grew from 4,000 tokens to two million in about three years, and a widespread assumption came along for the ride: that a large enough window makes retrieval, memory and context management unnecessary. Just put everything in.

The assumption is wrong for three separate reasons, and each one is a different kind of wrong. One is about compute, one is about money, and one is about the model's actual behaviour when the window is full. Understanding the attention mechanism explains all three.

---

## Attention in one paragraph of arithmetic

Every token is projected into three vectors: a query, a key and a value. To decide what a token should attend to, its query is compared against the keys of every other token via a dot product, the scores are scaled and normalised into weights, and those weights are used to produce a weighted sum of the values.

\`\`\`
Attention(Q, K, V) = softmax( Q @ K^T / sqrt(d_k) ) @ V
\`\`\`

The important term is \`Q @ K^T\`. For a sequence of length \`n\`, that is an \`n × n\` matrix. Every token is scored against every other token.

That quadratic term is the origin of every long-context cost problem.

---

## Three reasons long context is not free

### Reason one: prefill compute grows quadratically

Doubling the prompt does not double prefill cost. It roughly quadruples the attention component of it. Feed-forward layers scale linearly, so the total is somewhere between linear and quadratic depending on model shape and sequence length, but the attention term dominates as sequences get long.

Practically, this shows up as time to first token growing much faster than prompt length. A 100,000-token prompt does not take ten times as long as a 10,000-token prompt. It takes considerably more.

Flash Attention changes the memory picture dramatically by never materialising the full \`n × n\` matrix, tiling the computation and recomputing what it needs. It converts memory from quadratic to linear and gives large wall-clock speedups. It does not change the fundamental compute count.

### Reason two: the KV cache grows linearly and it is large

Every token processed leaves behind a key and a value tensor for every layer and every attention head. Those tensors must remain in GPU memory for the whole generation, because every future token attends to them.

For a large model at 128,000 tokens of context, that cache runs to tens of gigabytes per concurrent user. That number is the reason long-context serving is expensive: it is not the compute, it is that each user occupies a large and non-negotiable slice of GPU memory for the duration of their session, which caps concurrency.

Grouped-query attention exists to attack exactly this. Instead of every query head having its own key and value heads, groups of query heads share one key-value pair.

| Scheme | KV heads per query head | Cache reduction | Typical quality cost |
|---|---|---|---|
| Multi-head attention | 1:1 | Baseline | None |
| Grouped-query attention | 8:1 | About 8 times smaller | Under half a percent |
| Multi-query attention | All share 1 | 64 to 128 times smaller | 2 to 3 percent |

Grouped-query attention is now standard on essentially every production model, and it is the reason long-context serving is merely expensive rather than impossible.

### Reason three: the model does not attend evenly across the window

This is the reason that surprises people, because it is a behavioural property rather than a resource constraint.

Retrieval accuracy within a long context is not uniform. Information placed at the beginning and the end of the window is recovered reliably. Information placed in the middle is recovered noticeably less reliably. The effect is consistent enough to have a name, and it persists in models advertised with very large windows.

The practical consequence: filling a two-million-token window with everything you have is not equivalent to retrieving the ten most relevant passages and placing them near the end of the prompt. The second approach frequently produces better answers for less money.

---

## The shape of the tradeoff

\`\`\`mermaid
---
title: "Long Context vs Retrieval: The Decision Path"
---
flowchart TD
    A["Question needs external knowledge"] --> B{"How large is the corpus"}
    B -->|Under 100k tokens and stable| C["Load it all into context"]
    B -->|Large or changing| D["Retrieve then generate"]
    B -->|Large and needs global reasoning| E["Hybrid<br/>retrieve broadly then summarise"]

    C --> F{"Is the prefix identical across requests"}
    F -->|Yes| G["Cache the prefix<br/>large discount on repeat calls"]
    F -->|No| H["Full prefill every call<br/>high TTFT and cost"]

    D --> I["Top k passages<br/>reranked and ordered"]
    I --> J["Place strongest evidence last"]

    E --> K["Map reduce over chunks"]

    G --> L["Answer"]
    H --> L
    J --> L
    K --> L

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class C,D,E,I,J,K,G process
    class B,F decision
    class H risk
    class L output
\`\`\`

The branch that matters most in practice is the prefix-caching one. A long context that is *identical across requests* is cheap on every call after the first. A long context that is *different every time* is expensive on every call. Two systems with the same token count can differ by an order of magnitude in cost purely on this property.

---

## Efficient attention variants, and what each one buys

Several architectural approaches reduce the quadratic burden. They are not interchangeable.

| Variant | Mechanism | What it buys | What it costs |
|---|---|---|---|
| **Sliding window** | Each token attends to a fixed local span | Linear compute | Loses long-range dependencies unless layered |
| **Sparse / strided** | Attend to a structured subset of positions | Linear-ish compute | Pattern must match the data's structure |
| **Flash Attention** | Tiled computation, never materialise the matrix | Large speedup, linear memory | Exact, no quality cost, still quadratic compute |
| **Multi-head latent attention** | Compress KV into a low-rank latent space | Very large cache reduction | Extra projection work per step |
| **Grouped-query attention** | Share KV heads across query heads | 8x smaller cache | Sub-percent quality |

Flash Attention is the one that is unambiguously free: it is mathematically exact and everyone should be running it. The others trade something. Sliding window attention in particular is often combined with a few full-attention layers, so the model retains some global reach while most layers stay cheap.

---

## Position encoding: the thing that decides whether long context works at all

Attention itself is permutation invariant. It has no notion of order. Position information has to be injected, and how it is injected determines how far a model can extrapolate.

Rotary position embedding is the current standard. It encodes position by rotating query and key vectors by an angle proportional to their position, which means the dot product between two tokens naturally depends on their relative distance.

The relevant property for system design: models can be extended beyond their training context length by scaling the rotary frequencies, but quality degrades as the extension factor grows. A model trained at 32,000 tokens and stretched to 128,000 will technically accept the input and will not perform the same as a model trained at 128,000. Advertised context length and *effective* context length are different numbers, and only the second one matters. Verify it on your own data with a retrieval probe before designing around it.

---

## Designing prompts around how attention actually behaves

A handful of rules follow directly from the mechanism.

**Put the instruction where it will be seen.** Beginning or end. Instructions buried in the middle of a large context are the ones that get ignored.

**Order retrieved evidence by relevance, strongest last.** The final positions carry the most reliable attention. Reranking earns its keep here twice: once by filtering, once by ordering.

**Keep the stable prefix first and the variable content last.** This is what makes prefix caching possible. A prompt that puts a timestamp at the top invalidates the cache on every request.

**Prefer fewer, better passages.** Ten strong passages beat forty mediocre ones on both accuracy and cost. Padding the context with weak matches actively hurts, because it dilutes attention across irrelevant text.

**Test the middle.** If a system depends on information landing in the middle of a long prompt, build an eval that specifically probes middle-position recall. It will fail earlier than expected.

---

## What this looks like in three real systems

### A legal team that put the whole contract in the window

A firm reviewing supplier agreements loads each full contract, around 90,000 tokens, and asks a set of compliance questions. It works well on short contracts and starts missing clauses on long ones.

The pattern in the misses is diagnostic: clauses in the first ten pages and the last ten pages are found reliably. Clauses in the middle third are missed roughly a quarter of the time. Nothing is wrong with the model and nothing is wrong with the prompt. The evidence is sitting in the part of the window the model attends to least.

The rebuild that fixed it did not shorten the context. It changed what occupied it: retrieve the eight clauses most relevant to each question, place them immediately before the question, and keep the full document available only as a fallback for questions where retrieval returns nothing confident. Cost dropped by roughly 80 percent and middle-of-document recall went from 74 percent to 96 percent.

### A coding assistant that invalidated its own cache

An internal developer tool assembles a prompt containing coding standards, repository conventions and 30 tool schemas. Roughly 14,000 stable tokens. Then the user's question.

Cost was three times the projection and nobody could explain it. The cause was a single line near the top of the system prompt:

\`\`\`
Current time: 2026-08-01T09:14:22Z. Repository: payments-api. Branch: feat/refunds.
\`\`\`

That line changes on every request. Prompt caching matches on prefix, so a variable line at position 12 invalidated all 14,000 tokens after it. The cache hit rate was zero and had always been zero.

Moving those three fields to the bottom of the prompt, immediately before the user question, took an afternoon. Cache hit rate went to 94 percent and input cost fell by roughly 70 percent.

**Ordering the prompt by stability is not a micro-optimisation. It is frequently the largest single cost lever in a long-context system.**

### A financial analyst tool that outgrew its context

An equity research assistant needs to reason across 400 earnings transcripts. Total corpus is around 12 million tokens. No window holds it.

The design that works is a hierarchy rather than a bigger window: summarise each transcript once at ingestion and index the summaries, retrieve across summaries to find the relevant 15 transcripts, then retrieve specific passages within those. Three levels, each one narrowing the search space, each one running against a window that comfortably fits.

\`\`\`mermaid
---
title: "Hierarchical Retrieval Over a 12M Token Corpus"
---
flowchart TD
    A["Analyst Question"] --> B["Level 1<br/>search 400 transcript summaries"]
    B --> C["Top 15 transcripts"]
    C --> D["Level 2<br/>search passages within those 15"]
    D --> E["Top 20 passages"]
    E --> F["Rerank<br/>strongest evidence last"]
    F --> G["Generation window<br/>stable prefix cached, evidence ordered"]
    G --> H["Answer with transcript citations"]

    I[("Transcript Store<br/>12M tokens total")] --> B
    I --> D

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef store fill:#F3F0F8,stroke:#8880AE,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,C,D,E,F,G process
    class I store
    class H output
\`\`\`

The general lesson: when the corpus outgrows the window, the answer is a hierarchy of narrowing searches, not a larger window. And when it fits in the window, the answer is still usually to curate what goes in.

---

## Failure modes

| Symptom | Attention-related cause |
|---|---|
| Model ignores an instruction that worked at short context | Instruction is now in the middle of a long window |
| TTFT explodes past a certain prompt size | Quadratic prefill, not a network issue |
| Concurrency collapses under long-context traffic | KV cache exhausting GPU memory |
| Quality drops after extending context length | Position extrapolation beyond trained range |
| Prompt caching gives no discount | Variable content placed before stable content |
| Adding more retrieved chunks lowers accuracy | Attention dilution across low-relevance text |

---

## A window is not a strategy

A large context window is a capability, not a strategy. The quadratic term makes it slow to fill, the KV cache makes it expensive to hold, and non-uniform attention makes it unreliable to over-fill.

The systems that use long context well treat it as a scarce, ordered resource: a stable cached prefix, a tightly curated and reranked evidence section, and the instruction placed where the model will actually read it. The systems that use it badly treat it as a bucket.

---

*Next in this series: Embeddings and vector spaces — the geometry behind retrieval.*`,o="/blog/series/ai-systems-track-03.svg",s={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},i="2026-06-03",r=10,l="Inference",c=["Attention","Long Context","Transformers","Scaling","AI Engineering","LLMOps","System Design","Context Engineering","ML Infrastructure"],h=!1,d="AI Systems Track",u="ai-systems-track",p=3,m=30,f={id:"103",slug:e,title:t,excerpt:n,content:a,featuredImage:o,author:s,publishedAt:i,readTime:r,category:l,tags:c,featured:h,series:d,seriesSlug:u,seriesPart:p,seriesTotal:m};export{s as author,l as category,a as content,f as default,n as excerpt,h as featured,o as featuredImage,g as id,i as publishedAt,r as readTime,d as series,p as seriesPart,u as seriesSlug,m as seriesTotal,e as slug,c as tags,t as title};
