import { createClient } from "@/lib/supabase/client"
import { TierType } from "@/components/TierSelector"

export interface ChatSession {
    id: string
    user_id: string
    title: string
    tier: string
    created_at: string
    updated_at: string
}

export interface ChatMessage {
    id: string
    session_id: string
    user_id: string
    role: "user" | "assistant"
    content: string
    model?: string
    created_at: string
}

export interface UserProfile {
    id: string
    email: string
    full_name: string
    avatar_url: string
    tier: TierType
    created_at: string
    updated_at: string
}

// Chat Service Functions
export async function createChatSession(userId: string, tier: TierType = "RaffiTech Free"): Promise<ChatSession | null> {
    const supabase = createClient()
    const { data, error } = await supabase
        .from("chat_sessions")
        .insert({ user_id: userId, tier })
        .select()
        .single()

    if (error) {
        console.error("Error creating chat session:", error)
        return null
    }
    return data
}

export async function getChatSessions(userId: string): Promise<ChatSession[]> {
    const supabase = createClient()
    const { data, error } = await supabase
        .from("chat_sessions")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false })
        .limit(20)

    if (error) {
        console.error("Error fetching chat sessions:", error.message, error.code, error.details)
        return []
    }
    return data || []
}

export async function updateSessionTitle(sessionId: string, title: string): Promise<boolean> {
    const supabase = createClient()
    const { error } = await supabase
        .from("chat_sessions")
        .update({ title })
        .eq("id", sessionId)

    return !error
}

export async function deleteChatSession(sessionId: string): Promise<boolean> {
    const supabase = createClient()
    const { error } = await supabase
        .from("chat_sessions")
        .delete()
        .eq("id", sessionId)

    return !error
}

// Message Functions
export async function saveMessage(
    sessionId: string,
    userId: string,
    role: "user" | "assistant",
    content: string,
    model?: string
): Promise<ChatMessage | null> {
    const supabase = createClient()
    const { data, error } = await supabase
        .from("messages")
        .insert({ session_id: sessionId, user_id: userId, role, content, model })
        .select()
        .single()

    if (error) {
        console.error("Error saving message:", error)
        return null
    }
    return data
}

export async function getMessages(sessionId: string): Promise<ChatMessage[]> {
    const supabase = createClient()
    const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true })

    if (error) {
        console.error("Error fetching messages:", error)
        return []
    }
    return data || []
}

// User Profile Functions
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
    const supabase = createClient()
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()

    if (error) {
        console.error("Error fetching user profile:", error.message, error.code)

        // If profile doesn't exist (PGRST116 = no rows), try to create it
        if (error.code === 'PGRST116') {
            console.log("Profile not found, attempting to create...")
            const { data: userData } = await supabase.auth.getUser()
            if (userData?.user) {
                const { data: newProfile, error: insertError } = await supabase
                    .from("profiles")
                    .insert({
                        id: userData.user.id,
                        email: userData.user.email,
                        full_name: userData.user.user_metadata?.full_name || userData.user.user_metadata?.name || null,
                        tier: "RaffiTech Free"
                    })
                    .select()
                    .single()

                if (insertError) {
                    console.error("Error creating profile:", insertError.message)
                    return null
                }
                return newProfile
            }
        }
        return null
    }
    return data
}

export async function updateUserTier(userId: string, tier: TierType): Promise<boolean> {
    const supabase = createClient()
    const { error } = await supabase
        .from("profiles")
        .update({ tier })
        .eq("id", userId)

    return !error
}

// Generate title from first message
export function generateTitleFromMessage(message: string): string {
    const cleaned = message.trim().replace(/\n/g, " ")
    if (cleaned.length <= 30) return cleaned
    return cleaned.substring(0, 30) + "..."
}
