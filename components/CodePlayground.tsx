"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Play, Square, Copy, Check, Code, RefreshCw } from "lucide-react"

interface CodePlaygroundProps {
    isOpen: boolean
    onClose: () => void
    initialCode?: string
}

export function CodePlayground({ isOpen, onClose, initialCode = "" }: CodePlaygroundProps) {
    const [code, setCode] = useState(initialCode || `// JavaScript Playground
// Write your code here and click Run!

function greet(name) {
    return "Hello, " + name + "!";
}

console.log(greet("RaffiTech"));
console.log("2 + 2 =", 2 + 2);

// Try writing your own code!
`)
    const [output, setOutput] = useState<string[]>([])
    const [isRunning, setIsRunning] = useState(false)
    const [copied, setCopied] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (initialCode) setCode(initialCode)
    }, [initialCode])

    const runCode = () => {
        setIsRunning(true)
        setOutput([])
        setError(null)

        // Create a custom console to capture output
        const logs: string[] = []
        const customConsole = {
            log: (...args: any[]) => {
                logs.push(args.map(a =>
                    typeof a === "object" ? JSON.stringify(a, null, 2) : String(a)
                ).join(" "))
            },
            error: (...args: any[]) => {
                logs.push(`❌ Error: ${args.join(" ")}`)
            },
            warn: (...args: any[]) => {
                logs.push(`⚠️ Warning: ${args.join(" ")}`)
            },
            info: (...args: any[]) => {
                logs.push(`ℹ️ ${args.join(" ")}`)
            }
        }

        try {
            // Create a function from the code with custom console
            const fn = new Function("console", code)
            fn(customConsole)
            setOutput(logs.length > 0 ? logs : ["✅ Code executed successfully (no output)"])
        } catch (err: any) {
            setError(err.message)
            setOutput([`❌ ${err.name}: ${err.message}`])
        } finally {
            setIsRunning(false)
        }
    }

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const clearOutput = () => {
        setOutput([])
        setError(null)
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
                        className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-3xl sm:h-[80vh] glass-premium rounded-2xl z-50 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <Code size={20} className="text-red-400" />
                                <h2 className="font-display text-lg font-bold">Code Playground</h2>
                                <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-300 text-xs rounded-full">JavaScript</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleCopy}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                    title="Copy code"
                                >
                                    {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                                </button>
                                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
                            {/* Code Editor */}
                            <div className="flex-1 flex flex-col border-b sm:border-b-0 sm:border-r border-white/10">
                                <div className="p-2 border-b border-white/5 flex items-center justify-between">
                                    <span className="text-xs text-gray-500">script.js</span>
                                    <button
                                        onClick={runCode}
                                        disabled={isRunning}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                                    >
                                        {isRunning ? (
                                            <RefreshCw size={14} className="animate-spin" />
                                        ) : (
                                            <Play size={14} />
                                        )}
                                        Run
                                    </button>
                                </div>
                                <textarea
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="flex-1 bg-black/50 p-4 font-mono text-sm text-gray-200 resize-none focus:outline-none"
                                    spellCheck={false}
                                    placeholder="Write JavaScript code here..."
                                />
                            </div>

                            {/* Output */}
                            <div className="flex-1 flex flex-col">
                                <div className="p-2 border-b border-white/5 flex items-center justify-between">
                                    <span className="text-xs text-gray-500">Output</span>
                                    <button
                                        onClick={clearOutput}
                                        className="text-xs text-gray-500 hover:text-white transition-colors"
                                    >
                                        Clear
                                    </button>
                                </div>
                                <div className="flex-1 bg-black/50 p-4 overflow-y-auto font-mono text-sm">
                                    {output.length === 0 ? (
                                        <p className="text-gray-600">Click "Run" to execute code...</p>
                                    ) : (
                                        output.map((line, i) => (
                                            <div
                                                key={i}
                                                className={`py-1 ${line.startsWith("❌") ? "text-red-400" : line.startsWith("⚠️") ? "text-yellow-400" : "text-gray-300"}`}
                                            >
                                                {line}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
