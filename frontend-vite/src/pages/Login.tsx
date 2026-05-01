export default function Login() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-900">
            <div className="w-full max-w-md p-8 bg-neutral-800 rounded-2xl border border-neutral-700">
                <h1 className="text-3xl font-bold text-white mb-6">Login</h1>
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-[#d4a373]"
                            placeholder="your@email.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-[#d4a373]"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-[#d4a373] text-black rounded-lg font-medium hover:bg-[#c49363] transition-colors"
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    )
}
