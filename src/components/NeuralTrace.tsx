'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Brain, Search, Database, CheckCircle, Terminal } from 'lucide-react'

const traceLogs = [
  { icon: Search, text: "SEARCHING_CANDIDATE_SPACE...", delay: 0 },
  { icon: Database, text: "RETRIEVING_TECHNICAL_ARCHIVES: 'VINAY_SIDDHA'...", delay: 1500 },
  { icon: Brain, text: "ANALYZING_RAG_IMPLEMENTATIONS & AGENT_WORKFLOWS...", delay: 3000 },
  { icon: Terminal, text: "EVALUATING_FULL_STACK_INTEGRATION_CAPABILITY...", delay: 4500 },
  { icon: CheckCircle, text: "FINALIZING_MATCH_SCORE: 0.998", delay: 6000 },
]

export default function NeuralTrace() {
  const [index, setIndex] = useState(0)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const intervals = traceLogs.map((log, i) => {
      return setTimeout(() => setIndex(i + 1), log.delay)
    })
    return () => intervals.forEach(clearTimeout)
  }, [])

  if (!isMounted) return null

  return (
    <section className="relative py-24 px-6 bg-[#050505]">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyber-blue/5 border border-cyber-blue/20 mb-6">
            <Brain className="w-4 h-4 text-cyber-blue animate-pulse" />
            <span className="text-[10px] font-mono tracking-[0.3em] text-white/40 uppercase">Neural Reasoning Engine</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase mb-4">
            Agentic<span className="text-cyber-blue">.</span>Selection
          </h2>
          <p className="text-white/40 text-sm font-mono max-w-lg">
            // Visualizing the internal reasoning trace of an autonomous recruitment agent.
          </p>
        </div>

        <div className="bg-[#0a0a0a] rounded-3xl border border-white/5 p-8 md:p-12 shadow-2xl relative overflow-hidden">
          {/* Scanning Effect */}
          <motion.div 
            className="absolute top-0 left-0 w-full h-px bg-cyber-blue/20"
            animate={{ y: [0, 400] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />

          <div className="space-y-6 relative z-10">
            <AnimatePresence mode="popLayout">
              {traceLogs.slice(0, index).map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-6 group"
                >
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-cyber-blue transition-colors">
                    <log.icon className={`w-5 h-5 ${i === index - 1 ? 'text-cyber-blue' : 'text-white/20'}`} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-1">Step_{i + 1}</span>
                    <span className="text-sm md:text-base font-mono text-white/80 group-hover:text-white transition-colors tracking-tight italic">
                      {`> ${log.text}`}
                    </span>
                  </div>
                  {i === index - 1 && i < traceLogs.length - 1 && (
                    <motion.div 
                      className="w-1.5 h-1.5 rounded-full bg-cyber-blue"
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {index === traceLogs.length && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6"
              >
                <div className="bg-cyber-blue/10 border border-cyber-blue/30 rounded-2xl p-6 flex items-center gap-6">
                  <div className="w-16 h-16 rounded-full border-4 border-cyber-blue border-t-transparent animate-spin flex items-center justify-center">
                    <span className="text-cyber-blue text-lg font-black italic">99</span>
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg leading-none mb-2 tracking-tight">CANDIDATE_OPTIMAL</h4>
                    <p className="text-cyber-blue text-[10px] font-mono uppercase tracking-widest">Confidence Interval: High</p>
                  </div>
                </div>
                <button 
                  onClick={() => window.location.href = '/contact'}
                  className="px-8 py-4 bg-white text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-cyber-blue hover:text-white transition-all transform hover:scale-105"
                >
                  Initiate_Handshake
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
