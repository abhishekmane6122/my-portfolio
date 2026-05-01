import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Link } from 'react-router-dom'

interface Props {
    children: ReactNode
    fallback?: ReactNode
}

interface State {
    hasError: boolean
    error: Error | null
    errorInfo: ErrorInfo | null
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        }
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
            errorInfo: null,
        }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo)
        this.setState({
            error,
            errorInfo,
        })

        // TODO: Log to error reporting service (Sentry, LogRocket, etc.)
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        })
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback
            }

            return (
                <div className="min-h-screen bg-background flex items-center justify-center px-6">
                    <div className="max-w-2xl w-full">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 mb-6">
                                <AlertTriangle className="w-10 h-10 text-red-500" />
                            </div>
                            <h1 className="text-4xl font-bold text-foreground mb-4">
                                Oops! Something went wrong
                            </h1>
                            <p className="text-lg text-muted-foreground mb-8">
                                We encountered an unexpected error. Don't worry, it's not your fault!
                            </p>
                        </div>

                        {import.meta.env.DEV && this.state.error && (
                            <div className="mb-8 p-6 rounded-2xl bg-red-500/5 border border-red-500/20">
                                <h2 className="text-lg font-semibold text-red-500 mb-3">Error Details:</h2>
                                <pre className="text-sm text-foreground overflow-x-auto p-4 rounded-lg bg-neutral-900 text-red-400">
                                    {this.state.error.toString()}
                                    {this.state.errorInfo && (
                                        <>
                                            {'\n\n'}
                                            {this.state.errorInfo.componentStack}
                                        </>
                                    )}
                                </pre>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={this.handleReset}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#d4a373] text-white font-medium hover:bg-[#c49363] transition-all shadow-lg shadow-[#d4a373]/20"
                            >
                                <RefreshCw className="w-5 h-5" />
                                Try Again
                            </button>
                            <Link
                                to="/"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-neutral-100 dark:bg-white/5 text-foreground font-medium hover:bg-neutral-200 dark:hover:bg-white/10 transition-all border border-neutral-200 dark:border-white/10"
                            >
                                <Home className="w-5 h-5" />
                                Go Home
                            </Link>
                        </div>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
