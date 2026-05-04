'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Layers, Database, Shield, Zap } from 'lucide-react'

const stackItems = [
  { id: 'S1', title: 'EXECUTION_CONTEXT', addr: '0x7FFF01' },
  { id: 'S2', title: 'RAG_THREAD_POOL', addr: '0x7FFF0A' },
  { id: 'S3', title: 'AGENT_PROCESSOR', addr: '0x7FFF1F' },
]

const heapItems = [
  { id: 'H1', title: 'VECTOR_STORE', size: '2.4GB' },
  { id: 'H2', title: 'LLM_WEIGHTS', size: '8.1GB' },
  { id: 'H3', title: 'USER_SESSION', size: 'DYNAMIC' },
]

export default function RuntimeArchitecture() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section className="relative py-32 px-6 bg-black overflow-hidden" ref={ref}>
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="flex flex-col items-center text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
          >
            <span className="text-[10px] font-mono tracking-[0.3em] text-white/40 uppercase">Virtual Machine Topology</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 40, filter: 'blur(20px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase"
          >
            RUNTIME<span className="text-cyber-blue">.</span>MEMORY
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Stack Visualization */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <Layers className="text-cyber-blue w-5 h-5" />
                <h3 className="text-lg font-bold text-white tracking-widest uppercase font-mono">Thread Stack</h3>
              </div>
              <span className="text-[9px] font-mono text-white/20 uppercase">LIFO_ORDER</span>
            </div>
            <div className="space-y-2 flex flex-col-reverse">
              {stackItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
                  whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-[#0a0a0a] border border-white/5 p-5 rounded-lg flex items-center justify-between group hover:border-cyber-blue transition-colors"
                >
                  <div className="flex items-center gap-6">
                    <span className="text-[10px] font-mono text-white/20">{item.addr}</span>
                    <h4 className="text-white font-bold font-mono text-xs tracking-tighter">{item.title}</h4>
                  </div>
                  <div className="w-1 h-4 bg-cyber-blue/30 rounded-full" />
                </motion.div>
              ))}
              <div className="h-8 border border-dashed border-white/10 rounded-lg flex items-center justify-center opacity-30">
                <span className="text-[8px] font-mono text-white uppercase tracking-widest">Stack_Bottom</span>
              </div>
            </div>
          </div>

          {/* Heap Visualization */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <Database className="text-cyber-purple w-5 h-5" />
                <h3 className="text-lg font-bold text-white tracking-widest uppercase font-mono">Global Heap</h3>
              </div>
              <span className="text-[9px] font-mono text-white/20 uppercase">DYN_ALLOC</span>
            </div>
            <div className="grid grid-cols-2 gap-2 h-full min-h-[250px]">
              {heapItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                  whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className={`
                    bg-[#0a0a0a] border border-white/5 p-5 rounded-xl flex flex-col justify-between group hover:border-cyber-purple transition-colors
                    ${index === 1 ? 'row-span-2' : ''}
                  `}
                >
                  <div>
                    <h4 className="text-white font-bold font-mono text-[11px] tracking-tight">{item.title}</h4>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-[8px] font-mono text-white/30">{item.size}</span>
                    <div className="w-1.5 h-1.5 rounded-sm bg-cyber-purple/20 group-hover:bg-cyber-purple/60 transition-colors" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* System Summary */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#050505] border border-white/5 rounded-2xl p-6 flex items-center gap-6 hover:border-cyber-pink/30 transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-cyber-pink/10 border border-cyber-pink/20 flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6 text-cyber-pink" />
            </div>
            <div>
              <h4 className="text-white font-bold font-mono text-sm uppercase tracking-wider">Security Sandbox</h4>
              <p className="text-white/40 text-[10px] mt-1 font-mono uppercase italic">Isolated execution environment active.</p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ delay: 0.9, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#050505] border border-white/5 rounded-2xl p-6 flex items-center gap-6 hover:border-cyber-cyan/30 transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/20 flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6 text-cyber-cyan" />
            </div>
            <div>
              <h4 className="text-white font-bold font-mono text-sm uppercase tracking-wider">JIT Optimization</h4>
              <p className="text-white/40 text-[10px] mt-1 font-mono uppercase italic">Continuous performance tuning enabled.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
