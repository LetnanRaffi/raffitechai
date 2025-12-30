"use client"

import { motion } from "framer-motion"
import { Check, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface PricingCardProps {
    title: string
    price: string
    features: string[]
    isPopular?: boolean
    delay?: number
    tierKey: "free" | "standard" | "pro"
}

export function PricingCard({ title, price, features, isPopular, delay = 0, tierKey }: PricingCardProps) {
    const handleChoose = () => {
        if (tierKey === "free") {
            window.location.href = "/chat"
        } else {
            // WhatsApp format: 62 + number without leading 0
            const waNumber = "62895328949434"
            const tierName = tierKey === "pro" ? "Professional" : "Standard"
            const message = encodeURIComponent(
                `Halo! Saya ingin membeli paket ${tierName} (${price}). Mohon info cara pembayarannya.`
            )
            window.open(`https://wa.me/${waNumber}?text=${message}`, "_blank")
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            className={cn(
                "relative p-8 rounded-2xl glass-card flex flex-col items-center text-center group transition-all duration-300",
                isPopular ? "border-red-500/50 shadow-[0_0_30px_rgba(220,0,0,0.15)] transform scale-105 z-10" : "border-white/10 hover:border-white/20"
            )}
        >
            {isPopular && (
                <div className="absolute -top-4 bg-gradient-to-r from-red-600 to-red-800 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                    MOST POPULAR
                </div>
            )}

            <h3 className={cn("text-xl font-bold mb-2", isPopular ? "text-red-500" : "text-gray-200")}>
                {title}
            </h3>

            <div className="mb-6">
                <span className="text-4xl font-bold text-white">{price}</span>
                {price !== "Free" && <span className="text-gray-400 text-sm">/month</span>}
            </div>

            <ul className="space-y-4 mb-8 w-full text-left">
                {features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-gray-300">
                        <div className="p-1 rounded-full bg-red-900/30 text-red-500">
                            <Check size={12} />
                        </div>
                        {feature}
                    </li>
                ))}
            </ul>

            <button
                onClick={handleChoose}
                className={cn(
                    "w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2",
                    isPopular
                        ? "bg-red-600 hover:bg-red-700 text-white shadow-[0_0_20px_rgba(220,0,0,0.4)]"
                        : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                )}
            >
                {tierKey !== "free" && <MessageCircle size={16} />}
                {tierKey === "free" ? "Start Free" : `Buy ${title}`}
            </button>

            {/* Hover glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </motion.div>
    )
}
