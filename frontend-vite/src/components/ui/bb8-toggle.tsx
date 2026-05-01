import { useEffect, useState } from 'react'
import { useTheme } from '@/context/ThemeContext'
import './bb8-toggle.css'

export default function BB8Toggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const handleToggle = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }

    return (
        <label className="bb8-toggle">
            <input
                className="bb8-toggle__checkbox"
                type="checkbox"
                checked={theme === 'dark'}
                onChange={handleToggle}
            />
            <div className="bb8-toggle__container">
                <div className="bb8-toggle__scenery">
                    <div className="bb8-toggle__star" />
                    <div className="bb8-toggle__star" />
                    <div className="bb8-toggle__star" />
                    <div className="bb8-toggle__star" />
                    <div className="bb8-toggle__star" />
                    <div className="bb8-toggle__star" />
                    <div className="bb8-toggle__star" />
                    <div className="tatto-1" />
                    <div className="tatto-2" />
                    <div className="gomrassen" />
                    <div className="hermes" />
                    <div className="chenini" />
                    <div className="bb8-toggle__cloud" />
                    <div className="bb8-toggle__cloud" />
                    <div className="bb8-toggle__cloud" />
                </div>
                <div className="bb8">
                    <div className="bb8__head-container">
                        <div className="bb8__antenna" />
                        <div className="bb8__antenna" />
                        <div className="bb8__head" />
                    </div>
                    <div className="bb8__body" />
                </div>
                <div className="artificial__hidden">
                    <div className="bb8__shadow" />
                </div>
            </div>
        </label>
    )
}
