# -*- coding: utf-8 -*-
"""Convert the LinkedIn 30-day markdown series into portfolio blog JSON + SVG covers.

Run from anywhere:  python scripts/import_linkedin_series.py

Idempotent - re-running overwrites the generated JSON and covers in place, so it
is safe to re-run after editing a source markdown file. It only ever writes into
blog_json/<series-slug>/ and public/blog/series/; the hand-written posts sitting
directly in blog_json/ are never touched.
"""
import io, os, re, json, glob, sys, datetime, textwrap

sys.stdout.reconfigure(encoding="utf-8")

# Source markdown (the LinkedIn content repo)
BLOG_SRC = r"D:\Abhishek\Github\AI_Learning\Linkedin\Linkedin_Blog\30_Day_Series"
POST_SRC = r"D:\Abhishek\Github\AI_Learning\Linkedin\Linkedin_Post\30_Day_Series"
SERIES2_SRC = r"D:\Abhishek\Github\AI_Learning\Linkedin\Linkedin_Post\30_Day_Series_2"
STANDALONE_SRC = r"D:\Abhishek\Github\AI_Learning\Linkedin\Linkedin_Post\Standalone"

PORTFOLIO = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend-vite")
JSON_OUT = os.path.join(PORTFOLIO, "src", "data", "blog_json")
SVG_OUT = os.path.join(PORTFOLIO, "public", "blog", "series")

AUTHOR = {"name": "Abhishek Mane", "photo": "/Abhishek_Profile.png"}

# ---------------------------------------------------------------- categories
AI_SYSTEMS_CATEGORY = {
    1: "Inference", 2: "Inference", 3: "Inference", 4: "Retrieval", 5: "Inference",
    6: "Inference", 7: "AI Engineering", 8: "AI Engineering", 9: "AI Engineering",
    10: "AI Engineering", 11: "Retrieval", 12: "Retrieval", 13: "Retrieval",
    14: "Retrieval", 15: "Retrieval", 16: "Retrieval", 17: "Agentic AI",
    18: "Agentic AI", 19: "Agentic AI", 20: "Agentic AI", 21: "Agentic AI",
    22: "Agentic AI", 23: "Agentic AI", 24: "Agentic AI", 25: "LLMOps",
    26: "LLMOps", 27: "LLMOps", 28: "AI Security", 29: "AI Security", 30: "LLMOps",
}
POST_CATEGORY = {
    **{d: "Agent Memory" for d in range(1, 16)},
    16: "AI Engineering", 17: "Agentic AI", 18: "Retrieval", 19: "LLMOps",
    20: "Inference", 21: "Agentic AI", 22: "AI Engineering", 23: "LLMOps",
    24: "Inference", 25: "Edge AI", 26: "AI Engineering", 27: "LLMOps",
    28: "AI Security", 29: "AI Engineering", 30: "LLMOps",
}

