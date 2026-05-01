import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Minimize2, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Copy, Check } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface MermaidProps {
    chart: string;
    id?: string;
    className?: string;
}

const Mermaid: React.FC<MermaidProps> = ({ chart, id = 'mermaid-diagram', className = '' }) => {
    const { theme } = useTheme();
    const elementRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const [translateX, setTranslateX] = useState(0);
    const [translateY, setTranslateY] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [isRendered, setIsRendered] = useState(false);

    // Drag to pan state
    const [isDragging, setIsDragging] = useState(false);
    const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

    const handleZoomIn = () => setScale(prev => Math.min(prev + 0.5, 5));
    const handleZoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.1));
    const handlePanLeft = () => setTranslateX(prev => prev - 100);
    const handlePanRight = () => setTranslateX(prev => prev + 100);
    const handlePanUp = () => setTranslateY(prev => prev - 100);
    const handlePanDown = () => setTranslateY(prev => prev + 100);

    const handleReset = () => {
        setScale(1);
        setTranslateX(0);
        setTranslateY(0);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setLastMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        const deltaX = e.clientX - lastMousePos.x;
        const deltaY = e.clientY - lastMousePos.y;
        setTranslateX(prev => prev + deltaX);
        setTranslateY(prev => prev + deltaY);
        setLastMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const toggleFullscreen = () => {
        if (!containerRef.current) return;
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const handleCopy = () => {
        if (elementRef.current) {
            const svgElement = elementRef.current.querySelector('svg');
            if (svgElement) {
                const svgData = new XMLSerializer().serializeToString(svgElement);
                navigator.clipboard.writeText(svgData);
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            }
        }
    };

    useEffect(() => {
        const handleFSChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFSChange);
        return () => document.removeEventListener('fullscreenchange', handleFSChange);
    }, []);

    useEffect(() => {
        let isMounted = true;

        const renderDiagram = async () => {
            if (!elementRef.current || !chart) return;

            // Clean the chart string: trim whitespace and ensure consistent newlines
            const cleanedChart = chart.trim().replace(/\r\n/g, '\n');

            try {
                // Generate a truly unique ID for this specific render instance
                const renderId = `mermaid-svg-${id.replace(/[^a-zA-Z0-9]/g, '-')}-${Math.floor(Math.random() * 1000000)}`;

                setIsRendered(false);

                // Pre-clear with a loading state
                if (elementRef.current) {
                    elementRef.current.innerHTML = `
                        <div class="flex flex-col items-center justify-center p-12 space-y-4">
                            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-blue"></div>
                            <p class="text-xs font-mono uppercase tracking-widest opacity-50">Architecting Flow...</p>
                        </div>`;
                }

                // Initialize mermaid right before rendering
                mermaid.initialize({
                    startOnLoad: false,
                    theme: theme === 'dark' ? 'dark' : 'default',
                    securityLevel: 'loose',
                    fontFamily: 'Inter, system-ui, sans-serif',
                });

                // Render the diagram - use a hidden container to avoid flickering/clashes
                const { svg } = await mermaid.render(renderId, cleanedChart);

                if (isMounted && elementRef.current) {
                    elementRef.current.innerHTML = svg;
                    setIsRendered(true);

                    const svgElement = elementRef.current.querySelector('svg');
                    if (svgElement) {
                        svgElement.setAttribute('width', '100%');
                        svgElement.setAttribute('height', '100%');
                        svgElement.style.maxWidth = '1000%';
                        svgElement.style.height = 'auto';
                        svgElement.style.display = 'block';
                        svgElement.style.margin = 'auto';
                    }
                }
            } catch (error) {
                console.error('Mermaid rendering failed:', error);
                if (isMounted && elementRef.current) {
                    elementRef.current.innerHTML = `
                        <div class="flex flex-col items-center justify-center p-12 text-center">
                            <div class="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                                <span class="text-red-500 text-2xl">!</span>
                            </div>
                            <p class="text-foreground font-medium mb-1">Diagram Render Error</p>
                            <p class="text-muted-foreground text-xs font-mono max-w-xs mb-4">${error instanceof Error ? error.message : 'Invalid Mermaid syntax'}</p>
                            <button onclick="window.location.reload()" class="px-4 py-2 rounded-lg bg-accent-blue/10 text-accent-blue text-xs font-mono uppercase tracking-widest hover:bg-accent-blue/20 transition-all">
                                Reload Page
                            </button>
                        </div>
                    `;
                }
            }
        };

        // Delay slightly to ensure theme and DOM are ready
        const timeoutId = setTimeout(renderDiagram, 100);
        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
        };
    }, [chart, id, theme]);

    return (
        <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={`mermaid-wrapper group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl transition-all duration-500 ${isFullscreen ? 'fixed inset-0 z-[100] bg-white dark:bg-black p-4 md:p-12' : 'h-[400px] md:h-[600px] lg:h-[700px] xl:h-[800px] 2xl:h-[1000px]'} ${className}`}
        >
            {/* Control Bar (Top Right) */}
            <div className="absolute top-6 right-6 z-20 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <button
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={handleCopy}
                    className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black/5 dark:bg-white/5 text-black/50 dark:text-white/50 hover:bg-black/10 dark:hover:bg-white/10 hover:text-black dark:hover:text-white backdrop-blur-md transition-all active:scale-95"
                    title="Copy SVG"
                >
                    {isCopied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                </button>
                <button
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={toggleFullscreen}
                    className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black/5 dark:bg-white/5 text-black/50 dark:text-white/50 hover:bg-black/10 dark:hover:bg-white/10 hover:text-black dark:hover:text-white backdrop-blur-md transition-all active:scale-95"
                    title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                >
                    {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </button>
            </div>

            {/* Main Controls (Bottom Right) */}
            <div className="absolute bottom-8 right-8 z-20 flex flex-col items-end gap-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">

                {/* Visual D-Pad Navigator */}
                <div className="flex flex-col items-center gap-1 p-3 rounded-3xl bg-black/5 dark:bg-white/5 backdrop-blur-2xl" onMouseDown={(e) => e.stopPropagation()}>
                    <button onClick={handlePanUp} className="p-3 text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 rounded-2xl transition-all"><ChevronUp className="w-7 h-7" /></button>
                    <div className="flex items-center gap-1">
                        <button onClick={handlePanLeft} className="p-3 text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 rounded-2xl transition-all"><ChevronLeft className="w-7 h-7" /></button>
                        <button
                            onClick={handleReset}
                            className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent-blue/20 text-accent-blue hover:bg-accent-blue/30 transition-all active:rotate-180 duration-500"
                            title="Reset View"
                        >
                            <RotateCcw className="w-6 h-6" />
                        </button>
                        <button onClick={handlePanRight} className="p-3 text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 rounded-2xl transition-all"><ChevronRight className="w-7 h-7" /></button>
                    </div>
                    <button onClick={handlePanDown} className="p-3 text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 rounded-2xl transition-all"><ChevronDown className="w-7 h-7" /></button>
                </div>

                {/* Zoom Box */}
                <div className="flex flex-col gap-1 p-1.5 rounded-xl bg-black/5 dark:bg-white/5 backdrop-blur-xl" onMouseDown={(e) => e.stopPropagation()}>
                    <button onClick={handleZoomIn} className="p-4 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 rounded-xl transition-all" title="Zoom In"><ZoomIn className="w-6 h-6" /></button>
                    <button onClick={handleZoomOut} className="p-4 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 rounded-xl transition-all" title="Zoom Out"><ZoomOut className="w-6 h-6" /></button>
                </div>
            </div>

            {/* Diagram Viewport */}
            <div
                className={`flex h-full w-full items-center justify-center transition-transform duration-500 ease-out select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                style={{
                    transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
                    transformOrigin: 'center center'
                }}
            >
                <div ref={elementRef} className="mermaid-container flex h-full w-full items-center justify-center p-8 md:p-16 lg:p-24 xl:p-32" />
            </div>

            {/* Metadata Badges */}
            <div className="absolute bottom-8 left-8 z-20 flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="px-5 py-2.5 rounded-xl bg-white/60 dark:bg-black/60 backdrop-blur-md text-[11px] font-mono text-accent-blue tracking-widest uppercase">
                    Scale {Math.round(scale * 100)}%
                </div>
                <div className="hidden sm:flex px-5 py-2.5 rounded-xl bg-white/60 dark:bg-black/60 backdrop-blur-md text-[11px] font-mono text-black/30 dark:text-white/30 tracking-widest uppercase">
                    Pos {Math.round(translateX)}, {Math.round(translateY)}
                </div>
            </div>
        </div>
    );
};

export default Mermaid;
