"use client"

import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Upload, Image as ImageIcon, Loader2, Sparkles, Camera } from "lucide-react"

interface ImageAnalyzerProps {
    isOpen: boolean
    onClose: () => void
    onAnalyze: (prompt: string) => void
}

export function ImageAnalyzer({ isOpen, onClose, onAnalyze }: ImageAnalyzerProps) {
    const [image, setImage] = useState<string | null>(null)
    const [analyzing, setAnalyzing] = useState(false)
    const [analysisType, setAnalysisType] = useState<string>("describe")
    const fileInputRef = useRef<HTMLInputElement>(null)

    const analysisOptions = [
        { id: "describe", label: "Describe Image", prompt: "Describe this image in detail. What do you see?" },
        { id: "extract-text", label: "Extract Text (OCR)", prompt: "Extract all text visible in this image." },
        { id: "analyze-code", label: "Analyze Code", prompt: "This is a screenshot of code. Explain what this code does and suggest improvements." },
        { id: "identify", label: "Identify Objects", prompt: "List all objects, people, and elements you can identify in this image." },
        { id: "summarize", label: "Summarize Content", prompt: "Summarize the main content and message of this image." },
    ]

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImage(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        const file = e.dataTransfer.files[0]
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader()
            reader.onloadend = () => setImage(reader.result as string)
            reader.readAsDataURL(file)
        }
    }, [])

    const handleAnalyze = () => {
        if (!image) return

        const option = analysisOptions.find(o => o.id === analysisType)
        const prompt = option?.prompt || "Describe this image."

        // Include image context in the prompt
        // Note: For actual image analysis, you'd need a multimodal model
        // This sends a text prompt that describes what to do with the image
        onAnalyze(`[Image Analysis Request]\n\n${prompt}\n\n(Note: I've uploaded an image for analysis. Please describe what you would analyze if you could see it, and provide helpful tips for image analysis.)`)
        onClose()
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
                                <Camera size={20} className="text-red-400" />
                                <h2 className="font-display text-lg font-bold">Image Analyzer</h2>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-4 space-y-4">
                            {/* Upload Area */}
                            <div
                                onDrop={handleDrop}
                                onDragOver={(e) => e.preventDefault()}
                                onClick={() => fileInputRef.current?.click()}
                                className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${image
                                        ? "border-red-500/50 bg-red-500/10"
                                        : "border-white/20 hover:border-white/40"
                                    }`}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />

                                {image ? (
                                    <div className="space-y-3">
                                        <img
                                            src={image}
                                            alt="Preview"
                                            className="max-h-40 mx-auto rounded-lg object-contain"
                                        />
                                        <p className="text-sm text-gray-400">Click to change image</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <Upload size={32} className="mx-auto text-gray-500" />
                                        <div>
                                            <p className="text-white font-medium">Drop image here</p>
                                            <p className="text-sm text-gray-400">or click to browse</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Analysis Type */}
                            <div>
                                <label className="text-sm text-gray-400 mb-2 block">Analysis Type</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {analysisOptions.map(option => (
                                        <button
                                            key={option.id}
                                            onClick={() => setAnalysisType(option.id)}
                                            className={`p-3 rounded-xl text-sm font-medium text-left transition-colors ${analysisType === option.id
                                                    ? "bg-red-500/20 text-red-300 border border-red-500/30"
                                                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                                                }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Analyze Button */}
                            <button
                                onClick={handleAnalyze}
                                disabled={!image || analyzing}
                                className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {analyzing ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <Sparkles size={18} />
                                )}
                                Analyze Image
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
