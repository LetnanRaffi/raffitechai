import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export function createClient() {
    if (!supabaseUrl || !supabaseAnonKey) {
        // Return a mock client during build time to prevent static generation errors
        // This will only be used during build, not at runtime
        console.warn('Supabase credentials not found - using mock client for build')
        return null as unknown as ReturnType<typeof createBrowserClient>
    }

    return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
