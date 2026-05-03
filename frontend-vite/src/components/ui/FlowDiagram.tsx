import React, { useMemo } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    Edge,
    Node,
    ConnectionLineType,
    MarkerType,
    Panel,
    BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useTheme } from '@/context/ThemeContext';

interface FlowDiagramProps {
    nodes: Node[];
    edges: Edge[];
    height?: string;
    title?: string;
}

const FlowDiagram: React.FC<FlowDiagramProps> = ({ nodes, edges, height = '400px', title }) => {
    const [responsiveHeight, setResponsiveHeight] = React.useState(height);

    React.useEffect(() => {
        const updateHeight = () => {
            const width = window.innerWidth;
            if (width < 768) {
                // On mobile, reduce fixed pixel heights if they are large
                if (height.endsWith('px')) {
                    const h = parseInt(height);
                    if (h > 400) {
                        setResponsiveHeight(`${Math.max(300, h * 0.6)}px`);
                    } else {
                        setResponsiveHeight(height);
                    }
                } else {
                    setResponsiveHeight(height);
                }
            } else {
                setResponsiveHeight(height);
            }
        };

        updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, [height]);

    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';

    const defaultEdgeOptions = useMemo(() => ({
        style: {
            strokeWidth: 2,
            stroke: isDark ? '#d4a373' : '#d4a373',
            transition: 'all 0.3s ease',
        },
        type: ConnectionLineType.SmoothStep,
        markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#d4a373',
        },
    }), [isDark]);

    const flowStyles = useMemo(() => ({
        background: 'transparent',
        width: '100%',
        height: responsiveHeight,
    }), [responsiveHeight]);

    return (
        <div className="relative w-full overflow-hidden rounded-2xl border border-neutral-300 dark:border-white/10 bg-white dark:bg-[#050505] shadow-2xl transition-all duration-300 group hover:border-[#d4a373]/30" style={{ height: responsiveHeight }}>
            <style dangerouslySetInnerHTML={{ __html: `
                .react-flow__node div {
                    color: ${isDark ? '#f3f4f6' : '#111827'} !important;
                    line-height: 1.4 !important;
                    font-weight: 500 !important;
                }
                .react-flow__node-group {
                    color: ${isDark ? '#d4a373' : '#8b5a2b'} !important;
                    background-color: ${isDark ? 'rgba(212, 163, 115, 0.1)' : 'rgba(212, 163, 115, 0.05)'} !important;
                }
                .react-flow__edge-path {
                    stroke: ${isDark ? '#d4a373' : '#d4a373'} !important;
                    stroke-width: 3 !important;
                    opacity: 0.8 !important;
                }
                .react-flow__controls button {
                    background-color: ${isDark ? '#1a1a1a' : '#ffffff'} !important;
                    border-color: ${isDark ? '#333' : '#eee'} !important;
                    color: ${isDark ? '#fff' : '#000'} !important;
                }
            `}} />
            <ReactFlow
                nodes={nodes}
                edges={edges}
                style={flowStyles}
                defaultEdgeOptions={defaultEdgeOptions}
                colorMode={isDark ? 'dark' : 'light'}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                minZoom={0.5}
                maxZoom={1.5}
                proOptions={{ hideAttribution: true }}
                nodesConnectable={false}
                nodesDraggable={true}
                elementsSelectable={true}
            >
                <Background 
                    color={isDark ? '#d4a373' : '#d4a373'} 
                    gap={20} 
                    size={1} 
                    variant={BackgroundVariant.Dots}
                    style={{ opacity: isDark ? 0.15 : 0.2 }}
                />
                <Controls 
                    showInteractive={false} 
                    className="!bg-white dark:!bg-[#111] !border-neutral-200 dark:!border-white/10 !shadow-xl rounded-lg overflow-hidden"
                />
                {title && (
                    <Panel position="top-left" className="m-4">
                        <div className="px-4 py-2 rounded-xl bg-white/90 dark:bg-black/80 backdrop-blur-md border border-neutral-200 dark:border-white/10 shadow-lg">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#8b5a2b] dark:text-[#d4a373]">
                                {title}
                            </span>
                        </div>
                    </Panel>
                )}
            </ReactFlow>
        </div>
    );
};

export default FlowDiagram;
