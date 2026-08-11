const m="106",e="continuous-batching-and-the-economics-of-gpu-serving",t="Continuous Batching and the Economics of GPU Serving",n="The cost of an AI feature is not set by the model. It is set by how many requests a GPU can serve per second, and that number varies by a factor of ten or more depending on decisions made...",s=`The cost of an AI feature is not set by the model. It is set by how many requests a GPU can serve per second, and that number varies by a factor of ten or more depending on decisions made in the serving layer.

Two teams can run the same open-weights model on the same hardware and see completely different unit economics. The difference is almost never the model. It is batching, memory management and scheduling.

---

## Why batching exists at all

During decode, the GPU is memory-bound. Each step loads the model weights out of high-bandwidth memory, performs a small amount of arithmetic against a single token, and writes a result. The arithmetic units sit mostly idle while the memory bus does the work.

The weights get loaded regardless of whether one sequence or sixty-four sequences are being processed. So processing sixty-four sequences in the same step costs barely more than processing one.

That is the entire economic argument for batching: **decode is memory-bound, so batch size is close to free throughput** until the batch gets large enough to become compute-bound or memory-capacity-bound.

The problem is that requests do not arrive in convenient groups.

---

## Static batching and why it fails

The obvious implementation waits for a fixed number of requests, runs them together, and returns all results when the longest one finishes.

\`\`\`
Batch of 4:
  Request A: 20 output tokens   -> finishes at step 20, then waits
  Request B: 500 output tokens  -> finishes at step 500
  Request C: 35 output tokens   -> finishes at step 35, then waits
  Request D: 60 output tokens   -> finishes at step 60, then waits

All four return at step 500.
\`\`\`

Three of four requests sit completed and idle for hundreds of steps, holding GPU memory and doing nothing. Their slots cannot be reused, and the user waits. Utilisation collapses because output lengths in real traffic vary enormously.

Static batching works for offline jobs with uniform inputs. For interactive traffic it is close to worst case.

---

## Continuous batching

The fix operates at the iteration level rather than the request level. After every single decode step, the scheduler checks which sequences finished, evicts them, and admits waiting requests into the freed slots.

\`\`\`mermaid
---
title: "Continuous Batching: Iteration-Level Scheduling"
---
flowchart TD
    A["Request Queue"] --> B{"Free slot in batch"}
    B -->|Yes| C["Admit request<br/>run its prefill"]
    B -->|No| D["Wait in queue"]
    C --> E["Active Batch"]
    E --> F["One decode step<br/>all sequences advance together"]
    F --> G{"Any sequence hit stop"}
    G -->|Yes| H["Evict finished<br/>return response"]
    G -->|No| F
    H --> B
    D --> B

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class C,E,F process
    class B,G decision
    class D risk
    class H output
\`\`\`

The loop between the decode step and the eviction check is where the throughput comes from. A slot freed at step 21 is filled at step 22. No sequence waits on any other sequence.

Reported throughput improvements over static batching commonly land in the range of 10 to 20 times on realistic traffic with mixed output lengths. That is not a tuning gain. That is the difference between one GPU and fifteen.

---

## The prefill interference problem

Continuous batching introduces a scheduling conflict that did not exist before. Admitting a new request means running its prefill, which is compute-bound and heavy. While that happens, every sequence already streaming pauses.

A single 50,000-token prompt arriving mid-batch can stall thirty streaming responses for a visible beat. The symptom users report is that streaming "stutters" under load, and the cause is invisible in average latency metrics.

**Chunked prefill** solves it. Rather than prefilling the whole prompt in one shot, split it into segments and interleave those segments with decode steps for the rest of the batch. The new request's TTFT rises slightly. Everyone else's streaming stays smooth.

\`\`\`mermaid
---
title: "Chunked Prefill Stops One Prompt Stalling the Batch"
---
flowchart LR
    subgraph SG1["Without chunked prefill"]
    A["Decode step"] --> B["Full prefill<br/>50k tokens, long stall"]
    B --> C["Decode step"]
    end

    subgraph SG2["With chunked prefill"]
    D["Decode step"] --> E["Prefill chunk 1"]
    E --> F["Decode step"]
    F --> G["Prefill chunk 2"]
    G --> H["Decode step"]
    end

    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933

    class B risk
    class A,C,D,E,F,G,H process
\`\`\`

The tradeoff is explicit: a small, bounded TTFT penalty for the arriving request in exchange for smooth streaming across the whole batch. For interactive products that is almost always the right trade.

---

## What actually limits batch size

Three separate ceilings, and they bind in different situations.

**KV cache capacity.** Every sequence in the batch holds its cache in GPU memory. This is usually the binding constraint for long-context workloads, and it is why the previous chapter's cache arithmetic determines the batch size before any scheduler setting does.

**Compute saturation.** Past a certain batch size, decode stops being memory-bound and becomes compute-bound. Beyond that point additional batch size increases per-token latency without increasing throughput.

**Latency SLO.** A larger batch means each individual sequence advances slightly slower, because the step takes longer. Throughput and per-user latency trade against each other directly, and the SLO decides where on that curve the system should sit.

| Priority | Batch size | Effect |
|---|---|---|
| Lowest per-user latency | Small | Poor GPU utilisation, high cost per request |
| Balanced interactive | Medium | Standard for chat and agent products |
| Maximum throughput | Large | Best cost per token, worst per-user latency |
| Offline batch jobs | Maximum that fits | Latency irrelevant, cost is everything |

The mistake is picking one setting for all traffic. Interactive requests and background jobs have opposite requirements and belong in separate pools, frequently on separate replicas.

---

## Speculative decoding, and where it fits

Batching improves throughput across users. Speculative decoding improves latency for a single user, and it composes with batching rather than replacing it.

A small draft model proposes several tokens ahead. The large model verifies all of them in a single forward pass. Accepted tokens are kept, the first rejection discards the rest, and the loop continues.

The economics depend entirely on acceptance rate. On predictable text such as code, structured output or boilerplate, acceptance runs high and effective speed roughly doubles. On genuinely novel reasoning, acceptance drops and the draft model's cost becomes overhead.

A detail that matters under load: speculative decoding trades compute for latency. When the GPU is already compute-saturated with a large batch, the extra verification work is no longer free and the benefit shrinks. It is most valuable at low to moderate load, which is exactly when latency complaints tend to appear.

---

## Putting the serving stack together

\`\`\`mermaid
---
title: "The Serving Stack: Gateway, Pools and Paged Memory"
---
flowchart TD
    A["Client Requests"] --> B["Inference Gateway<br/>auth, rate limit, routing"]
    B --> C{"Request class"}
    C -->|Interactive| D["Low latency pool<br/>small batch, spec decoding"]
    C -->|Batch job| E["Throughput pool<br/>large batch, no spec decoding"]
    C -->|Long context| F["Dedicated pool<br/>high memory, capped concurrency"]

    D --> G["Continuous Batching Scheduler"]
    E --> G
    F --> G
    G --> H[("Paged KV Cache Pool")]
    G --> I["Model Replicas"]
    I --> H
    I --> J["Streamed Response"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef store fill:#F3F0F8,stroke:#8880AE,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,D,E,F,G,I process
    class C decision
    class H store
    class J output
\`\`\`

The routing decision at the top is the piece most self-hosted stacks skip, and it is where most of the available efficiency lives. Separate pools mean each one can be tuned for its own objective rather than compromising for all traffic at once.

---

## The cost arithmetic

Unit economics for self-hosting reduce to one expression:

\`\`\`
cost per 1M tokens = (GPU hourly cost / tokens per hour) × 1,000,000
\`\`\`

Tokens per hour is the throughput number, and it is what every technique in this chapter moves. Consider a single card at roughly 3 dollars an hour:

| Configuration | Approx. tokens/sec | Cost per 1M output tokens |
|---|---|---|
| Static batching, contiguous KV | 200 | ~$4.20 |
| Continuous batching, contiguous KV | 1,400 | ~$0.60 |
| Continuous batching, paged KV | 3,000 | ~$0.28 |
| Above plus INT8 KV cache | 4,500 | ~$0.19 |

The figures are illustrative and depend heavily on model and traffic shape. The ratio is the point: the same model on the same card, spanning more than an order of magnitude, entirely on serving-layer decisions.

This is also the honest frame for the self-host-versus-API question. Self-hosting is cheaper per token only when utilisation is high. A GPU running at 15 percent utilisation is more expensive than an API call, and the fixed cost accrues whether or not traffic arrives. The break-even is a utilisation question, not a volume question.

---

## What this looks like in three real systems

### The stutter that only happened at lunchtime

A code review assistant streamed suggestions smoothly in testing. In production, developers reported that output "hiccups" and the complaints clustered between 12 pm and 2 pm.

Nothing was wrong with the network and nothing correlated with CPU. The correlation was with a specific request type: whole-repository review requests, which carry prompts of 40,000 to 80,000 tokens. Those arrive when developers kick off a review before lunch.

Each of those prompts triggered a prefill of several seconds. During that prefill, every developer already streaming a response saw nothing. One heavy request stalled forty light ones.

Chunked prefill resolved it. The heavy request's TTFT went from 3.1 seconds to 4.4 seconds. Everyone else's streaming became continuous. That is the trade in its clearest form: **one request pays a little so forty requests stop paying a lot.**

### The GPU bill that did not move when traffic doubled

A startup serving an open-weights model for a writing product doubled its user base and braced for the infrastructure cost to double. It went up by 11 percent.

The reason is the shape of the batching curve. At the original traffic level, the average batch held about 6 sequences on a card that comfortably held 48. The GPU was loading model weights from memory on every decode step to serve six users, when it could load them once to serve forty-eight for nearly the same cost.

Doubling traffic mostly filled empty batch slots.

This produces a counterintuitive but reliable rule: **for a self-hosted model below saturation, marginal traffic is close to free, and low traffic is very expensive per request.** A GPU at 15 percent utilisation is the worst possible deal, which is exactly the situation most teams are in when they first self-host and then conclude that self-hosting is expensive.

The corollary is that consolidating several low-traffic internal tools onto one shared pool is usually a larger cost win than any per-model optimisation.

### The batch job that starved the product

A marketing platform ran two workloads on one cluster: an interactive campaign assistant, and a nightly job generating 200,000 product descriptions.

The nightly job was configured for maximum batch size, which is correct for a batch job. But it did not stop at midnight when someone rescheduled it, and it ran into business hours. Interactive requests queued behind large batch sequences that each generated 400 tokens, and p95 latency on the product went from 1.8 seconds to 22 seconds.

The architectural fix is separation with an explicit priority contract.

\`\`\`mermaid
---
title: "Separating Interactive and Background Workloads"
---
flowchart TD
    A["All Requests"] --> B["Gateway<br/>classify and tag priority"]
    B --> C{"Priority class"}

    C -->|Interactive| D["Pool A<br/>reserved capacity<br/>batch 16, chunked prefill"]
    C -->|Background| E["Pool B<br/>preemptible<br/>batch 128, no latency SLO"]

    D --> F["Guaranteed p95 under 2 s"]
    E --> G{"Pool A under pressure"}
    G -->|Yes| H["Preempt background work<br/>checkpoint and resume later"]
    G -->|No| I["Run at full batch"]

    H --> J["Background completes late<br/>which is acceptable"]
    I --> J

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,D,E,I process
    class C,G decision
    class H risk
    class F,J output
\`\`\`

The important design idea is that background work is *preemptible by contract*. It is allowed to be slow. Interactive work is not. Encoding that difference in the scheduler is what stops one workload from silently becoming the other's incident.

---

## Failure modes

| Symptom | Serving-layer cause |
|---|---|
| Throughput far below benchmark claims | Static batching, or batch size capped by KV memory |
| Streaming stutters when new users arrive | Prefill blocking decode, no chunked prefill |
| p99 latency far worse than p50 | Long prompts monopolising batch slots |
| Adding replicas does not improve cost | Utilisation already low, capacity was never the issue |
| Speculative decoding helped in testing, not in production | Compute saturated under real batch sizes |
| Occasional very slow requests under load | Preemption and cache recomputation |

---

## Throughput is a scheduling problem

Serving throughput is an architecture problem with a large solution space and very large returns. Continuous batching, paged memory, chunked prefill and workload separation compound with each other, and together they routinely deliver ten times the tokens per second on unchanged hardware.

The order of work is worth stating plainly. Fix batching first, because it is the biggest single multiplier. Fix memory paging second, because it raises the ceiling batching can reach. Separate workload classes third, because it stops one traffic shape from degrading another. Only after all three does model selection become the dominant cost term.

---

*Next in this series: Model selection is an architecture decision, not a preference.*`,o="/blog/series/ai-systems-track-06.svg",i={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},a="2026-06-06",r=11,c="Inference",l=["Continuous Batching","vLLM","GPU Serving","Throughput","AI Engineering","LLMOps","ML Infrastructure","GPU","Cost Optimization"],h=!1,d="AI Systems Track",u="ai-systems-track",p=6,f=30,g={id:"106",slug:e,title:t,excerpt:n,content:s,featuredImage:o,author:i,publishedAt:a,readTime:r,category:c,tags:l,featured:h,series:d,seriesSlug:u,seriesPart:p,seriesTotal:f};export{i as author,c as category,s as content,g as default,n as excerpt,h as featured,o as featuredImage,m as id,a as publishedAt,r as readTime,d as series,p as seriesPart,u as seriesSlug,f as seriesTotal,e as slug,l as tags,t as title};
