import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
    theme: Theme
    setTheme: (theme: Theme) => void
    resolvedTheme: Theme
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Initialize theme before React renders to prevent flash
const getInitialTheme = (): Theme => {
    if (typeof window === 'undefined') return 'dark'

    const stored = localStorage.getItem('theme') as Theme | null
    if (stored) return stored

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    return prefersDark ? 'dark' : 'light'
}

// Apply theme to document immediately
const applyTheme = (theme: Theme) => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
}

// Initialize theme before React hydration
if (typeof window !== 'undefined') {
    applyTheme(getInitialTheme())
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>(getInitialTheme)

    useEffect(() => {
        // Listen for storage changes from other tabs
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'theme' && e.newValue) {
                const newTheme = e.newValue as Theme
                setThemeState(newTheme)
                applyTheme(newTheme)
            }
        }

        window.addEventListener('storage', handleStorageChange)
        return () => window.removeEventListener('storage', handleStorageChange)
    }, [])

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme)
        localStorage.setItem('theme', newTheme)
        applyTheme(newTheme)
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme: theme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider')
    }
    return context
}
