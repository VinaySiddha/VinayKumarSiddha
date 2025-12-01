'use client'

import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Brain, Zap, Heart, Code2, Rocket, Users, Target, Sparkles, Lightbulb, Shield } from 'lucide-react'
import { useRef, useState, useEffect } from 'react'

interface ThoughtBubble {
  id: number
  title: string
  description: string
  icon: any
  color: string
  x: number
  y: number
  size: number
  streamColor: string
}

function FloatingThought({ bubble, index, scrollProgress, isMobile }: { bubble: ThoughtBubble; index: number; scrollProgress: any; isMobile: boolean }) {
  const [isHovered, setIsHovered] = useState(false)
  
  // Reduced parallax on mobile
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
      {/* Thought bubble with organic shape */}
      <motion.div
        className="relative cursor-pointer backdrop-blur-md"
        style={{
          width: `${bubbleSize}px`,
          height: `${bubbleSize}px`,
        }}
        whileHover={isMobile ? {} : {
          scale: 1.2,
          rotate: [0, 5, -5, 0],
          transition: { duration: 0.6 },
        }}
        animate={{
          y: isMobile ? [0, -8, 0] : [0, -15, 0],
        }}
        transition={{
          y: {
            duration: 4 + index * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        }}
      >
        {/* Main bubble with organic border */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center overflow-hidden"
          style={{
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
            background: `linear-gradient(135deg, ${bubble.color}20, ${bubble.color}10, rgba(0,0,0,0.6))`,
            border: `2px solid ${bubble.color}60`,
            boxShadow: `0 0 60px ${bubble.color}40, inset 0 0 40px ${bubble.color}10`,
          }}
          animate={{
            borderRadius: [
              '60% 40% 30% 70% / 60% 30% 70% 40%',
              '30% 60% 70% 40% / 50% 60% 30% 60%',
              '60% 40% 30% 70% / 60% 30% 70% 40%',
            ],
            boxShadow: isHovered
              ? `0 0 100px ${bubble.color}70, inset 0 0 60px ${bubble.color}30`
              : `0 0 60px ${bubble.color}40, inset 0 0 40px ${bubble.color}10`,
          }}
          transition={{
            borderRadius: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
            boxShadow: { duration: 0.3 },
          }}
        >
          {/* Flowing gradient inside */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${bubble.color}30, transparent 70%)`,
            }}
            animate={{
              background: [
                `radial-gradient(circle at 30% 30%, ${bubble.color}30, transparent 70%)`,
                `radial-gradient(circle at 70% 70%, ${bubble.color}30, transparent 70%)`,
                `radial-gradient(circle at 30% 30%, ${bubble.color}30, transparent 70%)`,
              ],
            }}
            transition={{ duration: 6, repeat: Infinity }}
          />

          {/* Icon */}
          <bubble.icon
            className="w-12 h-12 relative z-10"
            style={{ color: bubble.color }}
          />
        </motion.div>

        {/* Smaller bubble attachments */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${bubble.size * 0.2}px`,
              height: `${bubble.size * 0.2}px`,
              background: `radial-gradient(circle, ${bubble.color}40, ${bubble.color}10)`,
              border: `1px solid ${bubble.color}50`,
              left: i === 0 ? '-10%' : i === 1 ? '90%' : '50%',
              bottom: i === 2 ? '-15%' : '10%',
            }}
            animate={{
              y: [0, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}

        {/* Ripple effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
            border: `2px solid ${bubble.color}40`,
          }}
          animate={{
            scale: [1, 1.5, 1.5],
            opacity: [0.6, 0, 0],
          }}
          transition={{ duration: 3, repeat: Infinity, delay: index * 0.3 }}
        />
      </motion.div>

      {/* Floating label on hover */}
      <motion.div
        className="absolute top-full mt-4 sm:mt-6 left-1/2 -translate-x-1/2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl backdrop-blur-xl whitespace-nowrap pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${bubble.color}20, rgba(0,0,0,0.9))`,
          border: `2px solid ${bubble.color}50`,
          boxShadow: `0 20px 60px ${bubble.color}40`,
        }}
        initial={{ opacity: 0, y: -10, scale: 0.9 }}
        animate={{
          opacity: isHovered ? 1 : 0,
          y: isHovered ? 0 : -10,
          scale: isHovered ? 1 : 0.9,
        }}
        transition={{ duration: 0.3 }}
      >
        <span className="text-sm sm:text-lg font-black tracking-wide" style={{ color: bubble.color }}>
          {bubble.title}
        </span>
      </motion.div>

      {/* Expanded description card */}
      <motion.div
        className="absolute top-full mt-20 left-1/2 -translate-x-1/2 w-80 p-6 rounded-3xl backdrop-blur-2xl border-2 pointer-events-none"
        style={{
          background: 'rgba(0, 0, 0, 0.95)',
          borderColor: `${bubble.color}60`,
          boxShadow: `0 40px 100px ${bubble.color}50`,
        }}
        initial={{ opacity: 0, y: -20, scale: 0.8 }}
        animate={{
          opacity: isHovered ? 1 : 0,
          y: isHovered ? 0 : -20,
          scale: isHovered ? 1 : 0.8,
        }}
        transition={{ duration: 0.4, type: 'spring', damping: 20 }}
      >
        <p className="text-white/80 text-sm leading-relaxed text-center">
          {bubble.description}
        </p>
        
        {/* Accent line */}
        <motion.div
          className="mt-4 h-1 rounded-full mx-auto"
          style={{
            width: '50%',
            background: `linear-gradient(90deg, transparent, ${bubble.color}, transparent)`,
          }}
          animate={{
            width: ['50%', '70%', '50%'],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Arrow */}
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rotate-45"
          style={{
            background: 'rgba(0, 0, 0, 0.95)',
            borderLeft: `2px solid ${bubble.color}60`,
            borderTop: `2px solid ${bubble.color}60`,
          }}
        />
      </motion.div>
    </motion.div>
  )
}

