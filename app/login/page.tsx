"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/Navbar"
import { Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const { user, isLoading: authLoading, signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth()
    const router = useRouter()

    // Redirect to chat if already logged in
    useEffect(() => {
        if (!authLoading && user) {
            router.push("/chat")
        }
    }, [user, authLoading, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        try {
            if (isLogin) {
                const { error } = await signInWithEmail(email, password)
                if (error) {
                    setError(error.message)
                } else {
                    router.push("/chat")
                }
            } else {
                if (!name.trim()) {
                    setError("Name is required")
                    setIsLoading(false)
                    return
                }
                const { error, user: newUser } = await signUpWithEmail(email, password, name)
                if (error) {
                    setError(error.message)
                } else if (newUser?.email_confirmed_at) {
                    // User is confirmed, redirect to chat
                    router.push("/chat")
                } else if (newUser) {
                    // User created but needs confirmation - try auto-login
                    // This works when email confirmation is disabled in Supabase
                    const { error: loginError } = await signInWithEmail(email, password)
                    if (!loginError) {
                        router.push("/chat")
                    } else {
                        setError("Account created! Please check your email for confirmation, or try logging in.")
                    }
                } else {
                    setError("Account created! Please check your email for confirmation.")
                }
            }
        } catch (err) {
            setError("An unexpected error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        setIsLoading(true)
        try {
            await signInWithGoogle()
        } catch (err) {
            setError("Failed to sign in with Google")
            setIsLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-black text-white flex flex-col">
            <Navbar />

            <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-900/10 rounded-full blur-[120px] pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md glass-card p-8 rounded-3xl border border-white/10 relative z-10"
                >
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold mb-2">
                            {isLogin ? "Welcome Back" : "Create Account"}
                        </h1>
                        <p className="text-gray-400 text-sm">
                            {isLogin ? "Enter your credentials to access the future." : "Join the elite circle of AI users."}
                        </p>
                    </div>

                    {error && (
                        <div className={`mb-4 p-3 rounded-xl text-sm ${error.includes("Check your email")
                            ? "bg-green-500/10 border border-green-500/20 text-green-400"
                            : "bg-red-500/10 border border-red-500/20 text-red-400"
                            }`}>
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <button
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                            className="w-full py-3 bg-white text-black font-semibold rounded-xl flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors disabled:opacity-50"
                        >
                            {isLoading ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <>
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Continue with Google
                                </>
                            )}
                        </button>

                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-black px-2 text-gray-500">Or continue with email</span>
                            </div>
                        </div>

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            {!isLogin && (
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1 ml-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-3.5 text-gray-500" size={16} />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="John Doe"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-red-500/50 transition-colors"
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1 ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-3.5 text-gray-500" size={16} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@example.com"
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-red-500/50 transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1 ml-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-3.5 text-gray-500" size={16} />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-red-500/50 transition-colors"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(220,0,0,0.3)] disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <>
                                        {isLogin ? "Sign In" : "Create Account"}
                                        <ArrowRight size={16} />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="mt-8 text-center text-sm text-gray-400">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => { setIsLogin(!isLogin); setError("") }}
                            className="text-white hover:text-red-400 font-medium transition-colors"
                        >
                            {isLogin ? "Sign up" : "Log in"}
                        </button>
                    </div>
                </motion.div>
            </div>
        </main>
    )
}
