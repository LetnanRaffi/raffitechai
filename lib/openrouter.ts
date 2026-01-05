/**
 * OpenRouter API Service
 * Handles all communication with OpenRouter API
 */

export interface ChatMessage {
    role: "user" | "assistant" | "system"
    content: string
}

export interface OpenRouterResponse {
    id: string
    model: string
    choices: {
        message: {
            role: string
            content: string
        }
        finish_reason: string
    }[]
    usage?: {
        prompt_tokens: number
        completion_tokens: number
        total_tokens: number
    }
}

export interface OpenRouterError {
    error: {
        message: string
        type: string
        code?: number
    }
}

/**
 * Errors that indicate we should try a fallback model
 */
const RETRYABLE_ERROR_CODES = [
    429,  // Rate limit
    503,  // Service unavailable
    502,  // Bad gateway
    504,  // Gateway timeout
    529,  // OpenRouter overloaded
]

/**
 * Call OpenRouter API with a specific model
 */
export async function callOpenRouter(
    model: string,
    messages: ChatMessage[],
    options?: {
        maxTokens?: number
        temperature?: number
        timeout?: number
    }
): Promise<{ success: true; data: OpenRouterResponse } | { success: false; error: string; retryable: boolean }> {
    const apiKey = process.env.OPENROUTER_API_KEY

    if (!apiKey) {
        console.error("[OpenRouter] API key not found in environment")
        return {
            success: false,
            error: "OpenRouter API key not configured",
            retryable: false
        }
    }

    console.log(`[OpenRouter] Calling model: ${model}`)

    const controller = new AbortController()
    const timeout = options?.timeout ?? 30000

    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://raffitechai.vercel.app",
                "X-Title": "RaffiTech AI"
            },
            body: JSON.stringify({
                model,
                messages,
                max_tokens: options?.maxTokens ?? 2048,
                temperature: options?.temperature ?? 0.7
            }),
            signal: controller.signal
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({})) as OpenRouterError
            const isRetryable = RETRYABLE_ERROR_CODES.includes(response.status)

            console.error(`[OpenRouter] Error for ${model}: ${response.status} - ${errorData.error?.message || 'Unknown'}`)

            return {
                success: false,
                error: errorData.error?.message || `API error: ${response.status}`,
                retryable: isRetryable
            }
        }

        const data = await response.json() as OpenRouterResponse
        console.log(`[OpenRouter] Success with model: ${data.model || model}`)
        return { success: true, data }

    } catch (error) {
        clearTimeout(timeoutId)

        if (error instanceof Error) {
            if (error.name === "AbortError") {
                return {
                    success: false,
                    error: "Request timeout",
                    retryable: true
                }
            }
            return {
                success: false,
                error: error.message,
                retryable: true
            }
        }

        return {
            success: false,
            error: "Unknown error occurred",
            retryable: true
        }
    }
}
