import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import ContactForm from '@/components/contact/ContactForm'
import ContactInfo from '@/components/contact/ContactInfo'

export default function Contact() {
    return (
        <>
            <Helmet>
                <title>Contact | Abhishek Mane</title>
                <meta name="description" content="Get in touch for project collaborations, job opportunities, or just to say hi!" />
            </Helmet>

            <div className="min-h-screen bg-background text-foreground">
                {/* Header */}
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10 border-b border-white/10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)]" />

                    <div className="relative max-w-7xl mx-auto px-6 py-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-center"
                        >
                            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                                Get In Touch
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                Let's discuss your project or opportunity
                            </p>
                        </motion.div>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-7xl mx-auto px-6 py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact info */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <ContactInfo />
                        </motion.div>

                        {/* Contact form */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10"
                        >
                            <h2 className="text-2xl font-bold text-foreground mb-6">Send a Message</h2>
                            <ContactForm />
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    )
}
