'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Brain, Code2, Database, Cloud, GitBranch, Cpu, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import skillsData from '../../data/skills.json'

const iconMap: Record<string, any> = {
  Brain, Code2, Database, Cloud, Cpu, GitBranch
}

export default function QuickSkills() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      <div className="container mx-auto max-w-7xl relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyber-purple/10 border border-cyber-purple/30 backdrop-blur-sm mb-6">
            <Sparkles className="w-4 h-4 text-cyber-purple" />
            <span className="text-sm font-medium text-cyber-purple">Expertise</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Technical
            <br />
            <span className="bg-gradient-to-r from-cyber-purple via-cyber-pink to-cyber-blue bg-clip-text text-transparent">
              Capabilities
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillsData.categories.map((category, index) => {
            const Icon = iconMap[category.icon]
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative cyber-glass-heavy p-8 rounded-3xl border border-white/10 hover:border-cyber-purple/50 transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl bg-${category.color}/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-7 h-7 text-${category.color}`} />
                </div>
                <h3 className={`text-xl font-bold text-white mb-4`}>
                  {category.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.skills.slice(0, 3).map((skill, i) => (
                    <span key={i} className="text-xs text-white/50 bg-white/5 px-2 py-1 rounded-md">
                      {skill.name}
                    </span>
                  ))}
                  <span className="text-xs text-cyber-purple">+{category.skills.length - 3} more</span>
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <Link href="/skills">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 text-white font-bold hover:text-cyber-purple transition-colors cursor-pointer group"
            >
              <span>Explore full tech stack</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