function CreativeStream({ from, to, color, delay }: { from: { x: number; y: number }; to: { x: number; y: number }; color: string; delay: number }) {
  const midX = (from.x + to.x) / 2
  const midY = (from.y + to.y) / 2 - 15

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
      <defs>
        <linearGradient id={`stream-${delay}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0" />
          <stop offset="50%" stopColor={color} stopOpacity="0.6" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      
      <motion.path
        d={`M ${from.x},${from.y} Q ${midX},${midY} ${to.x},${to.y}`}
        fill="none"
        stroke={`url(#stream-${delay})`}
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{
          pathLength: { duration: 2, delay, ease: 'easeInOut' },
          opacity: { duration: 0.5, delay },
        }}
      />
      
      {/* Flowing particles along stream */}
      <motion.circle
        r="3"
        fill={color}
        initial={{ offsetDistance: '0%' }}
        animate={{ offsetDistance: '100%' }}
        transition={{
          duration: 4,
          repeat: Infinity,
          delay,
          ease: 'linear',
        }}
        style={{
          offsetPath: `path('M ${from.x},${from.y} Q ${midX},${midY} ${to.x},${to.y}')`,
        }}
      >
        <animate attributeName="opacity" values="0;1;1;0" dur="4s" repeatCount="indefinite" />
      </motion.circle>
    </svg>
  )
}

