import type { Portfolio } from "@/types/schema";

// Dummy data for demo preview
export const dummyPortfolio: Partial<Portfolio> = {
    fullName: "Abhishek Mane",
    title: "AI Engineer @ CognitBotz | NLP & Deep Learning Enthusiast",
    tagline:
        "Building real-world AI solutions with a focus on Ethical AI, LLM fine-tuning, and scalable cloud deployments.",
    bio: "I'm an AI Engineer harnessing the power of Python, ML, Deep Learning, and NLP to address real-world challenges. Experienced in LLM fine-tuning, building and integrating APIs, and making AI accessible and reliable. I am a strong advocate for ethical AI, striving to mitigate bias and foster fairness. Skilled in deploying scalable solutions with AWS and Azure.",
    skills: [
        "Python",
        "PyTorch",
        "TensorFlow",
        "NLP",
        "LLMs",
        "BERT",
        "GPT",
        "spaCy",
        "Transformers",
        "HuggingFace",
        "FastAPI",
        "Flask",
        "AWS",
        "Azure",
        "GCP",
        "SQL",
        "LangChain",
        "Phidata",
        "Scikit-learn",
        "Machine Learning",
        "Deep Learning",
        "RAG",
        "Ethical AI",
        "Git",
        "Docker"
    ],
    socialLinks: {
        github: "https://github.com/abhishekmane-ai",
        linkedin: "https://www.linkedin.com/in/abhishek-mane-aiml/",
        email: "abhishek.mane.work@gmail.com",
        resume: "#",
    },
    profileImage: "/Abhishek_Profile.png",
    experience: [
        {
            id: "1",
            company: "CognitBotz Solutions",
            position: "AI Engineer (Intern)",
            duration: "Nov 2024 - Present",
            description:
                "Developing real-world AI solutions focusing on NLP and Agentic systems. Built an AI-powered document verification system for Naipunya.AI and automated report analyzers for Adani Labs using Python and LLM-based analysis.",
        },
        {
            id: "2",
            company: "Infosys Springboard",
            position: "Artificial Intelligence Intern",
            duration: "Oct 2024 - Dec 2024",
            description:
                "Designed predictive models using TabNet and Generative AI (Google Gemini), achieving 85% accuracy. Focused on personalized health suggestions and Streamlit deployments.",
        },
        {
            id: "3",
            company: "Cyber Police Station",
            position: "Data Analyst Intern",
            duration: "Oct 2023 - Jan 2024",
            description:
                "Managed National Cyber Crime Portal data, improving analysis efficiency by 40% and reducing pending cases by 60%. Highly focused on data integrity and victim support.",
        },
    ],
    education: [
        {
            id: "1",
            institution: "Terna Public Charitable Trusts College of Engineering",
            degree: "B.Tech in Artificial Intelligence and Data Science",
            duration: "2021 - 2025",
            description: "CGPA: 7.52 | Focus on ML, Deep Learning, and NLP.",
        },
        {
            id: "2",
            institution: "Shripatrao Bhosale Jr College",
            degree: "Higher Secondary Computer Science",
            duration: "2019 - 2021",
            description: "Percentage: 85%",
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
    User((User)) --> Interface[Web Dashboard]
    Interface --> Auth[Azure AD SSO]
    Auth --> APIGateway[FastAPI Backend]
    
    subgraph Multi-Agent System
        APIGateway --> Agent1[Regulatory Intelligence Agent]
        APIGateway --> Agent2[Directors Disclosure Agent]
        APIGateway --> Agent3[Insider Trading Monitor]
        APIGateway --> Agent4[Meeting Minutes Generator]
    end
    
    subgraph Data Layer
        Agent1 --> BSE[BSE/SEBI/RBI APIs]
        Agent2 --> SQLite[(Director DB)]
        Agent3 --> Shareholding[(Shareholding DB)]
        Agent4 --> WordEngine[python-docx]
    end
    
    Agent1 --> RAG[RAG Pipeline]
    RAG --> LLM[Groq LLM]`
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
        }
    ]
};
