const u="409",e="why-almost-nobody-runs-full-rlhf-anymore-and-what-replaced-it",n="Why Almost Nobody Runs Full RLHF Anymore, and What Replaced It",t="A pretrained model is knowledgeable and completely uncontrolled at the same time - it can write beautifully and still ignore your instructions, hallucinate with total confidence, or produce...",a=`A pretrained model is knowledgeable and completely uncontrolled at the same time - it can write beautifully and still ignore your instructions, hallucinate with total confidence, or produce something unsafe, because nothing in pretraining ever taught it which of its capable outputs you actually want. Alignment is the step that closes that gap, and the method most teams associate with alignment - RLHF - is mostly not what's running in production anymore.

Classic RLHF is a three-model system: supervised fine-tuning for a baseline, a reward model trained on human preference pairs, then PPO using that reward model to push the policy toward higher-scoring outputs. It works, and it's also why most teams moved away from it - PPO needs four models resident in memory at once, it's brutally sensitive to hyperparameters, and it has a documented failure mode where the policy suddenly collapses mid-training.

DPO's insight is that you don't need the reward model as a separate object at all. Preference data - this response beat that one - can derive the optimal policy directly, with the model itself implicitly serving as its own reward model relative to a fixed reference copy. A three-model reinforcement learning problem becomes closer to a classification problem on pairs of responses. Fewer moving parts, far more stable training - why DPO became the default.

Offline DPO only learns from the static preference dataset it was given - once outputs improve past what that dataset can distinguish, training stalls. Online alignment closes the gap: the model generates candidates live, a judge or rule-based check ranks them in real time, and the policy updates from that fresh signal instead of a frozen dataset.

The most consequential recent shift is what gets rewarded for reasoning models: not the final answer, but the chain of thought itself, increasingly verified rather than human-judged - did the math check out, did the code pass its tests. A stronger, cheaper signal when it's available.

One cost worth knowing before aligning a model harder than the task needs: alignment tax. Push too hard on safety or persona and raw capability erodes - coding, creative range, and reasoning nuance all soften as the model gets more cautious.

So the actual discipline isn't picking DPO over RLHF, it's measuring capability before and after every alignment pass, not just safety - the tax is real, and a KL penalty against the reference model only helps if someone is watching for it.

#MachineLearning #RLHF #DPO #AIAlignment #LLM

---

## Diagrams

### RLHF's four models vs DPO's two

\`\`\`mermaid
---
title: "Why DPO Replaced RLHF/PPO in Most Production Pipelines"
config:
  look: handDrawn
---
flowchart LR
    subgraph RLHF["Classic RLHF / PPO"]
    P1["Policy model"]
    R1["Reference model"]
    V1["Value model"]
    RM1["Reward model"]
    P1 -.->|"all 4 resident<br/>in memory at once"| V1
    end

    subgraph DPO["DPO"]
    P2["Policy model"]
    R2["Reference model<br/>fixed"]
    P2 -->|"preference pairs treated<br/>as a classification problem"| R2
    end

    classDef heavy fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef light fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    class P1,R1,V1,RM1 heavy
    class P2,R2 light
\`\`\`

### The alignment progression, offline to reasoning

\`\`\`mermaid
---
title: "From Offline Preference Data to Verified Reasoning Rewards"
---
flowchart TD
    A["Offline DPO<br/>static preference dataset"] --> B["Ceiling: model improves<br/>past what data can distinguish"]
    B --> C["Online DPO / RLOO<br/>judge ranks fresh generations live"]
    C --> D["Reasoning-model alignment<br/>reward the chain of thought, not just the answer"]
    D --> E["Verification-based RL<br/>compiler or test suite as reward signal,<br/>no human judgment needed"]

    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933
    class A process
    class B risk
    class C,D process
    class E output
\`\`\``,s="/blog/series/deep-dives-09.svg",i={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},o="2026-08-09",r=3,l="Model Training",d=["RLHF","DPO","Alignment","Preference Tuning","Machine Learning","AIAlignment","LLM"],c=!1,h="Deep Dives",m="deep-dives",f={id:"409",slug:e,title:n,excerpt:t,content:a,featuredImage:s,author:i,publishedAt:o,readTime:r,category:l,tags:d,featured:c,series:h,seriesSlug:m};export{i as author,l as category,a as content,f as default,t as excerpt,c as featured,s as featuredImage,u as id,o as publishedAt,r as readTime,h as series,m as seriesSlug,e as slug,d as tags,n as title};
