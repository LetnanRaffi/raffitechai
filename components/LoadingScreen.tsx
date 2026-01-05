"use client"

import { motion } from "framer-motion"
import Image from "next/image"

interface LoadingScreenProps {
    message?: string
}

export function LoadingScreen({ message = "Loading..." }: LoadingScreenProps) {
    return (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
            {/* Background effects */}
            <div className="absolute inset-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[120px]" />
            </div>

            {/* Logo and loading */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 flex flex-col items-center gap-6"
            >
                {/* Logo */}
                <motion.div
                    animate={{
                        scale: [1, 1.05, 1],
                        opacity: [1, 0.8, 1]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="relative w-20 h-20"
                >
                    <div className="absolute inset-0 bg-red-500/30 rounded-2xl blur-xl" />
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden glass-premium">
                        <Image src="/logo.png" alt="RaffiTech AI" fill className="object-contain p-2" />
                    </div>
                </motion.div>

                {/* Loading bar */}
                <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-red-600 via-red-400 to-red-600"
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        style={{ width: "50%" }}
                    />
                </div>

                {/* Message */}
                <p className="text-sm text-gray-500">{message}</p>
            </motion.div>
        </div>
    )
}
