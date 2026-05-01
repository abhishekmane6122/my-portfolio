import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Send, Loader2, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useState } from 'react'
import confetti from 'canvas-confetti'

const contactSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    subject: z.string().min(5, 'Subject must be at least 5 characters'),
    message: z.string().min(20, 'Message must be at least 20 characters'),
})

type ContactFormData = z.infer<typeof contactSchema>

export default function ContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
    })

    const message = watch('message', '')
    const messageLength = message.length

    const onSubmit = async (data: ContactFormData) => {
        setIsSubmitting(true)

        try {
            // Simulate email sending (replace with actual EmailJS integration)
            await new Promise(resolve => setTimeout(resolve, 1500))

            // TODO: Integrate EmailJS here
            // await emailjs.send(
            //   'YOUR_SERVICE_ID',
            //   'YOUR_TEMPLATE_ID',
            //   data,
            //   'YOUR_PUBLIC_KEY'
            // )

            setIsSuccess(true)

            // Show success toast
            toast.success('Message sent successfully! I\'ll get back to you soon.', {
                duration: 5000,
                icon: '🎉',
            })

            // Trigger confetti
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            })

            // Reset form after 2 seconds
            setTimeout(() => {
                reset()
                setIsSuccess(false)
            }, 2000)
        } catch (error) {
            toast.error('Failed to send message. Please try again.', {
                duration: 4000,
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name field */}
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Name *
                </label>
                <input
                    {...register('name')}
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Your name"
                />
                {errors.name && (
                    <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
                )}
            </div>

            {/* Email field */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email *
                </label>
                <input
                    {...register('email')}
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="your.email@example.com"
                />
                {errors.email && (
                    <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                )}
            </div>

            {/* Subject field */}
            <div>
                <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                    Subject *
                </label>
                <input
                    {...register('subject')}
                    type="text"
                    id="subject"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="What's this about?"
                />
                {errors.subject && (
                    <p className="mt-1 text-sm text-red-400">{errors.subject.message}</p>
                )}
            </div>

            {/* Message field */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <label htmlFor="message" className="block text-sm font-medium text-foreground">
                        Message *
                    </label>
                    <span className={`text-xs ${messageLength < 20 ? 'text-muted-foreground' : 'text-green-400'}`}>
                        {messageLength} / 500
                    </span>
                </div>
                <textarea
                    {...register('message')}
                    id="message"
                    rows={6}
                    maxLength={500}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Tell me about your project, question, or just say hi!"
                />
                {errors.message && (
                    <p className="mt-1 text-sm text-red-400">{errors.message.message}</p>
                )}
            </div>

            {/* Submit button */}
            <motion.button
                type="submit"
                disabled={isSubmitting || isSuccess}
                whileHover={{ scale: isSubmitting || isSuccess ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting || isSuccess ? 1 : 0.98 }}
                className={`w-full px-6 py-4 rounded-lg font-medium text-white transition-all duration-300 flex items-center justify-center gap-2 ${isSuccess
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:shadow-lg hover:shadow-blue-500/50'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                    </>
                ) : isSuccess ? (
                    <>
                        <CheckCircle2 className="w-5 h-5" />
                        Sent Successfully!
                    </>
                ) : (
                    <>
                        <Send className="w-5 h-5" />
                        Send Message
                    </>
                )}
            </motion.button>

            <p className="text-xs text-center text-muted-foreground">
                I typically respond within 24 hours
            </p>
        </form>
    )
}
