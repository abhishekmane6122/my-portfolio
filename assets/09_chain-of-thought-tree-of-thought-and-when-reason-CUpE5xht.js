const g="109",e="chain-of-thought-tree-of-thought-and-when-reasoning-tokens-pay-off",t="Chain of Thought, Tree of Thought, and When Reasoning Tokens Pay Off",n="Reasoning is the most expensive thing a model can do and the most casually enabled. Extended thinking gets switched on globally because it improved one hard example, and the bill triples on...",s=`Reasoning is the most expensive thing a model can do and the most casually enabled. Extended thinking gets switched on globally because it improved one hard example, and the bill triples on a workload where 80 percent of requests never needed it.

Reasoning is a resource with a cost curve and a diminishing return, and it belongs in the same category as model tier and context budget: something allocated per request class, not set once for everything.

---

## Why intermediate steps help at all

A model that answers immediately commits to a token in a single forward pass. The computation available to reach that token is fixed by the architecture. There is no mechanism for the model to work through a problem before committing.

Producing intermediate reasoning changes that. Each generated step becomes part of the context for the next step. The model is effectively using its own output as a scratchpad, and the total computation applied to the problem scales with the number of tokens it generates.

That is the whole mechanism. Reasoning tokens buy compute, and compute helps on problems where the answer is not directly recoverable in one pass.

The corollary matters just as much: on problems where the answer *is* directly recoverable, extra steps buy nothing and introduce opportunities to go wrong.

---

## The reasoning spectrum

| Approach | Shape | Cost multiplier | Best for |
|---|---|---|---|
| **Direct answer** | One pass | 1x | Classification, extraction, lookup, formatting |
| **Zero-shot chain of thought** | Linear steps | 2 to 5x | Arithmetic, multi-constraint logic, simple planning |
| **Few-shot chain of thought** | Linear steps, guided by examples | 3 to 6x | Domain-specific reasoning with a house style |
| **Self-consistency** | N independent chains, majority vote | 5 to 20x | High-stakes answers with a verifiable form |
| **Tree of thought** | Branch, evaluate, backtrack | 10 to 50x | Search problems, puzzles, planning with dead ends |
| **Native extended thinking** | Model-internal, budget-controlled | 2 to 10x | General hard reasoning, tuned by budget |

The cost multipliers are the point. Self-consistency at ten samples is a decision to pay ten times for one answer. That is entirely reasonable for a compliance determination and absurd for a support reply.

---

## Chain of thought: linear and cheap

The classic form asks the model to work through the problem before answering. Modern instruction-tuned models frequently do this without being asked, which changes the practical advice: the question is less "should reasoning be prompted" and more "should reasoning be *constrained*".

Three patterns that hold up:

**Structure the reasoning.** Free-form thinking wanders. Naming the steps produces more consistent results and makes the output parseable.

\`\`\`
Work through this in order:
1. List the constraints stated in the request.
2. Identify which constraints conflict.
3. State the resolution rule being applied.
4. Give the final answer as a single line prefixed with ANSWER:
\`\`\`

**Separate reasoning from answer.** Put the reasoning in a delimited block and the answer outside it. Downstream parsers should never have to guess where the reasoning ended.

**Bound the reasoning.** An instruction to reason "briefly" or within a stated step count reliably reduces token consumption without much quality loss on medium-difficulty tasks.

---

## Tree of thought: search, not generation

Chain of thought commits to a path. A wrong step early poisons everything after it, and the model has no mechanism to notice and back up.

Tree of thought reframes the problem as search. At each stage, generate several candidate next steps, evaluate them, keep the promising ones, and abandon the rest.

\`\`\`mermaid
---
title: "Tree of Thought: Propose, Evaluate, Prune, Backtrack"
---
flowchart TD
    A["Problem"] --> B["Generate 3 candidate steps"]
    B --> C["Branch A"]
    B --> D["Branch B"]
    B --> E["Branch C"]

    C --> F{"Evaluator score"}
    D --> F
    E --> F

    F -->|Below threshold| G["Prune branch"]
    F -->|Above threshold| H["Expand branch<br/>generate next candidates"]

    H --> I{"Solution reached"}
    I -->|No| B
    I -->|Yes| J["Return solution path"]

    G --> K{"Any branches left"}
    K -->|Yes| H
    K -->|No| L["Backtrack to earlier node"]
    L --> B

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,C,D,E,H process
    class F,I,K decision
    class G,L risk
    class J output
\`\`\`

The evaluator is the component that determines whether this works. Three options in practice, in ascending order of cost and quality:

- **Heuristic scoring.** Cheap, works when the problem has measurable structure such as a partially satisfied constraint set.
- **Self-evaluation.** The model scores its own branches. Weakly calibrated, and it tends to be optimistic about paths it just generated.
- **Separate verifier model.** A distinct model or a rubric-driven judge scores branches. Most reliable, most expensive.

Tree of thought is genuinely powerful on a narrow class of problems: those with a large search space, clearly wrong intermediate states, and an evaluation signal that is cheaper than the full solution. Constraint satisfaction, game-like planning, and multi-step code repair fit. Most business workloads do not, and running tree search on them is a fifty-times cost multiplier for no gain.

---

## Self-consistency: the cheapest reliability upgrade

A middle option that gets overlooked. Generate the same answer N times at non-zero temperature, then take the majority.

The insight is that errors are usually less correlated than correct answers. If the model gets it right 70 percent of the time, five samples with a majority vote lands well above 70 percent, because the wrong answers scatter and the right one clusters.

Requirements for this to work:

- **The answer must have a comparable form.** A number, a label, a structured object. Free-form prose cannot be voted on without a semantic comparison step, which reintroduces cost and error.
- **Temperature must be above zero.** Identical samples vote unanimously for the same wrong answer.
- **The failure mode must be scatter, not bias.** If the model is systematically wrong in the same way every time, voting confirms the error with more confidence.

That last condition is the one to check. Self-consistency amplifies confidence, and confidently wrong is worse than uncertainly wrong.

---

## When reasoning makes things worse

This is the part that gets left out of most treatments, and it is measurable.

**Simple tasks degrade.** On straightforward classification or extraction, forcing a reasoning chain introduces a path where the model can talk itself out of the obvious answer. Direct prompting is both cheaper and better.

**Reasoning can rationalise.** A model that has produced several steps toward a wrong conclusion will frequently construct justification for it rather than reverse. The visible reasoning becomes an explanation of the answer rather than the process that produced it, which is actively misleading if it is being shown to users as a rationale.

**Latency compounds.** Reasoning tokens are generated sequentially at decode speed. A 2,000-token reasoning block at 50 tokens per second is 40 seconds before the answer starts. For interactive products this is frequently disqualifying regardless of quality.

**Verbosity leaks.** Without explicit separation, reasoning bleeds into user-facing output. Users get a paragraph of deliberation before the answer they asked for.

---

## Choosing per request class

The practical design is a routing decision, in the same shape as model tier routing.

\`\`\`mermaid
---
title: "Routing Reasoning Depth by Task Class"
---
flowchart TD
    A["Incoming Task"] --> B{"Task type"}
    B -->|Classify, extract, format| C["Direct answer<br/>no reasoning, low temperature"]
    B -->|Multi step but deterministic| D["Structured chain of thought<br/>bounded steps"]
    B -->|High stakes, verifiable answer| E["Self consistency<br/>N samples, majority vote"]
    B -->|Search with dead ends| F["Tree of thought<br/>with external evaluator"]

    C --> G["Validate output structure"]
    D --> G
    E --> G
    F --> G
    G --> H{"Validation passed"}
    H -->|Yes| I["Return"]
    H -->|No| J["Escalate one level of reasoning"]
    J --> G

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class C,D,E,F,G process
    class B,H decision
    class J risk
    class I output
\`\`\`

The escalation path at the bottom is what makes this economical. Start cheap, validate, and only pay for more reasoning when the cheap path visibly failed. Most traffic never reaches the expensive branches.

---

## Reasoning as a budget

Models with native extended thinking expose the budget directly, which makes the tradeoff explicit rather than emergent.

| Budget setting | Typical use | What to watch |
|---|---|---|
| Off or minimal | Classification, routing, extraction | Nothing, this is the default for most traffic |
| Low (roughly 1k tokens) | Standard generation with light analysis | Cost per request roughly doubles |
| Medium (roughly 4k tokens) | Multi-constraint problems, code changes | Latency becomes user-visible |
| High (16k and above) | Genuinely hard reasoning, research tasks | Cost per request can exceed 10x baseline |

Two operational notes. Reasoning tokens bill at output rates, which are typically several times input rates, so a high budget affects cost more than the token count suggests. And reasoning tokens consume the same context window as everything else, so a large budget on a long-context request can run the window out.

---

## Measuring whether it is worth it

The only defensible way to set these knobs is to measure on a golden set, split by difficulty.

1. Take the labelled evaluation set and tag each item as easy, medium or hard.
2. Run every reasoning configuration against all three tiers.
3. Record accuracy, cost per item and p95 latency for each combination.
4. Plot accuracy against cost per tier.

The resulting curves almost always show the same shape: flat on easy items (reasoning buys nothing), steeply rising then plateauing on medium, and rising further on hard. The plateau point per tier is the setting to ship, and it is different for each tier. That difference is exactly what the routing layer should encode.

---

## What this looks like in three real systems

### The e-commerce classifier that got worse when it started thinking

A marketplace classifies incoming product listings into 40 categories. Accuracy was 94 percent with a direct prompt.

A new model with extended thinking became available and was enabled globally, on the reasonable assumption that more reasoning helps. Accuracy fell to 89 percent and cost roughly tripled.

Reading the reasoning traces explained it. On a listing for "Bluetooth Speaker — Waterproof — Beach Edition", the direct prompt answered \`Audio\` immediately. The reasoning version produced four paragraphs weighing whether "Beach Edition" implied \`Outdoor & Sports\`, decided the beach association was a strong signal, and answered \`Outdoor & Sports\`.

The model talked itself out of the obvious answer. On a task where the first instinct is right 94 percent of the time, giving the model room to deliberate creates a path to be wrong that did not previously exist.

**Reasoning helps when the answer is not directly recoverable. On pattern-matching tasks it introduces variance.**

### The insurance adjuster where five samples were worth the money

A claims platform decides whether a submitted claim falls within policy coverage. A wrong "covered" decision costs the insurer the claim value. A wrong "not covered" decision costs a complaint, a manual review, and occasionally a regulator.

Single-pass accuracy on a labelled set of 400 historical claims was 86 percent. The errors were not systematic; they scattered across different edge conditions.

Self-consistency with five samples at temperature 0.7, taking the majority verdict, moved accuracy to 94 percent. Cost per decision went from about half a cent to about two and a half cents.

The arithmetic that justified it:

\`\`\`
Volume:                     30,000 claims/month
Errors at 86 percent:       4,200/month
Errors at 94 percent:       1,800/month
Errors avoided:             2,400/month
Extra model cost:           ~$600/month
Average cost per error:     ~$40 (review time, rework, escalation)
Value of errors avoided:    ~$96,000/month
\`\`\`

That is a straightforward decision. The same arithmetic on a low-stakes task where an error costs almost nothing produces the opposite answer, which is exactly why reasoning depth is a per-task decision.

Two conditions made this work and are worth checking before copying it: the output is a small enumerated set, so votes are comparable, and the errors scattered rather than clustering, so the majority was informative.

### The scheduling agent that needed search, not a chain

A field service company assigns 200 technicians to 600 daily jobs under real constraints: certifications, geography, part availability, customer time windows, and union-mandated break rules.

A chain-of-thought prompt produced schedules that looked plausible and violated a constraint about 40 percent of the time. The reason is structural. The model commits to assignment 1, then 2, then 3, and by assignment 180 it has painted itself into a corner where no valid assignment exists. A linear chain has no mechanism to back up.

Reframing it as search fixed it, with the critical detail being that the evaluator is code, not a model:

\`\`\`mermaid
---
title: "Tree Search With a Deterministic Constraint Checker"
---
flowchart TD
    A["Unassigned jobs"] --> B["Model proposes 3 candidate assignments<br/>for the next hardest job"]
    B --> C["Deterministic constraint checker<br/>certifications, travel time, breaks"]
    C --> D{"Any candidate valid"}
    D -->|No| E["Backtrack<br/>revise a previous assignment"]
    D -->|Yes| F["Score valid candidates<br/>travel cost and slack remaining"]
    F --> G["Keep top 2, prune rest"]
    G --> H{"All jobs assigned"}
    H -->|No| B
    H -->|Yes| I["Complete schedule<br/>constraint valid by construction"]
    E --> B

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,F,G process
    class C process
    class D,H decision
    class E risk
    class I output
\`\`\`

Constraint violations went to zero, because validity is enforced by the checker rather than hoped for from the model. The model's job narrowed to proposing good candidates, which is what it is actually good at.

**The evaluator is the load-bearing component in any tree search. When it can be code, make it code.** A model scoring its own branches is optimistic about paths it just generated, and the search degrades into an expensive chain.

---

## Failure modes

| Symptom | Reasoning-related cause |
|---|---|
| Costs tripled with no traffic change | Extended thinking enabled globally |
| Accuracy dropped on simple tasks | Forced reasoning on items that did not need it |
| Users see deliberation before the answer | Reasoning not separated from output |
| Model confidently wrong more often | Self-consistency amplifying a systematic bias |
| Time to first useful token unacceptable | Reasoning block generated before any visible output |
| Tree search never terminates | No depth bound, no branch budget, weak evaluator |
| Context overflow on hard requests | Reasoning budget competing with retrieved context |

---

## Reasoning is compute you choose to spend

Reasoning is compute purchased with tokens. Like any purchase, it is worth making when the return exceeds the price, and the return depends entirely on the difficulty of the task.

The design that works is tiered: direct answers for the majority, bounded chains for the middle, sampling or search reserved for the small set of requests where a wrong answer is genuinely expensive. Enabling maximum reasoning everywhere is the same error as running every request on the frontier model, and it is usually made for the same reason: it improved one example that someone was watching.

---

*Next in this series: Structured generation — turning model output into a contract.*`,a="/blog/series/ai-systems-track-09.svg",o={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},i="2026-06-09",r=11,h="AI Engineering",c=["Chain of Thought","Tree of Thought","Reasoning","Test-Time Compute","AI Engineering","Prompt Engineering","LLMOps","System Design","AIArchitecture"],l=!1,d="AI Systems Track",u="ai-systems-track",p=9,m=30,f={id:"109",slug:e,title:t,excerpt:n,content:s,featuredImage:a,author:o,publishedAt:i,readTime:r,category:h,tags:c,featured:l,series:d,seriesSlug:u,seriesPart:p,seriesTotal:m};export{o as author,h as category,s as content,f as default,n as excerpt,l as featured,a as featuredImage,g as id,i as publishedAt,r as readTime,d as series,p as seriesPart,u as seriesSlug,m as seriesTotal,e as slug,c as tags,t as title};