# curated topical tags (3-4 each); generic hashtag-derived tags are appended
AI_SYSTEMS_TAGS = {
    1: ["Prefill", "Decode", "TTFT", "Latency"],
    2: ["Tokenization", "BPE", "Token Cost", "Context Window"],
    3: ["Attention", "Long Context", "Transformers", "Scaling"],
    4: ["Embeddings", "Vector Search", "Semantic Similarity", "RAG"],
    5: ["KV Cache", "GPU Memory", "Inference", "Throughput"],
    6: ["Continuous Batching", "vLLM", "GPU Serving", "Throughput"],
    7: ["Model Selection", "Benchmarks", "Cost", "Architecture"],
    8: ["Context Engineering", "Prompting", "Context Window", "RAG"],
    9: ["Chain of Thought", "Tree of Thought", "Reasoning", "Test-Time Compute"],
    10: ["Structured Output", "JSON Schema", "Function Calling", "Validation"],
    11: ["RAG", "Retrieval Pipeline", "Vector DB", "Chunking"],
    12: ["Chunking", "RAG", "Document Processing", "Retrieval"],
    13: ["Hybrid Search", "BM25", "Reranking", "Retrieval"],
    14: ["Contextual Retrieval", "ColBERT", "Late Interaction", "Reranking"],
    15: ["GraphRAG", "Knowledge Graph", "Retrieval", "Entity Extraction"],
    16: ["Agentic RAG", "AI Agents", "Retrieval", "Query Planning"],
    17: ["AI Agents", "Control Loop", "Tool Use", "Agent Architecture"],
    18: ["ReAct", "Reasoning Loops", "AI Agents", "Tool Use"],
    19: ["MCP", "Tool Design", "AI Agents", "Interfaces"],
    20: ["Multi-Agent", "Orchestration", "LangGraph", "AI Agents"],
    21: ["Planning", "Task Decomposition", "DAG", "AI Agents"],
    22: ["Agent Memory", "Episodic Memory", "Semantic Memory", "State"],
    23: ["Error Handling", "Retries", "Resilience", "AI Agents"],
    24: ["Human in the Loop", "Approval Gates", "Trust Boundaries", "Safety"],
    25: ["Semantic Caching", "State Management", "Cost Optimization", "Latency"],
    26: ["Evaluation", "LLM as Judge", "Golden Set", "Testing"],
    27: ["Observability", "Tracing", "Metrics", "Monitoring"],
    28: ["Guardrails", "Prompt Injection", "AI Security", "Defense"],
    29: ["Multi-Tenancy", "Isolation", "Compliance", "Enterprise AI"],
    30: ["Cost Engineering", "FinOps", "Token Economics", "Optimization"],
}
POST_TAGS = {
    1: ["Stateless LLM", "Agent Memory", "Architecture", "Context"],
    2: ["Buffer Memory", "Token Cost", "Agent Memory", "Scaling"],
    3: ["Sliding Window", "Agent Memory", "Context Window", "Trade-offs"],
    4: ["Summary Memory", "Context Drift", "Agent Memory", "Compression"],
    5: ["Summary Buffer", "Hybrid Memory", "Chatbots", "Agent Memory"],
    6: ["Token Counting", "Context Budget", "Agent Memory", "Cost"],
    7: ["Vector Memory", "Semantic Recall", "Embeddings", "Agent Memory"],
    8: ["Entity Memory", "Structured State", "Agent Memory", "Personalization"],
    9: ["Episodic Memory", "Timestamps", "Agent Memory", "Recall"],
    10: ["Semantic Memory", "Fact Store", "Agent Memory", "Deduplication"],
    11: ["Procedural Memory", "Skill Registry", "Agent Memory", "Reuse"],
    12: ["Self-Reflection", "Agent Memory", "Learning", "Feedback Loops"],
    13: ["Memory Routing", "Agent Memory", "Write Policy", "Architecture"],
    14: ["Forgetting", "Retention Policy", "Agent Memory", "Privacy"],
    15: ["Memory Poisoning", "AI Security", "Agent Memory", "Attack Surface"],
    16: ["System Prompt", "Prompt Design", "Refactoring", "Context"],
    17: ["Debugging", "AI Agents", "Step Count", "Tool Use"],
    18: ["Retrieval Quality", "Data Quality", "RAG", "Chunking"],
    19: ["Evaluation", "Regression Testing", "LLMOps", "Golden Set"],
    20: ["Latency Budget", "Performance", "TTFT", "Streaming"],
    21: ["Tool Schemas", "Token Cost", "AI Agents", "Function Calling"],
    22: ["Streaming", "SSE", "UX", "Architecture"],
    23: ["Fallback Chains", "Resilience", "Rate Limits", "Reliability"],
    24: ["Prompt Caching", "Cost Optimization", "TTFT", "Inference"],
    25: ["Small Language Models", "Edge AI", "Cost", "Benchmarks"],
    26: ["Fine-Tuning", "RAG", "Prompting", "Decision Framework"],
    27: ["Evaluation", "PRD", "Product", "LLMOps"],
    28: ["Sandboxing", "AI Security", "Capabilities", "Permissions"],
    29: ["Anti-Patterns", "Architecture", "Production AI", "Lessons"],
    30: ["Checklist", "Production Readiness", "Shipping", "Architecture"],
}

