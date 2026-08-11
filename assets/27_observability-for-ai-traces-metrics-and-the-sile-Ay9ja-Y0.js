const g="127",e="observability-for-ai-traces-metrics-and-the-silent-failure-problem",n="Observability for AI: Traces, Metrics and the Silent Failure Problem",t="An AI feature can be completely broken while every dashboard stays green. The API returns 200s. Latency is normal. Error rate is zero.",s=`An AI feature can be completely broken while every dashboard stays green. The API returns 200s. Latency is normal. Error rate is zero. And the outputs have drifted far enough from what users need that people have quietly stopped using the feature.

This is the defining property of AI observability: **the failures that matter most produce no errors.** Traditional monitoring is built to detect things that break loudly. AI systems mostly break quietly.

---

## What is different about AI systems

| Traditional service | AI system |
|---|---|
| Failure raises an error | Failure returns a confident wrong answer |
| Correctness is deterministic | Correctness is a judgement |
| Same input, same output | Same input, different output |
| Cost is per request | Cost varies 100x by request |
| Latency is bounded by code paths | Latency varies with output length |
| A deploy changes behaviour | Behaviour can change with no deploy |

That last row deserves emphasis. A hosted model updated behind a stable name changes system behaviour without any change on your side. Without output-quality monitoring, this is undetectable until a user complains.

---

## The three pillars, applied

**Metrics** answer "is the system healthy right now". **Logs** answer "what exactly happened in this request". **Traces** answer "where did the time and the decision go across components".

For AI systems each pillar carries fields that ordinary services do not have.

### Metrics worth collecting

| Category | Metric | Why |
|---|---|---|
| Traffic | Requests per second, by endpoint and model | Baseline |
| Latency | TTFT and total, p50 p95 p99, split by input length | Two different phases, two different fixes |
| Errors | Rate by type: provider, timeout, validation, guardrail | Different causes, different responses |
| Tokens | Input, output, cached input, reasoning tokens per request | Cost driver |
| Cost | Per request, per user, per feature, per tenant | The number the business asks about |
| Cache | Prefix hit rate, semantic cache hit rate | Both are large cost levers |
| Quality | Judge score, refusal rate, citation rate, retrieval score distribution | The pillar most often missing |
| Agent | Steps per task, tool error rate, escalation rate, loop detections | Agent-specific health |
| Human | Approval rate, edit rate, override reasons | The strongest quality signal available |

The quality row is the one that distinguishes AI observability from ordinary monitoring, and it is the one most systems do not have.

### Traces: the span structure

A single AI request touches many components. A flat log tells you it was slow. A trace tells you which part.

\`\`\`mermaid
---
title: "Nested Spans in an AI Request Trace"
---
flowchart TD
    A["Span: request<br/>total 3,140 ms"] --> B["Span: guardrail input check<br/>40 ms"]
    A --> C["Span: query rewrite<br/>180 ms, model call"]
    A --> D["Span: retrieval<br/>620 ms"]
    A --> E["Span: generation<br/>2,180 ms"]
    A --> F["Span: guardrail output check<br/>120 ms"]

    D --> G["Span: dense search<br/>90 ms"]
    D --> H["Span: lexical search<br/>40 ms"]
    D --> I["Span: rerank<br/>480 ms"]

    E --> J["Attributes<br/>model, tokens in, tokens out,<br/>cached tokens, cost, finish reason"]
    I --> K["Attributes<br/>candidates in, returned,<br/>top score, score distribution"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef store fill:#F3F0F8,stroke:#8880AE,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933

    class A input
    class B,C,D,E,F,G,H process
    class I risk
    class J,K store
\`\`\`

In that example the reranker is 480 ms of a 620 ms retrieval span. Without the nested span, "retrieval is slow" is the whole diagnosis and the reranker is invisible.

Span attributes that pay for themselves:

- Model name **and version**, not just the alias
- Prompt template ID and version
- Token counts broken into input, cached input, output, reasoning
- Retrieval scores and the number of candidates at each stage
- Tool name, arguments (redacted), and outcome
- Guardrail decisions and which rule fired
- Cache hit or miss, and which cache
- The finish reason: stop, length, tool call, content filter

**Finish reason is a field teams routinely omit and then need.** A rise in \`length\` finishes means outputs are being truncated, which shows up to users as answers that stop mid-sentence and shows up in metrics as nothing at all.

---

## Detecting silent failure

The core problem. Four approaches, and a real system uses several.

### Proxy signals from user behaviour

The cheapest quality signal available, because users generate it for free.

| Signal | Interpretation |
|---|---|
| Immediate rephrase of the same question | The first answer failed |
| Conversation abandoned after a response | The answer was unusable |
| Copy or export of the answer | The answer was useful |
| Thumbs down, or a correction | Explicit failure |
| Escalation to a human immediately after | The system did not resolve it |
| Repeated identical question across sessions | The answer never landed |

A rising rephrase rate is one of the earliest and most reliable signals that quality has degraded, and it needs no labelling effort at all.

### Online judging on a sample

Run an LLM judge on a small percentage of production traffic. Not all of it, which would be expensive, but enough to detect a shift.

\`\`\`
Sample rate:     2 percent of traffic
Judge cost:      small model, binary faithfulness check
Alert condition: 7-day rolling pass rate drops more than 5 points
                 below the 30-day baseline
\`\`\`

The sampling rate needs to be high enough that a real shift is statistically visible within the alerting window. On low-traffic systems this means a higher percentage.

### Distribution monitoring

Watch the shape of things, not just averages.

- **Input distribution.** A shift in question types, languages or lengths means the system is being used differently than it was evaluated for.
- **Retrieval score distribution.** A downward shift means the corpus no longer covers what users ask, which is a content gap rather than a model problem.
- **Output length distribution.** A sudden shift usually means a prompt or model change took effect.
- **Refusal rate.** Both directions matter. Rising means over-cautious behaviour; falling means the system stopped declining things it should decline.

### Canary evaluation in production

Run a small fixed set of golden queries against production on a schedule, and score them. This catches provider-side model changes, index corruption, and configuration drift that no code change would explain.

\`\`\`mermaid
---
title: "Canary Evaluation Against Live Production"
---
flowchart TD
    A["Scheduled every 30 minutes"] --> B["Run 25 canary queries<br/>against live production"]
    B --> C["Score with code checks plus judge"]
    C --> D{"Score within expected band"}
    D -->|Yes| E["Record, no action"]
    D -->|No| F["Alert with the failing queries<br/>and their outputs"]

    F --> G{"Correlates with a deploy"}
    G -->|Yes| H["Likely our change<br/>candidate for rollback"]
    G -->|No| I["Likely upstream<br/>model version, index, or data change"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,C process
    class D,G decision
    class F,H,I risk
    class E output
\`\`\`

---

## Cost observability

Cost in AI systems varies by orders of magnitude between requests, which makes an average close to meaningless.

Dimensions worth tracking:

\`\`\`
Cost per request         -> distribution, not mean. Watch p95 and p99.
Cost per user            -> finds the heavy tail
Cost per tenant          -> essential for multi-tenant pricing
Cost per feature         -> which feature is actually expensive
Cost per resolved task   -> the number that matters commercially
Cached vs uncached spend -> shows what caching is actually saving
\`\`\`

**Cost per resolved task** is the metric to put on a business dashboard. A cheap model that fails and escalates to a human is not cheap. Tracking cost per token optimises the wrong variable.

Alerting on cost needs anomaly detection rather than a fixed threshold, because normal variation is wide. A useful pattern: alert when the current hour's spend exceeds the same hour last week by more than a set multiple.

---

## What this looks like in three real systems

### The model that changed without a deploy

A logistics company's document assistant degraded over a weekend. No deploys, no config changes, no infrastructure events. Every dashboard was green.

On Monday a support ticket described the assistant returning shorter, vaguer answers. Investigation found that the provider had updated the model behind the stable alias the system used.

Nothing in the observability stack recorded the model version, so the change was invisible. Nothing measured output quality, so the degradation was invisible. Nothing ran canary queries, so it was only discovered by a user.

Three additions closed the gap:

| Addition | Detects |
|---|---|
| Record the resolved model version on every span | The change itself, immediately |
| Canary evaluation every 30 minutes | Quality shift within half an hour |
| Output length distribution monitoring | The specific symptom, automatically |
| Pin to a versioned model identifier | Prevents the change from applying unannounced |

The last one is the actual fix. Using a stable alias means accepting silent model updates. Pinning a version means updates become a deliberate migration with an evaluation attached.

**If a system does not record which model version produced an output, it cannot explain a quality change.**

### The retrieval gap that looked like a model problem

A software company's support assistant had a resolution rate that fell from 74 percent to 58 percent over two months. The team investigated prompts and models.

The trace data had the answer, in a field nobody had been watching: the distribution of top rerank scores.

\`\`\`
March:      median top score 0.71,  below-threshold rate 9 percent
May:        median top score 0.44,  below-threshold rate 34 percent
\`\`\`

Retrieval was finding progressively weaker evidence. The model was fine. The corpus had stopped covering what people were asking about, because the product had shipped three major features and the documentation had not kept pace.

Segmenting the low-score queries by topic produced a ranked content gap list:

\`\`\`
Topic cluster                    Queries   Median score   Doc coverage
New workflow builder                412         0.21      none
Updated permissions model           288         0.33      partial, outdated
Mobile offline sync                 190         0.29      none
Legacy import (still documented)     22         0.78      complete
\`\`\`

The fix was writing documentation, and the observability told them exactly what to write and in what order.

**Retrieval score distribution is a content gap detector.** It converts "the assistant is getting worse" into a prioritised backlog for the docs team.

### The agent whose cost tripled from one tenant

A B2B platform offered an agentic assistant on a per-seat price. Infrastructure cost rose sharply with no growth in seats.

Aggregate metrics showed average cost per request roughly flat. The problem was only visible in the distribution.

\`\`\`
Cost per request:
  p50   $0.011
  p90   $0.048
  p99   $2.140
  max  $18.600
\`\`\`

Segmenting by tenant found that one customer accounted for 61 percent of total spend with 3 percent of the seats. Their usage pattern involved very large document sets, which drove long agent runs with many tool calls.

\`\`\`mermaid
---
title: "Segmenting a Cost Anomaly Down to One Tenant"
---
flowchart TD
    A["Cost anomaly detected"] --> B["Segment by tenant"]
    B --> C["One tenant, 61 percent of spend"]
    C --> D["Segment that tenant by request"]
    D --> E["Agent runs averaging 34 steps<br/>versus platform median of 6"]
    E --> F["Trace one run"]
    F --> G["Document set of 2,400 files<br/>agent reading them individually"]

    G --> H["Three fixes"]
    H --> I["Per tenant step and token budgets"]
    H --> J["Batch document tool<br/>replaces per file reads"]
    H --> K["Usage tier pricing above a threshold"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,C,D,E,F process
    class G risk
    class H,I,J,K output
\`\`\`

The tool fix was the largest win. A \`read_documents(filter)\` tool returning summaries of a matched set replaced 2,400 individual reads, and average steps for that tenant fell from 34 to 7.

**Averages hide the tail, and in AI systems the tail is most of the cost.** Segment by tenant, by user and by feature, and look at p99 rather than the mean.

---

## Alerting that is worth waking someone for

An alert nobody acts on trains people to ignore alerts.

| Severity | Condition | Response |
|---|---|---|
| **Page** | Error rate above 5 percent for 5 minutes | Immediate |
| **Page** | p95 latency above 2x the SLO for 10 minutes | Immediate |
| **Page** | Hourly cost above 3x the same hour last week | Immediate |
| **Page** | Guardrail failures spiking | Immediate, possible attack |
| **Ticket** | Canary quality score below band for 2 consecutive runs | Same day |
| **Ticket** | Rephrase rate up more than 30 percent week over week | Same day |
| **Ticket** | Retrieval score distribution shifted down | Same week |
| **Dashboard** | Token usage trend, cache hit rate trend | Weekly review |

The cost alert belongs at page severity in most AI systems, which is unusual for infrastructure. A runaway agent loop can spend a month's budget in an afternoon.

---

## Failure modes

| Symptom | Observability gap |
|---|---|
| Quality dropped, no deploy explains it | Model version not recorded, no canary evaluation |
| "Retrieval is slow" with no further detail | No nested spans within the retrieval stage |
| Cost rose, cause unknown | No per-tenant or per-feature cost dimension |
| Truncated answers reported by users | Finish reason not recorded |
| Degradation found by a customer, not a dashboard | No output quality monitoring at all |
| Cannot reproduce a reported bad answer | Trace not linked to a user-visible response ID |
| Alerts ignored | Thresholds tuned to fire, not to be actionable |
| Prompt change effects untraceable | Prompt version not recorded on spans |

---

## What you do not instrument, you cannot see failing

AI observability differs from ordinary service observability in one decisive way: the important failures do not raise errors. A system that only monitors availability, latency and error rate is monitoring the failure modes it is least likely to have.

Four additions cover most of the gap. Record model and prompt versions on every span, so a behaviour change can be attributed. Watch output quality continuously through sampled judging, canary queries and user proxy signals. Watch distributions, not averages, because AI cost and latency have long tails that averages erase. And segment everything by tenant, user and feature, because aggregate numbers hide the one customer or the one feature that explains the anomaly.

The teams that skip this layer do not avoid the work. They do it later, during an incident, with raw logs and guesses.

---

*Next in this series: Guardrails and prompt injection defense.*`,a="/blog/series/ai-systems-track-27.svg",r={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},o="2026-06-27",i=11,l="LLMOps",d=["Observability","Tracing","Metrics","Monitoring","AI Engineering","LLMOps","System Design","MLOps"],h=!1,c="AI Systems Track",u="ai-systems-track",p=27,m=30,f={id:"127",slug:e,title:n,excerpt:t,content:s,featuredImage:a,author:r,publishedAt:o,readTime:i,category:l,tags:d,featured:h,series:c,seriesSlug:u,seriesPart:p,seriesTotal:m};export{r as author,l as category,s as content,f as default,t as excerpt,h as featured,a as featuredImage,g as id,o as publishedAt,i as readTime,c as series,p as seriesPart,u as seriesSlug,m as seriesTotal,e as slug,d as tags,n as title};
