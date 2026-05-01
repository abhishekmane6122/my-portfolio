import { useParams, Link, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { ArrowLeft, Github, ExternalLink, Calendar, Users, Trophy, Home } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import { detailedProjects } from '@/data/projects-detailed'
import Mermaid from '@/components/ui/Mermaid'
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
                {/* Floating Home Button - Responsive positioning */}
                <Link
                    to="/"
                    className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 p-3 sm:p-4 rounded-full bg-card border border-neutral-200 dark:border-white/10 text-[#d4a373] shadow-2xl hover:scale-110 transition-all flex items-center justify-center group backdrop-blur-xl"
                    title="Back to Home"
                    aria-label="Navigate to home page"
                >
                    <Home className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 whitespace-nowrap font-medium text-sm hidden sm:inline">
                        Home
                    </span>
                </Link>

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
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-center"
                        >
                            <h1 className="text-4xl md:text-6xl font-serif font-light text-foreground mb-6 tracking-tight">
                                {project.title}
                            </h1>
                            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto font-light leading-relaxed">
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
                        <div className="p-8 md:p-12 rounded-3xl bg-card border border-neutral-200 dark:border-white/10 backdrop-blur-xl shadow-xl transition-all hover:shadow-2xl text-center">
                            <p className="text-xl text-muted-foreground leading-relaxed italic font-light">"{project.problem}"</p>
                        </div>
                    </section>

                    {/* Solution */}
                    <section className="mb-24">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-serif font-light text-foreground tracking-tight">The Solution</h2>
                        </div>
                        <div className="p-8 md:p-12 rounded-3xl bg-card border border-neutral-200 dark:border-white/10 backdrop-blur-xl shadow-xl transition-all hover:shadow-2xl">
                            <p className="text-lg text-muted-foreground leading-relaxed font-light">{project.solution}</p>
                        </div>
                    </section>

                    {/* Architecture Diagrams */}
                    {(project.mermaidDiagram || (project.mermaidDiagrams && project.mermaidDiagrams.length > 0)) && (
                        <section className="mb-24">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-serif font-light text-foreground tracking-tight mb-4">System Architecture</h2>
                                <p className="text-muted-foreground text-lg font-light max-w-2xl mx-auto">Detailed blueprint of the multi-agent orchestration and data pipelines.</p>
                            </div>

                            {project.mermaidDiagrams && project.mermaidDiagrams.length > 0 ? (
                                <div className="space-y-16">
                                    {project.mermaidDiagrams.map((diag, index) => (
                                        <div key={index} className="space-y-6">
                                            {diag.title && (
                                                <div className="flex items-center justify-center gap-3 mb-6">
                                                    <div className="h-2 w-2 rounded-full bg-[#d4a373]" />
                                                    <h3 className="text-xl font-medium text-foreground/80">
                                                        {diag.title}
                                                    </h3>
                                                </div>
                                            )}
                                            <Mermaid
                                                chart={diag.chart}
                                                id={`project-detail-${project.id}-${index}`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                project.mermaidDiagram && (
                                    <Mermaid chart={project.mermaidDiagram} id={`project-detail-${project.id}`} />
                                )
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

                    {/* Code Snippets */}
                    {project.codeSnippets.length > 0 && (
                        <section className="mb-24">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-serif font-light text-foreground tracking-tight">Code Highlights</h2>
                            </div>
                            <div className="space-y-12">
                                {project.codeSnippets.map((snippet, index) => (
                                    <div key={index} className="rounded-3xl overflow-hidden border border-neutral-200 dark:border-white/10 shadow-2xl">
                                        <div className="px-8 py-4 bg-background border-b border-neutral-200 dark:border-white/10 flex items-center justify-between">
                                            <span className="text-sm font-mono font-medium text-foreground uppercase tracking-widest">{snippet.title}</span>
                                            <div className="flex gap-1.5">
                                                <div className="h-3 w-3 rounded-full bg-red-500/20" />
                                                <div className="h-3 w-3 rounded-full bg-yellow-500/20" />
                                                <div className="h-3 w-3 rounded-full bg-green-500/20" />
                                            </div>
                                        </div>
                                        <div className="prose prose-invert max-w-none text-base">
                                            <ReactMarkdown
                                                rehypePlugins={[rehypeHighlight, rehypeRaw]}
                                                remarkPlugins={[remarkGfm]}
                                            >
                                                {`\`\`\`${snippet.language}\n${snippet.code}\n\`\`\``}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
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
                                            src={image}
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
                </div>
            </div>
        </>
    )
}
