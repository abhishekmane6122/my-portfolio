// Detailed project data for case studies
import { ProjectDetailed } from '@/types/schema'

export const detailedProjects: ProjectDetailed[] = [
    {
        id: 'bse-rag-project',
        slug: 'bse-rag-project',
        title: 'BSE India PDF RAG Processor',
        tagline: 'Intelligent automation platform for processing corporate announcements from Bombay Stock Exchange',
        banner: '/projects/bse-rag-banner.jpg',

        problem: `Manual oversight of fragmented corporate announcement data from BSE was a critical bottleneck. Organizations needed to monitor thousands of PDF documents daily from multiple companies, extract relevant information, and generate actionable insights. The manual process was:
    
- Time-consuming (3-4 hours daily per analyst)
- Error-prone due to human fatigue
- Inconsistent in quality and coverage
- Unable to scale with growing data volume
- Lacked historical trend analysis`,

        solution: `Engineered a comprehensive end-to-end automation system that:

1. **Automated PDF Collection**: Browser automation using Playwright to download PDFs from BSE website with intelligent duplicate detection
2. **Intelligent Text Extraction**: Dual-method extraction (PyPDF2 + OCR fallback) ensuring 100% text capture from both digital and scanned documents
3. **RAG-Powered Analysis**: Implemented Retrieval-Augmented Generation using ChromaDB vector database and Phi-3 LLM for contextual understanding
4. **Automated Reporting**: Generated structured Excel reports with daily, weekly, and monthly trend analysis
5. **Real-time Monitoring**: Built FastAPI web interface for system monitoring and data access`,

        role: 'Lead AI/ML Engineer & Full Stack Developer',
        duration: '3 months (Oct 2024 - Dec 2024)',
        team: ['Solo project with stakeholder collaboration'],

        techStack: [
            {
                category: 'Backend & AI/ML',
                technologies: ['Python', 'FastAPI', 'Playwright', 'PyPDF2', 'Tesseract OCR', 'ChromaDB', 'Sentence Transformers', 'Phi-3 LLM']
            },
            {
                category: 'Data & Storage',
                technologies: ['SQLite', 'Vector Database', 'OpenPyXL']
            },
            {
                category: 'DevOps & Tools',
                technologies: ['Docker', 'Git', 'SMTP Email Integration']
            }
        ],

        challenges: [
            {
                title: 'Handling Mixed PDF Formats',
                description: 'BSE announcements came in various formats - some were digital PDFs with selectable text, others were scanned images. A single extraction method would fail on ~40% of documents.',
                solution: 'Implemented a dual-extraction pipeline with PyPDF2 as primary method and Tesseract OCR as intelligent fallback. Added quality validation to automatically switch methods based on extraction success rate.'
            },
            {
                title: 'Vector Database Performance',
                description: 'Initial implementation with naive chunking strategy resulted in poor retrieval accuracy (< 60%) and slow query times (> 5 seconds per document).',
                solution: 'Optimized chunking algorithm with semantic boundary detection, implemented efficient embedding caching, and fine-tuned ChromaDB parameters. Achieved 92% retrieval accuracy with < 500ms query time.'
            },
            {
                title: 'LLM Hallucination Control',
                description: 'Early versions of the summary generation produced factually incorrect information in ~15% of cases, which was unacceptable for regulatory compliance.',
                solution: 'Implemented RAG-based grounding with strict prompt engineering, added fact-checking layer using source text validation, and introduced confidence scoring to flag uncertain summaries for human review.'
            }
        ],

        results: [
            {
                metric: 'Time Savings',
                value: '1,000+ hours/year',
                description: 'Reduced manual BSE monitoring from 3.5 hours/day to zero'
            },
            {
                metric: 'Processing Speed',
                value: '< 2 minutes',
                description: 'Average time to process, analyze, and generate report for 50+ PDFs'
            },
            {
                metric: 'Accuracy',
                value: '92%',
                description: 'RAG retrieval accuracy for relevant context extraction'
            },
            {
                metric: 'Coverage',
                value: '100%',
                description: 'Successfully processed all PDF formats (digital + scanned)'
            },
            {
                metric: 'Automation',
                value: '100%',
                description: 'Fully automated end-to-end pipeline from download to email delivery'
            }
        ],

        images: [
            '/projects/bse-rag-architecture.png',
            '/projects/bse-rag-pipeline.png',
            '/projects/bse-rag-dashboard.png'
        ],

        videos: [],

        codeSnippets: [
            {
                title: 'RAG Query Implementation',
                language: 'python',
                code: `def query_rag_system(query_text: str, collection_name: str) -> str:
    """
    Query the RAG system with intelligent context retrieval
    """
    # Generate query embedding
    query_embedding = embedding_model.encode(query_text)
    
    # Retrieve relevant chunks from vector database
    results = chroma_client.query(
        collection_name=collection_name,
        query_embeddings=[query_embedding],
        n_results=5,
        include=['documents', 'metadatas', 'distances']
    )
    
    # Build context from retrieved chunks
    context = "\\n\\n".join(results['documents'][0])
    
    # Generate response using LLM with grounded context
    prompt = f"""Based on the following context, answer the question.
    
Context: {context}

Question: {query_text}

Answer:"""
    
    response = llm.generate(prompt, max_tokens=500)
    return response`
            },
            {
                title: 'Dual Text Extraction Pipeline',
                language: 'python',
                code: `def extract_text_from_pdf(pdf_path: str) -> str:
    """
    Extract text using PyPDF2 with OCR fallback
    """
    try:
        # Primary: Digital text extraction
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            text = ""
            for page in pdf_reader.pages[:6]:  # First 6 pages
                text += page.extract_text()
        
        # Validate extraction quality
        if len(text.strip()) < 100:
            raise ValueError("Insufficient text extracted")
            
        return text
        
    except Exception as e:
        # Fallback: OCR for scanned documents
        logger.info(f"Falling back to OCR for {pdf_path}")
        return extract_text_with_ocr(pdf_path)`
            }
        ],

        liveUrl: undefined,
        githubUrl: undefined,

        testimonial: {
            text: 'This automation system transformed our regulatory compliance workflow. What used to take our team hours every day now happens automatically with higher accuracy. The AI-generated summaries are remarkably accurate and have helped us identify critical announcements much faster.',
            author: 'Secretarial Department Head',
            role: 'Adani Group'
        },
        flowDiagram: {
            title: "BSE RAG Pipeline Architecture",
            height: "1200px",
            nodes: [
                { id: "A", data: { label: "Web Interface" }, position: { x: 250, y: 0 } },
                { id: "B", data: { label: "Playwright Engine" }, position: { x: 250, y: 80 }, className: "bg-accent-blue/10 border-accent-blue/50" },
                { id: "C", data: { label: "BSE Website" }, position: { x: 250, y: 160 } },
                { id: "D", data: { label: "PDF Collection" }, position: { x: 250, y: 240 } },
                { id: "E", data: { label: "Storage Layer" }, position: { x: 250, y: 320 } },
                { id: "F", data: { label: "Text Extraction" }, position: { x: 250, y: 400 }, className: "bg-accent-gold/10 border-accent-gold/50" },
                { id: "G", data: { label: "Digital PDF" }, position: { x: 150, y: 480 } },
                { id: "H", data: { label: "OCR Scanned" }, position: { x: 350, y: 480 } },
                { id: "I", data: { label: "Text Processing" }, position: { x: 250, y: 560 } },
                { id: "J", data: { label: "Chunking Engine" }, position: { x: 250, y: 640 } },
                { id: "K", data: { label: "Embedding Model" }, position: { x: 250, y: 720 } },
                { id: "L", data: { label: "Vector Database" }, position: { x: 250, y: 800 }, className: "bg-accent-blue/10 border-accent-blue/50" },
                { id: "M", data: { label: "RAG Retrieval" }, position: { x: 250, y: 880 } },
                { id: "N", data: { label: "LLM (Phi-3)" }, position: { x: 250, y: 960 }, className: "bg-accent-gold/10 border-accent-gold/50" },
                { id: "O", data: { label: "Subject Analysis" }, position: { x: 150, y: 1040 } },
                { id: "P", data: { label: "Summary Generation" }, position: { x: 350, y: 1040 } },
                { id: "Q", data: { label: "Report Generation" }, position: { x: 250, y: 1120 } },
                { id: "R", data: { label: "Excel Output" }, position: { x: 100, y: 1200 } },
                { id: "S", data: { label: "SQLite DB" }, position: { x: 250, y: 1200 } },
                { id: "T", data: { label: "Email Alert" }, position: { x: 400, y: 1200 } }
            ],
            edges: [
                { id: "ab", source: "A", target: "B", animated: true },
                { id: "bc", source: "B", target: "C" },
                { id: "cd", source: "C", target: "D" },
                { id: "de", source: "D", target: "E" },
                { id: "ef", source: "E", target: "F" },
                { id: "fg", source: "F", target: "G" },
                { id: "fh", source: "F", target: "H" },
                { id: "gi", source: "G", target: "I" },
                { id: "hi", source: "H", target: "I" },
                { id: "ij", source: "I", target: "J" },
                { id: "jk", source: "J", target: "K" },
                { id: "kl", source: "K", target: "L" },
                { id: "lm", source: "L", target: "M" },
                { id: "mn", source: "M", target: "N" },
                { id: "no", source: "N", target: "O" },
                { id: "np", source: "N", target: "P" },
                { id: "oq", source: "O", target: "Q" },
                { id: "pq", source: "P", target: "Q" },
                { id: "qr", source: "Q", target: "R", animated: true },
                { id: "qs", source: "Q", target: "S" },
                { id: "qt", source: "Q", target: "T", animated: true }
            ]
        }
    },

    {
        id: 'aegis-platform',
        slug: 'aegis-platform',
        title: 'AEGIS - Regulatory Surveillance Platform',
        tagline: 'Centralized multi-agent system for automated regulatory compliance and corporate governance',
        banner: '/projects/aegis-banner.jpg',

        problem: `Adani Group's Secretarial and Legal departments faced critical challenges in regulatory compliance:

- **Fragmented Data Sources**: Monitoring BSE, SEBI, and RBI notifications across multiple platforms
- **Manual Disclosure Process**: Directors' disclosures and family information management was entirely manual, taking 4+ hours per disclosure
- **Insider Trading Compliance**: Tracking 3.9M+ investor positions across 6 companies manually was error-prone
- **Meeting Minutes Preparation**: Board meeting minutes took 4 hours to prepare manually
- **High Regulatory Risk**: Manual processes led to potential compliance gaps and delayed reporting`,

        solution: `Architected and developed a comprehensive multi-agent surveillance platform with:

1. **Regulatory Intelligence Agents**: Automated monitoring of BSE, SEBI, and RBI notifications with AI-powered summarization
2. **Directors Disclosure Module**: Centralized director master data with family information, PAN document management, and fuzzy name matching
3. **Insider Trading Monitor**: Real-time tracking of shareholding changes across 3.9M+ investors with automated compliance reporting
4. **AI-Powered Minutes Generator**: Template-based automation for board meeting minutes with smart placeholder replacement
5. **Enterprise Security**: Azure AD SSO integration with role-based access control and Private Network Access (PNA) compliance`,

        role: 'Full Stack Developer & System Architect',
        duration: '4 months (Aug 2024 - Nov 2024)',
        team: ['2 developers', '1 QA engineer', '3 business stakeholders'],

        techStack: [
            {
                category: 'Frontend',
                technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Recharts']
            },
            {
                category: 'Backend',
                technologies: ['FastAPI', 'Python', 'SQLite', 'Groq LLM', 'python-docx']
            },
            {
                category: 'Infrastructure',
                technologies: ['Nginx', 'Azure AD SSO', 'Docker']
            },
            {
                category: 'AI/ML',
                technologies: ['Groq LLM', 'RAG', 'Fuzzy Name Matching']
            }
        ],

        challenges: [
            {
                title: 'Private Network Access (PNA) Security Blocks',
                description: 'Upon UAT deployment, browser blocked all requests from public URL to internal backend IP due to "Private Network Access" policy, breaking the entire application.',
                solution: 'Configured Nginx to inject specific headers (Access-Control-Allow-Private-Network: true) and implemented robust OPTIONS preflight handler. Restored full functionality while maintaining strict security compliance.'
            },
            {
                title: 'Data Filtering Logic Inconsistency',
                description: 'Agent Organogram reported inflated notification counts (112 vs actual 32) due to ingestion of placeholder "NIL" entries in the excel-to-DB pipeline.',
                solution: 'Refactored backend analytics engine with selective SQL predicates: WHERE NOT (pdf_link = \'NIL\' AND summary = \'NIL\'). Normalized reporting accuracy by 71%.'
            },
            {
                title: 'Multi-Source Insider Trading Data Aggregation',
                description: 'Insider trading data scattered across 6 different SQLite databases (one per company), making aggregation complex with 8-second API response times.',
                solution: 'Implemented parallel database query system using asyncio and ThreadPoolExecutor with intelligent caching. Reduced API response time from 8 seconds to under 500ms.'
            },
            {
                title: 'Enterprise UI Without External Assets',
                description: 'Requirement for "Premium Enterprise UI" but strict ban on external icons, emojis, or CDN-linked assets for security reasons.',
                solution: 'Leveraged Framer Motion for micro-animations and custom Tailwind CSS utilities for Glassmorphism effect. Engineered custom IntersectionObserver-based Scroll-Spy for long documentation.'
            }
        ],

        results: [
            {
                metric: 'FTE Hours Saved',
                value: '250+ hours/quarter',
                description: 'Reduced manual work across all compliance modules'
            },
            {
                metric: 'Disclosure Time',
                value: '60% reduction',
                description: 'Directors disclosure preparation time cut from 4 hours to 90 minutes'
            },
            {
                metric: 'Minutes Preparation',
                value: '15 minutes',
                description: 'Board meeting minutes generation reduced from 4 hours to 15 minutes'
            },
            {
                metric: 'API Performance',
                value: '94% faster',
                description: 'Multi-database aggregation optimized from 8s to 500ms'
            },
            {
                metric: 'Compliance Accuracy',
                value: '100%',
                description: 'Zero missed regulatory deadlines with real-time SEBI/RBI updates'
            },
            {
                metric: 'Data Quality',
                value: '71% improvement',
                description: 'Normalized reporting accuracy through intelligent filtering'
            }
        ],

        images: [
            '/projects/aegis-architecture.png',
            '/projects/aegis-dashboard.png',
            '/projects/aegis-directors.png',
            '/projects/aegis-insider-trading.png'
        ],

        videos: [],

        codeSnippets: [
            {
                title: 'Parallel Database Aggregation',
                language: 'python',
                code: `async def aggregate_insider_trading_data():
    """
    Aggregate data across 6 company databases in parallel
    """
    companies = ['adani_green_energy', 'adani_ports', 'adani_power', 
                 'adani_transmission', 'adani_total_gas', 'adani_wilmar']
    
    async def query_company_db(company: str):
        with ThreadPoolExecutor() as executor:
            return await asyncio.get_event_loop().run_in_executor(
                executor, 
                lambda: fetch_company_data(company)
            )
    
    # Parallel execution
    results = await asyncio.gather(*[
        query_company_db(company) for company in companies
    ])
    
    # Aggregate results
    summary = defaultdict(int)
    for result in results:
        for key, value in result.items():
            summary[key] += value
    
    return summary`
            },
            {
                title: 'Enhanced Indian Name Matcher',
                language: 'python',
                code: `class EnhancedIndianNameMatcher:
    """
    Fuzzy matching for Indian names with common variations
    """
    def normalize_name(self, name: str) -> str:
        # Remove titles and honorifics
        name = re.sub(r'\\b(Mr|Mrs|Ms|Dr|Prof)\\.?\\s*', '', name, flags=re.I)
        
        # Handle initials (e.g., "A. Kumar" -> "Kumar")
        name = re.sub(r'\\b[A-Z]\\.\\s*', '', name)
        
        # Normalize whitespace
        name = ' '.join(name.split())
        
        return name.lower().strip()
    
    def match(self, name1: str, name2: str, threshold: float = 0.85) -> bool:
        norm1 = self.normalize_name(name1)
        norm2 = self.normalize_name(name2)
        
        # Calculate similarity using Levenshtein distance
        similarity = fuzz.ratio(norm1, norm2) / 100.0
        
        return similarity >= threshold`
            }
        ],

        liveUrl: undefined,
        githubUrl: undefined,

        testimonial: {
            text: 'AEGIS has revolutionized our compliance workflow. The automated director disclosures and insider trading monitoring have eliminated manual errors and saved our team hundreds of hours. The system\'s ability to aggregate data from multiple sources in real-time is impressive.',
            author: 'Legal & Compliance Manager',
            role: 'Adani Group'
        },
        flowDiagrams: [
            {
                title: "Complete System Architecture",
                height: "800px",
                nodes: [
                    { id: "users", data: { label: "👥 Users" }, position: { x: 300, y: 0 } },
                    { id: "frontend", data: { label: "🖥️ Frontend (React/TS)" }, position: { x: 300, y: 100 }, className: "bg-accent-blue/10 border-accent-blue/50" },
                    { id: "api", data: { label: "⚙️ API Gateway (FastAPI)" }, position: { x: 300, y: 200 }, className: "bg-accent-gold/10 border-accent-gold/50" },
                    
                    { id: "mod_reg", data: { label: "Regulatory Modules\n(BSE, SEBI, RBI)" }, position: { x: 100, y: 350 }, style: { width: 150, height: 100 } },
                    { id: "mod_gov", data: { label: "Governance Modules\n(Insider, Directors)" }, position: { x: 300, y: 350 }, style: { width: 150, height: 100 } },
                    { id: "mod_ai", data: { label: "AI Services\n(RAG, Minutes)" }, position: { x: 500, y: 350 }, style: { width: 150, height: 100 } },

                    { id: "db", data: { label: "🗄️ PostgreSQL" }, position: { x: 200, y: 550 }, className: "bg-accent-blue/10 border-accent-blue/50" },
                    { id: "storage", data: { label: "📁 File Storage" }, position: { x: 400, y: 550 } },
                    { id: "azure", data: { label: "☁️ Azure OpenAI" }, position: { x: 500, y: 480 }, className: "bg-accent-gold/10 border-accent-gold/50" }
                ],
                edges: [
                    { id: "u-f", source: "users", target: "frontend", animated: true },
                    { id: "f-a", source: "frontend", target: "api", animated: true },
                    { id: "a-r", source: "api", target: "mod_reg" },
                    { id: "a-g", source: "api", target: "mod_gov" },
                    { id: "a-i", source: "api", target: "mod_ai" },
                    { id: "r-d", source: "mod_reg", target: "db" },
                    { id: "g-d", source: "mod_gov", target: "db" },
                    { id: "g-s", source: "mod_gov", target: "storage" },
                    { id: "i-d", source: "mod_ai", target: "db" },
                    { id: "i-s", source: "mod_ai", target: "storage" },
                    { id: "i-a", source: "mod_ai", target: "azure", animated: true }
                ]
            },
            {
                title: "Data Flow Architecture",
                height: "600px",
                nodes: [
                    { id: "src", data: { label: "📡 Data Sources\n(BSE, SEBI, RBI)" }, position: { x: 0, y: 150 } },
                    { id: "ing", data: { label: "📥 Ingestion\n(Collector, Validator)" }, position: { x: 200, y: 150 }, className: "bg-accent-gold/10 border-accent-gold/50" },
                    { id: "proc", data: { label: "⚙️ Processing\n(Analytics, AI)" }, position: { x: 400, y: 150 }, className: "bg-accent-blue/10 border-accent-blue/50" },
                    { id: "store", data: { label: "💾 Storage\n(Postgres, Files)" }, position: { x: 600, y: 150 } },
                    { id: "del", data: { label: "📤 Delivery\n(Dashboards, Alerts)" }, position: { x: 800, y: 150 } }
                ],
                edges: [
                    { id: "e1", source: "src", target: "ing", animated: true },
                    { id: "e2", source: "ing", target: "proc", animated: true },
                    { id: "e3", source: "proc", target: "store" },
                    { id: "e4", source: "store", target: "del", animated: true }
                ]
            },
            {
                title: "Technology Stack",
                height: "500px",
                nodes: [
                    { id: "ui", data: { label: "🎨 UI: React 18, TS, Tailwind" }, position: { x: 100, y: 100 }, className: "bg-accent-blue/10 border-accent-blue/50" },
                    { id: "api", data: { label: "⚙️ API: FastAPI, Python" }, position: { x: 100, y: 200 }, className: "bg-accent-gold/10 border-accent-gold/50" },
                    { id: "ai", data: { label: "🤖 AI: Azure OpenAI, RAG" }, position: { x: 400, y: 150 } },
                    { id: "data", data: { label: "🗄️ Data: PostgreSQL" }, position: { x: 100, y: 300 } },
                    { id: "infra", data: { label: "🏗️ Infra: Nginx, Uvicorn" }, position: { x: 400, y: 250 } }
                ],
                edges: [
                    { id: "s1", source: "ui", target: "api" },
                    { id: "s2", source: "api", target: "ai" },
                    { id: "s3", source: "api", target: "data" },
                    { id: "s4", source: "api", target: "infra" }
                ]
            }
        ]
    }
];

export function getProjectBySlug(slug: string): ProjectDetailed | undefined {
    return detailedProjects.find(project => project.slug === slug)
}

export function getAllProjectSlugs(): string[] {
    return detailedProjects.map(project => project.slug)
}
