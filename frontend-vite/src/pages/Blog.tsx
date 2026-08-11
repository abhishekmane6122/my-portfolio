import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Plus } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import BlogCard from '@/components/blog/BlogCard'
import { blogPosts, getAllCategories, getAllSeries } from '@/data/blog-posts'
import { BlogPost } from '@/types/schema'

const PAGE_SIZE = 12

export default function Blog() {
    const [searchParams, setSearchParams] = useSearchParams()

    // Initialize state from URL params
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all')
    const [selectedSeries, setSelectedSeries] = useState(searchParams.get('series') || 'all')
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

    // Derived from the posts themselves, so a new article never needs a code change here
    const categories = useMemo(() => ['all', ...getAllCategories()], [])
    const series = useMemo(() => getAllSeries(), [])

    // Update URL when search/filter changes
    useEffect(() => {
        const params = new URLSearchParams()
        if (searchQuery) params.set('search', searchQuery)
        if (selectedCategory && selectedCategory !== 'all') params.set('category', selectedCategory)
        if (selectedSeries && selectedSeries !== 'all') params.set('series', selectedSeries)
        setSearchParams(params, { replace: true })
    }, [searchQuery, selectedCategory, selectedSeries, setSearchParams])

    // Any filter change starts the list over from the first page
    useEffect(() => {
        setVisibleCount(PAGE_SIZE)
    }, [searchQuery, selectedCategory, selectedSeries])

    const filteredPosts = useMemo(() => {
        const query = searchQuery.toLowerCase()
        return (blogPosts as BlogPost[]).filter((post: BlogPost) => {
            const matchesSearch =
                !query ||
                post.title.toLowerCase().includes(query) ||
                post.excerpt.toLowerCase().includes(query) ||
                (post.series?.toLowerCase().includes(query) ?? false) ||
                post.tags.some((tag: string) => tag.toLowerCase().includes(query))

            const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
            const matchesSeries = selectedSeries === 'all' || post.seriesSlug === selectedSeries

            return matchesSearch && matchesCategory && matchesSeries
        })
    }, [searchQuery, selectedCategory, selectedSeries])

    const isFiltering = Boolean(searchQuery) || selectedCategory !== 'all' || selectedSeries !== 'all'
    const featuredPost = (blogPosts as BlogPost[]).find((post: BlogPost) => post.featured)
    const visiblePosts = filteredPosts.slice(0, visibleCount)
    const remaining = filteredPosts.length - visiblePosts.length

    const chipClass = (active: boolean) =>
        `flex-shrink-0 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-mono text-[9px] sm:text-[10px] font-medium uppercase tracking-widest transition-all ${active
            ? 'bg-[#d4a373] text-white shadow-lg shadow-[#d4a373]/20'
            : 'bg-card text-neutral-500 dark:text-muted-foreground hover:bg-neutral-100 dark:hover:bg-white/10 border border-neutral-200 dark:border-white/10'
        }`

    return (
        <>
            <Helmet>
                <title>Blog | Abhishek Mane</title>
                <meta name="description" content="Technical articles on AI/ML, Full Stack Development, and Software Engineering best practices" />
            </Helmet>


            <div className="min-h-screen bg-background text-foreground">
                {/* Header */}
                <div className="relative overflow-hidden bg-[#faf9f6] dark:bg-background border-b border-neutral-200 dark:border-white/10 transition-colors duration-300">
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-10 text-center">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                            <span className="text-[10px] font-mono font-medium uppercase tracking-[0.3em] text-[#d4a373] mb-2 block">
                                Technical Insights
                            </span>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light text-foreground mb-3 leading-tight">
                                Engineering Blog
                            </h1>
                            <p className="text-neutral-500 dark:text-muted-foreground text-sm max-w-xl mx-auto font-light leading-relaxed">
                                Deep dives into AI/ML orchestration, Full Stack architecture, and the future of agentic computing.
                            </p>
                        </motion.div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
                    {/* Search and filter */}
                    <div className="mb-8 md:mb-12 flex flex-col gap-4">
                        {/* Search */}
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-[#d4a373] transition-colors" />
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 md:py-4 rounded-2xl bg-card border border-neutral-200 dark:border-white/10 text-foreground placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#d4a373]/20 focus:border-[#d4a373] transition-all shadow-sm text-sm"
                            />
                        </div>

                        {/* Series filter */}
                        <div className="flex flex-col gap-2">
                            <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-neutral-400">Series</span>
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
                                <button onClick={() => setSelectedSeries('all')} className={chipClass(selectedSeries === 'all')}>
                                    All Writing
                                </button>
                                {series.map((s) => (
                                    <button
                                        key={s.slug}
                                        onClick={() => setSelectedSeries(s.slug)}
                                        className={chipClass(selectedSeries === s.slug)}
                                    >
                                        {s.name}
                                        <span className="ml-1.5 opacity-60">{s.count}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Category filter - horizontal scroll on mobile */}
                        <div className="flex flex-col gap-2">
                            <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-neutral-400">Topic</span>
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={chipClass(selectedCategory === category)}
                                    >
                                        {category === 'all' ? 'All' : category}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Featured post */}
                    {featuredPost && !isFiltering && (
                        <div className="mb-8 md:mb-12">
                            <h2 className="text-xl md:text-2xl font-serif font-light text-foreground mb-4 md:mb-6">Featured Article</h2>
                            <BlogCard post={featuredPost} index={0} />
                        </div>
                    )}

                    {/* Blog grid */}
                    <div>
                        <h2 className="text-xl md:text-2xl font-serif font-light text-foreground mb-6 md:mb-8">
                            {isFiltering ? 'Filtered Insights' : 'Library of Knowledge'}
                            <span className="text-neutral-400 text-sm ml-3 font-mono font-normal">
                                // {filteredPosts.length} results
                            </span>
                        </h2>

                        {filteredPosts.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                    {visiblePosts.map((post: BlogPost, index: number) => (
                                        <BlogCard key={post.id} post={post} index={index % PAGE_SIZE} />
                                    ))}
                                </div>

                                {remaining > 0 && (
                                    <div className="mt-10 md:mt-14 flex flex-col items-center gap-3">
                                        <button
                                            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                                            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#d4a373] text-white font-mono text-[10px] font-medium uppercase tracking-[0.2em] hover:bg-[#c49363] transition-all shadow-xl shadow-[#d4a373]/10 hover:-translate-y-0.5 active:scale-95"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Load More Articles
                                        </button>
                                        <span className="text-xs font-mono text-neutral-400">
                                            Showing {visiblePosts.length} of {filteredPosts.length}
                                        </span>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-16 md:py-20">
                                <div className="text-5xl md:text-6xl mb-4">🔍</div>
                                <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">No articles found</h3>
                                <p className="text-muted-foreground text-sm">Try adjusting your search or filter criteria</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
