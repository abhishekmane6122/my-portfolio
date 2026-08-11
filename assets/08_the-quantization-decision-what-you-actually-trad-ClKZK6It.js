const m="408",e="the-quantization-decision-what-you-actually-trade-away-below-16-bit",t="The Quantization Decision: What You Actually Trade Away Below 16-bit",n="An 8B model at BF16 is 16GB. Drop to 4-bit and it's 5GB. Same model, same weights, a third of the memory footprint - and on most benchmarks, a quality loss you'd struggle to notice without...",a=`An 8B model at BF16 is 16GB. Drop to 4-bit and it's 5GB. Same model, same weights, a third of the memory footprint - and on most benchmarks, a quality loss you'd struggle to notice without a very careful eval set. That gap between "same model" and "5x smaller file" is the whole reason quantization became the default deployment lever instead of a niche optimization.

But "quantization" isn't one technique, and the differences matter once you're picking a format for production rather than a demo.

NF4 (NormalFloat4) is the QLoRA-era standard for fine-tuning. It's built on an observation that's easy to miss: LLM weights aren't uniformly distributed, they cluster around zero in something close to a normal distribution. A naive 4-bit grid wastes precision on values that barely occur. NF4 places its quantization bins so each one captures roughly equal probability mass from that distribution, which preserves far more information than a linear 4-bit scale would.

AWQ takes a different angle entirely - instead of quantizing every weight equally, it runs a calibration pass to find the roughly 1% of weights that are most "salient" to output quality and keeps only those in higher precision. Everything else gets compressed hard. That selective preservation is why AWQ tends to beat GPTQ on perplexity, especially at aggressive compression levels like 3-bit.

Then there's the deployment-format question, which is really a hardware question wearing a technical disguise. GGUF (the llama.cpp format) runs anywhere - Mac, Linux, Windows, CPU and GPU offload mixed - at the cost of raw speed. EXL2 is GPU-only, Nvidia-only, and meaningfully faster on that narrow target. Picking between them is picking your deployment surface, not just your compression ratio.

The part that surprises people who think of quantization purely as "shrink the model file": the KV cache benefits just as much, and at long context it often matters more. A 2-million-token KV cache at BF16 eats roughly 32GB of VRAM on an 8B model. Quantized to FP8 or Int4, that drops to 8-16GB - which isn't a minor optimization, it's the difference between serving a handful of long-context users and serving four times as many on the same card. Modern serving frameworks now do this compression on the fly, streaming, without a separate offline step.

The one place quantization stops being "nearly free": models under roughly 3B parameters, where post-training quantization alone tends to hurt more and quantization-aware training becomes close to mandatory.

Outside that edge case, the practical rule holds: pick the precision your hardware and workload actually need, not the default your serving framework ships with. Most teams are leaving 2-4x concurrency on the table by never touching this dial.

#MachineLearning #Quantization #LLM #AIEngineering #ModelOptimization

---

## Diagrams

### The precision ladder and what it costs

\`\`\`mermaid
---
title: "Precision vs Memory vs Quality: The Quantization Ladder"
---
flowchart TD
    A["BF16 baseline<br/>16GB, 0% quality loss"] --> B["FP8<br/>8GB, under 1% loss<br/>H100 / B200 / RTX 4090"]
    B --> C["4-bit NF4<br/>5GB, 1-2% loss<br/>runs on all modern GPUs"]
    C --> D["2-bit<br/>2.5GB, 10-15% loss<br/>research / specialized only"]

    classDef safe fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef caution fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933

    class A,B safe
    class C caution
    class D risk
\`\`\`

### Where the real VRAM savings hide at long context

\`\`\`mermaid
---
title: "KV Cache Quantization: The Hidden Win at Long Context"
config:
  look: handDrawn
---
flowchart LR
    A["2M-token KV cache<br/>BF16"] --> A1["~32GB VRAM<br/>on an 8B model"]
    B["Same 2M-token cache<br/>FP8 / Int4"] --> B1["~8-16GB VRAM"]
    A1 --> C{"Same GPU"}
    B1 --> C
    C --> D["Streaming quantization =<br/>roughly 4x more concurrent users<br/>on identical hardware"]

    classDef before fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef after fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A,A1 before
    class B,B1 after
    class C decision
    class D output
\`\`\``,o="/blog/series/deep-dives-08.svg",i={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},s="2026-08-08",r=3,l="Inference",c=["Quantization","INT8","GGUF","Inference","Machine Learning","LLM","AI Engineering","Model Optimization"],h=!1,d="Deep Dives",u="deep-dives",f={id:"408",slug:e,title:t,excerpt:n,content:a,featuredImage:o,author:i,publishedAt:s,readTime:r,category:l,tags:c,featured:h,series:d,seriesSlug:u};export{i as author,l as category,a as content,f as default,n as excerpt,h as featured,o as featuredImage,m as id,s as publishedAt,r as readTime,d as series,u as seriesSlug,e as slug,c as tags,t as title};
