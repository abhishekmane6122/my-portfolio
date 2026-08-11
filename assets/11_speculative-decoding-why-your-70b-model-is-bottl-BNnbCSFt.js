const p="411",e="speculative-decoding-why-your-70b-model-is-bottlenecked-on-memory-not-compute",t="Speculative Decoding: Why Your 70B Model Is Bottlenecked on Memory, Not Compute",n="A 70B model spends most of its time doing something that sounds absurd once you say it out loud: moving 140GB of weights from HBM to the GPU's compute cores, just to produce one token.",o=`A 70B model spends most of its time doing something that sounds absurd once you say it out loud: moving 140GB of weights from HBM to the GPU's compute cores, just to produce one token. Then it does that again. And again. One token per full pass over the weights.

This is why decoding is memory-bound, not compute-bound. The GPU's math units sit mostly idle, waiting on memory bandwidth. A draft model can guess the next several tokens in the time the big model would have spent shuffling weights around for a single one - and that gap is what speculative decoding exploits.

The mechanics are simple enough to sketch on a whiteboard:

A small draft model (1B, maybe 7B) proposes K candidate tokens. The target model verifies all K in one parallel pass, the same shape of computation as a prefill instead of a decode. Wherever the draft's guess matches, it's accepted. First mismatch, everything after it is thrown away and the target model's own token takes over.

The economics work because verification is cheap relative to generation - checking several tokens at once instead of paying the full memory-bandwidth tax per token. Two to three times faster wall-clock, and - the part people don't expect - zero quality loss, because the output is exactly what the target model would have produced anyway. It's the same model, sped up by exploiting spare capacity in the memory pipeline.

Two production variants worth knowing:

Medusa skips the second model entirely. Instead of a separate draft model competing for VRAM and needing its own KV cache, it bolts extra prediction heads onto the target model itself - one head per future token position. Same forward pass, multiple guesses, no second model to manage.

Lookahead decoding goes further and doesn't need a draft model at all. It mines the model's own recent hidden states for repeating n-gram patterns, which makes it particularly effective on code and structured technical writing where patterns repeat constantly.

The failure mode is worth knowing before you ship this: speculative decoding degrades badly on high-temperature creative writing. When the target distribution is flat and the model is meant to pick less-likely tokens on purpose, the draft model's guesses get rejected constantly, and you're paying the draft model's latency for nothing. Serving frameworks like vLLM handle this with dynamic draft lengths - shrinking K when the GPU is already saturated with concurrent requests, growing it when there's spare capacity to spend.

If you're serving a large model and haven't asked whether decode is memory-bound in your setup, that's the first number to check before reaching for a bigger GPU.

#AIEngineering #LLMInference #MachineLearning #SystemDesign #GenAI

---

## Diagrams

### The draft-verify loop (sequence view)

\`\`\`mermaid
---
title: "Speculative Decoding: Draft, Verify, Accept or Fall Back"
config:
  look: handDrawn
---
sequenceDiagram
    participant U as Request
    participant D as Draft Model (1B)
    participant T as Target Model (70B)

    U->>D: Generate K candidate tokens
    D-->>D: 5ms per token, sequential
    D->>T: Submit K tokens for verification
    Note over T: Single parallel "prefill-style" pass
    T-->>T: Compare against its own logits
    alt All K tokens accepted
        T->>U: Return K tokens, continue from K+1
    else Mismatch at position i
        T->>U: Return tokens 1..i-1 plus target's own token i
        Note over U: Everything after i is discarded and regenerated
    end
\`\`\`

### Where the speedup actually comes from

\`\`\`mermaid
---
title: "Memory-Bound Decode vs Compute-Bound Verification"
---
quadrantChart
    title Latency per token: standard decode vs speculative
    x-axis Low Compute Use --> High Compute Use
    y-axis Low Memory Traffic --> High Memory Traffic
    quadrant-1 Wasteful
    quadrant-2 Standard sequential decode
    quadrant-3 Idle
    quadrant-4 Speculative verification
    "Standard decode (1 token/pass)": [0.25, 0.85]
    "Speculative verify (K tokens/pass)": [0.75, 0.4]
    "Draft model guess": [0.15, 0.2]
    "GPU idle waiting on HBM": [0.1, 0.9]
\`\`\``,a="/blog/series/deep-dives-11.svg",s={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},i="2026-08-11",r=3,d="Inference",c=["Speculative Decoding","Memory Bandwidth","Latency","Inference","AI Engineering","LLMInference","Machine Learning","System Design","Gen AI"],l=!1,h="Deep Dives",u="deep-dives",m={id:"411",slug:e,title:t,excerpt:n,content:o,featuredImage:a,author:s,publishedAt:i,readTime:r,category:d,tags:c,featured:l,series:h,seriesSlug:u};export{s as author,d as category,o as content,m as default,n as excerpt,l as featured,a as featuredImage,p as id,i as publishedAt,r as readTime,h as series,u as seriesSlug,e as slug,c as tags,t as title};
