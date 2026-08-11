const g="108",e="context-engineering-designing-the-window-not-the-prompt",t="Context Engineering: Designing the Window, Not the Prompt",n="Prompt engineering asks what wording produces the best output. Context engineering asks a different and considerably more consequential question: given a fixed token budget, what should...",s=`Prompt engineering asks what wording produces the best output. Context engineering asks a different and considerably more consequential question: given a fixed token budget, what should occupy it, in what order, from what sources, and what gets evicted when it overflows.

The first question is a writing task. The second is a systems design task, and it is where production AI quality is actually won or lost.

---

## The window is a resource, not a container

Every request to a model carries a fixed budget. Everything competes for it: system instructions, tool schemas, few-shot examples, retrieved documents, conversation history, and the space reserved for the model's own output.

Systems that treat this as a container fill it opportunistically and overflow unpredictably. Systems that treat it as a budget allocate it explicitly.

A worked allocation for a 128,000-token window on an agentic workload:

| Segment | Budget | Policy when over |
|---|---|---|
| System instructions | 2,000 | Never truncated, fail loudly instead |
| Tool schemas | 4,000 | Prune unused tools by task class |
| Few-shot examples | 3,000 | Drop lowest-similarity examples first |
| Retrieved context | 40,000 | Rerank and take top-k by score |
| Conversation history | 60,000 | Compact oldest turns into summary |
| Reserved for output | 16,000 | Hard reserve, never allocated to input |
| Safety margin | 3,000 | Absorbs tokenizer estimation error |

The reserved output block is the line most often missing. A system that fills the input to the window edge and then asks for a long answer gets a truncation error or a silently clipped response. Reserve the output space first and allocate the remainder.

---

## The four operations of context management

Everything a context system does reduces to four operations, and naming them makes design decisions cleaner.

**Select.** Choose what is relevant to this turn. Retrieval, memory lookup, tool schema filtering.

**Compress.** Reduce token count while preserving meaning. Summarisation, extraction, formatting compaction.

**Order.** Place content where the model will attend to it. Stable content first for caching, strongest evidence last for attention.

**Evict.** Remove what no longer earns its place. Turn compaction, tool output stripping, memory decay.

\`\`\`mermaid
---
title: "The Four Operations of Context Management"
---
flowchart TD
    A["Turn Begins"] --> B["SELECT<br/>retrieve, recall, filter tools"]
    B --> C["COMPRESS<br/>summarise, extract, compact format"]
    C --> D["ORDER<br/>stable prefix first, evidence last"]
    D --> E{"Fits in budget"}
    E -->|Yes| F["Assemble Prompt"]
    E -->|No| G["EVICT<br/>oldest turns, weakest evidence"]
    G --> C
    F --> H["Model Call"]
    H --> I["Append result to history"]
    I --> A

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,C,D,F,H,I process
    class E decision
    class G risk
\`\`\`

The loop from eviction back into compression is the part that has to be bounded. An eviction policy that can be triggered repeatedly without guaranteeing progress will spin. Every eviction pass must free a minimum number of tokens or escalate to a harder strategy.

---

## Ordering is a cost decision and a quality decision at the same time

Two independent forces push in the same direction, which is convenient.

**Caching wants stability first.** Prompt caching matches on prefix. Any variable content placed early invalidates everything after it. A timestamp at position 40 destroys the discount on 8,000 tokens of system prompt.

**Attention wants importance last.** Recall within a long context is strongest at the edges and weakest in the middle. Evidence placed immediately before the question is used more reliably than evidence buried in the middle.

Combined, they give a canonical ordering:

\`\`\`
1. System instructions          (identical every call, cacheable)
2. Tool schemas                 (identical per task class, cacheable)
3. Few-shot examples            (usually stable, cacheable)
4. Long-lived memory facts      (changes slowly)
5. Conversation summary         (changes at compaction boundaries)
6. Recent conversation turns    (changes every turn)
7. Retrieved evidence           (changes every turn, weakest first)
8. The current user question    (last, immediately before generation)
\`\`\`

The gain from getting this right is not marginal. On a system with a large stable prefix, correct ordering versus careless ordering is frequently a three-to-five times difference in effective input cost, plus a measurable accuracy improvement from evidence placement.

---

## Compaction strategies and what each one loses

When history exceeds budget, something must be compressed. The strategies form a lineage, each solving the previous one's failure.

| Strategy | Mechanism | Keeps | Loses |
|---|---|---|---|
| **Truncate oldest** | Drop the front of the transcript | Recency, exactness | Everything early, silently |
| **Sliding window** | Keep last N turns | Bounded cost, exactness | Early facts, with no signal that they existed |
| **Rolling summary** | LLM compresses old turns | Meaning across the whole session | Exact wording, and detail drifts each cycle |
| **Summary plus buffer** | Summary of old, verbatim recent | Both gist and precision | Tuning burden on the threshold |
| **Structured extraction** | Pull facts into typed fields | Durable facts, queryable | Narrative and nuance |
| **Retrieval over archive** | Archive everything, retrieve on demand | Nothing permanently | Latency, and retrieval can miss |

The strategy that holds up best in production is a combination: verbatim recent turns for precision, a rolling summary for narrative, structured extraction for facts that must never be lost, and an archive with retrieval as the safety net.

The important discipline is that **eviction is not deletion**. A turn that leaves the active window should be written to durable storage. Systems that discard evicted content have no path to recovery when the summary turns out to have dropped something that mattered.

---

## Summary drift, and how to bound it

Rolling summarisation has a specific failure that compounds quietly. Each compression cycle summarises a summary. Small distortions introduced in cycle three are treated as source material in cycle four. Over twenty cycles, the summary can diverge meaningfully from what actually happened, and nothing in the system flags it.

Three mitigations, in increasing order of effectiveness:

**Anchor facts separately.** Extract hard facts (identifiers, numbers, stated constraints, decisions) into a structured store that is never summarised. The summary carries narrative; the structured store carries truth. Contradictions resolve in favour of the structured store.

**Summarise from source, not from summary.** Rather than incrementally updating a summary, periodically regenerate it from the archived original turns. More expensive, and it resets accumulated drift to zero.

**Measure it.** Keep a small set of questions whose answers are known from the original transcript. Ask them against the compacted context periodically. A drop in accuracy is drift, made visible.

---

## Tool schemas are context too

A frequently missed budget line. Every tool definition passed to a model consumes tokens on every call, and tool definitions are verbose: name, description, full JSON schema with nested properties and descriptions.

Thirty tools at 200 tokens each is 6,000 tokens on every request, whether or not any of them are relevant.

Two fixes, both straightforward:

**Filter by task class.** A router determines what kind of request this is and passes only the relevant tool subset. A billing question does not need the deployment tools.

**Progressive disclosure.** Expose a small set of high-level tools, one of which retrieves the detailed schema for a specific capability on demand. Trades one extra round trip for a large permanent context saving.

There is a quality argument here as well as a cost one. Beyond roughly fifteen to twenty tools, selection accuracy degrades. Every tool added makes every other tool slightly harder to pick correctly.

---

## Extended thinking and the reasoning budget

Models that produce explicit internal reasoning introduce a second budget that shares the same window. Reasoning tokens are generated, billed, and in some cases retained across turns.

The design implications:

- **Reasoning budget is tunable.** Allocating more improves hard-task accuracy and does nothing for simple tasks. Setting it high globally is the same class of mistake as running every request on the frontier tier.
- **Reasoning tokens are output tokens.** They bill at output rates, which are typically several times input rates. A model that appears cheap on list price can be expensive in practice.
- **Reasoning does not always help.** On simple, well-specified tasks, extended reasoning can degrade results by overthinking a straightforward answer. This is measurable on a golden set and worth measuring.

---

## Instrumentation that makes this manageable

Context problems are invisible without measurement. Four fields per request make them obvious.

1. **Token count per segment.** Not just the total. Which segment grew is the whole diagnosis.
2. **Cache hit rate on the prefix.** A drop means something variable moved earlier in the prompt.
3. **Compaction events.** When they fired, how many tokens they freed, which strategy ran.
4. **Position of the answer-bearing evidence.** If retrieved evidence that contained the answer sat in the middle, that is an ordering bug, not a retrieval bug.

\`\`\`mermaid
---
title: "Instrumenting the Context Assembler"
---
flowchart LR
    A["Request"] --> B["Context Assembler"]
    B --> C["Emit per segment token counts"]
    B --> D["Emit cache prefix hash"]
    B --> E["Emit compaction events"]
    C --> F[("Trace Store")]
    D --> F
    E --> F
    F --> G["Dashboard<br/>budget drift, cache rate, compaction frequency"]
    G --> H{"Budget breach trending"}
    H -->|Yes| I["Alert before overflow errors start"]
    H -->|No| J["Continue"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef store fill:#F3F0F8,stroke:#8880AE,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,C,D,E,G process
    class F store
    class H decision
    class I risk
    class J output
\`\`\`

---

## What this looks like in three real systems

### The banking assistant that forgot the customer's account

A retail bank's assistant handles long sessions. A customer states their account type in turn 2, then asks fifteen questions about fees, limits and transfers. Around turn 18, the assistant asks them again which account they hold.

The session had crossed the compaction threshold. Turn 2 was summarised into a paragraph, and the summariser judged "customer mentioned they have a Premier account" to be less important than the more recent discussion about international transfer limits. The fact was gone, and nothing in the system knew it had ever been there.

The fix was not a better summariser. It was recognising that some facts must never be summarisable:

\`\`\`mermaid
---
title: "Pinned Facts Survive Compaction, Narrative Does Not"
---
flowchart TD
    A["Every turn"] --> B["Fact extractor<br/>small model, schema constrained"]
    B --> C{"Matches a pinned fact type"}
    C -->|Yes| D[("Structured Fact Store<br/>account type, limits, consents")]
    C -->|No| E["Ordinary conversation history"]

    E --> F{"History over budget"}
    F -->|Yes| G["Summarise oldest turns"]
    F -->|No| H["Keep verbatim"]

    D --> I["Prompt assembly<br/>facts injected verbatim, never compressed"]
    G --> I
    H --> I
    I --> J["Model call"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef store fill:#F3F0F8,stroke:#8880AE,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,G,H,I process
    class D store
    class C,F decision
    class E,J output
\`\`\`

The pinned fact list for that product was eleven items long. Account type, verified identity status, stated accessibility needs, consent flags, active dispute references. Eleven fields, roughly 200 tokens, never compressed, and an entire class of embarrassing failures disappeared.

**Narrative can be summarised. Facts must be extracted.**

### The DevOps agent that ran out of window on its own tool list

An infrastructure agent accumulated capabilities over a year: 64 tools spanning deployments, logs, metrics, incidents, cost reports and access management. Each schema averaged around 190 tokens.

\`\`\`
64 tools x 190 tokens = ~12,160 tokens of tool schema
\`\`\`

Twelve thousand tokens consumed before a single word of the user's question. Two separate problems followed. Cost, obviously. And a quieter one: tool selection accuracy had been degrading steadily as tools were added, and nobody had connected the two facts.

The rebuild grouped tools into six capability domains and exposed one discovery tool:

| Before | After |
|---|---|
| 64 schemas, always loaded | 6 domain summaries, ~700 tokens |
| ~12,160 tokens per call | Plus the selected domain's schemas, ~1,400 tokens |
| Tool selection accuracy 71 percent | Tool selection accuracy 94 percent |

The cost of one extra round trip when the agent needs to load a domain is far smaller than the cost of carrying every schema on every call, and the accuracy improvement was the bigger win.

### The research assistant whose summary drifted into fiction

A pharmaceutical team ran long research sessions, sometimes forty or fifty turns over several hours. The system used rolling summarisation: each compaction summarised the previous summary plus the newly evicted turns.

By turn 45, the summary asserted that a particular compound had shown efficacy in a trial. It had not. Turn 8 had said a trial was *planned*. Turn 19's summary rendered that as "trial underway". Turn 31's summary rendered that as "trial results discussed". Turn 45 rendered it as a finding.

No single compaction step made a large error. Each one made a small one, and each subsequent step treated the previous error as source material.

Three changes bounded it:

1. **Periodic regeneration from source.** Every fifth compaction, rebuild the summary from the archived original turns rather than from the previous summary. Accumulated drift resets to zero.
2. **A claims register.** Factual assertions get extracted into a structured list with the turn number they originated from. Anything in the summary that contradicts the register loses.
3. **A drift probe.** Ten questions with known answers from the original transcript, asked against the compacted context every ten turns. A drop in accuracy is drift made visible before a user finds it.

The probe is the part worth copying. Drift is silent by construction, and the only way to know it is happening is to check on purpose.

---

## Failure modes

| Symptom | Context-engineering cause |
|---|---|
| Model ignores an instruction it used to follow | Instruction pushed into the middle by growing context |
| Overflow errors appear only in long sessions | No output reservation, no compaction trigger |
| Prompt caching discount disappeared | Variable content moved ahead of stable content |
| Agent forgets a fact stated early in the session | Summarisation dropped it, no structured fact store |
| Costs grow non-linearly with session length | Full history resent every turn, no compaction |
| Answers degrade as more context is retrieved | Attention diluted across low-relevance passages |
| Tool selection accuracy falls as features ship | Tool schema count past the model's reliable range |

---

## Spend the window deliberately

The context window is the working memory of the system, and like any memory hierarchy it needs an explicit policy: what gets admitted, in what order, what gets compressed, what gets evicted, and where evicted content goes.

Prompt wording matters. Budget allocation, ordering and eviction policy matter more, because they determine what the wording is operating on. A brilliantly written instruction that has been silently truncated does nothing at all.

---

*Next in this series: Chain of thought, tree of thought, and when reasoning tokens pay off.*`,o="/blog/series/ai-systems-track-08.svg",a={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},r="2026-06-08",i=11,c="AI Engineering",l=["Context Engineering","Prompting","Context Window","RAG","AI Engineering","LLMOps","System Design","Prompt Engineering"],d=!1,h="AI Systems Track",u="ai-systems-track",m=8,p=30,f={id:"108",slug:e,title:t,excerpt:n,content:s,featuredImage:o,author:a,publishedAt:r,readTime:i,category:c,tags:l,featured:d,series:h,seriesSlug:u,seriesPart:m,seriesTotal:p};export{a as author,c as category,s as content,f as default,n as excerpt,d as featured,o as featuredImage,g as id,r as publishedAt,i as readTime,h as series,m as seriesPart,u as seriesSlug,p as seriesTotal,e as slug,l as tags,t as title};
