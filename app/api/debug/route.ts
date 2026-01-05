/**
 * Debug API Endpoint - Check OpenRouter Configuration
 * GET /api/debug
 */

import { NextResponse } from "next/server"

export async function GET() {
    const apiKey = process.env.OPENROUTER_API_KEY

    return NextResponse.json({
        hasApiKey: !!apiKey,
        apiKeyLength: apiKey?.length || 0,
        apiKeyPrefix: apiKey?.substring(0, 12) || "NOT_SET",
        timestamp: new Date().toISOString()
    })
}
