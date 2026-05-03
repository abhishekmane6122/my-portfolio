import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Home, Briefcase, Code2 } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import ProjectCard from '@/components/projects/ProjectCard'
import { detailedProjects } from '@/data/projects-detailed'
import { ProjectDetailed } from '@/types/schema'

export default function Projects() {
    const [searchParams, setSearchParams] = useSearchParams()

    // Initialize state from URL params
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all')

    const categories = [
        'all',
        'AI',
        'Backend',
        'Frontend',
        'Full Stack',
        'Data'
    ]

    // Update URL when search/filter changes
    useEffect(() => {
        const params = new URLSearchParams()
        if (searchQuery) params.set('search', searchQuery)
        if (selectedCategory && selectedCategory !== 'all') params.set('category', selectedCategory)
        setSearchParams(params, { replace: true })
    }, [searchQuery, selectedCategory, setSearchParams])

    const filteredProjects = detailedProjects.filter((project: ProjectDetailed) => {
        const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.techStack.some(stack => stack.technologies.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase())))

        const matchesCategory = selectedCategory === 'all' || 
            project.techStack.some(stack => stack.category.toLowerCase().includes(selectedCategory.toLowerCase()))

        return matchesSearch && matchesCategory
    })

    return (
        <>
            <Helmet>
                <title>Projects | Abhishek Mane</title>
                <meta name="description" content="Technical case studies of production-grade AI systems, multi-agent platforms, and enterprise solutions." />
            </Helmet>


            <div className="min-h-screen bg-background text-foreground">
                {/* Header - Mirroring Blog Style */}
                <div className="relative overflow-hidden bg-[#faf9f6] dark:bg-background border-b border-neutral-200 dark:border-white/10 transition-colors duration-300">
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14 text-center">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                            <span className="text-[10px] font-mono font-medium uppercase tracking-[0.3em] text-[#d4a373] mb-2 block">
                                Technical Portfolio
                            </span>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light text-foreground mb-3 leading-tight">
                                Engineering Case Studies
                            </h1>
                            <p className="text-neutral-500 dark:text-muted-foreground text-sm max-w-xl mx-auto font-light leading-relaxed">
                                Deep dives into production-grade AI orchestration, multi-agent architectures, and measurable business impact.
                            </p>
                        </motion.div>
                    </div>
                    {/* Background Glows */}
                    <div className="absolute top-1/2 left-1/4 h-64 w-64 bg-[#d4a373]/5 blur-[100px] rounded-full pointer-events-none" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
                    {/* Search and filter */}
                    <div className="mb-8 md:mb-12 flex flex-col gap-4">
                        {/* Search */}
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-[#d4a373] transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by tech stack, project name, or domain..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 md:py-4 rounded-2xl bg-card border border-neutral-200 dark:border-white/10 text-foreground placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#d4a373]/20 focus:border-[#d4a373] transition-all shadow-sm text-sm"
                            />
                        </div>

                        {/* Category filter */}
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-xl font-mono text-[9px] sm:text-[10px] font-medium uppercase tracking-widest transition-all ${selectedCategory === category
                                        ? 'bg-[#d4a373] text-white shadow-lg shadow-[#d4a373]/20'
                                        : 'bg-card text-neutral-500 dark:text-muted-foreground hover:bg-neutral-100 dark:hover:bg-white/10 border border-neutral-200 dark:border-white/10'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Projects grid */}
                    <div>
                        <h2 className="text-xl md:text-2xl font-serif font-light text-foreground mb-6 md:mb-8 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Briefcase className="w-5 h-5 text-[#d4a373]" />
                                {searchQuery || selectedCategory !== 'all' ? 'Filtered Engineering' : 'Featured Work'}
                            </div>
                            <span className="text-neutral-400 text-sm font-mono font-normal">
                                // {filteredProjects.length} projects
                            </span>
                        </h2>

                        {filteredProjects.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                {filteredProjects.map((project, index) => (
                                    <ProjectCard key={project.id} project={project} index={index} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-card/30 rounded-3xl border border-dashed border-neutral-200 dark:border-white/10">
                                <div className="text-5xl mb-4">🚀</div>
                                <h3 className="text-lg font-serif font-light text-foreground mb-2">No projects found</h3>
                                <p className="text-muted-foreground text-sm">Try adjusting your filters to see other engineering work.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Engineering Footer */}
                <div className="bg-neutral-50 dark:bg-[#050505] py-12 mt-16 border-t border-neutral-100 dark:border-white/5">
                    <div className="max-w-4xl mx-auto px-4 text-center">
                        <Code2 className="w-8 h-8 text-[#d4a373] mx-auto mb-4" />
                        <h2 className="text-xl font-serif font-light text-foreground mb-2">The Production Standard</h2>
                        <p className="text-muted-foreground text-[13px] leading-relaxed">
                            Every project in this archive is built with a focus on modularity, security, and measurable ROI. From enterprise-scale multi-agent ecosystems saving 250+ hours/quarter to clinical AI delivering real-time multimodal inference.
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}
