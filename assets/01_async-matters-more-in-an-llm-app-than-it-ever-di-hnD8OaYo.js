const f="301",e="async-matters-more-in-an-llm-app-than-it-ever-did-in-crud",n="Async Matters More in an LLM App Than It Ever Did in CRUD",o="In a CRUD service a request holds a worker for about 40 milliseconds. In an LLM service it holds one for 8 seconds. Same framework, completely different concurrency problem.",s=`In a CRUD service a request holds a worker for about 40 milliseconds. In an LLM service it holds one for 8 seconds. Same framework, completely different concurrency problem.

The arithmetic on a sync worker pool:

\`\`\`
CRUD:  8 workers x (1 / 0.04s)  =  200 req/s
LLM:   8 workers x (1 / 8.0s)   =    1 req/s
\`\`\`

One request per second on a box that is essentially idle. The CPU is doing nothing, because every worker is blocked on a socket waiting for a token stream from someone else's GPU.

This is probably the most common performance bug in Python AI services, and it is not something you tune your way out of. It is the wrong concurrency model.

The fix is async end to end, and "end to end" is carrying real weight in that sentence. One blocking call anywhere in the request path blocks the whole event loop, not just that one request.

Four that catch people regularly:

\`\`\`python
# all of these block the loop inside an async handler
resp = openai.chat.completions.create(...)
resp = requests.post(...)
rows = session.query(Doc).all()          # sync SQLAlchemy
data = open("f.json").read()             # sync file IO
\`\`\`

Every one has an async equivalent. Mixing them is arguably worse than being fully sync, because you get sync throughput while believing you have async throughput.

Three things that are specifically different in this setting.

Your timeouts need to be shorter than your client's. A 60-second model call sitting behind a 30-second gateway timeout means you pay for tokens nobody ever receives. Set the deadline at the innermost layer and propagate it outward.

Connection pools should be sized for concurrency, not for cores. A default httpx pool of 10 connections caps you at 10 in-flight model calls no matter how many coroutines you have. It shows up as latency that grows with load while CPU stays flat, which is a confusing signal if you are not looking for it.

Blocking work belongs in a thread pool. Tokenizer calls, PDF parsing and image resizing are all CPU-bound. Wrap them in \`run_in_threadpool\` or move them to a worker, otherwise they stall every concurrent stream on that process.

The framing that makes the rest follow: an LLM API server is not really a compute service, it is an IO multiplexer that happens to be written in Python. Design it like a proxy rather than like a web app.

---

## Diagrams

### Why sync workers collapse under LLM latency

\`\`\`mermaid
---
title: "Sync vs Async Workers Under 8 Second LLM Calls"
---
flowchart TD
    A["100 concurrent users"] --> B{"Concurrency model"}

    B -->|"Sync, 8 workers"| C["Worker 1 blocked 8s"]
    B -->|"Sync, 8 workers"| D["Worker 8 blocked 8s"]
    C --> E["92 users queued<br/>CPU at 2 percent"]
    D --> E
    E --> F["Throughput ~1 req/s<br/>latency grows without bound"]

    B -->|"Async event loop"| G["100 coroutines awaiting IO<br/>one thread, no blocking"]
    G --> H["Bounded by connection pool<br/>and upstream rate limits"]
    H --> I["Throughput limited by the PROVIDER<br/>not by your process"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class G,H process
    class B decision
    class C,D,E,F risk
    class I output
\`\`\`

### One blocking call poisons the whole loop

\`\`\`mermaid
---
title: "Where Blocking Calls Hide in an Async AI Handler"
---
flowchart LR
    A["Async request handler"] --> B{"Call type"}

    B -->|"Async HTTP to model"| C["awaits, loop free"]
    B -->|"Sync SDK client"| D["BLOCKS event loop<br/>all concurrent streams stall"]
    B -->|"Sync DB session"| E["BLOCKS event loop"]
    B -->|"Sync file or S3 read"| F["BLOCKS event loop"]
    B -->|"Tokenizer or PDF parse"| G["CPU bound<br/>also blocks the loop"]

    D --> H["Fix: async SDK client"]
    E --> I["Fix: async driver plus async session"]
    F --> J["Fix: aiofiles or async S3 client"]
    G --> K["Fix: run_in_threadpool<br/>or move to a worker"]

    C --> L["Throughput scales with<br/>pool size and provider limits"]
    H --> L
    I --> L
    J --> L
    K --> L

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class C,H,I,J,K process
    class B decision
    class D,E,F,G risk
    class L output
\`\`\``,t="/blog/series/shipping-the-ai-product-01.svg",r={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},i="2026-07-31",a=3,l="Backend",c=["FastAPI","Async","Concurrency","Event Loop","Fast API","Python","AI Engineering","Software Architecture","Backend Development"],h=!1,p="Shipping the AI Product",d="shipping-the-ai-product",u=1,y=30,k={id:"301",slug:e,title:n,excerpt:o,content:s,featuredImage:t,author:r,publishedAt:i,readTime:a,category:l,tags:c,featured:h,series:p,seriesSlug:d,seriesPart:u,seriesTotal:y};export{r as author,l as category,s as content,k as default,o as excerpt,h as featured,t as featuredImage,f as id,i as publishedAt,a as readTime,p as series,u as seriesPart,d as seriesSlug,y as seriesTotal,e as slug,c as tags,n as title};
