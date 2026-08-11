const f="403",e="why-an-8b-model-trained-by-a-400b-teacher-beats-an-8b-model-trained-from-scratch",t="Why an 8B Model Trained by a 400B Teacher Beats an 8B Model Trained from Scratch",n="Same architecture. Same parameter count. Same number of training tokens. Wildly different quality. The difference isn't the student model - it's who taught it.",a=`Same architecture. Same parameter count. Same number of training tokens. Wildly different quality. The difference isn't the student model - it's who taught it.

Small open-weight models that punch above their size (Llama's 8B tier, Gemini Flash, Claude's Haiku line) aren't primarily trained on raw web text. They're trained on synthetic data generated or curated by a much larger teacher model. Pretraining on raw internet data means a model spends a huge share of its capacity just learning to filter noise. A distilled model skips most of that - the teacher has already done the filtering, and what the student sees is a curriculum, not a firehose.

There are two ways to transfer that knowledge, and the difference matters more than it sounds.

Hard-label distillation trains the student on the teacher's final answers - useful, but it only teaches "this is correct," not "here's how close everything else was."

Soft-label distillation trains on the teacher's full probability distribution over the vocabulary, at a raised temperature (typically 2 to 5) that flattens the distribution and exposes more of the teacher's uncertainty. It's richer because it tells the student which wrong answers were nearly right, not just which one was correct.

With access to the teacher's weights, not just its API, feature distillation goes deeper - matching hidden states directly. The student learns something closer to the teacher's internal conceptual structure, which shows up as better reasoning depth, not just surface fluency.

The most interesting recent development is self-distillation from proof, the technique behind reasoning models like o1 and DeepSeek-R1. The model generates a hundred candidate solutions to a hard problem, a rule-based verifier (a compiler, a calculator, something that doesn't hallucinate) identifies which one is actually correct, and the model is fine-tuned on the reasoning chain that led there. No new human-labeled data required - the model is distilling its own best reasoning back into itself.

Two risks worth knowing before you build a distillation pipeline off a proprietary model's API output: model collapse, where the student inherits the teacher's narrow biases and loses the diverse responses it never saw at scale, and the licensing question - most proprietary API terms explicitly forbid using outputs to train a competing model.

The practical takeaway: when you're evaluating a small model for production, the question that predicts its ceiling isn't its parameter count, it's what curriculum it learned from - and whether that curriculum was legally yours to use.

#MachineLearning #KnowledgeDistillation #LLM #AIEngineering #ModelTraining

---

## Diagrams

### Two ways to transfer knowledge

\`\`\`mermaid
---
title: "Hard Labels vs Soft Labels: What the Student Actually Learns"
config:
  look: handDrawn
---
flowchart LR
    T["Teacher model<br/>(100B+ params)"] --> HL["Hard labels<br/>final answer only"]
    T --> SL["Soft labels<br/>full probability distribution<br/>at temperature T"]

    HL --> S1["Student learns:<br/>what is correct"]
    SL --> S2["Student learns:<br/>what is correct AND<br/>which wrong answers were close"]

    classDef teacher fill:#F3F0F8,stroke:#8880AE,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class T teacher
    class HL,SL process
    class S1,S2 output
\`\`\`

### Self-distillation from proof (the reasoning-model loop)

\`\`\`mermaid
---
title: "Self-Distillation From Proof: How Reasoning Models Improve Without New Human Data"
---
flowchart TD
    A["Hard math or code problem"] --> B["Model generates 100 candidate solutions"]
    B --> C{"Rule-based verifier<br/>compiler / calculator / checker"}
    C -->|"1 solution verified correct"| D["Extract the chain of thought<br/>that led to it"]
    C -->|"99 solutions rejected"| E["Discarded"]
    D --> F["Fine-tune the model<br/>on its own correct reasoning path"]
    F --> A

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class C decision
    class B,D process
    class E risk
    class F output
\`\`\``,s="/blog/series/deep-dives-03.svg",r={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},i="2026-08-03",o=3,l="Model Training",c=["Knowledge Distillation","Teacher-Student","SLM","Training","Machine Learning","LLM","AI Engineering","Model Training"],h=!1,d="Deep Dives",u="deep-dives",m={id:"403",slug:e,title:t,excerpt:n,content:a,featuredImage:s,author:r,publishedAt:i,readTime:o,category:l,tags:c,featured:h,series:d,seriesSlug:u};export{r as author,l as category,a as content,m as default,n as excerpt,h as featured,s as featuredImage,f as id,i as publishedAt,o as readTime,d as series,u as seriesSlug,e as slug,c as tags,t as title};
