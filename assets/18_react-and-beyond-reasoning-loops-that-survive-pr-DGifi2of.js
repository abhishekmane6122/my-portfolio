const f="118",e="react-and-beyond-reasoning-loops-that-survive-production",n="ReAct and Beyond: Reasoning Loops That Survive Production",t="ReAct is the pattern almost every agent starts with, and the one almost every agent outgrows. Understanding why it works, and precisely where it breaks, is the difference between an agent...",a=`ReAct is the pattern almost every agent starts with, and the one almost every agent outgrows. Understanding why it works, and precisely where it breaks, is the difference between an agent that handles ten steps and one that gives up at three.

The evolution runs in a straight line: interleave reasoning with action, then add reflection when actions fail, then plan before acting when the task is long, then encode the whole thing as an explicit graph when the plan itself needs structure. Each stage exists because the previous one failed at something specific.

---

## ReAct: reason, then act, then observe

The core insight is that reasoning and acting should alternate rather than being separated. A model that reasons about everything up front commits to a plan built on assumptions it has not tested. A model that acts without reasoning picks tools mechanically.

\`\`\`
Thought:      The user wants Q3 revenue for the western region.
              I need the regional sales table first.
Action:       query_database("SELECT region, revenue FROM sales WHERE quarter='Q3'")
Observation:  Error: column 'quarter' does not exist. Available: period, fiscal_qtr

Thought:      The schema uses fiscal_qtr. I should check its format before querying.
Action:       query_database("SELECT DISTINCT fiscal_qtr FROM sales LIMIT 5")
Observation:  ['2026-Q1', '2026-Q2', '2026-Q3']

Thought:      Format confirmed. Now the real query.
Action:       query_database("SELECT region, SUM(revenue) FROM sales
                              WHERE fiscal_qtr='2026-Q3' GROUP BY region")
Observation:  [('western', 4820000), ('eastern', 3910000), ...]

Thought:      I have what I need.
Answer:       Western region Q3 revenue was 4.82 million.
\`\`\`

The error at step one is the point. The observation carries information the model did not have, and the next thought incorporates it. This grounding loop is why ReAct outperforms pure reasoning on anything involving external systems.

---

## Where ReAct breaks

Four failures, all predictable, all common past about five iterations.

**Context growth.** Every thought, action and observation accumulates. By iteration ten the context is dominated by history and the goal is thousands of tokens back.

**No global plan.** ReAct is locally greedy. It picks a reasonable next step without a view of the whole task, which is fine for four steps and produces meandering paths over fifteen.

**No recovery strategy.** When an action fails, ReAct's only move is to think again and try something. There is no notion of "this approach is not working, try a different approach".

**Loop susceptibility.** Without explicit detection, a model that tries A, fails, tries B, fails, and then tries A again will do so indefinitely.

---

## Reflexion: learning inside a single task

The first extension adds an explicit reflection step after a failure or at the end of an attempt.

\`\`\`mermaid
---
title: "Reflexion: Converting Failure Into a Constraint"
---
flowchart TD
    A["Task"] --> B["Attempt<br/>ReAct loop"]
    B --> C{"Outcome"}
    C -->|Success| D["Done"]
    C -->|Failure| E["Reflect<br/>what went wrong and why"]
    E --> F["Extract a lesson<br/>one sentence, actionable"]
    F --> G[("Reflection buffer<br/>carried into next attempt")]
    G --> H{"Attempts remaining"}
    H -->|Yes| B
    H -->|No| I["Terminate with the reflections<br/>as a diagnostic report"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef store fill:#F3F0F8,stroke:#8880AE,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,E,F process
    class G store
    class C,H decision
    class I risk
    class D output
\`\`\`

The reflection is not a summary of what happened. It is a lesson stated as a constraint on the next attempt:

\`\`\`
Poor reflection:  "The query failed because of a schema error."
Good reflection:  "This database uses fiscal_qtr in 'YYYY-QN' format, not
                   a 'quarter' column. Inspect the schema before querying."
\`\`\`

The second one changes behaviour on the next attempt. The first restates the observation.

Reflexion works because it converts a sparse outcome signal (failed) into a dense one (failed for this reason, do this instead) without touching model weights. The learning lives entirely in text.

Two constraints keep it useful. Cap the attempts, because a model that has failed three times with three reflections is unlikely to succeed on four. And keep reflections short, because a growing reflection buffer reintroduces the context problem it was meant to help.

---

## Plan-and-solve: think globally first

For tasks with a knowable structure, planning before acting outperforms deciding step by step.

\`\`\`
Plan phase:
  1. Identify the affected service from the alert
  2. Pull error logs for that service, last 30 minutes
  3. Check recent deployments for that service
  4. Correlate deployment time with error onset
  5. If correlated, prepare a rollback proposal

Execute phase:
  Step 1 -> observation -> step 2 -> observation -> ...
\`\`\`

Two things this buys. Steps that do not depend on each other can run in parallel, which ReAct cannot do because it decides one step at a time. And the plan is inspectable before anything executes, which is a natural approval point for anything with side effects.

The critical design decision is what happens when reality contradicts the plan. A rigid plan is brittle. The workable pattern is a plan that can be revised:

\`\`\`mermaid
---
title: "Plan and Solve With Revision on Contradiction"
---
flowchart TD
    A["Goal"] --> B["Generate plan<br/>ordered steps with dependencies"]
    B --> C{"Plan requires approval"}
    C -->|Yes| D["Human reviews plan<br/>before any side effects"]
    C -->|No| E["Execute next step"]
    D --> E

    E --> F["Observation"]
    F --> G{"Result consistent with plan"}
    G -->|Yes| H{"More steps"}
    G -->|No| I["Revise plan from this point<br/>keep completed steps"]

    I --> J{"Revision count under limit"}
    J -->|Yes| E
    J -->|No| K["Escalate<br/>plan keeps failing, human needed"]

    H -->|Yes| E
    H -->|No| L["Goal complete"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,E,F,I process
    class C,G,H,J decision
    class D,K risk
    class L output
\`\`\`

The revision counter is what stops replanning from becoming an infinite loop by another name.

---

## Flow engineering: the loop as an explicit graph

The final stage stops treating the loop as an emergent property of the prompt and encodes it as a state machine in code.

Nodes are steps. Edges are transitions, some conditional. State is an explicit typed object passed between nodes. The model is invoked at specific nodes rather than driving the whole flow.

\`\`\`mermaid
---
title: "Flow Engineering: The Agent Loop as an Explicit Graph"
---
flowchart TD
    A["START"] --> B["classify_request"]
    B --> C{"route"}
    C -->|Information| D["retrieve"]
    C -->|Action| E["plan_action"]
    C -->|Unclear| F["ask_clarification"]

    D --> G["grade_evidence"]
    G --> H{"sufficient"}
    H -->|No| D
    H -->|Yes| I["generate_answer"]

    E --> J["policy_check"]
    J --> K{"permitted"}
    K -->|Needs approval| L["human_approval"]
    K -->|Yes| M["execute"]
    K -->|No| N["refuse_with_reason"]
    L --> M

    M --> O["verify_result"]
    O --> P{"succeeded"}
    P -->|No| E
    P -->|Yes| I

    F --> Q["END"]
    I --> Q
    N --> Q

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,D,G,I,E,J,M,O process
    class C,H,K,P decision
    class F,L,N risk
    class Q output
\`\`\`

What this buys over a free-running loop:

- **Every path is enumerable.** You can list what the agent can do, which is a prerequisite for any security or compliance review.
- **State is typed.** Not a growing transcript, a structured object with defined fields.
- **Checkpointing is natural.** State can be persisted at every node, which means a failed run can resume rather than restart.
- **Testing is possible.** Individual nodes can be unit tested. Transitions can be asserted.
- **Cycles are explicit and bounded.** The retrieve-grade loop is a declared cycle with a declared limit, not an emergent behaviour.

The cost is flexibility. A graph handles the paths it declares. Genuinely open-ended tasks do not fit, and forcing them into a graph produces a system that fails on anything the designer did not anticipate.

---

## Choosing the pattern

| Pattern | Task shape | Typical steps | Debuggability |
|---|---|---|---|
| ReAct | Exploratory, unknown structure | 3 to 8 | Low |
| ReAct plus Reflexion | Retryable, verifiable outcome | 3 to 8, up to 3 attempts | Moderate |
| Plan-and-solve | Known structure, parallelisable | 5 to 20 | Good |
| Flow graph | Known paths, needs auditability | Any | High |

The progression is not a maturity ladder where the last one is always best. A research task with genuinely unknown structure is a poor fit for a graph. A compliance workflow with fixed approval paths is a poor fit for free-running ReAct.

---

## What this looks like in three real systems

### The SQL analyst that could not stop exploring

A business intelligence assistant answered natural-language questions over a warehouse with about 400 tables. Built as plain ReAct.

On simple questions it worked. On anything involving joins, it wandered:

\`\`\`
Turn 1:  list tables                     -> 400 table names, ~3000 tokens
Turn 4:  describe table sales_fact       -> 60 columns
Turn 7:  describe table dim_customer     -> 40 columns
Turn 11: list tables                     -> the same 3000 tokens again
Turn 14: describe table sales_fact       -> again
Turn 20: turn limit reached, no answer
\`\`\`

By turn 11 the schema exploration had filled the context and the agent had lost track of what it already knew.

Two changes fixed it, and neither was a model upgrade.

**A schema retrieval tool instead of schema listing.** Rather than \`list_tables\` returning 400 names, a \`find_relevant_tables(description)\` tool ran semantic search over table and column descriptions and returned the five most relevant with their columns. One call, 600 tokens, instead of a multi-turn exploration.

**A structured working state** holding the tables already inspected and their relevant columns, replacing raw describe output.

\`\`\`
SCHEMA KNOWLEDGE
  sales_fact:    fiscal_qtr, region_id, revenue, customer_id
  dim_region:    region_id, region_name
  join:          sales_fact.region_id = dim_region.region_id

ATTEMPTED QUERIES
  1. Failed: column 'quarter' does not exist
\`\`\`

Average turns fell from 14 to 3.

**Most ReAct wandering is a tool design problem.** A tool that returns a haystack forces the agent to search it across many turns. A tool that returns the needle ends the exploration.

### The incident responder where planning changed the outcome

A platform team built an agent to do first-pass triage on production alerts. The ReAct version investigated in whatever order occurred to it, and on a multi-service incident it would go deep on the first service it looked at and never examine the others.

Reframed as plan-and-solve, with the plan generated first and the independent steps run in parallel:

\`\`\`
Plan for alert: elevated 5xx on checkout-api

  [parallel] 1a. Pull checkout-api error logs, last 30 min
  [parallel] 1b. Pull checkout-api latency and error rate metrics
  [parallel] 1c. List deployments to checkout-api in last 4 hours
  [parallel] 1d. Check health of checkout-api's three dependencies

  [then]     2.  Correlate error onset with deployment or dependency events
  [then]     3.  Draft findings with evidence
  [gated]    4.  Propose remediation, requires human approval
\`\`\`

Four investigations run concurrently rather than sequentially. Median time to a triage summary went from 4 minutes 20 seconds to 55 seconds, and the summaries covered all dependencies rather than whichever one the agent happened to check first.

The gated step 4 is deliberate. Investigation is read-only and safe to automate fully. Remediation changes production and stays behind a human. **Splitting a workflow at the read-write boundary is usually the cleanest place to put the approval gate.**

### The claims workflow that needed a graph

An insurer automated claim intake: validate the submission, check policy status, assess coverage, calculate settlement, route for approval.

A free-running agent handled it correctly most of the time. The problem was the regulator's question: what exactly can this system do, and under what conditions does a human review a decision?

There was no answer. The agent's behaviour was emergent, the paths were not enumerable, and two runs on identical inputs could take different routes.

Rebuilding it as an explicit graph made the system describable:

| Requirement | How the graph satisfies it |
|---|---|
| Enumerate all possible paths | Nodes and edges are declared in code |
| Guarantee human review above a threshold | A conditional edge, not a prompt instruction |
| Reproduce any historical decision | State checkpointed at every node |
| Prove no path skips coverage assessment | Graph reachability analysis |
| Resume after an outage | Restart from the last checkpoint |

The model still does the hard parts: interpreting an ambiguous claim narrative, assessing whether a described incident matches a coverage clause. But it does them at specific nodes with typed inputs and outputs, rather than driving the workflow.

**When a workflow must be auditable, the loop belongs in code and the model belongs inside the nodes.** That is the whole argument for flow engineering, and it is a governance argument more than a technical one.

---

## Failure modes

| Symptom | Cause |
|---|---|
| Agent explores endlessly before acting | Tools return haystacks, not answers |
| Repeats the same failed action | No reflection, no attempt deduplication |
| Goes deep on one branch, ignores others | Greedy local choice, needs planning |
| Cannot explain what the system is capable of | Emergent loop, paths not enumerable |
| Retry after a crash restarts from zero | No checkpointing |
| Reflections restate the error without changing behaviour | Reflection prompt asks what happened, not what to do differently |
| Plan is correct but execution ignores it | Plan not carried into execution state |
| Graph fails on unanticipated inputs | Over-constrained flow for an open-ended task |

---

## Pick the pattern the task actually needs

ReAct is the right starting point and a poor destination. It grounds reasoning in observation, which is the essential property, and it degrades predictably past a handful of steps.

The upgrades each solve one specific failure. Reflection converts failures into constraints for the next attempt. Planning replaces greedy local choices with a global structure and unlocks parallelism. Flow graphs replace emergent behaviour with enumerable paths, typed state and checkpoints.

The choice among them is driven by the task, not by sophistication. Open-ended exploration wants ReAct with good tools. Structured multi-step work wants planning. Anything that has to be audited, resumed or proven wants a graph.

And across all four, the highest-leverage fix is usually the same one: better tools that return answers instead of haystacks, and a state representation that shows the agent what it already knows.

---

*Next in this series: Tool design and MCP — the interface layer that decides agent reliability.*`,s="/blog/series/ai-systems-track-18.svg",o={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},i="2026-06-18",r=11,l="Agentic AI",c=["ReAct","Reasoning Loops","AI Agents","Tool Use","Agentic AI","AI Engineering","System Design","LLMOps","Software Architecture"],h=!1,d="AI Systems Track",p="ai-systems-track",u=18,g=30,m={id:"118",slug:e,title:n,excerpt:t,content:a,featuredImage:s,author:o,publishedAt:i,readTime:r,category:l,tags:c,featured:h,series:d,seriesSlug:p,seriesPart:u,seriesTotal:g};export{o as author,l as category,a as content,m as default,t as excerpt,h as featured,s as featuredImage,f as id,i as publishedAt,r as readTime,d as series,u as seriesPart,p as seriesSlug,g as seriesTotal,e as slug,c as tags,n as title};
