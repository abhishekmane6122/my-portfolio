// Type definitions extracted from schema for frontend use

export interface ProjectData {
    id: string;
    slug?: string;
    title: string;
    description?: string;
    image?: string;
    github?: string;
    live?: string;
    tags: string[];
    featured: boolean;
    mermaidDiagram?: string;
    flowDiagram?: { nodes: any[]; edges: any[]; height?: string; title?: string };
}

/**
 * Case-study shape for the Projects section.
 *
 * Deliberately carries no code snippets - these are client engagements, and the
 * showcase is about problem framing, system design and engineering judgement,
 * not implementation listings.
 */
export interface ProjectCaseStudy {
    id: string;
    slug: string;
    title: string;
    tagline: string;
    /** Short label used for filtering and the card chip, e.g. "Regulatory AI". */
    category: string;
    /** Business domain the system operates in, e.g. "Capital Markets". */
    domain: string;
    year: string;
    role: string;
    duration: string;
    team: string[];
    featured: boolean;
    /** Path to the generated project artwork (SVG). */
    art: string;
    /** Accent hex used to theme the card and detail hero. */
    accent: string;
    /** One-line scannable outcome shown on the card. */
    headline: string;
    /** Three to five scannable wins. */
    highlights: string[];
    context: string;
    problem: string;
    approach: string;
    solution: string;
    systemDesign: {
        overview: string;
        components: { name: string; responsibility: string; tech: string }[];
        dataFlow: { stage: string; detail: string }[];
    };
    /**
     * The AI/ML engineering story: which models, why those models, how quality
     * was measured, and what stops the system misbehaving. Surfaced as its own
     * section because it is the part that matters most for AI roles.
     */
    aiEngineering?: {
        summary: string;
        models: { name: string; role: string; why: string }[];
        retrieval?: string;
        evaluation: string;
        guardrails: string;
    };
    /** Why the hosting choice mattered to the business, not just the ops team. */
    infrastructure?: {
        hosting: string;
        rationale: string;
        dataResidency?: string;
    };
    decisions: { issue: string; choice: string; rationale: string; tradeoff?: string }[];
    challenges: { title: string; description: string; solution: string }[];
    techStack: { category: string; technologies: string[] }[];
    diagrams: { title: string; caption?: string; chart: string }[];
    results: { metric: string; value: string; description: string }[];
}

// Detailed project for case studies
export interface ProjectDetailed {
    id: string;
    slug: string;
    title: string;
    tagline: string;
    banner: string;
    problem: string;
    solution: string;
    role: string;
    duration: string;
    team: string[];
    techStack: {
        category: string;
        technologies: string[];
    }[];
    challenges: {
        title: string;
        description: string;
        solution: string;
    }[];
    results: {
        metric: string;
        value: string;
        description: string;
    }[];
    images: string[];
    videos: string[];
    codeSnippets: {
        title: string;
        language: string;
        code: string;
    }[];
    liveUrl?: string;
    githubUrl?: string;
    featured: boolean;
    architecture?: {
        pattern: string;
        deployment: string;
        database: string[];
        security: string;
        monitoring: string;
        decisions?: { issue: string; choice: string; rationale: string }[];
    };
    testimonial?: {
        text: string;
        author: string;
        role: string;
    };
    mermaidDiagram?: string;
    mermaidDiagrams?: { title: string; chart: string }[];
    flowDiagram?: { nodes: any[]; edges: any[]; height?: string; title?: string };
    flowDiagrams?: { title: string; nodes: any[]; edges: any[]; height?: string }[];
}

export interface ExperienceData {
    id: string;
    company: string;
    position: string;
    duration: string;
    description?: string;
}

export interface EducationData {
    id: string;
    institution: string;
    degree: string;
    duration: string;
    description?: string;
}

export interface BlogData {
    id: string;
    slug?: string;
    title: string;
    description: string;
    link: string;
    image?: string;
    date: string;
}

// Detailed blog post
export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    /** Absent on entries from the blog index; load it with getPostContent(). */
    content?: string;
    /** Glob key used to lazily fetch this post's body. */
    contentKey?: string;
    featuredImage: string;
    author: {
        name: string;
        photo: string;
    };
    publishedAt: string;
    updatedAt?: string;
    readTime: number;
    category: string;
    tags: string[];
    featured: boolean;
    relatedPosts?: string[];
    /** Name of the multi-part series this post belongs to, if any. */
    series?: string;
    seriesSlug?: string;
    seriesPart?: number;
    seriesTotal?: number;
}

export interface LinkedinPostData {
    id: string;
    title: string;
    content: string;
    date: string;
    link: string;
    image?: string;
    tags: string[];
}

export interface SocialLinksData {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
    email?: string;
    resume?: string;
}

// Skills Matrix
export interface Skill {
    id: string;
    name: string;
    category: 'frontend' | 'backend' | 'devops' | 'ai-ml' | 'tools' | 'other';
    proficiency: 'beginner' | 'intermediate' | 'expert';
    yearsOfExperience: number;
    icon: string;
    description: string;
    certifications?: {
        name: string;
        issuer: string;
        url: string;
    }[];
    projects?: string[];
}

// Testimonials
export interface Testimonial {
    id: string;
    text: string;
    author: {
        name: string;
        role: string;
        company: string;
        photo: string;
        linkedIn?: string;
    };
    rating?: number;
    date: string;
    featured: boolean;
}

export interface Portfolio {
    id?: number;
    userId?: string;
    username?: string;
    fullName?: string;
    email?: string;
    profileImage?: string | null;
    title?: string | null;
    tagline?: string | null;
    bio?: string | null;
    skills?: string[];
    projects?: ProjectData[];
    experience?: ExperienceData[];
    education?: EducationData[];
    blogs?: BlogData[];
    linkedinPosts?: LinkedinPostData[];
    socialLinks?: SocialLinksData;
    achievements?: string[];
    positionsOfResponsibility?: string[];
    funFacts?: string[];
    theme?: string | null;
    isPublished?: boolean | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface User {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

// Contact Form
export interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}
