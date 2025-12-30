"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

interface CodeBlockProps {
    children: string
    className?: string
}

export function CodeBlock({ children, className }: CodeBlockProps) {
    const [copied, setCopied] = useState(false)

    // Extract language from className (e.g., "language-python")
    const language = className?.replace("language-", "") || "code"

    const handleCopy = async () => {
        await navigator.clipboard.writeText(children)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="relative group my-3 rounded-xl overflow-hidden border border-white/10">
            {/* Header with language and copy button */}
            <div className="flex items-center justify-between px-4 py-2 bg-black/60 border-b border-white/10">
                <span className="text-xs font-mono text-gray-400 uppercase">{language}</span>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-white/10 rounded transition-all"
                >
                    {copied ? (
                        <>
                            <Check size={12} className="text-green-400" />
                            <span className="text-green-400">Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy size={12} />
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>

            {/* Code content */}
            <pre className="p-4 overflow-x-auto bg-black/40 text-sm">
                <code className="font-mono text-gray-200 leading-relaxed">
                    {children}
                </code>
            </pre>
        </div>
    )
}

// Inline code component
export function InlineCode({ children }: { children: React.ReactNode }) {
    return (
        <code className="px-1.5 py-0.5 bg-white/10 rounded text-red-300 font-mono text-sm">
            {children}
        </code>
    )
}
