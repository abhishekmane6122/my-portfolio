const g="116",e="agentic-rag-retrieval-as-a-decision-not-a-step",n="Agentic RAG: Retrieval as a Decision, Not a Step",t="Standard RAG runs a fixed pipeline. Query in, retrieve, generate, done. One retrieval, one generation, no branches.",s=`Standard RAG runs a fixed pipeline. Query in, retrieve, generate, done. One retrieval, one generation, no branches. It works well when the question is answerable from one search and fails in a specific and recognisable way when it is not.

Agentic RAG replaces the fixed pipeline with a loop that can decide: whether to retrieve at all, what to search for, whether what came back is good enough, and whether to search again with a different query.

The gain is real. So is the cost, and the failure modes are new ones.

---

## Where linear RAG breaks

Four patterns, all common.

**The question needs decomposition.** "How do our enterprise and standard support SLAs differ on weekend response times?" is two retrievals and a comparison. One search retrieves a blend of both and answers vaguely.

**The first search returns nothing useful.** Linear RAG proceeds anyway. It generates an answer from whatever came back, because there is no branch that says "this evidence is inadequate".

**The answer requires a follow-up search.** "Which of our data centres are affected by the vendor advisory published last week?" requires first finding the advisory, reading which hardware it covers, and then searching for which data centres run that hardware. The second search cannot be formulated until the first has been read.

**Retrieval was unnecessary.** "Thanks, that's helpful" triggers a retrieval, injects irrelevant passages, and produces a strange answer.

Every one of these is a decision the pipeline was not allowed to make.

---

## The agentic loop

\`\`\`mermaid
---
title: "The Agentic RAG Loop"
---
flowchart TD
    A["User Question"] --> B{"Does this need retrieval"}
    B -->|No| C["Answer directly"]
    B -->|Yes| D["Plan<br/>decompose into sub questions"]

    D --> E["Formulate search query"]
    E --> F["Retrieve<br/>hybrid search plus rerank"]
    F --> G["Grade evidence<br/>relevant, sufficient, consistent"]

    G --> H{"Evidence adequate"}
    H -->|No, wrong topic| I["Reformulate query"]
    H -->|No, nothing found| J["Try a different source or tool"]
    H -->|No, contradictory| K["Retrieve corroborating evidence"]
    H -->|Yes| L{"All sub questions answered"}

    I --> M{"Attempt budget remaining"}
    J --> M
    K --> M
    M -->|Yes| E
    M -->|No| N["Answer with stated limitations<br/>or escalate"]

    L -->|No| E
    L -->|Yes| O["Synthesise answer with citations"]
    O --> P["Verify claims against evidence"]
    P --> Q{"All claims grounded"}
    Q -->|No| R["Strip unsupported claims or retry"]
    Q -->|Yes| S["Final answer"]
    R --> S

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class D,E,F,G,O,P process
    class B,H,L,M,Q decision
    class I,J,K,N,R risk
    class C,S output
\`\`\`

Four decision points, each addressing one of the failure patterns above. The attempt budget is the component that keeps this from becoming an outage, and it is discussed below.

---

## The named patterns

Several variants of this loop have names, and they emphasise different parts.

**Self-RAG** adds a reflection step where the model grades its own retrieval and its own output for relevance and support. Cheap and effective, with the caveat that self-grading is optimistic.

**Corrective RAG (CRAG)** grades retrieved documents into correct, ambiguous or incorrect. Correct documents proceed. Incorrect documents trigger a fallback to a different source, commonly web search. Ambiguous documents trigger both. The value is the explicit fallback path.

**Multi-hop reasoning** loops retrieval where each search is formulated using what the previous one returned. This is the pattern that handles the vendor advisory example, and it is where the greatest gains over linear RAG appear.

**Query decomposition** splits a compound question into sub-questions up front, retrieves for each independently, and synthesises. Cheaper than a loop because the sub-searches run in parallel, and it handles a large share of real multi-part questions.

The practical recommendation is to start with decomposition, because it is parallel and bounded, and add the loop only for question types that genuinely require sequential dependency.

---

## The grader is the load-bearing component

Everything in the loop depends on being able to answer "is this evidence good enough". Get that wrong and the loop either stops too early with bad evidence or never stops at all.

Options, in increasing order of reliability:

| Grader | Cost | Reliability | Notes |
|---|---|---|---|
| Retrieval score threshold | Free | Weak | Vector scores are poorly calibrated |
| Cross-encoder rerank score | Very low | Good | Calibrated, already in the pipeline |
| Small model grader | Low | Good | Explicit relevance judgement per passage |
| Self-grading by the main model | Medium | Optimistic | Tends to accept its own retrieval |
| Separate verifier model | High | Strongest | Worth it for high-stakes answers |

The cross-encoder score is the pragmatic default, because a reranker should already be present and its score is calibrated enough to threshold on. A small dedicated grader model adds most of the remaining value.

Self-grading by the main model is the one to be careful with. A model asked whether the documents it just retrieved are relevant has a consistent bias toward yes.

---

## Bounding the loop

An unbounded agentic loop is a production incident waiting for the right query. Four limits, all mandatory.

**Attempt budget.** A hard cap on retrieval rounds. Three to five is typical. Past that, answer with stated limitations or escalate.

**Token budget.** Track cumulative tokens across the whole loop, not per call. A loop that runs five rounds with growing context can consume twenty times a single-pass request.

**Wall-clock budget.** Interactive requests need a deadline. When it expires, return the best answer available with a note about what could not be verified.

**Progress requirement.** Each round must produce something new. A loop that issues the same query twice, or retrieves the same passages, is not making progress and should terminate rather than continue. This is the check that catches the most common loop pathology.

\`\`\`mermaid
---
title: "Bounding the Agentic Retrieval Loop"
---
flowchart TD
    A["Loop iteration begins"] --> B["Check budgets"]
    B --> C{"Attempts under limit"}
    C -->|No| D["Terminate with partial answer"]
    C -->|Yes| E{"Tokens under limit"}
    E -->|No| D
    E -->|Yes| F{"Deadline not passed"}
    F -->|No| D
    F -->|Yes| G["Execute retrieval"]

    G --> H{"New evidence obtained"}
    H -->|No, same results as last round| I["No progress<br/>terminate"]
    H -->|Yes| J["Continue loop"]

    D --> K["Answer with explicit limitations<br/>or route to human"]
    I --> K

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,G,J process
    class C,E,F,H decision
    class D,I risk
    class K output
\`\`\`

---

## What this looks like in three real systems

### The IT helpdesk that needed two searches, not one

An internal support assistant handled questions like "is my laptop model affected by the security advisory from last week".

Linear RAG retrieved the advisory or the laptop inventory, never both, and produced answers that were confidently about the wrong half of the question.

The dependency is genuinely sequential. The second search cannot be written until the first is read, because the affected hardware list is inside the advisory.

\`\`\`mermaid
---
title: "Sequential Multi-Hop Retrieval"
---
flowchart TD
    A["Is my laptop affected by last week's advisory"] --> B["Round 1<br/>search security advisories, last 14 days"]
    B --> C["Advisory found<br/>affects firmware below 3.2 on X-series"]
    C --> D["Extract constraint<br/>X-series, firmware below 3.2"]
    D --> E["Round 2<br/>look up this user's device record"]
    E --> F["Device is X-series, firmware 3.1"]
    F --> G["Round 3<br/>search remediation steps for this advisory"]
    G --> H["Answer<br/>affected, here is the patch procedure, cited"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,C,D,E,F,G process
    class H output
\`\`\`

Resolution rate on advisory questions went from 31 percent to 84 percent. Cost per question roughly tripled, from one retrieval and one generation to three of each.

That tripling was accepted because advisory questions were 4 percent of traffic. The routing decision matters as much as the loop: **run the expensive loop only on the question types that need it.** A classifier at the front sends 96 percent of traffic down the cheap linear path.

### The market research tool where decomposition beat the loop

A consumer goods company's insights assistant handled questions like "how does our packaging sentiment compare between the UK and Germany over the last two quarters".

The first implementation was a full agentic loop. It worked, and it averaged 6.2 retrieval rounds per question, took 40 seconds, and cost roughly twelve times a standard query.

Reading the traces showed the loop was rediscovering the same structure every time. The question decomposes cleanly and the parts are independent:

\`\`\`
Sub-question 1: packaging sentiment, UK, Q1 2026
Sub-question 2: packaging sentiment, UK, Q2 2026
Sub-question 3: packaging sentiment, Germany, Q1 2026
Sub-question 4: packaging sentiment, Germany, Q2 2026
Then: compare
\`\`\`

Four independent retrievals that can run in parallel, then one synthesis. No sequential dependency at all.

\`\`\`
Agentic loop:     6.2 rounds sequential,  ~40 s,  12x cost
Decomposition:    4 retrievals parallel,   ~6 s,   4x cost
\`\`\`

Quality was equivalent. **Sequential loops are for questions with genuine sequential dependency. Everything else should be decomposed and parallelised.**

The practical test: can the second search be written before reading the first result? If yes, decompose. If no, loop.

### The clinical assistant where the grader prevented harm

A hospital's clinical reference assistant served questions about treatment protocols. Retrieval quality was good on documented protocols and the risk was the undocumented ones.

Linear RAG on a question about a rare presentation returned the five most similar protocol documents, all about related but different conditions, and generated a confident protocol that did not exist.

The corrective pattern with a strict grader changed the behaviour:

\`\`\`
Round 1:  retrieve, top rerank score 0.22
          Grader: no passage directly addresses this presentation
Round 2:  reformulated query with clinical synonyms, top score 0.31
          Grader: still no direct coverage
Round 3:  broadened to parent condition category, top score 0.29
          Grader: related but not specific
Terminate: attempt budget reached

Response: "The available protocol library does not contain guidance
specific to this presentation. The closest related protocols are
[cited]. This question should be escalated to the on call consultant."
\`\`\`

Three retrievals to produce a refusal is more expensive than one retrieval to produce a wrong answer, and in this setting the comparison is not close.

Two design choices made this work:

1. **The grader was a separate model with a strict rubric**, not the answering model grading itself. Self-grading accepted the related protocols as adequate in testing.
2. **The refusal was a designed output**, listing what was found and naming the escalation path, not a bare "I don't know".

**In high-stakes domains, the loop's most valuable output is frequently a well-evidenced refusal.**

---

## Cost and when to use it

| | Linear RAG | Decomposition | Agentic loop |
|---|---|---|---|
| Model calls | 1 to 2 | 1 plus N parallel | 3 to 12 sequential |
| Latency | 1 to 3 s | 3 to 8 s | 10 to 60 s |
| Relative cost | 1x | 3 to 5x | 5 to 20x |
| Handles multi-part questions | Poorly | Well | Well |
| Handles sequential dependency | No | No | Yes |
| Can refuse on weak evidence | No | Partially | Yes |
| Suitable for interactive chat | Yes | Usually | Only with streaming progress |

The economics push hard toward routing. A classifier at the front that sends simple questions to the linear path, multi-part questions to decomposition, and only genuinely dependent questions to the loop, keeps blended cost close to linear while capturing the quality gains where they matter.

---

## Failure modes

| Symptom | Cause |
|---|---|
| Loop never terminates | No attempt budget or no progress requirement |
| Loop terminates too early with bad evidence | Grader is the answering model, self-grading optimistically |
| Same query issued repeatedly | No query deduplication between rounds |
| Cost per question 20x expected | Loop running on all traffic instead of routed subset |
| Latency unacceptable in chat | Sequential loop with no progress streaming |
| Answers cite evidence from an abandoned branch | Context not cleaned between reformulations |
| Refusals never happen | No score threshold, grader always accepts |
| Parallel decomposition returns contradictory parts | No reconciliation step before synthesis |

---

## Retrieval as a decision has a price

Agentic RAG turns retrieval from a fixed step into a controlled decision, and that is genuinely more capable. It is also five to twenty times the cost and introduces loop-control problems that linear pipelines do not have.

The design that holds up in production has four properties. A router at the front, so the expensive path runs only where it is needed. Decomposition preferred over looping wherever the sub-questions are independent, because parallel is faster and cheaper than sequential. A grader that is not the answering model. And hard budgets on attempts, tokens, wall clock and progress, with a designed terminal state that answers honestly about what could not be established.

Get those four right and the loop is an upgrade. Skip any of them and it is a way to spend twenty times as much to arrive at the same answer, slower.

---

*Next in this series: Anatomy of an agent — the control loop that turns a model into a worker.*`,o="/blog/series/ai-systems-track-16.svg",a={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},r="2026-06-16",i=10,l="Retrieval",d=["Agentic RAG","AI Agents","Retrieval","Query Planning","RAG","Agentic AI","AI Engineering","System Design","LLMOps"],c=!1,h="AI Systems Track",u="ai-systems-track",p=16,m=30,f={id:"116",slug:e,title:n,excerpt:t,content:s,featuredImage:o,author:a,publishedAt:r,readTime:i,category:l,tags:d,featured:c,series:h,seriesSlug:u,seriesPart:p,seriesTotal:m};export{a as author,l as category,s as content,f as default,t as excerpt,c as featured,o as featuredImage,g as id,r as publishedAt,i as readTime,h as series,p as seriesPart,u as seriesSlug,m as seriesTotal,e as slug,d as tags,n as title};
