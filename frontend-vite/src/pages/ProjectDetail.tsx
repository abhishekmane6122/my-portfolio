import { useParams, Link, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { ArrowLeft, Home, Calendar, User, Layers, ArrowRight } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getProjectBySlug, caseStudies } from '@/data/projects-detailed'
import Mermaid from '@/components/ui/Mermaid'
import FloatingThemeToggle from '@/components/ui/FloatingThemeToggle'

const REMARK = [remarkGfm]

const proseClass =
    'prose prose-neutral dark:prose-invert max-w-none ' +
    'prose-headings:font-serif prose-headings:font-light prose-headings:tracking-tight ' +
    'prose-p:text-neutral-700 dark:prose-p:text-neutral-300 prose-p:leading-relaxed ' +
    'prose-strong:text-foreground prose-strong:font-semibold ' +
    'prose-li:text-neutral-700 dark:prose-li:text-neutral-300 ' +
    'prose-a:text-[#8a5827] dark:prose-a:text-[#d4a373] prose-code:text-[#8a5827] dark:prose-code:text-[#d4a373] prose-code:before:content-[\'\'] prose-code:after:content-[\'\']'

function SectionHeading({ eyebrow, title, lead }: { eyebrow: string; title: string; lead?: string }) {
    return (
        <div className="mb-10">
            <span className="mb-3 block font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-[#8a5827] dark:text-[#d4a373]">
                {eyebrow}
            </span>
            <h2 className="font-serif text-2xl font-light tracking-tight text-foreground md:text-3xl">{title}</h2>
            {lead && <p className="mt-3 max-w-2xl text-base leading-relaxed text-neutral-700 dark:text-neutral-300">{lead}</p>}
        </div>
    )
}

