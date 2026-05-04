'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useState, useEffect } from 'react'
import { Download, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

export default function About() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [counters, setCounters] = useState({ projects: 0, experience: 0 })

  useEffect(() => {
    if (inView) {
      const targets = { projects: 10, experience: 1 }
      const duration = 2000
      const steps = 60

      let step = 0
      const interval = setInterval(() => {
        step++
        const progress = step / steps
        setCounters({
          projects: Math.floor(targets.projects * progress),
          experience: Math.floor(targets.experience * progress),
        })
        if (step >= steps) clearInterval(interval)
      }, duration / steps)

      return () => clearInterval(interval)
    }
  }, [inView])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 40, filter: 'blur(15px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    },
  }

  return (
    <section id="about" className="relative py-16 px-6 bg-[#050505] overflow-hidden" ref={ref}>
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col items-start mb-12 border-l-2 border-cyber-blue pl-6">
          <motion.div
            initial={{ opacity: 0, x: -10, filter: 'blur(5px)' }}
            whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8 }}
            className="text-[10px] font-mono tracking-[0.3em] text-cyber-blue uppercase mb-2"
          >
            System_Module: //IDENTITY_CORE
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 40, filter: 'blur(20px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="text-4xl md:text-6xl font-black text-white tracking-tighter"
          >
            ENGINEERING<span className="text-cyber-blue">.</span>
          </motion.h2>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 h-auto md:h-[450px]"
        >
          {/* Main Bio */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-2xl bg-[#0a0a0a] border border-white/5 group p-8 flex flex-col justify-between"
          >
            <div className="relative z-10">
              <h3 className="text-2xl md:text-4xl font-bold text-white mb-4 leading-tight tracking-tight">
                Processing complex AI challenges into <span className="text-white/40">scalable system solutions.</span>
              </h3>
              <p className="text-white/60 text-sm md:text-base max-w-lg leading-relaxed mb-6 font-mono opacity-80">
                // EXECUTION_LOG: Specialized in RAG architectures, LLM fine-tuning, and multi-agent coordination. Focusing on low-latency, high-precision intelligence frameworks.
              </p>
            </div>

            <div className="flex gap-4 relative z-10">
              <Link href="/contact">
                <div className="px-5 py-2.5 bg-cyber-blue text-black font-bold rounded-lg hover:bg-cyber-blue/90 transition-colors cursor-pointer flex items-center gap-2 text-[10px] uppercase tracking-widest">
                  Initialize_Link
                  <ArrowUpRight className="w-3 h-3" />
                </div>
              </Link>
              <a href="https://drive.google.com/file/d/1ZRv8l9RlO91aXLi-MEcsI0FU95T5iYjg/view?usp=sharing" target="_blank" rel="noopener noreferrer">
                <div className="px-5 py-2.5 border border-white/10 text-white font-bold rounded-lg hover:bg-white/5 transition-colors cursor-pointer flex items-center gap-2 text-[10px] uppercase tracking-widest">
                  Export_Specs
                  <Download className="w-3 h-3" />
                </div>
              </a>
            </div>
          </motion.div>

          {/* Stats Bento 1 */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-1 md:row-span-1 relative overflow-hidden rounded-2xl bg-white/5 border border-white/5 group p-6 flex flex-col justify-center items-center text-center"
          >
            <span className="text-4xl font-black text-white mb-2">{counters.projects}+</span>
            <span className="text-[9px] uppercase tracking-widest text-white/40 font-mono">Modules_Shipped</span>
          </motion.div>

          {/* Stats Bento 2 */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-1 md:row-span-1 relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyber-blue/10 to-transparent border border-white/5 group p-6 flex flex-col justify-center items-center text-center"
          >
            <span className="text-4xl font-black text-cyber-blue mb-2">{counters.experience}</span>
            <span className="text-[9px] uppercase tracking-widest text-white/40 font-mono">Uptime_Years</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
