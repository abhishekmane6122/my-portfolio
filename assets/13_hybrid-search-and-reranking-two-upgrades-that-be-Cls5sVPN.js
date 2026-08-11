const m="113",e="hybrid-search-and-reranking-two-upgrades-that-beat-a-bigger-model",n="Hybrid Search and Reranking: Two Upgrades That Beat a Bigger Model",t="When a retrieval system underperforms, the proposals that surface are usually a better embedding model, a bigger generator, or a fine-tune. All three are expensive and slow to validate.",r=`When a retrieval system underperforms, the proposals that surface are usually a better embedding model, a bigger generator, or a fine-tune. All three are expensive and slow to validate.

Two changes are almost always available before any of those, cost very little, and routinely deliver larger gains: adding a lexical channel alongside the dense one, and adding a cross-encoder reranker between retrieval and generation.

They fix different problems. Together they cover most of the gap between a demo and a system people trust.

---

## Why dense retrieval alone is not enough

An embedding model compresses a passage into a single vector. That compression is lossy by design, and what it loses is precisely what exact-match search is good at.

\`\`\`
Query: "error E-4471 on firmware 2.3.1"

Dense retrieval returns:
  - "Troubleshooting common firmware errors"          (topically similar)
  - "Firmware upgrade procedure for 2.x releases"     (topically similar)
  - "Diagnostic codes overview"                       (topically similar)

The page documenting E-4471 specifically ranks 23rd, because the string
"E-4471" contributes almost nothing to a 1024-dimension semantic vector
dominated by the page's surrounding prose.
\`\`\`

Lexical retrieval has the opposite profile. BM25 scores by term overlap weighted by rarity, so a rare token like \`E-4471\` dominates the score. It finds the exact page instantly. It also completely fails on "my device keeps restarting after the update", because none of those words appear in a document that says "unexpected reboot following firmware installation".

| | Dense (embeddings) | Sparse (BM25) |
|---|---|---|
| Paraphrase and synonym | Strong | Weak |
| Exact identifiers and codes | Weak | Strong |
| Rare proper nouns | Weak | Strong |
| Conceptual similarity | Strong | None |
| Out-of-domain vocabulary | Degrades | Unaffected |
| Explainability | Opaque | Term-level, inspectable |
| Index cost | High | Low |

The two failure profiles are close to complementary, which is the entire argument for running both.

---

## Fusing the results

Running both is easy. Combining their results is where the design decision lives, because the two produce scores on incompatible scales. A cosine similarity of 0.83 and a BM25 score of 14.2 cannot be added.

**Reciprocal rank fusion** sidesteps the problem by ignoring scores and using ranks:

\`\`\`
RRF_score(document) = sum over each ranked list of  1 / (k + rank)

where k is a constant, commonly 60
\`\`\`

A document ranked 1st by dense and 8th by lexical scores \`1/61 + 1/68\`. A document ranked 3rd by both scores \`1/63 + 1/63\`. Documents that appear in both lists rise; documents that appear strongly in one still surface.

This is the right default. It needs no score normalisation, no per-corpus tuning, and it is robust when one retriever returns garbage.

**Weighted score fusion** normalises both score distributions and combines them with a tunable weight. It can outperform RRF when the weight is tuned against a labelled set, and it is fragile when score distributions shift, which they do when the corpus grows or the embedding model changes.

Start with RRF. Move to weighted fusion only with a labelled set to tune against and a reason to believe the extra points matter.

---

## The reranker: the highest-return component in retrieval

Bi-encoder retrieval compares two vectors that were produced independently. The document was embedded months ago with no knowledge of the query. The query was embedded with no knowledge of the document. The comparison is between two summaries.

A cross-encoder reads them together. The query and the document go into the model as one sequence, attention runs across both, and the output is a relevance score computed with full awareness of the interaction.

\`\`\`mermaid
---
title: "Bi-Encoder vs Cross-Encoder Scoring"
---
flowchart LR
    subgraph SG1["Bi-encoder retrieval"]
    A["Query"] --> B["Encode independently"]
    C["Document"] --> D["Encoded months ago"]
    B --> E["Cosine similarity<br/>of two summaries"]
    D --> E
    end

    subgraph SG2["Cross-encoder reranking"]
    F["Query plus Document<br/>as one sequence"] --> G["Full attention<br/>across both"]
    G --> H["Relevance score<br/>computed jointly"]
    end

    E --> I["Fast, scalable to millions<br/>approximate"]
    H --> J["Slow, scales to hundreds<br/>accurate"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A,C,F input
    class B,D,E,G,H process
    class I,J output
\`\`\`

The accuracy difference is large, typically 10 to 30 points of precision at the top rank. The cost is that nothing can be precomputed, so it only works on a small candidate set.

Which produces the standard two-stage architecture: **retrieve wide, rerank narrow.**

---

## The complete retrieval architecture

\`\`\`mermaid
---
title: "The Complete Hybrid Retrieval Architecture"
---
flowchart TD
    A["User Query"] --> B["Query processing<br/>rewrite for context, classify intent"]
    B --> C{"Needs retrieval"}
    C -->|No| D["Answer directly"]
    C -->|Yes| E["Build permission filter"]

    E --> F["Dense search<br/>top 50"]
    E --> G["Lexical search<br/>top 50"]

    H[("Vector Index")] --> F
    I[("BM25 Index")] --> G

    F --> J["Reciprocal rank fusion"]
    G --> J
    J --> K["Candidate set<br/>~60 unique documents"]
    K --> L["Cross encoder rerank<br/>score all 60"]
    L --> M{"Top score above threshold"}
    M -->|No| N["Refuse or escalate<br/>no confident evidence"]
    M -->|Yes| O["Take top 5<br/>order weakest first, strongest last"]
    O --> P["Generation with citations"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef store fill:#F3F0F8,stroke:#8880AE,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,E,F,G,J,K,L,O process
    class H,I store
    class C,M decision
    class N risk
    class D,P output
\`\`\`

Three details in that flow are easy to miss and carry real weight.

**The score threshold after reranking.** A cross-encoder produces a calibrated relevance score, which means it can say "none of these are relevant". That is a genuine signal and it is the cleanest way to trigger a refusal instead of a hallucination. Vector similarity scores are not calibrated well enough to serve this purpose.

**Ordering weakest first.** Reranking produces a ranking, and that ranking should be used for placement as well as filtering. The strongest passage goes closest to the question, where attention is most reliable.

**Retrieve 50, keep 5.** The candidate set has to be wide enough that the answer is in it. Retrieving 5 and reranking 5 accomplishes almost nothing, because reranking cannot promote a document that retrieval never returned.

---

## What this looks like in three real systems

### The bank that recovered 27 points without touching the model

A compliance assistant over internal policy documents sat at 61 percent answer accuracy. The team's proposal was a frontier-tier model, roughly eight times the cost per call.

Before approving it, they measured where failures came from on a labelled set of 120 real compliance questions.

\`\`\`
Context recall at 10:   0.83   (the right passage was retrieved 83% of the time)
Context recall at 1:    0.44   (it was ranked first only 44% of the time)
Answer accuracy:        0.61
\`\`\`

The gap between recall@10 and recall@1 is the entire diagnosis. The evidence was being found and then buried. The generator was receiving five passages of which the useful one was frequently fourth or fifth, diluted by four near-misses.

Adding a cross-encoder reranker over the existing 50-candidate set:

\`\`\`
Context recall at 1:    0.44  ->  0.79
Answer accuracy:        0.61  ->  0.88
Added latency:          +54 ms p95
Added cost:             negligible, small reranker on CPU
\`\`\`

The model was never changed. **A 27-point accuracy gain sat behind one component that costs 54 milliseconds.**

### The e-commerce search that needed both channels

A fashion retailer's product search handled "warm jacket for winter hiking" well and failed on the queries that convert.

Analysis of a week of zero-result and zero-click searches showed a clear split:

| Query pattern | Share | Dense works | Lexical works |
|---|---|---|---|
| Descriptive, natural language | 46 percent | Yes | Poorly |
| Exact SKU or style code | 19 percent | No | Yes |
| Brand plus model name | 22 percent | Partially | Yes |
| Mixed, brand plus description | 13 percent | Partially | Partially |

Roughly 41 percent of traffic was being served by a retriever structurally unsuited to it, and 13 percent needed both.

Hybrid search with RRF fixed the exact-match categories immediately. The mixed category improved further with an intent classifier that adjusted the fusion weighting:

\`\`\`mermaid
---
title: "Commerce Search: Fusion Weighting by Query Intent"
---
flowchart TD
    A["Search Query"] --> B["Intent classifier<br/>fast model or regex heuristics"]
    B --> C{"Query shape"}

    C -->|Contains SKU or code pattern| D["Lexical weighted 0.8<br/>dense weighted 0.2"]
    C -->|Pure natural language| E["Dense weighted 0.8<br/>lexical weighted 0.2"]
    C -->|Brand plus description| F["Balanced RRF"]

    D --> G["Candidate set"]
    E --> G
    F --> G
    G --> H["Rerank with business signals<br/>relevance, stock, margin"]
    H --> I["Results"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,D,E,F,G,H process
    class C decision
    class I output
\`\`\`

The reranking stage in commerce differs from the document-QA case in one important way: relevance is not the only objective. Stock availability, margin and delivery time are legitimate ranking inputs. The cross-encoder produces a relevance score; a business layer combines it with the rest. Keeping those two stages separate is what stops a margin tweak from quietly destroying relevance.

### The internal helpdesk where the threshold mattered more than the ranking

An IT support assistant answered questions from an internal knowledge base of about 4,000 articles. Accuracy on questions the knowledge base covered was good. The problem was the questions it did not cover.

Roughly 18 percent of queries were about systems with no documentation at all. For those, retrieval returned the five least-irrelevant articles it could find, and the model produced a confident, well-cited answer built from documents about a different system.

Users could not distinguish these answers from correct ones. That is the worst possible failure profile for a support tool.

The cross-encoder's calibrated score provided the missing signal:

\`\`\`
Distribution of top rerank score on a labelled set:

Queries the KB covers:        median 0.81,  5th percentile 0.44
Queries the KB does not:      median 0.19,  95th percentile 0.38

Threshold at 0.40:
  Correctly refuses 91 percent of uncovered queries
  Incorrectly refuses 6 percent of covered queries
\`\`\`

Below the threshold, the assistant says the knowledge base does not cover the topic and offers to open a ticket. That behaviour is more useful than a confident wrong answer and considerably more trusted.

**A reranker is not only a ranking component. It is the cheapest available confidence signal, and confidence is what lets a system decline.**

---

## Cost and latency in practice

The objection to reranking is always latency. The numbers are usually smaller than expected.

| Reranker type | 50 candidates | Where it runs | Relative quality |
|---|---|---|---|
| Small cross-encoder | 20 to 60 ms | CPU or small GPU | Strong |
| Larger cross-encoder | 80 to 200 ms | GPU | Stronger |
| Hosted reranking API | 100 to 300 ms | Network round trip | Strong, no infrastructure |
| LLM-as-reranker | 500 ms to 2 s | Model call | Strongest, rarely worth it |
| Late interaction (ColBERT) | 10 to 40 ms | Specialised index | Between bi and cross encoder |

A small cross-encoder on 50 candidates is typically 30 to 60 milliseconds. In a pipeline where generation takes two seconds, that is noise.

There is also a cost offset that gets forgotten: reranking lets you send fewer passages to the generator. Going from 10 passages to 5, each around 800 tokens, removes 4,000 input tokens per request. On high-volume systems, the reranker frequently pays for itself in reduced generation cost.

---

## Failure modes

| Symptom | Cause |
|---|---|
| Exact codes and IDs never retrieve | Dense-only index, no lexical channel |
| Natural language queries return nothing | Lexical-only search, no semantic channel |
| Right document retrieved, ranked fifth | No reranker |
| Reranking added, quality barely moved | Candidate set too small to rerank meaningfully |
| Confident answers on undocumented topics | No score threshold, no refusal path |
| Fusion results worse than either retriever alone | Weighted fusion with untuned or stale weights |
| Latency budget blown | Reranking too many candidates, or LLM used as reranker |
| Quality regressed after corpus growth | Score-normalised fusion with shifted distributions |

---

## Two upgrades, no model change

Hybrid search fixes what dense retrieval structurally cannot do: match exact strings. Reranking fixes what a single-vector comparison structurally cannot do: judge relevance with the query in view.

Neither requires a better model, a fine-tune, or a re-architecture. Both are additive components that sit around existing retrieval, and the combined effect is frequently larger than any model upgrade available at the time.

The order of work is clear. Add the lexical channel first, because it fixes an entire class of query that currently returns nothing. Add the reranker second, because it both improves ranking and hands you a calibrated confidence score you can refuse on. Measure both against a labelled set so the improvement is a number rather than an impression.

---

*Next in this series: Contextual retrieval and late interaction.*`,s="/blog/series/ai-systems-track-13.svg",a={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},o="2026-06-13",i=10,l="Retrieval",c=["Hybrid Search","BM25","Reranking","Retrieval","RAG","AI Engineering","Vector Search","Search Relevance","System Design"],d=!1,h="AI Systems Track",u="ai-systems-track",g=13,p=30,f={id:"113",slug:e,title:n,excerpt:t,content:r,featuredImage:s,author:a,publishedAt:o,readTime:i,category:l,tags:c,featured:d,series:h,seriesSlug:u,seriesPart:g,seriesTotal:p};export{a as author,l as category,r as content,f as default,t as excerpt,d as featured,s as featuredImage,m as id,o as publishedAt,i as readTime,h as series,g as seriesPart,u as seriesSlug,p as seriesTotal,e as slug,c as tags,n as title};
