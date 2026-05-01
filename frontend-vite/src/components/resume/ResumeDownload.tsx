import { Download, FileText } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

interface ResumeDownloadProps {
    variant?: 'button' | 'card'
    showLabel?: boolean
}

export default function ResumeDownload({ variant = 'button', showLabel = true }: ResumeDownloadProps) {
    const handleDownload = (format: 'pdf' | 'docx') => {
        const fileName = format === 'pdf' ? 'Abhishek_Mane_Resume.pdf' : 'Abhishek_Mane_Resume.docx'
        const filePath = `/resume/${fileName}`

        // Create download link
        const link = document.createElement('a')
        link.href = filePath
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        // Show success toast
        toast.success(`Resume downloaded as ${format.toUpperCase()}!`, {
            icon: '📄',
            duration: 3000,
        })
    }

    if (variant === 'card') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-purple-500/10 p-6 backdrop-blur-sm border border-white/10"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-foreground">Resume</h3>
                            <p className="text-sm text-muted-foreground">Download my latest resume</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDownload('pdf')}
                            className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium text-sm hover:shadow-lg hover:shadow-blue-500/50 transition-shadow flex items-center justify-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            PDF
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDownload('docx')}
                            className="flex-1 px-4 py-2.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-foreground font-medium text-sm hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            DOCX
                        </motion.button>
                    </div>

                    <p className="text-xs text-muted-foreground mt-3 text-center">
                        Last updated: January 2026
                    </p>
                </div>
            </motion.div>
        )
    }

    return (
        <div className="flex items-center gap-2">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDownload('pdf')}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium text-sm hover:shadow-lg hover:shadow-blue-500/50 transition-shadow flex items-center gap-2"
            >
                <Download className="w-4 h-4" />
                {showLabel && 'Resume'}
            </motion.button>
        </div>
    )
}