export default function MindscapeCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  const [isMobile, setIsMobile] = useState(false)
  const [particleCount, setParticleCount] = useState(25)

  useEffect(() => {
    const updateViewport = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      setParticleCount(mobile ? 10 : 25)
    }
    updateViewport()
    window.addEventListener('resize', updateViewport)
    return () => window.removeEventListener('resize', updateViewport)
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const bubbles: ThoughtBubble[] = [
    {
      id: 1,
      title: 'ARCHITECT',
      description: 'Designing scalable systems with precision and foresight, where every component serves a greater purpose.',
      icon: Code2,
      color: '#a78bfa',
      x: 12,
      y: 15,
      size: 140,
      streamColor: '#a78bfa',
    },
    {
      id: 2,
      title: 'INNOVATOR',
      description: 'Exploring cutting-edge technologies and transforming ambitious ideas into groundbreaking solutions.',
      icon: Lightbulb,
      color: '#c084fc',
      x: 75,
      y: 10,
      size: 130,
      streamColor: '#c084fc',
    },
    {
      id: 3,
      title: 'STRATEGIST',
      description: 'Converting complex challenges into clear roadmaps with measurable impact and long-term vision.',
      icon: Target,
      color: '#e879f9',
      x: 8,
      y: 45,
      size: 120,
      streamColor: '#e879f9',
    },
    {
      id: 4,
      title: 'VELOCITY',
      description: 'Moving at speed without compromise, balancing rapid delivery with robust engineering excellence.',
      icon: Zap,
      color: '#f472b6',
      x: 45,
      y: 8,
      size: 135,
      streamColor: '#f472b6',
    },
    {
      id: 5,
      title: 'EMPATHY',
      description: 'Building with deep understanding of human needs, creating technology that truly serves people.',
      icon: Heart,
      color: '#fb7185',
      x: 82,
      y: 48,
      size: 125,
      streamColor: '#fb7185',
    },
    {
      id: 6,
      title: 'INTELLIGENCE',
      description: 'Harnessing AI and machine learning to create adaptive systems that evolve with user behavior.',
      icon: Brain,
      color: '#fb923c',
      x: 18,
      y: 75,
      size: 128,
      streamColor: '#fb923c',
    },
    {
      id: 7,
      title: 'LAUNCH',
      description: 'Transforming concepts into production-ready products that create real-world measurable impact.',
      icon: Rocket,
      color: '#fbbf24',
      x: 52,
      y: 65,
      size: 132,
      streamColor: '#fbbf24',
    },
    {
      id: 8,
      title: 'CATALYST',
      description: 'Empowering teams through mentorship and collaboration, amplifying collective potential.',
      icon: Users,
      color: '#4ade80',
      x: 78,
      y: 78,
      size: 122,
      streamColor: '#4ade80',
    },
    {
      id: 9,
      title: 'INTEGRITY',
      description: 'Building with ethical consideration and transparency, honoring the trust placed in technology.',
      icon: Shield,
      color: '#22d3ee',
      x: 42,
      y: 40,
      size: 138,
      streamColor: '#22d3ee',
    },
  ]

  const streams = [
    { from: { x: 15, y: 20 }, to: { x: 45, y: 15 }, color: '#a78bfa80', delay: 0.5 },
    { from: { x: 75, y: 15 }, to: { x: 45, y: 45 }, color: '#c084fc80', delay: 0.8 },
    { from: { x: 12, y: 50 }, to: { x: 42, y: 45 }, color: '#e879f980', delay: 1.1 },
    { from: { x: 52, y: 45 }, to: { x: 80, y: 50 }, color: '#f472b680', delay: 1.4 },
    { from: { x: 42, y: 48 }, to: { x: 20, y: 78 }, color: '#fb718580', delay: 1.7 },
    { from: { x: 55, y: 70 }, to: { x: 80, y: 80 }, color: '#fbbf2480', delay: 2.0 },
  ]

  return (
    <section
      id="mindscape"
      ref={containerRef}
      className="relative py-20 sm:py-32 lg:py-40 px-4 sm:px-6 bg-black overflow-hidden"
    >
      {/* Ethereal background */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 20% 30%, rgba(167, 139, 250, 0.08), transparent 50%), radial-gradient(circle at 80% 70%, rgba(244, 114, 182, 0.08), transparent 50%), radial-gradient(circle at 50% 50%, rgba(251, 146, 60, 0.05), transparent 60%)',
        }}
        animate={{
          background: [
            'radial-gradient(circle at 20% 30%, rgba(167, 139, 250, 0.08), transparent 50%), radial-gradient(circle at 80% 70%, rgba(244, 114, 182, 0.08), transparent 50%)',
            'radial-gradient(circle at 30% 70%, rgba(167, 139, 250, 0.08), transparent 50%), radial-gradient(circle at 70% 30%, rgba(244, 114, 182, 0.08), transparent 50%)',
            'radial-gradient(circle at 20% 30%, rgba(167, 139, 250, 0.08), transparent 50%), radial-gradient(circle at 80% 70%, rgba(244, 114, 182, 0.08), transparent 50%)',
          ],
        }}
        transition={{ duration: 20, repeat: Infinity }}
      />

      {/* Canvas texture */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }}
      />

      {/* Floating particles - reduced on mobile */}
      <div className="absolute inset-0">
        {[...Array(particleCount)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 0.8, 0],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto max-w-7xl relative z-10" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-center mb-32"
        >
          <motion.div
            className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-8 py-2 sm:py-4 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30 backdrop-blur-xl mb-6 sm:mb-10"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Sparkles className="w-4 sm:w-6 h-4 sm:h-6 text-purple-400" />
            <span className="text-sm sm:text-lg font-black text-purple-300 tracking-widest">MINDSCAPE</span>
          </motion.div>

          <h2 className="font-black text-white mb-6 sm:mb-8 leading-tight" style={{ fontSize: 'clamp(2.5rem, 10vw, 4.5rem)' }}>
            Thoughts
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              In Motion
            </span>
          </h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-white/60 max-w-3xl mx-auto font-light leading-relaxed px-4"
            style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1.25rem)' }}
          >
            An abstract canvas where ideas flow freely, connecting and evolving—
            <br className="hidden sm:block" />
            each bubble represents a facet of my creative identity
          </motion.p>
        </motion.div>

        {/* Canvas area */}
        <div className={isMobile ? "relative min-h-[1400px]" : "relative h-[1400px] lg:h-[1100px]"}>
          {/* Creative streams connecting thoughts - hide on mobile */}
          {!isMobile && streams.map((stream, i) => (
            <CreativeStream
              key={i}
              from={stream.from}
              to={stream.to}
              color={stream.color}
              delay={stream.delay}
            />
          ))}

          {/* Thought bubbles */}
          {bubbles.map((bubble, index) => (
            <FloatingThought
              key={bubble.id}
              bubble={bubble}
              index={index}
              scrollProgress={scrollYProgress}
              isMobile={isMobile}
            />
          ))}

          {/* Central glow */}
          {!isMobile && (
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(167, 139, 250, 0.15), transparent)',
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 5, repeat: Infinity }}
            />
          )}
        </div>

        {/* Instruction */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 2.5, duration: 1 }}
          className="text-center text-white/40 text-xs sm:text-sm mt-12 sm:mt-16 italic px-4"
        >
          {isMobile ? 'Tap each thought bubble to explore my mindscape' : 'Hover over each thought bubble to explore the canvas of my mind'}
        </motion.p>
      </div>
    </section>
  )
}
