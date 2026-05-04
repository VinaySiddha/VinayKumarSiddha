'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  Brain, Zap, Shield, Target, Rocket, Sparkles, 
  Cpu, Database, Cloud, Code2, Globe, Lock
} from 'lucide-react'
import projectsData from '../../data/projects.json'

export default function ProductBento() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  const projectsCount = projectsData.projects.length

  return (
    <section className="relative py-16 px-6 bg-[#050505]" ref={ref}>
      <div className="container mx-auto max-w-6xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-3 h-auto md:h-[650px]"
        >
          {/* Main Feature: The Brain */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-2xl bg-[#0a0a0a] border border-white/5 group p-8 flex flex-col justify-between"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-cyber-blue/10 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-cyber-blue" />
                </div>
                <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.2em]">Proc: //NEURAL_CORE</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight tracking-tight">
                Production-Grade
                <br />
                <span className="text-cyber-blue">Intelligence Mesh</span>
              </h3>
              <p className="text-white/40 text-sm max-w-sm font-mono leading-relaxed">
                // Scalable RAG pipelines & multi-agent mesh integration for autonomous task execution.
              </p>
            </div>
            
            {/* Abstract Visual */}
            <div className="absolute bottom-0 right-0 w-full h-1/2 opacity-10 pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(58,166,255,0.3),transparent_70%)]" />
              <div className="absolute bottom-8 right-8 w-20 h-20 border border-cyber-blue/20 rounded-full animate-pulse" />
            </div>
          </motion.div>

          {/* Speed / Performance */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-2 md:row-span-1 relative overflow-hidden rounded-2xl bg-[#0a0a0a] border border-white/5 group p-6 flex items-center gap-6"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Perf: //LATENCY_VAL</span>
              </div>
              <h4 className="text-lg font-bold text-white mb-0.5 font-mono tracking-tight uppercase">High Velocity</h4>
              <p className="text-white/40 text-[10px] font-mono">Real-time inference & rapid deployment.</p>
            </div>
            <div className="relative w-12 h-12 flex items-center justify-center">
              <Zap className="w-6 h-6 text-cyber-cyan absolute z-10 opacity-60" />
              <motion.div 
                className="absolute inset-0 border border-cyber-cyan/10 rounded-lg"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>

          {/* Tech Stack Specs */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-1 md:row-span-1 relative overflow-hidden rounded-2xl bg-[#0a0a0a] border border-white/5 group p-6 flex flex-col justify-center items-center text-center"
          >
            <Cpu className="w-5 h-5 text-cyber-pink mb-3 opacity-60" />
            <span className="text-2xl font-black text-white font-mono">{projectsCount}+</span>
            <span className="text-[8px] uppercase tracking-widest text-white/20 font-mono mt-1">Modules_Linked</span>
          </motion.div>

          {/* Security */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-1 md:row-span-1 relative overflow-hidden rounded-2xl bg-[#0a0a0a] border border-white/5 group p-6 flex flex-col justify-center items-center text-center"
          >
            <Lock className="w-5 h-5 text-cyber-cyan mb-3 opacity-60" />
            <span className="text-base font-bold text-white font-mono">AES_256</span>
            <span className="text-[8px] uppercase tracking-widest text-white/20 font-mono mt-1">Sec_Standard</span>
          </motion.div>

          {/* Infrastructure */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-2 md:row-span-1 relative overflow-hidden rounded-2xl bg-[#0a0a0a] border border-white/5 group p-6 flex items-center justify-between"
          >
            <div>
              <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest block mb-1">Infr: //GLOBAL_SCALE</span>
              <h4 className="text-base font-bold text-white mb-0.5 font-mono uppercase tracking-tight">Cloud Native</h4>
            </div>
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                <Cloud className="w-4 h-4 text-white/40" />
              </div>
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                <Globe className="w-4 h-4 text-white/40" />
              </div>
            </div>
          </motion.div>

          {/* The "Call to Action" Bento */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-2 md:row-span-1 relative overflow-hidden rounded-2xl bg-cyber-blue group p-1 flex items-center justify-center"
          >
            <div className="relative z-10 flex flex-col items-center">
              <h3 className="text-lg font-black text-black mb-2 tracking-tighter italic">READY_FOR_DEPLOYMENT</h3>
              <div className="px-4 py-1.5 bg-black text-white rounded-lg text-[9px] font-bold tracking-[0.2em] hover:scale-105 transition-transform cursor-pointer uppercase">
                Initialize_Sys_Check
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
