import { useState } from 'react'
import { Download, FileText, X, ExternalLink } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

interface ResumeDownloadProps {
    variant?: 'button' | 'card'
    showLabel?: boolean
}

export default function ResumeDownload({ variant = 'button', showLabel = true }: ResumeDownloadProps) {
    const [showModal, setShowModal] = useState(false)

    const handleDownload = () => {
        const fileName = 'Abhishek_Mane_Resume.pdf'
        const filePath = `${import.meta.env.BASE_URL}resume/${fileName}`
        const link = document.createElement('a')
        link.href = filePath
        link.download = fileName
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        toast.success('Resume downloaded!', { icon: '📄', duration: 3000 })
    }

    const ResumeModal = () => (
        <AnimatePresence>
            {showModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm"
                    onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false) }}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative w-full max-w-3xl max-h-[95vh] bg-white dark:bg-[#0f0f0f] rounded-2xl shadow-2xl border border-neutral-200 dark:border-white/10 overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-black/30 shrink-0">
                            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                <FileText className="w-4 h-4 text-[#d4a373] shrink-0" />
                                <span className="font-mono text-xs font-medium uppercase tracking-widest text-neutral-700 dark:text-neutral-300 truncate">
                                    Abhishek Mane — Resume
                                </span>
                            </div>
                            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                                <button
                                    onClick={handleDownload}
                                    className="flex items-center gap-1.5 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-[#d4a373] text-white text-xs font-mono uppercase tracking-widest hover:bg-[#c49363] transition-all"
                                >
                                    <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                    <span className="hidden sm:inline">Download PDF</span>
                                    <span className="sm:hidden">PDF</span>
                                </button>
                                <a
                                    href={`${import.meta.env.BASE_URL}resume/Abhishek_Mane_Resume.pdf`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-neutral-100 dark:bg-white/10 text-neutral-700 dark:text-white text-xs hover:bg-neutral-200 dark:hover:bg-white/20 transition-all"
                                >
                                    <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                    <span className="hidden sm:inline font-mono uppercase tracking-widest">Open</span>
                                </a>
                                <button onClick={() => setShowModal(false)} className="p-1.5 sm:p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors">
                                    <X className="w-4 h-4 text-neutral-500" />
                                </button>
                            </div>
                        </div>

                        {/* Resume Content */}
                        <div className="overflow-y-auto flex-1 px-4 sm:px-8 md:px-12 py-6 sm:py-8 text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm leading-relaxed">

                            {/* HEADING */}
                            <div className="text-center mb-5 pb-4 border-b border-neutral-300 dark:border-white/15">
                                <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight mb-1">Abhishek Mane</h1>
                                <p className="text-xs text-neutral-600 dark:text-neutral-400 flex flex-wrap justify-center gap-x-2 gap-y-1">
                                    <a href="mailto:abhishek.mane.work@gmail.com" className="text-[#d4a373] hover:underline">abhishek.mane.work@gmail.com</a>
                                    <span className="text-neutral-400">|</span>
                                    <span>+91-7020870063</span>
                                    <span className="text-neutral-400">|</span>
                                    <span>Ahmedabad, Gujarat, India</span>
                                </p>
                                <p className="text-xs text-neutral-600 dark:text-neutral-400 flex flex-wrap justify-center gap-x-2 gap-y-1 mt-1">
                                    <a href="https://www.linkedin.com/in/abhishek-mane-aiml" target="_blank" rel="noopener noreferrer" className="text-[#d4a373] hover:underline">linkedin.com/in/abhishek-mane-aiml</a>
                                    <span className="text-neutral-400">|</span>
                                    <a href="https://substack.com/@abhimane" target="_blank" rel="noopener noreferrer" className="text-[#d4a373] hover:underline">substack.com/@abhimane</a>
                                    <span className="text-neutral-400">|</span>
                                    <a href="https://github.com/abhishekmane6122" target="_blank" rel="noopener noreferrer" className="text-[#d4a373] hover:underline">github.com/abhishekmane6122</a>
                                </p>
                            </div>

                            {/* EDUCATION */}
                            <RSection title="Education">
                                <RSubheading
                                    title="Terna Engineering College"
                                    right1="Osmanabad, India"
                                    subtitle="Bachelor of Technology — Artificial Intelligence and Data Science"
                                    right2="Dec. 2021 — 2025"
                                />
                            </RSection>

                            {/* EXPERIENCE */}
                            <RSection title="Experience">
                                <RSubheading
                                    title="CognitBotz Solutions"
                                    right1="Ahmedabad, India"
                                    subtitle="Artificial Intelligence Engineer — Client: Adani Green Energy & Adani Group"
                                    right2="Sep. 2025 — Present"
                                >
                                    <RItemList items={[
                                        { bold: "Aegis — Enterprise Compliance Platform", text: ": Designed and developed a full-stack, production-grade compliance intelligence platform for Adani Group's Secretarial & Legal teams. Built six independently deployable modules — BSE Intelligence, RBI Compliance, SEBI Hub, Director Disclosure Management, Insider Trading Surveillance, and Minutes Preparation — behind a unified React UI. Platform saved 250+ FTE hours per quarter and is live in production." },
                                        { bold: "Regulatory RAG Pipeline (BSE, SEBI, RBI)", text: ": Engineered automated scraping and ingestion pipelines (using Playwright and Requests) that collect daily notifications from BSE, SEBI, and RBI portals, extract content from PDFs via PyMuPDF and OCR, and generate AI summaries using Phi-3-mini LLM. Indexed documents into ChromaDB vector store for semantic search and pushed structured data to Azure PostgreSQL. Delivered automated daily email reports via SMTP. Eliminated 6+ hours of manual daily monitoring and reduced SEBI notification noise by 71%." },
                                        { bold: "Multi-Agent NL-to-SQL System", text: ": Designed a multi-agent architecture where a routing agent classifies user intent and delegates to either a deterministic query handler or a GPT-powered dynamic SQL generation agent. Engineered prompt templates with schema context injection for SAP HANA-compatible SQL generation. Built a query validation layer to sanitize LLM output, prevent SQL injection, and enforce read-only access." },
                                        { bold: "Equity Pulse — Market Analytics Platform", text: ": Built an end-to-end equity analytics platform for Adani Group's finance and portfolio teams. Designed ETL pipelines on a scheduled VM to extract, validate, and load daily bhavcopy data from BSE and NSE into Azure PostgreSQL. Developed a backend computation engine to calculate moving averages, volatility metrics, delivery ratios, and relative performance indices. Built the React frontend with interactive dashboards, candlestick charts, competitor analysis, and shareholding pattern tracking across 7 Adani business units and 3.9M+ investor records. Eliminated 4–6 hours of daily manual analyst work." },
                                        { bold: "Platform Infrastructure & Observability", text: ": Implemented Azure AD SSO with RBAC across all platforms. Secured all secrets via Azure Key Vault, enforced TLS in transit and AES-256 encryption at rest. Built a custom AI Agent Observability Platform to monitor all deployed agents in real time — covering health checks, execution logs, latency tracking, and failure alerts. Configured Azure VM scheduling for automated pipeline execution and optimized API response times from 8 seconds to 500ms. Integrated email-based triggers and automated reporting via SMTP for daily operational summaries." },
                                        { bold: "Cross-Functional Technical Leadership", text: ": Act as de facto technical lead across all enterprise AI projects at CognitBotz. Lead daily Scrum meetings with a 15+ member cross-functional team spanning Data Engineers, Python Developers, AI/ML Engineers, and Frontend Developers. Directly engaged in stakeholder management with Adani Group leadership — conducting project progress updates, requirements gathering sessions, and sprint reviews to ensure delivery alignment with business objectives." },
                                    ]} />
                                </RSubheading>

                                <RSubheading
                                    title="CognitBotz Solutions"
                                    right1="Hyderabad, India"
                                    subtitle="Artificial Intelligence Engineer"
                                    right2="Nov. 2024 — Sep. 2025"
                                >
                                    <RItemList items={[
                                        { bold: "LLM Engineering & Deployment", text: ": Developed and fine-tuned LLMs using LangChain and Agno with few-shot and transfer learning. Designed APIs for LLM integration and deployed production chatbots, Q&A systems, and web agents handling text, documents, and multi-modal inputs." },
                                        { bold: "AI Evaluation & Responsible AI", text: ": Evaluated LLM performance on accuracy, relevance, and fairness metrics. Implemented bias mitigation, data privacy safeguards, and responsible AI practices to prevent misuse and harmful content generation." },
                                    ]} />
                                </RSubheading>

                                <RSubheading
                                    title="Infosys Springboard"
                                    right1="India"
                                    subtitle="Artificial Intelligence Developer (Internship)"
                                    right2="Sep. 2024 — Dec. 2024"
                                >
                                    <RItemList items={[
                                        { bold: "AI Application Development", text: ": Built AI/ML applications under the Infosys Springboard program, gaining hands-on experience with enterprise AI workflows and NLP pipelines." },
                                    ]} />
                                </RSubheading>

                                <RSubheading
                                    title="Cyber Crime Police Station — India"
                                    right1="Osmanabad, India"
                                    subtitle="Data Analyst"
                                    right2="Oct. 2023 — Jan. 2024"
                                >
                                    <RItemList items={[
                                        { bold: "Data Management", text: ": Managed user credentials for the National Cyber Crime Reporting Portal. Extracted and organized complaint data in Excel to improve case handling efficiency. Maintained portal by updating complaint statuses and coordinating directly with victims on case resolutions." },
                                    ]} />
                                </RSubheading>
                            </RSection>

                            {/* PROJECTS */}
                            <RSection title="Projects">
                                {[
                                    {
                                        name: "Aegis — Regulatory Compliance Intelligence Suite",
                                        context: "CognitBotz, Client: Adani Group",
                                        desc: "Production-grade multi-module platform automating BSE/SEBI/RBI monitoring, director disclosure management, insider trading surveillance across 3.9M+ investor records, and board meeting minutes generation. Saved 250+ FTE hours/quarter.",
                                        stack: "React, FastAPI, Python, LangChain, LangGraph, Azure OpenAI, Cohere Embeddings, pgvector (Azure PostgreSQL), Azure Key Vault, Azure VM, Nginx, Docker, GitLab."
                                    },
                                    {
                                        name: "Equity Pulse — Enterprise Equity Analytics Platform",
                                        context: "CognitBotz, Client: Adani Group",
                                        desc: "End-to-end equity analytics platform tracking 5 Adani business units with automated ETL from BSE/NSE, real-time dashboards, candlestick charts, competitor analysis, and shareholding pattern portal across 3.9M+ investor records. Eliminated 4–6 hrs of daily manual analyst work.",
                                        stack: "React, TypeScript, FastAPI, Python, Azure PostgreSQL, pgvector, Azure VM, APScheduler, Recharts, Docker, GitLab."
                                    },
                                    {
                                        name: "Quantus Med — Multimodal AI Clinical Diagnostic Intelligence",
                                        context: "CognitBotz",
                                        desc: "Clinical AI platform fusing medical imagery (DICOM/JPG/PNG) with real-time physician voice dictation to generate structured SOAP diagnostic reports in under 500ms. Uses Llama-3 and Gemini 1.5-Flash for vision, Whisper-large-v3 for transcription, and Edge-TTS for hands-free playback. HIPAA/GDPR-compliant zero-knowledge inference.",
                                        stack: "React-Vite, FastAPI, LangChain, Groq LPU, Llama-3, Gemini 1.5-Flash, Whisper-large-v3, Edge-TTS."
                                    },
                                    {
                                        name: "Doc Capture — Intelligent Document Extraction API",
                                        context: "CognitBotz",
                                        desc: "FastAPI backend for automated extraction and export of structured data from multi-type documents (Aadhaar, PAN, Driving License, Voter ID, invoices). Supports template-based invoice mapping, batch processing, and Excel/JSON export. Docker Compose deployed.",
                                        stack: "Python, FastAPI, Groq LLM, PyMuPDF, Camelot, Openpyxl, Docker."
                                    },
                                    {
                                        name: "OmniQA-Agent — Autonomous Requirements & Test Engineering Orchestrator",
                                        context: "Personal",
                                        desc: "Autonomous QA platform crawling websites via Playwright headless Chromium, parsing DOM with BeautifulSoup, and orchestrating LangChain pipelines through Groq Llama-4 to auto-generate user stories, test plans, and test cases. Exports color-formatted Excel workbooks ready for Jira/ALM integration.",
                                        stack: "Python, Streamlit, Playwright, BeautifulSoup4, LangChain, Groq (Llama-4), Openpyxl."
                                    },
                                ].map((p, i) => (
                                    <div key={i} className="mb-3 pl-1">
                                        <p className="text-xs leading-snug">
                                            <span className="font-bold text-neutral-900 dark:text-white">{p.name}</span>
                                            <span className="text-neutral-500 italic"> | {p.context}</span>
                                        </p>
                                        <p className="text-xs text-neutral-700 dark:text-neutral-300 mt-0.5 leading-relaxed">
                                            {p.desc} <span className="italic text-neutral-500">Stack: {p.stack}</span>
                                        </p>
                                    </div>
                                ))}
                            </RSection>

                            {/* TECHNICAL SKILLS */}
                            <RSection title="Technical Skills">
                                {[
                                    { cat: "AI/ML", val: "LangChain, LangGraph, RAG Systems, Multi-Agent Architectures, Azure OpenAI, Groq LPU, Llama-3/4, Phi-3, Whisper, Cohere Embeddings, Prompt Engineering, Fine-Tuning, Open Source LLMs, VLLMs" },
                                    { cat: "Vector Databases & Search", val: "pgvector (Azure PostgreSQL), ChromaDB, FAISS" },
                                    { cat: "Backend", val: "Python, FastAPI, PostgreSQL, SQLite, REST APIs, Async Programming, Nginx, Docker, Playwright" },
                                    { cat: "Frontend", val: "React, TypeScript, Tailwind CSS, Streamlit" },
                                    { cat: "Cloud & DevOps", val: "Azure (OpenAI, AD SSO, Key Vault, PostgreSQL, VM Scheduling, AI Foundry, Microsoft Foundry), Docker, APScheduler, GitLab, Git, SMTP Automation" },
                                    { cat: "Security & Observability", val: "RBAC, Azure Key Vault, TLS, AES-256, SQL Injection Prevention, AI Agent Observability, AI Security" },
                                ].map((s, i) => (
                                    <p key={i} className="text-xs mb-1 leading-relaxed">
                                        <span className="font-bold text-neutral-900 dark:text-white">{s.cat}: </span>
                                        <span className="text-neutral-700 dark:text-neutral-300">{s.val}</span>
                                    </p>
                                ))}
                            </RSection>

                            {/* AWARDS */}
                            <RSection title="Awards & Recognition">
                                <p className="text-xs leading-relaxed text-neutral-700 dark:text-neutral-300 pl-1">
                                    <span className="font-bold text-neutral-900 dark:text-white">GreenRatna — Performance of the Month Award</span> (December 2025), Adani Green Energy Limited: Recognized by AGEL leadership and stakeholders for designing and delivering impactful AI-driven portals and solutions. Work was appreciated by Hon'ble Chairman Shri Gautam Adani and received positive feedback across multiple teams at the organization.
                                </p>
                            </RSection>

                            {/* CERTIFICATIONS */}
                            <RSection title="Certifications">
                                <p className="text-xs leading-relaxed text-neutral-700 dark:text-neutral-300 pl-1">
                                    CCSK v4.1 Foundation Training — Cloud Security | Cloud Computing Fundamentals | AICTE-Cisco Cyber Security Virtual Internship | Google for Developers Cloud Bootcamp (GeeksforGeeks)
                                </p>
                            </RSection>

                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )

    if (variant === 'card') {
        return (
            <>
                <ResumeModal />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#d4a373]/10 via-amber-500/10 to-orange-500/10 p-6 backdrop-blur-sm border border-[#d4a373]/20"
                >
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 rounded-xl bg-[#d4a373]">
                                <FileText className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-foreground">Resume</h3>
                                <p className="text-sm text-muted-foreground">View or download my latest resume</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                onClick={() => setShowModal(true)}
                                className="flex-1 px-4 py-2.5 rounded-lg bg-[#d4a373] text-white font-medium text-sm hover:bg-[#c49363] transition-colors flex items-center justify-center gap-2"
                            >
                                <FileText className="w-4 h-4" /> View
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                onClick={handleDownload}
                                className="flex-1 px-4 py-2.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-foreground font-medium text-sm hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                            >
                                <Download className="w-4 h-4" /> PDF
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
                    onClick={() => setShowModal(true)}
                    className="px-3 md:px-4 py-2 rounded-lg bg-[#d4a373] text-white font-medium text-xs md:text-sm hover:bg-[#c49363] transition-colors flex items-center gap-1.5 md:gap-2 shadow-lg shadow-[#d4a373]/20"
                >
                    <FileText className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    {showLabel && <span className="hidden sm:inline">Resume</span>}
                    <Download className="w-3 h-3 md:w-3.5 md:h-3.5 opacity-70" />
                </motion.button>
            </div>
        </>
    )
}

// ── Helper Components ──────────────────────────────────────────────────────────

function RSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="mb-5">
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-[0.15em] text-neutral-900 dark:text-white border-b border-neutral-300 dark:border-white/20 pb-0.5 mb-2">
                {title}
            </h2>
            {children}
        </div>
    )
}

