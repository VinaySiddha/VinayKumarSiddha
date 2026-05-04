'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaPython, FaReact, FaNodeJs, FaDocker, FaAws, FaGitAlt, FaJava } from 'react-icons/fa'
import { SiTypescript, SiNextdotjs, SiDjango, SiFastapi, SiMongodb, SiPostgresql, SiOpenai, SiKubernetes, SiTensorflow, SiPytorch, SiTailwindcss, SiRedis, SiFirebase, SiJavascript } from 'react-icons/si'
import { Database, Brain, Code2, Cloud, GitBranch, Cpu } from 'lucide-react'
import skillsData from '../../data/skills.json'

const iconMap: Record<string, any> = {
  Brain, Code2, Database, Cloud, Cpu, GitBranch,
  FaPython, FaReact, FaNodeJs, FaDocker, FaAws, FaGitAlt, FaJava,
  SiTypescript, SiNextdotjs, SiDjango, SiFastapi, SiMongodb, SiPostgresql,
  SiOpenai, SiKubernetes, SiTensorflow, SiPytorch, SiTailwindcss, SiRedis,
  SiFirebase, SiJavascript,
}

export default function Skills() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section id="skills" className="relative py-16 px-6 bg-[#050505] overflow-hidden" ref={ref}>
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col items-start mb-12 border-l-2 border-cyber-cyan pl-6">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[10px] font-mono tracking-[0.3em] text-cyber-cyan uppercase mb-2"
          >
            System_Hardware: //CORE_STACK
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 40, filter: 'blur(20px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="text-4xl md:text-6xl font-black text-white tracking-tighter"
          >
            THE STACK<span className="text-cyber-cyan">.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skillsData.categories.map((category, index) => {
            const CategoryIcon = iconMap[category.icon]
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, filter: 'blur(15px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
                className="group relative bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 hover:bg-[#111] hover:border-cyber-cyan/30 transition-all duration-500 flex flex-col"
              >
                <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                  <div className="flex items-center gap-3">
                    <CategoryIcon className="w-5 h-5 text-cyber-cyan opacity-80" />
                    <h3 className="text-lg font-bold text-white tracking-tight uppercase font-mono">{category.category}</h3>
                  </div>
                  <span className="text-[9px] font-mono text-white/20 tracking-tighter">MOD_0{index + 1}</span>
                </div>

                <div className="flex-grow space-y-4">
                  {category.skills.map((skill, skillIndex) => {
                    const SkillIcon = iconMap[skill.icon]
                    return (
                      <div
                        key={skillIndex}
                        className="flex items-center justify-between group/item"
                      >
                        <div className="flex items-center gap-3">
                          <SkillIcon className="w-4 h-4 text-white/20 group-hover/item:text-white transition-colors" />
                          <span className="text-xs font-medium text-white/40 group-hover/item:text-white/80 transition-colors font-mono tracking-tight">
                            {skill.name}
                          </span>
                        </div>
                        <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0, filter: 'blur(2px)' }}
                            whileInView={{ width: '100%', filter: 'blur(0px)' }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, delay: 0.5 + skillIndex * 0.05, ease: [0.16, 1, 0.3, 1] }}
                            className="h-full bg-cyber-cyan/40"
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="text-center mt-24"
        >
          <p className="text-white/20 text-xs font-mono uppercase tracking-[0.3em]">
            Continuously integrating new modules.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
