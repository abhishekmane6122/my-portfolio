import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './context/ThemeContext'
import ErrorBoundary from './components/common/ErrorBoundary'
import Navigation from './components/common/Navigation'
import SkeletonLoader from './components/ui/SkeletonLoader'
import FloatingThemeToggle from './components/ui/FloatingThemeToggle'

// Lazy load pages for better performance
const Portfolio = lazy(() => import('./pages/Portfolio'))
const Login = lazy(() => import('./pages/Login'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Blog = lazy(() => import('./pages/Blog'))
const BlogPost = lazy(() => import('./pages/BlogPost'))
const Contact = lazy(() => import('./pages/Contact'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const LLMOpsPage = lazy(() => import('./pages/LLMOpsPage'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center px-6">
    <div className="max-w-4xl w-full">
      <SkeletonLoader />
    </div>
  </div>
)

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <FloatingThemeToggle />
        <ScrollToTop />
        <Helmet>
          <title>Abhishek Mane | Full Stack Developer & AI/ML Engineer</title>
          <meta name="description" content="Professional portfolio of Abhishek Mane - Full Stack Developer specializing in AI/ML, React, Python, and FastAPI. View projects, experience, and technical blog." />
          <meta name="keywords" content="Abhishek Mane, Full Stack Developer, AI ML Engineer, React, Python, FastAPI, Portfolio" />
          <meta name="author" content="Abhishek Mane" />

          {/* Accessibility */}
          <html lang="en" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Helmet>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--toast-bg)',
              color: 'var(--toast-color)',
              border: '1px solid var(--toast-border)',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />

        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Portfolio />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="/llmops" element={<LLMOpsPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/:username" element={<Portfolio />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
