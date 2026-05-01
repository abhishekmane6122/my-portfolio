export default function SkeletonLoader() {
    return (
        <div className="animate-pulse space-y-8">
            {/* Header skeleton */}
            <div className="space-y-3">
                <div className="h-4 bg-neutral-200 dark:bg-white/10 rounded w-1/4"></div>
                <div className="h-12 bg-neutral-200 dark:bg-white/10 rounded w-3/4"></div>
                <div className="h-4 bg-neutral-200 dark:bg-white/10 rounded w-1/2"></div>
            </div>

            {/* Content skeleton */}
            <div className="space-y-4">
                <div className="h-4 bg-neutral-200 dark:bg-white/10 rounded"></div>
                <div className="h-4 bg-neutral-200 dark:bg-white/10 rounded"></div>
                <div className="h-4 bg-neutral-200 dark:bg-white/10 rounded w-5/6"></div>
            </div>

            <div className="space-y-4">
                <div className="h-4 bg-neutral-200 dark:bg-white/10 rounded"></div>
                <div className="h-4 bg-neutral-200 dark:bg-white/10 rounded w-4/5"></div>
                <div className="h-4 bg-neutral-200 dark:bg-white/10 rounded"></div>
            </div>

            {/* Image skeleton */}
            <div className="h-64 bg-neutral-200 dark:bg-white/10 rounded-2xl"></div>

            <div className="space-y-4">
                <div className="h-4 bg-neutral-200 dark:bg-white/10 rounded"></div>
                <div className="h-4 bg-neutral-200 dark:bg-white/10 rounded"></div>
                <div className="h-4 bg-neutral-200 dark:bg-white/10 rounded w-3/4"></div>
            </div>
        </div>
    )
}
