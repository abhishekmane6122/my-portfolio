const f="105",e="the-kv-cache-the-memory-bottleneck-nobody-budgets-for",t="The KV Cache: The Memory Bottleneck Nobody Budgets For",n="Capacity planning for a self-hosted model usually starts and ends with weights. A 70-billion-parameter model at BF16 needs about 140 GB, so two H100s, and the spreadsheet closes.",o=`Capacity planning for a self-hosted model usually starts and ends with weights. A 70-billion-parameter model at BF16 needs about 140 GB, so two H100s, and the spreadsheet closes.

Then the system goes live, concurrency climbs past a dozen users, and it starts returning out-of-memory errors on a GPU that the arithmetic said had room. The missing term is the KV cache. At long context it is frequently larger than the weights themselves.

---

## Why the cache exists

During decode, generating token N requires attending to every previous token, and attention needs the key and value tensors for all of those positions. Recomputing them from scratch on every step would mean a full forward pass over the entire sequence for every single output token. That turns generation from linear work into quadratic work, which nobody wants.

So they get computed once and kept. That's the KV cache: key and value tensors for every token, every layer, every attention head, sitting in GPU memory for the life of the request.

It's a huge win on compute. It's also a memory allocation that scales with context length and concurrent users at the same time, and that second part is what capacity plans keep missing.

---

## The arithmetic

\`\`\`
KV bytes = 2 × layers × sequence_length × kv_heads × head_dim × bytes_per_element
\`\`\`

The leading 2 is for K and V. Working through a large open model at long context:

\`\`\`
layers        = 80
sequence      = 128,000 tokens
kv_heads      = 8   (grouped-query attention)
head_dim      = 128
precision     = BF16 (2 bytes)

2 × 80 × 128,000 × 8 × 128 × 2  ≈  42 GB
\`\`\`

Forty-two gigabytes. Per user. On a card with 80 GB of memory that already holds a chunk of the model weights.

That single number reframes the whole serving problem. Concurrency here isn't a compute question at all. It's a question of how many KV caches fit in memory alongside the weights.

Without grouped-query attention, with 64 KV heads instead of 8, the same calculation gives roughly 336 GB for one user, which is obviously not shippable. Grouped-query attention isn't an optimisation you bolt on later. It's a precondition for long-context serving to work at all.

---

## Where the memory actually goes

\`\`\`mermaid
---
title: "GPU Memory Budget: Weights, Activations and KV Cache"
---
flowchart TD
    A["GPU Memory Budget"] --> B["Model Weights<br/>fixed, known in advance"]
    A --> C["Activations<br/>small, transient"]
    A --> D["KV Cache Pool<br/>everything that is left"]

    D --> E["User 1 cache"]
    D --> F["User 2 cache"]
    D --> G["User N cache"]

    E --> H{"Pool exhausted"}
    F --> H
    G --> H
    H -->|Yes| I["Preempt or Queue<br/>concurrency ceiling reached"]
    H -->|No| J["Admit next request"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef store fill:#F3F0F8,stroke:#8880AE,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,C process
    class D,E,F,G store
    class H decision
    class I risk
    class J output
\`\`\`

The KV cache pool is whatever's left over. Weights are fixed, so every gigabyte the model occupies is a gigabyte concurrent users can't have. Quantized weights matter for exactly this reason, even when quality dips slightly, because shrinking the weights directly buys you concurrency, and that trade is usually worth making.

---

## Four ways to shrink the cache

### Grouped-query attention

Already covered above, and it's architectural: decided when the model is trained, not when it's served. The only lever available at serving time is model selection, and KV head count belongs in that comparison right alongside parameter count.

### KV cache quantization

The cache doesn't have to sit at the same precision as the weights. Dropping K and V to INT8 halves the cache for a minimal quality hit. Dropping to INT4 halves it again, at a cost that's noticeable on some workloads and fine on others.

| Cache precision | Size vs BF16 | Typical quality impact |
|---|---|---|
| BF16 | Baseline | None |
| FP8 | 50 percent | Negligible on most workloads |
| INT8 | 50 percent | Under 1 percent on most benchmarks |
| INT4 | 25 percent | Noticeable on reasoning-heavy tasks |

For long-context workloads this is frequently the highest-leverage single flag in a serving config. It directly doubles concurrency, no code changes required.

### Context length limits

The cache scales linearly with sequence length, which means a system that allows 128,000 tokens simply because the model supports it, while the actual workload never exceeds 16,000, is reserving eight times the memory it needs. Setting the served context limit to the real requirement rather than the model's maximum is concurrency you get for free.

### Eviction and offload

Tiered storage moves cold caches out of GPU memory. Most-recent stays in HBM, older entries move to CPU memory, cold prefixes sit on SSD. Access gets slower the further down the tiers something falls, but a cache sitting on disk beats a request the system can't admit at all.

---

## PagedAttention: fixing the fragmentation problem

Even with a right-sized cache, naive allocation wastes a large fraction of it.

The naive approach reserves a contiguous block sized for the maximum possible sequence length the moment a request arrives, because the cache grows during generation and reallocating mid-stream is expensive. A request that ends up generating 200 tokens has reserved space for 4,096. In practice that's 60 to 80 percent of the pool sitting unused.

PagedAttention borrows the fix from operating system virtual memory. Split the cache into fixed-size blocks, typically 16 tokens each, and let a logical sequence map to a list of physical blocks that don't need to be adjacent. Blocks get allocated on demand as the sequence grows, and that's really the whole idea.

\`\`\`mermaid
---
title: "Contiguous vs Paged KV Cache Allocation"
---
flowchart LR
    subgraph SG1["Naive Contiguous Allocation"]
    A["Request A<br/>reserves 4096 slots"] --> B["Uses 200<br/>3896 wasted"]
    end

    subgraph SG2["Paged Allocation"]
    C["Request A"] --> D["Block 7"]
    C --> E["Block 23"]
    C --> F["Block 4"]
    G["Request B"] --> H["Block 12"]
    G --> I["Block 8"]
    end

    D --> J[("Shared Block Pool<br/>allocate on demand")]
    E --> J
    F --> J
    H --> J
    I --> J

    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef store fill:#F3F0F8,stroke:#8880AE,stroke-width:1px,color:#1F2933
    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933

    class A,B risk
    class C,G input
    class D,E,F,H,I process
    class J store
\`\`\`

There are two consequences here beyond the raw memory saving, and the first one is easy to miss. When several requests share an identical prefix, they can point at the same physical blocks with copy-on-write semantics. Ten users hitting the same 8,000-token system prompt store it once, not ten times. Second, waste drops to under 4 percent, with the remaining loss just the partial block at the end of each sequence.

Memory utilisation improves by a factor of two to four simply by picking a serving engine that implements paged attention. No model change needed.

---

## Prefix caching: the same idea applied across requests

Block sharing generalises further. If the KV tensors for a prefix have already been computed, a new request sharing that prefix can skip prefill for those tokens entirely.

The impact lands on time to first token, and it's large. A request with an 8,000-token system prompt and a 200-token user message goes from prefilling 8,200 tokens down to prefilling 200.

This is the mechanism behind provider-side prompt caching, and the pricing reflects it:

| Provider behaviour | Typical effect |
|---|---|
| Cache write | Small premium over standard input pricing |
| Cache read | Large discount, commonly 50 to 90 percent off input price |
| Break-even | Reuse the prefix roughly 1.1 to 1.5 times |

Break-even sitting close to one reuse is the part worth internalising. Almost any repeated prefix is worth caching, full stop. Teams miss the discount for a boring reason, and it's rarely economics. It's prompt construction. A timestamp, a request ID, a user name near the top of the prompt invalidates the prefix on every single call.

The fix is just ordering. System instructions first, then tool schemas, then few-shot examples, then retrieved context, then the user turn. Most stable content first, most variable content last.

---

## Serving-layer implications

A few decisions follow directly from how the cache behaves in practice.

Routing a follow-up turn to a different replica throws away a warm cache and pays full prefill again, so session affinity matters more than it looks like it should. Sticky routing on conversation ID is a genuine latency optimisation, not a nice-to-have.

Long-context users are expensive neighbours. One user sitting at 128,000 tokens can occupy the memory of ten users at 8,000, and multi-tenant systems that don't account for this will watch one heavy user quietly degrade everyone else. Per-tenant context caps aren't only a cost control here. They're a fairness mechanism.

And preemption beats rejection. When the pool fills, a good scheduler evicts a low-priority request's cache and recomputes it later instead of turning new work away outright. That shows up as an occasional latency spike rather than a hard error, which is almost always the better failure mode to hand a user.

---

## What this looks like in three real systems

### The capacity plan that was wrong by a factor of eight

A team self-hosting a 70B model for an internal assistant sized their cluster like this:

\`\`\`
Weights at BF16:  ~140 GB
Two H100s:         160 GB
Headroom:           20 GB
Expected users:     50 concurrent
\`\`\`

Load testing failed at seven concurrent users.

The missing line was the cache. At their configured 32,000-token context limit, each user's KV cache ran roughly 10.5 GB. Twenty gigabytes of headroom holds one user comfortably, maybe two if nothing else moves.

The rebuilt plan, no hardware change:

| Change | Effect |
|---|---|
| Weights quantized to FP8 | Frees ~70 GB for cache |
| Context limit cut 32k to 8k | Cache per user drops to ~2.6 GB |
| KV cache at INT8 | Cache per user drops to ~1.3 GB |
| Paged allocation | Removes ~60 percent fragmentation waste |

Concurrent users went from seven to over sixty on identical hardware, and not one of those four changes was a model upgrade. All four were memory accounting, the kind of work that never shows up on a roadmap slide but is the actual difference between shipping and not.

### The context limit nobody chose

A document QA product allowed 128,000 tokens because the model supported it. Three months of production traffic told a different story:

\`\`\`
p50   input:   3,100 tokens
p95   input:  11,400 tokens
p99   input:  27,800 tokens
max   input:  61,000 tokens
\`\`\`

Not one request in three months came close to 128,000. The serving configuration reserved cache capacity as though every request might, so concurrency was being set by a scenario that had never once happened.

Dropping the served limit to 32,000, with a clean error and a fallback summarisation path for the rare request above it, roughly quadrupled concurrency. The fallback path fired on 0.02 percent of traffic. Serve the traffic you actually have, not the traffic the model card technically permits.

### The follow-up question that cost as much as the first

A customer service platform routed every turn of a conversation to whichever replica was least loaded. Sensible for stateless services. Expensive here.

Turn one prefilled 9,000 tokens of system prompt plus history. Turn two landed on a different replica and prefilled 9,400 tokens again from cold. Turn three, another replica, 9,800 tokens. Every single turn paid full prefill because nothing kept a conversation on the same machine.

Adding session affinity on conversation ID changed that: turn two now prefills only the 400 new tokens, because the previous 9,000 are already warm in that replica's cache.

\`\`\`mermaid
---
title: "Session Affinity Keeps the Prefix Cache Warm"
---
flowchart TD
    A["Turn 2 arrives"] --> B["Router reads conversation ID"]
    B --> C{"Replica holding this conversation is healthy"}
    C -->|Yes| D["Route to same replica<br/>prefix cache warm"]
    C -->|No| E["Route to least loaded<br/>full prefill, cold"]

    D --> F["Prefill only new tokens<br/>TTFT ~120 ms"]
    E --> G["Prefill full history<br/>TTFT ~900 ms"]

    F --> H["Response"]
    G --> H

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,D,F process
    class C decision
    class E,G risk
    class H output
\`\`\`

Median TTFT on follow-up turns dropped from around 900 ms to around 120 ms. A load balancer setting was the entire fix. Nothing about the model, nothing about the hardware.

---

## Failure modes

| Symptom | KV cache cause |
|---|---|
| Out of memory at low request counts | Cache sized for max context, not actual usage |
| Concurrency ceiling far below expectation | Contiguous allocation fragmenting the pool |
| Prompt caching discount never appears | Variable content placed before stable content |
| Follow-up turns as slow as first turns | No session affinity, warm cache lost on routing |
| Latency spikes with no traffic change | Preemption and cache recomputation under pressure |
| Quality drop after a serving config change | KV cache quantized too aggressively |

---

## Memory is the constraint, not compute

Go back to that spreadsheet from the opening: weights, two H100s, done. It's not wrong, exactly. It's just answering a question nobody was actually asking, because the question that determines whether the system survives contact with real traffic is how many KV caches fit in whatever memory is left over once the weights are loaded.

Four things move that number in a way that has nothing to do with model quality: pick a model with grouped-query attention, quantize the cache, cap context at what the workload actually needs rather than what the model permits, and run a serving engine that pages memory instead of reserving it. Teams that do all four routinely see three to five times the concurrency on hardware they already own.

The KV cache doesn't show up in a model card. It shows up in an incident at 2 a.m. when the twelfth user connects.

---

*Next in this series: Continuous batching and PagedAttention — the economics of GPU serving.*`,s="/blog/series/ai-systems-track-05.svg",a={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},r="2026-06-05",i=12,c="Inference",l=["KV Cache","GPU Memory","Inference","Throughput","AI Engineering","LLMOps","ML Infrastructure","System Design"],h=!1,d="AI Systems Track",u="ai-systems-track",m=5,p=30,g={id:"105",slug:e,title:t,excerpt:n,content:o,featuredImage:s,author:a,publishedAt:r,readTime:i,category:c,tags:l,featured:h,series:d,seriesSlug:u,seriesPart:m,seriesTotal:p};export{a as author,c as category,o as content,g as default,n as excerpt,h as featured,s as featuredImage,f as id,r as publishedAt,i as readTime,d as series,m as seriesPart,u as seriesSlug,p as seriesTotal,e as slug,l as tags,t as title};
