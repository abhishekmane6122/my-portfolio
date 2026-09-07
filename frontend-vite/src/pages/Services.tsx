import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import {
  Home,
  Check,
  ExternalLink,
  Mail,
  Linkedin,
  Github,
  Sparkles,
  Layers,
  Server,
  Cpu,
  BarChart3,
  Wrench,
  GraduationCap,
  Users,
  ChevronDown,
  ArrowRight,
  Send,
  MessageSquare,
  Zap,
} from 'lucide-react'
import FloatingThemeToggle from '@/components/ui/FloatingThemeToggle'
import ResumeDownload from '@/components/resume/ResumeDownload'
import {
  servicesData,
  relevantTechGroups,
  workingProcess,
  clientFaqs,
  ServiceItem,
} from '@/data/services-data'
import toast from 'react-hot-toast'

type CurrencyMode = 'both' | 'usd' | 'inr'

// Helper to format numeric strings with comma separation based on currency (Indian vs International)
const formatBudgetInput = (val: string, currency: 'USD' | 'INR'): string => {
  const digits = val.replace(/\D/g, '')
  if (!digits) return ''
  try {
    const num = BigInt(digits)
    return currency === 'INR' ? num.toLocaleString('en-IN') : num.toLocaleString('en-US')
  } catch {
    const num = Number(digits)
    if (isNaN(num)) return ''
    return currency === 'INR' ? num.toLocaleString('en-IN') : num.toLocaleString('en-US')
  }
}

