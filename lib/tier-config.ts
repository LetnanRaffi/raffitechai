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
 */
export const TIER_MODELS: Record<RaffiTechTier, string[]> = {
    "RaffiTech Free": [
        // Truly FREE models (no cost at all)
        "nvidia/nemotron-nano-9b-v2:free",        // NVIDIA free
        "nvidia/nemotron-3-nano-30b-a3b:free",    // NVIDIA 30B free
        "nvidia/nemotron-nano-12b-v2-vl:free",    // NVIDIA VL free
        "allenai/olmo-3.1-32b-think:free",        // Allen AI 32B free
        "allenai/olmo-3-32b-think:free",          // Allen AI 32B think free
        "mistralai/devstral-2512:free",           // Mistral coding free
        "xiaomi/mimo-v2-flash:free",              // Xiaomi flash free
        "arcee-ai/trinity-mini:free",             // Arcee mini free
        "tngtech/tng-r1t-chimera:free",           // TNG R1 free
        "nex-agi/deepseek-v3.1-nex-n1:free",      // DeepSeek variant free
        "kwaipilot/kat-coder-pro:free",           // Kwaipilot coder free
        "alibaba/tongyi-deepresearch-30b-a3b:free", // Alibaba research free
        // Super cheap fallbacks (< $0.0001 per request)
        "gryphe/mythomax-l2-13b",                 // $0.00006/1k tokens
        "mistralai/mistral-7b-instruct-v0.1"      // $0.00011/1k tokens
    ],
    "RaffiTech Standard": [
        "deepseek/deepseek-v3.2",                 // DeepSeek V3.2 - very good & cheap
        "deepseek/deepseek-chat",                 // DeepSeek chat
        "bytedance-seed/seed-1.6-flash",          // ByteDance fast
        "mistralai/ministral-8b-2512",            // Mistral 8B
        "qwen/qwen3-vl-8b-instruct",              // Qwen 8B
        "openai/gpt-3.5-turbo"                    // GPT-3.5 fallback
    ],
    "RaffiTech Pro": [
        "anthropic/claude-3.5-sonnet",            // Claude 3.5 Sonnet
        "openai/gpt-4o",                          // GPT-4o
        "deepseek/deepseek-v3.1-terminus",        // DeepSeek V3.1
        "x-ai/grok-4-fast",                       // Grok 4
        "google/gemini-2.5-flash-lite-preview-09-2025" // Gemini 2.5
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
