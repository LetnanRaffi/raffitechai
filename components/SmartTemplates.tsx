"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    X,
    Code,
    FileText,
    Mail,
    Briefcase,
    GraduationCap,
    Lightbulb,
    MessageSquare,
    Bug,
    Sparkles,
    Languages
} from "lucide-react"

export interface TemplateItem {
    id: string
    icon: typeof Code
    title: string
    description: string
    prompt: string
    category: "coding" | "writing" | "business" | "learning" | "creative"
}

export const SMART_TEMPLATES: TemplateItem[] = [
    // Coding
    {
        id: "debug-code",
        icon: Bug,
        title: "Debug My Code",
        description: "Find and fix bugs in your code",
        prompt: "Please help me debug this code. Find any bugs, explain what's wrong, and provide the corrected version:\n\n```\n[PASTE YOUR CODE HERE]\n```",
        category: "coding"
    },
    {
        id: "code-review",
        icon: Code,
        title: "Code Review",
        description: "Get professional feedback on your code",
        prompt: "Please review this code and provide feedback on:\n1. Code quality and best practices\n2. Performance improvements\n3. Security considerations\n4. Suggested refactoring\n\n```\n[PASTE YOUR CODE HERE]\n```",
        category: "coding"
    },
    {
        id: "explain-code",
        icon: Lightbulb,
        title: "Explain Code",
        description: "Understand how code works",
        prompt: "Please explain this code in detail. Break it down step by step and explain what each part does:\n\n```\n[PASTE YOUR CODE HERE]\n```",
        category: "coding"
    },
    // Writing
    {
        id: "email-professional",
        icon: Mail,
        title: "Professional Email",
        description: "Write polished business emails",
        prompt: "Help me write a professional email about: [YOUR TOPIC]\n\nContext:\n- Recipient: [WHO]\n- Purpose: [WHY]\n- Tone: Professional but friendly",
        category: "writing"
    },
    {
        id: "blog-post",
        icon: FileText,
        title: "Blog Post",
        description: "Create engaging blog content",
        prompt: "Write an engaging blog post about: [YOUR TOPIC]\n\nRequirements:\n- Catchy title\n- Introduction that hooks readers\n- 3-5 main points with examples\n- Conclusion with call to action\n- SEO-friendly",
        category: "writing"
    },
    {
        id: "social-media",
        icon: MessageSquare,
        title: "Social Media Post",
        description: "Create viral social content",
        prompt: "Create a viral social media post about: [YOUR TOPIC]\n\nPlatform: [Instagram/Twitter/LinkedIn]\nGoal: [Engagement/Awareness/Sales]\nInclude relevant hashtags and emojis.",
        category: "writing"
    },
    // Business
    {
        id: "business-plan",
        icon: Briefcase,
        title: "Business Plan",
        description: "Create a startup business plan",
        prompt: "Help me create a business plan for: [YOUR BUSINESS IDEA]\n\nInclude:\n1. Executive Summary\n2. Problem & Solution\n3. Target Market\n4. Revenue Model\n5. Competitive Analysis\n6. Marketing Strategy\n7. Financial Projections",
        category: "business"
    },
    {
        id: "pitch-deck",
        icon: Sparkles,
        title: "Pitch Deck Script",
        description: "Create investor pitch content",
        prompt: "Create a pitch deck script for: [YOUR STARTUP]\n\nSlides needed:\n1. Problem\n2. Solution\n3. Market Size\n4. Traction\n5. Team\n6. Ask\n\nMake it compelling for investors.",
        category: "business"
    },
    // Learning
    {
        id: "learn-topic",
        icon: GraduationCap,
        title: "Learn Anything",
        description: "Master any topic step by step",
        prompt: "Teach me about: [YOUR TOPIC]\n\nI'm a: [Beginner/Intermediate/Advanced]\n\nPlease provide:\n1. Simple explanation\n2. Key concepts\n3. Real-world examples\n4. Practice exercises\n5. Resources to learn more",
        category: "learning"
    },
    {
        id: "translate-explain",
        icon: Languages,
        title: "Translate & Explain",
        description: "Translate with cultural context",
        prompt: "Translate this from [SOURCE LANGUAGE] to [TARGET LANGUAGE]:\n\n[YOUR TEXT]\n\nAlso explain:\n- Cultural nuances\n- Alternative translations\n- When to use each version",
        category: "learning"
    },
]

interface SmartTemplatesProps {
    isOpen: boolean
    onClose: () => void
    onSelectTemplate: (prompt: string) => void
}

export function SmartTemplates({ isOpen, onClose, onSelectTemplate }: SmartTemplatesProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>("all")

    const categories = [
        { id: "all", label: "All" },
        { id: "coding", label: "💻 Coding" },
        { id: "writing", label: "✍️ Writing" },
        { id: "business", label: "💼 Business" },
        { id: "learning", label: "📚 Learning" },
    ]

    const filteredTemplates = selectedCategory === "all"
        ? SMART_TEMPLATES
        : SMART_TEMPLATES.filter(t => t.category === selectedCategory)

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-2xl sm:max-h-[80vh] glass-premium rounded-2xl z-50 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/10">
                            <div>
                                <h2 className="font-display text-xl font-bold">Smart Templates</h2>
                                <p className="text-sm text-gray-400">Quick prompts for common tasks</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Category Tabs */}
                        <div className="flex gap-2 p-4 border-b border-white/5 overflow-x-auto">
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === cat.id
                                            ? "bg-red-500/20 text-red-300 border border-red-500/30"
                                            : "bg-white/5 text-gray-400 hover:bg-white/10"
                                        }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        {/* Templates Grid */}
                        <div className="flex-1 overflow-y-auto p-4">
                            <div className="grid gap-3">
                                {filteredTemplates.map((template) => (
                                    <motion.button
                                        key={template.id}
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        onClick={() => {
                                            onSelectTemplate(template.prompt)
                                            onClose()
                                        }}
                                        className="flex items-start gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-xl text-left transition-colors group"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0 group-hover:bg-red-500/20 transition-colors">
                                            <template.icon size={20} className="text-red-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-white mb-1">{template.title}</h3>
                                            <p className="text-sm text-gray-400 line-clamp-2">{template.description}</p>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
