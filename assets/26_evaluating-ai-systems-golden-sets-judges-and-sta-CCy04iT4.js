const f="126",e="evaluating-ai-systems-golden-sets-judges-and-statistical-honesty",t="Evaluating AI Systems: Golden Sets, Judges and Statistical Honesty",n="Evaluation is the discipline that separates AI systems that improve from AI systems that change. Without it, every prompt edit, model swap and retrieval tweak is a guess whose effect is...",s=`Evaluation is the discipline that separates AI systems that improve from AI systems that change. Without it, every prompt edit, model swap and retrieval tweak is a guess whose effect is measured by whether the team feels better about the demo.

It is also the work most often deferred, because it produces no visible feature. The deferral is expensive in a specific way: by the time the system is complex enough that evaluation is obviously necessary, building the evaluation set requires reconstructing intent nobody wrote down.

---

## Why this is harder than testing software

A unit test has one correct output. An AI system has a space of acceptable outputs, and the boundary of that space is a judgement call.

| Software testing | AI evaluation |
|---|---|
| Deterministic output | Distribution of outputs |
| Binary pass or fail | Graded quality |
| Assertion is the spec | Rubric is the spec, and rubrics are contested |
| Failure is a bug | Failure may be acceptable at some rate |
| Coverage is measurable | Input space is effectively infinite |
| Regression is obvious | Regression can be a two-point shift on a noisy metric |

The consequence is that AI evaluation is a sampling and measurement problem, and it needs the discipline that implies: a representative sample, a defined rubric, and enough statistical care to distinguish a real change from noise.

---

## Start with error analysis, not metrics

The most common mistake is choosing metrics first. A team adopts a standard metric suite, discovers their score is 0.71, and has no idea what to do about it.

The productive order is inverted.

\`\`\`mermaid
---
title: "Error Analysis Before Metrics"
---
flowchart TD
    A["Collect 100 real outputs<br/>sampled from production traffic"] --> B["Open coding<br/>read each one, write a free-form note on what is wrong"]
    B --> C["Axial coding<br/>group the notes into recurring failure modes"]
    C --> D["Failure taxonomy<br/>named categories with counts"]

    D --> E["Rank by frequency times severity"]
    E --> F["Pick the top 2 or 3"]
    F --> G["Design a metric per chosen failure mode"]
    G --> H["Build the golden set targeting those modes"]
    H --> I["Now you have metrics that map to fixes"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,C,D,E,F,G,H process
    class I output
\`\`\`

Reading a hundred outputs is unglamorous and it is the highest-return activity in AI evaluation. It produces a failure taxonomy specific to your system, and every metric derived from it is actionable by construction.

A taxonomy from a real support assistant looked like this:

\`\`\`
Failure mode                              Count   Severity
Cited a policy that does not apply          23     High
Answered a different question                14     Medium
Correct but unusably verbose                 11     Low
Refused when the answer was available         9     Medium
Missing escalation on an angry customer       6     High
Fabricated a specific number                  4     Critical
\`\`\`

Six categories. Two of them account for most of the harm. The metrics to build are now obvious, and so is the order.

---

## The golden set

The durable artefact of an evaluation programme.

**Properties that matter:**

- **Drawn from real traffic**, not invented. Invented test cases test the imagination of whoever wrote them.
- **Stratified.** Include easy, medium and hard cases in known proportions. A set that is 90 percent easy will show 94 percent accuracy and hide everything.
- **Labelled with a written rubric**, so two people labelling independently agree.
- **Versioned and frozen.** A set that changes as the system changes measures nothing.
- **Split into development and test.** Iterate against dev; touch test only to confirm. Otherwise you overfit to the eval set.

**Size:** 100 to 300 items covers most systems. Below 50, statistical noise dominates. Above 500, marginal information falls off and labelling cost rises. Quality of labelling matters far more than quantity.

**Inter-rater agreement** is worth measuring once. Have two people label 30 items independently. If they agree less than about 80 percent of the time, the rubric is ambiguous and every score produced with it will be noise.

---

## Evaluation methods

Four kinds, and each fits a different sort of question.

| Method | Cost | Reliability | Suits |
|---|---|---|---|
| **Code-based checks** | Free | Perfect for what it checks | Format, schema, presence of a citation, forbidden terms, latency |
| **Reference-based metrics** | Free | Weak on generative tasks | Exact match, numeric comparison |
| **LLM-as-judge** | Low | Good if calibrated | Quality, faithfulness, tone, relevance |
| **Human review** | High | The ground truth | Calibrating everything else |

**Use code wherever code will do.** Whether output is valid JSON, contains a citation, stays under a length limit, avoids a prohibited phrase, or returns within a latency budget are all deterministic checks. They are free, instant, and never drift. Teams routinely reach for an LLM judge for things a regex answers.

---

## Building an LLM judge that can be trusted

An uncalibrated judge is a number generator. Calibration is what turns it into a measurement.

**Write a rubric with concrete anchors.**

\`\`\`
Weak:   "Rate the answer's quality from 1 to 5."

Strong: Score FAITHFULNESS:
        PASS  - every factual claim is directly supported by the
                provided sources
        FAIL  - at least one claim is not supported, contradicts a
                source, or introduces a specific detail (number, date,
                name) absent from the sources

        Output only PASS or FAIL, then one sentence naming the
        unsupported claim if FAIL.
\`\`\`

Binary or three-point scales are far more reliable than five- or ten-point scales. Judges cannot reliably distinguish a 6 from a 7, and the extra granularity is noise presented as precision.

**Calibrate against human labels.**

\`\`\`mermaid
---
title: "Calibrating an LLM Judge Against Human Labels"
---
flowchart TD
    A["Golden set, human labelled"] --> B["Split: train, dev, test"]
    B --> C["Draft the judge rubric"]
    C --> D["Run judge on the train split"]
    D --> E["Compare to human labels"]
    E --> F{"Agreement above 85 percent"}
    F -->|No| G["Inspect disagreements<br/>refine the rubric or add examples"]
    G --> D
    F -->|Yes| H["Validate on dev split"]
    H --> I{"Agreement holds"}
    I -->|No| G
    I -->|Yes| J["Measure on test split once<br/>record true positive and true negative rates"]
    J --> K["Judge is calibrated<br/>use its rates for statistical correction"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,C,D,E,H,J process
    class F,I decision
    class G risk
    class K output
\`\`\`

**Known biases to control for:**

- **Position bias.** In pairwise comparison, judges favour whichever response came first. Randomise the order and, where cost allows, run both orders.
- **Length bias.** Judges rate longer answers higher. State explicitly that length is not a quality signal.
- **Self-preference.** A judge tends to prefer output from the same model family. Use a different model as judge where possible.
- **Verbosity of reasoning.** Asking a judge to explain before scoring improves reliability. Asking after produces rationalisation.

---

## Statistical honesty

The section that gets skipped and causes the most wasted effort.

**A judge is not ground truth.** If the judge agrees with humans 88 percent of the time, a measured pass rate of 0.80 is not the true pass rate. It can be corrected using the judge's measured true positive and true negative rates, and the corrected estimate comes with a confidence interval.

**Two-point differences on 100 items are noise.** A change from 0.78 to 0.80 on a 100-item set has a confidence interval wide enough to include no change at all. Reporting it as an improvement is how teams ship regressions.

A rough guide:

\`\`\`
Set size 100:   detectable difference roughly 10 percentage points
Set size 300:   detectable difference roughly 6 percentage points
Set size 1000:  detectable difference roughly 3 percentage points
\`\`\`

**Use paired comparison where possible.** Running both variants on the same items and comparing per-item outcomes is far more sensitive than comparing two aggregate rates, because it removes item difficulty as a source of variance.

**Report intervals, not points.** "0.82, 95 percent CI 0.74 to 0.88" is an honest result. "82 percent" implies a precision that does not exist.

---

## What this looks like in three real systems

### The team that shipped a regression twice

A customer service platform iterated on its answer prompt. Each change was evaluated on a 60-item set, and each showed a small improvement. Over four months the score went from 0.71 to 0.84.

Production complaints went up over the same period.

Three problems compounded.

**The set was too small.** At 60 items, none of the individual improvements were statistically distinguishable from noise. The team was reading random variation as progress.

**The set was not stratified.** It had been assembled from cases the team found interesting, which skewed toward unusual questions. Roughly 70 percent of real traffic was routine, and the eval set contained almost none of it.

**Dev and test were the same set.** Four months of iterating against the same 60 items produced prompts tuned to those 60 items.

The rebuild:

| Change | Effect |
|---|---|
| Stratified sample of 240 items from real logs | Matches production distribution |
| Split 160 dev, 80 test held out | Overfitting becomes detectable |
| Paired comparison against the current production prompt | Removes item difficulty variance |
| Confidence intervals reported on every result | Noise no longer reads as progress |

Re-measured on the new set, the "improved" prompt scored *below* the original version from four months earlier on routine questions, which was the bulk of traffic.

**A small, unstratified, reused eval set does not measure quality. It measures how well the prompt has been fitted to that set.**

### The document extraction pipeline where code beat the judge

A legal operations team evaluated a contract extraction system with an LLM judge scoring each extraction on a 1-to-5 quality scale. Judge cost was significant, results were noisy, and the score did not clearly correspond to anything actionable.

Decomposing "quality" into what actually mattered:

| Property | How to check | Method |
|---|---|---|
| Output is valid against the schema | Schema validation | Code |
| Dates are ISO 8601 | Regex | Code |
| Party names appear in the source document | String search | Code |
| Monetary amounts match a value in the document | Numeric extraction and compare | Code |
| Absent fields marked NOT_STATED rather than invented | Field check plus source search | Code |
| Clause classification is correct | Compare to human label | Reference |
| Summary of an obligation is faithful | Rubric judgement | LLM judge |

Six of seven checks became code. Only the last genuinely needed a judge.

\`\`\`
Before:  1 LLM judge call per document, 5-point scale
         cost per eval run: high, variance: high, actionability: low

After:   6 deterministic checks plus 1 binary judge call
         cost per eval run: 85 percent lower
         variance: near zero on the coded checks
         actionability: each failing check names the exact field
\`\`\`

The eval run also became fast enough to put in CI on every commit, which changed it from a periodic exercise into a gate.

**Decompose "quality" into properties before choosing a method.** Most of what teams use judges for is deterministic once it is named precisely.

### The retail assistant where the judge preferred the wrong answers

An e-commerce team used an LLM judge to compare two versions of a product recommendation assistant. Version B won consistently, by a wide margin.

Version B performed worse in an A/B test on real users.

Investigating the judge's reasoning showed a clear pattern. Version B produced longer, more elaborate responses with more hedging and more context. The judge rated these as more helpful. Users found them tedious and abandoned them.

Three corrections:

**Length was explicitly de-weighted in the rubric.** "Conciseness is a positive quality. Do not reward additional detail unless it changes what the customer would do."

**The rubric was rewritten around user outcomes**, not perceived helpfulness. "Would a customer be able to make a purchase decision from this response without asking a follow-up question?"

**The judge was recalibrated against human labels drawn from actual user satisfaction data**, not from an internal team's opinion of which answer read better.

After recalibration, the judge agreed with the A/B outcome, and version A won.

**A judge measures what the rubric asks about.** If the rubric asks about perceived helpfulness and the business cares about task completion, the judge will confidently optimise for the wrong thing.

---

## Evaluation in the delivery pipeline

Evaluation that runs occasionally catches regressions occasionally.

\`\`\`mermaid
---
title: "The Eval Gate in CI"
---
flowchart TD
    A["Pull request<br/>prompt, retrieval or model change"] --> B["Fast checks<br/>code based, under 60 seconds"]
    B --> C{"Format, schema, latency pass"}
    C -->|No| D["Block, fail fast"]
    C -->|Yes| E["Full eval on the dev set<br/>judge plus code checks"]

    E --> F["Paired comparison against production baseline"]
    F --> G{"Any metric regressed beyond<br/>the confidence interval"}
    G -->|Yes| H["Block, report which metric and by how much"]
    G -->|No| I{"Improvement claimed"}

    I -->|Yes| J["Confirm once on the held out test set"]
    I -->|No| K["Merge, no claim made"]

    J --> L{"Confirmed"}
    L -->|Yes| M["Merge and record the result"]
    L -->|No| N["Overfitted to dev, do not claim"]

    M --> O["Shadow deploy<br/>compare on live traffic"]
    O --> P["Canary, then full rollout"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,E,F,J,O process
    class C,G,I,L decision
    class D,H,N risk
    class K,M,P output
\`\`\`

The two-tier structure matters for developer experience. Fast code checks run in under a minute and catch most problems. The full evaluation runs once the cheap checks pass.

The held-out test confirmation is what keeps the dev set honest over time.

---

## Failure modes

| Symptom | Cause |
|---|---|
| Eval score improves, users complain | Set not representative of real traffic |
| Every change shows a small improvement | Set too small, noise read as signal |
| Score plateaus and stops moving | Overfitted to the eval set |
| Judge scores do not match human opinion | Judge never calibrated |
| Judge prefers longer answers | Length bias, not controlled in the rubric |
| Two people label the same item differently | Rubric ambiguous, agreement never measured |
| Eval too slow to run on every change | Judge used where code would do |
| Cannot say what to fix from the score | Metrics chosen before error analysis |
| Regression shipped despite passing eval | No paired comparison, no confidence intervals |

---

## Measurement is a discipline, not an afterthought

Evaluation is measurement, and measurement has rules. A representative stratified sample. A written rubric with enough clarity that two people agree. Code checks wherever code will do. A judge calibrated against human labels, with known bias controls. Paired comparison and confidence intervals so a change is distinguishable from noise. A held-out set that is touched rarely.

The sequence that produces all of this starts in the least technical place: read a hundred real outputs and write down what is wrong with them. Every useful metric in the system will trace back to that taxonomy, and every metric that does not is measuring something nobody asked about.

---

*Next in this series: Observability for AI — traces, metrics and the silent failure problem.*`,a="/blog/series/ai-systems-track-26.svg",o={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},i="2026-06-26",r=11,c="LLMOps",l=["Evaluation","LLM as Judge","Golden Set","Testing","AI Engineering","LLMOps","AIEvaluation","System Design","MLOps"],d=!1,u="AI Systems Track",h="ai-systems-track",m=26,p=30,g={id:"126",slug:e,title:t,excerpt:n,content:s,featuredImage:a,author:o,publishedAt:i,readTime:r,category:c,tags:l,featured:d,series:u,seriesSlug:h,seriesPart:m,seriesTotal:p};export{o as author,c as category,s as content,g as default,n as excerpt,d as featured,a as featuredImage,f as id,i as publishedAt,r as readTime,u as series,m as seriesPart,h as seriesSlug,p as seriesTotal,e as slug,l as tags,t as title};
