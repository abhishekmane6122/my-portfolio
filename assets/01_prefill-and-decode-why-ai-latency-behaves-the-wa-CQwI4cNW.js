const f="101",e="prefill-and-decode-why-ai-latency-behaves-the-way-it-does",t="Prefill and Decode: Why AI Latency Behaves the Way It Does",n="Nearly every performance conversation about an LLM feature starts in the wrong place. Someone reports that responses feel slow, someone else suggests a smaller model, and a week later the...",s=`Nearly every performance conversation about an LLM feature starts in the wrong place. Someone reports that responses feel slow, someone else suggests a smaller model, and a week later the system is cheaper and still feels slow. The reason is that "slow" is not one number. Text generation runs in two phases with completely different bottlenecks, and an optimisation that helps one phase does nothing for the other.

Getting this distinction right is the difference between a fix that lands and three sprints of guessing.

---

## Generation is autoregressive, and that shapes everything

A language model does not produce an answer. It produces one token, appends it to what it has already seen, and produces the next one. The loop is trivially simple:

\`\`\`
Input:  "The quick brown"
Step 1: "fox"    -> "The quick brown fox"
Step 2: "jumps"  -> "The quick brown fox jumps"
Step 3: "over"   -> "The quick brown fox jumps over"
\`\`\`

Each step is a full forward pass through the model. A 500-token answer is 500 forward passes. That single fact explains most of what follows.

But the first forward pass is not like the other 499. Processing the prompt and processing the next token are structurally different operations, and the hardware treats them differently.

---

## Phase one: prefill

Prefill is the pass that consumes the prompt. Every token in the input is processed at once, in parallel, because they are all already known. Attention is computed across all pairs, the key and value tensors for every position get written into the cache, and the model emits the logits for the very first output token.

The characteristics that matter:

- **Compute-bound.** The GPU's arithmetic units are saturated. This is a large matrix multiplication and the hardware is doing what it was built to do.
- **Parallel.** Doubling the prompt does not double wall-clock time linearly on a modern GPU until the batch saturates.
- **Runs once.** No matter how long the answer is, prefill happens exactly once per request.

Prefill duration is what the user experiences as **time to first token**. A 30,000-token prompt means a noticeably blank screen before anything appears, regardless of how fast the model streams afterwards.

---

## Phase two: decode

Decode is the loop. One token in, one token out, over and over.

- **Memory-bound.** The arithmetic per step is tiny. The expensive part is dragging the entire KV cache out of high-bandwidth memory to compute attention against it. The GPU spends most of its time waiting on memory, not computing.
- **Strictly sequential.** Token N+1 cannot start before token N finishes. No amount of parallel hardware fixes this for a single request.
- **Roughly constant per token.** Each decode step costs about the same, which is why output length maps almost linearly to time.

Decode throughput is what the user experiences as **tokens per second**, the speed at which text visibly streams.

---

## The two phases in one picture

\`\`\`mermaid
---
title: "Prefill and Decode: The Two Phases of Text Generation"
---
flowchart LR
    A["User Prompt"] --> B["Tokenizer"]
    B --> C["Prefill Pass<br/>all prompt tokens at once"]
    C --> D[("KV Cache<br/>K and V for every position")]
    C --> E["First Token"]
    E --> F["Decode Step<br/>one token per pass"]
    F --> D
    D --> F
    F --> G{"Stop condition met"}
    G -->|No| F
    G -->|Yes| H["Complete Response"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef store fill:#F3F0F8,stroke:#8880AE,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A,B input
    class C,E,F process
    class D store
    class G decision
    class H output
\`\`\`

The arrow from decode back into the KV cache is the part that gets skipped in most explanations. Every generated token appends a new key and value to the cache, which means the cache grows during generation, which means each decode step is marginally more expensive than the last.

---

## The metrics that actually describe a request

Four numbers describe the latency of a single generation. Reporting only one of them is how teams end up optimising the wrong phase.

| Metric | What it measures | Dominated by |
|---|---|---|
| **TTFT** (time to first token) | Prompt in, first character out | Prefill, queueing, network |
| **TPOT** (time per output token) | Steady-state streaming speed | Decode, memory bandwidth |
| **Total latency** | TTFT + (TPOT × output tokens) | Whichever phase is larger |
| **Throughput** | Tokens per second across all concurrent requests | Batching efficiency |

The relationship is worth writing down explicitly:

\`\`\`
Total latency = TTFT + (TPOT * output_tokens)
\`\`\`

A chat interface lives and dies on TTFT, because streaming hides the rest. A batch summarisation job does not care about TTFT at all and cares entirely about throughput. A voice agent cares about both and has roughly 300 ms of total budget, which is why voice systems make architectural choices nobody else would tolerate.

---

## Why this changes what you optimise

Once the two phases are separate in your head, the optimisation menu sorts itself.

### If TTFT is the problem, you are fighting prefill

- **Shorten the prompt.** The most direct lever and the most often ignored. Retrieval that returns 20 chunks when 5 would do is a latency bug, not just a cost bug.
- **Cache the prefix.** If the first 8,000 tokens of every request are identical (system prompt, tool schemas, few-shot examples), the KV tensors for those tokens can be computed once and reused. Providers expose this as prompt caching; self-hosted engines expose it as prefix caching. This is the single highest-leverage TTFT fix in most systems.
- **Chunked prefill.** Splitting a very long prompt into segments interleaved with decode steps for other requests stops one giant prompt from stalling everyone else in the batch.

### If streaming speed is the problem, you are fighting decode

- **Shrink the KV cache.** Grouped-query attention, KV cache quantization, and smaller context all reduce the bytes that have to move per token.
- **Speculative decoding.** A small draft model proposes several tokens, the large model verifies them in a single pass. When the draft is right, several tokens arrive for the price of one forward pass. Acceptance rates of 60 to 80 percent on predictable text are typical, and that translates directly into faster streaming.
- **Cap the output.** A \`max_tokens\` that is set to the model's maximum "just in case" is a decision to let the worst case define the tail latency.

### If throughput is the problem, you are fighting the scheduler

Neither phase is the issue. Batching is. That is its own topic and gets its own treatment later in this series.

---

## The tradeoff nobody mentions until it bites

Prefill and decode compete for the same GPU. A serving engine handling many concurrent users is constantly deciding whether to admit a new request (run its prefill, which is compute-heavy and will stall ongoing decodes) or keep streaming the requests already in flight.

Naive schedulers alternate badly and produce a distinctive symptom: streaming that visibly stutters, pausing for a beat every time a new user arrives. The fix is in the serving layer, not the model, and it is why inference engine choice is an architecture decision rather than an implementation detail.

\`\`\`mermaid
---
title: "Prefill vs Decode: The GPU Scheduling Conflict"
---
flowchart TD
    A["Incoming Requests"] --> B{"Scheduler decision"}
    B -->|Admit new request| C["Run Prefill<br/>compute bound, blocks decodes"]
    B -->|Continue in flight| D["Run Decode Step<br/>memory bound, low compute"]
    C --> E["Shared GPU"]
    D --> E
    E --> F{"Batch slot free"}
    F -->|Yes| B
    F -->|No| G["Queue Wait<br/>shows up as TTFT"]
    G --> B

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class C,D,E process
    class B,F decision
    class G risk
\`\`\`

Chunked prefill exists precisely to stop the left branch from starving the right one.

---

## What this looks like in three real systems

The abstraction becomes obvious the moment it is attached to a product with a deadline.

### A support chat widget on an e-commerce site

The system prompt carries brand voice rules, a returns policy, and eight tool schemas. Around 9,000 tokens. Retrieval adds six product passages, roughly 3,000 tokens. The customer types "where is my order". Answer length is about 120 tokens.

\`\`\`
Prefill:  12,200 tokens  ->  ~900 ms TTFT
Decode:      120 tokens  ->  ~2.4 s at 50 tok/s
\`\`\`

The customer stares at a blank bubble for nearly a second before a single character appears. Every complaint filed says "the bot is slow", and the instinct is to switch to a faster model. But 900 ms of the delay is prefill on a prompt that is identical on every single request. Move the 9,000 stable tokens into a cached prefix and TTFT drops to roughly 250 ms. Nothing about the model changed. The perceived slowness is gone.

### A clinical voice assistant

A doctor dictates, the system transcribes and structures a note. The interaction only feels natural if the response begins within roughly 300 ms. That budget has to cover speech recognition, prefill and the first token.

This constraint eliminates entire designs. There is no room for a 20,000-token prompt. There is no room for a retrieval round trip on the critical path. What survives is a small cached prefix, a compact model, and any retrieval done speculatively while the doctor is still speaking. The latency budget picked the architecture, not the other way round.

### Nightly ticket summarisation

Forty thousand support tickets get summarised between midnight and 6 am. Each is roughly 1,500 tokens in and 150 tokens out.

Here TTFT is irrelevant. Nobody is watching. The only number that matters is total tokens per hour, which means large batches, no speculative decoding, and a context limit set tight so more sequences fit in memory at once. The same team serving the chat widget and this job with one shared configuration will have both a slow widget and an expensive batch job.

### The same three systems, side by side

| | Support widget | Voice assistant | Nightly batch |
|---|---|---|---|
| Binding metric | TTFT | TTFT, extreme | Throughput |
| Prompt size | Large but stable | Must stay tiny | Medium |
| Primary lever | Prefix caching | Model size and pipeline order | Batch size |
| Speculative decoding | Helpful | Helpful | Counterproductive |
| Context limit | 32k | 8k | 8k |
| Batch size | Medium | Small | Maximum that fits |

Three products, one model family, three genuinely different serving configurations. Running them on one shared pool is the most common self-hosting mistake there is.

\`\`\`mermaid
---
title: "One Model, Three Workloads, Three Serving Pools"
---
flowchart TD
    A["Incoming Traffic"] --> B["Inference Gateway"]
    B --> C{"Workload class"}
    C -->|Interactive chat| D["Pool A<br/>medium batch, prefix cache on"]
    C -->|Voice, hard realtime| E["Pool B<br/>small batch, small model"]
    C -->|Offline batch| F["Pool C<br/>max batch, no spec decoding"]

    D --> G["TTFT target 300 ms"]
    E --> H["TTFT target 120 ms"]
    F --> I["Throughput target<br/>tokens per hour"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,D,E,F process
    class C decision
    class G,H,I output
\`\`\`

---

## Failure modes to recognise

**Symptom: latency is fine in testing, terrible in production.** Testing measured a single request against an idle GPU. Production measures queueing. Queue wait shows up inside TTFT and is invisible unless the metric is broken out.

**Symptom: p50 is good, p99 is five times worse.** Long prompts and long outputs are usually the tail. Segment latency by input length and output length before touching the model.

**Symptom: swapping to a smaller model barely helped.** If the workload is decode-bound and memory-bound, a smaller model helps proportionally less than its parameter count suggests, because the KV cache did not shrink as much as the weights did.

**Symptom: the first request after a deploy is very slow.** Cold cache, cold weights, cold CUDA graphs. Warm the pool before routing traffic.

---

## What to measure before changing anything

A short instrumentation checklist that makes the rest of the work obvious:

1. Record TTFT and TPOT separately on every request, not just total latency.
2. Record input token count and output token count alongside them.
3. Record queue wait as its own field, separate from prefill time.
4. Plot TTFT against input tokens. If it is a clean line, prefill dominates. If it is flat with spikes, queueing dominates.
5. Plot total latency against output tokens. The slope is your real TPOT.

Four fields and two scatter plots will tell you more than a week of intuition.

---

## Two clocks, not one

Prompt length buys latency at the front. Output length buys latency at the back. They are paid for out of different budgets and fixed with different tools. Caching the prefix attacks the front. Speculative decoding and a tighter KV cache attack the back. Batching attacks neither and instead attacks the cost of serving everyone at once.

Any performance discussion that does not first say which of the two phases is slow is a discussion about the wrong thing.

---

*Next in this series: Tokenization — the silent tax on every AI feature.*`,o="/blog/series/ai-systems-track-01.svg",a={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},i="2026-06-01",r=11,l="Inference",h=["Prefill","Decode","TTFT","Latency","AI Engineering","LLMOps","System Design","Inference","ML Infrastructure"],c=!1,d="AI Systems Track",p="ai-systems-track",u=1,m=30,g={id:"101",slug:e,title:t,excerpt:n,content:s,featuredImage:o,author:a,publishedAt:i,readTime:r,category:l,tags:h,featured:c,series:d,seriesSlug:p,seriesPart:u,seriesTotal:m};export{a as author,l as category,s as content,g as default,n as excerpt,c as featured,o as featuredImage,f as id,i as publishedAt,r as readTime,d as series,u as seriesPart,p as seriesSlug,m as seriesTotal,e as slug,h as tags,t as title};
