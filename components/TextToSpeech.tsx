"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Volume2, VolumeX, Pause, Play, Settings, X } from "lucide-react"

interface TextToSpeechProps {
    text: string
    className?: string
}

export function TextToSpeech({ text, className = "" }: TextToSpeechProps) {
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
    const [selectedVoice, setSelectedVoice] = useState<string>("")
    const [showSettings, setShowSettings] = useState(false)
    const [rate, setRate] = useState(1)
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = speechSynthesis.getVoices()
            // Prefer Indonesian or English voices
            const filtered = availableVoices.filter(v =>
                v.lang.startsWith("id") || v.lang.startsWith("en")
            )
            setVoices(filtered.length > 0 ? filtered : availableVoices)

            // Default to first Indonesian voice or first available
            const defaultVoice = filtered.find(v => v.lang.startsWith("id")) || filtered[0]
            if (defaultVoice) setSelectedVoice(defaultVoice.name)
        }

        loadVoices()
        speechSynthesis.addEventListener("voiceschanged", loadVoices)
        return () => speechSynthesis.removeEventListener("voiceschanged", loadVoices)
    }, [])

    const speak = () => {
        if (!("speechSynthesis" in window)) {
            alert("Browser tidak mendukung Text-to-Speech")
            return
        }

        // Stop any existing speech
        speechSynthesis.cancel()

        const utterance = new SpeechSynthesisUtterance(text)
        utterance.rate = rate

        const voice = voices.find(v => v.name === selectedVoice)
        if (voice) utterance.voice = voice

        utterance.onstart = () => setIsSpeaking(true)
        utterance.onend = () => {
            setIsSpeaking(false)
            setIsPaused(false)
        }
        utterance.onerror = () => {
            setIsSpeaking(false)
            setIsPaused(false)
        }

        utteranceRef.current = utterance
        speechSynthesis.speak(utterance)
    }

    const pause = () => {
        speechSynthesis.pause()
        setIsPaused(true)
    }

    const resume = () => {
        speechSynthesis.resume()
        setIsPaused(false)
    }

    const stop = () => {
        speechSynthesis.cancel()
        setIsSpeaking(false)
        setIsPaused(false)
    }

    return (
        <div className={`flex items-center gap-1 ${className}`}>
            {!isSpeaking ? (
                <button
                    onClick={speak}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-gray-500 hover:text-white"
                    title="Baca dengan suara"
                >
                    <Volume2 size={14} />
                </button>
            ) : (
                <>
                    <button
                        onClick={isPaused ? resume : pause}
                        className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-red-400"
                        title={isPaused ? "Lanjutkan" : "Pause"}
                    >
                        {isPaused ? <Play size={14} /> : <Pause size={14} />}
                    </button>
                    <button
                        onClick={stop}
                        className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-gray-500 hover:text-white"
                        title="Stop"
                    >
                        <VolumeX size={14} />
                    </button>
                </>
            )}
        </div>
    )
}
