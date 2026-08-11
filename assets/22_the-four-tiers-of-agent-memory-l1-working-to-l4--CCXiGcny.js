const f="122",e="the-four-tiers-of-agent-memory-l1-working-to-l4-procedural",t="The Four Tiers of Agent Memory: L1 Working to L4 Procedural",n='"Add memory to the agent" is a requirement that hides four different systems with four different storage technologies, latency budgets, write patterns and failure modes.',s=`"Add memory to the agent" is a requirement that hides four different systems with four different storage technologies, latency budgets, write patterns and failure modes.

Treating memory as one thing produces the systems everyone has used: an assistant that recalls a trivial preference from six months ago while forgetting what was decided ten minutes earlier, or one that pastes an entire past conversation into context because it has no way to extract the one fact that mattered.

The tiers are not an academic taxonomy. Each one exists because a specific question needs answering, and each has a different right answer for where the data lives.

---

## The four tiers

| Tier | Name | Answers | Technology | Latency |
|---|---|---|---|---|
| **L1** | Working | What is happening right now | Context window, KV cache | Under 50 ms |
| **L2** | Episodic | What happened before | Vector store with timestamps | 100 to 300 ms |
| **L3** | Semantic | What is true about this user or domain | Structured store, knowledge graph | 200 to 500 ms |
| **L4** | Procedural | How to perform this kind of task | Skill registry, workflow store | Loaded on match |

Their operational properties differ more than the descriptions suggest.

| Dimension | L1 Working | L2 Episodic | L3 Semantic | L4 Procedural |
|---|---|---|---|---|
| **Holds** | Current turn, tool output, scratchpad | Past sessions, trajectories, timestamped events | Distilled facts, preferences, relationships | Skills, playbooks, proven action sequences |
| **Read pattern** | Every token, always in attention | Top-k by similarity, recency and importance | Triggered by entity or topic mention | Loaded when task signature matches |
| **Write pattern** | Continuous, by the inference engine | Append-only, committed at turn boundaries | Extract, deduplicate, resolve conflicts, upsert | Reflective write after a success or failure |
| **Deletion** | Evicted by compaction | Decayed or archived by policy | Corrected or superseded | Deprecated when it stops working |
| **Main failure** | Overflow, lost-in-the-middle | Retrieval miss, stale episodes | Contradiction, silent staleness | Overgeneralised procedure applied wrongly |

---

## L1: working memory

The context window and the KV cache. Everything the model can see this turn.

Its defining property is that it is the only tier the model attends to directly. Everything in L2, L3 and L4 only matters if something retrieves it into L1.

Management is compaction: which turns stay verbatim, which get summarised, what gets evicted. This is covered fully in the context engineering chapter. The point relevant here is that **L1 is a cache, not a store.** Anything that must survive belongs in a lower tier before it is evicted.

---

## L2: episodic memory

"What happened" with a timestamp. Past sessions, past trajectories, past decisions.

The design questions are boundary detection and retrieval.

**Boundaries.** Where does one episode end and the next begin? Three approaches: session-based (one session equals one episode), time-based (a gap of N minutes starts a new one), and topic-based (a detected shift in subject). Session-based is simplest and correct for most products. Topic-based matters for long-running sessions covering several unrelated subjects.

**Retrieval.** Pure semantic similarity is not enough, because episodic memory has a temporal dimension that similarity ignores. A useful scoring function combines three signals:

\`\`\`
score = w1 * semantic_similarity
      + w2 * recency_decay
      + w3 * importance
\`\`\`

Recency matters because a decision from last week usually outranks a similar one from two years ago. Importance matters because a session where a major decision was made should outrank a routine one. Systems that rank episodes on similarity alone consistently surface old, irrelevant sessions that happen to use similar words.

Each episode should carry a generated summary, a timestamp range, participant identifiers, topic labels, and an importance score. The summary is what gets injected into L1; the full transcript stays archived and retrievable on demand.

---

## L3: semantic memory

Facts that outlive the session they were learned in. "This customer runs a Postgres 15 cluster." "This user prefers metric units." "This account is on the enterprise tier with a custom SLA."

The distinguishing feature is that L3 has no timeline. It does not matter when the fact was learned; it matters whether it is currently true.

Three hard problems live here.

**Extraction.** Turning conversational text into clean declarative facts. "Oh yeah, we moved off MySQL last quarter" becomes "Primary database is not MySQL as of Q2 2026" — and ideally triggers a follow-up to learn what it is now.

**Deduplication.** "The user prefers dark mode" and "User has dark theme enabled" are one fact. String matching misses this; embedding similarity above a threshold catches it. Without deduplication the store fills with restatements and retrieval returns five versions of the same thing.

**Contradiction.** The genuinely hard one. A new fact conflicts with a stored one. Sometimes that is a correction (the user changed jobs). Sometimes it is an error (a misextraction). Sometimes both facts are true in different contexts (different environments, different accounts).

\`\`\`mermaid
---
title: "Semantic Memory: Dedup and Contradiction Resolution"
---
flowchart TD
    A["New candidate fact"] --> B["Embed and search existing facts"]
    B --> C{"Similarity above threshold"}
    C -->|No| D["Insert as new fact<br/>with source and timestamp"]
    C -->|Yes| E["Compare semantically"]

    E --> F{"Relationship"}
    F -->|Same meaning| G["Merge, update timestamp and source"]
    F -->|Contradicts| H{"Is it scoped differently"}
    F -->|Refines| I["Update with the more specific version"]

    H -->|Yes, different context| J["Store both with scope qualifiers"]
    H -->|No, genuine conflict| K{"Which is newer and better sourced"}

    K -->|New fact clearly supersedes| L["Supersede old, retain history"]
    K -->|Ambiguous| M["Flag for confirmation<br/>ask the user or a human"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef store fill:#F3F0F8,stroke:#8880AE,stroke-width:1px,color:#1F2933

    class A input
    class B,E,G,I,J,L process
    class C,F,H,K decision
    class M risk
    class D store
\`\`\`

The branch that most systems omit is "scoped differently". "The database is Postgres" and "The database is MongoDB" look contradictory until you know one refers to the analytics stack and one to the application stack. Facts stored without scope produce contradictions that are not contradictions.

Every fact should carry provenance: which session, which turn, what confidence. Without it, resolving a conflict is guesswork and correcting a wrong fact is impossible to trace.

---

## L4: procedural memory

How to do things. The skill library.

When an agent solves a multi-step task successfully, the action sequence is valuable knowledge. Without procedural memory, it re-derives that sequence every time, at full reasoning cost, with a fresh chance of getting it wrong.

A stored procedure is more than a list of steps:

\`\`\`
name:          reconcile_payment_discrepancy
signature:     task involves a payment amount mismatch between
               the gateway and the ledger
preconditions: gateway API access, ledger read access, period not locked
steps:         1. Pull gateway transactions for the period
               2. Pull ledger entries for the same period
               3. Match on transaction reference, not amount
               4. Classify unmatched items: timing, fee, or genuine gap
               5. Draft adjusting entries for the genuine gaps only
success_rate:  0.91 over 34 uses
last_failure:  multi-currency case, step 3 matched wrong currency
\`\`\`

The \`signature\` field is what makes retrieval work. Procedures are retrieved by matching a task description against signatures, not by similarity over the whole procedure text.

The \`success_rate\` and \`last_failure\` fields are what make the library maintainable. A procedure whose success rate is falling is a procedure that has drifted out of alignment with the systems it operates on, and it should be flagged rather than silently reused.

**The main risk in L4 is overgeneralisation.** A procedure extracted from one context gets applied to a superficially similar one where a precondition does not hold. Explicit preconditions, checked before the procedure is applied, are the mitigation.

---

## How the tiers work together

\`\`\`mermaid
---
title: "The Four Memory Tiers With Read and Write Routing"
---
flowchart TD
    A["User turn arrives"] --> B["Memory Router<br/>classify content and intent"]

    B --> C{"Read routing"}
    C -->|References the past| D["L2 episodic<br/>retrieve relevant sessions"]
    C -->|Mentions an entity| E["L3 semantic<br/>retrieve facts about it"]
    C -->|Matches a known task type| F["L4 procedural<br/>load matching skill"]
    C -->|Purely conversational| G["No retrieval"]

    D --> H["L1 working context<br/>assembled and ordered"]
    E --> H
    F --> H
    G --> H

    H --> I["Model call"]
    I --> J["Response"]

    J --> K{"Write routing"}
    K -->|New durable fact stated| L["Extract, dedupe, upsert to L3"]
    K -->|Session ended| M["Summarise and append to L2"]
    K -->|Task completed successfully| N["Extract procedure, write to L4"]
    K -->|Nothing durable| O["No write"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef store fill:#F3F0F8,stroke:#8880AE,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,H,I,L,M,N process
    class C,K decision
    class D,E,F store
    class G,O,J output
\`\`\`

The router is the component that makes this affordable. Querying every tier on every turn injects context that is mostly irrelevant and costs a large fixed token overhead per turn. Routing reads to the tiers a given message actually needs typically cuts memory-related token spend by 60 to 80 percent with no loss in answer quality.

Write routing matters just as much. Not every turn produces a durable fact. Writing indiscriminately fills L3 with conversational noise that then competes with real facts at retrieval time.

---

## Where does fact X go?

The question that comes up constantly. A decision rule:

| Property of the information | Tier |
|---|---|
| Needed only for the current task | L1, nowhere else |
| "When did we discuss this" matters | L2 |
| True regardless of when it was learned | L3 |
| Describes how to do something, not what is true | L4 |
| Changes frequently | L3 with supersede history, never L2 alone |
| Must never be lost | L3, extracted explicitly, never left to summarisation |
| Learned from a success or failure pattern | L4 |

The most common misplacement is putting durable facts only in L2. A fact recorded inside an episode summary is retrievable only if the episode is retrieved, which requires the query to resemble that past session. Facts belong in L3 where they can be retrieved by entity.

---

## What this looks like in three real systems

### The wealth advisory assistant that asked the same question every month

A financial coaching product held monthly sessions with each client. Every session started by asking the client's income, risk tolerance and goals, because the system stored only session transcripts.

Clients found this insulting, reasonably.

The transcripts were in L2. Nothing was in L3. The information existed but was only retrievable by semantic similarity against past sessions, and a new session's opening turns did not resemble the turn six months ago where income was stated.

Adding L3 extraction changed the interaction entirely:

\`\`\`
CLIENT PROFILE (L3, injected every session, ~180 tokens)
  income:            stated 2026-02-14, session 3
  risk_tolerance:    moderate, revised 2026-05-09 from conservative
  goals:             home purchase 2029, retirement 2048
  constraints:       no equity in tobacco or defence (hard, stated 2026-01-10)
  dependents:        2, ages stated 2026-03-21
\`\`\`

Two design points made it hold up.

**Every fact carries a source and a date.** When risk tolerance was revised, the old value was superseded rather than deleted, and the change was visible. That history turned out to matter for compliance.

**Hard constraints were marked as hard.** The exclusion list is not a preference to be weighed; it is a rule. Marking it as such meant it was injected verbatim rather than summarised.

Repeat-question complaints went to zero. The more interesting outcome was that advisors began using the L3 profile as a briefing document before calls.

### The support platform where procedural memory paid for itself

A telecom's technical support agent handled a long tail of connectivity issues. Each one was solved from first principles: check line status, check modem firmware, check provisioning record, check for area outages, in whatever order the agent chose.

Average resolution took 11 tool calls. Roughly a third of cases followed one of six recurring patterns.

Adding L4:

\`\`\`
name:          intermittent_dropouts_with_recent_firmware_update
signature:     customer reports intermittent disconnections, and the
               modem firmware was updated within the last 30 days
preconditions: modem is a supported model, line diagnostics accessible
steps:         1. Confirm firmware version and update date
               2. Check known-issue register for that firmware build
               3. If matched, schedule rollback and set expectation
               4. If not matched, pull 7-day line stability graph
               5. Escalate to network ops only if line errors exceed threshold
success_rate:  0.94 over 210 uses
\`\`\`

For matched cases, resolution dropped from 11 tool calls to 4, because the agent did not have to discover the diagnostic order.

The maintenance mechanism was the important part. Success rate is tracked per procedure. When a firmware issue was fixed upstream, the procedure's success rate fell to 0.61 over two weeks and it was flagged automatically for review.

**A skill library without success tracking becomes a library of stale advice.** The tracking is what makes it a system rather than a folder of notes.

### The developer assistant where memory routing cut cost by three quarters

An internal engineering assistant queried all four memory tiers on every message.

\`\`\`
Per turn, before routing:
  L2 episodic:   3 episodes injected      ~600 tokens
  L3 semantic:   12 facts injected        ~250 tokens
  L4 procedural: 2 procedures injected    ~400 tokens
  Total memory overhead:                 ~1,250 tokens every turn
\`\`\`

On a message like "thanks, that worked", all 1,250 tokens were waste. Analysis showed roughly 45 percent of turns needed no memory retrieval at all.

A small classifier at the front of the turn:

| Message intent | Tiers queried | Typical overhead |
|---|---|---|
| Acknowledgement or chit-chat | None | 0 |
| Factual question about a system | L3 only | ~250 |
| "What did we decide about X" | L2 plus L3 | ~850 |
| "Help me do X" where X is a known task | L4 plus L3 | ~650 |
| Novel multi-step request | L2, L3, L4 | ~1,250 |

Average memory overhead fell from 1,250 tokens to about 310. Answer quality on a labelled set was statistically unchanged.

The classifier itself is a small model call costing perhaps 30 tokens, which pays for itself many times over.

---

## Failure modes

| Symptom | Tier at fault |
|---|---|
| Forgets a fact stated earlier in the session | L1 compaction with no L3 extraction |
| Asks the same question every session | No L3, facts only in L2 episodes |
| Recalls trivia, misses important decisions | L2 ranking on similarity without importance |
| Holds contradictory beliefs | L3 with no conflict resolution |
| Applies a solution that does not fit | L4 procedure without precondition checks |
| Memory overhead dominates token cost | No read routing, all tiers queried always |
| Retrieval slows as the system ages | No decay or archival policy |
| Cannot explain why it believes something | No provenance on L3 facts |
| Stale advice repeated confidently | L4 with no success-rate tracking |

---

## Four tiers, four different jobs

Agent memory is four systems, not one. Working memory is a cache. Episodic memory is a timestamped log. Semantic memory is a fact store with conflict resolution. Procedural memory is a skill library with success tracking.

Three practices separate systems that work from systems that frustrate. Extract durable facts into L3 explicitly rather than trusting summarisation to preserve them. Route reads and writes so that not every tier is consulted on every turn. And attach provenance and freshness to everything stored, because memory that cannot be traced cannot be corrected.

The tier that most systems are missing is L3. It is also the one that removes the most user-visible frustration.

---

*Next in this series: Error handling and recovery — designing agents that fail well.*`,r="/blog/series/ai-systems-track-22.svg",i={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},a="2026-06-22",o=12,c="Agentic AI",l=["Agent Memory","Episodic Memory","Semantic Memory","State","Agentic AI","AIMemory","AI Engineering","System Design","LLMOps"],d=!1,h="AI Systems Track",m="ai-systems-track",u=22,p=30,g={id:"122",slug:e,title:t,excerpt:n,content:s,featuredImage:r,author:i,publishedAt:a,readTime:o,category:c,tags:l,featured:d,series:h,seriesSlug:m,seriesPart:u,seriesTotal:p};export{i as author,c as category,s as content,g as default,n as excerpt,d as featured,r as featuredImage,f as id,a as publishedAt,o as readTime,h as series,u as seriesPart,m as seriesSlug,p as seriesTotal,e as slug,l as tags,t as title};
