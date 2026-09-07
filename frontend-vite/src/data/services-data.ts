export interface ServiceItem {
  id: string
  title: string
  symbol: string
  priceUsd: string
  priceInr: string
  priceLabel?: string
  popular?: boolean
  badge?: string
  category: 'fullstack' | 'backend' | 'ai-integration' | 'ml-models' | 'analytics' | 'maintenance' | 'training' | 'mentorship'
  tagline: string
  description: string
  features: string[]
  ctaText: string
  ctaType: 'contact' | 'email' | 'external'
  ctaTarget?: string
  color: string
}

export interface TechGroup {
  label: string
  badgeClass: string
  items: string[]
}

export const relevantTechGroups: TechGroup[] = [
  {
    label: 'AI & Agents',
    badgeClass: 'bg-[#d4a373]/15 text-[#8a5827] dark:text-[#d4a373] border-[#d4a373]/30',
    items: [
      'LangChain',
      'LangGraph',
      'RAG Systems',
      'Multi-Agent',
      'Azure OpenAI',
      'Llama-3/4',
      'Prompt Engineering',
      'Fine-Tuning',
    ],
  },
  {
    label: 'Backend & Vectors',
    badgeClass: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/25',
    items: [
      'Python',
      'FastAPI',
      'PostgreSQL',
      'pgvector',
      'ChromaDB',
      'REST APIs',
      'Docker',
    ],
  },
  {
    label: 'Cloud & DevOps',
    badgeClass: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25',
    items: [
      'Azure Cloud',
      'Azure AI Foundry',
      'Key Vault',
      'GitLab CI/CD',
      'Nginx',
    ],
  },
]

