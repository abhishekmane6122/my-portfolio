# Recruiter Outreach — Email Templates

> Fill the `[SQUARE BRACKETS]` before sending. Everything else is ready to go.
>
> **Placeholders you must fill:** `[CURRENT CTC]`, `[EXPECTED CTC]`, `[NOTICE PERIOD]`,
> `[YEARS]`, `[COMPANY]`, `[ROLE]`, `[RECRUITER NAME]`.
>
> Client names are deliberately absent — every project is described by domain, not employer.

---

## 1 · Cold outreach to a recruiter (primary)

### Subject lines — pick one

The first is the safest and most specific. Avoid anything that reads as a mass mailer.

1. `AI Engineer — production RAG, LLMOps & agentic systems | Abhishek Mane`
2. `Application: [ROLE] — AI Engineer with 11 production AI systems shipped`
3. `AI/ML Engineer — regulatory RAG, multi-agent pipelines, on-prem LLM serving`
4. `[ROLE] at [COMPANY] — AI Engineer, capital-markets AI platforms`

### Body

```text
Hi [RECRUITER NAME],

I'm an AI/ML engineer with [YEARS] years of experience building and shipping
production AI systems — not prototypes. I'm reaching out about [ROLE] at [COMPANY].

Most of my work has been end-to-end ownership of AI platforms in capital markets
and enterprise compliance, where being wrong is expensive and every number has to
be auditable. A few that are representative:

• Regulatory intelligence pipeline — a daily RAG and summarisation system over
  securities-regulator filings. Multi-backend LLM orchestration with automatic
  failover from Azure OpenAI to a locally-hosted model, OCR recovery for scanned
  documents, and an LLM-as-judge stage that scores every summary so quality
  regressions surface as a trend instead of a complaint.

• Multi-agent RAG over broker research — extracts structured financial estimates
  from any broker's PDF layout and answers role-tailored questions with citations.
  Moved from pure vector search to hybrid BM25 + vector + reranking after pure
  semantic retrieval kept returning passages that were topically right and
  factually useless. Every answer passes a claim-level verification check before
  it is returned.

• On-premises LLM pipeline — built in two weeks under a hard constraint that no
  document could leave the corporate network. Selected and served Phi-3-mini on a
  single T4 by sizing weights plus KV cache against real input lengths, with
  recursive summarisation for documents over the context window.

• AI model governance platform — a controlled on-ramp for open-source models:
  cryptographic integrity checks, deterministic static analysis for unsafe
  deserialization, licence classification, risk scoring, and a cyber/legal/
  governance approval chain before anything reaches an internal registry.
  The security verdict path deliberately contains no LLM.

I've written all eleven up as full case studies — problem framing, system design,
the engineering decisions and the trade-offs I'd have to defend in review:
https://abhishekmane6122.github.io/my-portfolio/projects

Core stack: Python, FastAPI, Azure OpenAI, Azure AI Search, Cohere embeddings,
LlamaIndex, PostgreSQL, React/TypeScript, Docker, Azure VM/GPU serving.

Current CTC [CURRENT CTC] · Expected [EXPECTED CTC] · Notice period [NOTICE PERIOD].

Happy to walk through any of these in depth, or take a technical screen whenever
suits. My CV is attached.

Best regards,
Abhishek Mane
abhishek.mane.work@gmail.com
+91-7020870063
LinkedIn  : https://www.linkedin.com/in/abhishek-mane-aiml
GitHub    : https://github.com/abhishekmane6122
Portfolio : https://abhishekmane6122.github.io/my-portfolio/
```

---

## 2 · Short version (LinkedIn InMail / WhatsApp / quick reply)

Under 150 words. Use when the recruiter contacted you first, or when the channel
punishes length.

### Subject

`AI Engineer — production RAG & agentic systems | Abhishek Mane`

### Body

```text
Hi [RECRUITER NAME],

Thanks for reaching out / I saw the [ROLE] opening at [COMPANY].

I'm an AI/ML engineer with [YEARS] years building production AI systems —
regulatory RAG pipelines with automatic cloud-to-local model failover, multi-agent
extraction over financial documents with hybrid retrieval and answer verification,
on-prem LLM serving on constrained GPU, and an AI model governance platform with a
deterministic security scanner.

Eleven of these are written up as full case studies, including the architecture
decisions and trade-offs:
https://abhishekmane6122.github.io/my-portfolio/projects

Current [CURRENT CTC] · Expected [EXPECTED CTC] · Notice [NOTICE PERIOD].

Free for a call this week if useful.

Abhishek Mane
+91-7020870063 · abhishek.mane.work@gmail.com
```

---

## 3 · Referral request (to someone inside the company)

Different job entirely — you're asking a favour, so make it easy to say yes.

### Subject

`Quick referral request — [ROLE] at [COMPANY]`

### Body

```text
Hi [NAME],

I'm applying for [ROLE] at [COMPANY] and wondered if you'd be open to referring me.

Short context: I'm an AI engineer who has taken production AI systems end to end —
RAG pipelines running as daily compliance controls, multi-agent document extraction
with hybrid retrieval, on-prem LLM serving under strict data-residency constraints,
and an AI governance platform for vetting open-source models before deployment.

The part most relevant to [COMPANY]'s work is [SPECIFIC THING — name the team's
actual problem, not a generic compliment].

Everything is documented here if you want to check before putting your name to it:
https://abhishekmane6122.github.io/my-portfolio/projects

No pressure at all if it's not a fit — genuinely happy either way.

Thanks,
Abhishek
abhishek.mane.work@gmail.com · +91-7020870063
```

---

## 4 · Follow-up after no reply (send 5–7 days later, once)

### Subject

Reply to your original thread — do **not** start a new one.

### Body

```text
Hi [RECRUITER NAME],

Following up briefly on the below in case it slipped through.

Since I wrote, I've also published a case study on [MOST RECENT / MOST RELEVANT
PROJECT], which covers [THE SPECIFIC THING THE ROLE CARES ABOUT]:
https://abhishekmane6122.github.io/my-portfolio/projects

Still very interested in [ROLE]. If the role has been filled or the profile isn't
a match, just let me know and I'll stop chasing.

Best,
Abhishek
```

---

## Notes on what to say about compensation

I've left the numbers as placeholders on purpose — I don't know your current CTC
and guessing it in a document you'll send to employers would be a bad idea.

A few things worth deciding before you fill them in:

- **Including current CTC is optional and often not in your interest.** In India
  most recruiters will ask, so putting it up front saves a round trip — but it also
  anchors the negotiation to your current number rather than to market rate for the
  role. If you're targeting a significant jump, consider sending only
  `Expected [EXPECTED CTC]` and answering current CTC when asked.
- **If you'd rather not commit early**, replace the line with:
  `Open to discussing compensation aligned to the role and market.`
- **Notice period is worth stating up front.** It's a real scheduling constraint for
  the hiring side and volunteering it reads as organised rather than evasive.

## Sending checklist

- Attach the CV as **PDF**, named `Abhishek_Mane_AI_Engineer.pdf` — not `resume_final_v3.pdf`
- Replace every `[BRACKET]`, then re-read once for leftovers
- Swap the four bullet projects for whichever are closest to the actual role
- Send Tue–Thu morning; Monday and Friday get buried
- One follow-up only, on the original thread
