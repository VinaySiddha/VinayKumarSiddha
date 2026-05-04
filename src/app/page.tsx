'use client'

import { motion } from 'framer-motion'
import Broadcast from '@/components/Broadcast'
import SpringDesign from '@/components/SpringDesign'
import VisualBrand from '@/components/VisualBrand'
import PremiumBento from '@/components/PremiumBento'
import FeaturedProjects from '@/components/FeaturedProjects'
import aboutData from '../../data/about.json'

export default function Home() {
  const { greeting, name } = aboutData

  return (
    <main className="bg-black">
      {/* Entry Greeting Section */}
      <section className="relative h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Spring Design Background */}
        <SpringDesign />

        <div className="z-10 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-cyber-blue font-mono text-sm tracking-[0.4em] uppercase mb-4"
          >
            {greeting}
          </motion.p>
          
          <motion.h1
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-12"
          >
            {name.toUpperCase()}<span className="text-cyber-blue">.</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="flex flex-col items-center"
          >
            <span className="text-white/20 text-[10px] font-mono uppercase tracking-[0.3em] mb-4">Experience the Future</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-px h-12 bg-gradient-to-b from-cyber-blue to-transparent"
            />
          </motion.div>
        </div>

        {/* Subtle Background Detail */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5" />
        </div>
      </section>

      {/* Product-Style Narrative */}
      <VisualBrand />
      <PremiumBento />
      <FeaturedProjects />
      <Broadcast />
    </main>
  )
}
