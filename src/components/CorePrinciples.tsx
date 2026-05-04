'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Zap, Shield, Target, Rocket, Sparkles } from 'lucide-react'

const principles = [
  {
    title: 'Precision AI',
    description: 'Engineering intelligent systems with a focus on accuracy, scalability, and robust retrieval-augmented generation.',
    icon: Target,
    color: 'cyber-blue',
  },
  {
    title: 'Future-Proof',
    description: 'Building with modular architectures and multi-agent workflows that adapt to the evolving AI landscape.',
    icon: Rocket,
    color: 'cyber-purple',
  },
  {
    title: 'Security First',
    description: 'Ensuring data integrity and privacy at every layer of the intelligence pipeline.',
    icon: Shield,
    color: 'cyber-pink',
  },
  {
    title: 'High Velocity',
    description: 'Rapid prototyping and deployment of complex full-stack solutions without compromising on quality.',
    icon: Zap,
    color: 'cyber-cyan',
  },
]

export default function CorePrinciples() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section className="relative py-24 px-6 overflow-hidden bg-black/50">
      <div className="container mx-auto max-w-7xl relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyber-blue/10 border border-cyber-blue/30 backdrop-blur-sm mb-6">
            <Sparkles className="w-4 h-4 text-cyber-blue" />
            <span className="text-sm font-medium text-cyber-blue">Philosophy</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Core
            <br />
            <span className="bg-gradient-to-r from-cyber-blue via-cyber-purple to-cyber-cyan bg-clip-text text-transparent">
              Principles
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {principles.map((principle, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="relative p-8 rounded-3xl cyber-glass border border-white/10 hover:border-cyber-blue/50 transition-all duration-300 group"
            >
              <div className={`w-14 h-14 rounded-2xl bg-${principle.color}/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <principle.icon className={`w-7 h-7 text-${principle.color}`} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{principle.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                {principle.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
