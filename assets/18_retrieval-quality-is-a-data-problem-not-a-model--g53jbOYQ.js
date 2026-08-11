const f="218",e="retrieval-quality-is-a-data-problem-not-a-model-problem",n="Retrieval Quality Is a Data Problem, Not a Model Problem",t="Before approving a frontier-model upgrade to fix RAG accuracy, it is worth spending an hour with twenty failed queries and a tally sheet. It changes the decision more often than not.",r=`Before approving a frontier-model upgrade to fix RAG accuracy, it is worth spending an hour with twenty failed queries and a tally sheet. It changes the decision more often than not.

Here is one such tally, from a manufacturer sitting at 62 percent answer accuracy with a proposal on the table to move to a model roughly 8x more expensive:

\`\`\`
Correct passage not retrieved, exists in corpus     11   retrieval
Correct passage retrieved, ranked 14th               5   ranking
Correct passage in context, answer contradicted it   2   grounding
Document never ingested at all                       2   pipeline
\`\`\`

Sixteen of twenty failures were upstream of the model. A bigger model would have fixed at most the two grounding failures.

What they shipped instead, in order of cost:

\`\`\`
Lexical index for part numbers and error codes  -> fixed 7 of 11
Cross encoder reranker                          -> fixed all 5
Explicit refusal string in the prompt           -> fixed both
Ingested three missing manual revisions         -> fixed both

62 percent -> 89 percent, and model cost went DOWN,
because reranking meant fewer passages per call.
\`\`\`

Two measurements make this diagnosable, and almost nobody reports both:

\`\`\`
context_recall@10   was the right passage retrieved at all
context_recall@1    was it ranked first
\`\`\`

The gap between them is the whole diagnosis. Recall@10 of 0.83 with recall@1 of 0.44 means retrieval is working and ranking is not, which is a reranker problem rather than a model problem.

Three structural causes sit underneath most of this, and no model upgrade touches any of them.

Dense embeddings cannot do exact match. \`E-4471\` and \`M12-A-4P-IP68\` carry almost no semantic signal, so they embed near every other code in the corpus. That is not a tuning issue, it is what a single pooled vector fundamentally is. You need a lexical channel alongside, fused with reciprocal rank fusion.

Chunks that lost their subject are unretrievable.

\`\`\`
"Revenue grew 12 percent, driven by western expansion."
\`\`\`

Which company, which quarter? Fluent, informative, invisible to search. The fix is contextual enrichment at ingestion — one cheap model call per chunk, with the document cached as a prefix so it stays affordable.

And a retriever cannot return what was never ingested. This is the most embarrassing category and it is almost always non-zero. Reconcile the source system's document count against the index count on a schedule.

The general point is that retrieval failures are usually content and pipeline failures. The generator is the last place to look and the first place everyone looks.

---

## Diagrams

### The failure attribution tree

\`\`\`mermaid
---
title: "The RAG Failure Attribution Tree"
---
flowchart TD
    A["Bad answer reported"] --> B{"Was the correct passage<br/>in the retrieved set"}

    B -->|No| C["RETRIEVAL failure"]
    B -->|Yes| D["GENERATION failure"]

    C --> E{"Is it in the corpus at all"}
    E -->|No| F["Ingestion gap<br/>fix: reconcile source vs index counts"]
    E -->|Yes| G{"Does a lexical search find it"}

    G -->|Yes| H["Dense retrieval gap<br/>fix: add BM25 channel plus RRF"]
    G -->|No| I{"Read the chunk<br/>does it name its own subject"}
    I -->|No| J["Chunk lost context<br/>fix: contextual enrichment at ingestion"]
    I -->|Yes| K["Chunk boundary problem<br/>fix: parent child or larger unit"]

    D --> L{"Does the answer contradict<br/>the retrieved evidence"}
    L -->|Yes| M["Faithfulness failure<br/>fix: grounding instruction plus refusal string"]
    L -->|No| N["Evidence present, ignored<br/>fix: rerank and reorder, strongest last"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,E,G,I,L decision
    class C,D risk
    class F,H,J,K,M,N output
\`\`\`

### recall@10 vs recall@1 tells you which fix to buy

\`\`\`mermaid
---
title: "recall@10 vs recall@1 Tells You Which Fix to Buy"
---
flowchart TD
    A["Measure on a labelled set<br/>50 to 200 real queries"] --> B["recall@10 and recall@1"]

    B --> C{"recall@10 low, under 0.7"}
    C -->|Yes| D["The right passage is not being FOUND"]
    C -->|No| E{"recall@10 high, recall@1 low"}

    E -->|Yes| F["Found but BURIED"]
    E -->|No| G{"Both high, answers still wrong"}
    G -->|Yes| H["Generation problem<br/>grounding or ordering"]

    D --> I["Buy: lexical channel<br/>contextual enrichment<br/>chunking rework"]
    F --> J["Buy: cross encoder reranker<br/>typically 30 to 60 ms<br/>largest single gain available"]
    H --> K["Buy: refusal string, evidence ordering<br/>only then consider a model change"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B process
    class C,E,G decision
    class D,F,H risk
    class I,J,K output
\`\`\``,a="/blog/series/production-reality-18.svg",s={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},o="2026-07-18",i=4,l="Retrieval",c=["Retrieval Quality","Data Quality","RAG","Chunking","AI Engineering","Vector Search","Search Relevance","LLMOps"],d=!1,h="Production Reality",u="production-reality",p=18,g=30,m={id:"218",slug:e,title:n,excerpt:t,content:r,featuredImage:a,author:s,publishedAt:o,readTime:i,category:l,tags:c,featured:d,series:h,seriesSlug:u,seriesPart:p,seriesTotal:g};export{s as author,l as category,r as content,m as default,t as excerpt,d as featured,a as featuredImage,f as id,o as publishedAt,i as readTime,h as series,p as seriesPart,u as seriesSlug,g as seriesTotal,e as slug,c as tags,n as title};
