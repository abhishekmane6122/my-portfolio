export default function Dashboard() {
    const stats = [
        { label: 'Total Projects', value: '12', change: '+2 this month', color: 'text-blue-500' },
        { label: 'Blog Posts', value: '8', change: '+1 this week', color: 'text-green-500' },
        { label: 'Technologies', value: '24', change: 'Actively used', color: 'text-purple-500' },
        { label: 'Experience', value: '3+', change: 'Years', color: 'text-orange-500' },
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
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back! Here's your portfolio overview.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="p-6 bg-card rounded-2xl border border-neutral-200 dark:border-white/10 hover:shadow-xl transition-all"
                        >
                            <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                            <div className="text-sm font-medium text-foreground mb-1">{stat.label}</div>
                            <div className="text-xs text-muted-foreground">{stat.change}</div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Skills Chart */}
                    <div className="p-6 bg-card rounded-2xl border border-neutral-200 dark:border-white/10">
                        <h2 className="text-xl font-semibold text-foreground mb-6">Skills Overview</h2>
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
