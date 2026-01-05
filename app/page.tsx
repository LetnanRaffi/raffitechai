"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useEffect, useState } from "react"
import { AnimatedBackground } from "@/components/AnimatedBackground"
import { FeatureCard } from "@/components/FeatureCard"
import { LoadingScreen } from "@/components/LoadingScreen"
import {
  Sparkles,
  Zap,
  Shield,
  Globe,
  Code,
  MessageSquare,
  FileText,
  Brain,
  Rocket,
  Check,
  ArrowRight,
  Star
} from "lucide-react"

export default function Home() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [showLoading, setShowLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/chat")
    }
  }, [user, isLoading, router])

  if (showLoading) return <LoadingScreen message="Welcome to RaffiTech AI" />

  return (
    <main className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <AnimatedBackground variant="default" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 relative rounded-xl overflow-hidden glow-red-sm">
              <Image src="/logo.png" alt="Logo" fill className="object-contain" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">RaffiTech<span className="text-red-500">AI</span></span>
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              className="hidden sm:block text-sm text-gray-400 hover:text-white transition-colors"
            >
              Pricing
            </button>
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary text-sm px-5 py-2.5"
              >
                Get Started
              </motion.button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 px-4">
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-premium text-sm mb-8"
          >
            <Sparkles size={14} className="text-red-400" />
            <span className="text-gray-300">Powered by GPT-5.1, Claude 4.5, Gemini 3</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
          >
            <span className="text-white">The Future of</span>
            <br />
            <span className="text-gradient">AI Conversation</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Experience premium AI intelligence with RaffiTech.
            Fast responses, multiple personalities, and unlimited possibilities.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/chat">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary text-base px-8 py-4 flex items-center gap-2"
              >
                Start Chatting
                <ArrowRight size={18} />
              </motion.button>
            </Link>
            <button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-secondary text-base px-8 py-4"
            >
              Explore Features
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-16"
          >
            {[
              { value: "5+", label: "AI Personas" },
              { value: "99.9%", label: "Uptime" },
              { value: "Free", label: "To Start" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="font-display text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-xs sm:text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-5 h-8 rounded-full border-2 border-white/20 flex items-start justify-center p-1"
          >
            <div className="w-1 h-2 bg-white/40 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section - Bento Grid */}
      <section id="features" className="relative py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">
              Why Choose <span className="text-gradient">RaffiTech AI</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Built for creators, developers, and professionals who demand excellence.
            </p>
          </motion.div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureCard
              icon={Brain}
              title="5 AI Personalities"
              description="Switch between Professional, Casual, Expert, Quick, and Creative modes instantly."
              delay={0.1}
            />
            <FeatureCard
              icon={Zap}
              title="Lightning Fast"
              description="Sub-second response times with optimized model routing and smart caching."
              delay={0.2}
            />
            <FeatureCard
              icon={Code}
              title="Code Expert"
              description="Write, debug, and optimize code in any language with AI-powered assistance."
              delay={0.3}
            />
            <FeatureCard
              icon={Globe}
              title="Bilingual Support"
              description="Seamlessly chat in English or Bahasa Indonesia with context-aware responses."
              delay={0.4}
            />
            <FeatureCard
              icon={FileText}
              title="CV Generator"
              description="Transform your experience into professional, ATS-friendly resumes."
              delay={0.5}
            />
            <FeatureCard
              icon={Shield}
              title="Secure & Private"
              description="Your conversations are encrypted and never used for training."
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-950/10 to-transparent pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">
              Simple, <span className="text-gradient">Transparent</span> Pricing
            </h2>
            <p className="text-gray-400 text-lg">
              Start free, upgrade when you need more power.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Free Tier */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass-premium rounded-2xl p-6 sm:p-8"
            >
              <div className="text-gray-400 text-sm font-medium mb-2">STARTER</div>
              <div className="font-display text-4xl font-bold mb-1">Free</div>
              <div className="text-gray-500 text-sm mb-6">Forever free</div>

              <ul className="space-y-3 mb-8">
                {["Powerful AI Models", "5 AI Personalities", "Voice Input", "Basic Support"].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                    <Check size={16} className="text-green-400" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link href="/chat" className="block">
                <button className="w-full btn-secondary py-3">
                  Get Started
                </button>
              </Link>
            </motion.div>

            {/* Standard Tier */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass-premium rounded-2xl p-6 sm:p-8 border-red-500/30 relative"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                BEST VALUE
              </div>
              <div className="text-red-400 text-sm font-medium mb-2">STANDARD</div>
              <div className="font-display text-4xl font-bold mb-1">
                Rp 20.000<span className="text-lg text-gray-500">/mo</span>
              </div>
              <div className="text-gray-500 text-sm mb-6">Billed monthly</div>

              <ul className="space-y-3 mb-8">
                {["Everything in Free", "DeepSeek V3.2", "ByteDance Seed 1.6", "Priority Support", "No Limits"].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                    <Check size={16} className="text-green-400" />
                    {f}
                  </li>
                ))}
              </ul>

              <button className="w-full btn-primary py-3">
                Upgrade Now
              </button>
            </motion.div>

            {/* Pro Tier */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="glass-premium rounded-2xl p-6 sm:p-8"
            >
              <div className="flex items-center gap-2 text-sm font-medium mb-2">
                <Star size={14} className="text-yellow-400" />
                <span className="text-yellow-400">PRO</span>
              </div>
              <div className="font-display text-4xl font-bold mb-1">
                Rp 50.000<span className="text-lg text-gray-500">/mo</span>
              </div>
              <div className="text-gray-500 text-sm mb-6">Billed monthly</div>

              <ul className="space-y-3 mb-8">
                {["Everything in Standard", "GPT-5.1 & Claude 4.5", "Gemini 3 Pro", "API Access", "Premium Support"].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                    <Check size={16} className="text-green-400" />
                    {f}
                  </li>
                ))}
              </ul>

              <button className="w-full btn-secondary py-3 border-yellow-500/30">
                Go Pro
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-premium rounded-3xl p-8 sm:p-12"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Ready to Experience the Future?
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Join thousands of users already using RaffiTech AI for work, learning, and creativity.
            </p>
            <Link href="/chat">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary text-lg px-10 py-4"
              >
                Start Free Today
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 border-t border-white/5 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 relative rounded-lg overflow-hidden">
              <Image src="/logo.png" alt="Logo" fill className="object-contain" />
            </div>
            <span className="font-display font-semibold text-gray-300">RaffiTech AI</span>
          </div>
          <div className="text-sm text-gray-500">
            © 2026 RaffiTech AI. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  )
}
