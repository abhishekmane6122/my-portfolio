import type { Portfolio } from "@/types/schema";

// Dummy data for demo preview
export const dummyPortfolio: Partial<Portfolio> = {
    fullName: "Abhishek Mane",
    title: "Forward-Deployed AI Engineer | Applied AI & Enterprise LLM Platforms",
    tagline:
        "Forward-Deployed AI Engineer with 2+ years of production experience architecting, evaluating, and operating enterprise LLM and RAG systems embedded on-site with large listed conglomerates (Adani Group).",
    bio: "Forward-Deployed AI Engineer with 2+ years of production experience architecting, evaluating, and operating enterprise LLM and RAG systems embedded on-site with large listed conglomerates (Adani Group). Proven track record delivering 10+ production microservices under the unified central enterprise gateway, with regulatory RAG pipelines operating autonomously in production for 12+ months. Specialized in multi-backend LLM failover, FinOps token optimization, custom PostgreSQL observability, deterministic verification guardrails, and automated daily C-suite reporting.",
    skills: [
        "Multi-Agent Systems & LangGraph",
        "LangChain & Agno Orchestration",
        "Frontier Models (OpenAI, Claude, DeepSeek R1, Gemini, Llama-4, Phi-3, Groq LPU)",
        "Advanced RAG & Hybrid Search (BM25 + Dense Vectors)",
        "Cross-Encoder Reranking (Cohere Rerank, FlashRank, BGE)",
        "Vector Databases (pgvector on PostgreSQL, FAISS, ChromaDB, Weaviate)",
        "LLM-as-Judge & AI Evals (RAGAS, DeepEval, G-Eval)",
        "Custom PostgreSQL AI Observability & Tracing",
        "Deterministic Guardrails & NeMo Guardrails",
        "FinOps Token Economics & Prompt Caching",
        "FastAPI & Pydantic v2 Microservices",
        "Azure Cloud (OpenAI, AI Foundry, AD SSO / OAuth2, Key Vault, VM)",
        "Databricks & Data Pipelines",
        "Docker Compose & Nginx Reverse Proxy",
        "React, TypeScript & Vite",
        "Playwright Automation & Ingestion"
    ],
    socialLinks: {
        github: "https://github.com/abhishekmane6122",
        linkedin: "https://www.linkedin.com/in/abhishek-mane-aiml",
        topmate: "https://topmate.io/abhishekmane/",
        email: "abhishek.mane.work@gmail.com",
        resume: `${import.meta.env.BASE_URL}resume/Abhishek_Mane_2yrs.pdf`,
    },
    profileImage: "/Abhishek_Profile.png",
    experience: [
        {
            id: "1",
            company: "CognitBotz Solutions | Client: Adani Green Energy & Adani Group",
            position: "AI Engineer (Forward-Deployed)",
            duration: "Sep 2025 – Present | Ahmedabad, Gujarat",
            description:
                "Embedded on-site with Adani Group architecting, evaluating, and operating enterprise LLM platforms across 10+ production microservices.\n\n▸ Platform 1: Aegis — Enterprise Compliance & Legal Intelligence Suite (6 Apps): Architected 3 production RAG pipelines (SEBI, RBI, BSE) ingesting daily gazettes; built dynamic chunkers, PyMuPDF OCR fallback, and multi-backend LLM orchestration (Azure OpenAI GPT-4.1-mini, Azure AI Llama-4, self-hosted Phi-3 on Tesla T4 GPU) cutting regulatory noise by 71% and saving 250+ FTE hours/quarter. Implemented FinOps token routing for 50+ group entities (slashing cloud LLM expenses 60%+), deterministic regex ID normalization (100% rank-1 circular retrieval), Databricks-backed Insider Trading surveillance with HITL evidence drawer, and automated LLM-as-Judge evaluation securing Group ARB clearance.\n\n▸ Platform 2: Equity Dashboard — Capital Markets Intelligence Suite: Multi-tenant analytics portal tracking 3.9M+ investor records; engineered pre-LLM deterministic entity resolver (p50 ≈ 3ms latency) with automated daily CEO PDF briefings; sell-side broker research RAG via Azure AI Search (Hybrid BM25 + Cohere Embed v4.0 + Semantic Reranker) with 8-point numerical verification; conversational equity RAG over BSE/NSE market and valuation data evaluated on a 39-question golden benchmark.\n\n▸ Platform 3: Debt Markets & Central Enterprise Infrastructure: Async FastAPI backends & PostgreSQL schemas for Mutual Fund debt exposure mapping and NPS tracking; configured central Nginx reverse proxy with SSL termination, HTTP/2, HSTS, and SSE streaming across 10 microservices; built custom in-house AI observability platform tracking distributed traces and token metrics natively in Azure PostgreSQL; integrated Azure AD SSO cutting latency from 8s to 500ms.",
        },
        {
            id: "2",
            company: "CognitBotz Solutions",
            position: "AI Engineer",
            duration: "Nov 2024 – Sep 2025 | Hyderabad, Telangana",
            description:
                "▸ Production AI Platforms (DocCapture AI & Intelligent AI): Architected and deployed 2 live commercial platforms — DocCapture AI (multi-modal document intelligence and automated table/entity capture) and Intelligent AI (enterprise low-code platform for rapid agentic workflow orchestration).\n▸ LLM Engineering & Agent Deployment: Developed and fine-tuned LLMs using LangChain and Agno with few-shot prompting; built async FastAPI microservices supporting high-throughput multi-modal web agents.\n▸ AI Guardrails & Responsible AI: Enforced strict Pydantic output schemas, prompt-injection sanitization, confidence gating, and data-privacy safeguards.",
        },
        {
            id: "3",
            company: "Infosys Springboard",
            position: "AI Developer Intern",
            duration: "Sep 2024 – Dec 2024 | Remote",
            description:
                "▸ Enterprise NLP Workflows: Built NLP and text classification pipelines for automated document routing under Infosys's enterprise track.",
        },
    ],
    education: [
        {
            id: "1",
            institution: "Terna Engineering College, Osmanabad (Dharashiv), Maharashtra",
            degree: "Bachelor of Technology in Artificial Intelligence and Data Science",
            duration: "2021 – 2025",
            description: "First Class with Distinction | Focus on Applied AI, LLMs, Deep Learning, and Distributed Systems.",
        },
    ],
    positionsOfResponsibility: [
        "Speaker at local AI workshops & Community Mentor.",
        "Led teams for Smart India Hackathon Internal Selections.",
        "First Place, Avishkar Hackathon (University Level).",
        "Active Member, National Service Scheme (NSS).",
        "Collaborated on leading recitations and grading for AI coursework."
    ],
    funFacts: [
        "Always curious about new tech, digital art, and global cuisine.",
        "Motto: 'Make AI understandable, ethical, and impactful!'",
        "Open to AI collaborations, insightful discussions, and conferences.",
        "I love sharing about Open Source, Ethical AI, and AI4Good."
    ],
    projects: [
        {
            id: "bse-rag-project",
            slug: "bse-rag-project",
            title: "BSE RAG (AI Powered Analyzer)",
            description:
                "An intelligent RAG system built for BSE (Bombay Stock Exchange) to automate regulatory document analysis and reporting using Python and ChromaDB.",
            tags: ["Python", "RAG", "ChromaDB", "FastAPI"],
            live: "#",
            github: "https://github.com/abhishekmane-ai",
            featured: true,
            mermaidDiagram: `graph TD
    A[Web Interface] --> B[Playwright Engine]
    B --> C[BSE Website Interaction]
    C --> D[PDF Collection]
    D --> E[Storage Layer]
    E --> F[Text Extraction]
    F --> G[Digital]
    F --> H[OCR Scanned]
    G --> I[Text Processing]
    H --> I
    I --> J[Chunking Engine]
    J --> K[Embedding Model]
    K --> L[Vector Database]
    L --> M[RAG Retrieval]
    M --> N[Large Language Model]
    N --> O[Subject Analysis]
    N --> P[Summary Analysis]
    O --> Q[Report Generation]
    P --> Q
    Q --> R[Excel Output]
    Q --> S[Database Storage]
    Q --> T[Email System]`
        },
        {
            id: "aegis",
            slug: "aegis-platform",
            title: "AEGIS Platform",
            description:
                "A multi-agent autonomous system designed for enterprise workflow automation, utilizing advanced LLM orchestration and real-time monitoring.",
            tags: ["Multi-Agent Systems", "LLMs", "Azure", "React"],
            live: "#",
            github: "https://github.com/abhishekmane-ai",
            featured: true,
            mermaidDiagram: `graph TD
    User(("User")) --> Interface["Web Dashboard"]
    Interface --> Auth["Azure AD SSO"]
    Auth --> APIGateway["FastAPI Backend"]

    subgraph "Multi-Agent System"
        APIGateway --> Agent1["Regulatory Intelligence Agent"]
        APIGateway --> Agent2["Directors Disclosure Agent"]
        APIGateway --> Agent3["Insider Trading Monitor"]
        APIGateway --> Agent4["Meeting Minutes Generator"]
    end

    subgraph "Data Layer"
        Agent1 --> BSE["BSE / SEBI / RBI APIs"]
        Agent2 --> SQLite[("Director DB")]
        Agent3 --> Shareholding[("Shareholding DB")]
        Agent4 --> WordEngine["python-docx"]
    end

    Agent1 --> RAG["RAG Pipeline"]
    RAG --> LLM["Groq LLM"]`
        },
        {
            id: "sentinel-model-governance",
            slug: "ai-model-governance-platform",
            title: "Ward — Zero-Trust AI Model Security Gateway",
            description:
                "Zero-trust on-ramp for open-source AI weights in regulated enterprises: static opcode disassembly for PyTorch/Pickle malware, license verification, hardware sizing, and CycloneDX AIBOM generation.",
            tags: ["AI Security", "Python", "FastAPI", "React", "Pickle Security", "EU AI Act"],
            live: "#",
            github: "https://github.com/abhishekmane-ai",
            featured: true,
            mermaidDiagram: `graph TD
    A[Model Weights Archive] --> B[Magic-Byte Format Sniffer]
    B --> C[Streaming SHA-256 Hashing]
    C --> D[Static Opcode Disassembler]
    D --> E{Malicious Gadgets Detected?}
    E -->|Yes| F[Block & Quarantine]
    E -->|No| G[License & Jaccard Dedupe]
    G --> H[Hardware Sizing & AIBOM]
    H --> I[3-Stage Human Consensus Gate]
    I --> J[(Air-Gapped Registry)]`
        },
        {
            id: "naipunya-insurance-voice-ai",
            slug: "naipunya-insurance-voice-ai",
            title: "Naipunya — Real-Time Voice AI Advisory System",
            description:
                "Production-grade, voice-first multi-agent AI for Indian insurance advisory, featuring speculative parallel execution, dynamic Google AI search RAG, and sub-second dual cloud/edge inference.",
            tags: ["Voice AI & Speech", "FastAPI", "Groq LPU", "Ollama", "Faster-Whisper", "Web Audio"],
            live: "#",
            github: "https://github.com/abhishekmane-ai",
            featured: true,
            mermaidDiagram: `graph TD
    UserVoice((User Voice)) --> VAD[Client RMS Silence Detector]
    VAD --> STT[Whisper STT]
    STT --> Orch[Orchestrator Agent]
    Orch --> Reasoning[Dual LLM Engine]
    Orch --> WebRAG[Google AI Mode Search]
    Reasoning --> Tools[Deterministic Math Tools]
    Tools --> Synth[Synthesizer]
    WebRAG --> Synth
    Synth --> TTS[Kokoro / Edge-TTS]
    TTS --> VoiceOut((Audio Playback))`
        },
        {
            id: "perkai-benefits-discovery-engine",
            slug: "perkai-benefits-discovery-engine",
            title: "PerkAI — Autonomous Capital Discovery & Stacking Engine",
            description:
                "Autonomous multi-agent platform discovering $180k–$340k in startup credits and non-dilutive government subsidies in <18s via an algorithmic Grounding Guard and combinatorial stacking optimizer.",
            tags: ["Agentic Systems", "FastAPI", "React", "PostgreSQL", "NVIDIA NIM", "SSE"],
            live: "#",
            github: "https://github.com/abhishekmane-ai",
            featured: true,
            mermaidDiagram: `graph TD
    Domain[Company Domain] --> Crawler[Intake & SPA Crawler]
    Crawler --> Planner[Query Planner Agent]
    Planner --> Scraper[Source Snapshot Store]
    Scraper --> Extractor[Structured Extraction]
    Extractor --> Guard[Algorithmic Grounding Guard]
    Guard --> Matcher[Hybrid Deterministic/Vector Matcher]
    Matcher --> Stacker[Combinatorial Stacking Optimizer]
    Stacker --> Stream[Real-time SSE Stream]`
        },
        {
            id: "text-insights",
            slug: "text-insights-api",
            title: "Text Insights API",
            description:
                "Created robust, plug-and-play APIs for NLP workflows and business analytics using FastAPI.",
            tags: ["FastAPI", "NLP", "API", "Business Analytics"],
            live: "#",
            github: "https://github.com/abhishekmane-ai",
            image: "",
            featured: true,
        },
        {
            id: "wine-quality",
            slug: "wine-quality-prediction",
            title: "MLflow Wine Quality Prediction",
            description:
                "Regression model with ElasticNet and complete experiment tracking using MLflow.",
            tags: ["MLflow", "Scikit-learn", "Python"],
            live: "#",
            github: "https://github.com/abhishekmane-ai/wine-quality-prediction",
            image: "",
            featured: true,
        },
    ],
    blogs: [
        {
            id: "1",
            slug: "building-rag-system-python-chromadb",
            title: "Building a Production-Ready RAG System with Python and ChromaDB",
            description: "Learn how to build an intelligent document processing system using the latest RAG techniques.",
            link: "/blog/building-rag-system-python-chromadb",
            date: "Dec 20, 2024",
        },
        {
            id: "2",
            slug: "fastapi-production-best-practices",
            title: "FastAPI in Production: Best Practices for AI Applications",
            description: "A comprehensive guide to deploying and scaling FastAPI applications in production environments.",
            link: "/blog/fastapi-production-best-practices",
            date: "Dec 15, 2024",
        }
    ],
    linkedinPosts: [
        {
            id: "1",
            title: "From Prototype to Production LLM Deployment: Prompting, RAG, and Fine-Tuning 🚀",
            content: `Large Language Models like GPT-4 are powerful, but they face 3 major gaps:
• Limited domain knowledge
• Hallucinations from next-token prediction
• Difficulty adapting to new terms or data

That's where the developer toolkit comes in:
1️⃣ Prompt Engineering
• Guide the model to think better.
• Chain of Thought: step-by-step reasoning
• Few-Shot: show examples to set patterns
• Self-Consistency: aggregate multiple outputs for reliability

2️⃣ Retrieval-Augmented Generation (RAG)
• Ground the model in external data.
• Reduces hallucinations
• Adds private, specific, or fresh data
• Improves transparency with source citations

3️⃣ Fine-Tuning
• Teach the model new tasks or formats.
• SQL query generation
• Structured JSON responses
• Domain-specific expertise

Taking LLMs from prototype to production isn't about a single breakthrough — it's a journey of incremental gains in reliability (99%, 99.9%, 99.99%). Achieving this isn't about one magic technique, but combining prompting, RAG, and fine-tuning into tailored workflows.

AI's future impact won't come from generic models alone — it will come from teams who integrate these techniques into industry-specific solutions.`,
            date: "January 2026",
            link: "https://www.linkedin.com/in/abhishek-mane-aiml/recent-activity/all/",
            image: "/linkedin-posts/llm-deployment.png",
            tags: ["GenAI", "LLMs", "PromptEngineering", "RAG", "MLOps"]
        },
        {
            id: "2",
            title: "Guardrails in RAG Systems: Why They Matter 🚦",
            content: `Retrieval-Augmented Generation (RAG) is powerful — but without guardrails, it can easily drift into irrelevant, unstructured, or even misleading outputs.

Here are 3 core types of guardrails every RAG system should consider:
1️⃣ Context Relevance Guardrails
• Pass only highly relevant documents to the LLM
• Use semantic similarity thresholds & rerankers (Cohere, BM25+embeddings)
• Filter Top-K chunks based on score

2️⃣ Prompt Guardrails
• Guide the model to stay grounded in context.
• Add system prompts ("Only answer using provided context…")
• Encourage step-by-step reasoning to keep answers grounded

3️⃣ Output Formatting & Constraints
• Keep responses structured and consistent.
• Define schemas (JSON, bullet points, structured sections)
• Validate with tools like Pydantic, LangChain output parsers, or regex validators.
• Even dedicated frameworks like Guardrails AI can help enforce rules.

👉 The result? More trustworthy, reliable, and production-ready applications.

💡 As RAG adoption accelerates, guardrails move from "optional" to "mandatory." They ensure not just accuracy, but also safety and usability.`,
            date: "January 2026",
            link: "https://www.linkedin.com/posts/abhishek-mane-aiml_genai-rag-llmops-activity-7375665135085936641-y0nu",
            image: "/linkedin-posts/rag-guardrails.png",
            tags: ["GenAI", "RAG", "LLMOps", "AI", "MachineLearning"]
        },
        {
            id: "3",
            title: "Beyond Prompting: Building the Context Stack 🧠",
            content: `The secret to production AI isn't better prompts — it's better context.

In this deep dive, I explore the 'Context Stack': the layered architecture that moves beyond simple RAG to provide LLMs with high-fidelity, situational intelligence.

Key layers:
1️⃣ Semantic Retrieval (Embeddings + Vector DB)
2️⃣ Structural Context (Graph Metadata)
3️⃣ Temporal Context (Recent interactions & State)
4️⃣ Domain Guardrails (Validation & Constraints)

Read the full breakdown on LinkedIn Pulse:`,
            date: "April 2025",
            link: "https://www.linkedin.com/pulse/beyond-prompting-building-context-stack-abhishek-mane-ny6if/",
            image: "/linkedin-posts/context-eng.png",
            tags: ["ContextEngineering", "RAG", "LLMOps", "GenAI"]
        },
        {
            id: "4",
            title: "Autonomous Control Loop: The Heartbeat of Agentic AI 🔄",
            content: `What makes an AI an 'Agent'? The Control Loop.

I breakdown the 'Sense-Think-Act' architecture that enables autonomous agents to handle complex, multi-step tasks without human intervention.

We cover:
• The Observer: How agents perceive environment state
• The Planner: Decomposing goals into executable steps
• The Actor: Tool use and external API interaction
• The Critic: Self-correction and feedback loops

Full article live now:`,
            date: "May 2025",
            link: "https://www.linkedin.com/pulse/autonomous-control-loop-heartbeat-agentic-ai-abhishek-mane-5mlyf/",
            image: "/linkedin-posts/auto-loop.png",
            tags: ["AgenticAI", "AIArchitecture", "AutonomousAgents", "GenAI"]
        }
    ]
};
