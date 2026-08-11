const f="123",e="error-handling-and-recovery-designing-agents-that-fail-well",t="Error Handling and Recovery: Designing Agents That Fail Well",n="Agent demos show the happy path. Production is the other paths: the API that times out, the tool that returns something unexpected, the model that produces a malformed call, the loop that...",a=`Agent demos show the happy path. Production is the other paths: the API that times out, the tool that returns something unexpected, the model that produces a malformed call, the loop that will not converge, the provider that returns a 529 for forty minutes.

An agent's reliability is not determined by how often it succeeds. It is determined by what happens when it does not, and whether the failure is recoverable, visible and bounded.

---

## The failure taxonomy

Different failures need different responses. Retrying all of them is the most common mistake and it turns transient problems into outages.

| Class | Example | Correct response |
|---|---|---|
| **Transient** | Timeout, 503, rate limit | Retry with backoff |
| **Malformed output** | Invalid tool call, schema violation | Retry once with the error fed back |
| **Tool error** | Record not found, permission denied | Return as an observation, let the agent adapt |
| **Wrong action** | Correct execution, wrong tool for the goal | Reflection, replan |
| **Non-convergence** | Loop repeating without progress | Detect and terminate |
| **Environmental** | Downstream system down, credentials expired | Circuit break, degrade, escalate |
| **Unrecoverable** | Goal impossible as stated | Terminate with a clear explanation |

The distinction that matters most: **a tool error is not an agent error.** "Customer not found" is a legitimate result. It should reach the agent as an observation it can reason about, not be raised as an exception that kills the run. Agents that never see tool errors cannot adapt to them.

---

## Retry, correctly

Retries are necessary and dangerous. Four rules.

**Only retry what is retryable.** A 429 or 503 is worth retrying. A 400 or 403 will fail identically forever. Classify before retrying.

**Exponential backoff with jitter.** Fixed-interval retries from many concurrent clients synchronise into waves that keep a recovering service down. Jitter spreads them out.

\`\`\`
attempt 1: immediate
attempt 2: 1s  + random(0, 1s)
attempt 3: 2s  + random(0, 2s)
attempt 4: 4s  + random(0, 4s)
stop after 4 attempts
\`\`\`

**Feed the error back on output-format retries.** A bare retry at the same temperature frequently reproduces the same malformed output. Including the specific validation error converts a retry into a correction, and second-attempt success rates are high.

**Cap total retry budget per task, not per call.** An agent making twelve tool calls, each retrying four times, is forty-eight calls. A task-level budget prevents multiplication.

---

## Circuit breakers

When a downstream system is genuinely down, retrying is harmful. It adds load to a struggling service and burns the agent's budget on calls that cannot succeed.

\`\`\`mermaid
---
title: "Circuit Breaker States, Surfaced to the Agent"
---
flowchart TD
    A["CLOSED<br/>calls pass through"] -->|Failure rate above threshold| B["OPEN<br/>calls fail fast, no downstream traffic"]
    B -->|Cooldown elapsed| C["HALF OPEN<br/>allow one probe call"]
    C -->|Probe succeeds| A
    C -->|Probe fails| B

    B --> D["Agent receives<br/>service unavailable<br/>as an observation"]
    D --> E{"Alternative path exists"}
    E -->|Yes| F["Use fallback tool or cached data"]
    E -->|No| G["Degrade gracefully<br/>partial answer with stated gap"]

    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A process
    class B,D risk
    class C process
    class E decision
    class F,G output
\`\`\`

The important detail for agents specifically: **an open circuit should be visible to the agent, not hidden from it.** An agent told "the inventory service is currently unavailable" can decide to answer from cached data, ask the user to try later, or proceed with the parts of the task that do not need it. An agent that just sees a failure will retry.

---

## Detecting non-convergence

The distinctly agentic failure. Nothing errors, everything succeeds, and the agent makes no progress.

Four detectors, cheap to implement and worth all four:

**Exact repetition.** The same tool with the same arguments, twice. Almost always a loop.

**Result repetition.** Different calls returning identical results. The agent is searching a space that does not contain the answer.

**State stagnation.** A hash of the meaningful state is unchanged over N iterations.

**Oscillation.** A cycle of length two or three: A, B, A, B. Common when two approaches each look better after the other fails.

\`\`\`mermaid
---
title: "Detecting Non-Convergence in an Agent Loop"
---
flowchart TD
    A["Iteration completes"] --> B["Compute action signature<br/>tool name plus normalised args"]
    B --> C{"Signature seen before"}
    C -->|Yes, identical| D["Repetition detected"]
    C -->|No| E["Hash meaningful state"]

    E --> F{"State changed since last N iterations"}
    F -->|No| G["Stagnation detected"]
    F -->|Yes| H["Check for cycles in signature history"]

    H --> I{"Cycle of length 2 or 3"}
    I -->|Yes| J["Oscillation detected"]
    I -->|No| K["Continue loop"]

    D --> L["Intervention"]
    G --> L
    J --> L

    L --> M{"Intervention attempt"}
    M -->|First| N["Inject a nudge<br/>state what has been tried and failed"]
    M -->|Second| O["Force a strategy change<br/>restrict the repeated tool"]
    M -->|Third| P["Terminate and escalate<br/>with the full loop trace"]

    N --> K
    O --> K

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,E,H,N,O process
    class C,F,I,M decision
    class D,G,J,L,P risk
    class K output
\`\`\`

The escalating intervention is better than immediate termination. A nudge that explicitly lists what has been tried frequently unsticks the agent, because the repeated attempts were caused by the failures being buried in a long context rather than by the agent lacking an alternative.

---

## Checkpointing and rollback

Long-running agents that take side effects need the ability to resume and, where possible, to undo.

**Checkpoint at every state transition.** The full state object, persisted. A crash at step 14 resumes from step 13 rather than restarting from zero. On tasks with expensive side effects this is the difference between a retry and a disaster.

**Classify every action by reversibility.**

| Class | Example | Handling |
|---|---|---|
| Read-only | Query, search, fetch | No rollback needed |
| Reversible | Create a draft, add a tag, write to a scratch location | Record the inverse operation |
| Compensatable | Charge a card, send an internal notification | Record a compensating action |
| Irreversible | Send an external email, delete data, execute a trade | Human gate before execution |

**Order actions so irreversible ones come last.** A workflow that does the irreversible step first and then fails has no recovery path. Doing all the reversible preparation first, then gating the irreversible commit, is the saga pattern and it applies directly.

---

## Graceful degradation

The best failure produces partial value rather than nothing.

\`\`\`
Poor:  "An error occurred. Please try again."

Better: "Here is what was completed:
         - Retrieved account history for the last 6 months
         - Identified 3 disputed charges

         Not completed:
         - Refund processing (payment service unavailable)

         Next step: the refunds have been queued as ticket REF-8821 and
         will process automatically when the service recovers. No action
         needed from you."
\`\`\`

The second one tells the user what happened, what did not, and what happens next. It also does not require them to repeat work.

Designing this means every terminal state, including failures, needs a defined output. "Turn limit reached" is not an output. A summary of accomplished work, remaining work, and the recommended next action is.

---

## What this looks like in three real systems

### The provisioning agent that half-created a customer

A SaaS platform's onboarding agent created a tenant, configured SSO, imported users, and enabled integrations. Partway through a run, the identity provider's API returned errors for about eight minutes.

The agent had created the tenant, failed SSO configuration after retries, and then continued to user import, which succeeded, creating 340 users who could not log in. The run ended with a partial state nobody could easily clean up.

Two problems: no dependency enforcement between steps, and no compensation.

The rebuild:

\`\`\`mermaid
---
title: "Compensating Actions and Dependency-Aware Halting"
---
flowchart TD
    A["Onboarding request"] --> B["Step 1: provision tenant<br/>reversible: delete tenant"]
    B --> C{"Success"}
    C -->|No| D["Compensate: nothing created yet<br/>terminate cleanly"]
    C -->|Yes| E["Checkpoint state"]

    E --> F["Step 2: configure SSO<br/>reversible: remove config"]
    F --> G{"Success after retries"}
    G -->|No| H["Circuit open on identity provider"]
    H --> I["Halt before dependent steps<br/>user import requires SSO"]
    I --> J["Compensate: remove SSO config<br/>retain tenant, mark PENDING_SSO"]
    J --> K["Notify ops with resume token"]

    G -->|Yes| L["Checkpoint state"]
    L --> M["Step 3: import users<br/>depends on step 2"]
    M --> N["Step 4: enable integrations"]
    N --> O["Complete"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,E,F,L,M,N process
    class C,G decision
    class D,H,I,J,K risk
    class O output
\`\`\`

Three properties made the difference. Steps declare their dependencies, so a failed prerequisite halts dependents instead of proceeding. Each step declares a compensating action. And the halt produces a resume token, so recovery continues from step 2 rather than restarting.

**Partial completion is only acceptable if the partial state is coherent and resumable.** Otherwise it is worse than total failure.

### The research agent that oscillated for forty turns

A market intelligence agent had a 40-turn budget. On certain queries it consumed all 40 and returned nothing.

The traces showed a clean oscillation:

\`\`\`
Turn 12: search_internal("competitor pricing 2026")  -> 0 results
Turn 13: search_web("competitor pricing 2026")       -> paywalled, no content
Turn 14: search_internal("competitor pricing 2026")  -> 0 results
Turn 15: search_web("competitor pricing 2026")       -> paywalled
... repeated to turn 40
\`\`\`

By turn 14 the context was long enough that the failures at turns 12 and 13 were no longer salient. The agent kept rediscovering the same two options.

The fix was an attempt register injected near the end of the context, where attention is reliable:

\`\`\`
ATTEMPTED AND FAILED (do not repeat)
  search_internal("competitor pricing 2026")  -> 0 results, twice
  search_web("competitor pricing 2026")       -> paywalled, twice

REMAINING UNTRIED SOURCES
  analyst_reports, filings_database, sales_team_notes
\`\`\`

Combined with oscillation detection that triggered a nudge at the second repeat and a tool restriction at the third.

Turn consumption on hard queries fell from 40 to a median of 9, and those queries began returning useful partial answers instead of nothing.

**Loop detection is necessary but not sufficient. The agent also needs the failure history visible where it will actually read it.**

### The trading operations agent where the gate order mattered

An operations tool for a brokerage handled routine tasks: reconcile positions, generate client statements, flag settlement breaks.

An early design had the agent notify clients of a settlement break as soon as it detected one, then investigate the cause. On one occasion a data feed glitch produced 400 false breaks, and 400 clients were notified before the investigation determined nothing was wrong.

The action was irreversible. An email cannot be recalled.

The redesign reordered the workflow so that every irreversible action sits at the end, behind a gate, after all verification:

\`\`\`
Phase 1 (read only, fully automated)
  - Pull positions from both systems
  - Identify discrepancies
  - Classify: timing, fee, data quality, or genuine break

Phase 2 (reversible, automated)
  - Create internal case records
  - Attach evidence
  - Assign to the operations queue

Phase 3 (irreversible, gated)
  - Client notification         [requires human approval]
  - Regulatory report filing    [requires human approval]
\`\`\`

The false-positive event recurred four months later. Phase 1 classified 400 discrepancies, phase 2 created 400 internal cases, and phase 3 presented them for approval. An operator noticed all 400 shared a timestamp pattern, rejected the batch, and the data feed was fixed. No client was contacted.

**Order the workflow so that everything reversible happens before anything irreversible, and put the gate at that boundary.** This single structural rule prevents most classes of expensive agent failure, and it costs nothing when everything works.

---

## The reliability arithmetic

Worth stating plainly, because it explains why per-step reliability matters so much in agents.

\`\`\`
Single call at 97% reliability:              0.97
5-step agent, no recovery:      0.97^5    =  0.86
10-step agent, no recovery:     0.97^10   =  0.74
20-step agent, no recovery:     0.97^20   =  0.54
\`\`\`

A twenty-step task with a very reliable model succeeds barely half the time if any single failure kills the run.

With per-step recovery that resolves 80 percent of failures:

\`\`\`
Effective per-step reliability:  0.97 + (0.03 x 0.80) = 0.994
20-step agent with recovery:     0.994^20            = 0.89
\`\`\`

**Recovery machinery is not a nice-to-have on long tasks. It is the difference between 54 percent and 89 percent.** This is why error handling deserves more engineering attention than prompt tuning on any agent doing more than a handful of steps.

---

## Failure modes

| Symptom | Cause |
|---|---|
| Transient errors become task failures | No retry, or retrying non-retryable errors |
| A downstream outage takes the agent down | No circuit breaker, unbounded retries |
| Agent loops until the budget is exhausted | No non-convergence detection |
| Agent repeats attempts it already made | Failure history buried in a long context |
| Crash means starting over | No checkpointing |
| Partial state left inconsistent | No dependency enforcement, no compensation |
| Irreversible action taken on bad data | Gate placed after the action instead of before |
| Failure produces no useful output | No designed terminal state |
| Retry storms during an incident | No jitter, no task-level retry budget |

---

## Recovery is most of the reliability story

Agent reliability is mostly error handling, and error handling for agents differs from ordinary service resilience in one important way: the agent is a participant in recovery, not just a victim of failure.

Tool errors should reach the agent as observations it can reason about. Circuit-breaker states should be visible so it can choose an alternative. Failure history should be surfaced where it will actually be read. The agent recovers better when it can see what went wrong.

Around that, ordinary discipline: classify errors before retrying, back off with jitter, checkpoint every transition, classify actions by reversibility, and order workflows so the irreversible step is last and gated.

The compounding arithmetic is the argument. On a twenty-step task, recovery machinery is worth more than any model upgrade available.

---

*Next in this series: Human in the loop — approval gates, interrupts and trust boundaries.*`,r="/blog/series/ai-systems-track-23.svg",s={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},i="2026-06-23",o=12,l="Agentic AI",c=["Error Handling","Retries","Resilience","AI Agents","Agentic AI","AI Engineering","Site Reliability","System Design","Software Architecture"],d=!1,h="AI Systems Track",p="ai-systems-track",u=23,g=30,m={id:"123",slug:e,title:t,excerpt:n,content:a,featuredImage:r,author:s,publishedAt:i,readTime:o,category:l,tags:c,featured:d,series:h,seriesSlug:p,seriesPart:u,seriesTotal:g};export{s as author,l as category,a as content,m as default,n as excerpt,d as featured,r as featuredImage,f as id,i as publishedAt,o as readTime,h as series,u as seriesPart,p as seriesSlug,g as seriesTotal,e as slug,c as tags,t as title};
