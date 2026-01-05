"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Download, FileText, Code, Copy, Check } from "lucide-react"

interface ExportChatProps {
    isOpen: boolean
    onClose: () => void
    messages: { role: string; content: string; timestamp: Date }[]
    sessionTitle?: string
}

export function ExportChat({ isOpen, onClose, messages, sessionTitle = "Chat" }: ExportChatProps) {
    const [format, setFormat] = useState<"markdown" | "text" | "json">("markdown")
    const [copied, setCopied] = useState(false)

    const generateExport = (): string => {
        const timestamp = new Date().toLocaleString("id-ID")

        if (format === "json") {
            return JSON.stringify({
                title: sessionTitle,
                exportedAt: timestamp,
                messages: messages.map(m => ({
                    role: m.role,
                    content: m.content,
                    timestamp: m.timestamp.toISOString()
                }))
            }, null, 2)
        }

        if (format === "markdown") {
            let md = `# ${sessionTitle}\n\n`
            md += `> Exported from RaffiTech AI on ${timestamp}\n\n---\n\n`

            messages.forEach(msg => {
                const role = msg.role === "user" ? "**You**" : "**RaffiTech AI**"
                md += `### ${role}\n\n${msg.content}\n\n---\n\n`
            })

            return md
        }

        // Plain text
        let text = `${sessionTitle}\nExported from RaffiTech AI on ${timestamp}\n\n`
        text += "=".repeat(50) + "\n\n"

        messages.forEach(msg => {
            const role = msg.role === "user" ? "You:" : "RaffiTech AI:"
            text += `${role}\n${msg.content}\n\n` + "-".repeat(30) + "\n\n"
        })

        return text
    }

    const handleCopy = async () => {
        await navigator.clipboard.writeText(generateExport())
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleDownload = () => {
        const content = generateExport()
        const extensions = { markdown: "md", text: "txt", json: "json" }
        const mimeTypes = { markdown: "text/markdown", text: "text/plain", json: "application/json" }

        const blob = new Blob([content], { type: mimeTypes[format] })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `raffitech-chat-${Date.now()}.${extensions[format]}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg glass-premium rounded-2xl z-50 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <Download size={20} className="text-red-400" />
                                <h2 className="font-display text-lg font-bold">Export Chat</h2>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Format Selection */}
                        <div className="p-4 space-y-4">
                            <div>
                                <label className="text-sm text-gray-400 mb-2 block">Export Format</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { id: "markdown", label: "Markdown", icon: FileText },
                                        { id: "text", label: "Text", icon: FileText },
                                        { id: "json", label: "JSON", icon: Code },
                                    ].map(f => (
                                        <button
                                            key={f.id}
                                            onClick={() => setFormat(f.id as any)}
                                            className={`flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-medium transition-colors ${format === f.id
                                                    ? "bg-red-500/20 text-red-300 border border-red-500/30"
                                                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                                                }`}
                                        >
                                            <f.icon size={16} />
                                            {f.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Preview */}
                            <div>
                                <label className="text-sm text-gray-400 mb-2 block">Preview</label>
                                <div className="bg-black/50 rounded-xl p-3 max-h-40 overflow-y-auto">
                                    <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono">
                                        {generateExport().slice(0, 500)}...
                                    </pre>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleCopy}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/10 hover:bg-white/15 rounded-xl font-medium transition-colors"
                                >
                                    {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                                    {copied ? "Copied!" : "Copy"}
                                </button>
                                <button
                                    onClick={handleDownload}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 btn-primary"
                                >
                                    <Download size={18} />
                                    Download
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
