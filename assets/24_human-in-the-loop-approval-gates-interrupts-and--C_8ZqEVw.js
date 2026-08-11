const m="124",e="human-in-the-loop-approval-gates-interrupts-and-trust-boundaries",n="Human in the Loop: Approval Gates, Interrupts and Trust Boundaries",t="Human oversight of an AI system is usually designed as a binary: either a person approves everything, which destroys the value, or nothing, which destroys the trust.",a=`Human oversight of an AI system is usually designed as a binary: either a person approves everything, which destroys the value, or nothing, which destroys the trust. Both are failures of design rather than genuine constraints.

The useful version is a spectrum, applied selectively. Different actions carry different consequences, and oversight should be proportional to consequence rather than uniform across a workflow.

---

## The oversight spectrum

| Level | Pattern | Human role | Suits |
|---|---|---|---|
| **0** | Full autonomy | None, audit only | Read-only actions, reversible low-value writes |
| **1** | Notify after | Informed, can intervene later | Reversible actions with a visible undo |
| **2** | Approve batches | Reviews grouped proposals periodically | High-volume, low-individual-risk decisions |
| **3** | Approve each | Gates every instance | Irreversible or high-value actions |
| **4** | Co-reasoning | Works alongside, shares the scratchpad | Novel or ambiguous problems |
| **5** | Human executes | AI advises only | Regulated actions, safety-critical decisions |

The design task is assigning each action class to a level, not choosing one level for the system.

Two questions determine the assignment:

**What does a wrong action cost?** A wrong tag on a support ticket costs almost nothing. A wrong refund costs money. A wrong medication instruction costs considerably more.

**Can it be undone, and how quickly?** A draft can be deleted. A sent email cannot. A deleted database cannot without a restore.

\`\`\`mermaid
---
title: "Assigning Oversight Level by Reversibility and Cost"
---
flowchart TD
    A["Proposed action"] --> B{"Reversible"}

    B -->|Yes, instantly| C{"Cost if wrong"}
    B -->|Yes, with effort| D{"Cost if wrong"}
    B -->|No| E["Level 3 or higher<br/>approve each instance"]

    C -->|Negligible| F["Level 0<br/>autonomous, audited"]
    C -->|Moderate| G["Level 1<br/>notify after, offer undo"]

    D -->|Low| G
    D -->|High| H["Level 2<br/>batch approval"]

    E --> I{"Regulated or safety critical"}
    I -->|Yes| J["Level 5<br/>human executes, AI advises"]
    I -->|No| K["Level 3<br/>per action approval"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class G,H process
    class B,C,D,I decision
    class E,J,K risk
    class F output
\`\`\`

---

## Designing the approval itself

A gate that produces rubber-stamping is worse than no gate, because it manufactures a false record of oversight. Most approval fatigue is caused by the approval interface, not by the volume.

Four properties of an approval that gets read:

**Show the effect, not the intent.** "Update customer record" tells the reviewer nothing. A diff tells them everything.

\`\`\`
Weak:    "Update customer record for C-88213"

Strong:  Customer C-88213 (Meridian Group)
           billing_email:  ops@meridian.com  ->  finance@meridian.com
           payment_terms:  NET30             ->  NET60
           credit_limit:   50,000            ->  50,000   (unchanged)

         Source: email from finance@meridian.com, 2026-07-28, thread #8821
\`\`\`

**Show the reasoning and the evidence.** A reviewer who cannot see why the agent proposed this cannot evaluate it. The source reference above is what makes this checkable in seconds.

**Rank by risk, not by arrival time.** A queue sorted chronologically gets processed uniformly. A queue where high-risk items are surfaced first gets appropriate attention where it matters.

**Make rejection informative.** A reject button that captures why produces training data for threshold tuning and, over time, for the agent's own procedural memory. A bare reject produces nothing.

---

## Batch approval: the pattern that scales

Per-action approval does not survive volume. Two hundred decisions a day is not reviewable one at a time with any real attention.

Batch approval groups similar proposals so a reviewer evaluates a pattern rather than an instance.

\`\`\`
REFUND APPROVALS — 47 pending

Group A: Shipping delay refunds, 31 items
  All under $50. All have a carrier delay confirmation.
  Policy: automatic below $50 with carrier confirmation.
  [Approve all 31]  [Review individually]

Group B: Damaged item refunds, 12 items
  $50 to $400. All have photo evidence attached.
  [Review individually]  [Approve all 12]

Group C: Outside policy, 4 items
  Requested beyond the 30-day window. Individual justification below.
  [Must review individually]
\`\`\`

Thirty-one decisions become one. The reviewer's attention goes to Group C, which is where it should be.

The grouping logic is the engineering work: cluster on the attributes that determine risk, and never group items that a reviewer would evaluate differently.

---

## Interrupts: pausing mid-run

For long-running agents, approval is not a step at the end. It is an interrupt at specific points, which means the agent must be able to suspend and resume.

\`\`\`mermaid
---
title: "Interrupts: Suspending an Agent for Human Approval"
---
flowchart TD
    A["Agent running"] --> B["Reaches a gated action"]
    B --> C["Serialise full state<br/>including the pending action"]
    C --> D[("Checkpoint store")]
    D --> E["Emit approval request<br/>to the reviewer queue"]

    E --> F{"Reviewer decision"}
    F -->|Approve| G["Restore state, execute, continue"]
    F -->|Approve with edits| H["Restore state, apply edited args<br/>record that it was edited"]
    F -->|Reject with reason| I["Restore state, inject rejection<br/>as an observation, agent replans"]
    F -->|Timeout| J["Escalate or terminate<br/>per policy"]

    G --> K["Agent continues"]
    H --> K
    I --> K
    J --> L["Terminate with partial result"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef store fill:#F3F0F8,stroke:#8880AE,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,C,G,H,K process
    class D store
    class F decision
    class E,I,J risk
    class L output
\`\`\`

Three requirements this imposes on the architecture:

**State must be serialisable.** An agent whose state is an in-memory object graph cannot be suspended for four hours until a reviewer logs in. This is a strong argument for a typed state object persisted at every transition.

**Rejection must be an observation, not an exception.** A rejected proposal with a stated reason lets the agent propose an alternative. A rejection that crashes the run wastes everything done so far.

**Timeouts need a policy.** An approval request that sits unanswered over a weekend needs defined behaviour: escalate to a second approver, expire and terminate cleanly, or execute a safe default. Silence is not a policy.

**Edits must be recorded as edits.** When a reviewer approves with changes, the record should show both what was proposed and what was executed. That difference is the most valuable signal in the whole system.

---

## Confidence-based escalation

Fixed rules ("all refunds above $500") are simple and blunt. Confidence-based routing sends uncertain cases to humans and handles clear ones automatically, which allocates human attention where it adds value.

The difficulty is obtaining a trustworthy confidence signal. Self-reported confidence from a model is poorly calibrated and tends toward overconfidence.

Better signals, roughly in order of reliability:

| Signal | How it works |
|---|---|
| Retrieval or rerank score | Evidence strength, calibrated |
| Structural validation | Did the output satisfy all constraints |
| Verifier model agreement | A second model checks the first |
| Sample agreement | N samples, measure divergence |
| Historical accuracy by case type | This category is right 96 percent of the time |
| Explicit escalation tool | The agent calls \`escalate(reason)\` as an action |

The last one is underused and works well. Rather than inferring uncertainty, give the agent a tool to declare it. Models are noticeably better at deciding "I should ask a human about this" as an action than at producing a calibrated numeric confidence.

Whatever signal is used, the threshold must be set from data:

\`\`\`
On a labelled set of 500 historical cases:

  Threshold 0.90:  escalates 34% of cases, catches 91% of errors
  Threshold 0.80:  escalates 18% of cases, catches 78% of errors
  Threshold 0.70:  escalates  9% of cases, catches 54% of errors
\`\`\`

The right threshold depends on the cost of an error against the cost of a human review. That is a business calculation, and it should be made explicitly rather than by picking a round number.

---

## What this looks like in three real systems

### The moderation queue that nobody was really reading

A social platform routed flagged content to human moderators. Volume was 3,000 items a day. Average review time was 4 seconds per item, which is not review, it is clicking.

Analysis showed why: the queue was chronological and undifferentiated. A borderline case requiring careful judgement appeared between two obvious spam posts, and moderators fell into a rhythm.

The redesign changed the queue rather than the model:

| Change | Effect |
|---|---|
| Auto-action on high-confidence spam | 3,000 items to 1,150 |
| Group by violation type and confidence | Similar decisions reviewed together |
| Surface low-confidence items first | Hard cases get fresh attention |
| Show the specific policy clause and the matching text | Decision context on screen |
| Require a reason on override | Captures disagreement with the model |

Average review time on the remaining items rose to 22 seconds. Moderator agreement with a gold-standard audit went from 71 percent to 93 percent.

**Reducing volume increased quality more than any model change did.** The bottleneck was human attention, and the fix was spending it better.

The override reasons also turned out to be the highest-value dataset in the system. They showed exactly where the model's policy interpretation diverged from the moderators', which drove the next round of eval-set expansion.

### The infrastructure agent where the gate moved

A platform team's agent handled routine infrastructure changes. The first version gated every action, which meant an engineer approved things like "read the current replica count" and "list recent deployments".

Approval fatigue set in within two weeks. Engineers began approving without reading, which is the exact failure the gate was meant to prevent.

Reclassifying by reversibility and blast radius:

\`\`\`
Level 0, autonomous:
  All read operations
  Scale within a pre-approved range
  Restart a single pod
  Adjust a non-paging alert threshold

Level 1, notify after with undo:
  Scale outside the normal range but within a hard cap
  Enable or disable a feature flag in staging

Level 3, approve each:
  Any production deployment or rollback
  Any change to a paging alert
  Any change touching data stores
  Any action affecting more than one service
\`\`\`

Approval volume dropped by about 85 percent. The remaining approvals were read carefully, because they were genuinely consequential and rare enough to warrant attention.

**The purpose of a gate is to concentrate attention. A gate on everything concentrates nothing.**

### The clinical documentation system where the human executes

A hospital deployed an assistant that drafts clinical notes from a consultation recording. The regulatory position was unambiguous: the clinician is responsible for the record, and the system must not write to the patient record directly.

Level 5 by requirement. The design question was how to make advisory-only genuinely useful rather than a document that gets rewritten from scratch.

\`\`\`mermaid
---
title: "Advisory-Only Clinical Documentation"
---
flowchart TD
    A["Consultation audio"] --> B["Transcription"]
    B --> C["Structured note draft<br/>SOAP format"]

    C --> D["Every claim linked to a transcript timestamp"]
    D --> E["Clinician review interface"]

    E --> F["Segment states"]
    F --> G["Verbatim from transcript<br/>marked high confidence"]
    F --> H["Inferred or summarised<br/>marked, requires confirmation"]
    F --> I["Uncertain audio<br/>flagged, transcript excerpt shown"]

    G --> J["Clinician accepts, edits or rejects per segment"]
    H --> J
    I --> J

    J --> K["Clinician signs the note<br/>the only write to the record"]
    K --> L[("Patient record")]

    J --> M[("Edit log<br/>what was changed and why")]
    M --> N["Feeds eval set and drift monitoring"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef store fill:#F3F0F8,stroke:#8880AE,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,C,D,E,F,J process
    class G,H,I process
    class L,M store
    class K output
    class N risk
\`\`\`

Three design choices made it work.

**Segment-level confidence marking.** Rather than one confidence score for the note, each segment is marked as verbatim, inferred or uncertain. Clinicians read the inferred and uncertain segments carefully and skim the verbatim ones.

**Timestamp linkage.** Every claim links to the point in the recording it came from. Verifying a doubtful segment takes seconds instead of re-listening to the consultation.

**The edit log as the primary feedback channel.** Every clinician edit is recorded with the original and the correction. That log became the evaluation set, and it also served as the drift monitor: a rise in edit rate on a particular segment type was the earliest signal that something had changed.

Documentation time fell substantially and the clinician remained the author of the record, which was the requirement.

**Advisory-only systems live or die on how easy verification is.** A draft that is hard to check gets rewritten. A draft where every claim can be verified in two seconds gets accepted.

---

## Failure modes

| Symptom | Cause |
|---|---|
| Approvals rubber-stamped | Too many gates, attention spread uniformly |
| Reviewers cannot evaluate a proposal | Intent shown instead of effect, no evidence |
| Approval queue never clears | No batching, no risk-based ordering |
| Agent crashes when a proposal is rejected | Rejection raised as an exception, not an observation |
| Requests sit unanswered indefinitely | No timeout policy |
| No learning from human corrections | Rejections and edits not captured with reasons |
| Escalation catches the wrong cases | Confidence signal is model self-report |
| Approved plan differs from what executed | Plan not pinned after approval |
| Long-running agent cannot pause for approval | State not serialisable |

---

## Spend the review budget where it changes an outcome

Human oversight is an allocation problem. There is a finite amount of expert attention available, and the design question is where to spend it.

That produces three rules. Gate by consequence and reversibility rather than uniformly, because a gate on everything concentrates attention on nothing. Design the approval artefact so the effect and its evidence are visible in seconds, because a proposal that cannot be evaluated quickly will not be evaluated. And capture every rejection and edit with a reason, because that is the only channel through which human judgement improves the system.

The systems that get this right are not the ones with the most oversight. They are the ones where the small amount of oversight lands exactly where it changes an outcome.

---

*Next in this series: Semantic caching and state management — the cheapest performance win.*`,s="/blog/series/ai-systems-track-24.svg",o={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},r="2026-06-24",i=10,c="Agentic AI",l=["Human in the Loop","Approval Gates","Trust Boundaries","Safety","Agentic AI","AI Engineering","Human In The Loop","System Design","AIGovernance"],h=!1,d="AI Systems Track",u="ai-systems-track",p=24,g=30,f={id:"124",slug:e,title:n,excerpt:t,content:a,featuredImage:s,author:o,publishedAt:r,readTime:i,category:c,tags:l,featured:h,series:d,seriesSlug:u,seriesPart:p,seriesTotal:g};export{o as author,c as category,a as content,f as default,t as excerpt,h as featured,s as featuredImage,m as id,r as publishedAt,i as readTime,d as series,p as seriesPart,u as seriesSlug,g as seriesTotal,e as slug,l as tags,n as title};
