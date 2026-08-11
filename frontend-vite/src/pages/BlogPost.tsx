import { useState, useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Calendar, Clock, ArrowLeft, ArrowRight, Tag, Share2, Home, Layers } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getPostBySlug, getSeriesNeighbours, getPostContent } from '../data/blog-posts'
import CodeBlock from '@/components/blog/CodeBlock'
import ReadingProgress from '@/components/blog/ReadingProgress'
import toast from 'react-hot-toast'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

// Defined once at module scope. Passing fresh object/array literals would make
// ReactMarkdown rebuild the whole article on every render, restarting the
// Mermaid diagrams' render effects.
const REMARK_PLUGINS = [remarkGfm]

const MARKDOWN_COMPONENTS = {
    // react-markdown v9+ dropped the `inline` prop, so fenced blocks are matched
    // on their <pre> wrapper instead. Anything reaching the `code` renderer below
    // is therefore an inline span.
    pre({ children }: any) {
        const child = Array.isArray(children) ? children[0] : children
        const className: string = child?.props?.className || ''
        const match = /language-([\w-]+)/.exec(className)
        const value = String(child?.props?.children ?? '').replace(/\n$/, '')

        return <CodeBlock language={match ? match[1] : 'text'} value={value} />
    },
    code({ node, className, children, ...props }: any) {
        void node // keep the mdast node out of the DOM attributes
        return (
            <code className={className} {...props}>
                {children}
            </code>
        )
    },
    img({ src, alt, ...props }: any) {
        if (!src) return null
        const isExternal = src.startsWith('http') || src.startsWith('https')
        const finalSrc = isExternal ? src : `${import.meta.env.BASE_URL}${src.startsWith('/') ? src.slice(1) : src}`
        return <img src={finalSrc} alt={alt} {...props} />
    },
}

