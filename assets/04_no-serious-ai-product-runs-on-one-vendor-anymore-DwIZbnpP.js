const p="404",e="no-serious-ai-product-runs-on-one-vendor-anymore-heres-the-fleet-strategy-that-replaced-it",n="No Serious AI Product Runs on One Vendor Anymore. Here's the Fleet Strategy That Replaced It.",t="For two years, the infrastructure conversation for a new AI product was short: get NVIDIA GPUs, pick a size, done. That conversation doesn't exist anymore.",o=`For two years, the infrastructure conversation for a new AI product was short: get NVIDIA GPUs, pick a size, done. That conversation doesn't exist anymore. The capacity story now involves more than a trillion dollars of committed cloud spend across multiple vendors, and the practical result for anyone architecting a serving stack is that single-vendor is no longer a defensible default - it's a concentration risk.

Before any of that, there's a more basic decision most teams skip past too quickly: API provider or self-hosted. The crossover point is volume, not preference. Under roughly a million queries a month, API pricing usually wins outright - no GPU procurement, no ops burden. Past ten million a month, self-hosting starts winning, provided you're honest about the hidden cost: at least one, usually two, dedicated engineers just for infrastructure. Most teams underestimate that line item and it quietly erases the savings on paper.

If self-hosting wins, the hardware question is no longer one answer. NVIDIA's B300 (Blackwell Ultra) is still the default for frontier training - highest performance, highest price, and a software stack (CUDA, NCCL, TensorRT-LLM) that locks you in. AMD's MI400 is the credible second source: 432GB of memory per GPU versus the B300's 288GB, which matters for MoE serving and long-context KV-cache workloads. AWS's Trainium3 anchors a vertically integrated stack at the cost of the Neuron SDK instead of CUDA - a real porting effort. And for single-replica, ultra-low-latency inference, Cerebras's wafer-scale engine is the only credible option under 50ms time-to-first-token.

The framing that should drive a capacity-planning conversation isn't "which chip is fastest" - it's a three-tier fleet: heavy compute for training and reasoning-scale inference (B300, MI400), high-throughput serving optimized for cost per token (Trainium3, MI400, Cerebras), and edge/specialty for latency-critical or sovereignty-constrained workloads where an open RISC-V stack or consumer silicon is genuinely the right answer, not a compromise.

Two things worth carrying into that conversation regardless of which vendor you pick: plan around memory per accelerator as much as raw FLOPS, since MoE serving is bottlenecked on expert residency, not math throughput - and treat any long-term contract priced at last year's rates with suspicion, because $/token has been falling 3 to 5x a year, and locking in early usually means locking in the worse deal.

#AIInfrastructure #MLOps #CloudComputing #SystemDesign #AIEngineering

---

## Diagrams

### API vs self-hosted, the actual decision

\`\`\`mermaid
---
title: "API Provider or Self-Hosted: The Volume Crossover"
---
flowchart TD
    A["New AI workload"] --> B{"Query volume"}
    B -->|"Under 1M/month"| C["API provider<br/>faster to ship, no ops burden"]
    B -->|"1M to 10M/month"| D{"Data residency<br/>or latency P99 < 100ms required?"}
    B -->|"Over 10M/month"| E["Self-hosted usually wins<br/>on unit economics"]
    D -->|Yes| E
    D -->|No| C

    E --> F["Hidden cost: 1-2 dedicated<br/>infra engineers, ongoing"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    class A input
    class B,D decision
    class C,E output
    class F risk
\`\`\`

### The three-tier fleet (sketch style)

\`\`\`mermaid
---
title: "A Three-Tier Fleet Strategy for 2026 AI Infrastructure"
config:
  look: handDrawn
---
flowchart TD
    A["Production AI workload"] --> B{"Dominant constraint"}
    B -->|"Frontier training, max FLOPS"| C["Tier 1: Training and Heavy Compute<br/>B300 NVL72, MI400 Helios"]
    B -->|"Cost per token, MoE serving"| D["Tier 2: High-Throughput Inference<br/>Trainium3, MI400, Cerebras CS-3"]
    B -->|"Edge, latency, sovereignty"| E["Tier 3: Edge and Specialty<br/>Open RISC-V, consumer silicon"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933
    class A input
    class B decision
    class C,D,E output
\`\`\``,r="/blog/series/deep-dives-04.svg",s={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},i="2026-08-04",a=3,c="Infrastructure",l=["GPU","Hardware","Infrastructure","Multi-Vendor","AIInfrastructure","MLOps","Cloud Computing","System Design","AI Engineering"],d=!1,u="Deep Dives",h="deep-dives",f={id:"404",slug:e,title:n,excerpt:t,content:o,featuredImage:r,author:s,publishedAt:i,readTime:a,category:c,tags:l,featured:d,series:u,seriesSlug:h};export{s as author,c as category,o as content,f as default,t as excerpt,d as featured,r as featuredImage,p as id,i as publishedAt,a as readTime,u as series,h as seriesSlug,e as slug,l as tags,n as title};
