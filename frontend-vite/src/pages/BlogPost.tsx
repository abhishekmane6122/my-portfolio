import { useState, useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Calendar, Clock, ArrowLeft, Tag, Share2, Home, ArrowUp, ArrowDown } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getPostBySlug } from '../data/blog-posts'
import CodeBlock from '@/components/blog/CodeBlock'
import toast from 'react-hot-toast'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function BlogPost() {
    const { slug } = useParams<{ slug: string }>()
    const post = slug ? getPostBySlug(slug) : undefined

    const [scrollProgress, setScrollProgress] = useState(0)

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [slug])

    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.scrollY
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight
            const progress = (currentScroll / totalHeight) * 100
            setScrollProgress(progress)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])


    if (!post) {
        return <Navigate to="/blog" replace />
    }

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
                <div className="fixed top-0 left-0 w-1 h-full z-[100] bg-black/5 dark:bg-white/5 pointer-events-none">
                    <motion.div
                        className="w-full bg-accent-blue origin-top shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                        style={{ height: `${scrollProgress}%` }}
                        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                    />
                </div>
                

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
                            <div className="mb-4">
                                <Badge variant="outline" className="bg-accent-blue/10 border-accent-blue/20 text-accent-blue uppercase tracking-wide">
                                    {post.category}
                                </Badge>
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
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    code({ node, inline, className, children, ...props }: any) {
                                        const match = /language-([\w-]+)/.exec(className || '')
                                        // Robustly extract text content from react-markdown children
                                        const value = String(children).replace(/\n$/, '');

                                        return !inline ? (
                                            <CodeBlock
                                                language={match ? match[1] : 'text'}
                                                value={value}
                                                {...props}
                                            />
                                        ) : (
                                            <code className={className} {...props}>
                                                {children}
                                            </code>
                                        )
                                    },
                                    img({ src, alt, ...props }) {
                                        if (!src) return null;
                                        const isExternal = src.startsWith('http') || src.startsWith('https');
                                        const finalSrc = isExternal ? src : `${import.meta.env.BASE_URL}${src.startsWith('/') ? src.slice(1) : src}`;
                                        return <img src={finalSrc} alt={alt} {...props} />;
                                    }
                                }}
                            >
                                {post.content}
                            </ReactMarkdown>
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
