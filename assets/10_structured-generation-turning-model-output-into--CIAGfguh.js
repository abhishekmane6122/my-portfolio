const f="110",e="structured-generation-turning-model-output-into-a-contract",t="Structured Generation: Turning Model Output Into a Contract",n="The moment an LLM stops talking to a human and starts talking to code, its output becomes an API response.",a=`The moment an LLM stops talking to a human and starts talking to code, its output becomes an API response. And unlike an API response, it is produced by a system with no type checker, no schema enforcement by default, and a strong tendency to be helpful in ways that break parsers.

Every production AI system eventually builds the same layer: the one that turns probabilistic text into a data structure something downstream can rely on. Building it deliberately is considerably cheaper than discovering it one exception at a time.

---

## The four levels of enforcement

They are not equivalent, and knowing which one is in play determines what failures are possible.

| Level | Mechanism | Guarantee | Failure mode |
|---|---|---|---|
| **1. Prompt request** | "Respond in JSON" | None | Prose wrapper, markdown fences, trailing commentary |
| **2. JSON mode** | Provider flag forcing valid JSON | Syntactically valid JSON | Wrong fields, wrong types, missing keys |
| **3. Schema-constrained** | Provider validates against a supplied schema | Structurally valid against the schema | Semantically wrong values that satisfy the schema |
| **4. Constrained decoding** | Token sampling masked by a grammar | Only grammar-valid tokens are sampled | Same as level 3, plus grammar authoring cost |

Level one is where most systems start and where most parsing bugs live. Level three is where most production systems should be. Level four is for cases where the output format is not JSON at all: SQL, a domain-specific language, a regex-constrained identifier.

The critical thing that no level provides: **structural validity is not semantic correctness.** A schema guarantees that \`priority\` is one of three allowed strings. It does not guarantee the model picked the right one. Every level still needs validation of meaning.

---

## How constrained decoding actually works

Worth understanding because it explains both the guarantee and the cost.

At each decoding step the model produces a probability distribution over the entire vocabulary. Constrained decoding intercepts that distribution and sets the probability of any token that would violate the grammar to zero, then samples from what remains.

\`\`\`
State: inside a JSON object, just emitted a field name and a colon.
Grammar says the next token must begin a valid JSON value.

Vocabulary:  {  [  "  0-9  t(rue)  f(alse)  n(ull)  ...  the  and  Sure
Mask:        ok ok ok  ok   ok      ok       ok         blocked
\`\`\`

The model literally cannot emit "Sure, here is the JSON" because those tokens are masked out at that position.

The consequences:

**It cannot produce invalid structure.** This is a hard guarantee, not a strong tendency.

**It can distort quality.** Forcing the model down a path it assigned low probability to sometimes produces worse content than letting it write freely and then reformatting. The effect is small on simple schemas and real on complex ones with deeply nested requirements.

**Field order matters more than expected.** Because generation is autoregressive, fields generated earlier condition fields generated later. Putting a \`reasoning\` field before a \`classification\` field gives the model a scratchpad. Putting it after produces a post-hoc justification of a decision already made. Same schema, materially different behaviour.

---

## Designing schemas the model can actually satisfy

Schema design is prompt design. The field names, descriptions and structure are read by the model and shape the output.

**Flat beats nested.** Every level of nesting is another place to get the structure subtly wrong and another set of braces consuming tokens. Three levels deep is usually a sign the task should be split.

**Enums beat free strings.** \`"status": "active" | "suspended" | "closed"\` is enforceable and comparable. \`"status": string\` is a category that will grow synonyms over time.

**Descriptions are instructions.** A field description is read by the model. \`"confidence": number\` gets arbitrary values. \`"confidence": number, description: "0 to 1. Use below 0.5 when the source document does not state this explicitly."\` gets calibrated ones.

**Reasoning fields go first.** If the schema includes any analysis field, place it before the fields that depend on it.

**Optional fields need an explicit absence value.** A model asked for an optional field will frequently invent a plausible value rather than omit it. Give it a legal way to say nothing: \`"not_stated"\` as an enum member is more reliable than hoping for \`null\`.

**Include a refusal or uncertainty path.** A schema with no way to express "the document does not contain this" forces fabrication. This single design choice removes a large fraction of extraction hallucinations.

---

## The full pipeline

\`\`\`mermaid
---
title: "Structured Generation: Three Validation Stages"
---
flowchart TD
    A["Task Input"] --> B["Prompt with schema<br/>field descriptions as instructions"]
    B --> C["Model call<br/>schema constrained"]
    C --> D{"Structurally valid"}
    D -->|No| E["Repair attempt<br/>parse fix or single retry"]
    E --> D
    D -->|Yes| F["Type and range validation"]
    F --> G{"Business rules satisfied"}
    G -->|No| H["Validation error<br/>retry with error in context"]
    H --> C
    G -->|Yes| I["Groundedness check<br/>are values supported by the source"]
    I --> J{"Grounded"}
    J -->|No| K["Flag for review or escalate"]
    J -->|Yes| L["Typed Object<br/>safe for downstream use"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,C,F,I process
    class D,G,J decision
    class E,H,K risk
    class L output
\`\`\`

Three distinct validation stages, and they catch different things. Structural validation catches malformed output. Business rule validation catches values that are legal but wrong, such as an end date before a start date. Groundedness checking catches values that are legal, internally consistent, and not present in the source document. Only the third one catches confident fabrication, and it is the one most often skipped.

---

## The retry loop, and how to bound it

Retrying on validation failure is standard and needs three constraints or it becomes an outage.

**Include the error in the retry.** A bare retry at the same temperature frequently reproduces the same failure. Feeding back the specific validation message ("field \`due_date\` must be ISO 8601, received \`next Friday\`") converts a retry into a correction, and success rates on the second attempt are high.

**Cap the attempts.** Two retries. Beyond that, the failure is systematic and more attempts only spend money.

**Have a terminal path.** After the cap, the request either escalates to a larger model, routes to human review, or returns a structured failure. It must not loop and must not return partial garbage.

A worthwhile refinement: track which fields fail validation most often. A field that fails 30 percent of the time is a schema design problem, not a model problem, and no amount of retry logic fixes it.

---

## Multi-stage extraction

For complex outputs, one call producing a large nested object is usually worse than several calls producing small ones.

\`\`\`mermaid
---
title: "Multi-Stage Extraction Beats One Nested Schema"
---
flowchart LR
    A["Source Document"] --> B["Stage 1<br/>classify document type"]
    B --> C{"Type"}
    C -->|Contract| D["Stage 2a<br/>extract parties and dates"]
    C -->|Invoice| E["Stage 2b<br/>extract line items and totals"]
    C -->|Other| F["Route to review"]

    D --> G["Stage 3<br/>extract clauses per party"]
    E --> H["Stage 3<br/>validate totals arithmetic"]

    G --> I["Assemble final object"]
    H --> I
    I --> J["Schema validation on assembled result"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,D,E,G,H,I process
    class C decision
    class F risk
    class J output
\`\`\`

What this buys:

- **Smaller schemas per call**, which are more reliably satisfied.
- **Cheaper models for the easy stages.** Document classification does not need the frontier tier.
- **Localised failure.** When extraction fails, it fails in a specific stage with a specific input, which is debuggable. A single monolithic call that returns a wrong nested field is not.
- **Independent retry.** Only the failing stage reruns.

The cost is more round trips, which matters for interactive latency and matters much less for batch document processing, where this pattern dominates.

---

## Tool calling is structured generation

Function calling is the same mechanism wearing a different name. The model emits a structured object naming a function and its arguments, constrained by the function's schema.

Everything above applies, plus one addition: **the arguments are going to be executed.** A schema violation in an extraction produces a bad record. A schema violation in a tool call produces a bad action.

Which means validation before execution is not optional:

- Validate types and ranges before the call reaches the tool.
- Validate authorisation separately. A well-formed call to delete a resource the user cannot access is well-formed and must still be refused.
- Treat every argument as untrusted input, including ones that look like internal identifiers.
- Log the validated arguments, not the raw model output, so the audit trail reflects what actually ran.

---

## What this looks like in three real systems

### The invoice extractor that invented a due date

An accounts payable pipeline extracts vendor, amount, invoice number and due date from supplier invoices, then routes anything above a threshold for approval.

Schema-constrained generation was in place. Output was always valid JSON matching the schema. Types were correct. The pipeline ran clean for months.

Then an audit found invoices where the extracted due date did not appear anywhere on the document. The invoices genuinely had no due date printed. The schema required \`due_date\` as an ISO date string. The model, given no legal way to say "absent", produced a plausible date thirty days after the invoice date.

Every one of those records passed structural validation, passed type validation, and was wrong.

Two changes fixed it, and the first is the important one:

\`\`\`
Before:  "due_date": { "type": "string", "format": "date" }

After:   "due_date": {
           "oneOf": [
             { "type": "string", "format": "date" },
             { "const": "NOT_STATED" }
           ],
           "description": "Only extract a date printed on the document.
                           Use NOT_STATED if no due date appears.
                           Do not infer from payment terms."
         }
\`\`\`

Second, a groundedness check: for every extracted value, verify the literal string appears in the source text. Values that fail get flagged rather than committed.

**A schema with no way to express absence is a schema that mandates fabrication.**

### The healthcare triage where field order changed the diagnosis

A symptom intake tool produced a structured triage output:

\`\`\`json
{ "urgency": "routine|urgent|emergency",
  "reasoning": "...",
  "recommended_action": "..." }
\`\`\`

Clinical review found the reasoning field was consistently a justification of the urgency level rather than an analysis leading to it. When urgency was wrong, the reasoning confidently explained why the wrong level was correct.

The cause is autoregressive generation. \`urgency\` was emitted first, so every reasoning token was conditioned on a decision already made. The model was not reasoning toward a conclusion, it was rationalising one.

Reordering the schema so \`reasoning\` is generated before \`urgency\` gave the model a scratchpad it could actually use. Same schema, same model, same prompt. Agreement with clinician labels moved from 81 percent to 91 percent.

**In a generated object, earlier fields are inputs to later fields. Order the schema like a pipeline, not like a database record.**

### The KYC pipeline that split one call into four

A financial onboarding system extracted 34 fields from identity documents, proof of address and income statements in a single call with a deeply nested schema.

Failure rate was 23 percent, and failures were opaque: a nested object would come back with a wrong value and there was no way to tell which part of the document had confused the model.

The rebuild:

\`\`\`mermaid
---
title: "KYC Extraction Split Into Four Stages"
---
flowchart TD
    A["Uploaded document set"] --> B["Stage 1<br/>classify each document<br/>fast tier"]
    B --> C{"Document type"}

    C -->|ID document| D["Stage 2a<br/>extract name, DOB, ID number<br/>7 fields"]
    C -->|Address proof| E["Stage 2b<br/>extract address, issue date<br/>5 fields"]
    C -->|Income statement| F["Stage 2c<br/>extract employer, income, period<br/>6 fields"]
    C -->|Unrecognised| G["Route to human review"]

    D --> H["Cross document consistency check<br/>does the name match across all three"]
    E --> H
    F --> H

    H --> I{"Consistent"}
    I -->|Yes| J["Assembled applicant record"]
    I -->|No| K["Flag mismatch with evidence<br/>human adjudication"]

    classDef input fill:#E8F0FE,stroke:#5B7FA6,stroke-width:1px,color:#1F2933
    classDef process fill:#EDF4E9,stroke:#7A9A6B,stroke-width:1px,color:#1F2933
    classDef decision fill:#FDF6E7,stroke:#C9A85C,stroke-width:1px,color:#1F2933
    classDef risk fill:#FBEDED,stroke:#C08383,stroke-width:1px,color:#1F2933
    classDef output fill:#E7F2F1,stroke:#6F9BA3,stroke-width:1px,color:#1F2933

    class A input
    class B,D,E,F,H process
    class C,I decision
    class G,K risk
    class J output
\`\`\`

Failure rate dropped to 4 percent. Three reasons, in order of contribution:

1. **Smaller schemas per call.** Seven flat fields are far more reliably filled than 34 nested ones.
2. **Localised failure.** A failure now names a stage and a document, which is debuggable.
3. **Cheaper stages.** Classification and simple extraction moved to a fast-tier model; only the consistency reasoning stayed on the workhorse tier.

The cross-document consistency check in the middle deserves its own note. It catches a class of error no single extraction can: each document parsed correctly, but the name on the ID does not match the name on the income statement. That is either a data entry issue or a fraud signal, and neither is visible from inside a single extraction call.

---

## Failure modes

| Symptom | Structured-generation cause |
|---|---|
| Occasional parse errors in production | Level 1 or 2 enforcement, no schema constraint |
| Valid JSON with fabricated values | No groundedness check against the source |
| Extraction quality drops on complex documents | Schema too large or too deeply nested for one call |
| Model invents values for optional fields | No legal way to express absence |
| Classification always agrees with the reasoning field | Reasoning field placed after the decision field |
| Retry storms under load | Unbounded retry with no terminal path |
| Output quality worse than free-form generation | Over-constrained grammar fighting the model |
| One field fails validation constantly | Schema design issue, not a model issue |

---

## A contract, enforced at the boundary

Structured output is a contract between a probabilistic component and a deterministic one, and contracts need enforcement at the boundary.

The layers that make it hold: schema-constrained generation so the shape is guaranteed, field design that gives the model a legal way to be uncertain, three separate validation stages because they catch different classes of error, a bounded retry that feeds the error back, and a terminal path that fails cleanly.

Once that boundary exists, the rest of the system can treat model output as data. Without it, every downstream component has to defensively handle the possibility that it received a paragraph of prose instead.

---

*Next in this series: RAG fundamentals — the seven-stage pipeline most teams get wrong.*`,s="/blog/series/ai-systems-track-10.svg",o={name:"Abhishek Mane",photo:"/Abhishek_Profile.png"},i="2026-06-10",r=11,l="AI Engineering",c=["Structured Output","JSON Schema","Function Calling","Validation","AI Engineering","LLMOps","System Design","Software Architecture","Prompt Engineering"],d=!1,h="AI Systems Track",u="ai-systems-track",m=10,p=30,g={id:"110",slug:e,title:t,excerpt:n,content:a,featuredImage:s,author:o,publishedAt:i,readTime:r,category:l,tags:c,featured:d,series:h,seriesSlug:u,seriesPart:m,seriesTotal:p};export{o as author,l as category,a as content,g as default,n as excerpt,d as featured,s as featuredImage,f as id,i as publishedAt,r as readTime,h as series,m as seriesPart,u as seriesSlug,p as seriesTotal,e as slug,c as tags,t as title};
