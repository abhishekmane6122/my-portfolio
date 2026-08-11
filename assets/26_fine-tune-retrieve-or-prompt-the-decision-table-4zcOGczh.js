const g="226",e="fine-tune-retrieve-or-prompt-the-decision-table",n="Fine-Tune, Retrieve or Prompt: The Decision Table",t="Fine-tuning gets proposed for problems it structurally cannot solve about as often as it gets proposed for problems it can.",o=`Fine-tuning gets proposed for problems it structurally cannot solve about as often as it gets proposed for problems it can.

One question resolves most of these debates: are you teaching the model new facts, or new behaviour?

\`\`\`
FACTS       -> retrieval.     Fine tuning does not reliably
                              install facts, and it cannot
                              cite, update or revoke them.

BEHAVIOUR   -> fine tuning.   Format, tone, domain reasoning
                              style, a house output structure.

INSTRUCTIONS-> prompting.     Rules, constraints, task framing.
                              Cheapest, fastest to change.
\`\`\`

Most "fine-tune on our documentation" requests are a facts problem wearing a behaviour costume. Fine-tuning on documents produces a model that absorbed their style and will confidently invent facts in that style - worse than not knowing.

The fuller version:

| Need | Reach for | Why not the others |
|---|---|---|
| Current, changing information | Retrieval | Weights are frozen at training time |
| Citations and provenance | Retrieval | A fine-tune cannot point at a source |
| Per-user access control | Retrieval | Filter before the model sees it |
| A specific output format | Prompting, then schema | Cheaper and instantly reversible |
| Consistent tone at scale | Fine-tune (LoRA) | Prompting drifts across long contexts |
| Domain reasoning style | Fine-tune (LoRA) | Few-shot gets you 80 percent |
| A rule that must never break | Code, not the model | Neither prompt nor weights enforce |

There is a ladder here, and it is worth climbing in order:

\`\`\`
1  Prompt engineering            hours       reversible
2  Few shot examples             hours       reversible
3  Retrieval                     days        reversible
4  Prompt optimisation           days        reversible
5  LoRA fine tune                weeks       needs eval + serving
6  Full fine tune                months      rarely justified
\`\`\`

Skipping rungs is the common mistake. Most teams that fine-tuned successfully could have got 80 percent of the gain from rung 2 or 3, and would have found that out in a day rather than a month.

Two costs nobody budgets for when jumping straight to rung 5.

The dataset is the project, not the training run. Curating, labelling and validating a few thousand high-quality examples is where the weeks actually go, and a fine-tune on mediocre data is worse than no fine-tune at all.

And you now own a model. Base model deprecations mean retraining. Behaviour drift needs an eval set to detect. Serving needs adapter hot-swapping. It is a maintained artefact rather than a one-off piece of work.

The combination almost everyone converges on anyway: LoRA for behaviour, retrieval for facts, prompt for instructions, code for rules. Four layers doing four different jobs, and confusing any two of them is where the expensive mistakes live.

---

## Diagrams

### The decision tree

\`\`\`mermaid
---
title: "Fine-Tune, Retrieve or Prompt: The Decision Tree"
---
flowchart TD
    A["The model is not doing what we need"] --> B{"Facts or behaviour"}

    B -->|"Missing or wrong FACTS"| C{"Do facts change over time"}
    C -->|Yes| D["RETRIEVAL<br/>current, citable, revocable"]
    C -->|"No, and corpus is small and stable"| E["Long context with a cached prefix"]

    B -->|"Wrong BEHAVIOUR"| F{"Have you tried few shot"}
    F -->|No| G["Few shot examples<br/>hours, reversible"]
    F -->|"Yes, insufficient"| H{"Is it consistent across many cases"}
    H -->|Yes| I["LoRA fine tune<br/>weeks, needs eval and serving"]
    H -->|"No, case by case"| J["Prompt optimisation<br/>or dynamic example selection"]

    B -->|"Breaks a RULE"| K["CODE<br/>schema, validator, policy gate<br/>never a prompt or weights"]

    D --> L["Add a reranker before touching the model"]
    G --> M["Measure on a golden set before climbing further"]
    I --> N["Budget the DATASET, not the training run"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class D,E,G,I,J,L,M process
    class B,C,F,H decision
    class N risk
    class K output
\`\`\`

### The four layers, and what each one owns

\`\`\`mermaid
---
title: "The Four Layers and What Each One Owns"
---
flowchart LR
    A["Production AI feature"] --> B["CODE layer<br/>limits, permissions, validators"]
    A --> C["PROMPT layer<br/>role, task, tone, output shape"]
    A --> D["RETRIEVAL layer<br/>current facts with citations"]
    A --> E["WEIGHTS layer<br/>LoRA, behaviour and style"]

    B --> F["Fails LOUDLY<br/>enforceable"]
    C --> G["Changes in minutes<br/>degrades silently under long context"]
    D --> H["Updates without retraining<br/>supports per user filtering"]
    E --> I["Consistent at scale<br/>requires eval, serving, retraining"]

    F --> J["Confusing these layers is<br/>where the expensive mistakes live"]
    G --> J
    H --> J
    I --> J

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef store fill:#F3F0F8,stroke:#8880AE,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,C,E process
    class D store
    class F,G,H,I,J output
\`\`\``,s="/blog/series/production-reality-26.svg",r={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},i="2026-07-26",a=3,l="AI Engineering",c=["Fine-Tuning","RAG","Prompting","Decision Framework","AI Engineering","Machine Learning","LLMOps","System Design"],u=!1,h="Production Reality",d="production-reality",p=26,f=30,m={id:"226",slug:e,title:n,excerpt:t,content:o,featuredImage:s,author:r,publishedAt:i,readTime:a,category:l,tags:c,featured:u,series:h,seriesSlug:d,seriesPart:p,seriesTotal:f};export{r as author,l as category,o as content,m as default,t as excerpt,u as featured,s as featuredImage,g as id,i as publishedAt,a as readTime,h as series,p as seriesPart,d as seriesSlug,f as seriesTotal,e as slug,c as tags,n as title};
