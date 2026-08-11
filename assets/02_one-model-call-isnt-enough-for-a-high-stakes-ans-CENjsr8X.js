const u="402",e="one-model-call-isnt-enough-for-a-high-stakes-answer-heres-what-to-do-instead",t="One Model Call Isn't Enough for a High-Stakes Answer. Here's What to Do Instead.",n="A single model call at temperature 0.7 will give you a different answer if you run it twice. That's not a bug to fix - it's the nature of sampling from a probability distribution - but it...",a=`A single model call at temperature 0.7 will give you a different answer if you run it twice. That's not a bug to fix - it's the nature of sampling from a probability distribution - but it means a single call is a single sample, and for anything where being wrong is expensive, one sample isn't a reliable basis for a decision.

Ensembles fix this through redundancy, and which ensemble pattern to reach for depends entirely on whether the task has a checkable answer.

If it does - math, classification, anything where you can compare two outputs for equality - self-consistency is the tool. Generate several reasoning paths at a moderate temperature (0.5 to 0.8 for diversity without pure noise), extract the final answer from each, take the majority vote. Confidence falls out for free: the fraction of samples that agreed. Five to ten samples typically buys 5 to 15 percent accuracy improvement, and it's cheap to justify since the calls run in parallel - you pay in tokens, not latency.

If the task is open-ended - creative writing, code that could correctly be written several ways - there's no answer to vote on, so best-of-N with a reward model takes over: generate N candidates, score each, keep the highest scorer. The failure mode is reward hacking, where a sample fools the reward model rather than being genuinely better. The fix is never trusting a single reward model - use three or more diverse ones and aggregate conservatively, the 25th percentile score rather than the mean, so a candidate has to look good across every judge, not exploit the weakest one.

For evaluation itself - judging output quality, not generating it - the same diversity principle applies to the judges. A panel drawn from different model families (Claude, GPT, Gemini, not three GPT variants sharing the same blind spots) catches bias a single judge would miss, and low agreement across the panel is itself a signal worth acting on: the sample needs a human, not an averaged score.

One detail that's cheap to skip and expensive to have skipped: positional bias. A model comparing response A against B favors whichever it saw first, 60 to 70 percent of the time, independent of quality. The fix is mechanical - run both orderings, trust the result only if the same response wins regardless of position. If the winner flips with order, that's not a tie, it's a sign the model can't actually distinguish the two on the criteria given.

None of this is free. Multi-agent debate runs 6x the cost and 3x the latency of one call. For a simple factual lookup with no real ambiguity, an ensemble buys nothing - a single RAG call with a good retriever beats five expensive votes on a question that never had more than one reasonable answer.

#AIEngineering #LLMReliability #MachineLearning #AIQuality #SystemDesign

---

## Diagrams

### Which ensemble pattern for which task

\`\`\`mermaid
---
title: "Choosing an Ensemble Pattern: Does the Task Have a Checkable Answer?"
---
flowchart TD
    A["High-stakes generation task"] --> B{"Is there a single correct<br/>answer format?"}
    B -->|"Yes - math, classification"| C["Self-Consistency<br/>majority vote across k samples"]
    B -->|"No - creative, open QA"| D["Best-of-N<br/>reward model selects"]
    D --> E{"Reliable reward model?"}
    E -->|Yes| F["Reward model ensemble<br/>conservative 25th-percentile score"]
    E -->|No| G["LLM-as-judge panel<br/>or human review"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933
    class A input
    class B,E decision
    class C,D,F,G output
\`\`\`

### Positional bias: why order matters in LLM-as-judge

\`\`\`mermaid
---
title: "Debiasing Pairwise Comparison: Run Both Orderings"
config:
  look: handDrawn
---
sequenceDiagram
    participant J as Judge model
    Note over J: Compare A vs B (A shown first)
    J-->>J: Picks A (60-70% position bias toward first slot)
    Note over J: Compare B vs A (B shown first)
    J-->>J: Picks A again
    Note over J: A won BOTH orderings -> real signal, high confidence
    Note over J: If instead the winner flips with order -> positional bias detected, treat as a tie
\`\`\``,s="/blog/series/deep-dives-02.svg",i={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},o="2026-08-02",r=3,l="AI Engineering",h=["Ensembles","Reliability","Voting","High Stakes","AI Engineering","LLMReliability","Machine Learning","AIQuality","System Design"],c=!1,d="Deep Dives",g="deep-dives",p={id:"402",slug:e,title:t,excerpt:n,content:a,featuredImage:s,author:i,publishedAt:o,readTime:r,category:l,tags:h,featured:c,series:d,seriesSlug:g};export{i as author,l as category,a as content,p as default,n as excerpt,c as featured,s as featuredImage,u as id,o as publishedAt,r as readTime,d as series,g as seriesSlug,e as slug,h as tags,t as title};
