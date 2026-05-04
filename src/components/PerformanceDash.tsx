'use client'

import { motion } from 'framer-motion'
import { Activity, Zap, Cpu, BarChart3, ShieldCheck } from 'lucide-react'

const metrics = [
  {
    label: 'RAG_LATENCY',
    value: '< 180ms',
    description: 'Average response time for vector retrieval and grounded generation.',
    icon: Zap,
    color: 'text-cyber-blue',
    bg: 'bg-cyber-blue/10',
    border: 'border-cyber-blue/20'
  },
  {
    label: 'TOKEN_EFFICIENCY',
    value: '94%',
    description: 'Optimization rate through advanced prompt engineering and context pruning.',
    icon: Cpu,
    color: 'text-cyber-purple',
    bg: 'bg-cyber-purple/10',
    border: 'border-cyber-purple/20'
  },
  {
    label: 'AGENT_SUCCESS',
    value: '98.2%',
    description: 'Rate of successful autonomous task completion across complex workflows.',
    icon: ShieldCheck,
    color: 'text-cyber-cyan',
    bg: 'bg-cyber-cyan/10',
    border: 'border-cyber-cyan/20'
  },
  {
    label: 'SEMANTIC_PRECISION',
    value: '0.89',
    description: 'Correlation score for retrieval relevance and factual groundedness.',
    icon: Activity,
    color: 'text-cyber-pink',
    bg: 'bg-cyber-pink/10',
    border: 'border-cyber-pink/20'
  }
]

export default function PerformanceDash() {
  return (
    <section className="relative py-24 px-6 bg-[#050505] overflow-hidden">
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyber-pink/5 border border-cyber-pink/20 mb-6">
            <BarChart3 className="w-4 h-4 text-cyber-pink" />
            <span className="text-[10px] font-mono tracking-[0.3em] text-white/40 uppercase">Production Telemetry</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase mb-4 leading-none">
            System<span className="text-cyber-pink">.</span>Performance
          </h2>
          <p className="text-white/40 text-sm font-mono max-w-lg">
            // High-fidelity performance metrics from live AI-driven deployments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`p-8 rounded-3xl bg-[#0a0a0a] border ${metric.border} hover:border-white/20 transition-all duration-500 group`}
            >
              <div className={`w-12 h-12 rounded-xl ${metric.bg} flex items-center justify-center mb-6`}>
                <metric.icon className={`w-6 h-6 ${metric.color}`} />
              </div>
              
              <div className="mb-4">
                <span className="text-[9px] font-mono text-white/20 uppercase tracking-[0.2em] block mb-2">{metric.label}</span>
                <h3 className={`text-4xl font-black ${metric.color} tracking-tighter`}>{metric.value}</h3>
              </div>
              
              <p className="text-white/40 text-[10px] font-mono leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {`> ${metric.description}`}
              </p>

              {/* Decorative mini grid */}
              <div className="mt-8 flex gap-1 h-1">
                {[...Array(8)].map((_, j) => (
                  <div key={j} className={`flex-1 ${j < (i + 3) ? metric.bg : 'bg-white/5'} rounded-full`} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Real-time pulse line */}
        <div className="mt-16 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent relative">
          <motion.div 
            className="absolute top-0 left-0 w-32 h-px bg-cyber-blue shadow-[0_0_15px_#3AA6FF]"
            animate={{ left: ['0%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>
    </section>
  )
}
