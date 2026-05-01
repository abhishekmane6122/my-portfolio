import { motion } from 'framer-motion'
import { useState } from 'react'

interface PhaseDetail {
    title: string
    items: string[]
}

const phases: PhaseDetail[] = [
    {
        title: 'DEVELOPMENT',
        items: ['Prompt Engineering', 'Model Selection', 'Eval Datasets', 'Version Control']
    },
    {
        title: 'DEPLOYMENT',
        items: ['CI/CD Pipelines', 'A/B Testing', 'Canary Deploys', 'Rollbacks']
    },
    {
        title: 'MONITORING',
        items: ['Performance Metrics', 'User Feedback', 'Error Tracking', 'Usage Analytics']
    },
    {
        title: 'OPTIMIZATION',
        items: ['Cost Tracking', 'Performance Tuning', 'Prompt Refinement', 'Model Updates']
    }
]

export default function LLMOpsLifecycle() {
    const [activePhase, setActivePhase] = useState<number | null>(null)

    return (
        <div className="w-full py-16 px-6" style={{ backgroundColor: '#faebd7' }}>
            <div className="max-w-6xl mx-auto">
                {/* Header with Profile */}
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flex items-center justify-center gap-6 mb-6">
                        <img
                            src={`${import.meta.env.BASE_URL}Abhishek_Profile.png`}
                            alt="Abhishek Mane"
                            className="w-20 h-20 rounded-full border-4 border-[#d4a373] shadow-xl object-cover"
                        />
                        <h2 className="text-4xl font-bold text-gray-800">LLMOps Lifecycle</h2>
                    </div>
                    <p className="text-gray-600 text-lg">Interactive Development to Production Pipeline</p>
                </motion.div>

                {/* Lifecycle Diagram */}
                <div className="relative">
                    {/* Center connecting lines */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                        {/* Development to Deployment */}
                        <motion.path
                            d="M 25% 30% L 37.5% 30%"
                            stroke="#d4a373"
                            strokeWidth="3"
                            fill="none"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1, delay: 0.5 }}
                        />
                        {/* Deployment to Monitoring */}
                        <motion.path
                            d="M 62.5% 30% L 75% 30%"
                            stroke="#d4a373"
                            strokeWidth="3"
                            fill="none"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1, delay: 0.7 }}
                        />
                        {/* Monitoring to Optimization (down) */}
                        <motion.path
                            d="M 87.5% 35% L 87.5% 65%"
                            stroke="#d4a373"
                            strokeWidth="3"
                            fill="none"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1, delay: 0.9 }}
                        />
                        {/* Optimization to Development (left) */}
                        <motion.path
                            d="M 62.5% 70% L 12.5% 70% L 12.5% 35%"
                            stroke="#d4a373"
                            strokeWidth="3"
                            fill="none"
                            strokeDasharray="5,5"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.5, delay: 1.1 }}
                        />
                    </svg>

                    {/* Phase Boxes */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 relative" style={{ zIndex: 1 }}>
                        {/* Development */}
                        <motion.div
                            className="relative"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div
                                className={`p-6 rounded-2xl border-4 cursor-pointer transition-all duration-300 ${activePhase === 0
                                        ? 'border-[#d4a373] bg-white shadow-2xl scale-105'
                                        : 'border-gray-400 bg-white/80 hover:border-[#d4a373] hover:shadow-xl'
                                    }`}
                                onMouseEnter={() => setActivePhase(0)}
                                onMouseLeave={() => setActivePhase(null)}
                            >
                                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                                    {phases[0].title}
                                </h3>
                                <ul className="space-y-2">
                                    {phases[0].items.map((item, idx) => (
                                        <motion.li
                                            key={idx}
                                            className="text-sm text-gray-700 flex items-center gap-2"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: activePhase === 0 ? 1 : 0.7, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                        >
                                            <span className="w-2 h-2 rounded-full bg-[#d4a373]" />
                                            {item}
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>

                        {/* Deployment */}
                        <motion.div
                            className="relative"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <div
                                className={`p-6 rounded-2xl border-4 cursor-pointer transition-all duration-300 ${activePhase === 1
                                        ? 'border-[#d4a373] bg-white shadow-2xl scale-105'
                                        : 'border-gray-400 bg-white/80 hover:border-[#d4a373] hover:shadow-xl'
                                    }`}
                                onMouseEnter={() => setActivePhase(1)}
                                onMouseLeave={() => setActivePhase(null)}
                            >
                                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                                    {phases[1].title}
                                </h3>
                                <ul className="space-y-2">
                                    {phases[1].items.map((item, idx) => (
                                        <motion.li
                                            key={idx}
                                            className="text-sm text-gray-700 flex items-center gap-2"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: activePhase === 1 ? 1 : 0.7, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                        >
                                            <span className="w-2 h-2 rounded-full bg-[#d4a373]" />
                                            {item}
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>

                        {/* Monitoring */}
                        <motion.div
                            className="relative"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            <div
                                className={`p-6 rounded-2xl border-4 cursor-pointer transition-all duration-300 ${activePhase === 2
                                        ? 'border-[#d4a373] bg-white shadow-2xl scale-105'
                                        : 'border-gray-400 bg-white/80 hover:border-[#d4a373] hover:shadow-xl'
                                    }`}
                                onMouseEnter={() => setActivePhase(2)}
                                onMouseLeave={() => setActivePhase(null)}
                            >
                                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                                    {phases[2].title}
                                </h3>
                                <ul className="space-y-2">
                                    {phases[2].items.map((item, idx) => (
                                        <motion.li
                                            key={idx}
                                            className="text-sm text-gray-700 flex items-center gap-2"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: activePhase === 2 ? 1 : 0.7, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                        >
                                            <span className="w-2 h-2 rounded-full bg-[#d4a373]" />
                                            {item}
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    </div>

                    {/* Optimization Phase (Bottom Center) */}
                    <motion.div
                        className="flex justify-center relative"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                        style={{ zIndex: 1 }}
                    >
                        <div
                            className={`p-6 rounded-2xl border-4 cursor-pointer transition-all duration-300 max-w-md w-full ${activePhase === 3
                                    ? 'border-[#d4a373] bg-white shadow-2xl scale-105'
                                    : 'border-gray-400 bg-white/80 hover:border-[#d4a373] hover:shadow-xl'
                                }`}
                            onMouseEnter={() => setActivePhase(3)}
                            onMouseLeave={() => setActivePhase(null)}
                        >
                            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                                {phases[3].title}
                            </h3>
                            <ul className="space-y-2">
                                {phases[3].items.map((item, idx) => (
                                    <motion.li
                                        key={idx}
                                        className="text-sm text-gray-700 flex items-center gap-2"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: activePhase === 3 ? 1 : 0.7, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                    >
                                        <span className="w-2 h-2 rounded-full bg-[#d4a373]" />
                                        {item}
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                </div>

                {/* Legend */}
                <motion.div
                    className="mt-12 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                >
                    <div className="inline-flex items-center gap-6 bg-white/60 px-6 py-3 rounded-full border-2 border-gray-300">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-0.5 bg-[#d4a373]" />
                            <span className="text-sm text-gray-700">Forward Flow</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-0.5 bg-[#d4a373] border-dashed" style={{ borderTop: '2px dashed #d4a373', background: 'transparent' }} />
                            <span className="text-sm text-gray-700">Feedback Loop</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