export default function BlogPost() {
    const { slug } = useParams<{ slug: string }>()
    const post = slug ? getPostBySlug(slug) : undefined

    // Article bodies live in their own chunks, so the text arrives after the header
    const [content, setContent] = useState<string | null>(null)

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [slug])

    useEffect(() => {
        if (!post) return
        let cancelled = false
        setContent(null)
        getPostContent(post).then((body) => {
            if (!cancelled) setContent(body)
        })
        return () => {
            cancelled = true
        }
    }, [post])

    if (!post) {
        return <Navigate to="/blog" replace />
    }

    const { prev, next } = getSeriesNeighbours(post)

    const sharePost = () => {
        if (navigator.share) {
            navigator.share({
                title: post.title,
                text: post.excerpt,
                url: window.location.href,
            })
        } else {
            navigator.clipboard.writeText(window.location.href)
            toast.success('Link copied to clipboard!')
        }
    }

    return (
        <>
            <Helmet>
                <title>{post.title} | Abhishek Mane</title>
                <meta name="description" content={post.excerpt} />
                <meta property="og:title" content={post.title} />
                <meta property="og:description" content={post.excerpt} />
                <meta property="og:type" content="article" />
                <meta property="article:published_time" content={post.publishedAt} />
                <meta property="article:author" content={post.author.name} />
                {post.tags.map((tag: string) => (
                    <meta key={tag} property="article:tag" content={tag} />
                ))}
            </Helmet>

            <div className="min-h-screen bg-background text-foreground selection:bg-accent-blue/20 selection:text-accent-blue">
                {/* Vertical Reading Progress Bar - Left side to avoid scrollbar conflict */}
                <ReadingProgress />


                {/* Header */}
                <div className="relative overflow-hidden bg-neutral-50 dark:bg-[#050505] transition-colors duration-300 border-b border-black/5 dark:border-white/10 backdrop-blur-sm">
                    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-4 md:py-6">
                        {/* Navigation */}
                        <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-6">
                            <Link
                                to="/blog"
                                className="inline-flex items-center gap-2 text-xs font-mono font-medium uppercase tracking-widest text-accent-blue hover:opacity-70 transition-opacity"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Blog
                            </Link>
                            <span className="text-gray-300 dark:text-text-disabled">/</span>
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 text-xs font-mono font-medium uppercase tracking-widest text-gray-500 dark:text-text-tertiary hover:text-accent-blue transition-colors"
                            >
                                <Home className="w-4 h-4" />
                                Home
                            </Link>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="mb-4 flex flex-wrap items-center gap-2">
                                <Badge variant="outline" className="bg-accent-blue/10 border-accent-blue/20 text-accent-blue uppercase tracking-wide">
                                    {post.category}
                                </Badge>
                                {post.series && (
                                    <Link
                                        to={`/blog?series=${post.seriesSlug}`}
                                        className="inline-flex items-center gap-1.5 rounded-full border border-[#d4a373]/30 bg-[#d4a373]/10 px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-[#d4a373] no-underline transition-colors hover:bg-[#d4a373]/20"
                                    >
                                        <Layers className="h-3 w-3" />
                                        {post.series}
                                        {post.seriesPart ? ` · Part ${post.seriesPart} of ${post.seriesTotal}` : ''}
                                    </Link>
                                )}
                            </div>

                            {/* Title */}
                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light text-gray-900 dark:text-text-primary mb-4 leading-[1.15] tracking-tight">
                                {post.title}
                            </h1>


                            {/* Meta */}
                            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-gray-600 dark:text-text-secondary">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <img
                                            src={`${import.meta.env.BASE_URL}${post.author.photo.startsWith('/') ? post.author.photo.slice(1) : post.author.photo}`}
                                            alt={post.author.name}
                                            className="w-9 h-8 rounded-lg object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                        />
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-bg-primary rounded-full" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-mono uppercase tracking-wide text-gray-500 dark:text-text-tertiary mb-1">Written by</div>
                                        <div className="text-gray-900 dark:text-text-primary font-medium text-base tracking-tight">{post.author.name}</div>
                                    </div>
                                </div>

                                <div className="h-10 w-px bg-neutral-200 dark:bg-white/10 hidden sm:block" />

                                <div className="flex flex-col gap-1">
                                    <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">Published</div>
                                    <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                                        <Calendar className="w-4 h-4 text-accent-blue" />
                                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">Reading Time</div>
                                    <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                                        <Clock className="w-4 h-4 text-accent-blue" />
                                        {post.readTime} min read
                                    </div>
                                </div>

                                <Button
                                    onClick={sharePost}
                                    variant="outline"
                                    size="icon"
                                    className="ml-auto rounded-2xl border-gray-200 dark:border-bg-elevated hover:bg-accent-blue hover:text-white hover:border-accent-blue transition-all duration-300 shadow-none"
                                    title="Share Article"
                                >
                                    <Share2 className="w-5 h-5" />
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white dark:bg-background transition-colors duration-300">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 pt-6 md:pt-10 pb-12 md:pb-20 bg-white dark:bg-background">
                        {/* Featured Image */}
                        {/* Featured Image */}
                        {post.featuredImage && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="mb-8 md:mb-12 rounded-2xl md:rounded-[2rem] overflow-hidden bg-white/50 dark:bg-black/20 border border-neutral-200 dark:border-white/5"
                            >
                                <img
                                    src={`${import.meta.env.BASE_URL}${post.featuredImage.startsWith('/') ? post.featuredImage.slice(1) : post.featuredImage}`}
                                    alt={post.title}
                                    className="w-full h-auto object-cover max-h-[600px] hover:scale-[1.02] transition-transform duration-slow"
                                />
                            </motion.div>
                        )}
                        <motion.article
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="prose prose-neutral dark:prose-invert prose-lg max-w-none
              prose-headings:font-serif prose-headings:font-light prose-headings:tracking-tight prose-headings:text-gray-900 dark:prose-headings:text-text-primary
              prose-p:text-gray-700 dark:prose-p:text-text-secondary prose-p:leading-[1.6] prose-p:font-serif prose-p:text-lg
              prose-a:text-accent-blue prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900 dark:prose-strong:text-text-primary prose-strong:font-semibold
              prose-code:text-accent-blue prose-code:bg-gray-100 dark:prose-code:bg-bg-tertiary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-[''] prose-code:after:content-[''] prose-code:font-mono prose-code:font-medium
              prose-pre:bg-transparent prose-pre:p-0 prose-pre:m-0
              prose-blockquote:border-l-accent-blue prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-bg-secondary prose-blockquote:py-2 prose-blockquote:px-8 prose-blockquote:rounded-r-xl prose-blockquote:text-gray-700 dark:prose-blockquote:text-text-secondary prose-blockquote:italic
              prose-ul:text-gray-700 dark:prose-ul:text-text-secondary
              prose-ol:text-gray-700 dark:prose-ol:text-text-secondary
              prose-li:marker:text-accent-blue
              prose-img:rounded-xl prose-img:border-none prose-img:shadow-none"
                            style={{
                                '--tw-prose-body': 'inherit',
                                fontFamily: '"Charter", "Georgia", "Cambria", "Times New Roman", serif'
                            } as React.CSSProperties}
                        >
                            {content === null ? (
                                <div className="animate-pulse space-y-4" aria-label="Loading article">
                                    {[...Array(8)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="h-4 rounded bg-neutral-200 dark:bg-white/10"
                                            style={{ width: `${[100, 96, 88, 94, 60, 98, 90, 72][i]}%` }}
                                        />
                                    ))}
                                </div>
                            ) : (
                            <ReactMarkdown remarkPlugins={REMARK_PLUGINS} components={MARKDOWN_COMPONENTS}>
                                {content}
                            </ReactMarkdown>
                            )}
                        </motion.article>

                        {/* Tags */}
                        <div className="mt-12 pt-8 border-t border-white/10">
                            <div className="flex flex-wrap gap-2">
                                {post.tags.map((tag: string) => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-muted-foreground hover:bg-white/10 transition-colors"
                                    >
                                        <Tag className="w-3 h-3" />
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Series navigation */}
                        {post.series && (prev || next) && (
                            <div className="mt-12 md:mt-16">
                                <div className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[#d4a373]">
                                    <Layers className="h-3.5 w-3.5" />
                                    Continue the {post.series} series
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {prev ? (
                                        <Link
                                            to={`/blog/${prev.slug}`}
                                            className="group flex flex-col rounded-2xl border border-neutral-200 p-5 no-underline transition-all hover:-translate-y-0.5 hover:border-[#d4a373]/50 dark:border-white/10"
                                        >
                                            <span className="mb-2 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-neutral-400">
                                                <ArrowLeft className="h-3 w-3" />
                                                {prev.seriesPart != null ? `Part ${prev.seriesPart}` : 'Previous'}
                                            </span>
                                            <span className="font-serif text-base leading-snug text-foreground transition-colors group-hover:text-[#d4a373]">
                                                {prev.title}
                                            </span>
                                        </Link>
                                    ) : (
                                        <div className="hidden sm:block" />
                                    )}
                                    {next && (
                                        <Link
                                            to={`/blog/${next.slug}`}
                                            className="group flex flex-col rounded-2xl border border-neutral-200 p-5 text-right no-underline transition-all hover:-translate-y-0.5 hover:border-[#d4a373]/50 dark:border-white/10"
                                        >
                                            <span className="mb-2 inline-flex items-center justify-end gap-1.5 font-mono text-[10px] uppercase tracking-widest text-neutral-400">
                                                {next.seriesPart != null ? `Part ${next.seriesPart}` : 'Next'}
                                                <ArrowRight className="h-3 w-3" />
                                            </span>
                                            <span className="font-serif text-base leading-snug text-foreground transition-colors group-hover:text-[#d4a373]">
                                                {next.title}
                                            </span>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Author card */}
                        <div className="mt-12 md:mt-20 p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/5 shadow-none relative overflow-hidden group">
                            <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                                <div className="relative shrink-0">
                                    <img
                                        src={`${import.meta.env.BASE_URL}${post.author.photo.startsWith('/') ? post.author.photo.slice(1) : post.author.photo}`}
                                        alt={post.author.name}
                                        className="w-24 h-24 rounded-3xl object-cover border-2 border-white dark:border-neutral-800"
                                    />
                                    <div className="absolute -bottom-2 -right-2 bg-[#d4a373] text-white p-2 rounded-xl">
                                        <Share2 className="w-4 h-4" />
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[10px] font-mono font-medium uppercase tracking-[0.3em] text-[#d4a373] mb-2">Written By</div>
                                    <div className="text-2xl font-serif font-light text-foreground mb-3">
                                        {post.author.name}
                                    </div>
                                    <p className="text-sm text-neutral-500 dark:text-muted-foreground leading-relaxed font-light max-w-xl">
                                        Full Stack Developer & AI/ML Engineer dedicated to architecting intelligent, high-performance systems and crafting intuitive digital experiences that bridge technology and human needs.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Back to blog */}
                        <div className="mt-12 md:mt-20 text-center">
                            <Link
                                to="/blog"
                                className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-[#d4a373] text-white font-mono text-xs font-medium uppercase tracking-[0.2em] hover:bg-[#c49363] transition-all shadow-xl shadow-[#d4a373]/10 hover:-translate-y-1 active:scale-95"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Return to Library
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
