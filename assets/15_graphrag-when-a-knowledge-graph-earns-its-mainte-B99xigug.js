const g="115",e="graphrag-when-a-knowledge-graph-earns-its-maintenance-cost",t="GraphRAG: When a Knowledge Graph Earns Its Maintenance Cost",n="GraphRAG is the most over-recommended and under-analysed technique in retrieval. It appears in architecture proposals as a general upgrade over vector search, usually without anyone...",a=`GraphRAG is the most over-recommended and under-analysed technique in retrieval. It appears in architecture proposals as a general upgrade over vector search, usually without anyone establishing that the system's failures are the kind a graph fixes.

For roughly eighty percent of production retrieval workloads, hybrid search followed by a cross-encoder reranker is cheaper to build, cheaper to run, and competitive on answer quality. A graph earns its place only when the questions genuinely require traversing relationships that vector similarity cannot recover.

The good news is that this is a measurable question, not an aesthetic one.

---

## What vector retrieval structurally cannot do

Vector search finds passages similar to a query. That is a local operation. It has no mechanism for connecting information that appears in different documents which share no surface text.

Two question types break it.

**Multi-hop relational questions.** "Which of our suppliers are owned by companies that also supply our main competitor?" No single passage contains this. The answer requires following ownership relationships across separate documents, then intersecting with a supplier list from somewhere else.

**Global aggregation questions.** "What are the main themes across all incident reports from the last quarter?" Vector search returns the ten most similar passages to that query. It cannot summarise a corpus, because it has no representation of the corpus as a whole.

Everything else, vector search plus reranking handles well.

---

## The diagnostic that should come first

Before building anything, pull one hundred failed retrievals from the existing system and sort each into one of three buckets.

| Bucket | Description | Fix |
|---|---|---|
| **1. Retrieval failure** | The answer was in the corpus and was not surfaced | Better retriever: hybrid, reranker, contextual enrichment, chunking |
| **2. Synthesis failure** | The right passages were retrieved and combined badly | Better prompt, better ordering, better model |
| **3. Graph-shaped failure** | The answer required chaining relationships across documents with no shared text | GraphRAG |

The decision rule is simple. **If bucket 3 is under 30 percent of failures, do not build a graph.** Construction and maintenance will not pay back. If it is 30 percent or more, a graph or a graph-assisted hybrid is the right investment.

This tally takes an afternoon and routinely changes the decision. Most systems that were about to build a graph discover that seventy percent of their failures are bucket 1, fixable with a reranker.

---

## The GraphRAG architecture

Three phases: extract, build, query.

\`\`\`mermaid
---
title: "GraphRAG Architecture: Extract, Build, Query"
---
flowchart TD
    A["Source Documents"] --> B["Entity extraction<br/>LLM identifies people, orgs, products, concepts"]
    B --> C["Relationship extraction<br/>subject, predicate, object with source citation"]
    C --> D["Entity resolution<br/>merge aliases and duplicates"]
    D --> E[("Knowledge Graph<br/>nodes and typed edges")]

    E --> F["Community detection<br/>cluster densely connected nodes"]
    F --> G["Community summarisation<br/>LLM writes a summary per cluster"]
    G --> H[("Community Summary Index")]

    I["User Question"] --> J{"Question type"}
    J -->|Specific entity or relation| K["Local search<br/>find entities, traverse k hops"]
    J -->|Global or thematic| L["Global search<br/>map over community summaries"]
    J -->|Ordinary lookup| M["Standard vector plus lexical retrieval"]

    E --> K
    H --> L

    K --> N["Assemble subgraph as context"]
    L --> O["Reduce community answers into one"]
    M --> P["Passages as context"]

    N --> Q["Generation with provenance"]
    O --> Q
    P --> Q

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef store fill:#F3F0F8,stroke:#8880AE,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A,I input
    class B,C,D,F,G,K,L,M,N,O,P process
    class E,H store
    class J decision
    class Q output
\`\`\`

### Extraction

An LLM reads each chunk and emits entities and relationships as structured output:

\`\`\`json
{
  "entities": [
    {"name": "Vantel Logistics", "type": "Organisation"},
    {"name": "Northgate Holdings", "type": "Organisation"}
  ],
  "relationships": [
    {"source": "Northgate Holdings",
     "type": "OWNS_MAJORITY_STAKE_IN",
     "target": "Vantel Logistics",
     "evidence_chunk_id": "doc_881_c12"}
  ]
}
\`\`\`

The \`evidence_chunk_id\` field is not optional. Without provenance, the graph becomes an unauditable set of assertions and there is no way to trace a wrong answer back to a wrong extraction.

This phase is the expensive one: one model call per chunk over the whole corpus.

### Entity resolution

The step that determines whether the graph is useful or noise. "Vantel Logistics", "Vantel Logistics Ltd", "Vantel" and "VLL" must become one node. Get this wrong and the graph fragments into disconnected islands, which produces exactly the multi-hop failures it was built to fix.

Resolution combines exact matching, normalisation, embedding similarity over entity names with their context, and a human review queue for ambiguous merges. In most real deployments this is where the majority of the engineering effort lands, and underestimating it is the most common reason graph projects stall.

### Community detection and summarisation

Graph clustering algorithms partition the graph into densely connected communities. An LLM then writes a summary of each. Those summaries are what make global questions answerable: rather than reading a million documents, the system reads a few hundred community summaries.

---

## The cheaper alternative: graph as reranker

Full GraphRAG is heavy. A hybrid pattern captures a large share of the benefit at a fraction of the cost.

Keep standard vector plus lexical retrieval as the primary path. Build a graph only over entities and their relationships, not over the full content. Use the graph to re-score and expand candidates:

- A candidate passage mentioning an entity connected to an entity in the query gets a score boost.
- Passages about entities one hop from a query entity get pulled into the candidate set even if their text is dissimilar.

\`\`\`mermaid
---
title: "Graph as Reranker: The Lightweight Alternative"
---
flowchart LR
    A["Query"] --> B["Extract query entities"]
    A --> C["Hybrid retrieval<br/>top 50 passages"]

    B --> D["Graph lookup<br/>entities within 2 hops"]
    D --> E["Related entity set"]

    C --> F["Candidate scoring"]
    E --> F
    F --> G["Boost candidates mentioning<br/>graph connected entities"]
    G --> H["Expand with passages about<br/>related entities not in top 50"]
    H --> I["Cross encoder rerank"]
    I --> J["Final context"]

    K[("Entity Graph<br/>lightweight, entities and edges only")] --> D

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef store fill:#F3F0F8,stroke:#8880AE,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,C,D,E,F,G,H,I process
    class K store
    class J output
\`\`\`

This keeps the vector pipeline intact, adds a smaller graph that is cheaper to maintain, and captures most multi-hop gains without a full graph-first architecture. For teams where bucket 3 is meaningful but not dominant, this is usually the right answer.

---

## The costs nobody quotes

| Cost | Scale |
|---|---|
| Extraction | One LLM call per chunk across the corpus, repeated on every re-ingestion |
| Entity resolution engineering | Frequently the largest single effort in the project |
| Graph storage and operation | A new database with its own scaling and backup story |
| Incremental updates | A new document can change relationships across the whole graph |
| Community re-summarisation | Communities shift as the graph grows; summaries go stale |
| Query latency | Traversal plus generation, typically 2 to 5 times a vector pipeline |
| Ongoing correctness | Extraction errors compound silently into wrong relationships |

The incremental update problem is the one that surprises teams. A vector index handles a new document by embedding and inserting it. A graph may need entity resolution against everything already present, edge updates, community re-detection and summary regeneration. Systems with high document churn find this considerably harder to operate than they expected.

---

## What this looks like in three real systems

### The pharmaceutical team where the graph was clearly right

A research group needed to answer questions like "which compounds in our pipeline target pathways that are also implicated in the indication we just licensed".

Running the diagnostic on 100 failed retrievals:

\`\`\`
Bucket 1, retrieval failures:     18
Bucket 2, synthesis failures:      9
Bucket 3, graph shaped failures:  73
\`\`\`

Seventy-three percent. The answers genuinely required chaining compound to target to pathway to indication, across separate papers and internal reports that never mentioned each other.

A graph was correct here, and the domain made it tractable: entity types were well defined and standard ontologies existed for gene, protein, compound and disease names, which turned the hardest part (entity resolution) into a lookup against a controlled vocabulary rather than a fuzzy-matching problem.

**Where a standard ontology exists for the domain, GraphRAG gets dramatically easier.** Where entity names are freeform, it gets dramatically harder.

### The bank that stopped a graph project after one afternoon

A retail bank's knowledge assistant was underperforming and a graph had been proposed and budgeted.

The tally on 100 failures:

\`\`\`
Bucket 1, retrieval failures:     64
Bucket 2, synthesis failures:     29
Bucket 3, graph shaped failures:   7
\`\`\`

Seven percent. The graph would have addressed seven failures out of a hundred and cost a quarter of engineering time.

What the 64 retrieval failures actually needed: a lexical channel for product codes, contextual enrichment on policy chunks that did not name their product, and a reranker. All three shipped in three weeks and moved accuracy from 66 percent to 91 percent.

The graph proposal was not unreasonable, it was just unmeasured. **An afternoon of tallying replaced a quarter of work.**

### The manufacturer that used the lightweight pattern

An industrial group needed supply chain risk answers: "if this component's supplier has a disruption, which product lines are affected". Genuinely relational.

Their tally showed bucket 3 at 34 percent, over the threshold but not dominant. Two thirds of failures were still ordinary retrieval problems.

Building a full graph-first system would have meant re-architecting for the minority case. Instead they kept the vector pipeline and added an entity graph covering only supplier, component and product-line relationships, extracted from a bill-of-materials system rather than from documents.

That last detail is the significant one. **Much of the relational structure an organisation needs already exists in structured systems**: ERP, CRM, asset registries, org charts, dependency manifests. Extracting a graph from those is reliable, cheap and does not require LLM extraction or entity resolution at all.

\`\`\`mermaid
---
title: "Build the Graph From Structured Systems First"
---
flowchart TD
    A["Structured systems<br/>ERP, BOM, CRM, asset registry"] --> B["Direct graph load<br/>relationships already typed and resolved"]
    C["Unstructured documents"] --> D["LLM extraction<br/>expensive, needs resolution"]

    B --> E[("Entity Graph")]
    D --> F{"Is this relationship already<br/>in a structured system"}
    F -->|Yes| G["Skip extraction, use the source of truth"]
    F -->|No| H["Extract with provenance"]
    H --> E
    G --> E

    E --> I["Graph assisted retrieval"]
    J[("Vector plus lexical index")] --> I
    I --> K["Answer"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef store fill:#F3F0F8,stroke:#8880AE,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A,C input
    class B,D,G,H,I process
    class E,J store
    class F decision
    class K output
\`\`\`

Their graph was built in two weeks from existing systems, needed no entity resolution, and stayed current automatically because the source systems were already maintained. Document extraction was reserved for the relationships that genuinely only existed in prose.

---

## Failure modes

| Symptom | Cause |
|---|---|
| Graph built, quality unchanged | Failures were bucket 1, not bucket 3 |
| Multi-hop questions still fail | Entity resolution fragmented the graph |
| Answers assert relationships that do not exist | Extraction errors, no provenance to audit |
| Graph goes stale within weeks | No incremental update path |
| Global questions return generic summaries | Community summaries too coarse or not refreshed |
| Query latency unacceptable | Unbounded traversal depth |
| Project stalls in month three | Entity resolution effort underestimated |
| Graph duplicates data already in the ERP | Relationships extracted from documents that exist in structured form |

---

## Measure before you build the graph

GraphRAG solves a specific and real problem: questions whose answers require chaining relationships across documents that share no surface text. On that class of question, nothing else works as well.

It is also expensive to build, harder to operate, and frequently proposed for systems whose failures are ordinary retrieval failures wearing a more interesting costume.

The sequence that keeps this honest: tally a hundred failures into three buckets, fix bucket 1 first because it is usually the largest and the cheapest, check whether the relationships you need already exist in a structured system before extracting them from prose, and reach for the graph-as-reranker pattern before a graph-first architecture.

Build the graph when the tally says to. Not when the diagram looks good.

---

*Next in this series: Agentic RAG — retrieval as a decision, not a step.*`,r="/blog/series/ai-systems-track-15.svg",s={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},i="2026-06-15",o=10,l="Retrieval",h=["GraphRAG","Knowledge Graph","Retrieval","Entity Extraction","RAG","AI Engineering","System Design","LLMOps"],c=!1,d="AI Systems Track",u="ai-systems-track",p=15,m=30,y={id:"115",slug:e,title:t,excerpt:n,content:a,featuredImage:r,author:s,publishedAt:i,readTime:o,category:l,tags:h,featured:c,series:d,seriesSlug:u,seriesPart:p,seriesTotal:m};export{s as author,l as category,a as content,y as default,n as excerpt,c as featured,r as featuredImage,g as id,i as publishedAt,o as readTime,d as series,p as seriesPart,u as seriesSlug,m as seriesTotal,e as slug,h as tags,t as title};
