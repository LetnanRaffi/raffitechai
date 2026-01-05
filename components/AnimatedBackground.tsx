"use client"

import { useEffect, useRef } from "react"

interface AnimatedBackgroundProps {
    variant?: "default" | "subtle" | "intense"
    className?: string
}

export function AnimatedBackground({ variant = "default", className = "" }: AnimatedBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        let animationFrameId: number
        let particles: Particle[] = []

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }

        class Particle {
            x: number
            y: number
            size: number
            speedX: number
            speedY: number
            opacity: number

            constructor() {
                this.x = Math.random() * canvas!.width
                this.y = Math.random() * canvas!.height
                this.size = Math.random() * 2 + 0.5
                this.speedX = (Math.random() - 0.5) * 0.3
                this.speedY = (Math.random() - 0.5) * 0.3
                this.opacity = Math.random() * 0.5 + 0.1
            }

            update() {
                this.x += this.speedX
                this.y += this.speedY

                if (this.x < 0) this.x = canvas!.width
                if (this.x > canvas!.width) this.x = 0
                if (this.y < 0) this.y = canvas!.height
                if (this.y > canvas!.height) this.y = 0
            }

            draw() {
                if (!ctx) return
                ctx.beginPath()
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(239, 68, 68, ${this.opacity})`
                ctx.fill()
            }
        }

        const init = () => {
            const particleCount = variant === "intense" ? 80 : variant === "subtle" ? 30 : 50
            particles = []
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle())
            }
        }

        const animate = () => {
            if (!ctx || !canvas) return
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            particles.forEach(particle => {
                particle.update()
                particle.draw()
            })

            // Draw connections
            particles.forEach((a, i) => {
                particles.slice(i + 1).forEach(b => {
                    const dx = a.x - b.x
                    const dy = a.y - b.y
                    const distance = Math.sqrt(dx * dx + dy * dy)

                    if (distance < 120) {
                        ctx.beginPath()
                        ctx.moveTo(a.x, a.y)
                        ctx.lineTo(b.x, b.y)
                        ctx.strokeStyle = `rgba(239, 68, 68, ${0.1 * (1 - distance / 120)})`
                        ctx.lineWidth = 0.5
                        ctx.stroke()
                    }
                })
            })

            animationFrameId = requestAnimationFrame(animate)
        }

        resize()
        init()
        animate()

        window.addEventListener("resize", () => {
            resize()
            init()
        })

        return () => {
            cancelAnimationFrame(animationFrameId)
            window.removeEventListener("resize", resize)
        }
    }, [variant])

    return (
        <>
            {/* Gradient orbs */}
            <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
                <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[120px] animate-float" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[100px] animate-float delay-200" style={{ animationDelay: "2s" }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-500/5 rounded-full blur-[150px]" />
            </div>

            {/* Particle canvas */}
            <canvas
                ref={canvasRef}
                className={`absolute inset-0 pointer-events-none ${className}`}
                style={{ opacity: variant === "subtle" ? 0.5 : 1 }}
            />

            {/* Noise overlay */}
            <div className="absolute inset-0 noise-overlay pointer-events-none" />
        </>
    )
}
