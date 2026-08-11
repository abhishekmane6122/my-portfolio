const p="210",e="semantic-memory-facts-that-outlive-the-session",t="Semantic Memory: Facts That Outlive the Session",n="You know Paris is the capital of France. You almost certainly have no idea when you learned it. That detachment from the moment of learning is what makes a fact a fact, and it is the...",s=`You know Paris is the capital of France. You almost certainly have no idea when you learned it. That detachment from the moment of learning is what makes a fact a fact, and it is the distinction this tier is built on.

Semantic memory stores what is true, with no timeline attached. Episodic memory answers "what happened in March". Semantic memory answers "what is this customer's deployment target", and the answer does not depend on which session it came from.

This is the tier most systems are missing, and its absence produces the most common complaint about AI assistants: it asks the same question every session.

Three problems, in ascending order of difficulty.

Extraction, which means turning conversation into declarative facts.

\`\`\`
"Oh yeah, we moved off MySQL last quarter"
    -> fact: primary_database != MySQL   (as of 2026-Q2)
    -> follow-up needed: what is it now
\`\`\`

Good extraction produces the fact and also notices the gap it just opened.

Deduplication, where string matching does not help you.

\`\`\`
"The user prefers dark mode"
"User has dark theme enabled"
\`\`\`

One fact, two phrasings, no overlapping keys. Cosine similarity above about 0.92 catches this. Without dedup the store fills with restatements, and retrieval starts returning five versions of the same thing.

Contradiction, which is the genuinely hard one. A new fact conflicts with a stored one, and there are four cases. Most implementations handle the first two:

\`\`\`
Correction      user changed jobs        -> supersede, keep history
Error           misextraction            -> discard, lower source confidence
Refinement      more specific version    -> replace with the finer grain
Scope           both true, different
                contexts                 -> store BOTH with qualifiers
\`\`\`

That fourth case is what quietly corrupts stores. "The database is Postgres" and "The database is MongoDB" look like a contradiction right up until you learn one refers to the analytics stack and the other to the application stack. Facts without scope generate contradictions that are not contradictions, and a resolver that forces a winner will delete a true fact every time.

Two things are non-negotiable if you want a store you can actually operate.

Provenance on every fact — session, turn, confidence, extraction model version. A fact you cannot trace is a fact you cannot correct.

Supersede rather than overwrite. "Conservative became moderate on this date" is more useful than the current value alone, and in regulated domains that history is the requirement rather than a nice-to-have.

For scale: one financial product's semantic block came to about 180 tokens injected every session. Repeat-question complaints went to zero, and advisors started reading it as a pre-call briefing. 180 tokens was the whole fix.

---

## Diagrams

### The write path: extract, dedupe, resolve

\`\`\`mermaid
---
title: "Semantic Memory Write Path: Extract, Dedupe, Resolve"
---
flowchart TD
    A["Turn text"] --> B["Fact extractor<br/>schema constrained, declarative output"]
    B --> C["Candidate fact plus source turn"]

    C --> D["Embed and search existing facts"]
    E[("Semantic Fact Store")] --> D

    D --> F{"Similarity above dedup threshold"}
    F -->|No| G["Insert as new fact<br/>with provenance and confidence"]
    F -->|Yes| H["Semantic comparison"]

    H --> I{"Relationship"}
    I -->|Same meaning| J["Merge, refresh timestamp and sources"]
    I -->|More specific| K["Refine, replace with finer grain"]
    I -->|Contradicts| L{"Scoped differently"}

    L -->|Yes| M["Store BOTH with scope qualifiers<br/>analytics stack vs application stack"]
    L -->|No| N{"Newer and better sourced"}
    N -->|Yes| O["Supersede, retain old value in history"]
    N -->|Ambiguous| P["Flag for confirmation<br/>ask the user or a reviewer"]

    G --> E
    J --> E
    K --> E
    M --> E
    O --> E

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef store fill:#F3F0F8,stroke:#8880AE,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933

    class A input
    class B,C,D,G,J,K,M,O process
    class E store
    class F,I,L,N decision
    class P risk
\`\`\`

### Episodic vs semantic: two questions, two stores

\`\`\`mermaid
---
title: "Episodic vs Semantic: Two Questions, Two Stores"
---
flowchart LR
    A["Incoming question"] --> B{"What is being asked"}

    B -->|"What did we discuss on the 14th"| C["EPISODIC<br/>timestamped, session bounded"]
    B -->|"What is the deployment target"| D["SEMANTIC<br/>timeless, deduped, scoped"]
    B -->|"Both"| E["Query both, reconcile"]

    C --> F["Returns: episode summaries<br/>with dates and decisions"]
    D --> G["Returns: current facts<br/>with provenance and history"]

    F --> H{"Conflict between stores"}
    G --> H
    E --> H

    H -->|Yes| I["Semantic store wins on facts<br/>episodic wins on chronology"]
    H -->|No| J["Inject both"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef store fill:#F3F0F8,stroke:#8880AE,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class C,D store
    class E,F,G,I process
    class B,H decision
    class J output
\`\`\``,o="/blog/series/agent-memory-lineage-10.svg",a={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},i="2026-07-10",r=4,c="Agent Memory",l=["Semantic Memory","Fact Store","Agent Memory","Deduplication","AI Engineering","Agentic AI","LLMOps","Knowledge Graph","Software Architecture"],h=!1,d="Agent Memory Lineage",m="agent-memory-lineage",u=10,f=30,w={id:"210",slug:e,title:t,excerpt:n,content:s,featuredImage:o,author:a,publishedAt:i,readTime:r,category:c,tags:l,featured:h,series:d,seriesSlug:m,seriesPart:u,seriesTotal:f};export{a as author,c as category,s as content,w as default,n as excerpt,h as featured,o as featuredImage,p as id,i as publishedAt,r as readTime,d as series,u as seriesPart,m as seriesSlug,f as seriesTotal,e as slug,l as tags,t as title};
