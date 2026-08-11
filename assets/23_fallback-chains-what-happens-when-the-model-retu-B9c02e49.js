const f="223",e="fallback-chains-what-happens-when-the-model-returns-529",t="Fallback Chains: What Happens When the Model Returns 529",n="A system with one model provider has that provider's uptime as its ceiling. That is a design decision, and most teams make it by accident rather than on purpose.",a=`A system with one model provider has that provider's uptime as its ceiling. That is a design decision, and most teams make it by accident rather than on purpose.

The reflex when calls fail is to retry everything, and that is wrong. Classify first:

\`\`\`
429 rate limited      retry, exponential backoff + jitter
503 / 529 overloaded  retry twice, then FAIL OVER
500 server error      retry once, then fail over
408 timeout           retry, then fail over
400 bad request       DO NOT RETRY — will fail identically forever
401 / 403 auth        DO NOT RETRY — page someone
422 schema violation  retry ONCE with the error fed back
\`\`\`

Those two "do not retry" rows are where retry storms come from. A malformed request retried four times across twelve tool calls is 48 requests that were all going to fail.

Backoff needs jitter, not just an exponent:

\`\`\`
attempt 2:  1s + random(0, 1s)
attempt 3:  2s + random(0, 2s)
attempt 4:  4s + random(0, 4s)
\`\`\`

Without the random term, every client that failed at the same moment retries at the same moment, which is a synchronised load generator pointed at a service that is already struggling.

Cap the retry budget per task rather than per call. An agent making 12 tool calls, each retrying 4 times, is 48 requests.

The part most teams skip is that a fallback is not simply a second provider. It is a degradation ladder, and each rung is a deliberate quality trade:

\`\`\`
1  Primary model, primary provider
2  Same model, different region
3  Equivalent model, different provider
4  Smaller model, same provider          (quality trade, stated)
5  Cached / templated response           (freshness trade, stated)
6  Explicit degraded response            (honest failure)
\`\`\`

Rung 6 should be a real deliverable rather than a 500 page:

\`\`\`
"Retrieved your account history and identified 3 disputed charges.
 Could not process the refund — the payment service is unavailable.
 Queued as REF-8821, it will process automatically on recovery.
 No action needed from you."
\`\`\`

Partial value plus a clear next step, and the user does not have to repeat work.

Three implementation details decide whether any of this holds up.

Use circuit breakers, and let the agent see them. When a service is genuinely down, retrying adds load and burns budget. Open the circuit, and surface "inventory service unavailable" to the agent as an observation so it can fall back to cached data or answer the parts that do not need it. An agent that only sees a generic failure will just retry.

Remember that prompts are not portable across providers. A fallback path nobody has exercised is a fallback path that does not work. Route one percent of traffic through it permanently.

Order irreversible actions last. If a workflow performs the irreversible step first and then fails over, there is no recovery path. Reversible preparation first, then the gated commit.

---

## Diagrams

### Error classification and the degradation ladder

\`\`\`mermaid
---
title: "Error Classification and the Degradation Ladder"
---
flowchart TD
    A["Model call fails"] --> B{"Classify the error"}

    B -->|"400, 401, 403"| C["DO NOT RETRY<br/>fail fast, alert"]
    B -->|"422 schema"| D["Retry ONCE<br/>with the validation error in context"]
    B -->|"429 rate limit"| E["Backoff with jitter<br/>stay on primary"]
    B -->|"500, 503, 529, timeout"| F["Retry twice with jitter"]

    F --> G{"Still failing"}
    G -->|No| H["Success"]
    G -->|Yes| I["Open circuit on this provider"]

    I --> J["Rung 2: same model, other region"]
    J --> K{"Available"}
    K -->|No| L["Rung 3: equivalent model, other provider"]
    L --> M{"Available"}
    M -->|No| N["Rung 4: smaller model<br/>quality trade, logged"]
    N --> O{"Available"}
    O -->|No| P["Rung 5: cached or templated response"]
    P --> Q{"Applicable"}
    Q -->|No| R["Rung 6: explicit degraded response<br/>partial value plus next step"]

    K -->|Yes| H
    M -->|Yes| H
    O -->|Yes| H
    Q -->|Yes| H

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class D,E,F,J,L,N,P process
    class B,G,K,M,O,Q decision
    class C,I,R risk
    class H output
\`\`\`

### Circuit state should be visible to the agent

\`\`\`mermaid
---
title: "Circuit State Made Visible to the Agent"
---
flowchart TD
    A["CLOSED<br/>calls pass through"] -->|"Failure rate over threshold"| B["OPEN<br/>fail fast, zero downstream traffic"]
    B -->|"Cooldown elapsed"| C["HALF OPEN<br/>allow one probe"]
    C -->|"Probe succeeds"| A
    C -->|"Probe fails"| B

    B --> D["Emit to the AGENT as an observation<br/>inventory service unavailable"]
    D --> E{"Agent decides"}
    E -->|"Alternative tool exists"| F["Use cached data or a secondary source"]
    E -->|"Task can be partially completed"| G["Answer the parts that do not need it"]
    E -->|"Blocking dependency"| H["Halt before dependent steps<br/>compensate, emit resume token"]

    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A,C process
    class B,D,H risk
    class E decision
    class F,G output
\`\`\``,r="/blog/series/production-reality-23.svg",s={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},o="2026-07-23",i=4,l="LLMOps",d=["Fallback Chains","Resilience","Rate Limits","Reliability","AI Engineering","Site Reliability","LLMOps","System Design","Software Architecture"],c=!1,h="Production Reality",p="production-reality",u=23,m=30,g={id:"223",slug:e,title:t,excerpt:n,content:a,featuredImage:r,author:s,publishedAt:o,readTime:i,category:l,tags:d,featured:c,series:h,seriesSlug:p,seriesPart:u,seriesTotal:m};export{s as author,l as category,a as content,g as default,n as excerpt,c as featured,r as featuredImage,f as id,o as publishedAt,i as readTime,h as series,u as seriesPart,p as seriesSlug,m as seriesTotal,e as slug,d as tags,t as title};
