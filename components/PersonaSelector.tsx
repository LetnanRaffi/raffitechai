"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Flame, Coffee, Brain, Zap, Palette, Check } from "lucide-react"
import { PersonaType } from "@/lib/persona-config"

// Re-export for convenience
export type { PersonaType } from "@/lib/persona-config"

interface Persona {
    id: PersonaType
    name: string
    icon: typeof Flame
    description: string
    color: string
}

export const PERSONAS: Persona[] = [
    {
        id: "raffi",
        name: "Raffi",
        icon: Flame,
        description: "Professional & helpful",
        color: "text-red-400"
    },
    {
        id: "santai",
        name: "Santai",
        icon: Coffee,
        description: "Casual, bahasa gaul",
        color: "text-yellow-400"
    },
    {
        id: "expert",
        name: "Expert",
        icon: Brain,
        description: "Deep & technical",
        color: "text-purple-400"
    },
    {
        id: "quick",
        name: "Quick",
        icon: Zap,
        description: "Super singkat",
        color: "text-cyan-400"
    },
    {
        id: "creative",
        name: "Creative",
        icon: Palette,
        description: "Brainstorming mode",
        color: "text-pink-400"
    }
]

interface PersonaSelectorProps {
    selectedPersona: PersonaType
    onPersonaChange: (persona: PersonaType) => void
    disabled?: boolean
}

export function PersonaSelector({ selectedPersona, onPersonaChange, disabled }: PersonaSelectorProps) {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const currentPersona = PERSONAS.find(p => p.id === selectedPersona) || PERSONAS[0]

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`flex items-center gap-2 px-3 py-2 glass rounded-xl border border-white/10 hover:border-white/20 transition-all text-sm ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                    }`}
            >
                <currentPersona.icon size={16} className={currentPersona.color} />
                <span className="hidden sm:inline text-gray-200">{currentPersona.name}</span>
                <ChevronDown
                    size={14}
                    className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 glass border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                    >
                        <div className="p-2 border-b border-white/5">
                            <p className="text-xs text-gray-500 px-2">AI Personality</p>
                        </div>
                        <div className="p-1">
                            {PERSONAS.map((persona) => (
                                <button
                                    key={persona.id}
                                    onClick={() => {
                                        onPersonaChange(persona.id)
                                        setIsOpen(false)
                                    }}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${selectedPersona === persona.id
                                        ? "bg-white/10"
                                        : "hover:bg-white/5"
                                        }`}
                                >
                                    <persona.icon size={18} className={persona.color} />
                                    <div className="flex-1 text-left">
                                        <div className="text-sm font-medium text-white">{persona.name}</div>
                                        <div className="text-xs text-gray-500">{persona.description}</div>
                                    </div>
                                    {selectedPersona === persona.id && (
                                        <Check size={14} className="text-green-400" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

