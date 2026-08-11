import { useEffect, useRef } from 'react'

/**
 * Vertical reading-progress bar.
 *
 * Deliberately keeps the scroll position out of React state: the article body
 * contains Mermaid diagrams whose render effects restart whenever the page
 * re-renders, so a state update on every scroll event left them permanently
 * stuck on their loading spinner. Writing the height straight to the DOM inside
 * a rAF keeps scrolling free of React work entirely.
 */
export default function ReadingProgress() {
    const barRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        let frame = 0

        const update = () => {
            frame = 0
            const bar = barRef.current
            if (!bar) return
            const total = document.documentElement.scrollHeight - window.innerHeight
            const progress = total > 0 ? (window.scrollY / total) * 100 : 0
            bar.style.height = `${Math.min(100, Math.max(0, progress))}%`
        }

        const onScroll = () => {
            if (!frame) frame = window.requestAnimationFrame(update)
        }

        update()
        window.addEventListener('scroll', onScroll, { passive: true })
        window.addEventListener('resize', onScroll)
        return () => {
            if (frame) window.cancelAnimationFrame(frame)
            window.removeEventListener('scroll', onScroll)
            window.removeEventListener('resize', onScroll)
        }
    }, [])

    return (
        <div className="fixed top-0 left-0 w-1 h-full z-[100] bg-black/5 dark:bg-white/5 pointer-events-none">
            <div
                ref={barRef}
                className="w-full bg-accent-blue origin-top shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                style={{ height: '0%' }}
            />
        </div>
    )
}
