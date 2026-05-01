import { Skill } from '@/types/schema'

export const skills: Skill[] = [
    // Frontend
    {
        id: 'react',
        name: 'React',
        category: 'frontend',
        proficiency: 'expert',
        yearsOfExperience: 3,
        icon: '/icons/react.svg',
        description: 'Building modern, performant web applications with React 18+, hooks, and context',
        projects: ['aegis-platform', 'bse-rag-project'],
    },
    {
        id: 'typescript',
        name: 'TypeScript',
        category: 'frontend',
        proficiency: 'expert',
        yearsOfExperience: 3,
        icon: '/icons/typescript.svg',
        description: 'Type-safe development with advanced TypeScript features',
        projects: ['aegis-platform'],
    },
    {
        id: 'nextjs',
        name: 'Next.js',
        category: 'frontend',
        proficiency: 'expert',
        yearsOfExperience: 2,
        icon: '/icons/nextjs.svg',
        description: 'Server-side rendering, static generation, and API routes',
    },
    {
        id: 'tailwind',
        name: 'Tailwind CSS',
        category: 'frontend',
        proficiency: 'expert',
        yearsOfExperience: 3,
        icon: '/icons/tailwind.svg',
        description: 'Utility-first CSS framework for rapid UI development',
        projects: ['aegis-platform'],
    },
    {
        id: 'framer-motion',
        name: 'Framer Motion',
        category: 'frontend',
        proficiency: 'intermediate',
        yearsOfExperience: 2,
        icon: '/icons/framer.svg',
        description: 'Animation library for React applications',
        projects: ['aegis-platform'],
    },

    // Backend
    {
        id: 'python',
        name: 'Python',
        category: 'backend',
        proficiency: 'expert',
        yearsOfExperience: 2,
        icon: '/icons/python.svg',
        description: 'Backend development, data processing, and AI/ML implementations',
        projects: ['bse-rag-project', 'aegis-platform'],
    },
    {
        id: 'fastapi',
        name: 'FastAPI',
        category: 'backend',
        proficiency: 'expert',
        yearsOfExperience: 2,
        icon: '/icons/fastapi.svg',
        description: 'High-performance async API development with automatic documentation',
        projects: ['bse-rag-project', 'aegis-platform'],
    },
    {
        id: 'nodejs',
        name: 'Node.js',
        category: 'backend',
        proficiency: 'intermediate',
        yearsOfExperience: 2,
        icon: '/icons/nodejs.svg',
        description: 'Server-side JavaScript runtime for scalable applications',
    },
    {
        id: 'sqlite',
        name: 'SQLite',
        category: 'backend',
        proficiency: 'expert',
        yearsOfExperience: 2,
        icon: '/icons/sqlite.svg',
        description: 'Lightweight database for embedded applications',
        projects: ['bse-rag-project', 'aegis-platform'],
    },
    {
        id: 'postgresql',
        name: 'PostgreSQL',
        category: 'backend',
        proficiency: 'intermediate',
        yearsOfExperience: 2,
        icon: '/icons/postgresql.svg',
        description: 'Advanced relational database management',
    },

    // AI/ML
    {
        id: 'rag',
        name: 'RAG Systems',
        category: 'ai-ml',
        proficiency: 'expert',
        yearsOfExperience: 1,
        icon: '/icons/ai.svg',
        description: 'Retrieval-Augmented Generation for intelligent document processing',
        projects: ['bse-rag-project'],
    },
    {
        id: 'chromadb',
        name: 'ChromaDB',
        category: 'ai-ml',
        proficiency: 'expert',
        yearsOfExperience: 2,
        icon: '/icons/database.svg',
        description: 'Vector database for semantic search and embeddings',
        projects: ['bse-rag-project'],
    },
    {
        id: 'llm',
        name: 'LLM Integration',
        category: 'ai-ml',
        proficiency: 'expert',
        yearsOfExperience: 1,
        icon: '/icons/ai.svg',
        description: 'Large Language Model integration (Phi-3, Groq, OpenAI)',
        projects: ['bse-rag-project', 'aegis-platform'],
    },
    {
        id: 'transformers',
        name: 'Sentence Transformers',
        category: 'ai-ml',
        proficiency: 'intermediate',
        yearsOfExperience: 2,
        icon: '/icons/ai.svg',
        description: 'Text embeddings and semantic similarity',
        projects: ['bse-rag-project'],
    },

    // DevOps
    {
        id: 'docker',
        name: 'Docker',
        category: 'devops',
        proficiency: 'intermediate',
        yearsOfExperience: 2,
        icon: '/icons/docker.svg',
        description: 'Containerization for consistent deployment environments',
        projects: ['aegis-platform'],
    },
    {
        id: 'nginx',
        name: 'Nginx',
        category: 'devops',
        proficiency: 'intermediate',
        yearsOfExperience: 2,
        icon: '/icons/nginx.svg',
        description: 'Reverse proxy, load balancing, and SSL termination',
        projects: ['aegis-platform'],
    },
    {
        id: 'git',
        name: 'Git',
        category: 'devops',
        proficiency: 'expert',
        yearsOfExperience: 4,
        icon: '/icons/git.svg',
        description: 'Version control and collaborative development',
    },
    {
        id: 'azure',
        name: 'Azure AD',
        category: 'devops',
        proficiency: 'intermediate',
        yearsOfExperience: 1,
        icon: '/icons/azure.svg',
        description: 'Enterprise authentication and SSO integration',
        projects: ['aegis-platform'],
    },

    // Tools
    {
        id: 'playwright',
        name: 'Playwright',
        category: 'tools',
        proficiency: 'expert',
        yearsOfExperience: 1,
        icon: '/icons/playwright.svg',
        description: 'Browser automation for web scraping and testing',
        projects: ['bse-rag-project'],
    },
    {
        id: 'tesseract',
        name: 'Tesseract OCR',
        category: 'tools',
        proficiency: 'intermediate',
        yearsOfExperience: 1,
        icon: '/icons/ocr.svg',
        description: 'Optical character recognition for scanned documents',
        projects: ['bse-rag-project'],
    },
    {
        id: 'vscode',
        name: 'VS Code',
        category: 'tools',
        proficiency: 'expert',
        yearsOfExperience: 4,
        icon: '/icons/vscode.svg',
        description: 'Primary development environment with extensions',
    },
]

export function getSkillsByCategory(category: Skill['category']): Skill[] {
    return skills.filter(skill => skill.category === category)
}

export function getSkillsByProficiency(proficiency: Skill['proficiency']): Skill[] {
    return skills.filter(skill => skill.proficiency === proficiency)
}

export function getAllSkills(): Skill[] {
    return skills
}

export const skillCategories = [
    { id: 'all', name: 'All Skills', color: '#6366f1' },
    { id: 'frontend', name: 'Frontend', color: '#3b82f6' },
    { id: 'backend', name: 'Backend', color: '#10b981' },
    { id: 'ai-ml', name: 'AI/ML', color: '#8b5cf6' },
    { id: 'devops', name: 'DevOps', color: '#f59e0b' },
    { id: 'tools', name: 'Tools', color: '#ec4899' },
]
