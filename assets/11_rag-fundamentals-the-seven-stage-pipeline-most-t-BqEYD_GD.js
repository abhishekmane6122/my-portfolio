const g="111",e="rag-fundamentals-the-seven-stage-pipeline-most-teams-get-wrong",t="RAG Fundamentals: The Seven-Stage Pipeline Most Teams Get Wrong",n='Retrieval-augmented generation is described so often as "search, then put the results in the prompt" that the description has become the problem.',s=`Retrieval-augmented generation is described so often as "search, then put the results in the prompt" that the description has become the problem. It hides six stages behind two words, and every one of those hidden stages is a place where quality is lost.

When a RAG system returns wrong or unfounded answers, the model is almost never the cause. The cause is upstream, in a stage nobody instrumented.

---

## Grounding, not knowledge injection

The purpose of retrieval is worth stating precisely, because it determines what "working" means.

RAG does not teach the model anything. It constrains what the model is answering from. The model's parametric knowledge is frozen, general and unattributable. Retrieved context is current, specific and citable. Putting evidence in the window shifts the model from recall to reading comprehension, which is a task it is much better at.

That framing produces the correct quality metric. The question is not "is the answer right" in the abstract. The question is **"is the answer supported by the retrieved evidence, and was the right evidence retrieved."** Those are two separate failures with two separate fixes, and conflating them is why RAG debugging goes in circles.

---

## The seven stages

\`\`\`mermaid
---
title: "The Seven-Stage RAG Pipeline"
---
flowchart TD
    A["Source Documents"] --> B["1 Ingestion<br/>parse, clean, extract structure"]
    B --> C["2 Chunking<br/>split with overlap and metadata"]
    C --> D["3 Indexing<br/>embed and store, dense plus lexical"]
    D --> E[("Vector Index and BM25 Index")]

    F["User Query"] --> G["4 Query Processing<br/>rewrite, expand, classify"]
    G --> H["5 Retrieval<br/>hybrid search, top n candidates"]
    E --> H
    H --> I["6 Reranking<br/>cross encoder, top k"]
    I --> J["7 Generation<br/>grounded prompt with citations"]
    J --> K["Answer with sources"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef store fill:#F3F0F8,stroke:#8880AE,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A,F input
    class B,C,D,G,H,I,J process
    class E store
    class K output
\`\`\`

Most implementations build stages 1, 3, 5 and 7 and skip 2, 4 and 6 as refinements to add later. Those three are where most of the recoverable quality lives.

---

### Stage 1: Ingestion

Everything downstream inherits the quality of this stage. A PDF parsed into a single wall of text with tables flattened into unreadable rows cannot be rescued by any amount of retrieval tuning.

What matters here:

- **Structure preservation.** Headings, sections, lists and tables carry meaning. A parser that discards them discards the signal that makes chunking work.
- **Table handling.** Tables flattened to prose are usually unusable. Extracting them separately, with their headers preserved, and indexing them as their own unit works far better.
- **Metadata capture.** Source, section path, author, date, access level, document type. Every one of these is a filter or a citation later, and capturing them at ingestion is trivial while reconstructing them afterwards is not.
- **Deduplication.** Enterprise corpora contain the same policy document in four places. Near-duplicate chunks crowd out diverse evidence in the top-k.

### Stage 2: Chunking

The stage most often left at a default. It gets its own chapter next, so briefly: chunk boundaries determine whether a complete answer can be retrieved as a unit. Fixed-size splitting at 512 tokens with no regard for structure will cut definitions in half and separate a table from its header.

The two properties that matter are **self-containedness** (can this chunk be understood alone) and **retrievability** (does it contain enough distinctive text to match a query).

### Stage 3: Indexing

Two indexes, not one. Dense vectors capture meaning; a lexical index captures exact terms. Product codes, error identifiers, function names and proper nouns retrieve poorly from dense vectors and perfectly from BM25.

Also at this stage: metadata must be indexed as filterable fields, not embedded in the text. Filtering by date range or access level needs to be a query constraint, not something the embedding is expected to encode.

### Stage 4: Query processing

Raw user queries are frequently bad search queries. Three transformations earn their cost:

**Rewriting for context.** "What about the second one?" is meaningless as a standalone search. Rewriting it against the conversation history into "What is the cancellation policy for the annual plan?" makes it retrievable. This single step fixes most multi-turn RAG failures.

**Decomposition.** "How do our refund and cancellation policies differ for enterprise customers?" is three retrievals, not one. Splitting it and retrieving for each sub-question recovers evidence a single query misses.

**Classification.** Not every query needs retrieval. "Thanks, that helps" does not. A cheap classifier that routes queries away from the retrieval path saves latency and cost and removes a category of bizarre answers caused by retrieving irrelevant context for conversational filler.

### Stage 5: Retrieval

Hybrid search, fusing dense and lexical results. The fusion method matters less than having both channels: reciprocal rank fusion is simple, robust and needs no score normalisation, which makes it a sound default.

Retrieve wide here. Twenty to fifty candidates, not five. The next stage exists to narrow them, and a candidate that was never retrieved cannot be recovered.

### Stage 6: Reranking

A cross-encoder scores each candidate against the query with full attention across both. It is dramatically more accurate than vector similarity, because vector similarity compares two independently produced summaries while a cross-encoder actually reads them together.

Cost is 30 to 100 milliseconds for fifty candidates with a small reranker. The accuracy gain is typically the largest single improvement available in a RAG pipeline, and it is one config change plus one service.

Reranking also fixes ordering, which matters independently. Placing the strongest evidence closest to the question exploits the attention profile discussed earlier in this series.

### Stage 7: Generation

The prompt does three jobs: it supplies the evidence, it constrains the model to that evidence, and it requires attribution.

\`\`\`
Answer the question using only the numbered sources below.
Cite the source number inline for every factual claim, like [2].
If the sources do not contain the answer, say exactly:
"The available documents do not cover this."
Do not use knowledge outside the sources.

Sources:
[1] ...
[2] ...

Question: ...
\`\`\`

The explicit refusal string matters more than it looks. A model with no sanctioned way to say "not found" will produce something plausible from parametric memory, and that output is indistinguishable in tone from a grounded answer.

---

## Where quality is actually lost

Attribution is the whole debugging problem. The two failures need separating before anything is fixed.

\`\`\`mermaid
---
title: "RAG Failure Attribution: Retrieval vs Generation"
---
flowchart TD
    A["Bad answer reported"] --> B{"Was the correct passage in the retrieved set"}
    B -->|No| C["Retrieval failure"]
    B -->|Yes| D["Generation failure"]

    C --> E{"Is it in the corpus at all"}
    E -->|No| F["Ingestion gap<br/>document missing or unparsed"]
    E -->|Yes| G{"Does a lexical search find it"}
    G -->|Yes| H["Dense retrieval gap<br/>add or fix hybrid search"]
    G -->|No| I["Chunking or embedding gap<br/>chunk unretrievable as written"]

    D --> J{"Does the answer contradict the evidence"}
    J -->|Yes| K["Faithfulness failure<br/>tighten grounding instruction"]
    J -->|No| L["Evidence present but ignored<br/>ordering or dilution problem"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933

    class A input
    class B,E,G,J decision
    class C,D,F,H,I,K,L risk
\`\`\`

Running twenty failed queries through this tree, and tallying where they land, tells you what to fix. The distribution is almost never what the team guessed.

---

## RAG against long context

Large context windows raised a fair question: why retrieve at all if everything fits?

The honest answer is that it depends on three properties.

| Property | Favours long context | Favours retrieval |
|---|---|---|
| Corpus size | Under roughly 100k tokens | Anything larger |
| Change rate | Static or rarely updated | Frequently updated |
| Prefix reuse | Identical across requests, cacheable | Query-dependent |
| Attribution needs | Loose | Citations required |
| Cost sensitivity | Low volume | High volume |
| Access control | Uniform | Per-user filtering needed |

Access control is the row that decides it for most enterprise systems. Long context has no mechanism for showing a user only what they are permitted to see. Retrieval does, because filtering happens before the model ever sees the content.

The realistic answer for most systems is both: retrieve to select the relevant subset, then use a generous context window so the subset does not need to be aggressively trimmed.

---

## Metrics that describe a RAG system

Four numbers, and reporting fewer than four hides which stage is broken.

| Metric | Question | Stage it grades |
|---|---|---|
| **Context recall** | Was the answer-bearing passage retrieved | 1 through 6 |
| **Context precision** | What fraction of retrieved passages were relevant | 5 and 6 |
| **Faithfulness** | Is every claim supported by the retrieved evidence | 7 |
| **Answer relevance** | Does the answer address the question asked | 4 and 7 |

Context recall is the ceiling. No prompt improvement fixes a system that did not retrieve the answer. Measure it first, and measure it against a labelled set where the correct passage is known.

---

## What this looks like in three real systems

### The telecom support bot that broke on the second question

A mobile operator's assistant handled first questions well and fell apart on follow-ups.

\`\`\`
User:  What is the data limit on the Unlimited Plus plan?
Bot:   Unlimited Plus includes 200 GB at full speed... [correct, cited]
User:  And what about the family version?
Bot:   [retrieves passages about family group discounts, answers about billing]
\`\`\`

The second query, sent to the retriever as written, is "And what about the family version?" There is nothing in that string about data limits or Unlimited Plus. The retriever did exactly what it was asked and returned documents about families.

The missing stage is query rewriting. One cheap model call, before retrieval:

\`\`\`
Given the conversation, rewrite the latest user message
as a standalone search query.

History: [last 3 turns]
Latest:  "And what about the family version?"
Rewrite: "data limit on the Unlimited Plus Family plan"
\`\`\`

Resolution rate on multi-turn conversations went from 54 percent to 87 percent. The retriever, the index, the embeddings and the generation prompt were all unchanged. **The most common RAG failure in any conversational product is that nobody rewrote the query.**

### The hospital knowledge base that leaked between departments

An internal clinical knowledge system indexed protocols, HR policies, and departmental guidance. Access rules were real: HR investigation records are not visible to clinical staff, and some protocols are restricted by specialty.

The implementation retrieved the top 20 passages, then filtered the results by the user's permissions, then generated an answer from what survived.

Two failures followed from that ordering.

The obvious one: when all 20 retrieved passages were restricted, the user got an empty context and a hallucinated answer from parametric memory, which is worse than a refusal.

The serious one: the generation prompt occasionally received a passage that the post-filter should have caught but did not, because permission was checked against document ID while the passage carried a chunk ID from a parent document with different inherited permissions.

The correct architecture makes permission a search constraint, not a result filter:

\`\`\`mermaid
---
title: "Permission-Aware RAG: Filter Inside the Search"
---
flowchart TD
    A["User Query"] --> B["Resolve identity<br/>roles, department, clearance"]
    B --> C["Build filter expression<br/>allowed_roles contains user roles"]
    C --> D["Vector search WITH filter<br/>filter applied inside the index"]
    D --> E["Candidates<br/>every one already permitted"]
    E --> F["Rerank"]
    F --> G{"Any evidence survived"}
    G -->|Yes| H["Generate with citations"]
    G -->|No| I["Explicit refusal<br/>no accessible documents cover this"]

    J[("Index<br/>permissions as filterable metadata")] --> D

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef store fill:#F3F0F8,stroke:#8880AE,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,C,D,E,F,H process
    class J store
    class G decision
    class I risk
\`\`\`

Three rules that follow, and they apply to every permission-aware RAG system:

1. **Permissions are indexed metadata**, denormalised onto every chunk at ingestion, not resolved at query time by joining to another system.
2. **The filter goes inside the search**, so an unauthorised passage is never a candidate.
3. **The prompt is never asked to respect access rules.** An instruction saying "do not reveal restricted content" is not a security control, because the content is already in the window.

### The manufacturer that thought it needed a better model

An industrial equipment maker built a RAG system over maintenance manuals. Answer accuracy sat at 62 percent. The proposal on the table was to move to a more capable and considerably more expensive model.

Before spending, they ran twenty failed queries through the attribution tree above and tallied the results:

| Failure category | Count | Fix |
|---|---|---|
| Correct passage not retrieved, exists in corpus | 11 | Retrieval problem |
| Correct passage retrieved but ranked 14th | 5 | Ranking problem |
| Correct passage in context, answer contradicted it | 2 | Grounding problem |
| Document not in corpus at all | 2 | Ingestion problem |

Sixteen of twenty failures were upstream of the model. A larger model would have fixed at most the two grounding failures.

What they did instead, in order of cost:

- Added a lexical index for part numbers and error codes (fixed 7 of the 11 retrieval failures)
- Added a cross-encoder reranker (fixed all 5 ranking failures)
- Added an explicit refusal string to the generation prompt (fixed both grounding failures)
- Ingested three manual revisions that had never been loaded (fixed both corpus gaps)

Accuracy went from 62 percent to 89 percent. Model cost went down slightly, because reranking meant fewer passages needed to be sent to the generator.

**Twenty failed queries and a tally sheet is the highest-return hour available in RAG work.** It replaces an opinion about what is broken with a distribution.

---

## Failure modes

| Symptom | Stage at fault |
|---|---|
| Answers cite the wrong document confidently | Stage 7, weak grounding instruction |
| Exact product codes never retrieve | Stage 3, dense-only index |
| Follow-up questions retrieve nonsense | Stage 4, no query rewriting |
| Right document, wrong section | Stage 2, chunks too large |
| Answer split across chunks, never assembled | Stage 2, chunks too small or no parent linking |
| Retrieval good, answers still wrong | Stage 6, poor ordering, or stage 7 dilution |
| Quality fine in testing, poor in production | Stage 1, production corpus parsed differently |
| Users see documents they should not | Stage 5, filters applied after retrieval instead of during |

That last row is a security finding, not a quality finding. Access filtering must be a constraint inside the search, never a post-filter on results, and never something the prompt is asked to respect.

---

## Seven stages, six of them upstream of the model

RAG is a seven-stage pipeline where six of the stages run before the model is called. Quality problems are distributed across those six far more often than they sit in the seventh.

The highest-return work, in order: add a lexical channel alongside dense retrieval, add a reranker, add query rewriting for multi-turn, and build a labelled set that measures context recall separately from faithfulness. None of these require a better model. All of them are usually worth more than one.

---

*Next in this series: Chunking — the retriever fails before the model does.*`,r="/blog/series/ai-systems-track-11.svg",a={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},i="2026-06-11",o=12,l="Retrieval",d=["RAG","Retrieval Pipeline","Vector DB","Chunking","AI Engineering","Vector Search","System Design","LLMOps"],c=!1,h="AI Systems Track",u="ai-systems-track",p=11,m=30,f={id:"111",slug:e,title:t,excerpt:n,content:s,featuredImage:r,author:a,publishedAt:i,readTime:o,category:l,tags:d,featured:c,series:h,seriesSlug:u,seriesPart:p,seriesTotal:m};export{a as author,l as category,s as content,f as default,n as excerpt,c as featured,r as featuredImage,g as id,i as publishedAt,o as readTime,h as series,p as seriesPart,u as seriesSlug,m as seriesTotal,e as slug,d as tags,t as title};
