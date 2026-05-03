import { useParams, Link, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { ArrowLeft, Github, ExternalLink, Calendar, Users, Trophy, Home } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import { detailedProjects } from '@/data/projects-detailed'
import FlowDiagram from '@/components/ui/FlowDiagram';
import FloatingThemeToggle from '@/components/ui/FloatingThemeToggle';
import 'highlight.js/styles/github-dark.css'

export default function ProjectDetail() {
    const { slug } = useParams<{ slug: string }>()
    const project = slug ? detailedProjects.find(p => p.slug === slug) : undefined

    if (!project) {
        return <Navigate to="/#projects" replace />
    }

    return (
        <>
            <Helmet>
                <title>{project.title} | Abhishek Mane</title>
                <meta name="description" content={project.tagline} />
            </Helmet>

            <div className="min-h-screen bg-background text-foreground">

                {/* Hero */}
                <div className="relative overflow-hidden bg-background/50 border-b border-neutral-200 dark:border-white/10 transition-colors duration-300">
                    <div className="absolute inset-0 bg-[#d4a373]/5 blur-[120px] rounded-full pointer-events-none" />

                    <div className="relative max-w-6xl mx-auto px-6 py-12">
                        <div className="flex items-center gap-4 mb-8">
                            <button
                                onClick={() => window.history.back()}
                                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="Go back to previous page"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back
                            </button>
                            <span className="text-white/20">|</span>
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Home className="w-4 h-4" />
                                Home
                            </Link>
                            <span className="text-white/20">|</span>
                            <FloatingThemeToggle />
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-center"
                        >
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-light text-foreground mb-4 md:mb-6 tracking-tight">
                                {project.title}
                            </h1>
                            <p className="text-base md:text-lg lg:text-xl text-muted-foreground mb-8 md:mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                                {project.tagline}
                            </p>

                            <div className="flex flex-wrap justify-center gap-4">
                                {project.githubUrl && (
                                    <a
                                        href={project.githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 border border-neutral-200 dark:border-white/10 text-foreground transition-all font-medium text-sm"
                                    >
                                        <Github className="w-4 h-4" />
                                        View Code
                                    </a>
                                )}
                                {project.liveUrl && (
                                    <a
                                        href={project.liveUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#d4a373] text-white hover:bg-[#c49363] transition-all shadow-lg shadow-[#d4a373]/20 font-medium text-sm"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        Live Demo
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-6 py-12">
                    {/* Project info cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                        <div className="group p-8 rounded-3xl bg-card border border-neutral-200 dark:border-white/10 backdrop-blur-md transition-all hover:border-[#d4a373] dark:hover:border-[#d4a373]/50 hover:shadow-xl">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 rounded-2xl bg-[#d4a373]/10 text-[#d4a373]">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-mono font-medium uppercase tracking-[0.2em] text-[#d4a373]">Duration</span>
                            </div>
                            <div className="text-xl font-medium text-foreground">{project.duration}</div>
                        </div>

                        <div className="group p-8 rounded-3xl bg-card border border-neutral-200 dark:border-white/10 backdrop-blur-md transition-all hover:border-[#d4a373] dark:hover:border-[#d4a373]/50 hover:shadow-xl">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 rounded-2xl bg-[#d4a373]/10 text-[#d4a373]">
                                    <Users className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-mono font-medium uppercase tracking-[0.2em] text-[#d4a373]">My Role</span>
                            </div>
                            <div className="text-xl font-medium text-foreground">{project.role}</div>
                        </div>

                        <div className="group p-8 rounded-3xl bg-card border border-neutral-200 dark:border-white/10 backdrop-blur-md transition-all hover:border-[#d4a373] dark:hover:border-[#d4a373]/50 hover:shadow-xl">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 rounded-2xl bg-[#d4a373]/10 text-[#d4a373]">
                                    <Trophy className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-mono font-medium uppercase tracking-[0.2em] text-[#d4a373]">The Team</span>
                            </div>
                            <div className="text-xl font-medium text-foreground">{project.team.join(', ')}</div>
                        </div>
                    </div>

                    {/* Problem */}
                    <section className="mb-24">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-serif font-light text-foreground tracking-tight">The Challenge</h2>
                        </div>
                        <div className="p-8 md:p-12 rounded-3xl bg-card border border-neutral-200 dark:border-white/10 backdrop-blur-xl shadow-xl transition-all hover:shadow-2xl text-left">
                            <div className="prose prose-lg dark:prose-invert max-w-none prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:font-light prose-headings:text-foreground prose-headings:font-serif prose-headings:font-light">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {project.problem}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </section>

                    {/* Solution */}
                    <section className="mb-24">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-serif font-light text-foreground tracking-tight">The Solution</h2>
                        </div>
                        <div className="p-8 md:p-12 rounded-3xl bg-card border border-neutral-200 dark:border-white/10 backdrop-blur-xl shadow-xl transition-all hover:shadow-2xl">
                            <div className="prose prose-lg dark:prose-invert max-w-none prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:font-light prose-headings:text-foreground prose-headings:font-serif prose-headings:font-light">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {project.solution}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </section>

                    {/* Architecture Diagrams */}
                    {(project.flowDiagram || (project.flowDiagrams && project.flowDiagrams.length > 0)) && (
                        <section className="mb-24">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-serif font-light text-foreground tracking-tight mb-4">System Architecture</h2>
                                <p className="text-muted-foreground text-lg font-light max-w-2xl mx-auto">Detailed blueprint of the multi-agent orchestration and data pipelines.</p>
                            </div>

                            {project.flowDiagrams && project.flowDiagrams.length > 0 ? (
                                <div className="space-y-16">
                                    {project.flowDiagrams.map((diag, index) => (
                                        <div key={index} className="space-y-6">
                                            {diag.title && (
                                                <div className="flex items-center justify-center gap-3 mb-6">
                                                    <div className="h-2 w-2 rounded-full bg-[#d4a373]" />
                                                    <h3 className="text-xl font-medium text-foreground/80">
                                                        {diag.title}
                                                    </h3>
                                                </div>
                                            )}
                                            <FlowDiagram
                                                nodes={diag.nodes}
                                                edges={diag.edges}
                                                height={diag.height || '600px'}
                                                title={diag.title}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                project.flowDiagram && (
                                    <FlowDiagram
                                        nodes={project.flowDiagram.nodes}
                                        edges={project.flowDiagram.edges}
                                        height={project.flowDiagram.height || '600px'}
                                        title={project.flowDiagram.title}
                                    />
                                )
                            )}
                        </section>
                    )}

                    {/* Architecture & Design Deep Dive */}
                    {project.architecture && (
                        <section className="mb-24">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-serif font-light text-foreground tracking-tight">Design Deep Dive</h2>
                                <p className="text-muted-foreground text-lg font-light max-w-2xl mx-auto mt-4">Architectural decisions and system infrastructure for production-grade reliability.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                                {[
                                    { label: 'Pattern', value: project.architecture.pattern, icon: <div className="w-5 h-5" /> },
                                    { label: 'Deployment', value: project.architecture.deployment, icon: <div className="w-5 h-5" /> },
                                    { label: 'Security', value: project.architecture.security, icon: <div className="w-5 h-5" /> },
                                    { label: 'Database', value: project.architecture.database.join(', '), icon: <div className="w-5 h-5" /> },
                                    { label: 'Monitoring', value: project.architecture.monitoring, icon: <div className="w-5 h-5" /> },
                                ].map((item, idx) => (
                                    <div key={idx} className="p-6 rounded-3xl bg-card border border-neutral-200 dark:border-white/10 hover:border-[#d4a373]/30 transition-all">
                                        <div className="text-[10px] font-mono uppercase tracking-widest text-[#d4a373] mb-2">{item.label}</div>
                                        <div className="text-sm font-medium text-foreground leading-relaxed">{item.value}</div>
                                    </div>
                                ))}
                            </div>

                            {project.architecture.decisions && project.architecture.decisions.length > 0 && (
                                <div className="p-8 md:p-10 rounded-[2.5rem] bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10">
                                    <h3 className="text-xl font-serif font-light mb-8 flex items-center gap-3">
                                        <span className="h-2 w-2 rounded-full bg-[#d4a373]" />
                                        Architectural Decisions (ADR)
                                    </h3>
                                    <div className="space-y-8">
                                        {project.architecture.decisions.map((decision, idx) => (
                                            <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                                <div className="md:col-span-4">
                                                    <div className="text-xs font-mono text-[#d4a373] uppercase tracking-wider mb-1">Issue</div>
                                                    <div className="text-base font-medium">{decision.issue}</div>
                                                </div>
                                                <div className="md:col-span-3">
                                                    <div className="text-xs font-mono text-neutral-500 uppercase tracking-wider mb-1">Choice</div>
                                                    <div className="text-base font-medium">{decision.choice}</div>
                                                </div>
                                                <div className="md:col-span-5">
                                                    <div className="text-xs font-mono text-neutral-500 uppercase tracking-wider mb-1">Rationale</div>
                                                    <div className="text-sm text-muted-foreground leading-relaxed font-light">{decision.rationale}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>
                    )}

                    {/* Tech Stack */}
                    <section className="mb-24">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-serif font-light text-foreground tracking-tight">Technology Stack</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {project.techStack.map((category, index) => (
                                <div
                                    key={index}
                                    className="p-8 rounded-3xl bg-card border border-neutral-200 dark:border-white/10 backdrop-blur-md transition-all hover:shadow-xl group"
                                >
                                    <h3 className="text-xl font-medium text-foreground mb-6 flex items-center gap-3">
                                        <span className="h-1.5 w-1.5 rounded-full bg-[#d4a373]" />
                                        {category.category}
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        {category.technologies.map((tech) => (
                                            <span
                                                key={tech}
                                                className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-400 text-sm font-light transition-all group-hover:border-[#d4a373]/30"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Results */}
                    {project.results.length > 0 && (
                        <section className="mb-24">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-serif font-light text-foreground tracking-tight">Impact & Results</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {project.results.map((result, index) => (
                                    <div
                                        key={index}
                                        className="p-8 rounded-3xl bg-card border border-neutral-200 dark:border-white/10 text-center backdrop-blur-sm transition-all hover:shadow-xl"
                                    >
                                        <div className="text-4xl font-light text-[#d4a373] mb-3">{result.value}</div>
                                        <div className="text-base font-medium text-foreground mb-2">{result.metric}</div>
                                        <div className="text-sm text-muted-foreground leading-relaxed font-light">{result.description}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Challenges */}
                    {project.challenges.length > 0 && (
                        <section className="mb-24">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-serif font-light text-foreground tracking-tight">Key Challenges & Solutions</h2>
                            </div>
                            <div className="space-y-6">
                                {project.challenges.map((challenge, index) => (
                                    <details
                                        key={index}
                                        className="group p-8 rounded-3xl bg-card border border-neutral-200 dark:border-white/10 hover:border-[#d4a373]/30 transition-all shadow-md"
                                    >
                                        <summary className="cursor-pointer font-medium text-foreground text-xl list-none flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d4a373]/10 text-[#d4a373] text-sm font-mono">{index + 1}</span>
                                                {challenge.title}
                                            </div>
                                            <span className="text-muted-foreground group-open:rotate-180 transition-transform duration-300">▼</span>
                                        </summary>
                                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-neutral-100 dark:border-white/5 pt-8">
                                            <div className="space-y-3">
                                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/5 text-red-500 text-xs font-mono uppercase tracking-wider">The Challenge</div>
                                                <p className="text-muted-foreground text-lg leading-relaxed font-light">{challenge.description}</p>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4a373]/10 text-[#d4a373] text-xs font-mono uppercase tracking-wider">Our Solution</div>
                                                <p className="text-muted-foreground text-lg leading-relaxed font-light">{challenge.solution}</p>
                                            </div>
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </section>
                    )}


                    {/* Project Gallery */}
                    {project.images && project.images.length > 0 && (
                        <section className="mb-24">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-serif font-light text-foreground tracking-tight">Project Gallery</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {project.images.map((image, index) => (
                                    <div
                                        key={index}
                                        className="group relative aspect-video rounded-3xl overflow-hidden border border-black/10 dark:border-white/10 shadow-2xl transition-all hover:scale-[1.02] hover:border-[#d4a373]/30"
                                    >
                                        <img
                                            src={`${import.meta.env.BASE_URL}${image.startsWith('/') ? image.slice(1) : image}`}
                                            alt={`${project.title} screenshot ${index + 1}`}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                                            <p className="text-white text-lg font-medium">Interface Preview {index + 1}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Testimonial */}
                    {project.testimonial && (
                        <section className="mb-24">
                            <div className="relative p-12 md:p-16 rounded-[3rem] bg-card border border-neutral-200 dark:border-white/10 overflow-hidden group shadow-3xl">
                                <div className="absolute top-0 right-0 p-12 text-8xl text-[#d4a373]/5 font-serif select-none transition-transform group-hover:-translate-y-2">"</div>
                                <div className="relative z-10">
                                    <p className="text-2xl md:text-3xl text-foreground font-light italic mb-10 leading-relaxed tracking-tight">
                                        {project.testimonial.text}
                                    </p>
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 rounded-2xl bg-[#d4a373]/10 flex items-center justify-center text-[#d4a373] text-2xl font-serif font-light shadow-lg">
                                            {project.testimonial.author.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="text-xl font-medium text-foreground">{project.testimonial.author}</div>
                                            <div className="text-muted-foreground font-light">{project.testimonial.role}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Author Signature Section */}
                    <section className="mt-32 pt-16 border-t border-neutral-200 dark:border-white/5">
                        <div className="max-w-3xl mx-auto">
                            <div className="relative p-8 md:p-10 rounded-[2.5rem] bg-card border border-neutral-200 dark:border-white/10 shadow-2xl overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#d4a373]/5 to-transparent pointer-events-none" />
                                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                                    <div className="relative shrink-0">
                                        <div className="relative h-28 w-28 overflow-hidden rounded-3xl border-2 border-[#d4a373]/20 shadow-xl group-hover:scale-105 transition-transform duration-500">
                                            <img src={`${import.meta.env.BASE_URL}Abhishek_Profile.png`} alt="Abhishek Mane" className="h-full w-full object-cover" />
                                        </div>
                                        <div className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-[#d4a373] text-white shadow-lg">
                                            <Trophy className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div className="text-center md:text-left">
                                        <span className="block font-mono text-[10px] uppercase tracking-[0.3em] text-[#d4a373] mb-3">Written By</span>
                                        <h3 className="text-2xl font-bold text-foreground mb-3">Abhishek Mane</h3>
                                        <p className="text-muted-foreground leading-relaxed font-light">
                                            Full Stack Developer & AI/ML Engineer dedicated to architecting intelligent, high-performance systems and crafting intuitive digital experiences that bridge technology and human needs.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    )
}
