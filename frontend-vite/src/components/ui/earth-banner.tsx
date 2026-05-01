import { motion } from 'framer-motion'

export default function EarthBanner() {
    return (
        <div className="relative h-40 w-40">
            {/* Earth sphere */}
            <motion.div
                className="h-full w-full rounded-full bg-gradient-to-br from-blue-500 via-green-500 to-blue-600 shadow-2xl"
                animate={{
                    rotate: 360,
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                }}
            >
                {/* Continents overlay */}
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.2)_100%)]" />

                {/* Atmosphere glow */}
                <div className="absolute inset-0 rounded-full bg-blue-400/20 blur-xl" />
            </motion.div>

            {/* Outer glow */}
            <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-2xl scale-125" />
        </div>
    )
}
