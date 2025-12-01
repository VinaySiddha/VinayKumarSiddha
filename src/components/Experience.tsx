'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Rocket, Sparkles, Target, Zap, Crown, Star } from 'lucide-react'
import { useRef, useState } from 'react'

interface Milestone {
  year: string
  role: string
  company: string
  description: string
  color: string
  icon: any
  pathPosition: number // Position along the curved path (0-100%)
  side: 'left' | 'right'
}

function MilestoneNode({ milestone, index, inView }: { milestone: Milestone; index: number; inView: boolean }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        type: 'spring',
        stiffness: 200,
      }}
      className="absolute"
      style={{
        left: milestone.side === 'left' ? '35%' : '65%',
        top: `${milestone.pathPosition}%`,
        transform: 'translate(-50%, -50%)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Connecting ribbon to center path */}
      <motion.div
        className="absolute top-1/2 h-0.5 origin-left"
        style={{
          width: '120px',
          left: milestone.side === 'left' ? '100%' : 'auto',
          right: milestone.side === 'right' ? '100%' : 'auto',
          background: `linear-gradient(${milestone.side === 'left' ? '90deg' : '-90deg'}, ${milestone.color}, transparent)`,
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={inView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: index * 0.15 + 0.3 }}
      />

      {/* Pulsing node */}
      <motion.div
        className="relative w-20 h-20 rounded-full flex items-center justify-center cursor-pointer group"
        style={{
          background: `radial-gradient(circle, ${milestone.color}40, ${milestone.color}10)`,
          border: `3px solid ${milestone.color}`,
          boxShadow: `0 0 30px ${milestone.color}50, inset 0 0 20px ${milestone.color}20`,
        }}
        whileHover={{
          scale: 1.2,
          boxShadow: `0 0 50px ${milestone.color}80, inset 0 0 30px ${milestone.color}40`,
        }}
        animate={{
          boxShadow: [
            `0 0 30px ${milestone.color}50, inset 0 0 20px ${milestone.color}20`,
            `0 0 50px ${milestone.color}80, inset 0 0 30px ${milestone.color}40`,
            `0 0 30px ${milestone.color}50, inset 0 0 20px ${milestone.color}20`,
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, delay: index * 0.3 }}
      >
        <milestone.icon className="w-10 h-10 z-10" style={{ color: milestone.color }} />

        {/* Expanding pulse rings */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: `2px solid ${milestone.color}` }}
          animate={{
            scale: [1, 1.8, 1.8],
            opacity: [0.8, 0, 0],
          }}
          transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
        />
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: `2px solid ${milestone.color}` }}
          animate={{
            scale: [1, 1.8, 1.8],
            opacity: [0.8, 0, 0],
          }}
          transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 + 0.7 }}
        />
      </motion.div>

      {/* Info card that appears on hover */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 w-80 p-6 rounded-2xl backdrop-blur-xl border z-50"
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0.9,
          x: isHovered ? 0 : (milestone.side === 'left' ? 20 : -20),
        }}
        transition={{ duration: 0.3 }}
        style={{
          left: milestone.side === 'left' ? '-360px' : 'auto',
          right: milestone.side === 'right' ? '-360px' : 'auto',
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          borderColor: `${milestone.color}80`,
          boxShadow: `0 20px 60px ${milestone.color}50, inset 0 0 30px ${milestone.color}10`,
          pointerEvents: 'none',
        }}
      >
        {/* Year badge */}
        <div
          className="inline-block px-3 py-1 rounded-full text-xs font-black mb-3 tracking-wider"
          style={{
            backgroundColor: `${milestone.color}20`,
            color: milestone.color,
            border: `2px solid ${milestone.color}60`,
          }}
        >
          {milestone.year}
        </div>

        {/* Role title */}
        <h3 className="text-xl font-black text-white mb-1 leading-tight">
          {milestone.role}
        </h3>

        {/* Company */}
        <p className="text-base font-bold mb-3" style={{ color: milestone.color }}>
          {milestone.company}
        </p>

        {/* Description */}
        <p className="text-sm text-white/70 leading-relaxed">
          {milestone.description}
        </p>

        {/* Decorative corner accent */}
        <div
          className="absolute top-2 right-2 w-8 h-8 rounded-full opacity-40"
          style={{
            background: `radial-gradient(circle, ${milestone.color}, transparent)`,
          }}
        />
      </motion.div>
    </motion.div>
  )
}

