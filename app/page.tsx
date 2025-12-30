"use client"

import { Navbar } from "@/components/Navbar"
import { PricingCard } from "@/components/PricingCard"
import { ChatSimulation } from "@/components/ChatSimulation"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useEffect } from "react"
import { FileText, Sparkles, CheckCircle } from "lucide-react"

export default function Home() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/chat")
    }
  }, [user, isLoading, router])

  if (isLoading) return null // Prevent flash before redirect

  return (
    <main className="min-h-screen bg-black text-white selection:bg-red-500/30 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden pt-20">
        {/* Background Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left Column: Text */}
          <div className="text-left space-y-8">
            <div className="inline-block glass px-4 py-1.5 rounded-full text-xs font-medium text-red-400 border-red-500/20 animate-pulse">
              Introducing Next-Gen AI
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
              Experience the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-300 to-white">
                Future of Tech
              </span>
            </h1>

            <p className="text-lg text-gray-400 max-w-xl leading-relaxed">
              RaffiTech AI delivers premium conversational intelligence.
              Sleek, fast, and designed for those who demand excellence.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-start gap-4 pt-4">
              <Link href="/chat">
                <button className="px-8 py-4 bg-red-600 text-white rounded-full font-bold shadow-[0_0_30px_rgba(220,0,0,0.4)] hover:shadow-[0_0_50px_rgba(220,0,0,0.6)] hover:bg-red-700 transition-all transform hover:-translate-y-1">
                  Start Chatting
                </button>
              </Link>
              <button
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 glass text-white rounded-full font-medium hover:bg-white/5 transition-all"
              >
                View Pricing
              </button>
            </div>
          </div>

          {/* Right Column: Chat Simulation */}
          <div className="w-full flex justify-center lg:justify-end">
            <div className="w-full max-w-md transform hover:scale-[1.02] transition-transform duration-500">
              <ChatSimulation />
            </div>
          </div>
        </div>
      </section>

      {/* CV Generator Feature Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-red-600/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="order-2 lg:order-1 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-blue-900/20 blur-xl transform rotate-6" />
            <div className="relative glass border border-white/10 rounded-2xl p-6 md:p-8 hover:border-red-500/30 transition-all duration-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center text-red-400">
                  <FileText size={20} />
                </div>
                <h3 className="text-xl font-bold text-white">CV Preview</h3>
              </div>
              <div className="space-y-4">
                <div className="h-4 w-3/4 bg-white/10 rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-white/10 rounded animate-pulse" />
                <div className="h-32 w-full bg-white/5 rounded border border-white/5 p-4">
                  <div className="h-3 w-full bg-white/10 rounded mb-2" />
                  <div className="h-3 w-5/6 bg-white/10 rounded mb-2" />
                  <div className="h-3 w-4/6 bg-white/10 rounded" />
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-900/30 border border-red-500/30 text-red-400 text-xs font-medium">
              <Sparkles size={12} />
              New Feature
            </div>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              Professional CV <br />
              <span className="text-red-500">Generated by AI</span>
            </h2>
            <p className="text-lg text-gray-400">
              Transform your casual experience into an ATS-friendly Professional CV in seconds.
              Powered by our most advanced language models.
            </p>

            <ul className="space-y-3 pt-2">
              <li className="flex items-center gap-3 text-gray-300">
                <CheckCircle size={18} className="text-green-500 shrink-0" />
                <span>Format Standar HR & ATS Friendly</span>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <CheckCircle size={18} className="text-green-500 shrink-0" />
                <span>Auto-fix bahasa "Curhat" jadi Formal</span>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <CheckCircle size={18} className="text-green-500 shrink-0" />
                <span><span className="text-white font-bold">5x Free Usage</span> for everyone</span>
              </li>
            </ul>

            <div className="pt-4">
              <Link href="/cv">
                <button className="px-6 py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-colors flex items-center gap-2">
                  Try CV Generator
                  <Sparkles size={16} />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-red-950/20 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold">Premium Access</h2>
            <p className="text-gray-400">Choose the plan that fits your ambition.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
            <PricingCard
              title="Starter"
              price="Free"
              tierKey="free"
              features={[
                "Basic Chat Access",
                "Standard Response Speed",
                "Community Support",
                "Daily Usage Limits"
              ]}
              delay={0.1}
            />

            <PricingCard
              title="Professional"
              price="Rp 50.000"
              tierKey="pro"
              features={[
                "Priority Support",
                "Faster Response Time",
                "Advanced AI Models",
                "No Usage Limits",
                "Custom Themes"
              ]}
              isPopular={true}
              delay={0.2}
            />

            <PricingCard
              title="Standard"
              price="Rp 20.000"
              tierKey="standard"
              features={[
                "Standard Chat Access",
                "Fast Response Speed",
                "Email Support",
                "Increased Usage Limits"
              ]}
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 relative rounded-full overflow-hidden">
              <Image src="/logo.png" alt="Logo" fill className="object-cover" />
            </div>
            <span className="font-bold text-gray-200">RaffiTech AI</span>
          </div>
          <div className="text-sm text-gray-500">
            © 2025 RaffiTech AI. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  )
}
