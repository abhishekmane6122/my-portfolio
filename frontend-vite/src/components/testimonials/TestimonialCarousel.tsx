import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { testimonials } from '@/data/testimonials'
import type { Testimonial } from '@/types/schema'

interface TestimonialCardProps {
    testimonial: Testimonial
}

function TestimonialCard({ testimonial }: TestimonialCardProps) {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 p-8">
            {/* Quote icon */}
            <div className="absolute top-6 right-6 text-6xl text-white/5 font-serif">"</div>

            <div className="relative z-10">
                {/* Rating */}
                {testimonial.rating && (
                    <div className="flex gap-1 mb-4">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                            <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        ))}
                    </div>
                )}

                {/* Testimonial text */}
                <p className="text-foreground text-lg leading-relaxed mb-6 italic">
                    "{testimonial.text}"
                </p>

                {/* Author info */}
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                        {testimonial.author.name.charAt(0)}
                    </div>

                    <div>
                        <div className="font-semibold text-foreground">
                            {testimonial.author.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            {testimonial.author.role} at {testimonial.author.company}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function TestimonialCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [direction, setDirection] = useState(0)

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    }

    const swipeConfidenceThreshold = 10000
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity
    }

    const paginate = (newDirection: number) => {
        setDirection(newDirection)
        setCurrentIndex((prevIndex) => {
            let nextIndex = prevIndex + newDirection
            if (nextIndex < 0) nextIndex = testimonials.length - 1
            if (nextIndex >= testimonials.length) nextIndex = 0
            return nextIndex
        })
    }

    // Auto-play
    useEffect(() => {
        const timer = setInterval(() => {
            paginate(1)
        }, 5000)
        return () => clearInterval(timer)
    }, [currentIndex])

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="relative">
                {/* Carousel container */}
                <div className="relative h-[400px] md:h-[350px] overflow-hidden">
                    <AnimatePresence initial={false} custom={direction}>
                        <motion.div
                            key={currentIndex}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 }
                            }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={1}
                            onDragEnd={(e, { offset, velocity }) => {
                                const swipe = swipePower(offset.x, velocity.x)

                                if (swipe < -swipeConfidenceThreshold) {
                                    paginate(1)
                                } else if (swipe > swipeConfidenceThreshold) {
                                    paginate(-1)
                                }
                            }}
                            className="absolute w-full"
                        >
                            <TestimonialCard testimonial={testimonials[currentIndex]} />
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Navigation buttons */}
                <button
                    onClick={() => paginate(-1)}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 w-12 h-12 rounded-full bg-white dark:bg-neutral-800 shadow-xl border border-neutral-200 dark:border-neutral-700 flex items-center justify-center hover:scale-110 transition-all z-20"
                    aria-label="Previous testimonial"
                >
                    <ChevronLeft className="w-6 h-6 text-neutral-900 dark:text-neutral-100" />
                </button>

                <button
                    onClick={() => paginate(1)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 w-12 h-12 rounded-full bg-white dark:bg-neutral-800 shadow-xl border border-neutral-200 dark:border-neutral-700 flex items-center justify-center hover:scale-110 transition-all z-20"
                    aria-label="Next testimonial"
                >
                    <ChevronRight className="w-6 h-6 text-neutral-900 dark:text-neutral-100" />
                </button>
            </div>

            {/* Pagination dots */}
            <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setDirection(index > currentIndex ? 1 : -1)
                            setCurrentIndex(index)
                        }}
                        className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
                            ? 'w-8 bg-gradient-to-r from-blue-500 to-cyan-500'
                            : 'w-2 bg-white/20 hover:bg-white/30'
                            }`}
                        aria-label={`Go to testimonial ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}
