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
                    className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                    onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false) }}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-[#0f0f0f] rounded-3xl shadow-2xl border border-neutral-200 dark:border-white/10 overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-black/30 shrink-0">
                            <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-[#d4a373]" />
                                <span className="font-mono text-sm font-medium uppercase tracking-widest text-neutral-700 dark:text-neutral-300">Abhishek Mane — Resume</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleDownload}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#d4a373] text-white text-xs font-mono uppercase tracking-widest hover:bg-[#c49363] transition-all"
                                >
                                    <Download className="w-3.5 h-3.5" />
                                    Download PDF
                                </button>
                                <a
                                    href={`${import.meta.env.BASE_URL}resume/Abhishek_Mane_Resume.pdf`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-100 dark:bg-white/10 text-neutral-700 dark:text-white text-xs font-mono uppercase tracking-widest hover:bg-neutral-200 dark:hover:bg-white/20 transition-all"
                                >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    Open
                                </a>
                                <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors">
                                    <X className="w-5 h-5 text-neutral-500" />
                                </button>
                            </div>
                        </div>

                        {/* Resume Content - Rendered from .tex data */}
                        <div className="overflow-y-auto flex-1 p-6 md:p-10 font-serif text-neutral-800 dark:text-neutral-200 text-sm leading-relaxed">
                            {/* Header */}
                            <div className="text-center mb-6 pb-4 border-b border-neutral-200 dark:border-white/10">
                                <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-2">Abhishek Mane</h1>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                    <a href="mailto:abhishek.mane.work@gmail.com" className="text-[#d4a373] hover:underline">abhishek.mane.work@gmail.com</a>
                                    {' '}|{' '}+91-7020870063 | Ahmedabad, Gujarat, India
                                </p>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 flex flex-wrap justify-center gap-2">
                                    <a href="https://www.linkedin.com/in/abhishek-mane-aiml" target="_blank" className="text-[#d4a373] hover:underline">LinkedIn</a>
                                    <span>|</span>
                                    <a href="https://substack.com/@abhimane" target="_blank" className="text-[#d4a373] hover:underline">Substack</a>
                                    <span>|</span>
                                    <a href="https://github.com/abhishekmane6122" target="_blank" className="text-[#d4a373] hover:underline">GitHub</a>
                                </p>
                            </div>

                            {/* Education */}
                            <Section title="Education">
                                <Entry title="Terna Engineering College" subtitle="B.Tech — Artificial Intelligence and Data Science" right1="Osmanabad, India" right2="Dec. 2021 – 2025" />
                            </Section>

                            {/* Experience */}
                            <Section title="Experience">
                                <Entry title="CognitBotz Solutions" subtitle="AI Engineer — Client: Adani Green Energy & Adani Group" right1="Ahmedabad, India" right2="Sep. 2025 – Present">
                                    <BulletList items={[
                                        { bold: "Aegis — Enterprise Compliance Platform", text: ": Full-stack compliance intelligence platform with 6 modules — BSE Intelligence, RBI Compliance, SEBI Hub, Director Disclosure, Insider Trading, and Minutes Preparation. Saved 250+ FTE hours/quarter." },
                                        { bold: "Regulatory RAG Pipeline", text: ": Automated scraping (Playwright), PDF extraction (PyMuPDF + OCR), AI summaries (Phi-3-mini), ChromaDB + Azure PostgreSQL. Eliminated 6+ hours of daily monitoring." },
                                        { bold: "Multi-Agent NL-to-SQL System", text: ": Routing agent + GPT-powered SQL generation with schema context injection and query validation layer." },
                                        { bold: "Equity Pulse", text: ": End-to-end equity analytics for 7 Adani BUs — BSE/NSE ETL, candlestick charts, competitor analysis, 3.9M+ investor records." },
                                        { bold: "Platform Infrastructure", text: ": Azure AD SSO, RBAC, Key Vault, TLS, AI Agent Observability Platform. API response time: 8s → 500ms." },
                                    ]} />
                                </Entry>
                                <Entry title="CognitBotz Solutions" subtitle="AI Engineer" right1="Hyderabad, India" right2="Nov. 2024 – Sep. 2025">
                                    <BulletList items={[
                                        { bold: "LLM Engineering", text: ": Fine-tuned LLMs with LangChain/Agno, deployed production chatbots and Q&A systems." },
                                        { bold: "Responsible AI", text: ": Bias mitigation, data privacy, and responsible AI practices." },
                                    ]} />
                                </Entry>
                                <Entry title="Infosys Springboard" subtitle="AI Developer Internship" right1="India" right2="Sep. 2024 – Dec. 2024">
                                    <BulletList items={[{ bold: "AI Application Development", text: ": Hands-on experience with enterprise AI workflows and NLP pipelines." }]} />
                                </Entry>
                                <Entry title="Cyber Crime Police Station" subtitle="Data Analyst" right1="Osmanabad, India" right2="Oct. 2023 – Jan. 2024">
                                    <BulletList items={[{ bold: "Data Management", text: ": Managed National Cyber Crime Reporting Portal user credentials and complaint data." }]} />
                                </Entry>
                            </Section>

                            {/* Projects */}
                            <Section title="Projects">
                                {[
                                    { name: "Aegis — Regulatory Compliance Intelligence Suite", stack: "React, FastAPI, LangChain, LangGraph, Azure OpenAI, pgvector, Docker", desc: "Production multi-module platform automating BSE/SEBI/RBI monitoring. Saved 250+ FTE hours/quarter." },
                                    { name: "Equity Pulse — Enterprise Equity Analytics", stack: "React, TypeScript, FastAPI, Azure PostgreSQL, APScheduler, Recharts", desc: "End-to-end equity analytics tracking 5 Adani BUs with automated ETL and 3.9M+ investor records." },
                                    { name: "Quantus Med — Multimodal AI Diagnostic", stack: "React-Vite, FastAPI, LangChain, Groq LPU, Llama-3, Whisper", desc: "Clinical AI platform fusing DICOM imagery with voice dictation to generate SOAP reports in <500ms." },
                                    { name: "Doc Capture — Intelligent Document API", stack: "Python, FastAPI, Groq LLM, PyMuPDF, Docker", desc: "Automated extraction from Aadhaar, PAN, DL, Voter ID, invoices with Excel/JSON export." },
                                    { name: "OmniQA-Agent — Autonomous QA Orchestrator", stack: "Streamlit, Playwright, LangChain, Groq (Llama-4), Openpyxl", desc: "Autonomous QA platform auto-generating user stories, test plans and Jira-ready workbooks." },
                                ].map((p, i) => (
                                    <div key={i} className="mb-3">
                                        <p className="text-sm"><span className="font-bold text-neutral-900 dark:text-white">{p.name}</span> — <span className="italic text-neutral-500 text-xs">{p.stack}</span></p>
                                        <p className="text-xs text-neutral-600 dark:text-neutral-400 ml-2">• {p.desc}</p>
                                    </div>
                                ))}
                            </Section>

                            {/* Skills */}
                            <Section title="Technical Skills">
                                {[
                                    { cat: "AI/ML", val: "LangChain, LangGraph, RAG, Multi-Agent Architectures, Azure OpenAI, Groq LPU, Llama-3/4, Phi-3, Whisper, Cohere, Prompt Engineering, Fine-Tuning" },
                                    { cat: "Vector DBs", val: "pgvector (Azure PostgreSQL), ChromaDB, FAISS" },
                                    { cat: "Backend", val: "Python, FastAPI, PostgreSQL, SQLite, REST APIs, Async, Nginx, Docker, Playwright" },
                                    { cat: "Frontend", val: "React, TypeScript, Tailwind CSS, Streamlit" },
                                    { cat: "Cloud & DevOps", val: "Azure (OpenAI, AD SSO, Key Vault, PostgreSQL, VM, AI Foundry), Docker, APScheduler, GitLab" },
                                    { cat: "Security", val: "RBAC, Azure Key Vault, TLS, AES-256, SQL Injection Prevention, AI Agent Observability" },
                                ].map((s, i) => (
                                    <p key={i} className="text-sm mb-1"><span className="font-bold">{s.cat}:</span> {s.val}</p>
                                ))}
                            </Section>

                            {/* Awards */}
                            <Section title="Awards & Recognition">
                                <p className="text-sm"><span className="font-bold">GreenRatna — Performance of the Month</span> (December 2025), Adani Green Energy Limited: Recognized by AGEL leadership for designing impactful AI portals. Appreciated by Hon'ble Chairman Shri Gautam Adani.</p>
                            </Section>

                            {/* Certifications */}
                            <Section title="Certifications">
                                <p className="text-sm">CCSK v4.1 Foundation Training — Cloud Security | Cloud Computing Fundamentals | AICTE-Cisco Cyber Security Virtual Internship | Google for Developers Cloud Bootcamp (GeeksforGeeks)</p>
                            </Section>
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

// Helper Components
function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="mb-5">
            <h2 className="text-base font-bold uppercase tracking-widest text-neutral-900 dark:text-white border-b border-neutral-300 dark:border-white/20 pb-1 mb-3">{title}</h2>
            {children}
        </div>
    )
}

function Entry({ title, subtitle, right1, right2, children }: { title: string; subtitle: string; right1: string; right2: string; children?: React.ReactNode }) {
    return (
        <div className="mb-4">
            <div className="flex flex-wrap justify-between items-start gap-1">
                <span className="font-bold text-neutral-900 dark:text-white text-sm">{title}</span>
                <span className="text-xs text-neutral-500">{right1}</span>
            </div>
            <div className="flex flex-wrap justify-between items-start gap-1">
                <span className="italic text-xs text-neutral-600 dark:text-neutral-400">{subtitle}</span>
                <span className="text-xs text-neutral-500">{right2}</span>
            </div>
            {children}
        </div>
    )
}

function BulletList({ items }: { items: { bold: string; text: string }[] }) {
    return (
        <ul className="mt-1 ml-2 space-y-0.5">
            {items.map((item, i) => (
                <li key={i} className="text-xs text-neutral-700 dark:text-neutral-300">
                    • <strong>{item.bold}</strong>{item.text}
                </li>
            ))}
        </ul>
    )
}
