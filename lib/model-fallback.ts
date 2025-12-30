/**
 * Model Fallback Service
 * Handles automatic model switching on failures
 */

import { callOpenRouter, ChatMessage, OpenRouterResponse } from "./openrouter"
import { getModelsForTier, RaffiTechTier } from "./tier-config"

/**
 * Cache of temporarily failed models
 * Key: model ID, Value: timestamp when failure occurred
 */
const failedModelsCache = new Map<string, number>()

/**
 * How long to cache a failed model (5 minutes)
 */
const FAILURE_CACHE_TTL = 5 * 60 * 1000

/**
 * Clean up expired cache entries
 */
function cleanExpiredCache(): void {
    const now = Date.now()
    for (const [model, timestamp] of failedModelsCache) {
        if (now - timestamp > FAILURE_CACHE_TTL) {
            failedModelsCache.delete(model)
        }
    }
}

/**
 * Check if a model is temporarily blacklisted
 */
function isModelBlacklisted(model: string): boolean {
    cleanExpiredCache()
    const failedAt = failedModelsCache.get(model)
    if (!failedAt) return false
    return Date.now() - failedAt < FAILURE_CACHE_TTL
}

/**
 * Mark a model as temporarily failed
 */
function blacklistModel(model: string): void {
    failedModelsCache.set(model, Date.now())
}

export interface FallbackResult {
    success: boolean
    tier: RaffiTechTier
    model: string | null
    message: string
    attempts: { model: string; error?: string }[]
}

/**
 * Try to get a response using fallback logic
 * Attempts each model in the tier's priority list
 */
export async function callWithFallback(
    tier: RaffiTechTier,
    messages: ChatMessage[],
    options?: {
        maxRetries?: number
        maxTokens?: number
        temperature?: number
    }
): Promise<FallbackResult> {
    const models = getModelsForTier(tier)
    const attempts: { model: string; error?: string }[] = []
    const maxRetries = options?.maxRetries ?? 1

    for (const model of models) {
        // Skip blacklisted models
        if (isModelBlacklisted(model)) {
            attempts.push({ model, error: "Temporarily unavailable (cached)" })
            continue
        }

        // Try this model with retries
        for (let retry = 0; retry <= maxRetries; retry++) {
            const result = await callOpenRouter(model, messages, {
                maxTokens: options?.maxTokens,
                temperature: options?.temperature
            })

            if (result.success) {
                const content = result.data.choices[0]?.message?.content || ""
                return {
                    success: true,
                    tier,
                    model: result.data.model || model,
                    message: content,
                    attempts
                }
            }

            // Log the attempt
            attempts.push({
                model,
                error: `${result.error}${retry > 0 ? ` (retry ${retry})` : ""}`
            })

            // If not retryable, don't retry this model
            if (!result.retryable) {
                blacklistModel(model)
                break
            }

            // Wait briefly before retry
            if (retry < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, 500))
            }
        }

        // Blacklist after all retries failed
        blacklistModel(model)
    }

    // All models failed
    return {
        success: false,
        tier,
        model: null,
        message: "All models in this tier are currently unavailable. Please try again later.",
        attempts
    }
}

/**
 * Clear the failed models cache (for testing)
 */
export function clearFailedModelsCache(): void {
    failedModelsCache.clear()
}