SERIES = {
    "ai-systems": {
        "name": "AI Systems Track",
        "slug": "ai-systems-track",
        "blurb": "A 30-part deep dive into how production AI systems actually behave.",
        "colors": ("#0B1F3A", "#123A63", "#4F8FD6"),  # bg1, bg2, accent
        "start": datetime.date(2026, 6, 1),
    },
    "agent-memory": {
        "name": "Agent Memory Lineage",
        "slug": "agent-memory-lineage",
        "blurb": "The full lineage of agent memory, in the order the techniques were invented.",
        "colors": ("#241A3F", "#3A2A63", "#A78BFA"),
        "start": datetime.date(2026, 7, 1),
    },
    "production-reality": {
        "name": "Production Reality",
        "slug": "production-reality",
        "blurb": "Field notes on what breaks when AI features meet real traffic.",
        "colors": ("#2E1F10", "#4A331B", "#D4A373"),
        "start": datetime.date(2026, 7, 16),
    },
    "shipping-the-ai-product": {
        "name": "Shipping the AI Product",
        "slug": "shipping-the-ai-product",
        "blurb": "The API and infrastructure layer that sits between a model and a product.",
        "colors": ("#0B2A2E", "#124048", "#4FC3D9"),
        "start": datetime.date(2026, 7, 31),
    },
    "deep-dives": {
        "name": "Deep Dives",
        "slug": "deep-dives",
        "blurb": "Standalone deep dives into single techniques, start to finish.",
        "colors": ("#2B1618", "#48242A", "#E08C7D"),
        "start": datetime.date(2026, 8, 1),
    },
}

# --- Shipping the AI Product (Day31-36, part 1-6 of a planned 30) -------------
SHIPPING_CATEGORY = {
    31: "Backend", 32: "Backend", 33: "Backend",
    34: "Backend", 35: "Infrastructure", 36: "Retrieval",
}
SHIPPING_TAGS = {
    31: ["FastAPI", "Async", "Concurrency", "Event Loop"],
    32: ["SSE", "WebSockets", "Streaming", "API Design"],
    33: ["Rate Limiting", "Token Budget", "API Design", "Cost Control"],
    34: ["Idempotency", "Retries", "API Design", "Reliability"],
    35: ["Backpressure", "Queues", "Load Shedding", "Scaling"],
    36: ["pgvector", "PostgreSQL", "Vector Database", "Retrieval"],
}

# --- Standalone deep dives, keyed by source filename stem --------------------
DEEPDIVE_META = {
    "Agentic_Memory_Mem0": ("Agent Memory", ["Agent Memory", "Mem0", "Compression", "State"]),
    "Ensemble_Methods": ("AI Engineering", ["Ensembles", "Reliability", "Voting", "High Stakes"]),
    "Knowledge_Distillation": ("Model Training", ["Knowledge Distillation", "Teacher-Student", "SLM", "Training"]),
    "LLM_Infrastructure_Hardware_Landscape": ("Infrastructure", ["GPU", "Hardware", "Infrastructure", "Multi-Vendor"]),
    "LLM_Security_Beyond_Injection": ("AI Security", ["AI Security", "Threat Model", "Prompt Injection", "Access Control"]),
    "LoRA_QLoRA_PEFT": ("Model Training", ["LoRA", "QLoRA", "PEFT", "Fine-Tuning"]),
    "Multimodal_RAG": ("Retrieval", ["Multimodal RAG", "Document AI", "Vision", "Retrieval"]),
    "Quantization_Deep_Dive": ("Inference", ["Quantization", "INT8", "GGUF", "Inference"]),
    "RLHF_vs_DPO_Alignment": ("Model Training", ["RLHF", "DPO", "Alignment", "Preference Tuning"]),
    "Reranking_Strategies": ("Retrieval", ["Reranking", "Cross-Encoder", "Relevance", "Retrieval"]),
    "Speculative_Decoding": ("Inference", ["Speculative Decoding", "Memory Bandwidth", "Latency", "Inference"]),
}

# ---------------------------------------------------------------- helpers
def slugify(text):
    text = text.lower()
    text = text.replace("&", " and ")
    text = re.sub(r"[\u2018\u2019\u201c\u201d']", "", text)
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return re.sub(r"-{2,}", "-", text).strip("-")


def hashtags_to_tags(line):
    """'#AIEngineering #LLMOps' -> ['AI Engineering', 'LLMOps']"""
    out = []
    fixed = {
        "AIEngineering": "AI Engineering", "LLMOps": "LLMOps", "AgenticAI": "Agentic AI",
        "SystemDesign": "System Design", "SoftwareArchitecture": "Software Architecture",
        "MLInfrastructure": "ML Infrastructure", "Inference": "Inference",
        "MachineLearning": "Machine Learning", "AIAgents": "AI Agents",
        "RAG": "RAG", "AI": "AI", "LLM": "LLM",
    }
    for raw in re.findall(r"#(\w+)", line or ""):
        if raw in fixed:
            out.append(fixed[raw])
        else:
            out.append(re.sub(r"(?<=[a-z])(?=[A-Z])", " ", raw))
    return out


