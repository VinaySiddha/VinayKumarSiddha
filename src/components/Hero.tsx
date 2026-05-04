'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ArrowDown } from 'lucide-react'
import aboutData from '../../data/about.json'
import HeroHUD from './HeroHUD'

export default function Hero() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const { name, title, description, highlights } = aboutData

  if (!isMounted) return null

  return (
    <section className="relative h-screen flex flex-col items-center justify-center px-6 overflow-hidden bg-black">
      {/* Background HUD Elements */}
      <HeroHUD />

      <div className="container mx-auto max-w-5xl z-10 flex flex-col items-center text-center">
        
        {/* Subtle Reveal Tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/40 text-[10px] font-bold uppercase tracking-[0.4em] mb-10 flex gap-4"
        >
          {highlights.map((highlight, index) => (
            <span key={index} className="flex items-center gap-4">
              {highlight}
              {index < highlights.length - 1 && <span className="w-1 h-1 rounded-full bg-white/10" />}
            </span>
          ))}
        </motion.div>

        {/* Massive Name - Abstract Tech Style */}
        <motion.h1
          initial={{ opacity: 0, y: 40, filter: 'blur(20px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-7xl md:text-[10rem] font-black text-white tracking-tighter leading-none mb-8"
        >
          {name.toUpperCase()}<span className="text-cyber-blue">.</span>
        </motion.h1>

        {/* Sub headline */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: 'blur(15px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: 0.6, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-8 tracking-tight">
            {title}
          </h2>
          <p className="max-w-2xl text-white/40 text-base md:text-xl font-light leading-relaxed mb-12">
            {description}
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ delay: 1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex gap-6"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-cyber-blue animate-pulse" />
          <div className="w-1.5 h-1.5 rounded-full bg-cyber-purple animate-pulse delay-75" />
          <div className="w-1.5 h-1.5 rounded-full bg-cyber-pink animate-pulse delay-150" />
        </motion.div>
      </div>

      {/* Abstract Background - Minimal Lines */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent" />
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>
      
      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowDown size={20} strokeWidth={1} />
        </motion.div>
      </motion.div>
    </section>
  )
}




