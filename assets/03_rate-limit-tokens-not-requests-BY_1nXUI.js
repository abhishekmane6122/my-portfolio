const p="303",e="rate-limit-tokens-not-requests",t="Rate Limit Tokens, Not Requests",n='A limit of "100 requests per minute" treats a 12-token question and a 180,000-token document analysis as the same thing. They differ by four orders of magnitude in what they cost you.',s=`A limit of "100 requests per minute" treats a 12-token question and a 180,000-token document analysis as the same thing. They differ by four orders of magnitude in what they cost you.

Request-count limits work fine when every request costs roughly the same. In AI systems that assumption fails badly:

\`\`\`
User A   100 requests/min x 200 tokens    =    20,000 tokens/min
User B   100 requests/min x 180,000 tokens = 18,000,000 tokens/min

Same limit. 900x the cost. Both "within policy".
\`\`\`

The right unit is tokens, and there are several to meter separately because they price differently:

\`\`\`
input_tokens          cheapest
cached_input_tokens   often 50 to 90 percent off
output_tokens         typically 3 to 5x input
reasoning_tokens      billed at output rates, invisible in the response
\`\`\`

A limiter that counts only requests gets gamed by exactly the workload you most need to bound.

The implementation problem is that you do not know the cost until after the call, since output length is unknown at admission time. The pattern that handles this is reserve-then-reconcile:

\`\`\`
1  Estimate:  input_tokens (exact) + max_tokens (worst case)
2  Reserve:   deduct the estimate from the bucket
3  Admit:     if the bucket would go negative, reject with 429
4  Execute
5  Reconcile: refund the difference between max_tokens and actual
\`\`\`

You over-reserve and then give back. A request that reserved 4,000 output tokens and used 300 returns 3,700 to the bucket immediately.

Four details make this hold up in production.

Use a token bucket rather than a fixed window. Fixed windows allow a full burst at the boundary, so a user can spend twice their quota in two seconds across a window edge. A token bucket smooths that and is barely harder to implement in Redis.

Return proper headers. A 429 with no guidance just produces a retry storm.

\`\`\`
X-RateLimit-Limit-Tokens: 100000
X-RateLimit-Remaining-Tokens: 2400
Retry-After: 18
\`\`\`

Cap \`max_tokens\` per tier. If a user can request 100,000 output tokens, your reservation logic has to assume they will. A per-tier ceiling makes the worst case bounded and the reservation realistic.

Meter agent loops cumulatively. One "request" that runs 30 agent steps is 30 model calls. Limit the task rather than the HTTP call, or agents become the hole in your quota system.

One rule ties it together: whatever your billing meter counts, your rate limiter should count the same thing. When those two disagree, one of them is wrong, and it is usually the limiter.

---

## Diagrams

### Reserve then reconcile

\`\`\`mermaid
---
title: "Token Rate Limiting: Reserve, Execute, Reconcile"
---
flowchart TD
    A["Request arrives"] --> B["Count input tokens<br/>exact, real tokenizer"]
    B --> C["Estimate worst case<br/>input + max_tokens for this tier"]

    C --> D{"Bucket has capacity"}
    D -->|No| E["429 with Retry-After<br/>and remaining token headers"]
    D -->|Yes| F["RESERVE the estimate<br/>atomic decrement in Redis"]

    F --> G["Execute the model call"]
    G --> H["Read actual usage<br/>input, cached, output, reasoning"]

    H --> I["RECONCILE<br/>refund estimate minus actual"]
    I --> J["Bucket refills continuously<br/>token bucket, not fixed window"]
    J --> D

    H --> K[("Usage ledger<br/>same counter the billing meter reads")]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef store fill:#F3F0F8,stroke:#8880AE,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,C,F,G,H,I process
    class D decision
    class E risk
    class J output
    class K store
\`\`\`

### Why request counts are the wrong unit

\`\`\`mermaid
---
title: "Request Limits vs Token Limits: 900x Cost Difference"
---
flowchart LR
    A["Limit: 100 requests per minute"] --> B["User A<br/>short questions<br/>200 tokens each"]
    A --> C["User B<br/>document analysis<br/>180,000 tokens each"]

    B --> D["20,000 tokens/min<br/>within policy"]
    C --> E["18,000,000 tokens/min<br/>ALSO within policy"]

    E --> F["900x the cost<br/>same nominal limit"]

    F --> G["Fix: meter tokens"]
    G --> H["input_tokens"]
    G --> I["cached_input_tokens<br/>discounted"]
    G --> J["output_tokens<br/>3 to 5x input"]
    G --> K["reasoning_tokens<br/>billed at output rate"]

    H --> L["Plus: cap max_tokens per tier<br/>plus: meter agent loops cumulatively"]
    I --> L
    J --> L
    K --> L

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,C,D,G,H,I,J,K process
    class E,F risk
    class L output
\`\`\``,o="/blog/series/shipping-the-ai-product-03.svg",i={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},r="2026-08-02",a=4,l="Backend",u=["Rate Limiting","Token Budget","API Design","Cost Control","AI Engineering","Backend Development","System Design","APIDesign","Cost Optimization"],c=!1,h="Shipping the AI Product",d="shipping-the-ai-product",m=3,k=30,f={id:"303",slug:e,title:t,excerpt:n,content:s,featuredImage:o,author:i,publishedAt:r,readTime:a,category:l,tags:u,featured:c,series:h,seriesSlug:d,seriesPart:m,seriesTotal:k};export{i as author,l as category,s as content,f as default,n as excerpt,c as featured,o as featuredImage,p as id,r as publishedAt,a as readTime,h as series,m as seriesPart,d as seriesSlug,k as seriesTotal,e as slug,u as tags,t as title};
