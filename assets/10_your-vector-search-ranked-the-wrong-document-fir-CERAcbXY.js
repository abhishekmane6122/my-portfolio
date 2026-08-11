const g="410",e="your-vector-search-ranked-the-wrong-document-first-heres-why-and-what-fixes-it",n="Your Vector Search Ranked the Wrong Document First. Here's Why, and What Fixes It.",t=`Query: "how to configure CUDA memory." Your vector search returns a document about RAM allocation for machine learning ranked above a document that's actually about configuring CUDA memory.`,o=`Query: "how to configure CUDA memory." Your vector search returns a document about RAM allocation for machine learning ranked above a document that's actually about configuring CUDA memory. The embeddings weren't broken. They did exactly what embeddings do - and that's precisely the limitation worth understanding.

A bi-encoder, the workhorse of first-stage retrieval, embeds the query and every document independently, before either has any idea the other exists. Similarity is just cosine distance between two vectors computed in isolation. It's fast - embeddings are precomputed, so scoring a billion documents is a nearest-neighbor lookup - but independence is also exactly what it can't see: how a specific word in the query changes the meaning of a specific word in the document.

A cross-encoder processes the query and a candidate document together, as one input, and uses attention to let them interact directly. It sees that "CUDA" in the query and "CUDA" in the document are talking about the same thing in a way cosine similarity on two separately-computed vectors simply cannot capture. That's reranking: a second, slower, much more accurate pass over a shortlist the first stage already narrowed down.

The production pattern is a funnel, not a single search. Retrieve fifty to a hundred candidates cheaply with the bi-encoder, then spend the expensive cross-encoder pass only on that shortlist, returning the top five to ten. For very large corpora, add a third stage in front - sparse BM25 narrowing a billion documents to a thousand before the bi-encoder even runs.

Here's the number that changes how you'd spend a latency budget: NDCG (a standard ranking-quality metric) goes from roughly 0.65 without reranking to 0.78 with it, for a latency cost that's real but bounded - 150 to 300ms instead of 50 to 100. If you have 200ms to spend, the highest-ROI split is roughly 50ms on retrieval and 150ms on reranking, not more candidates from the vector database. Reranking fifty results consistently beats retrieving five hundred.

Skip it when latency is genuinely tight (sub-100ms budgets), when queries are simple single-term lookups, or when the first-stage candidates are already clearly separated by score. Always use it when the stakes are high enough that getting the wrong document into an LLM's context is expensive - legal, medical, anything customer-facing where a hallucinated answer built on the wrong source is worse than a slower answer built on the right one.

#RAG #InformationRetrieval #AIEngineering #VectorSearch #MachineLearning

---

## Diagrams

### Why the ranking flips between stages

\`\`\`mermaid
---
title: "Bi-Encoder vs Cross-Encoder: Independent Scoring vs Joint Scoring"
config:
  look: handDrawn
---
flowchart TD
    subgraph BI["Bi-encoder (first stage)"]
    Q1["Query"] --> E1["Encoder"]
    D1["Document"] --> E2["Encoder"]
    E1 --> SIM["Cosine similarity<br/>no interaction between the two"]
    E2 --> SIM
    end

    subgraph CROSS["Cross-encoder (reranking)"]
    QD["[Query, Document] as ONE input"] --> ATT["Attention sees both together"]
    ATT --> SCORE["Relevance score<br/>captures word-level interaction"]
    end

    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933
    class E1,E2,ATT process
    class SIM,SCORE output
\`\`\`

### The retrieval funnel and where the latency budget goes

\`\`\`mermaid
---
title: "The Two-Stage (Sometimes Three-Stage) Retrieval Funnel"
---
flowchart LR
    A["1 Billion+ documents"] --> B["Sparse BM25<br/>optional, for huge corpora"]
    B --> C["Top 1,000"]
    C --> D["Bi-encoder search<br/>~50-100ms"]
    D --> E["Top 50-100 candidates"]
    E --> F["Cross-encoder rerank<br/>~150-300ms"]
    F --> G["Top 5-10 to the LLM"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,D,F process
    class C,E,G output
\`\`\``,r="/blog/series/deep-dives-10.svg",s={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},a="2026-08-10",i=3,c="Retrieval",h=["Reranking","Cross-Encoder","Relevance","Retrieval","RAG","Information Retrieval","AI Engineering","Vector Search","Machine Learning"],d=!1,l="Deep Dives",u="deep-dives",m={id:"410",slug:e,title:n,excerpt:t,content:o,featuredImage:r,author:s,publishedAt:a,readTime:i,category:c,tags:h,featured:d,series:l,seriesSlug:u};export{s as author,c as category,o as content,m as default,t as excerpt,d as featured,r as featuredImage,g as id,a as publishedAt,i as readTime,l as series,u as seriesSlug,e as slug,h as tags,n as title};
