import { Link } from 'react-router-dom'

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-900">
            <div className="text-center space-y-6">
                <h1 className="text-9xl font-bold text-[#d4a373]">404</h1>
                <h2 className="text-3xl font-semibold text-white">Page Not Found</h2>
                <p className="text-neutral-400">
                    The page you're looking for doesn't exist.
                </p>
                <Link
                    to="/"
                    className="inline-block px-6 py-3 bg-[#d4a373] text-black rounded-lg font-medium hover:bg-[#c49363] transition-colors"
                >
                    Go Home
                </Link>
            </div>
        </div>
    )
}