def strip_md(text):
    """Flatten markdown inline formatting to plain prose."""
    text = re.sub(r"`([^`]*)`", r"\1", text)
    text = re.sub(r"\*\*([^*]*)\*\*", r"\1", text)
    text = re.sub(r"\*([^*]*)\*", r"\1", text)
    text = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", text)
    return re.sub(r"\s+", " ", text).strip()


def make_excerpt(body, limit=190):
    """Opening prose, trimmed at a sentence boundary.

    Short lead-ins ("Something worth getting clear on early.") make a weak card,
    so paragraphs are accumulated until there is enough substance to cut from.
    """
    # Drop fenced blocks first - one containing a blank line would otherwise be
    # split into "paragraphs" and leak code and stray backticks into the excerpt.
    prose = re.sub(r"```.*?```", "", body, flags=re.S)

    collected = ""
    for para in prose.split("\n\n"):
        p = para.strip()
        if not p or p.startswith(("#", "```", "|", ">", "-", "*", "1.", "---")):
            continue
        collected = (collected + " " + strip_md(p)).strip()
        if len(collected) >= 130:
            break

    if not collected:
        return ""
    if len(collected) <= limit:
        return collected

    cut = collected[:limit]
    for sep in (". ", "? ", "! "):
        i = cut.rfind(sep)
        if i > 95:
            return cut[: i + 1].strip()
    return cut[: cut.rfind(" ")].rstrip(",;:") + "..."


def read_time(markdown):
    """Words at 220 wpm, plus 25s per diagram/code block."""
    words = len(re.findall(r"\w+", re.sub(r"```.*?```", "", markdown, flags=re.S)))
    blocks = markdown.count("```") // 2
    return max(3, round(words / 220 + blocks * 25 / 60))


def esc(s):
    """XML-escape for both text nodes and double-quoted attribute values."""
    return (
        s.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
        .replace("'", "&apos;")
    )


# typos present in the source markdown, corrected on the published copy only
SOURCE_FIXES = [("breaks a assumption", "breaks an assumption")]


def apply_fixes(text):
    for wrong, right in SOURCE_FIXES:
        text = text.replace(wrong, right)
    return text


# ---------------------------------------------------------------- SVG cover
def make_cover(path, series_key, kicker, part, total, title):
    """kicker is the big faint label ("DAY 07" / "PART 03"); None omits it."""
    s = SERIES[series_key]
    bg1, bg2, accent = s["colors"]
    plain = title.replace("\u2014", "-").replace("\u2019", "'")
    # Standalone covers have no kicker line, so they get room for a fourth line
    max_lines = 3 if kicker else 4
    wrapped = textwrap.wrap(plain, width=28)
    lines = wrapped[:max_lines]
    if len(wrapped) > max_lines:
        lines[-1] = lines[-1].rstrip(",.;: ") + "..."

    y = 336 if kicker else 250
    title_svg = ""
    for ln in lines:
        title_svg += (
            f'<text x="90" y="{y}" font-family="Georgia,serif" font-size="58" '
            f'fill="#FFFFFF" font-weight="400">{esc(ln)}</text>\n    '
        )
        y += 74

    kicker_svg = ""
    if kicker:
        kicker_svg = (
            f'<text x="90" y="234" font-family="ui-monospace,SFMono-Regular,Menlo,monospace" '
            f'font-size="112" fill="#FFFFFF" fill-opacity="0.13" font-weight="700">{esc(kicker)}</text>'
        )

    counter_svg = ""
    if part and total:
        counter_svg = (
            f'<text x="1110" y="616" text-anchor="end" '
            f'font-family="ui-monospace,SFMono-Regular,Menlo,monospace" font-size="20" '
            f'fill="{accent}" letter-spacing="3">{part:02d} / {total}</text>'
        )

    uid = f"{series_key}{part or 0}{abs(hash(title)) % 9973}"
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675" role="img" aria-label="{esc(plain)}">
  <defs>
    <linearGradient id="bg{uid}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="{bg1}"/>
      <stop offset="100%" stop-color="{bg2}"/>
    </linearGradient>
    <radialGradient id="glow{uid}" cx="0.82" cy="0.18" r="0.55">
      <stop offset="0%" stop-color="{accent}" stop-opacity="0.38"/>
      <stop offset="100%" stop-color="{accent}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid{uid}" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" fill="none" stroke="#FFFFFF" stroke-opacity="0.05" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="1200" height="675" fill="url(#bg{uid})"/>
  <rect width="1200" height="675" fill="url(#grid{uid})"/>
  <rect width="1200" height="675" fill="url(#glow{uid})"/>
  <rect x="0" y="0" width="8" height="675" fill="{accent}"/>

  <text x="90" y="110" font-family="ui-monospace,SFMono-Regular,Menlo,monospace" font-size="21"
        fill="{accent}" letter-spacing="7">{esc(s["name"].upper())}</text>

  {kicker_svg}

  <rect x="90" y="{270 if kicker else 184}" width="76" height="3" fill="{accent}"/>

  {title_svg}
  <line x1="90" y1="572" x2="1110" y2="572" stroke="#FFFFFF" stroke-opacity="0.14" stroke-width="1"/>
  <text x="90" y="616" font-family="ui-monospace,SFMono-Regular,Menlo,monospace" font-size="20"
        fill="#FFFFFF" fill-opacity="0.62" letter-spacing="3">ABHISHEK MANE</text>
  {counter_svg}
