"use client"

import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"

interface FeatureCardProps {
    icon: LucideIcon
    title: string
    description: string
    gradient?: string
    delay?: number
    size?: "small" | "medium" | "large"
}

export function FeatureCard({
    icon: Icon,
    title,
    description,
    gradient = "from-red-500/20 to-red-600/5",
    delay = 0,
    size = "medium"
}: FeatureCardProps) {
    const sizeClasses = {
        small: "p-4",
        medium: "p-6",
        large: "p-8"
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            whileHover={{ y: -4, scale: 1.02 }}
            className={`relative group glass-premium rounded-2xl ${sizeClasses[size]} overflow-hidden card-hover`}
        >
            {/* Gradient overlay on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

            {/* Content */}
            <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon size={24} className="text-red-400 group-hover:text-red-300 transition-colors" />
                </div>

                <h3 className="font-display text-lg font-semibold text-white mb-2 group-hover:text-red-50 transition-colors">
                    {title}
                </h3>

                <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                    {description}
                </p>
            </div>

            {/* Shine effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 animate-shimmer" />
            </div>
        </motion.div>
    )
}
