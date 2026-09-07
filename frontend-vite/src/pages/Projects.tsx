import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import ProjectCard from '@/components/projects/ProjectCard'
import { caseStudies, getProjectCategories } from '@/data/projects-detailed'
import { ProjectCaseStudy } from '@/types/schema'

export default function Projects() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [query, setQuery] = useState(searchParams.get('search') || '')
    const [category, setCategory] = useState(searchParams.get('category') || 'all')

    const categories = useMemo(() => ['all', ...getProjectCategories()], [])

    const apply = (nextQuery: string, nextCategory: string) => {
        setQuery(nextQuery)
        setCategory(nextCategory)
        const params = new URLSearchParams()
        if (nextQuery) params.set('search', nextQuery)
        if (nextCategory !== 'all') params.set('category', nextCategory)
        setSearchParams(params, { replace: true })
    }

    const filtered = useMemo(() => {
        const q = query.toLowerCase()
        return caseStudies.filter((p: ProjectCaseStudy) => {
            const matchesQuery =
                !q ||
                p.title.toLowerCase().includes(q) ||
                p.tagline.toLowerCase().includes(q) ||
                p.domain.toLowerCase().includes(q) ||
                p.techStack.some((g) => g.technologies.some((t) => t.toLowerCase().includes(q)))
            const matchesCategory = category === 'all' || p.category === category
            return matchesQuery && matchesCategory
        })
    }, [query, category])

    const isFiltering = Boolean(query) || category !== 'all'
    const [lead, ...rest] = filtered

    return (
        <>
            <Helmet>
                <title>Projects | Abhishek Mane</title>
                <meta
                    name="description"
                    content="Production AI, data and platform engineering case studies — problem framing, system design and engineering decisions."
                />
            </Helmet>

            <div className="min-h-screen bg-background text-foreground">
                {/* Header */}
                <div className="border-b border-neutral-200 bg-[#faf9f6] transition-colors duration-300 dark:border-white/10 dark:bg-background">
                    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="max-w-3xl"
                        >
                            <span className="mb-3 block font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-[#8a5827] dark:text-[#d4a373]">
                                Selected Work
                            </span>
                            <h1 className="mb-5 font-serif text-3xl font-light leading-tight text-foreground sm:text-4xl md:text-5xl">
                                Systems built for production,<br className="hidden sm:block" /> not for demos.
                            </h1>
                            <p className="max-w-2xl text-base font-light leading-relaxed text-neutral-500 dark:text-muted-foreground">
                                Each case study covers the problem as it actually presented itself, the approach
                                I took, the system design, and the engineering decisions — including the
                                trade-offs I would have to defend.
                            </p>

                            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
                                <span>{caseStudies.length} case studies</span>
                                <span className="h-px w-8 bg-neutral-300 dark:bg-white/15" />
                                <span>Client names and data withheld</span>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14">
                    {/* Controls */}
                    <div className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-center md:justify-between">
                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                            {categories.map((c) => (
                                <button
                                    key={c}
                                    onClick={() => apply(query, c)}
                                    className={`flex-shrink-0 rounded-xl px-4 py-2.5 font-mono text-[10px] font-medium uppercase tracking-widest transition-all ${category === c
                                        ? 'bg-[#d4a373] text-white shadow-lg shadow-[#d4a373]/20'
                                        : 'border border-neutral-200 bg-card text-neutral-500 hover:bg-neutral-100 dark:border-white/10 dark:text-muted-foreground dark:hover:bg-white/10'
                                        }`}
                                >
                                    {c === 'all' ? 'All work' : c}
                                </button>
                            ))}
                        </div>

                        <div className="group relative md:w-72">
                            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500 dark:text-neutral-400 transition-colors group-focus-within:text-[#8a5827] dark:group-focus-within:text-[#d4a373]" />
                            <input
                                type="text"
                                placeholder="Search projects or tech..."
                                value={query}
                                onChange={(e) => apply(e.target.value, category)}
                                className="w-full rounded-2xl border border-neutral-200 bg-card py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-neutral-500 dark:placeholder:text-neutral-500 transition-all focus:border-[#d4a373] focus:outline-none focus:ring-2 focus:ring-[#d4a373]/20 dark:border-white/10"
                            />
                        </div>
                    </div>

                    {filtered.length > 0 ? (
                        <div className="space-y-6 md:space-y-8">
                            {/* Lead case study gets the wide treatment */}
                            {lead && !isFiltering && <ProjectCard project={lead} index={0} feature />}

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 xl:grid-cols-3">
                                {(isFiltering ? filtered : rest).map((p, i) => (
                                    // Serial numbers stay tied to the full catalogue order, so a
                                    // filtered view still shows a project's real number.
                                    <ProjectCard
                                        key={p.id}
                                        project={p}
                                        index={i}
                                        serialNo={caseStudies.findIndex((c) => c.id === p.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="py-20 text-center">
                            <h3 className="mb-2 font-serif text-xl font-light text-foreground">No projects found</h3>
                            <p className="text-sm text-muted-foreground">Try a different search or category.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