export default function ProjectDetail() {
    const { slug } = useParams<{ slug: string }>()
    const project = slug ? getProjectBySlug(slug) : undefined

    if (!project) return <Navigate to="/projects" replace />

    const accent = project.accent || '#d4a373'
    const others = caseStudies.filter((p) => p.slug !== project.slug).slice(0, 2)
    const serial = String(caseStudies.findIndex((p) => p.slug === project.slug) + 1).padStart(2, '0')

    return (
        <>
            <Helmet>
                <title>{project.title} | Abhishek Mane</title>
                <meta name="description" content={project.tagline} />
            </Helmet>

            <FloatingThemeToggle />

            {/* Warm off-white rather than pure white - a flat white page reads as unfinished */}
            <div className="accent-scope min-h-screen bg-[#faf9f6] text-foreground dark:bg-background" style={{ ['--accent' as string]: accent }}>
                {/* ---------- Hero ---------- */}
                <header className="relative overflow-hidden border-b border-neutral-200 dark:border-white/10">
                    <img
                        src={`${import.meta.env.BASE_URL}${project.art.replace(/^\//, '')}`}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 h-full w-full object-cover opacity-[0.18] dark:opacity-25"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/90 to-background" />

                    <div className="relative mx-auto max-w-5xl px-4 pb-14 pt-6 sm:px-6 md:pb-20 md:pt-8">
                        <nav className="mb-10 flex flex-wrap items-center gap-4 font-mono text-[10px] uppercase tracking-widest sm:gap-6">
                            <Link to="/projects" className="inline-flex items-center gap-2 text-[#8a5827] dark:text-[#d4a373] no-underline transition-opacity hover:opacity-70">
                                <ArrowLeft className="h-3.5 w-3.5" /> All work
                            </Link>
                            <span className="text-neutral-300 dark:text-white/20">/</span>
                            <Link to="/" className="inline-flex items-center gap-2 text-neutral-500 no-underline transition-colors hover:text-[#8a5827] dark:hover:text-[#d4a373]">
                                <Home className="h-3.5 w-3.5" /> Home
                            </Link>
                        </nav>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                            <div className="mb-5 flex flex-wrap items-center gap-2.5">
                                <span className="font-serif text-2xl font-light leading-none text-[color:var(--accent-ink)]">
                                    {serial}
                                </span>
                                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-600 dark:text-neutral-400">
                                    of {String(caseStudies.length).padStart(2, '0')}
                                </span>
                                <span className="mx-1 h-4 w-px bg-neutral-300 dark:bg-white/15" />
                                <span className="rounded-full px-3 py-1.5 font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-[#0f0f0f]" style={{ background: accent }}>
                                    {project.category}
                                </span>
                                <span className="rounded-full border border-neutral-300 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-500 dark:border-white/15 dark:text-neutral-400">
                                    {project.domain}
                                </span>
                            </div>

                            <h1 className="mb-5 max-w-4xl font-serif text-3xl font-light leading-[1.12] tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
                                {project.title}
                            </h1>

                            <p className="mb-10 max-w-3xl text-lg leading-relaxed text-neutral-700 dark:text-neutral-300 md:text-xl">
                                {project.tagline}
                            </p>

                            <div className="grid grid-cols-2 gap-6 border-t border-neutral-200 pt-8 dark:border-white/10 md:grid-cols-4">
                                {[
                                    { icon: <User className="h-3.5 w-3.5" />, label: 'Role', value: project.role.split('—')[0].trim() },
                                    { icon: <Calendar className="h-3.5 w-3.5" />, label: 'Timeline', value: project.duration },
                                    { icon: <Layers className="h-3.5 w-3.5" />, label: 'Year', value: project.year },
                                    { icon: <User className="h-3.5 w-3.5" />, label: 'Team', value: project.team[0] },
                                ].map((m) => (
                                    <div key={m.label}>
                                        <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
                                            {m.icon} {m.label}
                                        </div>
                                        <div className="text-sm leading-snug text-foreground">{m.value}</div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </header>

                <main className="mx-auto max-w-5xl px-4 sm:px-6">
                    {/* ---------- Highlights ---------- */}
                    {project.highlights?.length > 0 && (
                        <section className="py-14 md:py-20">
                            <div className="rounded-3xl border p-8 md:p-10" style={{ borderColor: `${accent}33`, background: `${accent}0D` }}>
                                <span className="mb-6 block font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-[color:var(--accent-ink)]">
                                    At a glance
                                </span>
                                <p className="mb-8 font-serif text-xl font-light leading-snug text-foreground md:text-2xl">
                                    {project.headline}
                                </p>
                                <ul className="grid gap-3 md:grid-cols-2">
                                    {project.highlights.map((h) => (
                                        <li key={h} className="flex gap-3 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: accent }} />
                                            {h}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>
                    )}

                    {/* ---------- Narrative ---------- */}
                    <section className="border-t border-neutral-200 py-14 dark:border-white/10 md:py-20">
                        <SectionHeading eyebrow="Context" title="The setting" />
                        <div className={proseClass}><ReactMarkdown remarkPlugins={REMARK}>{project.context}</ReactMarkdown></div>
                    </section>

                    <section className="border-t border-neutral-200 py-14 dark:border-white/10 md:py-20">
                        <SectionHeading eyebrow="Problem" title="What made this hard" />
                        <div className={proseClass}><ReactMarkdown remarkPlugins={REMARK}>{project.problem}</ReactMarkdown></div>
                    </section>

                    <section className="border-t border-neutral-200 py-14 dark:border-white/10 md:py-20">
                        <SectionHeading eyebrow="Approach" title="How I framed it" />
                        <div className={proseClass}><ReactMarkdown remarkPlugins={REMARK}>{project.approach}</ReactMarkdown></div>
                    </section>

                    <section className="border-t border-neutral-200 py-14 dark:border-white/10 md:py-20">
                        <SectionHeading eyebrow="Solution" title="What I built" />
                        <div className={proseClass}><ReactMarkdown remarkPlugins={REMARK}>{project.solution}</ReactMarkdown></div>
                    </section>

                    {/* ---------- System design ---------- */}
                    <section className="border-t border-neutral-200 py-14 dark:border-white/10 md:py-20">
                        <SectionHeading eyebrow="System design" title="How the system is put together" lead={project.systemDesign.overview} />

                        <div className="mb-14 overflow-hidden rounded-2xl border border-neutral-200 dark:border-white/10">
                            <div className="hidden grid-cols-12 gap-4 border-b border-neutral-200 bg-neutral-50 px-6 py-3 font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400 dark:border-white/10 dark:bg-white/[0.03] md:grid">
                                <div className="col-span-3">Component</div>
                                <div className="col-span-6">Responsibility</div>
                                <div className="col-span-3">Tech</div>
                            </div>
                            {project.systemDesign.components.map((c, i) => (
                                <div
                                    key={c.name}
                                    className={`grid grid-cols-1 gap-2 px-6 py-5 md:grid-cols-12 md:gap-4 ${i % 2 ? 'bg-neutral-50/50 dark:bg-white/[0.015]' : ''
                                        }`}
                                >
                                    <div className="col-span-3 font-medium text-foreground">{c.name}</div>
                                    <div className="col-span-6 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{c.responsibility}</div>
                                    <div className="col-span-3 font-mono text-[10px] leading-relaxed text-neutral-500 dark:text-neutral-400">{c.tech}</div>
                                </div>
                            ))}
                        </div>

                        <h3 className="mb-8 font-serif text-xl font-light text-foreground">Data flow</h3>
                        <ol className="relative space-y-6 border-l border-neutral-200 pl-8 dark:border-white/10">
                            {project.systemDesign.dataFlow.map((s) => (
                                <li key={s.stage} className="relative">
                                    <span
                                        className="absolute -left-[38px] mt-1.5 h-3 w-3 rounded-full border-2 border-background"
                                        style={{ background: accent }}
                                    />
                                    <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--accent-ink)]">
                                        {s.stage}
                                    </div>
                                    <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{s.detail}</p>
                                </li>
                            ))}
                        </ol>
                    </section>

                    {/* ---------- AI engineering ---------- */}
                    {project.aiEngineering && (
                        <section className="border-t border-neutral-200 py-14 dark:border-white/10 md:py-20">
                            <SectionHeading
                                eyebrow="AI engineering"
                                title="The AI system"
                                lead={project.aiEngineering.summary}
                            />

                            <div className="mb-12 overflow-hidden rounded-2xl border border-neutral-200 dark:border-white/10">
                                <div className="hidden grid-cols-12 gap-4 border-b border-neutral-200 bg-neutral-100/70 px-6 py-3 font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-400 md:grid">
                                    <div className="col-span-3">Model</div>
                                    <div className="col-span-3">Role</div>
                                    <div className="col-span-6">Why this one</div>
                                </div>
                                {project.aiEngineering.models.map((m, i) => (
                                    <div
                                        key={m.name}
                                        className={`grid grid-cols-1 gap-2 px-6 py-5 md:grid-cols-12 md:gap-4 ${i % 2 ? 'bg-neutral-50 dark:bg-white/[0.02]' : ''}`}
                                    >
                                        <div className="col-span-3 font-medium text-foreground">{m.name}</div>
                                        <div className="col-span-3 text-sm text-neutral-700 dark:text-neutral-300">{m.role}</div>
                                        <div className="col-span-6 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{m.why}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="grid gap-5 md:grid-cols-3">
                                {[
                                    { label: 'Retrieval', body: project.aiEngineering.retrieval },
                                    { label: 'Evaluation', body: project.aiEngineering.evaluation },
                                    { label: 'Guardrails', body: project.aiEngineering.guardrails },
                                ]
                                    .filter((b) => b.body)
                                    .map((b) => (
                                        <div key={b.label} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 dark:border-white/10 dark:bg-white/[0.02]">
                                            <div className="mb-3 font-mono text-[9px] uppercase tracking-[0.2em] text-[color:var(--accent-ink)]">
                                                {b.label}
                                            </div>
                                            <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{b.body}</p>
                                        </div>
                                    ))}
                            </div>
                        </section>
                    )}

                    {/* ---------- Infrastructure ---------- */}
                    {project.infrastructure && (
                        <section className="border-t border-neutral-200 py-14 dark:border-white/10 md:py-20">
                            <SectionHeading eyebrow="Infrastructure" title="Where it runs, and why that mattered" />
                            <div className="grid gap-5 md:grid-cols-3">
                                {[
                                    { label: 'Hosting', body: project.infrastructure.hosting },
                                    { label: 'Why it helped', body: project.infrastructure.rationale },
                                    { label: 'Data residency', body: project.infrastructure.dataResidency },
                                ]
                                    .filter((b) => b.body)
                                    .map((b) => (
                                        <div key={b.label} className="rounded-2xl border p-6" style={{ borderColor: `${accent}33`, background: `${accent}0A` }}>
                                            <div className="mb-3 font-mono text-[9px] uppercase tracking-[0.2em] text-[color:var(--accent-ink)]">
                                                {b.label}
                                            </div>
                                            <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{b.body}</p>
                                        </div>
                                    ))}
                            </div>
                        </section>
                    )}

                    {/* ---------- Diagrams ---------- */}
                    {project.diagrams?.length > 0 && (
                        <section className="border-t border-neutral-200 py-14 dark:border-white/10 md:py-20">
                            <SectionHeading eyebrow="Architecture" title="Diagrams" lead="Drag to pan, scroll controls to zoom, or open any diagram fullscreen." />
                            <div className="space-y-14">
                                {project.diagrams.map((d, i) => (
                                    <figure key={i} className="m-0">
                                        <figcaption className="mb-4">
                                            <h3 className="font-serif text-lg font-light text-foreground">{d.title}</h3>
                                            {d.caption && <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">{d.caption}</p>}
                                        </figcaption>
                                        <Mermaid chart={d.chart} id={`${project.slug}-d${i}`} />
                                    </figure>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* ---------- Decisions ---------- */}
                    {project.decisions?.length > 0 && (
                        <section className="border-t border-neutral-200 py-14 dark:border-white/10 md:py-20">
                            <SectionHeading
                                eyebrow="Engineering decisions"
                                title="Choices worth defending"
                                lead="The decisions that shaped the system, why they went the way they did, and what each one cost."
                            />
                            <div className="space-y-5">
                                {project.decisions.map((d, i) => (
                                    <div key={i} className="rounded-2xl border border-neutral-200 p-6 transition-colors hover:border-[var(--accent)]/40 dark:border-white/10 md:p-8">
                                        <div className="mb-5 flex items-start gap-4">
                                            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-[10px] text-[color:var(--accent-ink)]" style={{ background: `${accent}1A` }}>
                                                {String(i + 1).padStart(2, '0')}
                                            </span>
                                            <h3 className="text-lg font-medium leading-snug text-foreground">{d.issue}</h3>
                                        </div>
                                        <div className="space-y-4 md:pl-11">
                                            <div>
                                                <div className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-[color:var(--accent-ink)]">Decision</div>
                                                <p className="text-sm font-light leading-relaxed text-foreground/90">{d.choice}</p>
                                            </div>
                                            <div>
                                                <div className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">Why</div>
                                                <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{d.rationale}</p>
                                            </div>
                                            {d.tradeoff && (
                                                <div className="rounded-xl border-l-2 bg-neutral-50 px-4 py-3 dark:bg-white/[0.03]" style={{ borderColor: accent }}>
                                                    <div className="mb-1 font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">Trade-off accepted</div>
                                                    <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{d.tradeoff}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* ---------- Challenges ---------- */}
                    {project.challenges?.length > 0 && (
                        <section className="border-t border-neutral-200 py-14 dark:border-white/10 md:py-20">
                            <SectionHeading eyebrow="Hard parts" title="Problems that took real work" />
                            <div className="space-y-4">
                                {project.challenges.map((c, i) => (
                                    <details key={i} className="group rounded-2xl border border-neutral-200 p-6 transition-colors open:border-[var(--accent)]/40 dark:border-white/10 md:p-8">
                                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-[10px] text-[color:var(--accent-ink)]" style={{ background: `${accent}1A` }}>
                                                    {i + 1}
                                                </span>
                                                <h3 className="text-base font-medium leading-snug text-foreground md:text-lg">{c.title}</h3>
                                            </div>
                                            <span className="shrink-0 text-xs text-neutral-500 dark:text-neutral-400 transition-transform duration-300 group-open:rotate-180">▼</span>
                                        </summary>
                                        <div className="mt-6 grid gap-6 border-t border-neutral-100 pt-6 dark:border-white/5 md:grid-cols-2 md:pl-11">
                                            <div>
                                                <div className="mb-2 inline-block rounded-full bg-red-500/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-red-700 dark:text-red-400">The problem</div>
                                                <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{c.description}</p>
                                            </div>
                                            <div>
                                                <div className="mb-2 inline-block rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-[color:var(--accent-ink)]" style={{ background: `${accent}1A` }}>How I solved it</div>
                                                <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{c.solution}</p>
                                            </div>
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* ---------- Tech stack ---------- */}
                    <section className="border-t border-neutral-200 py-14 dark:border-white/10 md:py-20">
                        <SectionHeading eyebrow="Stack" title="Technology" />
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {project.techStack.map((group) => (
                                <div key={group.category}>
                                    <h3 className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--accent-ink)]">
                                        {group.category}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {group.technologies.map((t) => (
                                            <span key={t} className="rounded-lg border border-neutral-200 px-2.5 py-1.5 font-mono text-[10px] text-neutral-600 dark:border-white/10 dark:text-neutral-400">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* ---------- Results ---------- */}
                    {project.results?.length > 0 && (
                        <section className="border-t border-neutral-200 py-14 dark:border-white/10 md:py-20">
                            <SectionHeading eyebrow="Outcome" title="What changed" />
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {project.results.map((r) => (
                                    <div key={r.metric} className="rounded-2xl border border-neutral-200 p-6 dark:border-white/10">
                                        <div className="mb-2 font-serif text-2xl font-light leading-tight text-[color:var(--accent-ink)]">{r.value}</div>
                                        <div className="mb-3 font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">{r.metric}</div>
                                        <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{r.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* ---------- Next ---------- */}
                    {others.length > 0 && (
                        <section className="border-t border-neutral-200 py-14 dark:border-white/10 md:py-20">
                            <SectionHeading eyebrow="Keep reading" title="Other case studies" />
                            <div className="grid gap-5 md:grid-cols-2">
                                {others.map((p) => (
                                    <Link
                                        key={p.slug}
                                        to={`/projects/${p.slug}`}
                                        className="group flex flex-col rounded-2xl border border-neutral-200 p-6 no-underline transition-all hover:-translate-y-0.5 dark:border-white/10"
                                        style={{ ['--accent' as string]: p.accent }}
                                    >
                                        <span className="mb-2 font-mono text-[9px] uppercase tracking-[0.2em] text-[color:var(--accent-ink)]">{p.category}</span>
                                        <span className="mb-2 font-serif text-lg font-light leading-snug text-foreground">{p.title}</span>
                                        <span className="mb-4 line-clamp-2 text-sm text-neutral-700 dark:text-neutral-300">{p.tagline}</span>
                                        <span className="mt-auto inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest transition-all group-hover:gap-2.5 text-[color:var(--accent-ink)]">
                                            Read <ArrowRight className="h-3 w-3" />
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    <div className="border-t border-neutral-200 py-14 text-center dark:border-white/10 md:py-20">
                        <Link
                            to="/projects"
                            className="inline-flex items-center gap-3 rounded-full bg-[#d4a373] px-9 py-4 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-white no-underline shadow-xl shadow-[#d4a373]/10 transition-all hover:-translate-y-0.5 hover:bg-[#c49363] active:scale-95"
                        >
                            <ArrowLeft className="h-4 w-4" /> All case studies
                        </Link>
                    </div>
                </main>
            </div>
        </>
    )
}
