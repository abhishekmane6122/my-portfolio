const g="302",e="sse-vs-websockets-for-token-streaming",n="SSE vs WebSockets for Token Streaming",t="A lot of teams reach for WebSockets to stream tokens, and end up owning a bidirectional protocol they never use in one direction. Token streaming is server-to-client only.",o=`A lot of teams reach for WebSockets to stream tokens, and end up owning a bidirectional protocol they never use in one direction.

Token streaming is server-to-client only. The client sends one request and then listens, which is exactly the shape Server-Sent Events was designed for.

\`\`\`
SSE          one way, server to client
             plain HTTP, works through every proxy
             automatic browser reconnect with Last-Event-ID
             text only

WebSocket    two way, full duplex
             protocol upgrade, some proxies interfere
             you implement reconnection yourself
             binary supported
\`\`\`

The decision is not really about performance, since both stream perfectly well. It comes down to whether the client needs to send anything mid-stream.

\`\`\`
Streaming a response         -> SSE
Streaming agent step updates -> SSE
Interrupting a generation    -> SSE + a DELETE endpoint
Live collaborative editing   -> WebSocket
Voice, bidirectional audio   -> WebSocket
Multiplexing many channels   -> WebSocket
\`\`\`

That third row is where teams usually talk themselves into WebSockets. "The user needs to stop generation" feels bidirectional, but it is really a second HTTP call to \`DELETE /generations/{id}\`, which is simpler than maintaining a socket.

Four operational details decide whether SSE actually works in practice.

Proxy buffering will break it silently. nginx buffers responses by default, so your tokens generate correctly, arrive at nginx, and sit there until the response completes. The user waits the full 8 seconds and then gets everything at once. Streaming looks broken while the application logs look perfect.

\`\`\`
proxy_buffering off;
proxy_read_timeout 300s;
X-Accel-Buffering: no
\`\`\`

Heartbeats keep the connection alive. Load balancers close idle connections, and a model thinking for 30 seconds before its first token looks idle. Send a comment line every 15 seconds.

You have already sent HTTP 200, so an error at token 300 cannot change the status code. You need an in-band \`event: error\` and a client that handles it, otherwise a failed generation renders as a complete one that just stopped early.

Cancellation has to reach the inference call. A user closing the tab should stop the generation, and if the disconnect is not propagated you keep paying for tokens nobody will read.

Default to SSE. Reach for WebSockets when the client genuinely needs to speak mid-stream, and be honest that voice is usually the only case that qualifies.

---

## Diagrams

### Choosing the streaming transport

\`\`\`mermaid
---
title: "SSE or WebSocket: Choosing a Streaming Transport"
---
flowchart TD
    A["Need to stream model output"] --> B{"Does the client send data<br/>DURING the stream"}

    B -->|"No, listens only"| C["SSE"]
    B -->|"Only to cancel"| D["SSE plus a DELETE endpoint<br/>simpler than a socket"]
    B -->|"Yes, continuous audio or edits"| E["WebSocket"]

    C --> F["Plain HTTP, proxy friendly"]
    C --> G["Browser auto reconnect<br/>with Last-Event-ID"]
    D --> F
    E --> H["You own reconnection logic"]
    E --> I["Protocol upgrade, check proxies"]

    F --> J["Required config<br/>proxy_buffering off<br/>heartbeat every 15s<br/>in band error events"]
    H --> J
    G --> J
    I --> J

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class C,D,E,F,G process
    class B decision
    class H,I risk
    class J output
\`\`\`

### The proxy buffering failure

\`\`\`mermaid
---
title: "How Proxy Buffering Silently Breaks SSE"
---
flowchart LR
    subgraph SG1["Default nginx config"]
    A["App emits token 1 at t=0.3s"] --> B["nginx buffer"]
    C["App emits token 400 at t=8s"] --> B
    B --> D["Buffer flushed at response end"]
    D --> E["User sees nothing for 8s<br/>then the whole answer at once"]
    end

    subgraph SG2["Streaming enabled"]
    F["App emits token 1 at t=0.3s"] --> G["proxy_buffering off<br/>X-Accel-Buffering: no"]
    G --> H["User sees token 1 at t=0.3s"]
    end

    E --> I["App logs look PERFECT<br/>the bug is entirely in the proxy"]
    H --> J["Perceived latency<br/>8s becomes 0.3s"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A,C,F input
    class G,H process
    class B,D,E,I risk
    class J output
\`\`\``,s="/blog/series/shipping-the-ai-product-02.svg",r={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},i="2026-08-01",a=3,l="Backend",c=["SSE","WebSockets","Streaming","API Design","Fast API","Backend Development","AI Engineering","Software Architecture","Web Development"],d=!1,h="Shipping the AI Product",p="shipping-the-ai-product",u=2,f=30,k={id:"302",slug:e,title:n,excerpt:t,content:o,featuredImage:s,author:r,publishedAt:i,readTime:a,category:l,tags:c,featured:d,series:h,seriesSlug:p,seriesPart:u,seriesTotal:f};export{r as author,l as category,o as content,k as default,t as excerpt,d as featured,s as featuredImage,g as id,i as publishedAt,a as readTime,h as series,u as seriesPart,p as seriesSlug,f as seriesTotal,e as slug,c as tags,n as title};