export const servicesData: ServiceItem[] = [
  {
    id: 'full-stack-development',
    title: 'Full-Stack Development',
    symbol: '⬡',
    priceUsd: 'From $850',
    priceInr: 'From ₹70,000',
    popular: true,
    badge: 'End-to-End Product',
    category: 'fullstack',
    tagline: 'Production web apps, dashboards, SaaS platforms, and complete MVPs.',
    description:
      'End-to-end product development — React/Next.js frontend, Node.js or Python backend, PostgreSQL database, REST API, and deployment. I own the full stack from concept to launch.',
    features: [
      'Web applications, dashboards & SaaS platforms',
      'TypeScript / Modern React frontend architectures',
      'Database integration (PostgreSQL, Supabase, MySQL)',
      'Auth, roles & multi-tenant third-party integrations',
      'CI/CD pipeline + Docker containerization included',
      '>80% test coverage standard — no runtime surprises',
    ],
    ctaText: 'Discuss a Project →',
    ctaType: 'contact',
    color: '#3b82f6',
  },
  {
    id: 'ai-integration',
    title: 'AI Integration',
    symbol: '◈',
    priceUsd: 'From $650',
    priceInr: 'From ₹55,000',
    popular: true,
    badge: 'Production LLMs & Agents',
    category: 'ai-integration',
    tagline: 'Integrating intelligent capabilities and agentic workflows into products.',
    description:
      'Integrating AI capabilities into existing or new applications — LLM APIs (OpenAI, Anthropic, Gemini, DeepSeek), AI assistants, intelligent automation, document processing and custom AI workflows.',
    features: [
      'RAG pipeline design & document intelligence (PDFs, docs, tables)',
      'LLM API integration (OpenAI, Claude, Gemini, DeepSeek)',
      'Prompt engineering, evaluation workflows & structured output',
      'Autonomous agentic loops & multi-agent routing',
      'Vector search & semantic retrieval (pgvector, Chroma)',
      'Deterministic fallback & guardrails against hallucinations',
    ],
    ctaText: 'Explore AI Options →',
    ctaType: 'contact',
    color: '#10b981',
  },
  {
    id: 'backend-system-design',
    title: 'Backend Development & System Design',
    symbol: '⬕',
    priceUsd: 'From $550',
    priceInr: 'From ₹45,000',
    badge: 'Scalable Architecture',
    category: 'backend',
    tagline: 'High-throughput REST APIs, robust authentication, and rock-solid schemas.',
    description:
      'Scalable, well-documented REST APIs. Whether you need a backend from scratch, a refactor, or third-party integrations — I build systems that handle real traffic and are easy to maintain.',
    features: [
      'REST APIs with comprehensive OpenAPI / Swagger docs',
      'Robust authentication, RBAC & API security',
      'PostgreSQL, MySQL & Supabase schema design',
      'Third-party integrations, CRM webhooks & payment processing',
      'Performance optimization, indexing & query tuning',
      'Event-driven architectures & asynchronous background tasks',
    ],
    ctaText: 'Talk Backend →',
    ctaType: 'contact',
    color: '#f59e0b',
  },
  {
    id: 'ai-ml-models',
    title: 'AI & Machine Learning Models',
    symbol: '⌬',
    priceUsd: 'From $750',
    priceInr: 'From ₹65,000',
    badge: 'Predictive & Custom ML',
    category: 'ml-models',
    tagline: 'Custom ML algorithms, predictive models, and deep learning pipelines.',
    description:
      'Custom ML model development, prediction/classification systems, recommendation engines, data preprocessing, rigorous model evaluation, and production inference deployment.',
    features: [
      'Supervised & unsupervised ML model development',
      'Prediction, forecasting & classification systems',
      'Recommendation engines & ranking algorithms',
      'Feature engineering, data cleaning & preprocessing pipelines',
      'Model evaluation (ROC/AUC, precision, recall, F1) & drift monitoring',
      'Deployment via FastAPI / TorchServe with optimized latency',
    ],
    ctaText: 'Inquire About Models →',
    ctaType: 'contact',
    color: '#8b5cf6',
  },
  {
    id: 'data-analytics-dashboards',
    title: 'Data Analytics & Dashboards',
    symbol: '📊',
    priceUsd: 'From $380',
    priceInr: 'From ₹30,000',
    badge: 'Business Intelligence',
    category: 'analytics',
    tagline: 'Transform raw data into interactive KPI dashboards and actionable insights.',
    description:
      'Data cleaning, exploratory analysis, visualization, interactive KPI dashboards, automated reporting, and actionable business insights that drive strategic decisions.',
    features: [
      'Data cleaning, transformation & automated ETL pipelines',
      'Interactive executive dashboards (React, Chart.js, Recharts)',
      'KPI tracking, revenue metrics & retention analytics',
      'Custom scheduled reports & automated alerts',
      'SQL data warehousing & query optimization',
      'Actionable business recommendations & visualization decks',
    ],
    ctaText: 'Build a Dashboard →',
    ctaType: 'contact',
    color: '#06b6d4',
  },
  {
    id: 'software-maintenance-improvements',
    title: 'Software Maintenance & Code Audit',
    symbol: '◉',
    priceUsd: 'From $280',
    priceInr: 'From ₹22,000',
    badge: 'Fix & Optimize',
    category: 'maintenance',
    tagline: 'Bug fixes, performance improvements, code audits, and feature enhancements.',
    description:
      'I review your existing codebase, identify bottlenecks, bad patterns, and security issues — then provide hands-on bug fixing, feature development, database updates, and speed optimization.',
    features: [
      'Core Web Vitals & Lighthouse performance audit',
      'Database query analysis & N+1 bottleneck elimination',
      'Security review (auth, input validation, vulnerability fixes)',
      'Bug fixing & routine dependency upgrades',
      'Feature development & API integration on legacy codebases',
      'Prioritized refactoring roadmap with immediate quick wins',
    ],
    ctaText: 'Request an Audit →',
    ctaType: 'contact',
    color: '#ec4899',
  },
  {
    id: 'course-trainer-ai-engineering',
    title: 'Course Trainer: AI Engineering for Everyone',
    symbol: '🎓',
    priceUsd: 'Custom / Cohort',
    priceInr: 'Custom / Cohort',
    popular: true,
    badge: 'Featured Course & Workshops',
    category: 'training',
    tagline: 'Practical corporate training & curriculum on Agentic AI and LLMs.',
    description:
      'Comprehensive hands-on training for engineers, tech leads, and product teams. Practical curriculum covering autonomous agent design, multi-agent frameworks, production RAG, and LLM orchestration.',
    features: [
      'Official Course Prospectus: "AI Engineering for Everyone"',
      'Multi-agent systems with LangChain, LangGraph & Agno',
      'Production RAG: chunking, hybrid retrieval, late interaction',
      'Hands-on coding labs, evaluation benchmarks & cost control',
      'Customized corporate syllabus for engineering teams',
      'Lifetime access to code examples and architecture templates',
    ],
    ctaText: 'View Course Prospectus ↗',
    ctaType: 'external',
    ctaTarget: 'https://www.intelligentagentworks.com/course',
    color: '#d4a373',
  },
  {
    id: 'interview-preparation-mentorship',
    title: 'Technical Interview Preparation & Mentorship',
    symbol: '◬',
    priceUsd: 'From $160 / Session',
    priceInr: 'From ₹13,000 / Session',
    badge: '1-on-1 Coaching',
    category: 'mentorship',
    tagline: 'Rigorous mock interviews, system design, and hiring manager rubrics.',
    description:
      '1-on-1 intensive mock interviews and tailored coaching for AI/ML, Full Stack, and Backend engineering roles. Actionable feedback based on real hiring bars across top global tech companies.',
    features: [
      'AI & Full Stack live coding challenges under real constraints',
      'System design & architecture deep-dives with trade-off analysis',
      'Resume & GitHub portfolio review through recruiter eyes',
      'Evaluation rubric across code quality, scalability & communication',
      'Clear, actionable feedback & personalized practice problem sets',
      'Targeted preparation for tech lead and senior engineer bars',
    ],
    ctaText: 'Book Interview Prep →',
    ctaType: 'contact',
    color: '#14b8a6',
  },
]