export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const pathProgress = useTransform(scrollYProgress, [0, 1], [0, 100])

  const milestones: Milestone[] = [
    {
      year: '2024',
      role: 'Senior AI Engineer',
      company: 'Tech Innovation Labs',
      description: 'Leading production RAG systems and multi-agent AI architectures for enterprise solutions.',
      color: '#a78bfa',
      icon: Crown,
      pathPosition: 10,
      side: 'left',
    },
    {
      year: '2023',
      role: 'ML Engineer',
      company: 'DataCorp Solutions',
      description: 'Built fine-tuned LLMs with custom training pipelines serving millions of requests.',
      color: '#c084fc',
      icon: Rocket,
      pathPosition: 25,
      side: 'right',
    },
    {
      year: '2022',
      role: 'Full Stack Developer',
      company: 'WebTech Studios',
      description: 'Developed scalable web apps with Django, React, and PostgreSQL.',
      color: '#f472b6',
      icon: Target,
      pathPosition: 42,
      side: 'left',
    },
    {
      year: '2021',
      role: 'Backend Developer',
      company: 'CloudSoft Inc',
      description: 'Created microservices architecture with Node.js and MongoDB.',
      color: '#fb923c',
      icon: Zap,
      pathPosition: 60,
      side: 'right',
    },
    {
      year: '2020',
      role: 'Junior Developer',
      company: 'StartupHub',
      description: 'Built RESTful APIs and database schemas for startup products.',
      color: '#fbbf24',
      icon: Sparkles,
      pathPosition: 78,
      side: 'left',
    },
    {
      year: '2019',
      role: 'Software Intern',
      company: 'TechCorp',
      description: 'Contributed to automation tools and learned industry best practices.',
      color: '#34d399',
      icon: Star,
      pathPosition: 92,
      side: 'right',
    },
  ]

  return (
    <section
      id="experience"
      ref={containerRef}
      className="relative py-40 px-6 bg-black overflow-hidden"
    >
      {/* Animated mesh gradient background */}
      <div className="absolute inset-0 opacity-30">
        <motion.div
          className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(167, 139, 250, 0.4), transparent)',
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(244, 114, 182, 0.4), transparent)',
          }}
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{ duration: 18, repeat: Infinity }}
        />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10" ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-32"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-500/40 backdrop-blur-xl mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="text-base font-black text-purple-300 tracking-wide">JOURNEY MAP</span>
          </motion.div>

          <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            Career
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Orbital Path
            </span>
          </h2>

          <p className="text-white/70 text-xl max-w-2xl mx-auto font-light">
            Navigate through the milestones that shaped my professional journey
          </p>
        </motion.div>

        {/* Orbital timeline container */}
        <div className="relative h-[1400px] lg:h-[1200px]">
          {/* Central curved path - SVG S-curve */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.8" />
                <stop offset="25%" stopColor="#c084fc" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#f472b6" stopOpacity="0.8" />
                <stop offset="75%" stopColor="#fb923c" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#34d399" stopOpacity="0.8" />
              </linearGradient>

              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Main flowing S-curve path */}
            <motion.path
              d="M 50,5 Q 25,20 30,35 T 50,50 Q 75,65 70,80 T 50,95"
              fill="none"
              stroke="url(#pathGradient)"
              strokeWidth="0.3"
              strokeLinecap="round"
              filter="url(#glow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={inView ? { pathLength: 1, opacity: 1 } : {}}
              transition={{ duration: 2, ease: 'easeInOut' }}
            />

            {/* Secondary glow path */}
            <motion.path
              d="M 50,5 Q 25,20 30,35 T 50,50 Q 75,65 70,80 T 50,95"
              fill="none"
              stroke="white"
              strokeWidth="0.15"
              strokeLinecap="round"
              opacity="0.5"
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : {}}
              transition={{ duration: 2, ease: 'easeInOut', delay: 0.2 }}
            />

            {/* Animated progress indicator */}
            <motion.circle
              r="1"
              fill="white"
              style={{
                offsetPath: 'path("M 50,5 Q 25,20 30,35 T 50,50 Q 75,65 70,80 T 50,95")',
                offsetDistance: useTransform(pathProgress, [0, 100], ['0%', '100%']),
              }}
            >
              <animate
                attributeName="opacity"
                values="0.3;1;0.3"
                dur="2s"
                repeatCount="indefinite"
              />
            </motion.circle>
          </svg>

          {/* Milestone nodes positioned along the path */}
          {milestones.map((milestone, index) => (
            <MilestoneNode
              key={index}
              milestone={milestone}
              index={index}
              inView={inView}
            />
          ))}

          {/* Floating particles along the path */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white/40"
              style={{
                left: '50%',
                top: `${(i / 12) * 100}%`,
              }}
              animate={{
                x: [0, Math.sin(i) * 30, 0],
                opacity: [0.2, 0.6, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="text-center mt-20"
        >
          <p className="text-white/50 text-sm font-light italic">
            Hover over nodes to explore each milestone
          </p>
        </motion.div>
      </div>
    </section>
  )
}
