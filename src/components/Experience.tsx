'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Rocket, Sparkles, Target, Zap, Crown, Star, Brain, Cloud, Activity } from 'lucide-react'
import { useRef, useState } from 'react'
import experienceData from '../../data/experience.json'

interface Milestone {
  year: string
  role: string
  company: string
  description: string
  color: string
  icon: string
  pathPosition: number
  side: 'left' | 'right'
}

function HeartbeatCard({ milestone, index, inView, iconMap }: { milestone: Milestone; index: number; inView: boolean; iconMap: Record<string, any> }) {
  const [isHovered, setIsHovered] = useState(false)
  const MilestoneIcon = iconMap[milestone.icon]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: 'easeOut',
      }}
      className="flex-shrink-0 w-80 lg:w-96"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Main pulsing node */}
        <motion.div
          className="relative w-16 h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center z-10"
          style={{
            background: `radial-gradient(circle, ${milestone.color}40, transparent)`,
            border: `2px solid ${milestone.color}`,
          }}
          animate={isHovered ? {
            scale: [1, 1.15, 1],
            boxShadow: [
              `0 0 20px ${milestone.color}60`,
              `0 0 35px ${milestone.color}90`,
              `0 0 20px ${milestone.color}60`,
            ],
          } : {
            boxShadow: `0 0 15px ${milestone.color}40`,
          }}
          transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0 }}
        >
          <MilestoneIcon className="w-8 h-8 lg:w-10 lg:h-10" style={{ color: milestone.color }} />

          {/* Pulse ring on hover */}
          {isHovered && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ border: `1px solid ${milestone.color}` }}
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{
                scale: 2,
                opacity: 0,
              }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
            />
          )}
        </motion.div>

        {/* Connecting vertical line to card */}
        <motion.div
          className="w-px h-8 lg:h-12"
          style={{
            backgroundColor: `${milestone.color}50`,
          }}
          initial={{ scaleY: 0 }}
          animate={inView ? { scaleY: 1 } : {}}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
        />

        {/* Content Card */}
        <motion.div
          className="backdrop-blur-sm border rounded-xl p-5 relative overflow-hidden w-full"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            borderColor: `${milestone.color}30`,
          }}
          whileHover={{
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            borderColor: `${milestone.color}60`,
            boxShadow: `0 8px 32px ${milestone.color}20`,
            y: -5,
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Year badge */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold mb-3"
            style={{
              backgroundColor: `${milestone.color}15`,
              color: milestone.color,
            }}
          >
            {milestone.year}
          </div>

          {/* Role title */}
          <h3 className="text-lg lg:text-xl font-bold text-white mb-2 leading-tight">
            {milestone.role}
          </h3>

          {/* Company */}
          <p className="text-sm font-semibold mb-3" style={{ color: `${milestone.color}dd` }}>
            {milestone.company}
          </p>

          {/* Description */}
          <p className="text-xs lg:text-sm text-white/60 leading-relaxed">
            {milestone.description}
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.05,
  })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const lineWidth = useTransform(scrollYProgress, [0.1, 0.9], ['0%', '100%'])

  // Icon mapping
  const iconMap: Record<string, any> = {
    Crown,
    Rocket,
    Target,
    Zap,
    Sparkles,
    Star,
    Brain,
    Cloud,
  }

  // Map JSON data
  const milestonesFromJSON: Milestone[] = experienceData.timeline.map(item => ({
    year: item.year,
    role: item.role,
    company: item.company,
    description: item.description,
    color: item.color,
    icon: item.icon,
    pathPosition: item.pathPosition,
    side: item.side as 'left' | 'right'
  }))

  return (
    <section
      id="experience"
      ref={containerRef}
      className="relative py-24 lg:py-32 px-4 lg:px-6 bg-gradient-to-b from-black via-gray-900/30 to-black overflow-hidden"
    >
      {/* Subtle background grid */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Floating gradient orbs */}
      <motion.div
        className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }}
        animate={{
          x: [0, 30, 0],
          y: [0, 20, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{ background: 'radial-gradient(circle, #ec4899, transparent)' }}
        animate={{
          x: [0, -30, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="container mx-auto max-w-7xl relative z-10" ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 lg:mb-20"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm mb-6"
            style={{
              background: 'rgba(34, 211, 238, 0.1)',
              border: '1px solid rgba(34, 211, 238, 0.2)',
            }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-bold text-cyan-300 tracking-wide">CAREER TIMELINE</span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 leading-tight">
            Professional
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Journey
            </span>
          </h2>

          <p className="text-white/50 text-base lg:text-lg max-w-2xl mx-auto">
            Milestones that shaped my career path
          </p>
        </motion.div>

        {/* Horizontal Timeline Container */}
        <div className="relative">
          {/* Central horizontal line */}
          <div className="absolute top-8 lg:top-10 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
          
          {/* Animated progress line */}
          <motion.div
            className="absolute top-8 lg:top-10 left-0 h-px origin-left"
            style={{
              width: lineWidth,
              background: 'linear-gradient(90deg, #22d3ee, #8b5cf6, #ec4899)',
              boxShadow: '0 0 10px rgba(34, 211, 238, 0.5)',
            }}
          />

          {/* Scrollable timeline with snap scroll */}
          <div 
            ref={scrollContainerRef}
            className="overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar"
            style={{
              scrollBehavior: 'smooth',
            }}
          >
            <div className="flex gap-8 lg:gap-12 px-4">
              {milestonesFromJSON.map((milestone, index) => (
                <div key={index} className="snap-center">
                  <HeartbeatCard
                    milestone={milestone}
                    index={index}
                    inView={inView}
                    iconMap={iconMap}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <motion.button
              onClick={() => scrollContainerRef.current?.scrollBy({ left: -400, behavior: 'smooth' })}
              className="p-3 rounded-full backdrop-blur-sm"
              style={{
                background: 'rgba(34, 211, 238, 0.1)',
                border: '1px solid rgba(34, 211, 238, 0.2)',
              }}
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(34, 211, 238, 0.2)' }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            
            <motion.button
              onClick={() => scrollContainerRef.current?.scrollBy({ left: 400, behavior: 'smooth' })}
              className="p-3 rounded-full backdrop-blur-sm"
              style={{
                background: 'rgba(34, 211, 238, 0.1)',
                border: '1px solid rgba(34, 211, 238, 0.2)',
              }}
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(34, 211, 238, 0.2)' }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 1 }}
            className="flex justify-center mt-4"
          >
            <motion.div
              className="flex items-center gap-2 text-white/30 text-sm"
              animate={{
                x: [0, 10, 0],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span>Drag or use arrows</span>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="text-center mt-12"
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{
              backgroundColor: 'rgba(34, 211, 238, 0.1)',
              border: '1px solid rgba(34, 211, 238, 0.2)',
            }}
          >
            <motion.div
              className="w-2 h-2 rounded-full bg-cyan-400"
              animate={{
                opacity: [1, 0.5, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-xs font-medium text-cyan-300">Timeline Active</span>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}
