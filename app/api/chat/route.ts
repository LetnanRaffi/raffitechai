/**
 * RaffiTech AI Chat API Endpoint
 * POST /api/chat
 */

import { NextRequest, NextResponse } from "next/server"
import { callWithFallback } from "@/lib/model-fallback"
import { isValidTier, requiresSubscription, RaffiTechTier } from "@/lib/tier-config"
import { ChatMessage } from "@/lib/openrouter"
import { getPersonaSystemPrompt, PersonaType } from "@/lib/persona-config"

interface ChatRequest {
    message: string
    tier?: string
    persona?: PersonaType
    conversationHistory?: ChatMessage[]
}

interface ChatResponse {
    tier: RaffiTechTier
    model: string | null
    message: string
    persona?: PersonaType
    error?: string
    requiresUpgrade?: boolean
}

export async function POST(request: NextRequest): Promise<NextResponse<ChatResponse>> {
    try {
        const body = await request.json() as ChatRequest
        const { message, tier: requestedTier, persona = "raffi", conversationHistory = [] } = body

        // Validate message
        if (!message || typeof message !== "string" || message.trim().length === 0) {
            return NextResponse.json({
                tier: "RaffiTech Free" as RaffiTechTier,
                model: null,
                message: "",
                error: "Message is required"
            }, { status: 400 })
        }

        // Validate and default tier
        const tier: RaffiTechTier = requestedTier && isValidTier(requestedTier)
            ? requestedTier
            : "RaffiTech Free"

        // Check if tier requires subscription
        // In production, you would check user's subscription status from database
        // For now, we'll allow all tiers (demo mode)
        const isSubscribed = true // Replace with actual subscription check

        if (requiresSubscription(tier) && !isSubscribed) {
            return NextResponse.json({
                tier,
                model: null,
                message: "",
                requiresUpgrade: true,
                error: `${tier} requires an active subscription. Please upgrade your plan.`
            }, { status: 403 })
        }

        // Get persona-specific system prompt
        const systemPrompt = getPersonaSystemPrompt(persona)

        // Build messages array
        const messages: ChatMessage[] = [
            { role: "system", content: systemPrompt },
            ...conversationHistory.slice(-10), // Keep last 10 messages for context
            { role: "user", content: message.trim() }
        ]

        // Call AI with fallback logic
        const result = await callWithFallback(tier, messages)

        if (!result.success) {
            console.error("All models failed:", result.attempts)
            return NextResponse.json({
                tier: result.tier,
                model: null,
                message: result.message,
                persona,
                error: "Service temporarily unavailable"
            }, { status: 503 })
        }

        return NextResponse.json({
            tier: result.tier,
            model: result.model,
            message: result.message,
            persona
        })

    } catch (error) {
        console.error("Chat API error:", error)
        return NextResponse.json({
            tier: "RaffiTech Free" as RaffiTechTier,
            model: null,
            message: "",
            error: "Internal server error"
        }, { status: 500 })
    }
}

/**
 * Only POST method is allowed
 */
export async function GET(): Promise<NextResponse> {
    return NextResponse.json(
        { error: "Method not allowed" },
        { status: 405 }
    )
}

