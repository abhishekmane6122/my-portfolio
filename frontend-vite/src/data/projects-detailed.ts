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
        mermaidDiagrams: [
            {
                title: "Complete System Architecture",
                chart: `flowchart TB
    subgraph Users["👥 USERS"]
        direction LR
        Compliance["Compliance<br/>Officer"]
        Secretary["Company<br/>Secretary"]
        Legal["Legal<br/>Team"]
        Management["Senior<br/>Management"]
    end

    subgraph Frontend["🖥️ FRONTEND - React Application"]
        direction TB
        Landing["Landing Page"]
        
        subgraph Dashboards["Dashboards"]
            BSEDash["BSE Dashboard"]
            SEBIDash["SEBI Dashboard"]
            RBIDash["RBI Dashboard"]
        end
        
        subgraph Modules["Feature Modules"]
            InsiderUI["Insider Trading"]
            DirectorsUI["Directors Disclosure"]
            MinutesUI["Minutes Generator"]
        end
        
        ChatUI["AI Chatbot"]
    end

    subgraph Backend["⚙️ BACKEND - FastAPI"]
        direction TB
        
        subgraph APIRoutes["API Routes"]
            BSERoute["/bse-alerts"]
            SEBIRoute["/sebi-analysis"]
            RBIRoute["/rbi-analysis"]
            InsiderRoute["/insider-trading"]
            DirectorsRoute["/directors"]
            MinutesRoute["/minutes"]
            AIRoute["/ai-assistant"]
            ChatRoute["/chat"]
        end
        
        subgraph Services["Services"]
            LLMService["LLM Service"]
            DocProcessor["Document Processor"]
            NameMatcher["Name Matcher"]
        end
    end

    subgraph Chatbot["🤖 CHATBOT ENGINE - 4-Layer RAG"]
        direction TB
        Orchestrator["Orchestrator"]
        Router["Query Router"]
        LLMLayer["LLM Layer"]
        DataLayer["Data Layer"]
    end

    subgraph Database["🗄️ DATABASE - PostgreSQL"]
        direction LR
        NotifDB[("Notifications")]
        SEBIDB[("SEBI Data")]
        RBIDB[("RBI Data")]
        DirectorsDB[("Directors")]
        PlacesDB[("Places")]
    end

    subgraph Storage["📁 FILE STORAGE"]
        direction LR
        Disclosures["Disclosure<br/>Documents"]
        Templates["Meeting<br/>Templates"]
        Generated["Generated<br/>Minutes"]
    end

    subgraph External["☁️ EXTERNAL SERVICES"]
        AzureAI["Azure OpenAI<br/>GPT-4"]
    end

    %% User to Frontend connections
    Compliance --> Landing
    Secretary --> Landing
    Legal --> Landing
    Management --> Landing

    %% Frontend navigation
    Landing --> Dashboards
    Landing --> Modules
    Landing --> ChatUI

    %% Dashboard to API
    BSEDash --> BSERoute
    SEBIDash --> SEBIRoute
    RBIDash --> RBIRoute

    %% Modules to API
    InsiderUI --> InsiderRoute
    DirectorsUI --> DirectorsRoute
    MinutesUI --> MinutesRoute
    MinutesUI --> AIRoute

    %% Chat flow
    ChatUI --> ChatRoute
    ChatRoute --> Orchestrator
    Orchestrator --> Router
    Router --> DataLayer
    Router --> LLMLayer
    LLMLayer --> AzureAI
    DataLayer --> Database

    %% API to Database
    BSERoute --> NotifDB
    SEBIRoute --> SEBIDB
    RBIRoute --> RBIDB
    DirectorsRoute --> DirectorsDB
    MinutesRoute --> PlacesDB

    %% API to Services
    DirectorsRoute --> LLMService
    DirectorsRoute --> DocProcessor
    DirectorsRoute --> NameMatcher
    AIRoute --> LLMService

    %% Services to External
    LLMService --> AzureAI

    %% File Storage connections
    DirectorsRoute --> Disclosures
    MinutesRoute --> Templates
    AIRoute --> Generated
    DocProcessor --> Disclosures

    %% Styling
    style Users fill:#f0fdf4,stroke:#16a34a,stroke-width:2px
    style Frontend fill:#eff6ff,stroke:#2563eb,stroke-width:2px
    style Backend fill:#fef3c7,stroke:#d97706,stroke-width:2px
    style Chatbot fill:#f3e8ff,stroke:#9333ea,stroke-width:2px
    style Database fill:#fee2e2,stroke:#dc2626,stroke-width:2px
    style Storage fill:#e0f2fe,stroke:#0284c7,stroke-width:2px
    style External fill:#ecfdf5,stroke:#059669,stroke-width:2px`
            },
            {
                title: "Data Flow Architecture",
                chart: `flowchart LR
    subgraph Sources["📡 DATA SOURCES"]
        BSEFeed["BSE Feed"]
        SEBIFeed["SEBI Portal"]
        RBIFeed["RBI Website"]
        UserDocs["User Documents"]
        Transcripts["Meeting Transcripts"]
    end

    subgraph Ingestion["📥 INGESTION"]
        Collector["Data Collector"]
        Parser["Document Parser"]
        Validator["Data Validator"]
    end

    subgraph Processing["⚙️ PROCESSING"]
        Analytics["Analytics Engine"]
        AIProcessor["AI Processor"]
        Summarizer["Summarizer"]
    end

    subgraph Storage2["💾 STORAGE"]
        PostgreSQL[("PostgreSQL<br/>Database")]
        FileStore[("File<br/>Storage")]
    end

    subgraph Delivery["📤 DELIVERY"]
        Dashboard["Dashboards"]
        Reports["Reports"]
        Alerts["Alerts"]
        Chat["Chatbot"]
    end

    subgraph Consumers["👥 CONSUMERS"]
        Users2["Business Users"]
    end

    BSEFeed --> Collector
    SEBIFeed --> Collector
    RBIFeed --> Collector
    UserDocs --> Parser
    Transcripts --> Parser

    Collector --> Validator
    Parser --> Validator
    Validator --> Analytics
    Validator --> PostgreSQL

    Analytics --> Summarizer
    Summarizer --> AIProcessor
    AIProcessor --> PostgreSQL
    AIProcessor --> FileStore

    PostgreSQL --> Dashboard
    PostgreSQL --> Reports
    PostgreSQL --> Chat
    FileStore --> Reports
    Analytics --> Alerts

    Dashboard --> Users2
    Reports --> Users2
    Alerts --> Users2
    Chat --> Users2

    style Sources fill:#dbeafe,stroke:#2563eb
    style Ingestion fill:#fef9c3,stroke:#ca8a04
    style Processing fill:#f3e8ff,stroke:#9333ea
    style Storage2 fill:#fee2e2,stroke:#dc2626
    style Delivery fill:#dcfce7,stroke:#16a34a
    style Consumers fill:#f0fdf4,stroke:#16a34a`
            },
            {
                title: "Module Integration Architecture",
                chart: `flowchart TB
    subgraph Platform["🏛️ AEGIS PLATFORM"]
        direction TB
        
        subgraph Layer1["Presentation Layer"]
            Web["React Web App"]
            Chat["AI Chatbot"]
        end
        
        subgraph Layer2["API Layer"]
            Gateway["API Gateway<br/>FastAPI"]
        end
        
        subgraph Layer3["Business Logic Layer"]
            direction LR
            
            subgraph Regulatory["Regulatory Modules"]
                BSE["BSE<br/>Analysis"]
                SEBI["SEBI<br/>Analysis"]
                RBI["RBI<br/>Analysis"]
            end
            
            subgraph Governance["Governance Modules"]
                Insider["Insider<br/>Trading"]
                Directors["Directors<br/>Disclosure"]
                Minutes["Minutes<br/>Generator"]
            end
            
            subgraph AI["AI Services"]
                LLM["LLM<br/>Service"]
                RAG["RAG<br/>Engine"]
            end
        end
        
        subgraph Layer4["Data Layer"]
            DB[("PostgreSQL")]
            Files[("File Storage")]
        end
    end
    
    subgraph Cloud["☁️ AZURE CLOUD"]
        OpenAI["Azure OpenAI"]
    end

    Web --> Gateway
    Chat --> Gateway
    
    Gateway --> BSE
    Gateway --> SEBI
    Gateway --> RBI
    Gateway --> Insider
    Gateway --> Directors
    Gateway --> Minutes
    Gateway --> RAG
    
    BSE --> DB
    SEBI --> DB
    RBI --> DB
    Insider --> DB
    Directors --> DB
    Directors --> Files
    Minutes --> DB
    Minutes --> Files
    
    Directors --> LLM
    Minutes --> LLM
    RAG --> LLM
    LLM --> OpenAI
    RAG --> DB

    style Platform fill:#f8fafc,stroke:#1e293b,stroke-width:3px
    style Layer1 fill:#dbeafe,stroke:#2563eb
    style Layer2 fill:#fef3c7,stroke:#d97706
    style Layer3 fill:#f0fdf4,stroke:#16a34a
    style Layer4 fill:#fee2e2,stroke:#dc2626
    style Cloud fill:#ecfdf5,stroke:#059669`
            },
            {
                title: "Request Flow Architecture",
                chart: `sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API Gateway
    participant S as Service
    participant D as Database
    participant AI as Azure OpenAI
    
    rect rgb(240, 253, 244)
        Note over U,F: User Interface
        U->>F: Open Dashboard
        F->>F: Render UI
    end
    
    rect rgb(254, 243, 199)
        Note over F,A: API Request
        F->>A: GET /api/data
        A->>A: Validate Request
    end
    
    rect rgb(243, 232, 255)
        Note over A,S: Business Logic
        A->>S: Process Request
        S->>D: Query Data
        D-->>S: Return Data
    end
    
    rect rgb(236, 253, 245)
        Note over S,AI: AI Processing (if needed)
        S->>AI: Generate Summary
        AI-->>S: AI Response
    end
    
    rect rgb(219, 234, 254)
        Note over S,U: Response
        S-->>A: Processed Data
        A-->>F: JSON Response
        F-->>U: Display Results
    end`
            },
            {
                title: "Technology Stack Architecture",
                chart: `flowchart TB
    subgraph Stack["AEGIS Technology Stack"]
        direction TB
        
        subgraph UI["🎨 User Interface"]
            React["React 18"]
            TS["TypeScript"]
            Tailwind["TailwindCSS"]
            Shadcn["shadcn/ui"]
            Recharts["Recharts"]
        end
        
        subgraph Build["🔧 Build Tools"]
            Vite["Vite"]
            NPM["NPM"]
        end
        
        subgraph API["⚙️ Backend API"]
            FastAPI["FastAPI"]
            Python["Python 3.8+"]
            SQLAlchemy["SQLAlchemy"]
            Pydantic["Pydantic"]
        end
        
        subgraph Data["🗄️ Data Storage"]
            PostgreSQL2["PostgreSQL"]
            FileSystem["File System"]
        end
        
        subgraph AIStack["🤖 AI/ML"]
            AzureOpenAI2["Azure OpenAI"]
            Embeddings["Text Embeddings"]
            RAG2["RAG Pipeline"]
        end
        
        subgraph Infra["🏗️ Infrastructure"]
            Uvicorn["Uvicorn"]
            SSL["SSL/TLS"]
            CORS["CORS"]
        end
    end

    React --> Vite
    TS --> React
    Tailwind --> React
    Shadcn --> React
    Recharts --> React
    
    Vite --> FastAPI
    FastAPI --> Python
    FastAPI --> SQLAlchemy
    FastAPI --> Pydantic
    
    SQLAlchemy --> PostgreSQL2
    FastAPI --> FileSystem
    
    FastAPI --> AzureOpenAI2
    AzureOpenAI2 --> Embeddings
    Embeddings --> RAG2
    RAG2 --> PostgreSQL2
    
    FastAPI --> Uvicorn
    Uvicorn --> SSL
    FastAPI --> CORS

    style Stack fill:#f8fafc,stroke:#1e293b,stroke-width:2px
    style UI fill:#dbeafe,stroke:#2563eb
    style Build fill:#fef9c3,stroke:#ca8a04
    style API fill:#fef3c7,stroke:#d97706
    style Data fill:#fee2e2,stroke:#dc2626
    style AIStack fill:#f3e8ff,stroke:#9333ea
    style Infra fill:#e0f2fe,stroke:#0284c7`
            },
            {
                title: "Security Architecture",
                chart: `flowchart TB
    subgraph Security["🔐 Security Architecture"]
        direction TB
        
        subgraph Perimeter["Perimeter Security"]
            HTTPS["HTTPS/SSL"]
            CORS2["CORS Policy"]
            RateLimit["Rate Limiting"]
        end
        
        subgraph Auth["Authentication"]
            AdminAuth["Admin Authentication"]
            Token["Token Validation"]
        end
        
        subgraph DataSec["Data Security"]
            EnvVars["Environment Variables"]
            APIKeys["API Keys Protected"]
            DBAccess["Database Access Control"]
        end
        
        subgraph Validation["Input Validation"]
            PydanticVal["Pydantic Models"]
            Sanitize["Input Sanitization"]
            FileVal["File Validation"]
        end
    end

    HTTPS --> AdminAuth
    CORS2 --> AdminAuth
    RateLimit --> AdminAuth
    
    AdminAuth --> Token
    Token --> PydanticVal
    PydanticVal --> Sanitize
    Sanitize --> FileVal
    
    Token --> EnvVars
    EnvVars --> APIKeys
    APIKeys --> DBAccess

    style Security fill:#fef2f2,stroke:#dc2626,stroke-width:2px
    style Perimeter fill:#fee2e2,stroke:#dc2626
    style Auth fill:#fef3c7,stroke:#d97706
    style DataSec fill:#dcfce7,stroke:#16a34a
    style Validation fill:#dbeafe,stroke:#2563eb`
            },
            {
                title: "Deployment Architecture",
                chart: `flowchart LR
    subgraph Development["💻 Development"]
        LocalDev["Local Development<br/>npm run dev"]
    end
    
    subgraph Build2["🔨 Build"]
        ViteBuild["Vite Build<br/>npm run build"]
    end
    
    subgraph Production["🚀 Production"]
        subgraph Server["Server"]
            FastAPIServer["FastAPI Server<br/>Port 8000"]
            StaticFiles["Static Files<br/>/dist"]
        end
    end
    
    subgraph Access["🌐 Access"]
        Browser["Web Browser"]
    end

    LocalDev --> ViteBuild
    ViteBuild --> StaticFiles
    StaticFiles --> FastAPIServer
    FastAPIServer --> Browser

    style Development fill:#dbeafe,stroke:#2563eb
    style Build2 fill:#fef9c3,stroke:#ca8a04
    style Production fill:#dcfce7,stroke:#16a34a
    style Access fill:#f3e8ff,stroke:#9333ea`
            },
            {
                title: "Complete System View",
                chart: `flowchart TB
    subgraph Complete["🏛️ AEGIS - Complete Architecture"]
        
        U["👥 Users"] --> FE["🖥️ Frontend<br/>React + TypeScript"]
        
        FE --> API["⚙️ API Layer<br/>FastAPI"]
        
        API --> M1["📊 BSE"]
        API --> M2["📈 SEBI"]
        API --> M3["🏦 RBI"]
        API --> M4["🔍 Insider"]
        API --> M5["👔 Directors"]
        API --> M6["📝 Minutes"]
        API --> M7["🤖 Chatbot"]
        
        M1 --> DB["🗄️ PostgreSQL"]
        M2 --> DB
        M3 --> DB
        M4 --> DB
        M5 --> DB
        M5 --> FS["📁 Files"]
        M6 --> DB
        M6 --> FS
        M7 --> DB
        
        M5 --> AI["☁️ Azure OpenAI"]
        M6 --> AI
        M7 --> AI
        
    end

    style Complete fill:#f8fafc,stroke:#1e293b,stroke-width:3px
    style U fill:#f0fdf4,stroke:#16a34a
    style FE fill:#dbeafe,stroke:#2563eb
    style API fill:#fef3c7,stroke:#d97706
    style DB fill:#fee2e2,stroke:#dc2626
    style FS fill:#e0f2fe,stroke:#0284c7
    style AI fill:#ecfdf5,stroke:#059669`
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