function RSubheading({
    title, right1, subtitle, right2, children
}: {
    title: string; right1: string; subtitle: string; right2: string; children?: React.ReactNode
}) {
    return (
        <div className="mb-3 pl-1">
            <div className="flex flex-wrap justify-between items-baseline gap-x-2 gap-y-0.5">
                <span className="font-bold text-neutral-900 dark:text-white text-xs sm:text-sm">{title}</span>
                <span className="text-xs text-neutral-500 shrink-0">{right1}</span>
            </div>
            <div className="flex flex-wrap justify-between items-baseline gap-x-2 gap-y-0.5">
                <span className="italic text-xs text-neutral-600 dark:text-neutral-400">{subtitle}</span>
                <span className="text-xs text-neutral-500 italic shrink-0">{right2}</span>
            </div>
            {children}
        </div>
    )
}

function RItemList({ items }: { items: { bold: string; text: string }[] }) {
    return (
        <ul className="mt-1 space-y-1 pl-2">
            {items.map((item, i) => (
                <li key={i} className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed flex gap-1.5">
                    <span className="mt-0.5 shrink-0 text-neutral-400">•</span>
                    <span>
                        <span className="font-semibold text-neutral-800 dark:text-neutral-100">{item.bold}</span>
                        {item.text}
                    </span>
                </li>
            ))}
        </ul>
    )
}
