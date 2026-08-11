const m="112",e="chunking-the-retriever-fails-before-the-model-does",n="Chunking: The Retriever Fails Before the Model Does",t="Chunk size is the most consequential hyperparameter in a RAG system and the one most likely to have been left at whatever the tutorial used.",s=`Chunk size is the most consequential hyperparameter in a RAG system and the one most likely to have been left at whatever the tutorial used. Five hundred tokens with fifty tokens of overlap, chosen in the first hour of the project, silently determines whether the right answer is retrievable at all.

The retriever cannot return a passage that does not exist as a unit. If the answer spans a boundary, no amount of reranking, prompting or model upgrading recovers it.

---

## The tension in one sentence

A chunk must be **small enough to be a precise match** and **large enough to be a complete answer**. Those pull in opposite directions, and every chunking strategy is an attempt to satisfy both.

Small chunks embed tightly around one idea, so similarity scores are sharp and precision is high. They also fragment answers, strip context, and produce a top-k full of pieces that individually say nothing useful.

Large chunks preserve context and contain complete answers. They also dilute the embedding across several topics, which makes the vector a blurry average that matches everything weakly and nothing strongly.

\`\`\`
Query: "What is the escalation path for a Sev-1 incident?"

Chunk too small (128 tokens):
  "...notify the on-call lead immediately."
  Retrieved. Useless. No indication of which severity or which team.

Chunk too large (2048 tokens):
  Entire "Incident Management" chapter, covering severity definitions,
  paging, escalation, comms templates and postmortems.
  Embedding is an average of six topics. Matches weakly. Often ranked below
  a smaller chunk that mentions "escalation" three times but is about
  expense report escalation.
\`\`\`

---

## The strategies, in order of sophistication

### Fixed-size splitting

Split every N tokens with M tokens of overlap. Simple, fast, structure-blind.

It cuts sentences in half, separates tables from headers, and splits a numbered procedure across two chunks so that steps 1 through 4 are in one and 5 through 8 are in another. Retrieval returns the second half of a procedure with no indication that a first half exists.

Acceptable for homogeneous prose. Poor for anything with structure, which is most enterprise content.

### Recursive structure splitting

Split on the largest structural boundary that produces chunks under the size limit, falling back through a hierarchy: sections, then paragraphs, then sentences, then characters.

\`\`\`
Try splitting on:  \\n## (headings)
  still too large? \\n\\n (paragraphs)
    still too large? \\n (lines)
      still too large? ". " (sentences)
        still too large? hard character split
\`\`\`

This is the correct default for most text. It respects structure when structure exists and degrades gracefully when it does not. Most systems that upgrade from fixed-size to recursive see an immediate improvement with no other change.

### Semantic chunking

Embed each sentence, measure similarity between consecutive sentences, and split where similarity drops below a threshold. Boundaries land where the topic actually shifts rather than where the token counter happened to be.

Better boundaries, at the cost of an embedding pass over every sentence at ingestion and a threshold that needs tuning per corpus. Worth it for unstructured content such as transcripts, interview notes and long-form articles where headings do not exist.

### Hierarchical parent-child chunking

The strategy that resolves the core tension rather than compromising on it.

Index small child chunks for precise retrieval. Store a pointer from each child to its larger parent. Retrieve on children, return parents to the model.

\`\`\`mermaid
---
title: "Parent-Child Chunking: Precision and Completeness"
---
flowchart TD
    A["Source Document"] --> B["Split into parent chunks<br/>~2000 tokens, section level"]
    B --> C["Split each parent into children<br/>~300 tokens, paragraph level"]
    C --> D["Embed children only"]
    D --> E[("Index<br/>child vector plus parent_id")]

    F["Query"] --> G["Search children<br/>sharp, precise matching"]
    E --> G
    G --> H["Top k child chunks"]
    H --> I["Resolve parent_id<br/>deduplicate parents"]
    I --> J["Fetch parent text"]
    J --> K["Send parents to generator<br/>full context, complete answers"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef store fill:#F3F0F8,stroke:#8880AE,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A,F input
    class B,C,D,G,H,I,J process
    class E store
    class K output
\`\`\`

Search precision comes from the small chunks. Answer completeness comes from the large ones. The deduplication step matters: if three children of the same parent are retrieved, the parent is sent once, not three times.

This pattern is close to a default recommendation for structured enterprise documents.

---

## Metadata is part of the chunk

A chunk that reads "The threshold is 500 units" is unretrievable and unusable. It does not say what threshold, in what product, under what policy.

Prepending a structural header at ingestion fixes both problems at once, because the header is embedded along with the content.

\`\`\`
Source: Warehouse Operations Manual v4.2
Section: 3 Inventory Control > 3.4 Reorder Policy
Effective: 2026-01-15

The threshold is 500 units. Below this level, an automatic
purchase order is generated against the primary supplier.
\`\`\`

The chunk is now retrievable by "reorder threshold", "inventory policy" and "warehouse manual", and the generated answer can cite a real section. This costs perhaps 30 tokens per chunk and is one of the highest-return changes available in an ingestion pipeline.

Alongside the embedded header, the same fields belong in filterable metadata: document ID, version, effective date, access roles, document type, section path.

---

## Content-specific handling

One strategy applied uniformly to every content type is where most quality is lost. Different content has different natural units.

| Content type | Natural unit | Trap to avoid |
|---|---|---|
| Policy and procedure docs | Section under a heading | Splitting a numbered procedure |
| API documentation | One endpoint | Separating parameters from the endpoint |
| Source code | One function or class | Splitting mid-function; imports lost |
| Tables | Whole table, or row groups with the header repeated | Flattening to prose |
| Transcripts and meetings | Topic segment, speaker-aware | Fixed splits mid-exchange |
| Legal contracts | Clause | Splitting a clause from its definitions |
| FAQ content | Question plus answer | Separating the two |
| Slide decks | Slide plus speaker notes | Slide title alone as a chunk |

Tables deserve particular attention because they fail so completely. A table split across chunks loses its header row, and a chunk containing only data rows is both unretrievable and unreadable. The workable pattern is to extract tables at ingestion, keep each one whole where possible, repeat the header on every row group when a table must be split, and additionally index a natural-language summary of what the table contains.

---

## What this looks like in three real systems

### The pharmacy system that split a dosage table

A hospital pharmacy indexed medication guidelines. A pharmacist asked for the paediatric dosage of a common antibiotic and got a confident answer with a citation. The number was wrong.

The source was a dosage table with columns for age band, weight range and dose. Fixed-size chunking at 512 tokens had split it. The retrieved chunk contained rows for the 6 to 12 year band but the header row had been left in the previous chunk. The model saw three unlabelled numeric columns and reasonably assumed the second was the dose. It was the weight range.

Nothing errored. The citation was real. The answer was dangerous.

The rebuild treated tables as first-class objects:

\`\`\`mermaid
---
title: "Ingestion With Tables as First-Class Objects"
---
flowchart TD
    A["Source PDF"] --> B["Layout parser<br/>identify text, tables, figures"]
    B --> C{"Element type"}

    C -->|Prose| D["Recursive split<br/>with section header prepended"]
    C -->|Table| E["Extract whole table<br/>preserve header"]
    C -->|Figure| F["Caption plus vision description"]

    E --> G{"Table fits one chunk"}
    G -->|Yes| H["Index as single unit"]
    G -->|No| I["Split by row groups<br/>repeat header in every chunk"]

    H --> J["Also index a summary line<br/>this table gives paediatric dosing by weight"]
    I --> J

    D --> K[("Index")]
    F --> K
    J --> K

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef store fill:#F3F0F8,stroke:#8880AE,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933

    class A input
    class B,D,E,F,H,I,J process
    class C,G decision
    class K store
\`\`\`

The summary line in that flow is the underrated part. A dosage table contains almost no words a user would search for. A one-line description of what the table is for makes it retrievable by intent.

### The SaaS company whose API docs answered half a question

A developer platform indexed its API reference. Developers asking "what parameters does the webhook endpoint accept" got the endpoint description without the parameter table, or the parameter table without knowing which endpoint it belonged to.

The docs were organised as: heading, description paragraph, parameter table, response schema, code example. Around 900 tokens per endpoint. Chunked at 400 tokens, every endpoint became two or three unrelated fragments.

The fix was to make the chunk boundary match the document's actual unit of meaning. One endpoint, one chunk, regardless of size, up to a generous ceiling. Chunks ranged from 300 to 1,400 tokens and that variance was fine.

**Chunk size should follow the content's natural unit, not a global constant.** A configuration that enforces uniform chunk sizes across heterogeneous content is optimising for tidiness rather than retrieval.

### The consultancy that lost every answer to pronouns

A professional services firm indexed several thousand project reports. Retrieval quality was poor in a way that was hard to characterise until someone read the chunks.

\`\`\`
Chunk 847:
"This approach reduced processing time by 60 percent and was
subsequently adopted across the other three regions. The client
noted that it had exceeded their original target."

Which approach? Which client? Which regions?
\`\`\`

The chunk is a fluent paragraph and carries almost no retrievable content. The subject was named four paragraphs earlier. Thousands of chunks had this property.

Two changes, in increasing order of cost and impact:

1. **Prepend a structural header** with client name, project name, report section and date. Cheap, mechanical, and it fixed roughly half the cases.
2. **Contextual enrichment.** At ingestion, pass each chunk plus its surrounding document to a fast model with one instruction: write a one-sentence description of what this chunk is about within the document, and prepend it. This resolves pronouns and implicit subjects into searchable text.

\`\`\`
Generated context:
"This describes the inventory automation approach used in the
Meridian Retail supply chain project, 2025."

Original chunk:
"This approach reduced processing time by 60 percent..."
\`\`\`

The second technique costs one cheap model call per chunk at ingestion and is frequently the largest single retrieval improvement available for narrative corpora. It gets fuller treatment in a later chapter.

---

## Choosing a configuration

Chunk size is not a matter of taste. It is measurable against a labelled query set.

\`\`\`mermaid
---
title: "Choosing a Chunking Configuration by Measurement"
---
flowchart TD
    A["Build labelled set<br/>50 to 200 queries with known answer passages"] --> B["Pick 3 candidate configurations"]
    B --> C["Ingest the corpus with each"]
    C --> D["Measure context recall at 10"]
    D --> E{"Recall acceptable"}
    E -->|No| F{"Failure shape"}
    F -->|Answers split across chunks| G["Increase size or add parent linking"]
    F -->|Retrieved chunk is off topic| H["Decrease size or add semantic boundaries"]
    F -->|Chunk lacks identifying context| I["Add headers or contextual enrichment"]
    G --> C
    H --> C
    I --> C
    E -->|Yes| J["Check cost<br/>index size and tokens per query"]
    J --> K["Ship and record the decision"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,C,D,G,H,I,J process
    class E,F decision
    class K output
\`\`\`

Reasonable starting points, to be tested rather than trusted:

| Corpus type | Starting chunk size | Overlap | Strategy |
|---|---|---|---|
| Policy and procedure | 800 tokens | 100 | Recursive on headings, parent-child |
| Technical documentation | Natural unit, 300 to 1,500 | 0 | Structure-driven, no fixed size |
| Support tickets and chat | Whole conversation | 0 | One ticket, one chunk |
| Long-form reports | 500 child, 2,000 parent | 80 | Parent-child with contextual headers |
| Source code | One function | 0 | AST-aware, imports prepended |
| Transcripts | Topic segment | 1 turn | Semantic boundaries |

---

## Failure modes

| Symptom | Chunking cause |
|---|---|
| Answer exists in the corpus but never retrieves | Split across a boundary, no parent linking |
| Retrieved chunk is on topic but says nothing useful | Chunks too small, no surrounding context |
| Everything matches everything weakly | Chunks too large, embeddings diluted |
| Numeric answers are confidently wrong | Table split from its header row |
| Procedures returned half-finished | Numbered list split across chunks |
| Chunks full of unresolved pronouns | No contextual enrichment on narrative text |
| Citations point to the right document, wrong section | No section path in metadata |
| Quality varies wildly by document type | One strategy applied to heterogeneous content |

---

## Chunking decides what can ever be found

Chunking decides what is retrievable. Every downstream component operates on the units it produces, and none of them can recover an answer that was cut in half at ingestion.

The changes worth making first, roughly in order of return: switch from fixed-size to structure-aware splitting, prepend a section header to every chunk, adopt parent-child linking so precision and completeness stop competing, and handle tables as their own object type. Then measure on a labelled set rather than arguing about the number.

Re-chunking a corpus is a re-ingestion job, which is why this is worth getting close to right early. It is also why the labelled query set built during this work keeps paying: it is the only thing that makes the next re-ingestion a decision rather than a gamble.

---

*Next in this series: Hybrid search and reranking — two upgrades that beat a bigger model.*`,a="/blog/series/ai-systems-track-12.svg",r={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},o="2026-06-12",i=11,h="Retrieval",c=["Chunking","RAG","Document Processing","Retrieval","AI Engineering","Vector Search","System Design","LLMOps"],l=!1,d="AI Systems Track",u="ai-systems-track",p=12,g=30,f={id:"112",slug:e,title:n,excerpt:t,content:s,featuredImage:a,author:r,publishedAt:o,readTime:i,category:h,tags:c,featured:l,series:d,seriesSlug:u,seriesPart:p,seriesTotal:g};export{r as author,h as category,s as content,f as default,t as excerpt,l as featured,a as featuredImage,m as id,o as publishedAt,i as readTime,d as series,p as seriesPart,u as seriesSlug,g as seriesTotal,e as slug,c as tags,n as title};
