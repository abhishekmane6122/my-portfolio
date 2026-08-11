const f="216",e="the-200-line-system-prompt-is-a-design-smell",t="The 200-Line System Prompt Is a Design Smell",n="If you read a 200-line system prompt from top to bottom, you can usually date it like tree rings. Each of those lines is a bug someone patched with English instead of code.",o=`If you read a 200-line system prompt from top to bottom, you can usually date it like tree rings.

\`\`\`
Lines 1-15     the original, coherent instruction
Lines 16-40    formatting rules added after a demo went badly
Lines 41-70    "IMPORTANT: never do X" added after an incident
Lines 71-110   edge cases, each from one support ticket
Lines 111-150  ALL CAPS restatements of lines 41-70,
               because the first version stopped working
Lines 151-200  contradictions with lines 16-40 that nobody has noticed
\`\`\`

Each of those lines is a bug someone patched with English instead of code. Three separate things go wrong as a result, and only one of them is about token cost.

The first is that prompt instructions are not enforcement.

\`\`\`
"Only approve expenses under $500."
"Never access records outside the user's reporting line."
"Always cite a source for factual claims."
\`\`\`

Every one of those is a hint. Every one will eventually be bypassed by an ambiguous request, a long context or an unusual phrasing, and when it happens the failure will look like a model problem when it is really an architecture problem. Each belongs in a different layer:

\`\`\`
approval limit    -> schema constraint + server side check
access scope      -> query filter applied by the data layer
citation required -> output validator, block and regenerate
\`\`\`

The second is that instructions compete for attention. Recall within a long context is strongest at the edges, so rule 47 of 80 sitting in the middle of a growing prompt is the one that gets ignored — and it gets ignored more often as the rest of the context grows around it.

The third is that contradictions become invisible. Line 22 says be concise, line 158 says always explain your reasoning fully. Different people, different complaints, months apart. The model resolves the conflict inconsistently, which reads to everyone else as randomness.

The refactor that works is mostly about moving rules to the layer that can actually hold them:

\`\`\`
Prompt        role, task, tone, output shape.  Under 40 lines.
Schema        anything with a value range or an enum.
Code          anything with a limit, a scope, or a permission.
Validator     anything that must be true of the output.
Eval          anything you would otherwise write in ALL CAPS.
\`\`\`

That last line is the practical test. If you find yourself wanting to write a rule in capitals, it is not a prompt rule. It is a missing test.

A rule in a prompt degrades silently. A rule in code fails loudly. In production, loud is the feature.

---

## Diagrams

### Where each rule actually belongs

\`\`\`mermaid
---
title: "Where Each Rule Belongs: Prompt, Schema, Code or Validator"
---
flowchart TD
    A["A new rule is needed"] --> B{"What kind of rule"}

    B -->|"Value range or fixed set"| C["Schema constraint<br/>maximum, enum, required"]
    B -->|"Permission or data scope"| D["Data layer<br/>filter injected, not optional"]
    B -->|"Must be true of the output"| E["Output validator<br/>block and regenerate on failure"]
    B -->|"Deterministic sequence"| F["Code path<br/>not an agent decision"]
    B -->|"Role, tone, output shape"| G["System prompt<br/>this is the only correct case"]

    C --> H["Fails loudly at the boundary"]
    D --> H
    E --> H
    F --> H
    G --> I["Degrades silently under long context"]

    I --> J{"Is silent degradation acceptable"}
    J -->|No| K["Move it out of the prompt"]
    J -->|Yes| L["Keep it, and cover it with an eval"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class C,D,E,F,G process
    class B,J decision
    class I,K risk
    class H,L output
\`\`\`

### Prompt bloat as a feedback loop

\`\`\`mermaid
---
title: "Prompt Bloat as a Feedback Loop"
---
flowchart LR
    A["Incident or complaint"] --> B["Add a rule to the prompt"]
    B --> C["Prompt grows"]
    C --> D["Middle of context loses attention"]
    D --> E["An older rule stops firing"]
    E --> F["New incident"]
    F --> G["Restate the old rule in ALL CAPS"]
    G --> C

    C --> H["Contradictions accumulate<br/>nobody re-reads the whole prompt"]
    H --> I["Behaviour looks random"]

    I --> J["Break the loop<br/>move rules to schema, code and validators<br/>cover each with an eval case"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B process
    class C,D,E,F,G,H,I risk
    class J output
\`\`\``,s="/blog/series/production-reality-16.svg",i={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},a="2026-07-16",r=4,l="AI Engineering",c=["System Prompt","Prompt Design","Refactoring","Context","AI Engineering","Prompt Engineering","LLMOps","Software Architecture","System Design"],d=!1,h="Production Reality",u="production-reality",p=16,m=30,g={id:"216",slug:e,title:t,excerpt:n,content:o,featuredImage:s,author:i,publishedAt:a,readTime:r,category:l,tags:c,featured:d,series:h,seriesSlug:u,seriesPart:p,seriesTotal:m};export{i as author,l as category,o as content,g as default,n as excerpt,d as featured,s as featuredImage,f as id,a as publishedAt,r as readTime,h as series,p as seriesPart,u as seriesSlug,m as seriesTotal,e as slug,c as tags,t as title};
