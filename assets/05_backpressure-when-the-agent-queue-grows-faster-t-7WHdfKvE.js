const g="305",e="backpressure-when-the-agent-queue-grows-faster-than-it-drains",t="Backpressure: When the Agent Queue Grows Faster Than It Drains",s="The arithmetic is unforgiving: Nothing errors. The dashboard shows 100 percent success. Every task eventually completes.",n=`**A queue is not a buffer. It is a place where latency accumulates until someone notices.**

The arithmetic is unforgiving:

\`\`\`
Arrival rate:   12 tasks/sec
Service rate:   10 tasks/sec
Queue growth:    2 tasks/sec

After 1 hour:   7,200 queued tasks
Wait time:      12 minutes and climbing
\`\`\`

Nothing errors. The dashboard shows 100 percent success. Every task eventually completes. Users experience a system that is slowly becoming useless, and the alert that would have caught it does not exist because nobody alerts on queue depth.

AI workloads make this worse than a normal service for three reasons:

**Service rate is not constant.** An agent task might take 4 seconds or 90. Your drain rate varies by an order of magnitude depending on what arrives.

**Upstream limits are outside your control.** A provider rate limit turns your service rate to zero regardless of how many workers you have running.

**Retries multiply arrivals.** When latency crosses a client timeout, clients retry. Arrival rate goes up precisely when service rate is already too low. This is the feedback loop that turns a slowdown into an outage.

The response is a bounded queue with an explicit policy for what happens when it fills:

\`\`\`
Reject       429 with Retry-After — honest, protects the system
Shed         drop low priority work, keep the interactive path
Degrade      route to a smaller and faster model
Absorb       accept into a slow lane with a stated ETA
\`\`\`

**Unbounded queues are the wrong default and they are the default everywhere.** An unbounded queue converts a capacity problem into a latency problem, and latency problems are invisible until they are severe.

Four things worth instrumenting before any of this matters:

\`\`\`
queue_depth              the leading indicator, alert on trend not threshold
oldest_message_age       what the unluckiest user is experiencing
arrival_rate             per priority class
service_rate             per priority class
\`\`\`

**Alert on \`arrival_rate > service_rate\` sustained for N minutes.** That fires while the queue is still short, which is the only useful time to know.

And separate the lanes. Interactive requests and background jobs have opposite requirements, and if they share a queue the batch job decides the product's p95. Reserved capacity for the interactive lane, preemptible capacity for background work, and background work that is explicitly allowed to be late.

**A queue that only ever grows is not absorbing load. It is hiding the fact that you are under-provisioned.**

---

## Diagrams

### The retry death spiral

\`\`\`mermaid
---
title: "How Retries Turn a Slowdown Into an Outage"
---
flowchart TD
    A["Arrival 12/s, service 10/s"] --> B["Queue grows 2/s"]
    B --> C["Wait time increases"]
    C --> D{"Wait exceeds client timeout"}

    D -->|No| E["Degraded but stable"]
    D -->|Yes| F["Clients time out and RETRY"]

    F --> G["Arrival rate rises to 18/s"]
    G --> H["Queue grows 8/s"]
    H --> C

    H --> I["Collapse<br/>service rate unchanged<br/>arrivals now dominated by retries"]

    I --> J["Break the loop"]
    J --> K["Bounded queue, reject at the edge"]
    J --> L["Retry-After header so clients back off"]
    J --> M["Circuit breaker on the upstream"]
    J --> N["Load shed by priority class"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class E process
    class D decision
    class B,C,F,G,H,I risk
    class J,K,L,M,N output
\`\`\`

### Bounded queue with an explicit overflow policy

\`\`\`mermaid
---
title: "Bounded Queue Policy: Reject, Shed, Degrade or Absorb"
---
flowchart TD
    A["Incoming task"] --> B["Classify priority"]

    B --> C{"Queue depth vs bound"}
    C -->|"Under soft limit"| D["Enqueue normally"]
    C -->|"Over soft limit"| E{"Priority class"}
    C -->|"At hard limit"| F["Reject 429<br/>with Retry-After"]

    E -->|Interactive| G["Enqueue in reserved lane"]
    E -->|Background| H["SHED<br/>drop or defer to off peak"]
    E -->|"Interactive, degradable"| I["DEGRADE<br/>route to smaller faster model"]

    D --> J["Worker pool"]
    G --> J
    I --> J

    J --> K["Emit metrics<br/>queue_depth, oldest_message_age<br/>arrival_rate, service_rate"]
    K --> L{"arrival_rate over service_rate<br/>sustained N minutes"}
    L -->|Yes| M["ALERT while the queue is still short"]
    L -->|No| N["Healthy"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,D,G,I,J,K process
    class C,E,L decision
    class F,H,M risk
    class N output
\`\`\``,r="/blog/series/shipping-the-ai-product-05.svg",a={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},o="2026-08-04",i=4,l="Infrastructure",c=["Backpressure","Queues","Load Shedding","Scaling","System Design","Distributed Systems","AI Engineering","Site Reliability","Backend Development"],u=!1,h="Shipping the AI Product",d="shipping-the-ai-product",p=5,f=30,m={id:"305",slug:e,title:t,excerpt:s,content:n,featuredImage:r,author:a,publishedAt:o,readTime:i,category:l,tags:c,featured:u,series:h,seriesSlug:d,seriesPart:p,seriesTotal:f};export{a as author,l as category,n as content,m as default,s as excerpt,u as featured,r as featuredImage,g as id,o as publishedAt,i as readTime,h as series,p as seriesPart,d as seriesSlug,f as seriesTotal,e as slug,c as tags,t as title};
