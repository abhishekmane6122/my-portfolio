const g="406",e="the-fine-tuning-decision-nobody-explains-well-full-weights-vs-lora-vs-qlora",n="The Fine-Tuning Decision Nobody Explains Well: Full Weights vs LoRA vs QLoRA",t="Somebody on the team suggests fine-tuning a 70B model on company data. Then someone does the math: full fine-tuning means storing gradients and optimizer states for every one of those 70...",a=`Somebody on the team suggests fine-tuning a 70B model on company data. Then someone does the math: full fine-tuning means storing gradients and optimizer states for every one of those 70 billion parameters, and that arithmetic alone rules out a single A100 - you need a cluster most teams don't have lying around.

This is the problem parameter-efficient fine-tuning was built to solve, and LoRA is the version that won.

The idea is almost embarrassingly simple once you see it. Freeze the pretrained weight matrix entirely - no gradients touch it. Next to it, add two small trainable matrices, A and B, low-rank by construction, and let the model's output become the frozen path plus this small learned correction, scaled by a factor tied to the rank you chose. You're training a tiny fraction of the parameter count - often under 1% - and getting most of the benefit of full fine-tuning.

One detail catches people who learned LoRA a couple of years ago: the early convention targeted only the attention projections, query and value. The current standard targets every linear layer - even at low rank - for more stability at almost no extra trainable-parameter cost.

QLoRA pushes the same idea one step further by quantizing the frozen base model to 4-bit (NF4) while keeping the LoRA adapters and gradients at 16-bit. Paged optimizers spill to CPU memory instead of crashing on an out-of-memory error mid-run. The combined effect: fine-tune a 70B model on hardware that couldn't hold its full-precision weights, let alone the gradients.

Two variants worth knowing if you're choosing a method today, not two years ago:

DoRA decomposes the weight update into magnitude and direction, learned separately instead of coupled. It converges faster and gets closer to full fine-tuning quality - matters when an evaluation set is unforgiving.

Vera goes the opposite direction - fixed random projections plus a small trainable vector, cutting adapter size roughly 10x. Only worth it serving hundreds of adapters at once, where storage itself is the bottleneck.

Which brings up the part that actually changes production architecture: multi-LoRA serving. One base model in memory, a hundred-plus adapters swapped per request via continuous batching and paged attention - a finance adapter for one request, a legal adapter for the next, same GPU, roughly 5-10% latency overhead versus the base model alone.

So before commissioning ten separate fine-tuning runs for ten use cases, ask whether it's actually ten adapters on one base model - the infrastructure difference is a single deployment versus ten, and the cost difference compounds every month you're serving all of them.

#MachineLearning #LLM #FineTuning #AIEngineering #MLOps

---

## Diagrams

### What actually gets trained

\`\`\`mermaid
---
title: "LoRA: Freeze the Big Matrix, Train the Small Ones"
config:
  look: handDrawn
---
flowchart LR
    X["Input x"] --> W["Frozen weights W<br/>(no gradient)"]
    X --> A["Matrix A<br/>(trainable, rank r)"]
    A --> B["Matrix B<br/>(trainable, rank r)"]
    W --> SUM(("+"))
    B --> SCALE["scale by alpha / r"]
    SCALE --> SUM
    SUM --> H["Output h = Wx + (BA)x * alpha/r"]

    classDef frozen fill:#F3F0F8,stroke:#8880AE,stroke-width:1px,color:#1F2933
    classDef trainable fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class W frozen
    class A,B,SCALE trainable
    class H,SUM output
\`\`\`

### One base model, many adapters, one GPU

\`\`\`mermaid
---
title: "Multi-LoRA Serving: Same Base Model, Different Skills Per Request"
---
flowchart TD
    BASE[("Base model<br/>Llama 70B, in memory once")]
    R1["Request: finance question"] --> A1["Finance adapter"]
    R2["Request: legal question"] --> A2["Legal adapter"]
    R3["Request: medical question"] --> A3["Medical adapter"]
    A1 --> BASE
    A2 --> BASE
    A3 --> BASE
    BASE --> OUT["Continuous batching + PagedAttention v3<br/>100+ adapters, 5-10% latency overhead"]

    classDef store fill:#F3F0F8,stroke:#8880AE,stroke-width:1px,color:#1F2933
    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class BASE store
    class R1,R2,R3 input
    class A1,A2,A3 process
    class OUT output
\`\`\``,o="/blog/series/deep-dives-06.svg",s={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},i="2026-08-06",r=3,l="Model Training",d=["LoRA","QLoRA","PEFT","Fine-Tuning","Machine Learning","LLM","Fine Tuning","AI Engineering","MLOps"],c=!1,u="Deep Dives",h="deep-dives",p={id:"406",slug:e,title:n,excerpt:t,content:a,featuredImage:o,author:s,publishedAt:i,readTime:r,category:l,tags:d,featured:c,series:u,seriesSlug:h};export{s as author,l as category,a as content,p as default,t as excerpt,c as featured,o as featuredImage,g as id,i as publishedAt,r as readTime,u as series,h as seriesSlug,e as slug,d as tags,n as title};
