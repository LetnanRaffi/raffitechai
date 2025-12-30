"use client"

import { Navbar } from "@/components/Navbar"
import { PricingCard } from "@/components/PricingCard"
import { ChatSimulation } from "@/components/ChatSimulation"
import Image from "next/image"
import Link from "next/link"

export default function Home() {
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
