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
 * FREE models have :free suffix, they have separate rate limits
 * Updated: 2026-01-05 with verified available models
 */
export const TIER_MODELS: Record<RaffiTechTier, string[]> = {
    "RaffiTech Free": [
        // Primary FREE models (verified available on OpenRouter)
        "google/gemma-3n-e4b-it:free",            // Google Gemma 3N - newest, stable
        "moonshotai/kimi-k2:free",                // Kimi K2 - very capable
        "deepseek/deepseek-r1-0528:free",         // DeepSeek R1 - reasoning
        "qwen/qwen3-coder:free",                  // Qwen 3 Coder - great for code
        "z-ai/glm-4.5-air:free",                  // GLM 4.5 Air - fast
        "google/gemma-3n-e2b-it:free",            // Google Gemma 3N smaller
        "openai/gpt-oss-20b:free",                // OpenAI OSS 20B
        "tngtech/deepseek-r1t2-chimera:free",     // DeepSeek variant
        // Backup FREE models
        "xiaomi/mimo-v2-flash:free",              // Xiaomi flash
        "nvidia/nemotron-nano-9b-v2:free",        // NVIDIA 9B
        "allenai/olmo-3.1-32b-think:free",        // Allen AI 32B
        "mistralai/devstral-2512:free",           // Mistral coding
        "arcee-ai/trinity-mini:free",             // Arcee mini
        // Ultra cheap fallback
        "gryphe/mythomax-l2-13b"                  // $0.00006/1k tokens
    ],
    "RaffiTech Standard": [
        "deepseek/deepseek-v3.2",                 // DeepSeek V3.2 - best value
        "bytedance-seed/seed-1.6-flash",          // ByteDance - ultra fast
        "minimax/minimax-m2.1",                   // MiniMax - great reasoning
        "deepseek/deepseek-chat",                 // DeepSeek chat
        "z-ai/glm-4.7",                           // GLM 4.7 - latest
        "qwen/qwen3-vl-8b-instruct"               // Qwen 8B multimodal
    ],
    "RaffiTech Pro": [
        "anthropic/claude-sonnet-4",              // Claude Sonnet 4 - latest
        "openai/gpt-4.1",                         // GPT-4.1 - latest
        "deepseek/deepseek-r1",                   // DeepSeek R1 - best reasoning
        "anthropic/claude-3.5-sonnet",            // Claude 3.5 Sonnet
        "openai/gpt-4o",                          // GPT-4o
        "google/gemini-2.5-flash"                 // Gemini 2.5 Flash
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
