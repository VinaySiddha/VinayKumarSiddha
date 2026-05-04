'use client'

import { motion } from 'framer-motion'
import { Brain, Zap, Globe, MousePointer2, Smartphone, Layout } from 'lucide-react'

const features = [
  {
    title: 'Intelligent Systems',
    desc: 'Crafting AI-driven applications that think and adapt.',
    icon: Brain,
    size: 'md:col-span-2 md:row-span-2',
    color: 'text-cyber-blue',
    bg: 'bg-cyber-blue/5'
  },
  {
    title: 'High Performance',
    desc: 'Optimized for speed and global scalability.',
    icon: Zap,
    size: 'md:col-span-2 md:row-span-1',
    color: 'text-cyber-cyan',
    bg: 'bg-cyber-cyan/5'
  },
  {
    title: 'Modern UI/UX',
    desc: 'Visually stunning, accessible interfaces.',
    icon: Layout,
    size: 'md:col-span-1 md:row-span-1',
    color: 'text-cyber-pink',
    bg: 'bg-cyber-pink/5'
  },
  {
    title: 'Mobile First',
    desc: 'Seamless across every device screen.',
    icon: Smartphone,
    size: 'md:col-span-1 md:row-span-1',
    color: 'text-cyber-purple',
    bg: 'bg-cyber-purple/5'
  }
]

export default function PremiumBento() {
  return (
    <section className="relative py-24 px-6 bg-black">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[600px]">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className={`
                ${f.size} group relative overflow-hidden rounded-[2rem] border border-white/5 bg-[#050505] p-8 md:p-12
                hover:border-white/20 transition-all duration-500 flex flex-col justify-between
              `}
            >
              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-2xl ${f.bg} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  <f.icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{f.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed max-w-[200px]">{f.desc}</p>
              </div>

              {/* Decorative Background Elements */}
              <div className="absolute top-0 right-0 w-full h-full opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none">
                <div className={`absolute -top-12 -right-12 w-64 h-64 ${f.bg} blur-3xl rounded-full`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
