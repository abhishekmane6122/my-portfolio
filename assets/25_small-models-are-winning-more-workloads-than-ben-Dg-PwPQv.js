const m="225",e="small-models-are-winning-more-workloads-than-benchmarks-suggest",n="Small Models Are Winning More Workloads Than Benchmarks Suggest",t='Most things we call an "AI feature" are three cheap tasks and one expensive one, glued together and priced as if all four were expensive.',s=`Most things we call an "AI feature" are three cheap tasks and one expensive one, glued together and priced as if all four were expensive.

An insurer was running every incoming claim through a frontier model — 120,000 claims a month, one call doing four jobs: classify the claim type, extract the policy number and date, flag fraud indicators, draft an acknowledgement.

Decomposed, it looked like this:

\`\`\`
Stage  Task                            Tier        Volume
1      Classify claim type             fast        100 percent
2      Extract policy number and date  fast        100 percent
3      Draft acknowledgement           workhorse   100 percent
4      Fraud indicator analysis        frontier      9 percent
\`\`\`

Stages 1 and 2 are structured extraction with verifiable outputs, which small models handle well when schema-constrained. Stage 4 is genuine reasoning over inconsistent narrative where being wrong is expensive, and it only runs on the 9 percent that stage 1 flags.

Blended cost fell 78 percent. Fraud detection accuracy was unchanged, because the hard cases still reached the model that was good at them.

Benchmarks mislead here because they measure general capability averaged across diverse tasks. Production tasks are narrow, and narrow is exactly where small models close the gap. A small model with a constrained schema and eight in-context examples will match a frontier model on "classify into 40 fixed categories", and it will not have the frontier model's tendency to reason itself out of the obvious answer.

Where small models genuinely win:

\`\`\`
Classification into a fixed label set
Structured extraction with a schema
Routing and intent detection
Guardrail and safety checks
Reranking
Format transformation
Short summarisation of a bounded input
\`\`\`

Where they do not, and pretending otherwise costs more than it saves:

\`\`\`
Multi step tool use over many turns
Long horizon planning
Reasoning over contradictory evidence
Anything where a wrong answer is expensive
Novel problems outside the fine tuning distribution
\`\`\`

What makes this economical is not "use a cheap model". It is a cascade with a real confidence signal:

\`\`\`
Cheap model attempts
  -> deterministic validation (schema, arithmetic, source string present)
  -> passes: done
  -> fails: escalate ONLY the failed fields, not the whole task
\`\`\`

That last clause matters more than it looks. Retrying the whole document on a workhorse model costs a full re-extraction. Retrying the three fields that failed costs three fields.

And the confidence signal has to be real. Model self-reported confidence is poorly calibrated. Use structural validation failure, a reranker score, verifier disagreement, or an explicit \`escalate(reason)\` tool call — models are considerably better at deciding "this needs a human" as an action than at producing a calibrated number.

---

## Diagrams

### Decompose the feature, then price each stage

\`\`\`mermaid
---
title: "Decompose the Feature, Then Price Each Stage"
---
flowchart TD
    A["One frontier call doing four jobs"] --> B["Decompose"]

    B --> C["Stage 1 classify<br/>FAST tier, 100 percent of volume"]
    C --> D["Stage 2 extract fields<br/>FAST tier, schema constrained"]
    D --> E["Deterministic validation<br/>format, arithmetic, source string present"]

    E --> F{"All fields valid"}
    F -->|Yes| G["Stage 3 draft response<br/>WORKHORSE tier"]
    F -->|No| H["Escalate ONLY the failed fields<br/>not the whole task"]
    H --> G

    G --> I{"Stage 1 flagged for review"}
    I -->|"9 percent"| J["Stage 4 deep analysis<br/>FRONTIER tier"]
    I -->|"91 percent"| K["Complete"]
    J --> K

    K --> L["Blended cost down 78 percent<br/>accuracy on hard cases unchanged"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,C,D,E,G,J process
    class F,I decision
    class H risk
    class K,L output
\`\`\`

### Confidence signals, ranked by trustworthiness

\`\`\`mermaid
---
title: "Confidence Signals Ranked by Trustworthiness"
---
flowchart TD
    A["Cheap model produced an answer"] --> B{"Which confidence signal"}

    B -->|"Best"| C["Deterministic validation failure<br/>schema, range, source string present"]
    B -->|"Strong"| D["Cross encoder or reranker score<br/>calibrated, already in the pipeline"]
    B -->|"Strong"| E["Explicit escalate() tool call<br/>models are good at this as an ACTION"]
    B -->|"Moderate"| F["Verifier model disagreement"]
    B -->|"Weak"| G["Sample divergence across N runs"]
    B -->|"AVOID"| H["Model self reported confidence<br/>poorly calibrated, overconfident"]

    C --> I["Escalate one tier"]
    D --> I
    E --> I
    F --> I
    G --> I
    H --> J["Do not gate on this alone"]

    I --> K["Set the threshold from a labelled set<br/>trade error cost against review cost explicitly"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class C,D,E,F,G,I process
    class B decision
    class H,J risk
    class K output
\`\`\``,a="/blog/series/production-reality-25.svg",o={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},r="2026-07-25",i=4,l="Edge AI",c=["Small Language Models","Edge AI","Cost","Benchmarks","AI Engineering","LLMOps","Cost Optimization","Machine Learning","System Design"],d=!1,h="Production Reality",g="production-reality",f=25,u=30,p={id:"225",slug:e,title:n,excerpt:t,content:s,featuredImage:a,author:o,publishedAt:r,readTime:i,category:l,tags:c,featured:d,series:h,seriesSlug:g,seriesPart:f,seriesTotal:u};export{o as author,l as category,s as content,p as default,t as excerpt,d as featured,a as featuredImage,m as id,r as publishedAt,i as readTime,h as series,f as seriesPart,g as seriesSlug,u as seriesTotal,e as slug,c as tags,n as title};
