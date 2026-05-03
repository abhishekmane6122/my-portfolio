import { useState, useEffect } from 'react'
import { getViewStats } from '../services/analytics'

export default function Dashboard() {
    const [viewStats, setViewStats] = useState({ total_views: 0 })

    useEffect(() => {
        const fetchStats = async () => {
            const stats = await getViewStats()
            setViewStats(stats)
        }
        fetchStats()
    }, [])

    const stats = [
        { label: 'Total Views', value: viewStats.total_views.toString(), change: 'Across all time', color: 'text-orange-600' },
        { label: 'Total Projects', value: '12', change: '+2 this month', color: 'text-blue-500' },
        { label: 'Blog Posts', value: '8', change: '+1 this week', color: 'text-green-500' },
        { label: 'Technologies', value: '24', change: 'Actively used', color: 'text-purple-500' },
    ]

    const skills = [
        { name: 'React/TypeScript', level: 90 },
        { name: 'Python/FastAPI', level: 85 },
        { name: 'AI/ML', level: 80 },
        { name: 'Database Design', level: 85 },
        { name: 'DevOps/Docker', level: 75 },
    ]

    const recentActivity = [
        { action: 'Published blog post', title: 'Agentic AI in Production', time: '2 days ago' },
        { action: 'Updated project', title: 'Portfolio Website', time: '1 week ago' },
        { action: 'Added skill', title: 'React Server Components', time: '2 weeks ago' },
    ]

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Hero Welcome Section */}
                    <div className="lg:col-span-2 flex flex-col justify-center">
                        <div className="mb-6">
                            <h1 className="text-4xl font-bold text-foreground mb-2">Professional Dashboard</h1>
                            <p className="text-muted-foreground">Managing your enterprise-scale AI identity and metrics.</p>
                        </div>
                        
                        {/* Stats Overview Grid (Moved inside for better layout) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className="p-5 bg-card rounded-2xl border border-neutral-200 dark:border-white/10 hover:shadow-lg transition-all"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
                                        <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                                    </div>
                                    <div className="text-xs text-muted-foreground">{stat.change}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Full Professional Profile Card */}
                    <div className="bg-card rounded-3xl border border-neutral-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col items-center p-8 text-center relative group">
                        {/* Decorative Background Element */}
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-emerald-500/10 to-blue-500/10" />
                        
                        <div className="relative mb-6 mt-4">
                            {/* LinkedIn-style 'Open to Work' Arc */}
                            <div className="absolute -inset-[8px] z-10 pointer-events-none">
                                <svg viewBox="0 0 100 100" className="w-full h-full rotate-[135deg]">
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="48"
                                        fill="none"
                                        stroke="#057642"
                                        strokeWidth="8"
                                        strokeDasharray="210 300"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="absolute bottom-[4px] left-1/2 -translate-x-1/2 text-[10px] font-bold text-white uppercase tracking-tighter bg-[#057642] px-2 py-0.5 rounded-sm whitespace-nowrap">Open to Work</span>
                                </div>
                            </div>
                            <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white dark:border-[#1a1a1a] shadow-xl">
                                <img src="/Abhishek_Profile.png" alt="Abhishek Mane" className="h-full w-full object-cover" />
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold text-foreground mb-1">Abhishek Mane</h3>
                        <p className="text-sm font-mono uppercase tracking-[0.2em] text-[#d4a373] mb-6">AI/ML Engineer</p>
                        
                        <div className="w-full space-y-4 text-left border-t border-neutral-200 dark:border-white/5 pt-6">
                            <div className="flex items-center gap-3 text-sm">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                </div>
                                <span className="text-foreground font-medium">Leading Renewable Energy Firm</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </div>
                                <span className="text-foreground font-medium">Ahmedabad, Gujarat</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                </div>
                                <span className="text-foreground font-medium">abhishek.mane.work@gmail.com</span>
                            </div>
                        </div>

                        <button className="mt-8 w-full py-3 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black font-semibold text-sm hover:scale-[1.02] transition-transform shadow-lg">
                            Edit Profile Details
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Skills Chart */}
                    <div className="p-6 bg-card rounded-2xl border border-neutral-200 dark:border-white/10 shadow-sm">
                        <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#d4a373]" />
                            Skills Mastery
                        </h2>
                        <div className="space-y-4">
                            {skills.map((skill, index) => (
                                <div key={index}>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm font-medium text-foreground">{skill.name}</span>
                                        <span className="text-sm text-muted-foreground">{skill.level}%</span>
                                    </div>
                                    <div className="h-2 bg-neutral-200 dark:bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-[#d4a373] to-[#c49363] rounded-full transition-all duration-500"
                                            style={{ width: `${skill.level}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="p-6 bg-card rounded-2xl border border-neutral-200 dark:border-white/10">
                        <h2 className="text-xl font-semibold text-foreground mb-6">Recent Activity</h2>
                        <div className="space-y-4">
                            {recentActivity.map((activity, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-4 p-4 rounded-xl bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 transition-all"
                                >
                                    <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-[#d4a373]" />
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-foreground">{activity.action}</div>
                                        <div className="text-sm text-muted-foreground">{activity.title}</div>
                                        <div className="text-xs text-muted-foreground mt-1">{activity.time}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Project Distribution Chart (Simple Bar Chart) */}
                <div className="mt-6 p-6 bg-card rounded-2xl border border-neutral-200 dark:border-white/10">
                    <h2 className="text-xl font-semibold text-foreground mb-6">Project Distribution by Technology</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {[
                            { tech: 'React', count: 8, color: 'bg-blue-500' },
                            { tech: 'Python', count: 6, color: 'bg-green-500' },
                            { tech: 'TypeScript', count: 7, color: 'bg-purple-500' },
                            { tech: 'FastAPI', count: 4, color: 'bg-orange-500' },
                            { tech: 'PostgreSQL', count: 5, color: 'bg-cyan-500' },
                            { tech: 'Docker', count: 3, color: 'bg-pink-500' },
                        ].map((item, index) => (
                            <div key={index} className="text-center">
                                <div className="mb-2 h-32 flex items-end justify-center">
                                    <div
                                        className={`w-full ${item.color} rounded-t-lg transition-all duration-500 hover:opacity-80`}
                                        style={{ height: `${(item.count / 8) * 100}%` }}
                                    />
                                </div>
                                <div className="text-sm font-medium text-foreground">{item.tech}</div>
                                <div className="text-xs text-muted-foreground">{item.count} projects</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