</svg>
"""
    io.open(path, "w", encoding="utf-8").write(svg)


# ---------------------------------------------------------------- parsers
def parse_blog(path, curated_tags):
    raw = io.open(path, encoding="utf-8").read().replace("\r\n", "\n")

    title = re.search(r"^# (.+)$", raw, re.M).group(1).strip()

    tag_line = re.search(r"^\*\*Tags:\*\*(.+)$", raw, re.M)
    tags = curated_tags + [
        t for t in hashtags_to_tags(tag_line.group(1) if tag_line else "")
        if t not in curated_tags
    ]

    body = raw
    body = re.sub(r"^# .+$", "", body, count=1, flags=re.M)              # H1 (page renders it)
    body = re.sub(r"^\*Blog \d+ of 30.*$", "", body, count=1, flags=re.M)  # series subtitle
    body = re.sub(r"^\*\*Tags:\*\*.*$", "", body, flags=re.M)            # trailing hashtags
    body = body.strip().lstrip("-").strip()
    body = re.sub(r"\n{3,}", "\n\n", body)
    # drop a trailing horizontal rule left behind by the tag strip
    body = re.sub(r"\n+---\s*$", "", body).strip()

    return title, body, tags


def parse_post(path, curated_tags):
    raw = io.open(path, encoding="utf-8").read().replace("\r\n", "\n")

    h1 = re.search(r"^# (.+)$", raw, re.M).group(1).strip()
    title = re.sub(r"^Day \d+\s*[\u2014\-]\s*", "", h1).strip()

    # body = everything between the POST heading and the LINKEDIN TEXT heading
    body = re.split(r"^## .*LINKEDIN TEXT.*$", raw, flags=re.M)[0]
    body = re.split(r"^## .*POST \(copy-paste ready\).*$", body, flags=re.M)[1]
    body = body.strip().strip("-").strip()

    # diagrams: '### Diagram N — Caption' + fenced mermaid
    diag_section = re.split(r"^## .*ATTACHMENT DIAGRAMS.*$", raw, flags=re.M)
    diagrams = []
    if len(diag_section) > 1:
        chunk = re.split(r"^## .*HASHTAGS.*$", diag_section[1], flags=re.M)[0]
        for m in re.finditer(
            r"^### Diagram \d+\s*[\u2014\-]\s*(.+?)\n+```mermaid\n(.*?)\n```",
            chunk, re.M | re.S,
        ):
            diagrams.append((m.group(1).strip(), m.group(2).strip()))

    content = body
    if diagrams:
        content += "\n\n---\n\n## Diagrams\n"
        for caption, chart in diagrams:
            content += f"\n### {caption}\n\n```mermaid\n{chart}\n```\n"

    hash_section = re.split(r"^## .*HASHTAGS.*$", raw, flags=re.M)
    hline = ""
    if len(hash_section) > 1:
        hline = re.split(r"^## ", hash_section[1], flags=re.M)[0]
    tags = curated_tags + [
        t for t in hashtags_to_tags(hline) if t not in curated_tags
    ]

    return title, content.strip(), tags


# ---------------------------------------------------------------- build
def build():
    os.makedirs(SVG_OUT, exist_ok=True)

    existing_slugs = set()
    for f in glob.glob(os.path.join(JSON_OUT, "*.json")):
        existing_slugs.add(json.load(io.open(f, encoding="utf-8"))["slug"])

    # Each job: (series_key, parser, curated_tags, category, kicker, part,
    #            total, date_offset, blog_id, file_stem, source_path)
    jobs = []

    for f in sorted(glob.glob(os.path.join(BLOG_SRC, "*.md"))):
        day = int(re.search(r"Day(\d+)", os.path.basename(f)).group(1))
        jobs.append(("ai-systems", parse_blog, AI_SYSTEMS_TAGS[day], AI_SYSTEMS_CATEGORY[day],
                     f"DAY {day:02d}", day, 30, day - 1, 100 + day, f"{day:02d}", f))

    for f in sorted(glob.glob(os.path.join(POST_SRC, "*.md"))):
        day = int(re.search(r"Day(\d+)", os.path.basename(f)).group(1))
        key = "agent-memory" if day <= 15 else "production-reality"
        offset = day - 1 if day <= 15 else day - 16
        jobs.append((key, parse_post, POST_TAGS[day], POST_CATEGORY[day],
                     f"DAY {day:02d}", day, 30, offset, 200 + day, f"{day:02d}", f))

    # Series 2: files are Day31-36 but the series numbers them Part 1-6 of 30
    for f in sorted(glob.glob(os.path.join(SERIES2_SRC, "*.md"))):
        day = int(re.search(r"Day(\d+)", os.path.basename(f)).group(1))
        part = day - 30
        jobs.append(("shipping-the-ai-product", parse_post, SHIPPING_TAGS[day], SHIPPING_CATEGORY[day],
                     f"PART {part:02d}", part, 30, part - 1, 300 + part, f"{part:02d}", f))

    # Standalone deep dives: no day number, no part numbering
    for i, f in enumerate(sorted(glob.glob(os.path.join(STANDALONE_SRC, "*.md"))), start=1):
        stem = os.path.splitext(os.path.basename(f))[0]
        category, tags = DEEPDIVE_META[stem]
        jobs.append(("deep-dives", parse_post, tags, category,
                     None, None, None, i - 1, 400 + i, f"{i:02d}", f))

    written = []
    for (series_key, parser, curated_tags, category, kicker,
         part, total, offset, blog_id, stem, path) in jobs:
        s = SERIES[series_key]
        title, content, tags = parser(path, curated_tags)
        content = apply_fixes(content)

        slug = slugify(title)
        if slug in existing_slugs:
            slug = f"{slug}-{s['slug']}"
        existing_slugs.add(slug)

        pub = s["start"] + datetime.timedelta(days=offset)

        cover_name = f"{s['slug']}-{stem}.svg"
        make_cover(os.path.join(SVG_OUT, cover_name), series_key, kicker, part, total, title)

        doc = {
            "id": str(blog_id),
            "slug": slug,
            "title": title,
            "excerpt": make_excerpt(content),
            "content": content,
            "featuredImage": f"/blog/series/{cover_name}",
            "author": AUTHOR,
            "publishedAt": pub.isoformat(),
            "readTime": read_time(content),
            "category": category,
            "tags": tags,
            "featured": False,
            "series": s["name"],
            "seriesSlug": s["slug"],
        }
        # Standalone deep dives carry no part numbering
        if part and total:
            doc["seriesPart"] = part
            doc["seriesTotal"] = total

        out_dir = os.path.join(JSON_OUT, s["slug"])
        os.makedirs(out_dir, exist_ok=True)
        out_file = os.path.join(out_dir, f"{stem}_{slugify(title)[:48]}.json")
        io.open(out_file, "w", encoding="utf-8").write(
            json.dumps(doc, indent=4, ensure_ascii=False) + "\n"
        )
        written.append((s["name"], part, doc["readTime"], category, slug, doc["excerpt"]))

    for name, part, rt, cat, slug, exc in written:
        print(f"{name[:23].ljust(24)} {str(part or '-').rjust(2)}  {str(rt).rjust(2)}m  "
              f"{cat[:15].ljust(16)} {slug[:50].ljust(52)} {exc[:52]}")
    print(f"\n{len(written)} JSON files + {len(written)} SVG covers written.")


if __name__ == "__main__":
    build()
