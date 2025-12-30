"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Sparkles, Zap, Crown, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

export type TierType = "RaffiTech Free" | "RaffiTech Standard" | "RaffiTech Pro"

interface TierSelectorProps {
    selectedTier: TierType
    onTierChange: (tier: TierType) => void
    disabled?: boolean
    userTier?: TierType  // User's actual subscription tier
}

const tierConfig = {
    "RaffiTech Free": {
        icon: Zap,
        color: "text-gray-400",
        bgColor: "bg-gray-500/10",
        borderColor: "border-gray-500/20",
        description: "Basic AI Models"
    },
    "RaffiTech Standard": {
        icon: Sparkles,
        color: "text-blue-400",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/20",
        description: "Balanced Performance"
    },
    "RaffiTech Pro": {
        icon: Crown,
        color: "text-yellow-400",
        bgColor: "bg-yellow-500/10",
        borderColor: "border-yellow-500/20",
        description: "Premium Models"
    }
}

const tierOrder = ["RaffiTech Free", "RaffiTech Standard", "RaffiTech Pro"]

export function TierSelector({ selectedTier, onTierChange, disabled, userTier = "RaffiTech Free" }: TierSelectorProps) {
    const [isOpen, setIsOpen] = useState(false)
    const currentConfig = tierConfig[selectedTier]
    const CurrentIcon = currentConfig.icon

    // Check if a tier is accessible based on user's subscription
    const isTierAccessible = (tier: TierType): boolean => {
        const userTierIndex = tierOrder.indexOf(userTier)
        const requestedTierIndex = tierOrder.indexOf(tier)
        return requestedTierIndex <= userTierIndex
    }

    return (
        <div className="relative">
            <button
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full transition-all",
                    "glass border",
                    currentConfig.borderColor,
                    disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-white/5 cursor-pointer"
                )}
            >
                <CurrentIcon size={14} className={currentConfig.color} />
                <span className="text-xs sm:text-sm font-medium text-gray-300">
                    {selectedTier.replace("RaffiTech ", "")}
                </span>
                <ChevronDown
                    size={14}
                    className={cn(
                        "text-gray-500 transition-transform",
                        isOpen && "rotate-180"
                    )}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Dropdown */}
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute top-full right-0 mt-2 w-56 glass border border-white/10 rounded-xl overflow-hidden z-50 shadow-xl"
                        >
                            {(Object.keys(tierConfig) as TierType[]).map((tier) => {
                                const config = tierConfig[tier]
                                const Icon = config.icon
                                const isSelected = tier === selectedTier
                                const isAccessible = isTierAccessible(tier)

                                return (
                                    <button
                                        key={tier}
                                        onClick={() => {
                                            onTierChange(tier)
                                            setIsOpen(false)
                                        }}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
                                            isSelected ? config.bgColor : "hover:bg-white/5",
                                            !isAccessible && "opacity-60"
                                        )}
                                    >
                                        <div className={cn(
                                            "p-1.5 rounded-lg",
                                            config.bgColor
                                        )}>
                                            <Icon size={14} className={config.color} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className={cn(
                                                    "text-sm font-medium",
                                                    isSelected ? "text-white" : "text-gray-300"
                                                )}>
                                                    {tier.replace("RaffiTech ", "")}
                                                </span>
                                                {!isAccessible && (
                                                    <Lock size={10} className="text-gray-500" />
                                                )}
                                            </div>
                                            <span className="text-xs text-gray-500">
                                                {!isAccessible ? "Upgrade required" : config.description}
                                            </span>
                                        </div>
                                        {isSelected && (
                                            <div className="w-2 h-2 rounded-full bg-white" />
                                        )}
                                    </button>
                                )
                            })}

                            {/* Pricing link */}
                            <div className="border-t border-white/5 p-2">
                                <a
                                    href="/#pricing"
                                    className="block text-center text-xs text-gray-500 hover:text-red-400 transition-colors py-2"
                                >
                                    View Pricing Plans →
                                </a>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
