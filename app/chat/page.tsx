"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Menu, Plus, MessageSquare, X, Settings, Code, FileText, Lightbulb, PenTool, Mic, MicOff, AlertCircle, Sparkles, LogOut, Lock, Upload, Image as ImageIcon, Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import ReactMarkdown from "react-markdown"
import { TierSelector, TierType } from "@/components/TierSelector"
import { CodeBlock, InlineCode } from "@/components/CodeBlock"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import {
    createChatSession,
    getChatSessions,
    getMessages,
    saveMessage,
    updateSessionTitle,
    deleteChatSession,
    getUserProfile,
    generateTitleFromMessage,
    ChatSession,
    UserProfile
} from "@/lib/chat-service"

interface Message {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: Date
    model?: string
}

export default function ChatPage() {
    const { user, isLoading, signOut } = useAuth()
    const router = useRouter()

    // Core state
    const [isSidebarOpen, setSidebarOpen] = useState(false)
    const [input, setInput] = useState("")
    const [messages, setMessages] = useState<Message[]>([])
    const [isTyping, setIsTyping] = useState(false)
    const [currentModel, setCurrentModel] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    // User tier state
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
    const [selectedTier, setSelectedTier] = useState<TierType>("RaffiTech Free")

    // Chat sessions state
    const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)

    // Voice recording state
    const [isRecording, setIsRecording] = useState(false)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [recognition, setRecognition] = useState<any>(null)

    // File upload state
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

    // Refs
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    // Get user display name from auth
    const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User"

    const suggestions = [
        { icon: Code, text: "Write a Python script for data analysis" },
        { icon: FileText, text: "Draft a professional email response" },
        { icon: Lightbulb, text: "Brainstorm ideas for a project" },
        { icon: Sparkles, text: "Build a Professional CV with AI" },
    ]

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login")
        }
    }, [user, isLoading, router])

    // Load user profile and chat sessions
    useEffect(() => {
        if (user) {
            // Load user profile (for tier)
            getUserProfile(user.id).then(profile => {
                if (profile) {
                    setUserProfile(profile)
                    setSelectedTier(profile.tier as TierType)
                }
            })

            // Load chat sessions
            getChatSessions(user.id).then(sessions => {
                setChatSessions(sessions)
            })
        }
    }, [user])

    // Initialize speech recognition
    useEffect(() => {
        if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
            // Use any to avoid TypeScript errors with SpeechRecognition API
            const win = window as any
            const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition
            const recognitionInstance = new SpeechRecognition()
            recognitionInstance.continuous = false
            recognitionInstance.interimResults = true
            recognitionInstance.lang = 'id-ID' // Indonesian, change to 'en-US' for English

            recognitionInstance.onresult = (event: any) => {
                const transcript = Array.from(event.results)
                    .map((result: any) => result[0].transcript)
                    .join('')
                setInput(transcript)
            }

            recognitionInstance.onerror = (event: any) => {
                console.error('Speech recognition error:', event.error)
                setIsRecording(false)
            }

            recognitionInstance.onend = () => {
                setIsRecording(false)
            }

            setRecognition(recognitionInstance)
        }
    }, [])

    useEffect(() => {
        scrollToBottom()
    }, [messages, isTyping])

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
        }
    }, [input])

    const generateId = () => Math.random().toString(36).substring(2, 15)

    // Check if tier is allowed based on user's subscription
    const isTierAllowed = useCallback((tier: TierType): boolean => {
        if (!userProfile) return tier === "RaffiTech Free"

        const tierOrder = ["RaffiTech Free", "RaffiTech Standard", "RaffiTech Pro"]
        const userTierIndex = tierOrder.indexOf(userProfile.tier)
        const requestedTierIndex = tierOrder.indexOf(tier)

        return requestedTierIndex <= userTierIndex
    }, [userProfile])

    // Handle tier change with restriction check
    const handleTierChange = (tier: TierType) => {
        if (!isTierAllowed(tier)) {
            setError(`${tier} requires a subscription upgrade. Go to Pricing to upgrade.`)
            return
        }
        setSelectedTier(tier)
    }

    // Toggle voice recording
    const toggleVoiceRecording = () => {
        if (!recognition) {
            setError("Voice input is not supported in this browser")
            return
        }

        if (isRecording) {
            recognition.stop()
            setIsRecording(false)
        } else {
            recognition.start()
            setIsRecording(true)
        }
    }

    // Handle file upload
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files) {
            const newFiles = Array.from(files)
            setUploadedFiles(prev => [...prev, ...newFiles])
        }
    }

    // Remove uploaded file  
    const removeFile = (index: number) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index))
    }

    // Show loading while checking auth
    if (isLoading) {
        return (
            <div className="flex h-screen bg-black items-center justify-center">
                <div className="flex items-center gap-2 text-gray-400">
                    <Sparkles className="animate-pulse text-red-400" size={20} />
                    <span>Loading...</span>
                </div>
            </div>
        )
    }

    const handleSend = async (text: string = input) => {
        if (!text.trim() || isTyping || !user) return

        // Check tier restriction
        if (!isTierAllowed(selectedTier)) {
            setError(`${selectedTier} requires a subscription upgrade.`)
            return
        }

        let sessionId = currentSessionId

        // Create new session if needed
        if (!sessionId) {
            const session = await createChatSession(user.id, selectedTier)
            if (session) {
                sessionId = session.id
                setCurrentSessionId(sessionId)
                setChatSessions(prev => [session, ...prev])
            }
        }

        const userMessage: Message = {
            id: generateId(),
            role: "user",
            content: text.trim(),
            timestamp: new Date()
        }

        setInput("")
        setUploadedFiles([])
        setError(null)
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"
        }
        setMessages(prev => [...prev, userMessage])
        setIsTyping(true)

        // Save user message to DB
        if (sessionId && user) {
            await saveMessage(sessionId, user.id, "user", text.trim())

            // Update session title from first message
            if (messages.length === 0) {
                const title = generateTitleFromMessage(text.trim())
                await updateSessionTitle(sessionId, title)
                setChatSessions(prev => prev.map(s =>
                    s.id === sessionId ? { ...s, title } : s
                ))
            }
        }

        try {
            // Build conversation history for context
            const conversationHistory = messages.map(msg => ({
                role: msg.role as "user" | "assistant",
                content: msg.content
            }))

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text.trim(),
                    tier: selectedTier,
                    conversationHistory
                })
            })

            const data = await response.json()

            if (data.requiresUpgrade) {
                setError(`${selectedTier} requires a subscription. Go to Pricing to upgrade.`)
                setIsTyping(false)
                return
            }

            if (data.error && !data.message) {
                setError(data.error)
                setIsTyping(false)
                return
            }

            // Update current model indicator
            if (data.model) {
                setCurrentModel(data.model)
            }

            // Handle empty response
            const responseContent = data.message?.trim() ||
                (data.error ? `Error: ${data.error}` : "I apologize, but I couldn't generate a response. Please try again.")

            const assistantMessage: Message = {
                id: generateId(),
                role: "assistant",
                content: responseContent,
                timestamp: new Date(),
                model: data.model
            }

            setMessages(prev => [...prev, assistantMessage])

            // Save assistant message to DB
            if (sessionId && user) {
                await saveMessage(sessionId, user.id, "assistant", responseContent, data.model)
            }
        } catch (err) {
            console.error('Chat error:', err)
            setError('Failed to send message. Please try again.')
        } finally {
            setIsTyping(false)
        }
    }

    const handleNewChat = () => {
        setMessages([])
        setCurrentSessionId(null)
        setCurrentModel(null)
    }

    const handleLoadSession = async (session: ChatSession) => {
        setCurrentSessionId(session.id)
        setSelectedTier(session.tier as TierType)
        setSidebarOpen(false)

        // Load messages for this session
        const sessionMessages = await getMessages(session.id)
        setMessages(sessionMessages.map(msg => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            timestamp: new Date(msg.created_at),
            model: msg.model
        })))
    }

    const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
        e.stopPropagation()
        await deleteChatSession(sessionId)
        setChatSessions(prev => prev.filter(s => s.id !== sessionId))
        if (currentSessionId === sessionId) {
            handleNewChat()
        }
    }

    return (
        <div className="flex h-[100dvh] bg-black text-white overflow-hidden font-sans selection:bg-red-500/30">
            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed z-50 h-full w-[280px] max-w-[85vw] glass border-r border-white/10 flex flex-col transition-transform duration-300 ease-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="p-4 flex items-center justify-between border-b border-white/5">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 relative rounded-lg overflow-hidden">
                            <Image src="/logo.png" alt="Logo" fill className="object-contain" />
                        </div>
                        <span className="font-semibold text-sm">RaffiTech AI</span>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-3 space-y-2">
                    <button
                        onClick={() => { handleNewChat(); setSidebarOpen(false) }}
                        className="w-full flex items-center gap-2 px-4 py-3 bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 rounded-xl text-sm font-medium text-red-100 transition-colors"
                    >
                        <Plus size={16} />
                        New Chat
                    </button>
                    <Link
                        href="/cv"
                        className="w-full flex items-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium text-gray-200 transition-colors"
                    >
                        <FileText size={16} />
                        CV Mode
                    </Link>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-1">
                    <div className="text-xs font-medium text-gray-500 px-3 py-2 uppercase tracking-wider">Recent</div>
                    {chatSessions.length === 0 ? (
                        <div className="text-xs text-gray-600 px-3 py-2">No chat history yet</div>
                    ) : (
                        chatSessions.map((session) => (
                            <div
                                key={session.id}
                                onClick={() => handleLoadSession(session)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 rounded-lg text-sm text-gray-300 transition-colors text-left cursor-pointer group ${currentSessionId === session.id ? 'bg-white/5' : ''
                                    }`}
                            >
                                <MessageSquare size={14} className="text-gray-500 shrink-0" />
                                <span className="truncate flex-1">{session.title}</span>
                                <button
                                    onClick={(e) => handleDeleteSession(session.id, e)}
                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded transition-all"
                                >
                                    <Trash2 size={12} className="text-gray-500" />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-4 border-t border-white/5 space-y-2">
                    {/* User info */}
                    <div className="px-3 py-2 text-xs text-gray-500 truncate">
                        {user?.email}
                    </div>

                    {/* User tier badge */}
                    <div className="px-3 py-1.5 text-xs">
                        <span className="text-gray-500">Plan: </span>
                        <span className={`font-medium ${userProfile?.tier === "RaffiTech Pro" ? "text-yellow-400" :
                            userProfile?.tier === "RaffiTech Standard" ? "text-blue-400" :
                                "text-gray-400"
                            }`}>
                            {userProfile?.tier?.replace("RaffiTech ", "") || "Free"}
                        </span>
                    </div>

                    <button className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 rounded-lg text-sm text-gray-400 transition-colors">
                        <Settings size={16} />
                        <span>Settings</span>
                    </button>

                    <button
                        onClick={async () => {
                            await signOut()
                            router.push("/login")
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-red-500/10 rounded-lg text-sm text-red-400 transition-colors"
                    >
                        <LogOut size={16} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Area */}
            <main className="flex-1 flex flex-col w-full min-w-0">
                {/* Header */}
                <header className="h-14 shrink-0 flex items-center justify-between px-3 sm:px-4 border-b border-white/5 bg-black/50 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <Menu size={20} />
                        </button>
                        <button
                            onClick={handleNewChat}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <Plus size={20} />
                        </button>
                    </div>

                    <TierSelector
                        selectedTier={selectedTier}
                        onTierChange={handleTierChange}
                        disabled={isTyping}
                        userTier={userProfile?.tier as TierType}
                    />

                    {/* Current model indicator */}
                    {currentModel && (
                        <div className="hidden sm:block text-xs text-gray-600 truncate max-w-32">
                            {currentModel.split('/').pop()}
                        </div>
                    )}
                </header>

                {/* Content */}
                <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                    {/* Error Banner */}
                    {error && (
                        <div className="shrink-0 mx-4 mt-2 p-3 glass border border-red-500/30 rounded-xl flex items-center gap-3 text-sm">
                            <AlertCircle size={16} className="text-red-400 shrink-0" />
                            <span className="text-red-200">{error}</span>
                            <button
                                onClick={() => setError(null)}
                                className="ml-auto text-gray-500 hover:text-white"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    )}
                    {messages.length === 0 ? (
                        // Empty State - Premium Design
                        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 overflow-y-auto">
                            <div className="text-center space-y-3 mb-10 sm:mb-14">
                                <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-red-400 to-orange-300 animate-gradient bg-[length:200%_auto]">
                                        Hi, {userName}
                                    </span>
                                </h1>
                                <p className="text-lg sm:text-xl text-gray-400 font-light">How can I help you today?</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full max-w-2xl px-3">
                                {suggestions.map((sug, idx) => (
                                    <motion.button
                                        key={idx}
                                        onClick={() => {
                                            if (sug.text === "Build a Professional CV with AI") {
                                                router.push("/cv");
                                            } else {
                                                handleSend(sug.text);
                                            }
                                        }}
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="relative glass p-4 sm:p-5 rounded-2xl border border-white/10 text-left transition-all duration-300 hover:border-red-500/30 hover:shadow-[0_0_30px_rgba(255,0,0,0.1)] group overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <sug.icon size={20} className="text-gray-500 mb-3 group-hover:text-red-400 transition-colors relative z-10" />
                                        <p className="text-sm sm:text-base text-gray-300 group-hover:text-white transition-colors line-clamp-2 font-medium relative z-10">
                                            {sug.text}
                                        </p>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        // Chat Messages
                        <div className="flex-1 overflow-y-auto">
                            <div className="max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
                                {messages.map((msg) => (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                    >
                                        <div className={`max-w-[90%] sm:max-w-[85%] rounded-2xl px-4 sm:px-5 py-3 ${msg.role === "user"
                                            ? "bg-red-600 text-white"
                                            : "glass border border-white/10 text-gray-100"
                                            }`}>
                                            {msg.role === "user" ? (
                                                <p className="text-sm sm:text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                            ) : (
                                                <div className="prose prose-invert prose-sm max-w-none prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-strong:text-white prose-headings:text-white">
                                                    <ReactMarkdown
                                                        components={{
                                                            code({ className, children, ...props }) {
                                                                const isInline = !className
                                                                const content = String(children).replace(/\n$/, '')

                                                                if (isInline) {
                                                                    return <InlineCode>{content}</InlineCode>
                                                                }

                                                                return (
                                                                    <CodeBlock className={className}>
                                                                        {content}
                                                                    </CodeBlock>
                                                                )
                                                            },
                                                            pre({ children }) {
                                                                // Just pass through, CodeBlock handles the styling
                                                                return <>{children}</>
                                                            }
                                                        }}
                                                    >
                                                        {msg.content}
                                                    </ReactMarkdown>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}

                                {isTyping && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex justify-start"
                                    >
                                        <div className="glass border border-white/10 rounded-2xl px-4 sm:px-5 py-3">
                                            <div className="flex items-center gap-2">
                                                <Sparkles size={14} className="text-red-400 animate-pulse" />
                                                <span className="text-sm text-gray-300">Thinking</span>
                                                <span className="flex gap-0.5">
                                                    <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                                    <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                                    <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" />
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>
                    )}

                    {/* Uploaded Files Preview */}
                    {uploadedFiles.length > 0 && (
                        <div className="shrink-0 px-4 py-2 border-t border-white/5">
                            <div className="max-w-3xl mx-auto flex gap-2 flex-wrap">
                                {uploadedFiles.map((file, idx) => (
                                    <div key={idx} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-1.5 text-xs">
                                        {file.type.startsWith('image/') ? <ImageIcon size={12} /> : <FileText size={12} />}
                                        <span className="truncate max-w-32">{file.name}</span>
                                        <button onClick={() => removeFile(idx)} className="text-gray-500 hover:text-white">
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input Area - Premium Design */}
                    <div className="shrink-0 p-3 sm:p-4 border-t border-white/5 bg-gradient-to-t from-black via-black/95 to-transparent">
                        <div className="max-w-3xl mx-auto">
                            <div className="relative group">
                                {/* Gradient border effect */}
                                <div className="absolute -inset-[1px] bg-gradient-to-r from-red-500/20 via-red-400/10 to-red-500/20 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-sm" />
                                <div className="relative glass border border-white/10 group-focus-within:border-red-500/30 rounded-2xl p-2 sm:p-2.5 flex items-end gap-1.5 sm:gap-2 transition-colors duration-300">
                                    {/* File Upload Button */}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        multiple
                                        accept="image/*,.pdf,.txt,.doc,.docx"
                                    />
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="p-2.5 sm:p-3 hover:bg-white/10 rounded-xl transition-all text-gray-400 hover:text-white shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
                                        title="Upload File"
                                    >
                                        <Upload size={20} />
                                    </button>

                                    <Link href="/cv">
                                        <button
                                            className="p-2.5 sm:p-3 hover:bg-white/10 rounded-xl transition-all text-gray-400 hover:text-white shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center group/cv"
                                            title="CV Generator Mode"
                                        >
                                            <FileText size={20} className="group-hover/cv:text-red-400 transition-colors" />
                                        </button>
                                    </Link>

                                    <textarea
                                        ref={textareaRef}
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && !e.shiftKey) {
                                                e.preventDefault()
                                                handleSend()
                                            }
                                        }}
                                        placeholder="Message RaffiTech AI..."
                                        className="flex-1 bg-transparent border-0 focus:ring-0 focus:outline-none text-white placeholder-gray-500 resize-none py-3 px-2 min-h-[44px] text-[15px] sm:text-base"
                                        rows={1}
                                    />

                                    {/* Voice Button */}
                                    <button
                                        onClick={toggleVoiceRecording}
                                        className={`hidden sm:flex p-3 rounded-xl transition-all shrink-0 min-h-[44px] min-w-[44px] items-center justify-center ${isRecording
                                            ? 'bg-red-500/20 text-red-400 animate-pulse'
                                            : 'hover:bg-white/10 text-gray-400 hover:text-white'
                                            }`}
                                    >
                                        {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                                    </button>

                                    <button
                                        onClick={() => handleSend()}
                                        disabled={!input.trim() || isTyping}
                                        className="p-2.5 sm:p-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-all shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center shadow-lg shadow-red-500/20 hover:shadow-red-500/30"
                                    >
                                        <Send size={18} className="sm:w-[20px] sm:h-[20px]" />
                                    </button>
                                </div>
                            </div>

                            <p className="text-center text-[11px] sm:text-xs text-gray-500 mt-3 font-light">
                                RaffiTech AI can make mistakes. Verify important information.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
