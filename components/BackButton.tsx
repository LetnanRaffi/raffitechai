"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"

interface BackButtonProps {
    href?: string
    label?: string
    className?: string
}

export function BackButton({ href, label = "Back", className = "" }: BackButtonProps) {
    const router = useRouter()

    const handleClick = () => {
        if (href) {
            router.push(href)
        } else {
            router.back()
        }
    }

    return (
        <motion.button
            onClick={handleClick}
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5 ${className}`}
        >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">{label}</span>
        </motion.button>
    )
}
