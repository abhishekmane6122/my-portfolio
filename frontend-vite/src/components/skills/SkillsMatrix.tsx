import { useState } from 'react'
import { motion } from 'framer-motion'
import { skills, skillCategories } from '@/data/skills-matrix'
import type { Skill } from '@/types/schema'

interface SkillCardProps {
    skill: Skill
    index: number
}

function SkillCard({ skill, index }: SkillCardProps) {
    const proficiencyColors = {
        beginner: 'from-blue-500 to-cyan-500',
        intermediate: 'from-yellow-500 to-orange-500',
        expert: 'from-green-500 to-emerald-500',
    }

    const proficiencyLabels = {
        beginner: 'Beginner',
        intermediate: 'Intermediate',
        expert: 'Expert',
    }

    const proficiencyPercentage = {
        beginner: 33,
        intermediate: 66,
        expert: 100,
    }

    const isFrontend = skill.category === 'frontend'

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="group relative overflow-hidden rounded-xl bg-white/5 dark:bg-white/5 backdrop-blur-sm border-2 border-white/10 p-4 hover:border-blue-500/50 transition-all duration-300 shadow-md"
        >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300" />

            <div className="relative z-10">
                {/* Skill name */}
                <h3 className="text-base font-bold text-foreground mb-1 group-hover:text-blue-400 transition-colors">
                    {skill.name}
                </h3>

                {/* Description */}
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2 h-8">
                    {skill.description}
                </p>

                {/* Proficiency bar */}
                <div className="mb-2">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                            {proficiencyLabels[skill.proficiency]}
                        </span>
                        {!isFrontend && (
                            <span className="text-[10px] font-medium text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded">
                                {skill.yearsOfExperience} {skill.yearsOfExperience === 1 ? 'Year' : 'Years'}
                            </span>
                        )}
                    </div>

                    <div className="h-1.5 bg-black/20 dark:bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${proficiencyPercentage[skill.proficiency]}%` }}
                            transition={{ duration: 1, delay: index * 0.05 + 0.2 }}
                            className={`h-full bg-gradient-to-r ${proficiencyColors[skill.proficiency]} rounded-full`}
                        />
                    </div>
                </div>

                {/* Tags Section */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                    {/* Certifications badge */}
                    {skill.certifications && skill.certifications.length > 0 && (
                        <div className="px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                            <span className="text-[10px] font-medium text-blue-400">
                                {skill.certifications.length} Cert
                            </span>
                        </div>
                    )}

                    {/* Projects count */}
                    {skill.projects && skill.projects.length > 0 && (
                        <div className="px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
                            <span className="text-[10px] font-medium text-purple-400">
                                {skill.projects.length} {skill.projects.length === 1 ? 'Proj' : 'Projs'}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

export default function SkillsMatrix() {
    const [activeCategory, setActiveCategory] = useState('all')

    const filteredSkills = activeCategory === 'all'
        ? skills
        : skills.filter(skill => skill.category === activeCategory)

    return (
        <div className="w-full">
            {/* Category tabs */}
            <div className="flex flex-wrap gap-3 mb-8 justify-center">
                {skillCategories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 ${activeCategory === category.id
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50'
                            : 'bg-white/5 text-muted-foreground hover:bg-white/10 border border-white/10'
                            }`}
                    >
                        {category.name}
                    </button>
                ))}
            </div>

            {/* Skills grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSkills.map((skill, index) => (
                    <SkillCard key={skill.id} skill={skill} index={index} />
                ))}
            </div>

            {/* Summary stats */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-white/10">
                    <div className="text-4xl font-bold text-foreground mb-2">
                        {skills.filter(s => s.proficiency === 'expert').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Expert Level Skills</div>
                </div>

                <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-white/10">
                    <div className="text-4xl font-bold text-foreground mb-2">
                        {Math.max(...skills.map(s => s.yearsOfExperience))}+
                    </div>
                    <div className="text-sm text-muted-foreground">Years Experience</div>
                </div>

                <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-white/10">
                    <div className="text-4xl font-bold text-foreground mb-2">
                        {skills.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Technologies</div>
                </div>
            </div>
        </div>
    )
}
