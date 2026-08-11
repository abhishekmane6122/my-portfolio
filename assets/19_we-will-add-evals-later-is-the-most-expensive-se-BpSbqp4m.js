const f="219",e="we-will-add-evals-later-is-the-most-expensive-sentence-in-ai",t='"We Will Add Evals Later" Is the Most Expensive Sentence in AI',n="Without an eval set you are not improving a system. You are changing it and hoping. The failure usually looks like this. A team iterates on a prompt for four months against a 60-item set.",o=`Without an eval set you are not improving a system. You are changing it and hoping.

The failure usually looks like this. A team iterates on a prompt for four months against a 60-item set. The score climbs from 0.71 to 0.84. Production complaints climb along with it.

Three things were wrong, and all of them are structural rather than careless.

The set was too small to measure what they were measuring.

\`\`\`
Set size 100   detectable difference  ~10 percentage points
Set size 300   detectable difference  ~6 points
Set size 1000  detectable difference  ~3 points
\`\`\`

At 60 items, none of those incremental improvements were distinguishable from noise. They were reading random variation as progress, one commit at a time.

The set was not stratified. It had been assembled from cases the team found interesting, which skews hard. Around 70 percent of real traffic was routine, and the set contained almost none of it, so they optimised the tail and regressed the body.

And dev and test were the same 60 items. Four months of iteration against a fixed set produces a prompt fitted to that set. That is not a metaphor — it is overfitting with a human in the gradient loop.

Re-measured on a stratified 240-item set drawn from logs and split 160 dev / 80 held out, the "improved" prompt scored below the original on routine questions.

The fix is not more evals, it is measurement discipline:

\`\`\`
Sample from production logs        not from imagination
Stratify: easy / medium / hard     in the real proportions
Write a rubric, check agreement    two labellers, above 80 percent
Split dev and test                 touch test rarely
Compare paired, not aggregate      same items, both variants
Report intervals, not points       "0.82, CI 0.74 to 0.88"
\`\`\`

One sequencing point makes all of that useful. Read 100 real outputs first and write a free-form note on what is wrong with each, then group the notes. That taxonomy is what your metrics should measure. Choosing metrics before doing error analysis is how teams end up with a score of 0.71 and no idea what to fix.

Two more things worth being direct about.

Use code wherever code will do. Valid JSON, citation present, length under limit, latency under budget — all deterministic, all free, all instant. Teams routinely reach for an LLM judge to answer questions a regex answers better.

And a judge is not ground truth. If it agrees with humans 88 percent of the time, a measured 0.80 is not the true rate. Calibrate it, know its error rates, correct for them.

The real cost of deferring this is not the eval work itself. It is that by the time it is obviously necessary, nobody can reconstruct what "correct" was supposed to mean.

---

## Diagrams

### Error analysis before metrics

\`\`\`mermaid
---
title: "Error Analysis Before Metrics"
---
flowchart TD
    A["Sample 100 real outputs<br/>from production logs"] --> B["Open coding<br/>free form note per output"]
    B --> C["Axial coding<br/>group notes into recurring modes"]
    C --> D["Failure taxonomy with counts"]

    D --> E["Rank by frequency times severity"]
    E --> F["Pick the top 2 or 3"]

    F --> G{"Can this be checked by code"}
    G -->|Yes| H["Deterministic evaluator<br/>free, instant, never drifts"]
    G -->|No| I["LLM judge with a binary rubric<br/>calibrated against human labels"]

    H --> J["Build the golden set<br/>stratified, targeting these modes"]
    I --> J
    J --> K["Metrics now map to fixes"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,C,D,E,F,H,I,J process
    class G decision
    class K output
\`\`\`

### The eval gate in CI

\`\`\`mermaid
---
title: "The Eval Gate in CI"
---
flowchart TD
    A["Pull request<br/>prompt, retrieval or model change"] --> B["Fast code checks<br/>under 60 seconds"]
    B --> C{"Schema, format, latency pass"}
    C -->|No| D["Block, fail fast"]
    C -->|Yes| E["Full eval on the DEV split"]

    E --> F["Paired comparison<br/>same items, current production as baseline"]
    F --> G{"Any metric regressed<br/>beyond the confidence interval"}
    G -->|Yes| H["Block, name the metric and the delta"]
    G -->|No| I{"Improvement being claimed"}

    I -->|No| J["Merge, no claim recorded"]
    I -->|Yes| K["Confirm ONCE on the held out TEST split"]

    K --> L{"Confirmed"}
    L -->|No| M["Overfitted to dev<br/>do not claim the gain"]
    L -->|Yes| N["Merge and record"]

    N --> O["Shadow deploy on live traffic"]
    O --> P["Canary, then rollout"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,E,F,K,O process
    class C,G,I,L decision
    class D,H,M risk
    class J,N,P output
\`\`\``,s="/blog/series/production-reality-19.svg",r={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},i="2026-07-19",a=3,l="LLMOps",c=["Evaluation","Regression Testing","LLMOps","Golden Set","AI Engineering","AIEvaluation","MLOps","Software Architecture"],d=!1,h="Production Reality",m="production-reality",u=19,p=30,g={id:"219",slug:e,title:t,excerpt:n,content:o,featuredImage:s,author:r,publishedAt:i,readTime:a,category:l,tags:c,featured:d,series:h,seriesSlug:m,seriesPart:u,seriesTotal:p};export{r as author,l as category,o as content,g as default,n as excerpt,d as featured,s as featuredImage,f as id,i as publishedAt,a as readTime,h as series,u as seriesPart,m as seriesSlug,p as seriesTotal,e as slug,c as tags,t as title};
