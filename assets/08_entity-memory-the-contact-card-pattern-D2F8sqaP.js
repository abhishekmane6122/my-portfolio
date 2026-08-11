const g="208",e="entity-memory-the-contact-card-pattern",t="Entity Memory: The Contact Card Pattern",n="There is a useful distinction between two things that sound similar. Semantic retrieval returns fragments of conversation about Sarah. Entity memory returns the current state of Sarah.",r=`There is a useful distinction between two things that sound similar. Semantic retrieval returns fragments of conversation about Sarah. Entity memory returns the current state of Sarah. The first is evidence, the second is an answer.

Entity memory stops storing conversation and starts storing records.

\`\`\`
ENTITY  person:sarah_chen
  role            Senior Analyst   (updated 2026-06-12, was: Analyst)
  relationship    reports to user
  projects        [q3_migration, vendor_review]
  source          turn 214, session 2026-06-12
  confidence      0.94

ENTITY  project:q3_migration
  status          in_progress
  deadline        2026-09-30
  stakeholders    [person:sarah_chen, team:ops]
  blockers        vendor contract pending
  source          turn 88, session 2026-05-30
  confidence      0.88
\`\`\`

When the user says "Sarah got promoted", the system does not append a log line. It writes a field, keeps the previous value, and stamps the source. That structure is what makes the store queryable, correctable and auditable, which a vector store does not give you.

This earns its place in any product where the same nouns recur across sessions — CRM copilots, project agents, account support, personal assistants. Anywhere a user would be annoyed to explain the same relationships twice.

Two problems are genuinely hard here, and the second is where projects stall.

Extraction is imperfect. "My manager Sarah" is trivial. "She said the vendor thing is sorted" needs two pronouns resolved and an implicit entity reference. Extraction quality sets the ceiling for everything downstream.

Merging and disambiguation is harder still. "Sarah", "Sarah Chen", "S. Chen" and "my manager" may be one entity or three people. Fragment the record and retrieval degrades. Merge two real people into one and you have produced a wrong record that will be asserted confidently for months.

That asymmetry is worth internalising: a false merge costs far more than a false split. A split produces incompleteness, which is detectable and recoverable. A merge produces a confident lie that propagates into every future answer.

Four controls make an entity store maintainable.

Use asymmetric thresholds — require noticeably higher confidence to merge than to create a new entity, so the system biases toward splitting.

Put provenance on every attribute: which session, which turn, what confidence. An attribute with no source cannot be traced, which means it cannot be corrected, only wiped.

Retain superseded values. "Analyst became Senior Analyst on this date" is more useful than the current value alone, and in regulated contexts the history is the actual requirement.

Give ambiguous merges a review state rather than a guess. Silently guessing is how one record quietly becomes two people.

An entity store without provenance cannot be fixed. It can only be rebuilt.

---

## Diagrams

### Extraction, resolution and the merge decision

\`\`\`mermaid
---
title: "Entity Memory: Extraction, Resolution and Merge"
---
flowchart TD
    A["Turn text<br/>Sarah got promoted last week"] --> B["Entity extraction<br/>NER plus LLM, schema constrained"]
    B --> C["Candidate: person named Sarah<br/>attribute: role changed"]

    C --> D["Resolution<br/>exact match, then normalised, then embedding"]
    E[("Entity Store")] --> D

    D --> F{"Match confidence"}
    F -->|"Above merge threshold, high"| G["Update existing entity<br/>supersede old value, keep history"]
    F -->|"Below create threshold, low"| H["Create new entity<br/>bias toward splitting"]
    F -->|"Ambiguous band"| I["Human review queue<br/>do not guess"]

    G --> J["Write attribute<br/>with source turn and confidence"]
    H --> J
    I --> K["Held, not applied"]

    J --> E

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef store fill:#F3F0F8,stroke:#8880AE,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,C,D,G,H,J process
    class E store
    class F decision
    class I,K risk
\`\`\`

### Why a false merge costs more than a false split

\`\`\`mermaid
---
title: "Why a False Merge Costs More Than a False Split"
---
flowchart TD
    A["Two mentions: S. Chen and Sarah Chen"] --> B{"Resolution decision"}

    B -->|"False split"| C["They were one person<br/>result: two partial records"]
    C --> D["Symptom: incomplete answers<br/>agent asks a question it should know"]
    D --> E["Detectable, recoverable<br/>merge later once evidence accumulates"]

    B -->|"False merge"| F["They were two people<br/>result: one corrupted record"]
    F --> G["Symptom: confident wrong attribution<br/>Sarah's role applied to a different person"]
    G --> H["Hard to detect, hard to unpick<br/>wrong data propagates into every answer"]

    E --> I["Design rule<br/>set the merge threshold higher than the create threshold"]
    H --> I

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B decision
    class C,D process
    class F,G,H risk
    class E,I output
\`\`\``,s="/blog/series/agent-memory-lineage-08.svg",o={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},a="2026-07-08",i=3,c="Agent Memory",l=["Entity Memory","Structured State","Agent Memory","Personalization","AI Engineering","Agentic AI","Knowledge Graph","LLMOps","Software Architecture"],h=!1,d="Agent Memory Lineage",u="agent-memory-lineage",p=8,m=30,y={id:"208",slug:e,title:t,excerpt:n,content:r,featuredImage:s,author:o,publishedAt:a,readTime:i,category:c,tags:l,featured:h,series:d,seriesSlug:u,seriesPart:p,seriesTotal:m};export{o as author,c as category,r as content,y as default,n as excerpt,h as featured,s as featuredImage,g as id,a as publishedAt,i as readTime,d as series,p as seriesPart,u as seriesSlug,m as seriesTotal,e as slug,l as tags,t as title};
