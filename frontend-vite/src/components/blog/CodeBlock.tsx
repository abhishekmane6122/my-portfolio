import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '@/context/ThemeContext';
import Mermaid from '@/components/ui/Mermaid';
import FlowDiagram from '@/components/ui/FlowDiagram';

interface CodeBlockProps {
    language: string;
    value: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, value }) => {
    const [copied, setCopied] = useState(false);
    const { resolvedTheme } = useTheme();

    const copyToClipboard = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (language === 'mermaid') {
        return (
            <div className="my-10 w-full">
                <Mermaid
                    chart={value}
                    id={`mermaid-${Math.random().toString(36).substring(2, 11)}`}
                />
            </div>
        );
    }

    if (language === 'react-flow') {
        try {
            const flowData = JSON.parse(value);
            return (
                <div className="my-10 w-full">
                    <FlowDiagram
                        nodes={flowData.nodes}
                        edges={flowData.edges}
                        height={flowData.height || '400px'}
                        title={flowData.title}
                    />
                </div>
            );
        } catch (e) {
            return (
                <div className="my-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                    Failed to parse Flow Diagram data: {e instanceof Error ? e.message : 'Unknown error'}
                </div>
            );
        }
    }

    const isDiagram = language === 'text';
    const isTerminal = language === 'shell' || language === 'bash' || language === 'terminal';

    if (isDiagram) {
        return (
            <div className="my-6 w-full">
                <div className="w-full overflow-x-auto rounded-lg bg-gray-50/50 dark:bg-bg-tertiary/50">
                    <pre className="font-mono text-[0.875rem] leading-[1.6] text-gray-700 dark:text-text-secondary whitespace-pre p-6">
                        {value}
                    </pre>
                </div>
            </div>
        );
    }

    return (
        <div className="relative group my-8 overflow-hidden rounded-lg bg-gray-50 dark:bg-bg-tertiary transition-all duration-300">
            <div className="flex justify-between items-center px-4 py-2 bg-transparent border-b border-black/5 dark:border-white/5">
                <div className="flex items-center gap-2">
                    {isTerminal && <div className="flex gap-1.5 px-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                    </div>}
                    <span className="text-[10px] font-mono font-medium text-gray-400 dark:text-text-tertiary uppercase tracking-widest">
                        {language}
                    </span>
                </div>
                <button
                    onClick={copyToClipboard}
                    className="p-1 px-3 rounded-md bg-white/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 text-gray-400 dark:text-text-secondary hover:text-accent-blue transition-all flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest"
                >
                    {copied ? (
                        <>
                            <Check className="w-3 h-3 text-green-500" />
                            <span className="text-green-500">Copied</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>
            <div className="overflow-x-auto">
                <SyntaxHighlighter
                    language={isTerminal ? 'text' : language}
                    style={resolvedTheme === 'dark' ? atomDark : prism}
                    customStyle={{
                        margin: 0,
                        padding: '1.5rem',
                        background: 'transparent',
                        fontSize: '0.875rem',
                        lineHeight: '1.7',
                        fontFamily: 'JetBrains Mono, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                    }}
                    showLineNumbers={!isTerminal && language !== 'text'}
                    wrapLines={true}
                >
                    {value}
                </SyntaxHighlighter>
            </div>
        </div>
    );
};

export default CodeBlock;
