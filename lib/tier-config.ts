/**
 * RaffiTech Tier Configuration
 * Defines model priorities for each RaffiTech tier
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
 * Models are tried in order - first successful response wins
 * Updated: 2026-01-06 - Prioritize stability & availability
 */
export const TIER_MODELS: Record<RaffiTechTier, string[]> = {
    "RaffiTech Free": [
        // Most stable free models (smaller = more available)
        "google/gemma-3-4b-it:free",                  // Small, very stable
        "qwen/qwen3-4b:free",                         // Small, fast
        "google/gemma-3-12b-it:free",                 // Medium, stable
        "mistralai/mistral-small-3.1-24b-instruct:free", // Good quality
        "qwen/qwen3-coder:free",                      // For code
        "google/gemini-2.0-flash-exp:free",           // Fast Google
        // Larger free models (may have more rate limits)
        "deepseek/deepseek-r1-0528:free",             // Great reasoning
        "moonshotai/kimi-k2:free",                    // Very powerful
        "google/gemma-3-27b-it:free",                 // Good quality
        "meta-llama/llama-3.3-70b-instruct:free",    // Large
    ],
    "RaffiTech Standard": [
        // Cost-effective premium models
        "deepseek/deepseek-v3.2",                     // Best value
        "bytedance-seed/seed-1.6-flash",              // Ultra fast
        "minimax/minimax-m2.1",                       // Great reasoning
        "qwen/qwen3-max",                             // Powerful Qwen
        "z-ai/glm-4.7",                               // Latest GLM
        "mistralai/mistral-large-2512"                // Mistral Large
    ],
    "RaffiTech Pro": [
        // Top-tier premium models
        "openai/gpt-5.1",                             // Latest GPT
        "anthropic/claude-sonnet-4.5",                // Latest Claude Sonnet
        "openai/gpt-5.2-pro",                         // GPT Pro variant
        "google/gemini-3-pro-preview",                // Latest Gemini Pro
        "anthropic/claude-opus-4.5",                  // Claude Opus
        "deepseek/deepseek-v3.2-speciale"             // DeepSeek Special
    ]
}

export const TIER_CONFIGS: Record<RaffiTechTier, TierConfig> = {
    "RaffiTech Free": {
        name: "RaffiTech Free",
        models: TIER_MODELS["RaffiTech Free"],
        description: "Basic AI access with free models",
        requiresSubscription: false
    },
    "RaffiTech Standard": {
        name: "RaffiTech Standard",
        models: TIER_MODELS["RaffiTech Standard"],
        description: "Balanced cost and quality for everyday use",
        requiresSubscription: true
    },
    "RaffiTech Pro": {
        name: "RaffiTech Pro",
        models: TIER_MODELS["RaffiTech Pro"],
        description: "Premium models for professional use",
        requiresSubscription: true
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
