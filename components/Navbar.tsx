"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

export function Navbar() {
    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 glass px-6 py-4 flex items-center justify-between"
        >
            <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 overflow-hidden rounded-full border border-red-500/50">
                    <Image
                        src="/logo.png"
                        alt="RaffiTech AI Logo"
                        fill
                        className="object-cover"
                    />
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    RaffiTech <span className="text-red-600">AI</span>
                </span>
            </div>

            <div className="flex items-center gap-6">
                <Link href="#pricing" className="text-sm text-gray-300 hover:text-white transition-colors">
                    Pricing
                </Link>
                <Link href="/chat" className="text-sm text-gray-300 hover:text-white transition-colors">
                    Chatbot
                </Link>
                <Link href="/cv" className="text-sm text-gray-300 hover:text-white transition-colors flex items-center gap-1">
                    <span className="bg-red-600/20 text-red-500 text-[10px] font-bold px-1.5 py-0.5 rounded border border-red-500/30">NEW</span>
                    CV Generator
                </Link>

                <div className="flex items-center gap-3">
                    <Link href="/login">
                        <button className="px-4 py-2 text-sm text-white hover:text-red-400 transition-colors">
                            Login
                        </button>
                    </Link>
                    <Link href="/login">
                        <button className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-full transition-all shadow-[0_0_15px_rgba(220,0,0,0.5)] hover:shadow-[0_0_25px_rgba(220,0,0,0.7)]">
                            Sign Up Free
                        </button>
                    </Link>
                </div>
            </div>
        </motion.nav>
    )
}
