const g="117",e="anatomy-of-an-agent-the-control-loop-that-turns-a-model-into-a-worker",t="Anatomy of an Agent: The Control Loop That Turns a Model Into a Worker",n="The difference between a chatbot and an agent is not intelligence. The same model powers both. The difference is a loop. A chatbot is request-response.",o=`The difference between a chatbot and an agent is not intelligence. The same model powers both. The difference is a loop.

A chatbot is request-response. Input arrives, output leaves, the interaction ends. An agent is a stateful control loop that observes, decides, acts, observes the consequence, and repeats until a goal condition is met or a budget is exhausted. That structure is what lets a model change the state of the world instead of only describing it.

Everything hard about agents comes from the loop, not the model.

---

## The four phases

\`\`\`mermaid
---
title: "The Agent Control Loop: Four Phases"
---
flowchart TD
    A["Goal or Request"] --> B["DELIBERATE<br/>read state, decide next action"]
    B --> C{"Action needed"}
    C -->|Yes| D["ACT<br/>call a tool, change external state"]
    C -->|No, goal met| E["Final Response"]

    D --> F["OBSERVE<br/>capture result, error, or output"]
    F --> G["UPDATE<br/>append to state, compact if needed"]
    G --> H{"Stop condition"}
    H -->|Budget exhausted| I["Terminate with partial result"]
    H -->|No progress| J["Terminate, escalate"]
    H -->|Continue| B

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,D,F,G process
    class C,H decision
    class I,J risk
    class E output
\`\`\`

**Deliberate.** The model reads the current state, which is the goal plus everything done so far, and decides what to do next. The quality of this phase depends almost entirely on how well the state is represented, not on how clever the prompt is.

**Act.** A tool is called. Something external changes: a file is written, a record is updated, a query is run. This is the phase that distinguishes an agent from a reasoning chain.

**Observe.** The result comes back, including failures. Errors are information, not exceptions to swallow. An agent that cannot see that its action failed will confidently proceed as though it succeeded.

**Update.** The observation is appended to state. Old content may be compacted. The loop restarts with more information than it had before.

---

## Levels of agency

Not every system that calls a tool is an agent, and not every agent needs full autonomy. The levels are worth naming because they have different risk and engineering profiles.

| Level | Description | Who decides the next step | Typical use |
|---|---|---|---|
| 0 | Single model call | Nobody, fixed | Classification, generation |
| 1 | Fixed chain | Developer, at design time | ETL pipeline, extraction flow |
| 2 | Router | Model, one choice, then fixed | Support triage, intent routing |
| 3 | Tool-calling loop | Model, each iteration | Research assistant, data analysis |
| 4 | Planning agent | Model, plans then executes with revision | Multi-step task automation |
| 5 | Multi-agent | Model, includes delegation | Complex workflows across domains |

The most common architectural mistake is jumping to level 4 or 5 when level 2 or 3 solves the problem. Each level up adds nondeterminism, cost, latency and debugging difficulty. **Use the lowest level that solves the problem**, and be able to say why the level below was insufficient.

A useful test: if the sequence of steps is the same every time, it is a pipeline, and writing it as a pipeline makes it faster, cheaper and testable. An agent is warranted when the sequence genuinely varies with the input.

---

## The components

An agent is five components around a model.

**State.** Everything the agent knows: the goal, actions taken, observations received, intermediate conclusions. This is the single most important design decision in the system, because the model can only reason about what state makes visible.

**Tools.** The action surface. Each tool is a contract: a name, a description the model reads, a schema, and an implementation. Tool design is covered in its own chapter, and it is where agent reliability is most often won or lost.

**Memory.** Tiered storage beyond the current context: what happened in past sessions, durable facts, learned procedures. Covered in its own chapter.

**Policy.** The rules governing what the agent may do: which tools, with what arguments, requiring what approvals, within what budgets.

**Controller.** The loop itself, including stop conditions, error handling, retries and budget enforcement. Almost always ordinary code, and it should be.

\`\`\`mermaid
---
title: "Agent Components: Controller, Policy Gate, State, Memory"
---
flowchart LR
    A["Controller<br/>the loop, budgets, stop conditions"] --> B["Model<br/>deliberation"]
    B --> C["Policy Gate<br/>is this action permitted"]
    C -->|Denied| D["Refuse or request approval"]
    C -->|Allowed| E["Tool Executor<br/>sandboxed"]
    E --> F["Observation"]
    F --> G["State Manager<br/>append, compact, checkpoint"]
    G --> A

    H[("Memory Tiers<br/>episodic, semantic, procedural")] --> G
    G --> H

    I[("Trace Store<br/>every step, every decision")] --> A
    A --> I

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef store fill:#F3F0F8,stroke:#8880AE,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933

    class A,B,E,F,G process
    class C decision
    class D risk
    class H,I store
\`\`\`

The policy gate sitting between deliberation and execution is the component most often missing from first implementations. The model proposing an action and the system permitting it must be two separate decisions, because the model is not a security boundary.

---

## Stop conditions are the whole safety story

An agent without stop conditions is an unbounded spend on a loop that may not converge. Five, all necessary:

1. **Goal achieved.** An explicit success check, ideally verifiable by code rather than by the model asserting it is done.
2. **Turn limit.** A hard cap on iterations.
3. **Token budget.** Cumulative across the loop, not per call.
4. **Wall-clock deadline.** Especially for anything user-facing.
5. **No-progress detection.** The loop repeated an action with the same result, or state has not changed meaningfully in N iterations.

The fifth is the one most often skipped and the one that catches the most common pathology. An agent that reads the same file four times, or issues the same failing command repeatedly, is not going to succeed on attempt five.

Every terminal state needs a designed output. "Ran out of turns" should produce a structured summary of what was accomplished, what was not, and what a human should do next. Not silence, and not a fabricated completion.

---

## State representation determines everything

The failure mode that looks like a weak model is almost always a weak state representation.

Consider two ways of showing an agent what it has done.

**Raw transcript:**
\`\`\`
[tool: read_file]  ...4000 tokens of file contents...
[tool: search]     ...2000 tokens of results...
[tool: read_file]  ...4000 tokens of the same file again...
[tool: run_tests]  ...6000 tokens of test output...
\`\`\`

Sixteen thousand tokens, most of it stale, with the important signal buried. By iteration eight, the goal is thousands of tokens back and the model is attending to a wall of tool output.

**Structured state:**
\`\`\`
GOAL: Fix the failing test in payments/refund_test.py

PROGRESS:
  - Located failing assertion at line 84
  - Root cause: refund amount not rounded before comparison
  - Edit applied to refund.py line 31

OPEN:
  - Tests not yet re-run after edit

RECENT OUTPUT (last action only):
  ...200 tokens...
\`\`\`

Four hundred tokens. The goal is visible, progress is explicit, the next action is obvious. Old tool output has been stripped once its information was extracted.

The techniques that produce the second from the first:

- **Strip stale tool output.** Once an observation has been distilled into a conclusion, the raw output is dead weight. Replace it with the conclusion.
- **Maintain an explicit progress record** that the agent updates, rather than requiring it to re-derive progress from the transcript.
- **Keep the goal restated near the end of the context**, not only at the top where it will be attended to least.
- **Deduplicate observations.** If the same file was read twice, keep one copy.

**Most "the agent got confused" problems are state representation problems.**

---

## What this looks like in three real systems

### The data pipeline that should never have been an agent

A retailer built an agent to process nightly sales files: download, validate, transform, load, and send a summary. It used a planning agent with six tools and full autonomy.

It worked about 92 percent of the time. The 8 percent produced creative failures: choosing to skip validation because a file "looked fine", loading a partial file after a download error, and once summarising a load that had not happened.

The steps were the same every night. There was no decision to make.

Rewritten as ordinary code with model calls only where judgement was genuinely required:

\`\`\`mermaid
---
title: "Model Calls Only Where Judgement Is Required"
---
flowchart TD
    A["Nightly trigger"] --> B["Download file<br/>deterministic code"]
    B --> C["Schema validation<br/>deterministic code"]
    C --> D{"Validation passed"}
    D -->|No| E["Model call<br/>classify the anomaly and draft an alert"]
    D -->|Yes| F["Transform<br/>deterministic code"]
    F --> G["Load<br/>deterministic code, transactional"]
    G --> H["Model call<br/>write a human readable summary"]
    H --> I["Send report"]
    E --> J["Page on call with classification"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,C,F,G,H process
    class D decision
    class E,J risk
    class I output
\`\`\`

Reliability went to effectively 100 percent, cost dropped by 95 percent, and the two remaining model calls do the two things a model is genuinely better at: interpreting an unexpected anomaly, and writing readable prose.

**The question is not "can an agent do this". It is "does the sequence vary".** If it does not, a pipeline is the correct architecture, and model calls belong at the specific points where judgement is required.

### The research assistant where state design fixed the loop

A pharmaceutical competitive intelligence agent searched internal documents, public filings and news, then produced a briefing. It routinely hit its 20-turn limit without finishing.

The traces showed a clear pattern. By turn 12, the context held roughly 60,000 tokens of accumulated search results. The agent began re-running searches it had already run, because the earlier results were buried and it had no representation of what it had already covered.

The fix was a structured research state that the agent maintained explicitly:

\`\`\`
RESEARCH STATE

Questions to answer:
  [done] Which competitors filed in this therapeutic area since 2024
  [done] What were the reported trial endpoints
  [open] What manufacturing partnerships were announced
  [open] Any regulatory actions on file

Searches already run:
  - "competitor filings oncology 2024-2026"     -> 14 results, 3 useful
  - "phase III endpoints [compound class]"      -> 8 results, 5 useful

Findings (with sources):
  - Competitor A filed March 2025, primary endpoint PFS [doc_2213]
  - Competitor B partnership with [manufacturer] [news_881]
\`\`\`

Roughly 500 tokens, updated after each action, replacing 60,000 tokens of raw results. Raw results were archived and retrievable but not carried in context.

Average turns to completion fell from over 20 to 7. **The model did not get smarter. It could finally see what it had done.**

### The deployment agent where the policy gate mattered

A platform team built an agent to handle routine infrastructure requests: scale a service, roll back a deployment, adjust an alert threshold.

The first version let the model call tools directly. During testing, a request to "clean up the old staging environment" resulted in the agent proposing to delete a namespace whose name was one character from production.

The model was not malicious and the reasoning was defensible given ambiguous instructions. The problem was architectural: proposing an action and being permitted to perform it were the same event.

Separating them:

\`\`\`mermaid
---
title: "The Policy Gate: Proposal Is Not Permission"
---
flowchart TD
    A["Model proposes action<br/>delete_namespace, name=stagng-2"] --> B["Schema validation<br/>types and required fields"]
    B --> C["Policy engine<br/>declarative rules, not model based"]

    C --> D{"Action class"}
    D -->|Read only| E["Execute immediately"]
    D -->|Reversible write| F["Execute, log, allow undo"]
    D -->|Destructive| G["Require human approval<br/>show the exact diff"]
    D -->|Outside allowed scope| H["Refuse and log"]

    G --> I{"Approved"}
    I -->|Yes| J["Execute with approver recorded"]
    I -->|No| K["Return refusal to the loop as an observation"]

    E --> L[("Audit Log<br/>proposal, decision, result, approver")]
    F --> L
    J --> L
    H --> L
    K --> L

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef store fill:#F3F0F8,stroke:#8880AE,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,C,E,F,J process
    class D,I decision
    class G,H,K risk
    class L store
\`\`\`

Three properties of that design are worth copying.

**The policy engine is declarative code**, not a model deciding whether an action is safe. A model cannot be a security boundary for actions it proposed.

**Refusals return to the loop as observations.** The agent learns that the action was denied and can propose an alternative, rather than crashing or retrying identically.

**Every proposal is logged, including denied ones.** The denied proposals turned out to be the most valuable operational signal: they showed exactly where the agent's understanding diverged from policy.

---

## Failure modes

| Symptom | Cause |
|---|---|
| Agent takes 15 steps for a 3-step task | Poor state representation, re-deriving progress each turn |
| Repeats the same action | No no-progress detection, no observation deduplication |
| Confidently reports success on a failed action | Errors swallowed instead of surfaced as observations |
| Cost per task wildly variable | No token budget across the loop |
| Ignores the goal in later turns | Goal stated only at the top of a growing context |
| Proposes dangerous actions | No policy gate, model treated as a security boundary |
| Impossible to debug a bad run | No per-step trace with state snapshots |
| Works in testing, fails on real inputs | Tested on the happy path only, no failure injection |

---

## The loop is the architecture

An agent is a control loop with a model in the deliberation slot. The model matters less than most of the surrounding machinery: how state is represented, how tools are defined, what stop conditions exist, and what the policy gate permits.

Three principles carry most of the weight. Use the lowest agency level that solves the problem, because every level up costs determinism. Design state deliberately, because the model reasons about what state shows it and nothing else. And make the loop's boundaries explicit, because an agent without budgets and stop conditions is not autonomous, it is unbounded.

---

*Next in this series: ReAct and beyond — reasoning loops that survive production.*`,s="/blog/series/ai-systems-track-17.svg",a={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},i="2026-06-17",r=11,l="Agentic AI",d=["AI Agents","Control Loop","Tool Use","Agent Architecture","Agentic AI","AI Engineering","System Design","Software Architecture","LLMOps"],c=!1,h="AI Systems Track",p="ai-systems-track",u=17,m=30,f={id:"117",slug:e,title:t,excerpt:n,content:o,featuredImage:s,author:a,publishedAt:i,readTime:r,category:l,tags:d,featured:c,series:h,seriesSlug:p,seriesPart:u,seriesTotal:m};export{a as author,l as category,o as content,f as default,n as excerpt,c as featured,s as featuredImage,g as id,i as publishedAt,r as readTime,h as series,u as seriesPart,p as seriesSlug,m as seriesTotal,e as slug,d as tags,t as title};
