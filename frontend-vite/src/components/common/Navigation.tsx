import { Link, useLocation } from 'react-router-dom'
import { Home, BookOpen, Mail } from 'lucide-react'

interface NavLinkItem {
    to: string
    label: string
    icon?: React.ReactNode
    isExternal?: boolean
}

const navLinks: NavLinkItem[] = [
    { to: '/', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { to: '/blog', label: 'Blog', icon: <BookOpen className="w-4 h-4" /> },
    { to: 'mailto:abhishek.mane.work@gmail.com', label: 'Get in Touch', icon: <Mail className="w-4 h-4" />, isExternal: true },
]

export default function Navigation() {
    const location = useLocation()

    const isActive = (path: string) => {
        if (path === '/') {
            return location.pathname === '/'
        }
        return location.pathname.startsWith(path)
    }

    return (
        <nav
            className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-bg-primary/90 backdrop-blur-md border-b border-neutral-300 dark:border-bg-elevated"
            role="navigation"
            aria-label="Main navigation"
        >
            <div className="max-w-7xl mx-auto px-6 py-2.5">
                <div className="flex items-center justify-between">
                    <Link
                        to="/"
                        className="text-base font-bold text-gray-900 dark:text-text-primary hover:text-accent-blue transition-colors"
                        aria-label="Abhishek Mane - Home"
                    >
                        Abhishek Mane
                    </Link>

                    <div className="flex items-center gap-1" role="menubar">
                        {navLinks.map((link) => {
                            const className = `px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-2 text-sm ${isActive(link.to)
                                ? 'bg-accent-blue text-white shadow-md'
                                : 'text-gray-600 dark:text-text-secondary hover:text-gray-900 dark:hover:text-text-primary hover:bg-gray-100 dark:hover:bg-bg-secondary'
                                }`;

                            if (link.isExternal) {
                                return (
                                    <a
                                        key={link.to}
                                        href={link.to}
                                        role="menuitem"
                                        className={className}
                                    >
                                        {link.icon}
                                        <span className="hidden sm:inline">{link.label}</span>
                                    </a>
                                );
                            }

                            return (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    role="menuitem"
                                    aria-current={isActive(link.to) ? 'page' : undefined}
                                    className={className}
                                >
                                    {link.icon}
                                    <span className="hidden sm:inline">{link.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </nav>
    )
}
