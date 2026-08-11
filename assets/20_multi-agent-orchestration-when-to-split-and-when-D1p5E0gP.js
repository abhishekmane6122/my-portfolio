const f="120",e="multi-agent-orchestration-when-to-split-and-when-to-stay-single",n="Multi-Agent Orchestration: When to Split and When to Stay Single",t="Multi-agent architectures are proposed far more often than they are justified. The diagram is appealing: a researcher agent, a writer agent, a reviewer agent, each with a clear role...",a=`Multi-agent architectures are proposed far more often than they are justified. The diagram is appealing: a researcher agent, a writer agent, a reviewer agent, each with a clear role, passing work between them like a well-run team.

The reality is that every agent boundary is a serialisation point, a context handoff, a place where information is lost, and a multiplier on cost and latency. Most systems that adopt multi-agent architectures would perform better as a single agent with better tools.

The cases where splitting genuinely wins are specific and identifiable. Knowing which situation you are in is the entire skill.

---

## What splitting actually costs

Before the patterns, the price.

**Context does not transfer.** Agent A finishes with 40,000 tokens of accumulated understanding. Agent B receives a summary of maybe 800 tokens. Everything else is gone. This information loss is the fundamental cost of a boundary, and it is why handoffs degrade quality on tasks where context matters.

**Cost multiplies.** Each agent has its own system prompt, its own tool schemas, and its own reasoning. Three agents on one task is typically three to five times the tokens of one agent, not because the work triples but because the overhead does.

**Latency serialises.** Sequential agents add their latencies. A three-stage pipeline where each stage takes eight seconds is a twenty-four second task.

**Debugging gets much harder.** A single agent's failure has one trace. A multi-agent failure requires determining which agent failed, whether the handoff was correct, and whether the receiving agent misread what it was given.

**Failures compound.** Three agents at 90 percent reliability, chained, produce a 73 percent success rate.

---

## When splitting is justified

Four situations, and they are the only reliable ones.

**Genuinely parallel work.** Four independent investigations that do not depend on each other's results. Running them concurrently is a real latency win, and there is no context to lose because the branches were independent anyway.

**Hard capability separation.** One task needs a vision model, another needs a code execution sandbox, another needs a specific fine-tuned model. These are different runtime requirements, not just different prompts.

**Security isolation.** An agent that touches customer PII and an agent that calls external APIs should not be the same process with the same credentials. The boundary is a control, and it is worth its cost.

**Tool count pressure.** Sixty tools cannot go in one context without degrading selection. Partitioning by domain, with a coordinator delegating, keeps each agent's tool set small.

Notably absent from that list: "different roles". A researcher persona and a writer persona are two prompts, not two agents. Splitting on persona alone buys the costs above and none of the benefits.

---

## The three patterns

### Supervisor

One coordinator owns the task, delegates sub-tasks to specialists, and assembles results. The specialists do not talk to each other.

\`\`\`mermaid
---
title: "The Supervisor Pattern"
---
flowchart TD
    A["User Request"] --> B["Supervisor<br/>decomposes and routes"]
    B --> C["Specialist: Data"]
    B --> D["Specialist: Documents"]
    B --> E["Specialist: External APIs"]

    C --> F["Result"]
    D --> G["Result"]
    E --> H["Result"]

    F --> I["Supervisor<br/>synthesise"]
    G --> I
    H --> I
    I --> J{"Sufficient"}
    J -->|No| B
    J -->|Yes| K["Final Response"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,C,D,E,F,G,H,I process
    class J decision
    class K output
\`\`\`

Predictable, debuggable, and the specialists can run in parallel. The supervisor is a bottleneck and a single point of failure, and it needs enough context to route well without carrying every specialist's full working state.

This is the correct default when splitting is justified.

### Swarm / handoff

Agents transfer control directly. Whoever holds the conversation handles it until it decides another agent is better suited, then hands off with context.

Natural for customer service, where a general agent transfers to billing, which transfers to technical support. Matches how humans actually route work.

The risk is uncontrolled handoff loops: billing sends to technical, technical sends back to billing. A handoff counter and a rule preventing immediate return handoffs are both necessary.

### Graph orchestration

Agents are nodes in an explicit state machine. Edges declare who can hand to whom under what condition. State is a typed shared object.

This is the pattern that scales, because it makes the topology explicit rather than emergent. It supports parallel branches, conditional routing, cycles with declared bounds, and checkpointing at every node.

\`\`\`mermaid
---
title: "Graph Orchestration With Fan-Out and Reconciliation"
---
flowchart TD
    A["START"] --> B["classify_and_plan"]
    B --> C{"Requires parallel investigation"}

    C -->|Yes| D["fan_out"]
    C -->|No| E["single_specialist"]

    D --> F["branch: financial data"]
    D --> G["branch: legal review"]
    D --> H["branch: technical assessment"]

    F --> I["join<br/>wait for all branches"]
    G --> I
    H --> I

    I --> J["reconcile<br/>resolve contradictions between branches"]
    J --> K{"Contradictions unresolved"}
    K -->|Yes| L["escalate to human"]
    K -->|No| M["synthesise"]

    E --> M
    M --> N["END"]
    L --> N

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,D,E,F,G,H,I,J,M process
    class C,K decision
    class L risk
    class N output
\`\`\`

The \`reconcile\` node is the piece most parallel designs omit. When three branches return findings, they can disagree, and something has to decide what the system believes. Skipping it produces answers that quietly contain contradictions.

---

## State between agents

The handoff is where multi-agent systems lose most of their quality. Three approaches.

| Approach | Mechanism | Loss | Cost |
|---|---|---|---|
| **Full transcript** | Pass everything | None | Context explodes, defeats the purpose |
| **Summary handoff** | Sending agent writes a summary | High and unmeasured | Cheap |
| **Shared typed state** | All agents read and write one structured object | Low | Requires schema design |

Shared typed state is the pattern that works. Rather than agents summarising for each other, they all operate on one structured object with defined fields:

\`\`\`
TASK STATE
  goal:            "assess vendor risk for Meridian Logistics"
  findings:
    financial:     { status: complete, risk: medium, evidence: [doc_221, doc_889] }
    legal:         { status: complete, risk: low,    evidence: [doc_412] }
    technical:     { status: pending }
  open_questions:  ["no SOC 2 report located"]
  contradictions:  []
\`\`\`

Each agent reads what it needs and writes into its own section. Nothing is summarised into prose and back. The object is inspectable, checkpointable, and testable.

**If a multi-agent system passes prose between agents, quality loss at the boundary is unmeasurable and usually large.** A typed state object makes the handoff a contract.

---

## What this looks like in three real systems

### The content pipeline that was three prompts pretending to be three agents

A marketing team built researcher, writer and editor agents. Research gathered sources, writing produced a draft, editing revised it.

Quality was worse than the single-agent version it replaced, and cost was four times higher.

Reading the traces showed why. The researcher accumulated rich understanding of the sources: which claims were well supported, which sources conflicted, what the nuances were. It then handed over an 800-token summary. The writer produced a draft from that summary, losing the nuance. The editor, with no access to the sources at all, "corrected" several accurate statements into vaguer ones because it could not verify them.

The boundaries were destroying exactly the information that made the output good.

Collapsed back to a single agent with three tools (\`search_sources\`, \`fetch_source\`, \`check_claim\`), one continuous context, and a structured output requiring citations, quality returned and cost dropped by 70 percent.

**Roles are not capabilities. Three personas are three prompts, and prompts do not need process boundaries.**

### The due diligence system where parallelism was real

A private equity firm assessed acquisition targets across four independent workstreams: financial statements, legal filings, technical infrastructure, and customer concentration.

These are genuinely independent. The legal review does not need the financial findings to proceed, and vice versa. Sequential execution took roughly 25 minutes per target.

\`\`\`mermaid
---
title: "Parallel Due Diligence With Shared Typed State"
---
flowchart TD
    A["Target company dossier"] --> B["Supervisor<br/>scope the four workstreams"]

    B --> C["Financial agent<br/>tools: filings DB, ratio calculator"]
    B --> D["Legal agent<br/>tools: litigation search, contract parser"]
    B --> E["Technical agent<br/>tools: code scan, infra questionnaire"]
    B --> F["Commercial agent<br/>tools: CRM export, concentration model"]

    C --> G["Shared typed state<br/>findings written per workstream"]
    D --> G
    E --> G
    F --> G

    G --> H["Reconciliation agent<br/>find contradictions across workstreams"]
    H --> I{"Material contradiction"}
    I -->|Yes| J["Flag for analyst<br/>with both sources cited"]
    I -->|No| K["Assemble diligence memo"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef store fill:#F3F0F8,stroke:#8880AE,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,C,D,E,F,H process
    class G store
    class I decision
    class J risk
    class K output
\`\`\`

Wall-clock time fell from 25 minutes to about 7. Cost rose by roughly 20 percent, not four times, because the work was genuinely partitioned rather than duplicated. Each agent also carried only its own domain's tools, which kept selection accuracy high.

The reconciliation agent found something the sequential version never had: the financial workstream's revenue figures and the commercial workstream's customer concentration data disagreed on the size of the largest account. That contradiction was material and had previously been missed because no single reader held both.

**Parallel agents plus an explicit reconciliation step surface contradictions that a single sequential reader would smooth over.**

### The support platform where handoff needed guardrails

A telecom's support system used a swarm pattern: a general agent that could hand off to billing, technical or retention specialists.

It worked well and occasionally produced a specific failure. A customer with a billing dispute caused by a technical fault would be handed from general to billing, billing would determine it was technical and hand to technical, technical would determine the customer wanted a refund and hand to billing, and the loop would continue until a turn limit fired, leaving the customer with nothing.

Three changes fixed it:

| Guardrail | Rule |
|---|---|
| Handoff budget | Maximum 3 handoffs per conversation |
| No immediate return | An agent cannot hand back to the agent that just handed to it |
| Handoff reason required | Structured field stating what the receiving agent must do |
| Escalation on exhaustion | Budget reached routes to a human with the full handoff chain |

The handoff reason field turned out to be the most valuable. It forced the sending agent to state a specific action rather than passing the problem along:

\`\`\`
Weak:     handoff(to="billing", reason="billing issue")
Required: handoff(to="billing",
                  reason="Technical fault confirmed on line, ticket TKT-8821.
                          Billing must issue credit for 14 days of outage.",
                  context={ticket_id: "TKT-8821", days: 14})
\`\`\`

Handoff loops went to zero, and the receiving agent no longer had to re-diagnose the problem from scratch.

---

## The decision

\`\`\`mermaid
---
title: "When to Split Into Multiple Agents"
---
flowchart TD
    A["Considering multi agent"] --> B{"Is the work genuinely parallel"}
    B -->|Yes| C["Split, use supervisor or graph fan out"]
    B -->|No| D{"Different runtime requirements"}

    D -->|Yes, vision, sandbox, different model| C
    D -->|No| E{"Security boundary required"}

    E -->|Yes, different credentials or data scopes| C
    E -->|No| F{"Tool count above 20"}

    F -->|Yes| G["Split by tool domain<br/>or filter tools per request first"]
    F -->|No| H["Stay single agent<br/>improve tools and state instead"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class C,G process
    class B,D,E,F decision
    class H output
\`\`\`

Note that the tool count branch suggests filtering before splitting. Filtering tools per request is a much cheaper answer to the same problem, and it should be tried first.

---

## Failure modes

| Symptom | Cause |
|---|---|
| Multi-agent version worse than single agent | Boundaries destroying context that mattered |
| Cost four times higher, quality flat | Split on personas rather than capabilities |
| Agents hand work back and forth | No handoff budget, no return-handoff rule |
| Receiving agent re-does the sender's work | Handoff carries prose, not structured state |
| Parallel branches produce contradictory findings | No reconciliation step |
| Impossible to diagnose a bad run | No per-agent trace with the shared state at each step |
| Supervisor becomes the bottleneck | Supervisor carrying full specialist context |
| One agent's failure kills the whole task | No partial-result path, no per-branch timeout |

---

## Splitting is a decision, not a default

Multi-agent orchestration is a real architecture with real uses, and it is applied far more widely than it is warranted.

The test is not whether the work has distinguishable roles. It is whether the work is genuinely parallel, needs different runtime capabilities, requires a security boundary, or has outgrown a single tool namespace. If none of those hold, the split is buying cost, latency and context loss in exchange for a nicer diagram.

Where splitting is justified, three things make it work: a shared typed state object rather than prose handoffs, an explicit reconciliation step when branches run in parallel, and hard limits on handoffs with a designed escalation path when they are exhausted.

The default should be one agent with excellent tools. Split when you can name which of the four reasons applies.

---

*Next in this series: Planning and decomposition — from goal to executable graph.*`,s="/blog/series/ai-systems-track-20.svg",i={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},o="2026-06-20",r=10,l="Agentic AI",c=["Multi-Agent","Orchestration","LangGraph","AI Agents","Agentic AI","Multi Agent","AI Engineering","System Design","Software Architecture"],h=!1,d="AI Systems Track",u="ai-systems-track",p=20,g=30,m={id:"120",slug:e,title:n,excerpt:t,content:a,featuredImage:s,author:i,publishedAt:o,readTime:r,category:l,tags:c,featured:h,series:d,seriesSlug:u,seriesPart:p,seriesTotal:g};export{i as author,l as category,a as content,m as default,t as excerpt,h as featured,s as featuredImage,f as id,o as publishedAt,r as readTime,d as series,p as seriesPart,u as seriesSlug,g as seriesTotal,e as slug,c as tags,n as title};
