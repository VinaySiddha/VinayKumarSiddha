'use client'

import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Brain, Zap, Heart, Code2, Rocket, Users, Target, Sparkles, Lightbulb, Shield } from 'lucide-react'
import { useRef, useState, useEffect } from 'react'
import creativeData from '../../data/creative.json'

interface ThoughtBubble {
  id: number
  title: string
  description: string
  icon: string
  color: string
  x: number
  y: number
  size: number
}

function FloatingThought({ bubble, index, scrollProgress, isMobile, iconMap }: { bubble: ThoughtBubble; index: number; scrollProgress: any; isMobile: boolean; iconMap: Record<string, any> }) {
  const [isHovered, setIsHovered] = useState(false)
  const BubbleIcon = iconMap[bubble.icon]
  
  const yParallax = useTransform(scrollProgress, [0, 1], isMobile ? [0, bubble.y * -0.2] : [bubble.y * 0.5, bubble.y * -0.8])
  const xParallax = useTransform(scrollProgress, [0, 1], isMobile ? [0, 0] : [0, (index % 2 === 0 ? 20 : -20)])
  const ySpring = useSpring(yParallax, { stiffness: isMobile ? 50 : 80, damping: 30 })
  const xSpring = useSpring(xParallax, { stiffness: isMobile ? 50 : 80, damping: 30 })

  const bubbleSize = isMobile ? bubble.size * 0.6 : bubble.size

  return (
    <motion.div
      className="absolute"
      style={{
        left: isMobile ? '50%' : `${bubble.x}%`,
        top: isMobile ? `${index * 140}px` : `${bubble.y}%`,
        x: isMobile ? '-50%' : xSpring,
        y: ySpring,
        zIndex: isHovered ? 50 : index,
      }}
      initial={{ opacity: 0, scale: 0, filter: 'blur(20px)' }}
      whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true }}
      transition={{
        duration: 1.2,
        delay: index * 0.15,
        type: 'spring',
        damping: 20,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="relative cursor-pointer bg-[#0a0a0a] border border-white/10 flex items-center justify-center transition-all duration-300"
        style={{
          width: `${bubbleSize}px`,
          height: `${bubbleSize}px`,
          borderRadius: '1rem',
        }}
        initial={{ filter: 'blur(10px)', opacity: 0 }}
        whileInView={{ filter: 'blur(0px)', opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
        whileHover={isMobile ? {} : {
          scale: 1.05,
          borderColor: 'rgba(255, 255, 255, 0.3)',
          backgroundColor: '#111',
          transition: { duration: 0.3 },
        }}
      >
        <BubbleIcon
          className="w-10 h-10 relative z-10 text-white/40 transition-colors"
          style={isHovered ? { color: '#fff' } : {}}
        />
        
        {/* Subtle Module Tag */}
        <div className="absolute -bottom-2 right-2 px-1.5 py-0.5 rounded bg-black border border-white/10">
          <span className="text-[7px] font-mono text-white/20 uppercase tracking-tighter">PRC_{bubble.id}</span>
        </div>
      </motion.div>

      {/* Expanded description card */}
      <motion.div
        className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-64 p-6 rounded-xl bg-[#0a0a0a] border border-white/10 pointer-events-none z-[100] shadow-2xl"
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{
          opacity: isHovered ? 1 : 0,
          y: isHovered ? 0 : -10,
          scale: isHovered ? 1 : 0.95,
        }}
        transition={{ duration: 0.2 }}
      >
        <h4 className="text-lg font-bold text-white mb-2 tracking-tight font-mono lowercase opacity-60">// {bubble.title}</h4>
        <p className="text-white/40 text-xs leading-relaxed font-mono italic">
          {`/* ${bubble.description} */`}
        </p>
      </motion.div>
    </motion.div>
  )
}

export default function MindscapeCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const updateViewport = () => {
      setIsMobile(window.innerWidth < 768)
    }
    updateViewport()
    window.addEventListener('resize', updateViewport)
    return () => window.removeEventListener('resize', updateViewport)
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const iconMap: Record<string, any> = {
    Code2, Lightbulb, Target, Zap, Heart, Brain, Rocket, Users, Shield,
  }

  const bubblesFromJSON: ThoughtBubble[] = creativeData.bubbles.map(bubble => ({
    id: bubble.id,
    title: bubble.title,
    description: bubble.description,
    icon: bubble.icon,
    color: bubble.color,
    x: bubble.x,
    y: bubble.y,
    size: bubble.size,
  }))

  return (
    <section
      id="mindscape"
      ref={containerRef}
      className="relative py-16 px-6 bg-[#050505] overflow-hidden"
    >
      <div className="container mx-auto max-w-7xl relative z-10" ref={ref}>
        {/* Header */}
        <div className="flex flex-col items-start mb-12 border-l-2 border-cyber-blue pl-6">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[10px] font-mono tracking-[0.3em] text-cyber-blue uppercase mb-2"
          >
            System_Logic: //CREATIVE_KERNEL
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 40, filter: 'blur(20px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="text-4xl md:text-6xl font-black text-white tracking-tighter"
          >
            MINDSCAPE<span className="text-cyber-blue">.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-white/40 max-w-xl text-sm font-mono mt-6 italic"
          >
            // Analyzing abstract thought patterns and engineering philosophies...
          </motion.p>
        </div>

        {/* Canvas area */}
        <div className={isMobile ? "relative min-h-[1400px]" : "relative h-[1000px]"}>
          {/* System Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

          {bubblesFromJSON.map((bubble, index) => (
            <FloatingThought
              key={bubble.id}
              bubble={bubble}
              index={index}
              scrollProgress={scrollYProgress}
              isMobile={isMobile}
              iconMap={iconMap}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
