"use client"

import { motion } from "framer-motion"
import { Battery, Send, Signal, Wifi } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"

export function ChatSimulation() {
    const [messages, setMessages] = useState([
        { role: "user", text: "What makes RaffiTech premium?", delay: 0 },
    ])

    useEffect(() => {
        const timer1 = setTimeout(() => {
            setMessages(prev => [...prev, { role: "ai", text: "RaffiTech is built on an elite neural architecture.", delay: 0 }])
        }, 1500)

        const timer2 = setTimeout(() => {
            setMessages(prev => [...prev, { role: "user", text: "Is it expensive?", delay: 0 }])
        }, 3500)

        const timer3 = setTimeout(() => {
            setMessages(prev => [...prev, { role: "ai", text: "Quality has its price. Perfection is priceless.", delay: 0 }])
        }, 5000)

        return () => {
            clearTimeout(timer1)
            clearTimeout(timer2)
            clearTimeout(timer3)
        }
    }, [])

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-sm mx-auto glass-card rounded-[2.5rem] overflow-hidden border border-gray-800 shadow-2xl relative"
        >
            {/* Fake Phone UI */}
            <div className="bg-black/80 backdrop-blur-md p-4 flex justify-between items-center text-white text-xs z-10 relative">
                <span>9:41</span>
                <div className="flex gap-1.5">
                    <Signal size={12} />
                    <Wifi size={12} />
                    <Battery size={12} />
                </div>
            </div>

            {/* Chat Area */}
            <div className="h-[400px] bg-gradient-to-b from-gray-900 to-black p-4 space-y-4 overflow-y-auto relative">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

                <div className="text-center text-xs text-gray-500 my-4">Today</div>

                {messages.map((msg, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${msg.role === "user"
                                ? "bg-red-600 text-white rounded-br-none"
                                : "bg-gray-800 text-gray-200 rounded-bl-none border border-gray-700"
                            }`}>
                            {msg.text}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-gray-900/90 border-t border-white/5 flex gap-2 items-center">
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400">
                    <span className="text-lg">+</span>
                </div>
                <div className="flex-1 bg-black/50 rounded-full px-4 py-2 text-sm text-gray-500 border border-white/5">
                    Message...
                </div>
                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white">
                    <Send size={14} />
                </div>
            </div>
        </motion.div>
    )
}
