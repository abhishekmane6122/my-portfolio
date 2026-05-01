import { motion } from 'framer-motion'
import { Calendar, Clock, Tag, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { BlogPost } from '@/types/schema'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface BlogCardProps {
    post: BlogPost
    index: number
}

export default function BlogCard({ post, index }: BlogCardProps) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="group h-full"
        >
            <Link to={`/blog/${post.slug}`} className="block h-full no-underline">
                <Card className="h-full overflow-hidden transition-all duration-base hover:shadow-elevated hover:border-accent-blue/50 bg-white dark:bg-bg-secondary border-gray-200 dark:border-bg-elevated">
                    {/* Featured image */}
                    <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 dark:from-accent-blue/20 dark:via-accent-purple/20 dark:to-accent-cyan/20">
                        {post.featuredImage ? (
                            <img
                                src={`${import.meta.env.BASE_URL}${post.featuredImage.startsWith('/') ? post.featuredImage.slice(1) : post.featuredImage}`}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-slow"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <div className="text-6xl font-heading font-bold text-gray-300 dark:text-text-disabled opacity-40">
                                    {post.title.charAt(0)}
                                </div>
                            </div>
                        )}

                        {/* Category badge */}
                        <div className="absolute top-4 left-4">
                            <Badge className="bg-accent-blue text-white hover:bg-accent-blue/90 uppercase tracking-wide shadow-md">
                                {post.category}
                            </Badge>
                        </div>

                        {/* Read time badge */}
                        <div className="absolute top-4 right-4">
                            <Badge variant="secondary" className="bg-white/90 dark:bg-bg-primary/80 backdrop-blur-sm text-gray-700 dark:text-text-secondary hover:bg-white/95 shadow-sm">
                                <Clock className="w-3 h-3 mr-1" />
                                {post.readTime} min
                            </Badge>
                        </div>
                    </div>

                    {/* Content */}
                    <CardContent className="p-6">
                        {/* Meta info */}
                        <div className="flex items-center gap-4 text-xs text-accent-blue mb-3">
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-heading font-semibold text-gray-900 dark:text-text-primary mb-3 leading-tight group-hover:text-accent-blue transition-colors duration-base line-clamp-2">
                            {post.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-sm text-gray-600 dark:text-text-secondary leading-relaxed mb-4 line-clamp-2">
                            {post.excerpt}
                        </p>

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {post.tags.slice(0, 3).map((tag) => (
                                    <Badge
                                        key={tag}
                                        variant="outline"
                                        className="bg-gray-100 dark:bg-bg-tertiary border-gray-200 dark:border-bg-elevated text-gray-600 dark:text-text-tertiary font-mono"
                                    >
                                        <Tag className="w-2.5 h-2.5 mr-1" />
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        )}

                        <Separator className="mb-4" />

                        {/* Author row */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <img
                                    src={`${import.meta.env.BASE_URL}${post.author.photo.startsWith('/') ? post.author.photo.slice(1) : post.author.photo}`}
                                    alt={post.author.name}
                                    className="w-6 h-6 rounded-full object-cover"
                                />
                                <span className="text-xs text-gray-500 dark:text-text-tertiary">{post.author.name}</span>
                            </div>

                            {/* Read more link */}
                            <div className="flex items-center gap-2 text-accent-blue font-medium text-xs group-hover:gap-3 transition-all">
                                Read
                                <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Link>
        </motion.article>
    )
}
