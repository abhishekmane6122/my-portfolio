const d="212",e="self-reflection-memory-turning-outcomes-into-lessons",t="Self-Reflection Memory: Turning Outcomes Into Lessons",n="A chess player reviewing a loss does not only record the moves. They ask which pattern they missed. Over time those notes end up more valuable than the game records themselves.",s=`A chess player reviewing a loss does not only record the moves. They ask which pattern they missed. Over time those notes end up more valuable than the game records themselves.

Every other memory tier stores what happened or what is true. Reflection memory stores why something went wrong and what to do differently, and it is the only tier that converts a sparse outcome signal into a dense learning signal without touching model weights.

The loop is four steps:

\`\`\`
1. Attempt        agent runs the task, gets an outcome
2. Reflect        structured prompt: root cause, not restatement
3. Store          insight written to a reflection buffer
4. Retrieve       relevant past reflections injected before future attempts
\`\`\`

The whole technique lives or dies on step 2, and most implementations get it wrong the same way.

\`\`\`
Useless reflection:
  "The query failed because of a schema error."

Useful reflection:
  "This warehouse uses fiscal_qtr in 'YYYY-QN' format, not a
   'quarter' column. Inspect the schema before writing any query."
\`\`\`

The first restates the observation. The second changes behaviour on the next attempt, which is the only test that matters.

A prompt that produces the second one consistently:

\`\`\`
The attempt failed. Answer in this structure:

ROOT CAUSE     what actually caused this, one sentence
                (not what happened, why it happened)
GENERALISABLE  is this specific to this case, or will it
                recur? If specific, say SPECIFIC.
RULE           a single actionable constraint for next time,
                phrased as an instruction
\`\`\`

That middle field is underrated. It stops one-off failures from filling the buffer with lessons that will never apply again.

Three bounds keep this from becoming the problem it was meant to solve.

Cap the attempts. An agent that has failed three times with three reflections is not converging, and attempt four spends money to arrive in the same place.

Cap the buffer. A growing reflection list reintroduces the context problem you were trying to avoid. Keep it short, rank by relevance to the current task, and let old reflections decay.

Promote what recurs. A reflection that fires successfully across many tasks is not a reflection any more, it is a procedure. Move it to the skill library. That promotion path is what keeps the buffer small and the library useful.

Set against the previous tier:

\`\`\`
Procedural memory    how to do it, when it works
Reflection memory    why it broke, what to avoid
Promotion path       reflection -> procedure, once it recurs
\`\`\`

An agent that fails the same way twice does not have a model problem. It has a memory problem, and this is the tier that fixes it.

---

## Diagrams

### The reflect-then-store loop

\`\`\`mermaid
---
title: "The Reflect-Then-Store Loop"
---
flowchart TD
    A["Task attempt"] --> B{"Outcome"}
    B -->|Success| C["Extract candidate procedure"]
    B -->|Failure or partial| D["Reflection prompt<br/>root cause, generalisable, rule"]

    D --> E{"Generalisable"}
    E -->|Specific to this case| F["Discard<br/>do not pollute the buffer"]
    E -->|Will recur| G["Write insight to reflection buffer"]

    G --> H[("Reflection Buffer<br/>bounded, decaying, ranked")]
    C --> I[("Skill Library")]

    H --> J{"Attempts remaining"}
    J -->|Yes| K["Inject relevant reflections<br/>near the end of context"]
    K --> A
    J -->|No| L["Terminate<br/>return reflections as a diagnostic report"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef store fill:#F3F0F8,stroke:#8880AE,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class C,D,G,K process
    class H,I store
    class B,E,J decision
    class F,L risk
\`\`\`

### Promotion: reflection becomes procedure

\`\`\`mermaid
---
title: "Promoting a Reflection Into a Procedure"
---
flowchart LR
    A["Reflection written<br/>inspect schema before querying"] --> B["Applied on task 2<br/>outcome: success"]
    B --> C["Applied on task 7<br/>outcome: success"]
    C --> D["Applied on task 15<br/>outcome: success"]

    D --> E{"Recurrence and hit rate<br/>above promotion threshold"}
    E -->|No| F["Stays in reflection buffer<br/>subject to decay"]
    E -->|Yes| G["Promote to procedure"]

    G --> H["Write signature<br/>tasks involving warehouse queries"]
    G --> I["Write preconditions<br/>schema endpoint reachable"]
    G --> J["Write steps<br/>concrete, ordered"]

    H --> K[("Skill Library")]
    I --> K
    J --> K

    K --> L["Reflection buffer stays small<br/>library grows with proven skills"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef store fill:#F3F0F8,stroke:#8880AE,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,C,D,G,H,I,J process
    class K store
    class E decision
    class F,L output
\`\`\``,o="/blog/series/agent-memory-lineage-12.svg",r={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},i="2026-07-12",a=4,l="Agent Memory",c=["Self-Reflection","Agent Memory","Learning","Feedback Loops","AI Engineering","Agentic AI","LLMOps","System Design","Software Architecture"],h=!1,f="Agent Memory Lineage",u="agent-memory-lineage",p=12,m=30,g={id:"212",slug:e,title:t,excerpt:n,content:s,featuredImage:o,author:r,publishedAt:i,readTime:a,category:l,tags:c,featured:h,series:f,seriesSlug:u,seriesPart:p,seriesTotal:m};export{r as author,l as category,s as content,g as default,n as excerpt,h as featured,o as featuredImage,d as id,i as publishedAt,a as readTime,f as series,p as seriesPart,u as seriesSlug,m as seriesTotal,e as slug,c as tags,t as title};
