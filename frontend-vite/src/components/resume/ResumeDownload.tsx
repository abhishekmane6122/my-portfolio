import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Download, FileText, X, ExternalLink, Award, Briefcase, GraduationCap, Code2, Eye, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

interface ResumeDownloadProps {
    variant?: 'button' | 'card'
    showLabel?: boolean
}

export default function ResumeDownload({ variant = 'button', showLabel = true }: ResumeDownloadProps) {
    const [showModal, setShowModal] = useState(false)
    const [viewMode, setViewMode] = useState<'formatted' | 'pdf'>('formatted')

    const fileName = 'Abhishek_Mane_2yrs.pdf'
    const filePath = `${import.meta.env.BASE_URL}resume/${fileName}`

    const handleDownload = async () => {
        try {
            const res = await fetch(filePath)
            if (!res.ok) throw new Error('Failed to fetch resume file')
            const blob = await res.blob()
            const blobUrl = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = blobUrl
            link.download = fileName
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(blobUrl)
            toast.success('Resume downloaded successfully!', { icon: '📄', duration: 3000 })
        } catch {
            const link = document.createElement('a')
            link.href = filePath
            link.download = fileName
            link.target = '_blank'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            toast.success('Resume downloaded!', { icon: '📄', duration: 3000 })
        }
    }

    const ResumeModal = () => {
        const [mounted, setMounted] = useState(false)
        useEffect(() => { setMounted(true) }, [])

        if (!mounted) return null

        return createPortal(
            <AnimatePresence>
            {showModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/90 backdrop-blur-xl transition-all duration-300"
                    onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false) }}
                >
                    <motion.div
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "100%", opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="relative w-full sm:max-w-4xl h-[94vh] sm:h-[90vh] bg-white dark:bg-[#0f0f0f] rounded-t-[2.5rem] sm:rounded-3xl shadow-2xl border-t sm:border border-neutral-200 dark:border-white/10 overflow-hidden flex flex-col"
                    >
                        {/* Mobile Handle */}
                        <div className="sm:hidden w-12 h-1.5 bg-neutral-300 dark:bg-white/20 rounded-full mx-auto my-3 shrink-0" />

                        {/* Sticky Header */}
                        <div className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-8 py-4 sm:py-5 border-b border-neutral-200 dark:border-white/10 bg-white dark:bg-[#0f0f0f] sm:bg-white/95 sm:dark:bg-[#0f0f0f]/95 sm:backdrop-blur-md shrink-0">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="p-2 sm:p-2.5 rounded-xl bg-[#d4a373]/10 text-[#d4a373] shrink-0">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="font-bold text-sm sm:text-base text-neutral-900 dark:text-white truncate">
                                        Abhishek Mane — Resume
                                    </span>
                                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#d4a373] hidden sm:block">
                                        2+ Years • Forward-Deployed AI Engineer
                                    </span>
                                </div>
                            </div>

                            {/* View Switcher & Action Buttons */}
                            <div className="flex items-center gap-2 shrink-0">
                                <div className="hidden md:flex items-center p-1 rounded-xl bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 mr-1">
                                    <button
                                        onClick={() => setViewMode('formatted')}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                            viewMode === 'formatted'
                                                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                                                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                                        }`}
                                    >
                                        Formatted View
                                    </button>
                                    <button
                                        onClick={() => setViewMode('pdf')}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                                            viewMode === 'pdf'
                                                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                                                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                                        }`}
                                    >
                                        <Eye className="w-3.5 h-3.5" /> PDF Preview
                                    </button>
                                </div>

                                <button
                                    onClick={handleDownload}
                                    title={`Download ${fileName}`}
                                    className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-[#d4a373] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#c49363] transition-all shadow-lg shadow-[#d4a373]/20"
                                >
                                    <Download className="w-3.5 h-3.5" />
                                    <span>Download PDF</span>
                                </button>

                                <a
                                    href={filePath}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="Open PDF in new tab"
                                    className="hidden sm:flex items-center gap-2 p-2 sm:px-4 sm:py-2 rounded-xl bg-neutral-100 dark:bg-white/5 text-neutral-700 dark:text-neutral-300 text-xs hover:bg-neutral-200 dark:hover:bg-white/10 transition-all"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    <span className="font-mono uppercase tracking-widest">Open</span>
                                </a>

                                <button
                                    onClick={() => setShowModal(false)}
                                    className="flex items-center gap-1.5 p-2 px-2.5 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-colors group"
                                    aria-label="Close modal"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        {viewMode === 'pdf' ? (
                            <div className="flex-1 w-full h-full p-2 sm:p-4 bg-neutral-100 dark:bg-[#141414] flex flex-col overflow-hidden">
                                <iframe
                                    src={`${filePath}#toolbar=1`}
                                    className="w-full flex-1 rounded-2xl border border-neutral-300 dark:border-white/10 bg-white shadow-inner"
                                    title="Abhishek Mane Resume PDF"
                                />
                                <div className="mt-2.5 flex items-center justify-between px-2 text-xs text-neutral-600 dark:text-neutral-400">
                                    <span>File: <code className="font-mono text-[#d4a373]">{fileName}</code></span>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setViewMode('formatted')}
                                            className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white underline"
                                        >
                                            Switch to formatted view
                                        </button>
                                        <button
                                            onClick={handleDownload}
                                            className="inline-flex items-center gap-1.5 text-[#d4a373] hover:underline font-semibold"
                                        >
                                            <Download className="w-3.5 h-3.5" /> Download
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="overflow-y-auto flex-1 px-4 sm:px-8 md:px-12 py-6 sm:py-8 text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm leading-relaxed">

                                {/* HEADING */}
                                <div className="text-center mb-6 pb-5 border-b border-neutral-300 dark:border-white/15">
                                    <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white tracking-tight mb-1">
                                        Abhishek Mane
                                    </h1>
                                    <p className="text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                        B.Tech in Artificial Intelligence &amp; Data Science — Terna Engineering College, Dharashiv
                                    </p>
                                    <p className="text-xs text-neutral-600 dark:text-neutral-400 flex flex-wrap justify-center gap-x-2.5 gap-y-1 mt-2">
                                        <span>Ahmedabad, Gujarat, India</span>
                                        <span className="text-neutral-400">|</span>
                                        <a href="tel:+917020870063" className="text-[#d4a373] hover:underline">+91-7020870063</a>
                                        <span className="text-neutral-400">|</span>
                                        <a href="mailto:abhishek.mane.work@gmail.com" className="text-[#d4a373] hover:underline">abhishek.mane.work@gmail.com</a>
                                    </p>
                                    <p className="text-xs text-neutral-600 dark:text-neutral-400 flex flex-wrap justify-center gap-x-2.5 gap-y-1 mt-1">
                                        <a href="https://substack.com/@abhimane" target="_blank" rel="noopener noreferrer" className="text-[#d4a373] hover:underline font-medium">substack.com/@abhimane</a>
                                        <span className="text-neutral-400">|</span>
                                        <a href="https://github.com/abhishekmane6122" target="_blank" rel="noopener noreferrer" className="text-[#d4a373] hover:underline">github.com/abhishekmane6122</a>
                                        <span className="text-neutral-400">|</span>
                                        <a href="https://linkedin.com/in/abhishek-mane-aiml" target="_blank" rel="noopener noreferrer" className="text-[#d4a373] hover:underline">linkedin.com/in/abhishek-mane-aiml</a>
                                    </p>
                                </div>

                                {/* CAREER OBJECTIVE */}
                                <RSection title="Career Objective">
                                    <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed pl-1 text-justify">
                                        Forward-Deployed AI Engineer with 2+ years of production experience architecting, evaluating, and operating enterprise LLM and RAG systems embedded on-site with large listed conglomerates (Adani Group). Proven track record delivering 10+ production microservices under the unified central enterprise gateway, with regulatory RAG pipelines operating autonomously in production for 12+ months. Specialized in multi-backend LLM failover, FinOps token optimization, custom PostgreSQL observability, deterministic verification guardrails, and automated daily C-suite reporting.
                                    </p>
                                </RSection>

                                {/* EXPERIENCE */}
                                <RSection title="Experience">
                                    {/* Role 1: CognitBotz / Adani */}
                                    <div className="mb-6 pl-1">
                                        <div className="flex flex-wrap justify-between items-baseline gap-x-2 gap-y-0.5">
                                            <span className="font-bold text-neutral-900 dark:text-white text-sm sm:text-base">
                                                • AI Engineer (Forward-Deployed)
                                            </span>
                                            <span className="font-mono text-xs text-[#d4a373] font-semibold shrink-0">
                                                September 2025 – Present
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap justify-between items-baseline gap-x-2 gap-y-0.5 mb-3">
                                            <span className="italic text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                                                CognitBotz Solutions | Client: Adani Green Energy &amp; Adani Group
                                            </span>
                                            <span className="text-xs text-neutral-500 italic shrink-0">
                                                Ahmedabad, Gujarat
                                            </span>
                                        </div>

                                        {/* Platform 1 */}
                                        <div className="mt-3 mb-4 rounded-xl p-3 bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200 dark:border-white/5">
                                            <p className="font-bold text-xs sm:text-sm text-[#0e356b] dark:text-[#6ba3e8]">
                                                Platform 1: Aegis — Enterprise Compliance &amp; Legal Intelligence Suite (6 Applications)
                                            </p>
                                            <p className="text-[11px] sm:text-xs text-neutral-500 italic mb-2">
                                                Enterprise compliance automation suite in 24/7 production for 12+ months across Corporate Legal and Secretarial teams.
                                            </p>
                                            <RItemList items={[
                                                { bold: "Regulatory RAG Pipelines (SEBI, RBI, BSE):", text: " Architected 3 production RAG pipelines ingesting daily exchange and central bank gazettes; built dynamic chunkers (single-turn for notices, hierarchical map-reduce for 200-page master directions), PyMuPDF OCR fallback, and multi-backend LLM orchestration (Azure OpenAI GPT-4.1-mini, Azure AI Llama-4-Maverick, self-hosted Phi-3 on on-prem Tesla T4 GPU) cutting regulatory noise by 71% and saving 250+ FTE hours/quarter." },
                                                { bold: "FinOps Token Economics & On-Prem Routing:", text: " Routed batch summarization for 50+ group entities to self-hosted on-prem models combined with prompt caching, slashing recurring cloud LLM API expenses by 60%+ while maintaining sub-second inference." },
                                                { bold: "Alphanumeric Regulatory ID Search:", text: " Eliminated BPE tokenizer subword fragmentation on statutory circular IDs through deterministic regex normalization and hybrid lexical boosting, guaranteeing 100% rank-1 circular retrieval." },
                                                { bold: "Insider Trading & Secretarial AI with HITL:", text: " Engineered Databricks-backed Insider Trading surveillance pipelines, automated Director Disclosures, and an AI Board Minutes generation service featuring a Human-in-the-Loop (HITL) review drawer with page-level evidence citation prior to executive sign-off." },
                                                { bold: "LLM-as-Judge Evaluation & Group ARB Clearance:", text: " Built automated evaluation harness measuring RAGAS-aligned dimensions (Context Precision, Faithfulness, Answer Relevance, <1% hallucination); authored enterprise architecture specifications and presented directly to the Group Architecture Review Board (ARB), securing enterprise security and architecture clearance." }
                                            ]} />
                                        </div>

                                        {/* Platform 2 */}
                                        <div className="mt-3 mb-4 rounded-xl p-3 bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200 dark:border-white/5">
                                            <p className="font-bold text-xs sm:text-sm text-[#0e356b] dark:text-[#6ba3e8]">
                                                Platform 2: Equity Dashboard — Capital Markets Intelligence Suite
                                            </p>
                                            <p className="text-[11px] sm:text-xs text-neutral-500 italic mb-2">
                                                Centralized equity intelligence portal across 7 listed entities integrating market RAG, research analytics, and investor CRM.
                                            </p>
                                            <RItemList items={[
                                                { bold: "Shareholding Pattern (SHP) Intelligence & AI Analyst:", text: " Multi-tenant analytics portal tracking 3.9M+ investor records; engineered pre-LLM deterministic entity resolver (matching dates to settlement weeks and names to master lists), 4-tier confidence gate, and BU-scoped query planner achieving p50 ≈ 3ms query latency; automated daily headless PDF briefings to Business Unit CEOs." },
                                                { bold: "Sell-Side Broker Intelligence & Research RAG:", text: " Extracted forward estimates (Revenue, EBITDA, PAT, EPS, Target Price) from broker PDFs via Azure AI Search (Hybrid BM25 + Cohere Embed v4.0 + Semantic Reranker); built deterministic 8-point numerical verification engine (quote matching, unit normalization, cross-statement sanity checks) with dual-LLM failover." },
                                                { bold: "Equity Analytics RAG Platform:", text: " Built conversational RAG system with zero-hallucination guarantees over BSE/NSE market and valuation data; engineered 3-tier embeddings across 10 tables evaluated on a 39-question golden benchmark." },
                                                { bold: "Institutional IR Console:", text: " Integrated investor relations meeting tracker and engagement analytics with role-based access control." }
                                            ]} />
                                        </div>

                                        {/* Platform 3 */}
                                        <div className="mt-3 mb-4 rounded-xl p-3 bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200 dark:border-white/5">
                                            <p className="font-bold text-xs sm:text-sm text-[#0e356b] dark:text-[#6ba3e8]">
                                                Platform 3: Debt Markets &amp; Central Enterprise Infrastructure
                                            </p>
                                            <p className="text-[11px] sm:text-xs text-neutral-500 italic mb-2">
                                                High-availability reverse proxy infrastructure orchestrating 10+ microservices alongside debt capital markets backends.
                                            </p>
                                            <RItemList items={[
                                                { bold: "Debt Markets Backend Engineering:", text: " Developed async FastAPI backend services and PostgreSQL data schemas for Mutual Fund debt exposure mapping, Pension Fund NPS tracking, and Debt Capital Markets counterparty meeting management (MCM)." },
                                                { bold: "Custom PostgreSQL Observability & Gateway Architecture:", text: " Configured central Nginx reverse proxy with SSL termination, HTTP/2, HSTS, and SSE streaming across 10 microservices; engineered a custom in-house AI observability platform tracking distributed execution traces, latency percentiles, and token metrics natively in Azure PostgreSQL; integrated Azure AD SSO traversing corporate Zscaler and Fortinet firewalls, cutting latency from 8s to 500ms." }
                                            ]} />
                                        </div>
                                    </div>

                                    {/* Role 2: CognitBotz Hyderabad */}
                                    <div className="mb-5 pl-1">
                                        <div className="flex flex-wrap justify-between items-baseline gap-x-2 gap-y-0.5">
                                            <span className="font-bold text-neutral-900 dark:text-white text-sm sm:text-base">
                                                • AI Engineer
                                            </span>
                                            <span className="font-mono text-xs text-[#d4a373] font-semibold shrink-0">
                                                November 2024 – September 2025
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap justify-between items-baseline gap-x-2 gap-y-0.5 mb-2">
                                            <span className="italic text-xs sm:text-neutral-700 dark:text-neutral-300 font-medium">
                                                CognitBotz Solutions
                                            </span>
                                            <span className="text-xs text-neutral-500 italic shrink-0">
                                                Hyderabad, Telangana
                                            </span>
                                        </div>
                                        <RItemList items={[
                                            { bold: "Production AI Platforms (DocCapture AI & Intelligent AI):", text: " Architected and deployed 2 live commercial platforms — DocCapture AI (multi-modal document intelligence and automated table/entity capture) and Intelligent AI (enterprise low-code platform for rapid agentic workflow orchestration)." },
                                            { bold: "LLM Engineering & Agent Deployment:", text: " Developed and fine-tuned LLMs using LangChain and Agno with few-shot prompting; built async FastAPI microservices supporting high-throughput multi-modal web agents." },
                                            { bold: "AI Guardrails & Responsible AI:", text: " Enforced strict Pydantic output schemas, prompt-injection sanitization, confidence gating, and data-privacy safeguards." }
                                        ]} />
                                    </div>

                                    {/* Role 3: Infosys Springboard */}
                                    <div className="mb-4 pl-1">
                                        <div className="flex flex-wrap justify-between items-baseline gap-x-2 gap-y-0.5">
                                            <span className="font-bold text-neutral-900 dark:text-white text-sm sm:text-base">
                                                • AI Developer Intern
                                            </span>
                                            <span className="font-mono text-xs text-[#d4a373] font-semibold shrink-0">
                                                September 2024 – December 2024
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap justify-between items-baseline gap-x-2 gap-y-0.5 mb-2">
                                            <span className="italic text-xs sm:text-neutral-700 dark:text-neutral-300 font-medium">
                                                Infosys Springboard
                                            </span>
                                            <span className="text-xs text-neutral-500 italic shrink-0">
                                                Remote
                                            </span>
                                        </div>
                                        <RItemList items={[
                                            { bold: "Enterprise NLP Workflows:", text: " Built NLP and text classification pipelines for automated document routing under Infosys's enterprise track." }
                                        ]} />
                                    </div>
                                </RSection>

                                {/* PROJECTS */}
                                <RSection title="Projects">
                                    {/* Project 1 */}
                                    <div className="mb-4 pl-1">
                                        <div className="flex flex-wrap justify-between items-baseline gap-x-2">
                                            <a
                                                href="https://granite.rhinofoster.com/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-bold text-xs sm:text-sm text-[#0e356b] dark:text-[#6ba3e8] hover:underline"
                                            >
                                                Project 1: Granite Buyer Intelligence Platform — Resilient Task Queue &amp; 3-Tier LLM Gateway
                                            </a>
                                            <a
                                                href="https://granite.rhinofoster.com/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-[#d4a373] italic hover:underline shrink-0"
                                            >
                                                granite.rhinofoster.com
                                            </a>
                                        </div>
                                        <p className="text-[11px] sm:text-xs text-neutral-500 italic mb-1.5">
                                            Deployed B2B market intelligence platform with durable asynchronous task execution and multi-provider failover.
                                        </p>
                                        <RItemList items={[
                                            { bold: "Durable PostgreSQL Task Queue:", text: " Built crash-resilient asynchronous task queue with 180s leases and heartbeat recovery for automated multi-engine web discovery, qualification, and data extraction." },
                                            { bold: "3-Tier LLM Failover Gateway:", text: " Implemented dynamic failover architecture (OpenRouter → NVIDIA Build → Groq) and lexical search, guaranteeing 100% inference uptime and sub-second generation." },
                                            { bold: "Evidence-First Validation:", text: " Enforced SQL check constraints separating verified facts from AI inference, with 0–100 quality scoring and audit tracking." }
                                        ]} />
                                    </div>

                                    {/* Project 2 */}
                                    <div className="mb-4 pl-1">
                                        <div className="flex flex-wrap justify-between items-baseline gap-x-2">
                                            <a
                                                href="https://www.intelligentagentworks.com/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-bold text-xs sm:text-sm text-[#0e356b] dark:text-[#6ba3e8] hover:underline"
                                            >
                                                Project 2: Sentinel (Ward) — AI Model Governance &amp; Security Platform
                                            </a>
                                            <a
                                                href="https://www.intelligentagentworks.com/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-[#d4a373] italic hover:underline shrink-0"
                                            >
                                                intelligentagentworks.com
                                            </a>
                                        </div>
                                        <p className="text-[11px] sm:text-xs text-neutral-500 italic mb-1.5">
                                            Deployed auditable on-ramp for running open-source models on owned GPUs with zero LLM in the critical path.
                                        </p>
                                        <RItemList items={[
                                            { bold: "Deterministic Pickle-Opcode Scanner:", text: " Engineered custom AST and pickle-opcode scanner detecting unsafe deserialization exploits (RCE) prior to loading model weights into GPU memory, completely bypassing LLM overhead." },
                                            { bold: "Model Integrity & Policy Pipeline:", text: " Implemented SHA-256 cryptographic verification, automated Hugging Face license classification, and a multi-stage cyber/legal governance approval workflow backed by FastAPI and React." }
                                        ]} />
                                    </div>

                                    {/* Project 3 */}
                                    <div className="mb-4 pl-1">
                                        <div className="flex flex-wrap justify-between items-baseline gap-x-2">
                                            <span className="font-bold text-xs sm:text-sm text-[#0e356b] dark:text-[#6ba3e8]">
                                                Project 3: PerkAI — Async Multi-Agent Subsidy &amp; Benefits Discovery Platform
                                            </span>
                                            <span className="text-xs text-neutral-500 italic shrink-0">
                                                Deployed on Azure VM
                                            </span>
                                        </div>
                                        <p className="text-[11px] sm:text-xs text-neutral-500 italic mb-1.5">
                                            High-concurrency pure-asyncio multi-agent platform discovering cloud credits, grants, and enterprise tax subsidies.
                                        </p>
                                        <RItemList items={[
                                            { bold: "Autonomous Multi-Agent Pipeline:", text: " Architected pure-Python asyncio agent orchestrator (QueryPlanner, SearchService with circuit breakers, Extraction, Rule-Matching with geo-gating, Valuation) streaming execution via SSE to a React 19 SPA with Edge-TTS voice synthesis." },
                                            { bold: "Resilient AI Gateway:", text: " Built unified gateway routing chat/JSON across Groq and OpenRouter with 2048-d embeddings, automated JSON schema repair, and strict verbatim-quote grounding guards." },
                                            { bold: "3-Tier Enterprise Observability:", text: " Instrumented distributed tracing via Langfuse (prompt versioning, token metrics), Prometheus custom metrics, and Grafana/Loki log aggregation correlated by X-Request-ID." }
                                        ]} />
                                    </div>
                                </RSection>

                                {/* TECHNICAL SKILLS */}
                                <RSection title="Technical Skills">
                                    <div className="space-y-2 pl-1">
                                        <p className="text-xs leading-relaxed">
                                            <span className="font-bold text-neutral-900 dark:text-white">Agentic AI &amp; LLMs: </span>
                                            <span className="text-neutral-700 dark:text-neutral-300">
                                                Multi-Agent Systems, LangGraph, LangChain, Agno, Tool/Function-Calling, State Graphs, Supervisor-Worker Patterns, Prompt Engineering, Prompt Caching, FinOps Token Optimization, Frontier Models (OpenAI, Claude, DeepSeek R1, Gemini, Azure OpenAI, Llama-4, Phi-3, Groq LPU)
                                            </span>
                                        </p>
                                        <p className="text-xs leading-relaxed">
                                            <span className="font-bold text-neutral-900 dark:text-white">Advanced RAG &amp; Search: </span>
                                            <span className="text-neutral-700 dark:text-neutral-300">
                                                Hybrid Search (Dense Vector + BM25/FTS), Cross-Encoder Reranking (FlashRank, BGE-Reranker, Cohere Rerank), Azure AI Search, Parent-Child Chunking, Dynamic Hierarchical Chunking, Vector Databases (pgvector on PostgreSQL, FAISS, ChromaDB, Weaviate), Cohere Embed v4.0 (1536-dim)
                                            </span>
                                        </p>
                                        <p className="text-xs leading-relaxed">
                                            <span className="font-bold text-neutral-900 dark:text-white">AI Evals &amp; Observability: </span>
                                            <span className="text-neutral-700 dark:text-neutral-300">
                                                LLM Evals (RAGAS, DeepEval, G-Eval, LLM-as-Judge), Observability &amp; Distributed Tracing (Custom PostgreSQL AI Observability, Langfuse, OpenTelemetry), Failure Mode Analysis, Guardrails (Pydantic Schema Validation, NeMo Guardrails, Confidence &amp; Abstention Gating, HITL Workflows)
                                            </span>
                                        </p>
                                        <p className="text-xs leading-relaxed">
                                            <span className="font-bold text-neutral-900 dark:text-white">Backend, Data &amp; Cloud: </span>
                                            <span className="text-neutral-700 dark:text-neutral-300">
                                                Python, FastAPI, Pydantic v2, PostgreSQL (Azure Database Flexible Server), Databricks, Redis, Asyncio, React, TypeScript, Vite, Nginx (Reverse Proxy / Load Balancing), Docker Compose, Playwright, Azure (OpenAI, AI Foundry, AD SSO / OAuth2, Key Vault, VM), Tesla T4 Air-Gapped Serving, Group ARB Clearance
                                            </span>
                                        </p>
                                    </div>
                                </RSection>

                                {/* AWARDS & CERTIFICATIONS */}
                                <RSection title="Awards &amp; Certifications">
                                    <div className="space-y-3 pl-1">
                                        <div>
                                            <div className="flex flex-wrap justify-between items-baseline gap-x-2">
                                                <span className="font-bold text-neutral-900 dark:text-white text-xs sm:text-sm">
                                                    • Performance of the Year Award — GreenRatna Initiative (2025–2026)
                                                </span>
                                                <span className="font-semibold text-xs text-[#d4a373] shrink-0">
                                                    Adani Green Energy Limited
                                                </span>
                                            </div>
                                            <p className="text-xs text-neutral-700 dark:text-neutral-300 mt-0.5 leading-relaxed">
                                                Conferred by the Chief Digital Officer (CDO, AGEL) and recognized across the GreenRatna initiative for high-impact production delivery of enterprise AI compliance and capital markets platforms; appreciated by Group Chairman Shri Gautam Adani.
                                            </p>
                                        </div>

                                        <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed pt-1 border-t border-neutral-200 dark:border-white/5">
                                            <span className="font-bold text-neutral-900 dark:text-white">• Certifications: </span>
                                            Anthropic Claude Prompt Engineering Certification | CCSK v4.1 Foundation (Cloud Security) | Cloud Computing Fundamentals | AICTE-Cisco Cyber Security | Google Cloud Bootcamp (GeeksforGeeks)
                                        </p>
                                    </div>
                                </RSection>

                                {/* EDUCATION */}
                                <RSection title="Education">
                                    <div className="pl-1">
                                        <div className="flex flex-wrap justify-between items-baseline gap-x-2">
                                            <span className="font-bold text-neutral-900 dark:text-white text-xs sm:text-sm">
                                                • Bachelor of Technology in Artificial Intelligence and Data Science
                                            </span>
                                            <span className="font-mono text-xs text-[#d4a373] font-semibold shrink-0">
                                                2021 – 2025
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap justify-between items-baseline gap-x-2 mt-0.5">
                                            <span className="text-xs text-neutral-600 dark:text-neutral-400">
                                                Terna Engineering College, Osmanabad (Dharashiv), Maharashtra
                                            </span>
                                            <span className="text-xs text-neutral-500 italic shrink-0">
                                                First Class with Distinction
                                            </span>
                                        </div>
                                    </div>
                                </RSection>

                                {/* Bottom Actions */}
                                <div className="mt-12 mb-8 flex flex-wrap items-center justify-center gap-4 pt-6 border-t border-neutral-200 dark:border-white/10">
                                    <button
                                        onClick={handleDownload}
                                        className="px-6 py-3 rounded-2xl bg-[#d4a373] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#c49363] transition-all shadow-lg shadow-[#d4a373]/20 flex items-center gap-2"
                                    >
                                        <Download className="w-4 h-4" /> Download PDF ({fileName})
                                    </button>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="px-6 py-3 rounded-2xl bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 font-bold text-xs uppercase tracking-[0.2em] hover:bg-red-500/10 hover:text-red-500 transition-all border border-transparent hover:border-red-500/20"
                                    >
                                        Close Resume
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
            </AnimatePresence>,
            document.body
        )
    }

    if (variant === 'card') {
        return (
            <>
                <ResumeModal />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative overflow-hidden rounded-3xl bg-neutral-50/80 dark:bg-[#0c0c0c] p-6 sm:p-10 backdrop-blur-xl border border-[#d4a373]/30 shadow-2xl transition-all hover:border-[#d4a373]/60 group"
                >
                    {/* Background glow */}
                    <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[#d4a373]/10 blur-3xl pointer-events-none group-hover:bg-[#d4a373]/20 transition-all" />

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-3 max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4a373]/10 text-[#d4a373] text-xs font-mono uppercase tracking-widest">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Official 2-Year Production Resume</span>
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-light text-neutral-900 dark:text-white">
                                Abhishek Mane — <span className="font-semibold text-[#d4a373]">Forward-Deployed AI Engineer</span>
                            </h3>
                            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
                                2+ years of production experience architecting enterprise LLM platforms, multi-agent workflows, and regulatory RAG pipelines for large listed conglomerates (Adani Group). Performance of the Year Awardee (GreenRatna).
                            </p>
                            <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                                <span className="px-2.5 py-1 rounded-md bg-neutral-200/60 dark:bg-white/5">PDF: {fileName}</span>
                                <span className="px-2.5 py-1 rounded-md bg-neutral-200/60 dark:bg-white/5">10+ Microservices</span>
                                <span className="px-2.5 py-1 rounded-md bg-neutral-200/60 dark:bg-white/5">3 Production RAGs</span>
                                <span className="px-2.5 py-1 rounded-md bg-neutral-200/60 dark:bg-white/5">71% Noise Cut</span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={handleDownload}
                                className="px-6 py-3.5 rounded-xl bg-[#d4a373] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#c49363] transition-all shadow-lg shadow-[#d4a373]/25 flex items-center justify-center gap-2"
                            >
                                <Download className="w-4 h-4" /> Download PDF
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => { setViewMode('formatted'); setShowModal(true); }}
                                className="px-6 py-3.5 rounded-xl bg-neutral-200/80 dark:bg-white/10 text-neutral-900 dark:text-white font-medium text-xs uppercase tracking-widest hover:bg-neutral-300 dark:hover:bg-white/15 transition-all flex items-center justify-center gap-2"
                            >
                                <FileText className="w-4 h-4" /> View Full Resume
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </>
        )
    }

    return (
        <>
            <ResumeModal />
            <div className="flex items-center gap-2">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setViewMode('formatted'); setShowModal(true); }}
                    className="px-3 md:px-4 py-2 rounded-lg bg-[#d4a373] text-white font-medium text-xs md:text-sm hover:bg-[#c49363] transition-colors flex items-center gap-1.5 md:gap-2 shadow-lg shadow-[#d4a373]/20"
                    title={`View or Download ${fileName}`}
                >
                    <FileText className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    {showLabel && <span className="hidden sm:inline">Resume</span>}
                    <Download
                        className="w-3 h-3 md:w-3.5 md:h-3.5 opacity-70 hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                            e.stopPropagation()
                            handleDownload()
                        }}
                    />
                </motion.button>
            </div>
        </>
    )
}

// ── Helper Components ──────────────────────────────────────────────────────────

function RSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="mb-6">
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-[0.18em] text-neutral-900 dark:text-white border-b border-neutral-300 dark:border-white/20 pb-1 mb-3">
                {title}
            </h2>
            {children}
        </div>
    )
}

function RItemList({ items }: { items: { bold: string; text: string }[] }) {
    return (
        <ul className="mt-1 space-y-1.5 pl-2">
            {items.map((item, i) => (
                <li key={i} className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed flex gap-2">
                    <span className="mt-0.5 shrink-0 text-[#d4a373] font-bold">—</span>
                    <span>
                        <span className="font-semibold text-neutral-900 dark:text-neutral-100">{item.bold}</span>
                        {item.text}
                    </span>
                </li>
            ))}
        </ul>
    )
}
