"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { User, Session, AuthChangeEvent } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"

interface AuthContextType {
    user: User | null
    session: Session | null
    isLoading: boolean
    signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>
    signUpWithEmail: (email: string, password: string, name: string) => Promise<{ error: Error | null, user: User | null }>
    signInWithGoogle: () => Promise<void>
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        // Skip if supabase client is not available (during build)
        if (!supabase) {
            setIsLoading(false)
            return
        }

        // Get initial session
        supabase.auth.getSession().then(({ data: { session: currentSession } }: { data: { session: Session | null } }) => {
            setSession(currentSession)
            setUser(currentSession?.user ?? null)
            setIsLoading(false)
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event: AuthChangeEvent, currentSession: Session | null) => {
                setSession(currentSession)
                setUser(currentSession?.user ?? null)
                setIsLoading(false)
            }
        )

        return () => subscription.unsubscribe()
    }, [])

    const signInWithEmail = async (email: string, password: string) => {
        if (!supabase) {
            return { error: new Error('Supabase client not available') }
        }
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        return { error: error as Error | null }
    }

    const signUpWithEmail = async (email: string, password: string, name: string) => {
        if (!supabase) {
            return { error: new Error('Supabase client not available'), user: null }
        }
        const { error, data } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                },
                emailRedirectTo: `${window.location.origin}/auth/callback`
            }
        })

        // If signup successful and user exists, return success
        // Supabase will auto-confirm if email confirmation is disabled in dashboard
        return { error: error as Error | null, user: data.user }
    }

    const signInWithGoogle = async () => {
        if (!supabase) return
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`
            }
        })
    }

    const signOut = async () => {
        if (!supabase) return
        await supabase.auth.signOut()
    }

    return (
        <AuthContext.Provider value={{
            user,
            session,
            isLoading,
            signInWithEmail,
            signUpWithEmail,
            signInWithGoogle,
            signOut,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
