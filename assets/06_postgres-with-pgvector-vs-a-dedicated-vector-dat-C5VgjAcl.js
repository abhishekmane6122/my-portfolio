const f="306",e="postgres-with-pgvector-vs-a-dedicated-vector-database",t="Postgres With pgvector vs a Dedicated Vector Database",n="The honest version of this decision, without the vendor framing: The argument for staying in Postgres is not performance.",s=`**Most teams do not need a vector database. They need an index on a table they already have.**

The honest version of this decision, without the vendor framing:

\`\`\`
pgvector wins when
  corpus under ~5 to 10 million vectors
  you already run Postgres
  filters are relational (tenant, date, status, permissions)
  you want ONE transactional store, one backup, one migration path

Dedicated vector DB wins when
  tens of millions to billions of vectors
  you need horizontal sharding of the index itself
  filtering is simple but scale is extreme
  you need features Postgres lacks: multi vector, built in hybrid, live reindex
\`\`\`

The argument for staying in Postgres is not performance. It is that **your embedding lives next to the row it describes**, inside the same transaction.

That matters more than benchmarks suggest:

\`\`\`sql
-- one query, one consistency domain
SELECT c.id, c.text, d.title
FROM chunks c
JOIN documents d ON d.id = c.document_id
WHERE d.tenant_id = $1
  AND d.status = 'published'
  AND d.effective_date <= now()
  AND c.embedding_version = 3
ORDER BY c.embedding <=> $2
LIMIT 20;
\`\`\`

Tenant isolation, publication status, effective dating and index versioning are all enforced by the database, in the same query, in the same transaction as the vector search. With a separate vector store, every one of those becomes application code that can drift — and "the filter was applied after retrieval" is a recurring source of cross-tenant leaks.

Three things you must get right in pgvector or it will disappoint you:

**HNSW, not IVFFlat, for most workloads.** IVFFlat needs data present before you build the index and degrades as the table grows past what it was trained on. HNSW builds incrementally and holds recall.

**Filters and ANN indexes fight each other.** A highly selective filter (\`tenant_id = X\` matching 0.1 percent of rows) can make the planner scan the HNSW graph and discard almost everything, or abandon the index entirely. Partial indexes per tenant, or partitioning, fix this. Measure with \`EXPLAIN ANALYZE\` — do not assume.

**Tune \`ef_search\` per query class.** It is the recall/latency dial. The default is conservative; raising it costs milliseconds and buys real recall.

And the decision that outlives the database choice: **store \`embedding_model\` and \`embedding_version\` as columns on every row.** Without them a partially migrated index is undetectable, and you will migrate.

**Start in Postgres. Move when a specific number forces you to, and know which number it was.**

---

## Diagrams

### The selection path

\`\`\`mermaid
---
title: "pgvector or a Dedicated Vector Database"
---
flowchart TD
    A["Need vector search"] --> B{"Corpus size"}

    B -->|"Under 10M vectors"| C{"Already running Postgres"}
    B -->|"10M to 100M"| D{"Filters relational or simple"}
    B -->|"Over 100M"| E["Dedicated vector DB<br/>index sharding required"]

    C -->|Yes| F["pgvector<br/>one store, one transaction, one backup"]
    C -->|No| G{"Is Postgres acceptable operationally"}
    G -->|Yes| F
    G -->|No| H["Managed vector service"]

    D -->|"Relational, permission aware"| I["pgvector with partitioning<br/>or partial indexes per tenant"]
    D -->|"Simple, scale dominates"| E

    F --> J["Store embedding_model<br/>and embedding_version as columns"]
    I --> J
    E --> J
    H --> J

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef store fill:#F3F0F8,stroke:#8880AE,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class F,I,E,H process
    class B,C,D,G decision
    class J output
\`\`\`

### One store keeps the permission filter inside the query

\`\`\`mermaid
---
title: "Why Colocating Vectors and Rows Prevents Filter Drift"
---
flowchart LR
    subgraph SG1["Separate vector store"]
    A["Query"] --> B["Vector DB<br/>top 50 by similarity"]
    B --> C["Application code<br/>filters by tenant and status"]
    C --> D["Fetch rows from Postgres"]
    D --> E["Filter logic lives in TWO places<br/>and can drift"]
    end

    subgraph SG2["pgvector"]
    F["Query"] --> G["One SQL statement<br/>JOIN plus WHERE plus ORDER BY distance"]
    G --> H["Tenant, status, effective date<br/>and embedding_version<br/>enforced by the database"]
    end

    E --> I["Recurring failure<br/>post filtering leaks across tenants"]
    H --> J["Filter is a QUERY CONSTRAINT<br/>unauthorised rows are never candidates"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A,F input
    class B,D,G,H process
    class C,E,I risk
    class J output
\`\`\``,o="/blog/series/shipping-the-ai-product-06.svg",r={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},i="2026-08-05",a=3,c="Retrieval",l=["pgvector","PostgreSQL","Vector Database","Retrieval","Postgre SQL","Vector Search","RAG","AI Engineering","Database Design"],d=!1,h="Shipping the AI Product",p="shipping-the-ai-product",u=6,g=30,m={id:"306",slug:e,title:t,excerpt:n,content:s,featuredImage:o,author:r,publishedAt:i,readTime:a,category:c,tags:l,featured:d,series:h,seriesSlug:p,seriesPart:u,seriesTotal:g};export{r as author,c as category,s as content,m as default,n as excerpt,d as featured,o as featuredImage,f as id,i as publishedAt,a as readTime,h as series,u as seriesPart,p as seriesSlug,g as seriesTotal,e as slug,l as tags,t as title};