export const workingProcess = [
  {
    step: '01',
    title: 'Discovery & Scope',
    timeframe: 'Day 1–2',
    description:
      'We discuss your product vision, technical requirements, and constraints. You receive a concrete proposal with milestone deliverables within 24 hours.',
  },
  {
    step: '02',
    title: 'Architecture & System Design',
    timeframe: 'Day 3–4',
    description:
      'API contracts, schema design, infrastructure plan, and CI/CD pipelines are defined upfront so the development phase executes smoothly.',
  },
  {
    step: '03',
    title: 'Production Build & Sprints',
    timeframe: 'Weekly Iterations',
    description:
      'Clean TypeScript/Python code, modular components, automated tests (>80% coverage), and regular staging previews for complete transparency.',
  },
  {
    step: '04',
    title: 'Deployment & Knowledge Handover',
    timeframe: 'Launch & Beyond',
    description:
      'Zero-downtime deployment, Docker containers, complete documentation, recorded walkthrough, and 14 days of post-launch bug fixing support.',
  },
]

export const clientFaqs = [
  {
    q: 'How do we communicate throughout the project?',
    a: 'Directly and asynchronously or synchronously via Slack, Discord, Microsoft Teams, or WhatsApp, plus regular progress video calls. Clear, proactive communication with regular updates.',
  },
  {
    q: 'What is your pricing structure?',
    a: 'I offer flexible pricing in both USD ($) and INR (₹). Fixed-price packages for well-defined scopes and MVPs, or sprint-based weekly rates for evolving product engineering. Transparent pricing with no surprise invoices.',
  },
  {
    q: 'Do you work with existing teams or solo?',
    a: 'Both. I can work as an independent full-stack owner delivering an MVP from scratch, or embed as a specialized AI / Backend engineer into your existing GitHub / GitLab workflow.',
  },
  {
    q: 'How does the "AI Engineering for Everyone" course training work?',
    a: 'It can be booked as an intensive multi-day corporate workshop or weekly cohorts for software teams. You can review the full curriculum on the course prospectus at intelligentagentworks.com/course.',
  },
  {
    q: 'How do we schedule a project or audit?',
    a: 'Click any "Discuss a Project" button to specify your requirements, budget, and timeline, or email me directly at abhishek.mane.work@gmail.com. We can set up an introductory discovery call right away.',
  },
]
