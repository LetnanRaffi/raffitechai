/**
 * RaffiTech Tier Configuration
 * ALL TIERS USE FREE MODELS ONLY - No paid models
 */

export type RaffiTechTier = "RaffiTech Free" | "RaffiTech Standard" | "RaffiTech Pro"

export interface TierConfig {
    name: RaffiTechTier
    models: string[]
    description: string
    requiresSubscription: boolean
}

/**
 * Model priority list for each tier
 * ALL FREE MODELS - prioritized by stability and capability
 * Updated: 2026-01-06
 */
export const TIER_MODELS: Record<RaffiTechTier, string[]> = {
    "RaffiTech Free": [
        // Small, very stable free models
        "google/gemma-3-4b-it:free",
        "qwen/qwen3-4b:free",
        "meta-llama/llama-3.2-3b-instruct:free",
        "google/gemma-3-12b-it:free",
        "mistralai/mistral-small-3.1-24b-instruct:free",
    ],
    "RaffiTech Standard": [
        // Medium-sized free models with better quality
        "google/gemma-3-27b-it:free",
        "qwen/qwen3-coder:free",
        "google/gemini-2.0-flash-exp:free",
        "deepseek/deepseek-r1-0528:free",
        "mistralai/mistral-small-3.1-24b-instruct:free",
        "cognitivecomputations/dolphin-mistral-24b-venice-edition:free",
    ],
    "RaffiTech Pro": [
        // Largest, most powerful free models
        "moonshotai/kimi-k2:free",
        "meta-llama/llama-3.3-70b-instruct:free",
        "nousresearch/hermes-3-llama-3.1-405b:free",
        "deepseek/deepseek-r1-0528:free",
        "openai/gpt-oss-120b:free",
        "tngtech/deepseek-r1t2-chimera:free",
    ]
}

export const TIER_CONFIGS: Record<RaffiTechTier, TierConfig> = {
    "RaffiTech Free": {
        name: "RaffiTech Free",
        models: TIER_MODELS["RaffiTech Free"],
        description: "Fast AI for everyday tasks",
        requiresSubscription: false
    },
    "RaffiTech Standard": {
        name: "RaffiTech Standard",
        models: TIER_MODELS["RaffiTech Standard"],
        description: "Enhanced AI with better reasoning",
        requiresSubscription: false  // Now free!
    },
    "RaffiTech Pro": {
        name: "RaffiTech Pro",
        models: TIER_MODELS["RaffiTech Pro"],
        description: "Maximum power for complex tasks",
        requiresSubscription: false  // Now free!
    }
}

/**
 * Get models for a specific tier
 */
export function getModelsForTier(tier: RaffiTechTier): string[] {
    return TIER_MODELS[tier] || TIER_MODELS["RaffiTech Free"]
}

/**
 * Check if a tier requires subscription
 */
export function requiresSubscription(tier: RaffiTechTier): boolean {
    return TIER_CONFIGS[tier]?.requiresSubscription ?? false
}

/**
 * Validate tier string
 */
export function isValidTier(tier: string): tier is RaffiTechTier {
    return tier in TIER_MODELS
}
