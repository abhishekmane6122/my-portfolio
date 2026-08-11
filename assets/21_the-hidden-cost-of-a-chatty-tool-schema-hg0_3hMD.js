const m="221",e="the-hidden-cost-of-a-chatty-tool-schema",t="The Hidden Cost of a Chatty Tool Schema",n="Something that is easy to miss when adding agent capabilities: every tool you add makes every other tool slightly harder to pick correctly.",o=`Something that is easy to miss when adding agent capabilities: every tool you add makes every other tool slightly harder to pick correctly. The quality cost arrives before the token cost does.

Take a DevOps agent that accumulated capability over a year.

\`\`\`
64 tools x ~190 tokens of schema = 12,160 tokens
\`\`\`

Twelve thousand tokens consumed before a single word of the user's question. That is the obvious problem. The quieter one was that tool selection accuracy sat at 71 percent, and had been degrading steadily as tools were added, and nobody had connected the two facts. Past roughly 15 to 20 tools, models start confusing similar options.

Three fixes, and the first is usually enough.

Filter by task class. A cheap classifier determines the request domain and only that domain's tools enter the context. A billing question does not need the deployment tools.

\`\`\`
Before   64 schemas, always loaded         ~12,160 tokens
After    6 domain summaries               ~700 tokens
         plus the selected domain's tools ~1,400 tokens
         selection accuracy               71 -> 94 percent
\`\`\`

Progressive disclosure. Expose a small set of high-level tools, one of which fetches the detailed schema for a capability on demand. You trade one round trip for a large permanent context saving.

Delegate by domain. Sub-agents own tool subsets and a coordinator routes between them. Worth reaching for only when filtering genuinely is not enough, since it costs you a context boundary and boundaries lose information.

Separate from tool count, the schemas and outputs themselves are usually about twice the size they need to be. Tool output is context, not a log:

\`\`\`
Poor  2,400 tokens
{"status":"success","request_id":"req_88213","timestamp":"...",
 "data":{"results":[{"id":"ord_1","created_at":"...","updated_at":"...",
 "internal_flags":{...},"metadata":{...}, ...40 fields x 20 orders]}}

Good  180 tokens
Found 20 orders for C-88213 (newest 5):
  ORD-9921  2026-07-28  delivered  $142.00  2 items
  ORD-9887  2026-07-14  delivered  $89.50   1 item
  ...
15 more. Call find_customer_orders(offset=5) for the next page.
\`\`\`

Same information. Internal IDs, timestamps and metadata the model will never use are pure cost, on every call, forever.

One more thing that is easy to underinvest in: the tool description is a prompt, not documentation. It gets read on every single request.

\`\`\`
Weak    "Searches the CRM."
Strong  "Returns up to 20 OPPORTUNITIES matching a query.
         Does NOT search contacts or accounts — use find_contacts
         or find_accounts for those. Requires an exact deal_id for
         notes; get one from find_deals first."
\`\`\`

A tool whose description overstates its scope is worse than a missing tool, because the agent stops looking after it calls it. One CRM agent went from 47 percent to 91 percent task success on that change alone.

---

## Diagrams

### Three ways to survive tool growth

\`\`\`mermaid
---
title: "Three Ways to Survive Tool Growth"
---
flowchart TD
    A["Agent needs 64 capabilities"] --> B{"Mitigation"}

    B -->|Filter| C["Task classifier picks a domain<br/>only that domain's tools loaded"]
    B -->|Group| D["6 domain summaries<br/>plus on demand schema fetch"]
    B -->|Delegate| E["Sub agents own tool subsets<br/>coordinator routes by domain"]

    C --> F["6 to 10 tools per request<br/>~1,400 tokens<br/>selection accuracy preserved"]
    D --> G["~700 tokens baseline<br/>one extra round trip when needed"]
    E --> H["Each agent sees only its own tools<br/>cost: a context boundary"]

    F --> I["Try filtering FIRST<br/>cheapest, no architecture change"]
    G --> I
    H --> J["Only when filtering is insufficient"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class C,D,E,F,G process
    class B decision
    class H risk
    class I,J output
\`\`\`

### Aggregate in the tool, not in the model

\`\`\`mermaid
---
title: "Aggregate in the Tool, Not in the Model"
---
flowchart LR
    subgraph SG1["Raw dump tool"]
    A["get_logs(service, 30min)"] --> B["84,221 raw lines<br/>~40,000 tokens"]
    B --> C["Context exhausted<br/>agent cannot reason further"]
    end

    subgraph SG2["Aggregating tool"]
    D["get_log_summary(service, 30min)"] --> E["Total 84,221 lines<br/>Errors 1,204 across 3 patterns<br/>[1] 1,180x connection reset<br/>[2] 22x deadline exceeded<br/>[3] 2x nil pointer<br/>~150 tokens"]
    E --> F["Agent picks a pattern"]
    F --> G["get_log_samples(service, pattern_id)<br/>raw examples for ONE pattern"]
    end

    C --> H["Counting, grouping and dedup<br/>are cheap in code<br/>and expensive in tokens"]
    G --> H

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A,D input
    class B,C risk
    class E,F,G process
    class H output
\`\`\``,s="/blog/series/production-reality-21.svg",a={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},r="2026-07-21",i=4,l="Agentic AI",c=["Tool Schemas","Token Cost","AI Agents","Function Calling","Agentic AI","MCP","AI Engineering","LLMOps","Software Architecture"],d=!1,h="Production Reality",u="production-reality",g=21,p=30,f={id:"221",slug:e,title:t,excerpt:n,content:o,featuredImage:s,author:a,publishedAt:r,readTime:i,category:l,tags:c,featured:d,series:h,seriesSlug:u,seriesPart:g,seriesTotal:p};export{a as author,l as category,o as content,f as default,n as excerpt,d as featured,s as featuredImage,m as id,r as publishedAt,i as readTime,h as series,g as seriesPart,u as seriesSlug,p as seriesTotal,e as slug,c as tags,t as title};
