const p="104",e="embeddings-and-vector-spaces-the-geometry-behind-retrieval",n="Embeddings and Vector Spaces: The Geometry Behind Retrieval",t="Retrieval systems are usually debugged at the wrong layer. When answers are bad, attention goes to the prompt, then the model, then the reranker.",a=`Retrieval systems are usually debugged at the wrong layer. When answers are bad, attention goes to the prompt, then the model, then the reranker. The embedding model, chosen in an afternoon at the start of the project and never revisited, is treated as settled infrastructure.

It is not settled infrastructure. It is the function that decides what "similar" means for the entire system, and every retrieval failure downstream of it is a consequence of that definition.

---

## What an embedding is

An embedding model maps a piece of text to a fixed-length vector of floating point numbers, typically between 384 and 4,096 dimensions. The training objective arranges the space so that texts with related meaning land near each other and unrelated texts land far apart.

\`\`\`
"How do I reset my password?"     -> [0.021, -0.184, 0.443, ...]
"I forgot my login credentials"   -> [0.019, -0.176, 0.451, ...]   near
"What is the refund policy?"      -> [-0.312, 0.088, -0.201, ...]  far
\`\`\`

Nothing about this is magic and nothing about it is guaranteed. The space reflects the training data and the training objective. A model trained on web text and question-answer pairs has a notion of similarity shaped by web text and question-answer pairs. Point it at legal clauses, medical notes or internal ticket jargon and the geometry may not carve the space along the boundaries your users care about.

---

## How the space gets built

Two training objectives dominate, and the difference between them explains a lot of production behaviour.

**Contrastive learning** pulls positive pairs together and pushes negatives apart. The quality of the result depends heavily on the *hard negatives*: examples that look similar on the surface but should not match. A model trained without hard negatives produces a space where superficially similar text clusters regardless of meaning, which is exactly the failure mode where a query about "cancelling a subscription" retrieves passages about "cancelling an order".

**Matryoshka representation learning** trains the model so that the first \`k\` dimensions of the vector are themselves a usable embedding. A 1,536-dimension vector can be truncated to 512 or 256 and still work, with graceful rather than catastrophic quality loss. This turns dimensionality into a runtime knob rather than a permanent decision, and it is the single most useful property to look for when selecting a model today.

---

## Distance metrics and the normalisation trap

Three metrics are in common use.

| Metric | Formula shape | Behaviour |
|---|---|---|
| **Cosine similarity** | Dot product of unit vectors | Measures direction only, ignores magnitude |
| **Dot product** | Raw inner product | Direction and magnitude, favours longer vectors |
| **Euclidean (L2)** | Straight-line distance | Direction and magnitude, sensitive to scale |

On normalised vectors, cosine and dot product produce identical rankings, and L2 produces the same ranking as well. On unnormalised vectors they do not, and the difference is not subtle.

The failure looks like this: an index configured for cosine similarity, fed unnormalised vectors, silently returns results biased toward whichever documents happen to have larger vector norms. Retrieval quality drops by a few points, nothing errors, and the cause is invisible for months.

**The rule: normalise at write time, normalise at query time, and configure the index to match.** Verify it once with a synthetic test rather than assuming the client library does it.

---

## The full retrieval geometry

\`\`\`mermaid
---
title: "The Full Retrieval Geometry: Ingestion to Reranking"
---
flowchart LR
    A["Document Corpus"] --> B["Chunker"]
    B --> C["Embedding Model<br/>text to vector"]
    C --> D["Normalise"]
    D --> E[("Vector Index<br/>HNSW or IVF")]

    F["User Query"] --> G["Same Embedding Model"]
    G --> H["Normalise"]
    H --> I["ANN Search<br/>top k by cosine"]
    E --> I
    I --> J["Candidate Set"]
    J --> K["Reranker<br/>cross encoder"]
    K --> L["Final Context"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef store fill:#F3F0F8,stroke:#8880AE,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A,F input
    class B,C,D,G,H,I,K process
    class E store
    class J,L output
\`\`\`

Two details in that diagram are load-bearing.

**"Same Embedding Model" is not a suggestion.** Query and document vectors must come from the same model and the same version. Mixing versions produces a space where nothing is where it should be, and the symptom is a system that returns plausible-looking but consistently wrong results.

**The candidate set is not the answer.** Approximate nearest neighbour search optimises for speed, and it is deliberately imperfect. Retrieving 50 candidates and reranking to 5 with a cross-encoder consistently outperforms retrieving 5 directly, because the reranker sees the query and document together rather than comparing two independently produced vectors.

---

## Bi-encoder versus cross-encoder, and why both exist

This is the central architectural tradeoff in retrieval.

A **bi-encoder** embeds the query and the document separately. Document vectors can be computed once at ingestion and indexed. Query time is a single embedding plus an index lookup. Fast, scalable to hundreds of millions of documents, and fundamentally limited: the document vector was computed without knowing the query.

A **cross-encoder** takes query and document together as one input and produces a relevance score. Far more accurate, because attention runs across both. Also far more expensive, because nothing can be precomputed. Scoring a query against a million documents with a cross-encoder is not a thing anyone does.

The production answer is both, in sequence. Bi-encoder narrows a million to fifty. Cross-encoder sorts fifty into a ranked five. This two-stage shape is close to universal in serious retrieval systems.

There is a third point on the spectrum. **Late interaction** models such as ColBERT store a vector per token rather than per document, and score by summing the best match for each query token across the document. It sits between the two on both accuracy and cost, and it gets its own treatment later in this series.

---

## Dimensions, quantization and the storage question

Storage cost is straightforward arithmetic and it surprises people at scale.

\`\`\`
10 million chunks × 1,536 dimensions × 4 bytes (float32) = ~61 GB
\`\`\`

Plus index overhead, which for a graph index like HNSW can be substantial. That is a real infrastructure line item, and it is compressible.

| Approach | Storage per vector (1,536 dim) | Typical recall retention |
|---|---|---|
| float32 | 6,144 bytes | Baseline |
| float16 | 3,072 bytes | Essentially unchanged |
| int8 quantized | 1,536 bytes | 97 to 99 percent |
| binary quantized | 192 bytes | 90 to 95 percent, needs rescoring |
| Matryoshka truncation to 512 | 2,048 bytes | 95 to 98 percent |

Binary quantization combined with a rescoring pass over the top candidates is a strong pattern at very large scale: search cheaply over binary vectors, then rescore the top few hundred with full-precision vectors held separately. Storage drops by more than an order of magnitude and end-to-end recall barely moves.

---

## Choosing an embedding model

Benchmark leaderboards are a starting point and nothing more. A model that ranks well on a general benchmark can perform badly on domain text, and the only reliable way to know is to test on your own data.

\`\`\`mermaid
---
title: "Selecting an Embedding Model Against a Labelled Set"
---
flowchart TD
    A["Need an embedding model"] --> B["Build a labelled query set<br/>50 to 200 real queries with known answers"]
    B --> C["Shortlist 3 to 5 candidates"]
    C --> D["Embed the corpus with each"]
    D --> E["Measure recall at 10 and MRR"]
    E --> F{"Domain gap visible"}
    F -->|Yes| G["Consider domain fine tuning<br/>or hybrid with BM25"]
    F -->|No| H{"Cost and latency acceptable"}
    G --> H
    H -->|Yes| I["Ship and pin the version"]
    H -->|No| J["Reduce dimensions<br/>or quantize"]
    J --> E

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,C,D,E,G,J process
    class F,H decision
    class I output
\`\`\`

The labelled query set built in step two is the most valuable artefact produced by this process. It outlives the model choice, it catches regressions when anything upstream changes, and it converts "retrieval feels worse" into a number.

The selection criteria that matter, roughly in order:

1. **Recall on your own labelled set.** Everything else is secondary.
2. **Dimension flexibility.** Matryoshka support turns a permanent decision into a tunable one.
3. **Context length of the embedding model.** A model with a 512-token limit forces small chunks whether or not that suits the content.
4. **Multilingual coverage**, if the corpus is multilingual. General models degrade sharply outside their training languages.
5. **Self-hostable or API.** Data residency requirements frequently decide this before quality does.
6. **Cost per million tokens embedded**, which matters at ingestion and barely at query time.

---

## Embedding drift, versioning and the migration nobody plans

Embedding models get deprecated and upgraded. When that happens, the entire index has to be rebuilt, because vectors from two different models are not comparable.

This is a migration, not a config change, and it needs to be treated like one.

- **Store the model name and version as metadata on every vector.** Without this, a partially migrated index is undetectable.
- **Build the new index alongside the old one.** Dual-write during the transition.
- **Compare on the labelled query set before cutting over.** A newer model is not automatically better on your corpus.
- **Budget the re-embedding cost.** Ten million chunks is a real ingestion job, not a background task.

Systems that skip the version metadata discover the problem when a subset of documents mysteriously stops being retrievable and nobody can explain why.

---

## What this looks like in three real systems

### A hardware distributor whose part numbers never retrieved

An industrial supplier built a product search assistant over 400,000 catalogue items. Natural language worked well. "Waterproof connector for outdoor use" returned sensible results.

Then customers started searching the way customers actually search: \`M12-A-4P-IP68\`. Nothing useful came back. Ever.

The cause is structural, not a tuning issue. An embedding model maps text to a point in semantic space. A part number has no semantic content. \`M12-A-4P-IP68\` and \`M12-A-5P-IP67\` are nearly identical strings describing different products, and they embed to nearly identical vectors. Meanwhile the correct product page might embed further away because it also contains a long marketing description that dominates the vector.

The fix was not a better embedding model. It was adding a lexical index alongside the dense one and routing on query shape:

\`\`\`mermaid
---
title: "Hybrid Routing by Query Shape: Identifiers vs Language"
---
flowchart TD
    A["Search Query"] --> B{"Contains an identifier pattern"}
    B -->|Yes| C["BM25 exact match<br/>weighted heavily"]
    B -->|No| D["Dense semantic search"]
    B -->|Mixed| E["Hybrid<br/>reciprocal rank fusion"]

    C --> F["Candidate set"]
    D --> F
    E --> F
    F --> G["Cross encoder rerank"]
    G --> H["Results"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class C,D,E,F,G process
    class B decision
    class H output
\`\`\`

Exact-match retrieval is a lexical problem. No dense model solves it, and every catalogue, ticketing, code search and documentation system eventually learns this.

### A bank where "similar" meant the wrong thing

A compliance team indexed internal policy documents to answer questions like "what approval is needed for a wire transfer above the reporting threshold".

Retrieval consistently returned documents about *wire transfer procedures* rather than *approval thresholds*. Both are about wire transfers. The general-purpose embedding model, trained largely on web text, had learned a notion of similarity dominated by topic rather than by the specific relation the compliance team cared about.

Two things fixed it, in this order of impact:

1. **A labelled query set of 120 real compliance questions with known correct passages.** This turned "retrieval feels off" into recall@10 of 0.58, which is a number that can be improved and defended.
2. **A cross-encoder reranker.** Recall@10 was already 0.58, meaning the right passage was usually in the candidate set and just not ranked first. Reranking moved answer accuracy from 61 percent to 88 percent without changing the embedding model at all.

The embedding model was only replaced later, and it was worth about four points. The reranker was worth twenty-seven. **Measure before replacing.**

### A media archive that quietly broke

A newsroom's archive search stopped surfacing anything published before a certain date. No error, no alert, no deploy that obviously caused it.

Six weeks earlier, a routine dependency upgrade had bumped the embedding client library, which changed the default model. New documents were embedded with the new model. Old documents still carried vectors from the old one. Both sat in the same index. Query vectors came from the new model, so they landed near new documents and far from old ones, regardless of content.

No component errored, because nothing in the stack knew that vectors have a provenance.

The prevention is one field:

\`\`\`
{ "vector": [...], "embedding_model": "provider/model-name", "embedding_version": "3" }
\`\`\`

With that field, a one-line query detects a mixed index in seconds. Without it, the failure is invisible until someone notices an entire era of content has disappeared from search.

---

## Failure modes

| Symptom | Embedding-layer cause |
|---|---|
| Semantically obvious matches are missed | Domain gap between training data and corpus |
| Exact identifiers and codes never retrieve | Dense-only search, needs a lexical channel |
| Results biased toward long documents | Unnormalised vectors with dot product scoring |
| Quality dropped after a library upgrade | Embedding model version changed silently |
| Recall good, answers still wrong | Retrieval fine, reranking or chunking at fault |
| Subset of corpus never appears in results | Partially migrated index with mixed model versions |

The second row is worth dwelling on. Dense embeddings are poor at exact-match retrieval. Product codes, error identifiers, function names and version strings are frequently better served by a lexical index. That is the entire argument for hybrid search, and it is covered later in this series.

---

## Geometry is a design decision

An embedding model is a stored, frozen definition of similarity. Choosing one is choosing what your system will consider relevant, for every query, until someone rebuilds the index.

Treat it accordingly: validate it against real labelled queries rather than a leaderboard, normalise consistently, version it explicitly, and assume from day one that a migration will eventually be needed. The teams that do this spend their debugging time on prompts and rankers. The teams that do not spend it wondering why the obvious answer never comes back.

---

*Next in this series: The KV cache — the memory bottleneck nobody budgets for.*`,r="/blog/series/ai-systems-track-04.svg",s={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},i="2026-06-04",o=12,d="Retrieval",l=["Embeddings","Vector Search","Semantic Similarity","RAG","AI Engineering","System Design","Machine Learning"],c=!1,h="AI Systems Track",u="ai-systems-track",m=4,g=30,b={id:"104",slug:e,title:n,excerpt:t,content:a,featuredImage:r,author:s,publishedAt:i,readTime:o,category:d,tags:l,featured:c,series:h,seriesSlug:u,seriesPart:m,seriesTotal:g};export{s as author,d as category,a as content,b as default,t as excerpt,c as featured,r as featuredImage,p as id,i as publishedAt,o as readTime,h as series,m as seriesPart,u as seriesSlug,g as seriesTotal,e as slug,l as tags,n as title};