export default function Services() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'dev' | 'ai' | 'analytics' | 'education'>('all')
  const [currencyMode, setCurrencyMode] = useState<CurrencyMode>('both')
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false)
  const [selectedServiceForInquiry, setSelectedServiceForInquiry] = useState<string>('Full-Stack Development')

  // Inquiry form states with simple typed number budget & currency selection
  const [inquiryCurrency, setInquiryCurrency] = useState<'USD' | 'INR'>('USD')
  const [inquiryBudget, setInquiryBudget] = useState<string>('')
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    timeline: 'Within 2–4 weeks',
    message: '',
  })

  // Bottom inline form states
  const [bottomCurrency, setBottomCurrency] = useState<'USD' | 'INR'>('USD')
  const [bottomBudget, setBottomBudget] = useState<string>('')
  const [bottomService, setBottomService] = useState<string>('Full-Stack Development')
  const [bottomForm, setBottomForm] = useState({
    name: '',
    email: '',
    timeline: 'Within 2–4 weeks',
    message: '',
  })

  const handleInquiryCurrencyChange = (newCurrency: 'USD' | 'INR') => {
    setInquiryCurrency(newCurrency)
    if (inquiryBudget) {
      setInquiryBudget(formatBudgetInput(inquiryBudget, newCurrency))
    }
  }

  const handleBottomCurrencyChange = (newCurrency: 'USD' | 'INR') => {
    setBottomCurrency(newCurrency)
    if (bottomBudget) {
      setBottomBudget(formatBudgetInput(bottomBudget, newCurrency))
    }
  }

  const filteredServices = useMemo(() => {
    if (selectedFilter === 'all') return servicesData
    if (selectedFilter === 'dev') {
      return servicesData.filter((s) => s.category === 'fullstack' || s.category === 'backend')
    }
    if (selectedFilter === 'ai') {
      return servicesData.filter((s) => s.category === 'ai-integration' || s.category === 'ml-models')
    }
    if (selectedFilter === 'analytics') {
      return servicesData.filter((s) => s.category === 'analytics' || s.category === 'maintenance')
    }
    if (selectedFilter === 'education') {
      return servicesData.filter((s) => s.category === 'training' || s.category === 'mentorship')
    }
    return servicesData
  }, [selectedFilter])

  const handleCtaClick = (service: ServiceItem) => {
    if (service.ctaType === 'external' && service.ctaTarget) {
      window.open(service.ctaTarget, '_blank', 'noopener,noreferrer')
      return
    }
    setSelectedServiceForInquiry(service.title)
    setInquiryModalOpen(true)
  }

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const { name, email, timeline, message } = inquiryForm
    if (!name.trim() || !email.trim()) {
      toast.error('Please provide your name and email.')
      return
    }

    const currencySymbol = inquiryCurrency === 'INR' ? '₹' : '$'
    const formattedBudget = inquiryBudget.trim()
      ? `${currencySymbol}${inquiryBudget.trim()} (${inquiryCurrency})`
      : 'Flexible / To be discussed'

    const recipient = 'abhishek.mane.work@gmail.com'
    const subject = `Project Inquiry: ${selectedServiceForInquiry} from ${name}`
    const body = `Hi Abhishek,

My name is ${name} (${email}).
I am interested in your service: ${selectedServiceForInquiry}

Estimated Budget: ${formattedBudget}
Target Timeline: ${timeline}

Project Scope & Details:
${message || 'Looking forward to discussing project scope and requirements.'}

Best regards,
${name}`

    const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailtoUrl
    toast.success('Opening email draft to send your project brief!')
    setInquiryModalOpen(false)
  }

  const handleBottomSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const { name, email, timeline, message } = bottomForm
    if (!name.trim() || !email.trim()) {
      toast.error('Please provide your name and email.')
      return
    }

    const currencySymbol = bottomCurrency === 'INR' ? '₹' : '$'
    const formattedBudget = bottomBudget.trim()
      ? `${currencySymbol}${bottomBudget.trim()} (${bottomCurrency})`
      : 'Flexible / To be discussed'

    const recipient = 'abhishek.mane.work@gmail.com'
    const subject = `Project Inquiry: ${bottomService} from ${name}`
    const body = `Hi Abhishek,

My name is ${name} (${email}).
I am interested in: ${bottomService}

Estimated Budget: ${formattedBudget}
Target Timeline: ${timeline}

Project Scope & Details:
${message || 'Looking forward to discussing project scope and requirements.'}

Best regards,
${name}`

    const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailtoUrl
    toast.success('Opening email draft to send your project brief!')
  }

  const renderServicePrice = (service: ServiceItem) => {
    if (service.priceUsd === 'Custom / Cohort') {
      return <span className="font-mono text-xs font-semibold">Custom / Cohort</span>
    }

    if (currencyMode === 'usd') {
      return <span className="font-mono text-xs font-semibold">{service.priceUsd}</span>
    }

    if (currencyMode === 'inr') {
      return <span className="font-mono text-xs font-semibold">{service.priceInr}</span>
    }

    // Default: Both currencies
    return (
      <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
        <span className="font-mono text-xs font-semibold text-neutral-900 dark:text-white whitespace-nowrap">
          {service.priceUsd}
        </span>
        <span className="text-neutral-400 dark:text-neutral-600 text-xs">•</span>
        <span className="font-mono text-[11px] font-medium text-[#8a5827] dark:text-[#d4a373] whitespace-nowrap">
          {service.priceInr}
        </span>
      </div>
    )
  }

  const getServiceIcon = (category: ServiceItem['category']) => {
    switch (category) {
      case 'fullstack':
        return <Layers className="w-5 h-5 text-blue-500 flex-shrink-0" />
      case 'ai-integration':
        return <Sparkles className="w-5 h-5 text-emerald-500 flex-shrink-0" />
      case 'backend':
        return <Server className="w-5 h-5 text-amber-500 flex-shrink-0" />
      case 'ml-models':
        return <Cpu className="w-5 h-5 text-purple-500 flex-shrink-0" />
      case 'analytics':
        return <BarChart3 className="w-5 h-5 text-cyan-500 flex-shrink-0" />
      case 'maintenance':
        return <Wrench className="w-5 h-5 text-pink-500 flex-shrink-0" />
      case 'training':
        return <GraduationCap className="w-5 h-5 text-[#d4a373] flex-shrink-0" />
      case 'mentorship':
        return <Users className="w-5 h-5 text-teal-500 flex-shrink-0" />
      default:
        return <Zap className="w-5 h-5 text-[#d4a373] flex-shrink-0" />
    }
  }

  return (
    <>
      <Helmet>
        <title>Freelance Services & Solutions | Abhishek Mane</title>
        <meta
          name="description"
          content="Production-ready Freelance Engineering Services by Abhishek Mane: Full-Stack Development, AI & LLM Integration, Backend Architecture, ML Models, Data Dashboards, and AI Corporate Training."
        />
        <meta
          name="keywords"
          content="Freelance Developer, AI Engineer, Full Stack Developer, Next.js, FastAPI, Python, React, LLM Integration, RAG, Abhishek Mane Services, AI Engineering for Everyone"
        />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground selection:bg-[#d4a37333] selection:text-[#d4a373] transition-colors duration-300 flex flex-col overflow-x-hidden">
        {/* Top Navbar */}
        <header className="sticky top-0 z-40 bg-background/90 dark:bg-black/90 backdrop-blur-xl border-b border-neutral-200 dark:border-white/10 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2">
            {/* Left: Breadcrumbs / Back */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <Link
                to="/"
                className="inline-flex items-center gap-1 text-xs font-mono font-medium uppercase tracking-widest text-neutral-500 hover:text-foreground transition-colors flex-shrink-0"
              >
                <Home className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Home</span>
              </Link>
              <span className="text-neutral-300 dark:text-neutral-700">/</span>
              <span className="text-xs font-mono font-medium uppercase tracking-widest text-[#8a5827] dark:text-[#d4a373] truncate">
                Services
              </span>
            </div>

            {/* Right: Quick Links & Actions */}
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              <Link
                to="/projects"
                className="hidden md:inline-block text-xs font-mono uppercase tracking-widest text-neutral-500 hover:text-foreground transition-colors"
              >
                Projects
              </Link>
              <Link
                to="/blog"
                className="hidden md:inline-block text-xs font-mono uppercase tracking-widest text-neutral-500 hover:text-foreground transition-colors"
              >
                Blog
              </Link>
              <button
                onClick={() => {
                  setSelectedServiceForInquiry('General Freelance Inquiry')
                  setInquiryModalOpen(true)
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full text-xs font-medium bg-neutral-900 text-white dark:bg-white dark:text-black hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
              >
                <Mail className="w-3 h-3" />
                <span className="hidden xs:inline">Get in Touch</span>
                <span className="xs:hidden">Contact</span>
              </button>
              <div className="hidden sm:block">
                <ResumeDownload variant="button" showLabel={false} />
              </div>
              <FloatingThemeToggle />
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-[#faf9f6] dark:bg-[#060606] border-b border-neutral-200 dark:border-white/10 py-12 sm:py-16 md:py-24">
          {/* Subtle Ambient Glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] pointer-events-none opacity-60 dark:opacity-30">
            <div className="absolute top-10 left-1/4 w-72 h-72 rounded-full bg-[#d4a373]/15 blur-[100px]" />
            <div className="absolute top-20 right-1/4 w-80 h-80 rounded-full bg-blue-500/10 blur-[120px]" />
          </div>

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
            {/* Status & Availability Pill */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 mb-4 sm:mb-6 max-w-full"
            >
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[11px] font-mono font-medium tracking-wide text-emerald-700 dark:text-emerald-400 truncate">
                Currently available for new projects
              </span>
            </motion.div>

            {/* Kicker */}
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="block font-mono text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-[#8a5827] dark:text-[#d4a373] mb-3 sm:mb-4"
            >
              Freelance Services
            </motion.span>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="font-serif text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-neutral-900 dark:text-white leading-[1.18] sm:leading-[1.15] mb-4 sm:mb-6 px-1"
            >
              I build things that work in production —{' '}
              <span className="italic font-normal text-[#8a5827] dark:text-[#d4a373] block sm:inline">
                not just demos.
              </span>
            </motion.h1>

            {/* Value Proposition Description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-sm sm:text-base md:text-lg font-light leading-relaxed text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto mb-8 px-2"
            >
              Clean code, real ownership, no hand-holding required. Clear, proactive communication with both technical
              and non-technical stakeholders.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-4 mb-10 sm:mb-12 max-w-md sm:max-w-none mx-auto"
            >
              <button
                onClick={() => {
                  setSelectedServiceForInquiry('Full-Stack Web Apps')
                  setInquiryModalOpen(true)
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-medium text-sm bg-neutral-900 text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Discuss a Project</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <a
                href="https://www.intelligentagentworks.com/course"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-medium text-sm bg-white dark:bg-white/10 text-neutral-900 dark:text-white border border-neutral-300 dark:border-white/15 hover:bg-neutral-100 dark:hover:bg-white/15 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <GraduationCap className="w-4 h-4 text-[#8a5827] dark:text-[#d4a373]" />
                <span>Course Prospectus</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </a>

              <a
                href="mailto:abhishek.mane.work@gmail.com"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-medium text-sm bg-transparent text-neutral-600 dark:text-neutral-400 hover:text-foreground transition-colors flex items-center justify-center gap-2 truncate"
              >
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">Email Me</span>
              </a>
            </motion.div>

            {/* Core Technologies & Tools - Clean, Compact, Theme-Consistent */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="pt-6 border-t border-neutral-200/80 dark:border-white/10 max-w-4xl mx-auto text-left sm:text-center"
            >
              <span className="block text-[10px] font-mono uppercase tracking-[0.25em] text-[#8a5827] dark:text-[#d4a373] mb-3 text-center">
                Core Technologies & Tools
              </span>

              <div className="space-y-2.5 max-w-3xl mx-auto">
                {relevantTechGroups.map((group) => (
                  <div key={group.label} className="flex flex-wrap items-center gap-1.5 sm:justify-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider font-semibold border ${group.badgeClass}`}
                    >
                      {group.label}
                    </span>
                    {group.items.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-neutral-800 dark:text-neutral-200 hover:border-[#d4a373]/50 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Course Trainer Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-6 sm:-mt-6 md:-mt-8 relative z-20 w-full">
          <div className="rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 text-white p-5 sm:p-7 md:p-10 border border-white/15 shadow-2xl overflow-hidden relative">
            <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#d4a373]/20 blur-3xl pointer-events-none" />
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#d4a373]/20 border border-[#d4a373]/40 text-[#d4a373] text-[11px] font-mono uppercase tracking-wider mb-3">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Featured Training Program</span>
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-normal tracking-tight text-white mb-2">
                  AI Engineering for Everyone — Course Prospectus
                </h2>
                <p className="text-neutral-300 text-xs sm:text-sm md:text-base font-light leading-relaxed mb-4">
                  Corporate workshops and team training on state-of-the-art Agentic AI, multi-agent frameworks
                  (LangChain, LangGraph, Agno), production RAG architectures, and evaluation systems.
                </p>
                <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-2 text-xs font-mono text-neutral-400">
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#d4a373] flex-shrink-0" /> Production RAG & Agents
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#d4a373] flex-shrink-0" /> Hands-on Coding Labs
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#d4a373] flex-shrink-0" /> Tailored Corporate Cohorts
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 sm:gap-3 flex-shrink-0 w-full sm:w-auto">
                <a
                  href="https://www.intelligentagentworks.com/course"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#d4a373] text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#e0b487] transition-colors flex items-center justify-center gap-2 text-center shadow-lg"
                >
                  <span>View Full Prospectus</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => {
                    setSelectedServiceForInquiry('Corporate AI Training & Workshops')
                    setInquiryModalOpen(true)
                  }}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-medium text-xs uppercase tracking-wider transition-colors text-center cursor-pointer"
                >
                  Book Team Training
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Services Showcase Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 w-full flex-1">
          {/* Section Header & Responsive Controls */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 sm:gap-6 mb-8 sm:mb-12">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#8a5827] dark:text-[#d4a373] block mb-2">
                Tailored Engagements
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light text-foreground">
                Services I Offer
              </h2>
            </div>

            {/* Currency Selector + Category Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full lg:w-auto">
              {/* Currency Mode Switcher */}
              <div className="inline-flex items-center p-1 rounded-xl bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 self-start sm:self-auto max-w-full overflow-x-auto">
                <span className="px-2 text-[10px] font-mono uppercase tracking-wider text-neutral-500 whitespace-nowrap">
                  Currency:
                </span>
                <button
                  onClick={() => setCurrencyMode('both')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer whitespace-nowrap ${currencyMode === 'both'
                      ? 'bg-white dark:bg-white/20 text-foreground shadow-xs'
                      : 'text-neutral-500 hover:text-foreground'
                    }`}
                >
                  Both ($ / ₹)
                </button>
                <button
                  onClick={() => setCurrencyMode('usd')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer whitespace-nowrap ${currencyMode === 'usd'
                      ? 'bg-white dark:bg-white/20 text-foreground shadow-xs'
                      : 'text-neutral-500 hover:text-foreground'
                    }`}
                >
                  USD ($)
                </button>
                <button
                  onClick={() => setCurrencyMode('inr')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer whitespace-nowrap ${currencyMode === 'inr'
                      ? 'bg-white dark:bg-white/20 text-foreground shadow-xs'
                      : 'text-neutral-500 hover:text-foreground'
                    }`}
                >
                  INR (₹)
                </button>
              </div>

              {/* Filter Chips (Horizontally scrollable on mobile) */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'dev', label: 'Dev' },
                  { id: 'ai', label: 'AI & ML' },
                  { id: 'analytics', label: 'Analytics' },
                  { id: 'education', label: 'Training' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedFilter(tab.id as any)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-xl font-mono text-[10px] font-medium uppercase tracking-wider transition-all cursor-pointer ${selectedFilter === tab.id
                        ? 'bg-[#d4a373] text-white shadow-md shadow-[#d4a373]/20'
                        : 'bg-card border border-neutral-200 dark:border-white/10 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-white/10'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            <AnimatePresence mode="popLayout">
              {filteredServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  className="group relative rounded-2xl bg-card border border-neutral-200 dark:border-white/10 hover:border-[#d4a373]/50 dark:hover:border-[#d4a373]/50 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md"
                >
                  <div className="p-5 sm:p-6 md:p-7 flex-1 flex flex-col">
                    {/* Header line: Symbol + Badge + Dual Price */}
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-3 sm:mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-mono text-[#8a5827] dark:text-[#d4a373]">{service.symbol}</span>
                        {service.badge && (
                          <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider font-semibold bg-neutral-100 dark:bg-white/10 text-neutral-700 dark:text-neutral-300">
                            {service.badge}
                          </span>
                        )}
                      </div>

                      {/* Price Pill */}
                      <div className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-white/10 border border-neutral-200 dark:border-white/15">
                        {renderServicePrice(service)}
                      </div>
                    </div>

                    {/* Title & Tagline */}
                    <div className="flex items-center gap-2 mb-1.5">
                      {getServiceIcon(service.category)}
                      <h3 className="text-base sm:text-lg md:text-xl font-serif font-normal text-foreground group-hover:text-[#8a5827] dark:group-hover:text-[#d4a373] transition-colors leading-tight">
                        {service.title}
                      </h3>
                    </div>
                    <p className="text-xs font-mono text-[#8a5827] dark:text-[#d4a373] mb-3">{service.tagline}</p>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-light leading-relaxed mb-5">
                      {service.description}
                    </p>

                    {/* Features Checklist */}
                    <div className="mt-auto space-y-2 pt-4 border-t border-neutral-100 dark:border-white/10">
                      {service.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                          <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span className="leading-tight">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Footer */}
                  <div className="p-5 sm:p-6 pt-0">
                    <button
                      onClick={() => handleCtaClick(service)}
                      className={`w-full py-3 px-4 rounded-xl text-xs font-medium uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${service.popular
                          ? 'bg-[#d4a373] text-white hover:bg-[#c39262] shadow-md shadow-[#d4a373]/20'
                          : 'bg-neutral-100 dark:bg-white/10 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-white/20'
                        }`}
                    >
                      <span>{service.ctaText}</span>
                      {service.ctaType === 'external' ? (
                        <ExternalLink className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowRight className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* Working Process / How We Collaborate */}
        <section className="border-t border-b border-neutral-200 dark:border-white/10 bg-[#faf9f6] dark:bg-[#080808] py-14 sm:py-20 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#8a5827] dark:text-[#d4a373] block mb-2">
                Execution Model
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light text-foreground mb-3">
                How Engagements Work
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-light">
                Transparent milestones, continuous staging previews, and zero hand-holding required.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {workingProcess.map((step) => (
                <div
                  key={step.step}
                  className="rounded-2xl bg-card border border-neutral-200 dark:border-white/10 p-5 sm:p-6 relative flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-serif text-3xl font-light text-[#8a5827] dark:text-[#d4a373]">
                        {step.step}
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-100 dark:bg-white/10 text-neutral-600 dark:text-neutral-400">
                        {step.timeframe}
                      </span>
                    </div>
                    <h3 className="text-base font-serif font-normal text-foreground mb-2">{step.title}</h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Client FAQs */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-14 sm:py-20 w-full">
          <div className="text-center mb-8 sm:mb-10">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#8a5827] dark:text-[#d4a373] block mb-2">
              Got Questions?
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-light text-foreground">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {clientFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-neutral-200 dark:border-white/10 bg-card overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full px-4 sm:px-5 py-3.5 sm:py-4 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-medium text-foreground">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-neutral-400 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180 text-[#d4a373]' : ''
                        }`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="px-4 sm:px-5 pb-4 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-light leading-relaxed border-t border-neutral-100 dark:border-white/5 pt-3"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </section>

        {/* Bottom Contact Section with INLINE Simple Form */}
        <section id="contact-section" className="border-t border-neutral-200 dark:border-white/10 bg-[#faf9f6] dark:bg-[#070707] py-14 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4a373]/15 text-[#8a5827] dark:text-[#d4a373] text-[11px] font-mono uppercase tracking-wider mb-4">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Let's Build Something Great</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light text-foreground mb-3">
                Have a project or need senior AI / Full-Stack firepower?
              </h2>

              <p className="text-xs sm:text-sm md:text-base text-neutral-600 dark:text-neutral-300 font-light leading-relaxed">
                Whether you need to build an MVP from scratch, add AI to an existing product, develop a backend, analyze
                your business data, or maintain an existing application, I’d be happy to discuss your requirements.
              </p>
              <strong className="font-medium text-foreground mt-2 block text-xs sm:text-sm">
                📩 Open to freelance projects and collaborations.
              </strong>
            </div>

            {/* Inline Project Brief Form */}
            <div className="rounded-2xl bg-card border border-neutral-200 dark:border-white/15 p-5 sm:p-7 md:p-8 shadow-xl max-w-2xl mx-auto mb-10">
              <h3 className="text-base sm:text-lg font-serif font-normal text-foreground mb-1">
                Send a Direct Project Brief
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light mb-5">
                Fill in your project requirements below. Submitting opens a pre-drafted email directly to{' '}
                <span className="font-mono text-foreground font-medium">abhishek.mane.work@gmail.com</span>.
              </p>

              <form onSubmit={handleBottomSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Weber"
                      value={bottomForm.name}
                      onChange={(e) => setBottomForm({ ...bottomForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-neutral-200 dark:border-white/10 text-base sm:text-sm text-foreground focus:outline-none focus:border-[#d4a373]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="alex@company.com"
                      value={bottomForm.email}
                      onChange={(e) => setBottomForm({ ...bottomForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-neutral-200 dark:border-white/10 text-base sm:text-sm text-foreground focus:outline-none focus:border-[#d4a373]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                      Primary Service
                    </label>
                    <select
                      value={bottomService}
                      onChange={(e) => setBottomService(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-background border border-neutral-200 dark:border-white/10 text-base sm:text-sm text-foreground focus:outline-none focus:border-[#d4a373]"
                    >
                      {servicesData.map((s) => (
                        <option key={s.id} value={s.title}>
                          {s.title}
                        </option>
                      ))}
                      <option value="General Consultation / Other">General Consultation / Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                      Timeline
                    </label>
                    <select
                      value={bottomForm.timeline}
                      onChange={(e) => setBottomForm({ ...bottomForm, timeline: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-background border border-neutral-200 dark:border-white/10 text-base sm:text-sm text-foreground focus:outline-none focus:border-[#d4a373]"
                    >
                      <option value="Immediate (< 1 week)">Immediate (&lt; 1 week)</option>
                      <option value="Within 2–4 weeks">Within 2–4 weeks</option>
                      <option value="1–2 Months">1–2 Months</option>
                      <option value="Flexible / Future Sprint">Flexible / Future Sprint</option>
                    </select>
                  </div>
                </div>

                {/* Simple Estimated Budget Input - Number Typing */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500">
                      Estimated Budget (Number)
                    </label>

                    {/* Currency selector toggle */}
                    <div className="inline-flex rounded-lg p-0.5 bg-neutral-200/80 dark:bg-white/10">
                      <button
                        type="button"
                        onClick={() => handleBottomCurrencyChange('USD')}
                        className={`px-2.5 py-1 rounded text-[11px] font-mono font-medium transition-colors cursor-pointer ${bottomCurrency === 'USD'
                            ? 'bg-white dark:bg-white/25 text-black dark:text-white shadow-2xs'
                            : 'text-neutral-500 hover:text-foreground'
                          }`}
                      >
                        Dollar ($)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleBottomCurrencyChange('INR')}
                        className={`px-2.5 py-1 rounded text-[11px] font-mono font-medium transition-colors cursor-pointer ${bottomCurrency === 'INR'
                            ? 'bg-white dark:bg-white/25 text-black dark:text-white shadow-2xs'
                            : 'text-neutral-500 hover:text-foreground'
                          }`}
                      >
                        Rupee (₹)
                      </button>
                    </div>
                  </div>

                  {/* Simple Numeric Input Field with Auto Comma Formatting */}
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-mono text-neutral-500 font-semibold pointer-events-none">
                      {bottomCurrency === 'INR' ? '₹' : '$'}
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder={bottomCurrency === 'INR' ? 'Enter budget amount, e.g. 20,000' : 'Enter budget amount, e.g. 1,500'}
                      value={bottomBudget}
                      onChange={(e) => setBottomBudget(formatBudgetInput(e.target.value, bottomCurrency))}
                      className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-background border border-neutral-200 dark:border-white/10 text-base sm:text-sm text-foreground focus:outline-none focus:border-[#d4a373]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                    Project Scope or Questions
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Briefly describe what you are looking to build, analyze, or optimize..."
                    value={bottomForm.message}
                    onChange={(e) => setBottomForm({ ...bottomForm, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-neutral-200 dark:border-white/10 text-base sm:text-sm text-foreground focus:outline-none focus:border-[#d4a373]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-5 rounded-xl bg-[#d4a373] hover:bg-[#c39262] text-white font-medium text-xs sm:text-sm uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Project Brief to Abhishek</span>
                </button>
              </form>
            </div>

            {/* Social Links & Direct Email */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
              <a
                href="mailto:abhishek.mane.work@gmail.com"
                className="px-5 py-2.5 rounded-xl bg-card border border-neutral-300 dark:border-white/15 text-foreground hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors flex items-center gap-2 text-xs font-mono shadow-sm"
              >
                <Mail className="w-4 h-4 text-[#8a5827] dark:text-[#d4a373]" />
                <span>abhishek.mane.work@gmail.com</span>
              </a>

              <div className="flex items-center gap-3 text-neutral-500 dark:text-neutral-400">
                <a
                  href="https://www.linkedin.com/in/abhishek-mane-aiml/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-card border border-neutral-200 dark:border-white/10 hover:text-foreground transition-colors"
                  title="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="https://github.com/abhishekmane-ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-card border border-neutral-200 dark:border-white/10 hover:text-foreground transition-colors"
                  title="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href="https://www.intelligentagentworks.com/course"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-card border border-neutral-200 dark:border-white/10 hover:text-[#d4a373] transition-colors"
                  title="AI Engineering Course Prospectus"
                >
                  <GraduationCap className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Inquiry Modal - Simple Budget Number Input & No Top Border */}
        <AnimatePresence>
          {inquiryModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="relative w-full max-w-lg rounded-2xl bg-card border border-neutral-200 dark:border-white/15 shadow-2xl my-auto max-h-[92vh] flex flex-col overflow-hidden"
              >
                {/* Sticky Header */}
                <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-md px-5 sm:px-7 pt-5 sm:pt-6 pb-3 border-b border-neutral-100 dark:border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#8a5827] dark:text-[#d4a373] block">
                      Direct Project Inquiry
                    </span>
                    <h3 className="text-base sm:text-lg md:text-xl font-serif font-normal text-foreground leading-tight">
                      {selectedServiceForInquiry}
                    </h3>
                  </div>
                  <button
                    onClick={() => setInquiryModalOpen(false)}
                    className="p-2 -mr-2 rounded-lg text-neutral-400 hover:text-foreground hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors cursor-pointer flex-shrink-0"
                    aria-label="Close modal"
                  >
                    ✕
                  </button>
                </div>

                {/* Scrollable Form Body */}
                <div className="px-5 sm:px-7 py-4 overflow-y-auto flex-1 overscroll-contain">
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light mb-4">
                    Fill in a quick brief below. Submitting will prepare your email draft directly to{' '}
                    <span className="text-foreground font-mono font-medium">abhishek.mane.work@gmail.com</span> with your specified budget and details.
                  </p>

                  <form id="modal-inquiry-form" onSubmit={handleInquirySubmit} className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alex Weber"
                        value={inquiryForm.name}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-neutral-200 dark:border-white/10 text-base sm:text-sm text-foreground focus:outline-none focus:border-[#d4a373]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="alex@company.com"
                        value={inquiryForm.email}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-neutral-200 dark:border-white/10 text-base sm:text-sm text-foreground focus:outline-none focus:border-[#d4a373]"
                      />
                    </div>

                    {/* Simple Estimated Budget Input - Number Typing */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500">
                          Estimated Budget (Number)
                        </label>

                        {/* Currency selector toggle */}
                        <div className="inline-flex rounded-lg p-0.5 bg-neutral-200/80 dark:bg-white/10">
                          <button
                            type="button"
                            onClick={() => handleInquiryCurrencyChange('USD')}
                            className={`px-2.5 py-1 rounded text-[11px] font-mono font-medium transition-colors cursor-pointer ${inquiryCurrency === 'USD'
                                ? 'bg-white dark:bg-white/25 text-black dark:text-white shadow-2xs'
                               : 'text-neutral-500 hover:text-foreground'
                              }`}
                          >
                            Dollar ($)
                          </button>
                          <button
                            type="button"
                            onClick={() => handleInquiryCurrencyChange('INR')}
                            className={`px-2.5 py-1 rounded text-[11px] font-mono font-medium transition-colors cursor-pointer ${inquiryCurrency === 'INR'
                                ? 'bg-white dark:bg-white/25 text-black dark:text-white shadow-2xs'
                                : 'text-neutral-500 hover:text-foreground'
                              }`}
                          >
                            Rupee (₹)
                          </button>
                        </div>
                      </div>

                      {/* Simple Numeric Input Field with Auto Comma Formatting */}
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-mono text-neutral-500 font-semibold pointer-events-none">
                          {inquiryCurrency === 'INR' ? '₹' : '$'}
                        </span>
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder={inquiryCurrency === 'INR' ? 'Enter budget amount, e.g. 20,000' : 'Enter budget amount, e.g. 1,500'}
                          value={inquiryBudget}
                          onChange={(e) => setInquiryBudget(formatBudgetInput(e.target.value, inquiryCurrency))}
                          className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-background border border-neutral-200 dark:border-white/10 text-base sm:text-sm text-foreground focus:outline-none focus:border-[#d4a373]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                        Timeline
                      </label>
                      <select
                        value={inquiryForm.timeline}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, timeline: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-background border border-neutral-200 dark:border-white/10 text-base sm:text-sm text-foreground focus:outline-none focus:border-[#d4a373]"
                      >
                        <option value="Immediate (< 1 week)">Immediate (&lt; 1 week)</option>
                        <option value="Within 2–4 weeks">Within 2–4 weeks</option>
                        <option value="1–2 Months">1–2 Months</option>
                        <option value="Flexible / Future Sprint">Flexible / Future Sprint</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                        Project Scope or Questions
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Briefly describe what you are looking to build, analyze, or optimize..."
                        value={inquiryForm.message}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-neutral-200 dark:border-white/10 text-base sm:text-sm text-foreground focus:outline-none focus:border-[#d4a373]"
                      />
                    </div>
                  </form>
                </div>

                {/* Sticky Footer Actions */}
                <div className="sticky bottom-0 z-10 bg-card/95 backdrop-blur-md px-5 sm:px-7 py-3 sm:py-4 border-t border-neutral-100 dark:border-white/10 flex flex-col-reverse sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={() => setInquiryModalOpen(false)}
                    className="w-full sm:w-auto px-4 py-2.5 sm:py-3 rounded-xl bg-neutral-100 dark:bg-white/10 text-neutral-600 dark:text-neutral-400 text-xs font-medium uppercase tracking-wider hover:bg-neutral-200 dark:hover:bg-white/20 transition-colors cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form="modal-inquiry-form"
                    className="flex-1 py-2.5 sm:py-3 px-4 rounded-xl bg-[#d4a373] hover:bg-[#c39262] text-white font-medium text-xs sm:text-sm uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Project Brief</span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
