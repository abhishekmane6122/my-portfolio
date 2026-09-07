import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { ProjectCaseStudy } from '@/types/schema'

interface ProjectCardProps {
    project: ProjectCaseStudy
    index: number
    /** Wide treatment used for the lead case study. */
    feature?: boolean
    /** Display number, e.g. "03". Falls back to the render index. */
    serialNo?: number
}

export default function ProjectCard({ project, index, feature = false, serialNo }: ProjectCardProps) {
    const accent = project.accent || '#d4a373'
    const serial = String((serialNo ?? index) + 1).padStart(2, '0')

    return (
        <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45, delay: Math.min(index, 6) * 0.06 }}
            className="group h-full"
        >
            <Link
                to={`/projects/${project.slug}`}
                className="accent-scope block h-full no-underline hover:no-underline"
                style={{ ['--accent' as string]: accent }}
            >
                <div
                    className={`relative flex h-full overflow-hidden rounded-3xl border border-neutral-200 bg-white transition-all duration-500 dark:border-white/10 dark:bg-[#0c0c0c] ${feature ? 'flex-col lg:flex-row' : 'flex-col'
                        } hover:-translate-y-1 hover:shadow-2xl`}
                    style={{ boxShadow: 'none' }}
                >
                    {/* Accent hairline that fills in on hover */}
                    <span
                        className="absolute inset-x-0 top-0 z-20 h-[3px] origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                        style={{ background: accent }}
                    />

                    {/* Artwork */}
                    <div
                        className={`relative shrink-0 overflow-hidden ${feature ? 'lg:w-[52%] aspect-[16/10] lg:aspect-auto' : 'aspect-[16/10]'
                            }`}
                    >
                        <img
                            src={`${import.meta.env.BASE_URL}${project.art.replace(/^\//, '')}`}
                            alt=""
                            aria-hidden="true"
                            className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                        />
                        <div className="absolute left-5 top-5 flex items-center gap-2">
                            <span
                                className="rounded-full px-3 py-1.5 font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-white backdrop-blur-md"
                                style={{ background: 'var(--accent-ink)' }}
                            >
                                {project.category}
                            </span>
                        </div>

                        {/* Serial number - makes the body of work countable at a glance */}
                        <div className="absolute right-5 top-4">
                            <span className="font-serif text-4xl font-light leading-none text-white/85 drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)]">
                                {serial}
                            </span>
                        </div>
                    </div>

                    {/* Body */}
                    <div className={`flex flex-1 flex-col p-6 md:p-8 ${feature ? 'lg:justify-center lg:p-12' : ''}`}>
                        <div className="mb-3 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
                            <span>{project.year}</span>
                            <span className="h-px w-6 bg-neutral-300 dark:bg-white/15" />
                            <span className="truncate">{project.domain}</span>
                        </div>

                        <h3
                            className={`mb-3 font-serif font-light leading-tight text-neutral-900 transition-colors duration-300 dark:text-white ${feature ? 'text-3xl md:text-4xl' : 'text-2xl'
                                }`}
                        >
                            <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">
                                {project.title}
                            </span>
                        </h3>

                        <p
                            className={`mb-6 leading-relaxed text-neutral-700 dark:text-neutral-300 ${feature ? 'text-base md:text-lg' : 'text-sm line-clamp-3'
                                }`}
                        >
                            {feature ? project.headline : project.tagline}
                        </p>

                        {/* Headline metric — the thing a recruiter scans for */}
                        {project.results?.[0] && (
                            <div className="mb-6 flex flex-wrap gap-x-8 gap-y-3">
                                {project.results.slice(0, feature ? 3 : 2).map((r) => (
                                    <div key={r.metric} className="min-w-0">
                                        <div
                                            className="font-serif text-lg font-normal leading-tight text-[color:var(--accent-ink)]"
                                        >
                                            {r.value}
                                        </div>
                                        <div className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.15em] text-neutral-500 dark:text-neutral-400">
                                            {r.metric}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="mt-auto flex items-center justify-between border-t border-neutral-100 pt-5 dark:border-white/5">
                            <div className="flex flex-wrap gap-1.5">
                                {project.techStack?.[0]?.technologies.slice(0, feature ? 5 : 3).map((tech) => (
                                    <span
                                        key={tech}
                                        className="rounded-md bg-neutral-100 px-2 py-1 font-mono text-[9px] text-neutral-500 dark:bg-white/5 dark:text-neutral-400"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                            <span
                                className="flex shrink-0 items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] transition-all group-hover:gap-2.5 text-[color:var(--accent-ink)]"
                            >
                                Case study
                                <ArrowUpRight className="h-3.5 w-3.5" />
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.article>
    )
}
