'use client'

import { useEffect, useRef, useState } from 'react'

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    // Set canvas size and check mobile
    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      setIsMobile(window.innerWidth < 768)
    }
    
    setCanvasSize()
    window.addEventListener('resize', setCanvasSize)

    // Particle class
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number

      constructor() {
        this.x = Math.random() * (canvas?.width || window.innerWidth)
        this.y = Math.random() * (canvas?.height || window.innerHeight)
        this.size = Math.random() * 1.5 + 0.5
        this.speedX = (Math.random() * 0.4 - 0.2) * (window.innerWidth < 768 ? 0.5 : 1)
        this.speedY = (Math.random() * 0.4 - 0.2) * (window.innerWidth < 768 ? 0.5 : 1)
        this.opacity = Math.random() * 0.4 + 0.1
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        // Wrap around screen
        if (this.x > (canvas?.width || window.innerWidth)) this.x = 0
        if (this.x < 0) this.x = canvas?.width || window.innerWidth
        if (this.y > (canvas?.height || window.innerHeight)) this.y = 0
        if (this.y < 0) this.y = canvas?.height || window.innerHeight
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = `rgba(76, 201, 240, ${this.opacity})`
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Create particles based on screen size
    const particlesArray: Particle[] = []
    const numberOfParticles = window.innerWidth < 768 ? 35 : 80
    const connectionDistance = window.innerWidth < 768 ? 70 : 100

    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle())
    }

    let animationFrameId: number

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesArray.forEach((particle) => {
        particle.update()
        particle.draw()
      })

      // Draw connections - optimized loop
      for (let i = 0; i < particlesArray.length; i++) {
        for (let j = i + 1; j < particlesArray.length; j++) {
          const dx = particlesArray[i].x - particlesArray[j].x
          const dy = particlesArray[i].y - particlesArray[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < connectionDistance) {
            ctx.strokeStyle = `rgba(76, 201, 240, ${0.08 * (1 - distance / connectionDistance)})`
            ctx.lineWidth = 0.4
            ctx.beginPath()
            ctx.moveTo(particlesArray[i].x, particlesArray[i].y)
            ctx.lineTo(particlesArray[j].x, particlesArray[j].y)
            ctx.stroke()
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', setCanvasSize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.35 }}
    />
  )
}

export default ParticleBackground
