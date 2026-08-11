const f="121",e="planning-and-decomposition-from-goal-to-executable-graph",n="Planning and Decomposition: From Goal to Executable Graph",t="An agent given a vague goal and a set of tools will find a path. Whether it finds a good one, in a reasonable number of steps, without wandering into dead ends, depends on whether the...",a=`An agent given a vague goal and a set of tools will find *a* path. Whether it finds a good one, in a reasonable number of steps, without wandering into dead ends, depends on whether the system planned or improvised.

Planning is the difference between an agent that completes a fifteen-step task and one that gets lost around step six. It is also frequently the difference between a system that can be reviewed before it acts and one that can only be audited afterward.

---

## The planning spectrum

Not every task needs a plan, and over-planning is its own failure.

| Level | Approach | Suits |
|---|---|---|
| **None** | Act greedily, decide each step in isolation | 1 to 3 steps, exploratory work |
| **Implicit** | Model reasons about the whole task before the first action | 3 to 6 steps, known domain |
| **Explicit static** | Full plan generated, then executed without revision | Deterministic tasks, approval required |
| **Explicit dynamic** | Plan generated, revised when reality contradicts it | 5 to 20 steps, real-world uncertainty |
| **Hierarchical** | High-level plan, sub-plans generated per step at execution time | Long-horizon, uncertain sub-structure |
| **Search-based** | Multiple plans generated and evaluated before committing | Constraint problems with dead ends |

The right level is set by two properties of the task: how many steps it takes, and how much of the environment is knowable before starting. A three-step task in a known system needs no plan. A fifteen-step task in a partially unknown system needs a dynamic one.

**Over-planning is a real cost.** Generating a twelve-step plan for a task that turns out to need three steps wastes tokens and anchors the agent to a structure it should abandon.

---

## Static planning and its single failure

Generate the whole plan, then execute it.

\`\`\`
Goal: Onboard a new supplier into the procurement system

Plan:
  1. Validate the supplier registration form
  2. Run sanctions and compliance screening
  3. Create the supplier record
  4. Request bank details via secure form
  5. Verify bank details against the registration
  6. Assign default payment terms
  7. Notify the requesting department
\`\`\`

Inspectable, approvable, parallelisable where dependencies allow. Excellent when the environment behaves as expected.

The failure is that reality does not read the plan. If step 2 returns a compliance flag, steps 3 through 7 are now wrong, and a static executor will run them anyway or halt with no recovery path.

---

## Dynamic planning: revise on contradiction

The workable pattern adds a check after every step: did the observation match what the plan assumed.

\`\`\`mermaid
---
title: "Dynamic Planning: Revise When Assumptions Break"
---
flowchart TD
    A["Goal"] --> B["Generate plan<br/>steps with explicit assumptions"]
    B --> C{"Plan has side effects"}
    C -->|Yes| D["Human review<br/>approve before execution"]
    C -->|No| E["Execute next step"]
    D --> E

    E --> F["Observation"]
    F --> G{"Assumption held"}

    G -->|Yes| H{"More steps"}
    G -->|No| I["Identify affected downstream steps"]
    I --> J["Replan from this point<br/>preserve completed work"]

    J --> K{"Replan count under limit"}
    K -->|Yes| L{"New plan needs approval"}
    K -->|No| M["Escalate<br/>repeated replanning means<br/>the goal is not achievable as stated"]

    L -->|Yes| D
    L -->|No| E

    H -->|Yes| E
    H -->|No| N["Verify goal achieved"]
    N --> O{"Verification passed"}
    O -->|Yes| P["Complete"]
    O -->|No| J

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,E,F,I,J,N process
    class C,G,H,K,L,O decision
    class D,M risk
    class P output
\`\`\`

Three details carry the design.

**Steps carry explicit assumptions.** A step that says "create the supplier record" cannot be checked. A step that says "create the supplier record, assuming compliance screening passed" can. Writing assumptions into the plan is what makes contradiction detectable.

**Replanning preserves completed work.** A new plan from step 4 onward, not a fresh plan from step 1. Otherwise the agent repeats side effects.

**Replanning has a budget.** Three or four revisions. An agent that has replanned five times is not converging, and continuing spends money to arrive at the same place.

---

## Dependencies are the whole value of planning

The reason to write a plan as a structure rather than a list: dependencies become visible, and anything without a dependency can run in parallel.

\`\`\`
Goal: Produce a quarterly business review for a customer account

  1. Pull usage metrics                    [no dependency]
  2. Pull support ticket history           [no dependency]
  3. Pull billing and contract data        [no dependency]
  4. Pull product roadmap items            [no dependency]
  5. Identify usage trends                 [depends on 1]
  6. Identify support themes               [depends on 2]
  7. Check contract renewal timing         [depends on 3]
  8. Match roadmap to usage gaps           [depends on 1, 4]
  9. Draft the review                      [depends on 5, 6, 7, 8]
\`\`\`

Written as a list it looks like nine sequential steps. Written as a dependency graph, steps 1 through 4 run concurrently, then 5 through 8 run concurrently, then 9. Three waves instead of nine steps.

\`\`\`mermaid
---
title: "Plans as Dependency Graphs Unlock Parallelism"
---
flowchart LR
    A["Wave 1<br/>parallel data collection"] --> B["1 usage metrics"]
    A --> C["2 support history"]
    A --> D["3 billing data"]
    A --> E["4 roadmap items"]

    B --> F["5 usage trends"]
    C --> G["6 support themes"]
    D --> H["7 renewal timing"]
    B --> I["8 roadmap gap match"]
    E --> I

    F --> J["9 draft review"]
    G --> J
    H --> J
    I --> J

    J --> K["Quarterly review document"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,C,D,E,F,G,H,I,J process
    class K output
\`\`\`

The practical instruction that produces this: **ask the planner to output a dependency graph, not a numbered list.** A schema requiring each step to declare \`depends_on\` makes parallelism a structural property rather than something the executor has to infer.

---

## Hierarchical decomposition

For long tasks, planning every step up front is both wasteful and wrong. The details of step 8 depend on what step 3 discovers.

Hierarchical planning generates a coarse plan of phases, then expands each phase into concrete steps only when it is reached.

\`\`\`
Level 1 (generated up front):
  Phase A: Understand the current implementation
  Phase B: Identify all call sites affected by the change
  Phase C: Apply the change
  Phase D: Verify nothing regressed

Level 2 (generated when Phase B is reached, using what Phase A found):
  B1. Search for direct calls to the renamed function
  B2. Search for dynamic dispatch through the registry found in A
  B3. Check the three config files A identified for string references
  B4. Check test fixtures
\`\`\`

Phase B's expansion is informed by Phase A's discoveries. Planning it up front would have produced generic steps that missed the registry entirely.

The tradeoff: harder to approve up front, because the detailed steps do not exist yet. For workflows requiring pre-approval, a coarse plan plus per-phase approval gates is the compromise.

---

## Verification: the step that gets skipped

A plan that completes is not a goal that is achieved. The final step of any plan should be a check, and the check should be code wherever possible.

\`\`\`
Weak:    Agent asserts "the change has been applied successfully"
Strong:  Run the test suite. Exit code 0 is success.
Strong:  Query the record. Field matches the intended value.
Strong:  Diff the deployed config against the intended config.
\`\`\`

An agent verifying its own work by asserting it is done is not verification. It is the same model that produced the work, evaluating the work, with a bias toward having succeeded.

Where a code check is impossible, a separate verifier model with a rubric is second best. Self-assessment is last.

---

## What this looks like in three real systems

### The migration agent that planned a hundred steps and executed six

A platform team built an agent to migrate services from one configuration format to another across roughly 80 repositories.

The first version planned everything up front: read every repository, generate a per-repository step list, then execute. The plan generation alone consumed enormous context, took four minutes, and by step six had already diverged because three repositories used a variant format the plan had not anticipated.

Restructured hierarchically:

\`\`\`
Level 1:  For each repository, run the migration sub-plan.
          (80 independent units, parallelisable, no cross dependency)

Level 2 (generated per repository, at execution time):
          1. Detect config format variant
          2. Generate the transformed config
          3. Run the repo's own validation
          4. Open a pull request with the diff
          5. Verify CI passes
\`\`\`

Three properties made this work.

**The 80 units were independent**, so failures were isolated. A repository with an unexpected format failed alone rather than stopping the run.

**The sub-plan was generated with the repository in view**, so the format variant was detected rather than assumed.

**Verification was CI**, not an assertion. A migration that broke the build was caught by the build.

72 of 80 repositories completed unattended. The 8 failures came with the specific error and the partial diff, which made human handling a ten-minute job each rather than an investigation.

**Long tasks with independent units should be planned as a loop over units, not as one long plan.**

### The financial close agent where assumptions were the plan

A finance team automated part of month-end close: reconcile subledgers, flag variances, prepare journal entries, route for approval.

The first version's plan was a list of actions. When a subledger had not been closed upstream, the agent reconciled against stale data and produced confidently wrong entries.

The rewrite made every step declare what it assumed:

\`\`\`json
{
  "step": 3,
  "action": "reconcile_subledger",
  "args": {"ledger": "AP", "period": "2026-07"},
  "assumes": [
    "AP subledger status is CLOSED for 2026-07",
    "No unposted entries exist for the period"
  ],
  "verify_after": "reconciliation_variance < 0.01"
}
\`\`\`

The executor checks assumptions before running each step and checks the verification after. An unmet assumption triggers replanning rather than execution.

\`\`\`mermaid
---
title: "Assumption Checks and Verification Predicates Per Step"
---
flowchart TD
    A["Step from plan"] --> B["Check declared assumptions"]
    B --> C{"All assumptions hold"}
    C -->|No| D["Replan from this step<br/>with the violated assumption as input"]
    C -->|Yes| E["Execute step"]

    E --> F["Run verification predicate"]
    F --> G{"Verification passed"}
    G -->|No| H["Roll back if reversible<br/>then replan"]
    G -->|Yes| I["Mark step complete<br/>checkpoint state"]

    D --> J{"Replan budget remaining"}
    H --> J
    J -->|Yes| A
    J -->|No| K["Halt, escalate with full context"]

    I --> L{"More steps"}
    L -->|Yes| A
    L -->|No| M["Goal verification"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,E,F,I process
    class C,G,J,L decision
    class D,H,K risk
    class M output
\`\`\`

Incorrect journal entries went to zero. The assumption checks caught upstream problems that had previously been discovered days later during review.

**A plan without declared assumptions cannot detect that reality diverged.** The assumption field is what makes dynamic replanning possible at all.

### The customer onboarding flow where the plan became the approval artefact

A B2B software company automated enterprise customer onboarding: provision the tenant, configure SSO, import users, set up integrations, schedule training.

The steps involve real side effects, some of them expensive to reverse. The compliance requirement was that a human approve the work before it happened, not review it afterward.

Static planning with a human gate fit exactly. The agent generates the full plan, renders it in human-readable form with the specific values it will use, and waits.

\`\`\`
ONBOARDING PLAN — Meridian Group (approval required)

  1. Provision tenant          region: eu-west-1, tier: enterprise
  2. Configure SSO             provider: Okta, domain: meridian-group.com
  3. Import users              source: provided CSV, 340 users, 4 roles
  4. Enable integrations       Salesforce, Slack
  5. Set data retention        7 years (per contract clause 14.2)
  6. Schedule training         3 sessions, contacts from CSV
  7. Send welcome sequence     template: enterprise-v3

  Reversible:      steps 3, 4, 6, 7
  Hard to reverse: steps 1, 2, 5
  Estimated cost:  provisioning charge applies at step 1

  [Approve]  [Approve with edits]  [Reject]
\`\`\`

The reversibility annotation is the part worth copying. It tells the approver where the real risk sits, so review attention goes to steps 1, 2 and 5 rather than being spread evenly across seven.

Approval rates were high and edits were common, mostly on retention settings and integration lists. Those edits are the system working: a human catching a detail before it becomes a reversal.

**When actions are expensive to reverse, the plan is the right approval artefact**, because it is the last point at which nothing has happened yet.

---

## Failure modes

| Symptom | Planning cause |
|---|---|
| Plan generated, then ignored during execution | Plan not carried into executor state |
| Agent continues after an upstream failure | Steps have no declared assumptions |
| Replanning never converges | No replan budget |
| Steps run sequentially that could be parallel | Plan is a list, not a dependency graph |
| Long tasks produce generic, unhelpful plans | Flat planning where hierarchical was needed |
| Agent reports success on incomplete work | Verification by assertion, not by code |
| Replanning repeats completed side effects | New plan generated from step 1 |
| Approval given but the agent did something else | Plan not pinned after approval |

That last row is a security concern. A plan approved by a human must be the plan that executes. Regenerating it after approval, or allowing free-form deviation, makes the approval meaningless.

---

## A plan only helps if it can bend

Planning converts an agent from a system that finds a path into a system that follows a considered one. The value is not only in better paths. It is in parallelism, in inspectability before execution, and in the ability to detect that the world has diverged from what the plan assumed.

Four practices carry most of the benefit. Output plans as dependency graphs so parallelism is structural. Attach explicit assumptions to steps so contradictions are detectable. Bound replanning so a non-converging task terminates. And verify with code rather than assertion, because an agent asking itself whether it succeeded will usually say yes.

And use the lightest planning that fits. A three-step task with a twelve-step plan is a system solving a problem it does not have.

---

*Next in this series: The four tiers of agent memory.*`,s="/blog/series/ai-systems-track-21.svg",r={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},i="2026-06-21",o=11,l="Agentic AI",p=["Planning","Task Decomposition","DAG","AI Agents","Agentic AI","AI Engineering","System Design","Software Architecture","LLMOps"],c=!1,d="AI Systems Track",h="ai-systems-track",u=21,g=30,m={id:"121",slug:e,title:n,excerpt:t,content:a,featuredImage:s,author:r,publishedAt:i,readTime:o,category:l,tags:p,featured:c,series:d,seriesSlug:h,seriesPart:u,seriesTotal:g};export{r as author,l as category,a as content,m as default,t as excerpt,c as featured,s as featuredImage,f as id,i as publishedAt,o as readTime,d as series,u as seriesPart,h as seriesSlug,g as seriesTotal,e as slug,p as tags,n as title};
