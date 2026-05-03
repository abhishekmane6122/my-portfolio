import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Tag, Code2, Briefcase, Zap } from 'lucide-react'
import { ProjectDetailed } from '@/types/schema'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface ProjectCardProps {
    project: ProjectDetailed
    index: number
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
    // Determine category icon
    const getCategoryIcon = (category: string) => {
        const cat = category.toLowerCase();
        if (cat.includes('ai') || cat.includes('ml')) return <Zap className="w-3 h-3 mr-1" />;
        if (cat.includes('backend') || cat.includes('data')) return <Code2 className="w-3 h-3 mr-1" />;
        return <Briefcase className="w-3 h-3 mr-1" />;
    };

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="group h-full"
        >
            <Link to={`/projects/${project.slug}`} className="block h-full no-underline hover:no-underline decoration-transparent">
                <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-elevated hover:border-[#d4a373]/50 bg-white dark:bg-[#0e0e0e] border-neutral-200 dark:border-white/5">
                    {/* Featured image */}
                    <div className="relative aspect-video overflow-hidden bg-neutral-100 dark:bg-[#0a0a0a] shrink-0">
                        <img
                            src={project.banner}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop' }}
                        />

                        {/* Category badge */}
                        <div className="absolute top-4 left-4">
                            <Badge className="bg-[#d4a373] text-white hover:bg-[#d4a373]/90 uppercase tracking-wide shadow-md">
                                {project.techStack[0]?.category.split(' ')[0] || 'Project'}
                            </Badge>
                        </div>
                    </div>

                    {/* Content */}
                    <CardContent className="p-6 flex flex-col flex-grow">
                        {/* Role & Duration */}
                        <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-3 shrink-0">
                            <div className="flex items-center gap-2">
                                <Briefcase className="w-3 h-3 text-[#d4a373]" />
                                {project.role.split(' ')[0]}
                            </div>
                            <span>{project.duration.split('(')[0]}</span>
                        </div>

                        {/* Title */}
                        <div className="h-[60px] flex items-start mb-3 shrink-0">
                            <h3 className="text-xl font-heading font-semibold text-neutral-900 dark:text-white leading-tight group-hover:text-[#d4a373] transition-colors duration-300 line-clamp-2">
                                {project.title}
                            </h3>
                        </div>

                        {/* Excerpt */}
                        <div className="h-[44px] mb-4 shrink-0">
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-2">
                                {project.tagline}
                            </p>
                        </div>

                        {/* Primary Technologies */}
                        <div className="flex flex-wrap gap-2 mb-4 h-[24px] overflow-hidden shrink-0">
                            {project.techStack[0]?.technologies.slice(0, 3).map((tech) => (
                                <Badge
                                    key={tech}
                                    variant="outline"
                                    className="bg-neutral-50 dark:bg-white/5 border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-400 font-mono text-[9px] whitespace-nowrap"
                                >
                                    <Tag className="w-2.5 h-2.5 mr-1" />
                                    {tech}
                                </Badge>
                            ))}
                        </div>

                        <div className="mt-auto">
                            <Separator className="mb-4 opacity-50" />

                            {/* Results Row */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {project.results?.slice(0, 1).map((res) => (
                                        <div key={res.metric} className="flex flex-col">
                                            <span className="text-[10px] text-neutral-500 uppercase tracking-widest">{res.metric}</span>
                                            <span className="text-xs font-bold text-[#d4a373]">{res.value}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Case Study Link */}
                                <div className="flex items-center gap-2 text-[#d4a373] font-medium text-xs group-hover:gap-3 transition-all">
                                    Case Study
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Link>
        </motion.article>
    )
}
