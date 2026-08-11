const g="227",e="the-eval-set-is-the-real-prd",t="The Eval Set Is the Real PRD",s='A product spec for an AI feature that has no labelled examples is a wish. The eval set is the only artefact that actually says what "working" means.',n=`A product spec for an AI feature that has no labelled examples is a wish. The eval set is the only artefact that actually says what "working" means.

Traditional specs work because software is deterministic. "The user can filter by date" is testable by writing one test. For an AI feature, "the assistant answers support questions accurately" is not a spec, it is a category. Accurate how? On which questions? Compared to what?

Every one of those gaps gets filled during implementation by whoever is closest to the keyboard, and it gets filled differently each time.

The replacement is 150 labelled examples with a written rubric. That artefact answers what prose cannot:

\`\`\`
Which inputs count             the sampled distribution IS the scope
What correct looks like        the labels
What "good enough" means       the target score
Which failures are acceptable  the rubric's severity tiers
When it is done                the gate
\`\`\`

Three things change immediately once it exists.

Scope becomes concrete. "Handle customer questions" is unbounded. A stratified sample from real logs shows 62 percent are order status, 18 percent returns, 12 percent product questions, and 8 percent are a long tail nobody had considered. Now scope is a number, and that long tail becomes a documented decision rather than an oversight.

Disagreement surfaces before the build rather than after. Two people labelling the same 30 items independently and agreeing 61 percent of the time have just discovered the requirement is ambiguous. That is a spec bug caught in an afternoon, ahead of a quarter of engineering.

And "done" stops being an opinion. The gate is the target score on the held-out split, agreed before work starts.

On ownership: the PM writes the rubric, engineering builds the harness. What counts as a good answer is a product decision, not an engineering one. Handing rubric authorship to engineering is how eval sets end up measuring whatever is easiest to measure.

Two failure modes worth naming.

Invented examples. A set written from imagination tests the imagination of whoever wrote it. Sample from logs, or from user research if there is no traffic yet.

Sets that contain only interesting cases. Teams naturally collect the cases that surprised them, which skews hard, and the result is a system optimised for the tail and regressed on the body. Stratify in the real proportions.

The uncomfortable version of all this: if nobody can produce 150 labelled examples of the feature working, nobody knows what the feature is. That is a product gap rather than an evaluation gap, and shipping will not close it.

---

## Diagrams

### The eval set as the spec artefact

\`\`\`mermaid
---
title: "The Eval Set as the Spec Artefact"
---
flowchart TD
    A["Feature proposed"] --> B["Sample 150 real inputs<br/>from logs or user research"]
    B --> C["Stratify: easy, medium, hard<br/>in the REAL proportions"]

    C --> D["PM writes the rubric<br/>what counts as correct, severity tiers"]
    D --> E["Two people label 30 items independently"]
    E --> F{"Agreement above 80 percent"}

    F -->|No| G["The REQUIREMENT is ambiguous<br/>a spec bug, caught before the build"]
    G --> D
    F -->|Yes| H["Label the remaining items"]

    H --> I["Split: dev and held out test"]
    I --> J["Agree the target score<br/>this is the definition of done"]

    J --> K["Engineering builds the harness"]
    K --> L["Every change measured against it<br/>paired, with confidence intervals"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,C,D,E,H,I,K process
    class F decision
    class G risk
    class J,L output
\`\`\`

### Sampling defines scope, and skew defines your failures

\`\`\`mermaid
---
title: "Sampling Defines Scope, Skew Defines Your Failures"
---
flowchart TD
    A["Handle customer questions"] --> B{"How was the set built"}

    B -->|"Invented from imagination"| C["Tests the author's assumptions<br/>not the users' behaviour"]
    B -->|"Only interesting cases"| D["Skewed hard<br/>optimises the tail<br/>regresses the 70 percent body"]
    B -->|"Stratified sample from logs"| E["Scope becomes a number"]

    E --> F["Order status 62 percent"]
    E --> G["Returns 18 percent"]
    E --> H["Product questions 12 percent"]
    E --> I["Long tail 8 percent"]

    I --> J{"In scope for v1"}
    J -->|No| K["DOCUMENTED exclusion<br/>with a fallback path"]
    J -->|Yes| L["Labelled and covered"]

    C --> M["Score improves, complaints rise"]
    D --> M

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class E,F,G,H,I,L process
    class B,J decision
    class C,D,M risk
    class K output
\`\`\``,a="/blog/series/production-reality-27.svg",r={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},o="2026-07-27",i=3,l="LLMOps",c=["Evaluation","PRD","Product","LLMOps","AI Engineering","AIEvaluation","Product Management","MLOps"],h=!1,d="Production Reality",u="production-reality",p=27,f=30,m={id:"227",slug:e,title:t,excerpt:s,content:n,featuredImage:a,author:r,publishedAt:o,readTime:i,category:l,tags:c,featured:h,series:d,seriesSlug:u,seriesPart:p,seriesTotal:f};export{r as author,l as category,n as content,m as default,s as excerpt,h as featured,a as featuredImage,g as id,o as publishedAt,i as readTime,d as series,p as seriesPart,u as seriesSlug,f as seriesTotal,e as slug,c as tags,t as title};
