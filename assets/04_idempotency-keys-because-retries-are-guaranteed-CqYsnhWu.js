const y="304",e="idempotency-keys-because-retries-are-guaranteed",t="Idempotency Keys, Because Retries Are Guaranteed",n="An 8-second request sitting behind a 5-second gateway timeout will be retried by the client while the first call is still running.",s=`An 8-second request sitting behind a 5-second gateway timeout will be retried by the client while the first call is still running. Now you are paying twice, and the user may get two different answers.

AI endpoints hit every condition that makes duplicate execution likely:

\`\`\`
Long duration        8 to 60 seconds, well past most default timeouts
Aggressive clients   SDKs and browsers retry on timeout by default
Expensive calls      a duplicate is real money, not a wasted CPU cycle
Non-deterministic    retry 2 returns a DIFFERENT answer, not the same one
Side effects         agents write files, send emails, update records
\`\`\`

That fourth line is what makes this different from ordinary API design. A retried CRUD read returns the same row. A retried generation returns different text, so what the user ends up seeing depends on which response arrives first — a race you cannot debug from logs afterwards.

The contract is straightforward:

\`\`\`
POST /v1/generations
Idempotency-Key: 3f9a1c2e-...    (client generated, per logical operation)
\`\`\`

And the server behaviour:

\`\`\`
Key unseen        -> claim it atomically, execute, store the result
Key seen, done    -> return the stored response, do not re-execute
Key seen, running -> 409 Conflict, or block and stream the same result
Key seen, failed  -> allow one retry, clear the claim
\`\`\`

Four implementation details matter more than the happy path.

Claim the key before doing the work, atomically — \`SETNX\` in Redis, or an insert against a unique constraint. If you check and then write, two concurrent retries will both pass the check and both execute.

Store the response body, not just a flag. The whole point is returning the identical answer. A flag tells you it ran, but it does not let you reproduce what the user saw.

Scope the key by tenant. A global key namespace means one customer's UUID collision can affect another's. Key on \`(tenant_id, idempotency_key)\`.

Expire keys, but not too aggressively. 24 hours is a reasonable window: longer than any plausible client retry, long enough to cover an outage.

For agents, apply this at two levels — the task, and each individual tool call. An agent resuming from a checkpoint will re-propose the same actions, and \`send_email\` executing twice because the run resumed is precisely the failure this prevents.

Worth noting why the key is client-generated: the client is the only party that knows what counts as "the same operation". The server just has to honour it. A server generating its own key defeats the purpose entirely.

---

## Diagrams

### The idempotency key state machine

\`\`\`mermaid
---
title: "Idempotency Key Lifecycle for a Generation Endpoint"
---
flowchart TD
    A["POST with Idempotency-Key"] --> B["Atomic claim<br/>SETNX on tenant_id plus key"]

    B --> C{"Claim result"}
    C -->|"Claimed, new"| D["Mark RUNNING"]
    C -->|"Exists, COMPLETED"| E["Return stored response body<br/>do NOT re-execute"]
    C -->|"Exists, RUNNING"| F["409 Conflict<br/>or attach to the same stream"]
    C -->|"Exists, FAILED"| G["Clear claim, allow one retry"]

    D --> H["Execute model call"]
    G --> H

    H --> I{"Outcome"}
    I -->|Success| J["Store response body<br/>mark COMPLETED, TTL 24h"]
    I -->|Failure| K["Mark FAILED<br/>retry permitted"]

    J --> L["Return response"]
    E --> L

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,D,H,J process
    class C,I decision
    class F,G,K risk
    class E,L output
\`\`\`

### Why non-determinism makes duplicates worse

\`\`\`mermaid
---
title: "Duplicate Execution in a Non-Deterministic Endpoint"
---
flowchart LR
    A["Client sends request at t=0"] --> B["Gateway timeout at t=5s"]
    B --> C["Client retries at t=5s"]

    A --> D["Call 1 still running<br/>completes t=8s, answer X"]
    C --> E["Call 2 starts fresh<br/>completes t=13s, answer Y"]

    D --> F{"Which response reaches the user"}
    E --> F

    F --> G["Race condition<br/>X and Y are DIFFERENT text"]
    G --> H["Billed twice"]
    G --> I["User sees an answer<br/>you cannot reproduce from logs"]
    G --> J["Any side effects executed twice<br/>emails, writes, tool calls"]

    H --> K["Fix: idempotency key<br/>claimed atomically before execution"]
    I --> K
    J --> K

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A,C input
    class D,E process
    class B,F decision
    class G,H,I,J risk
    class K output
\`\`\``,r="/blog/series/shipping-the-ai-product-04.svg",i={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},o="2026-08-03",a=4,l="Backend",c=["Idempotency","Retries","API Design","Reliability","APIDesign","Backend Development","AI Engineering","System Design","Distributed Systems"],d=!1,u="Shipping the AI Product",h="shipping-the-ai-product",p=4,m=30,f={id:"304",slug:e,title:t,excerpt:n,content:s,featuredImage:r,author:i,publishedAt:o,readTime:a,category:l,tags:c,featured:d,series:u,seriesSlug:h,seriesPart:p,seriesTotal:m};export{i as author,l as category,s as content,f as default,n as excerpt,d as featured,r as featuredImage,y as id,o as publishedAt,a as readTime,u as series,p as seriesPart,h as seriesSlug,m as seriesTotal,e as slug,c as tags,t as title};
