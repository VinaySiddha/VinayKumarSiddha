'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaPython, FaReact, FaNodeJs, FaDocker, FaAws, FaGitAlt, FaJava } from 'react-icons/fa'
import { SiTypescript, SiNextdotjs, SiDjango, SiFastapi, SiMongodb, SiPostgresql, SiOpenai, SiKubernetes, SiTensorflow, SiPytorch, SiTailwindcss, SiRedis, SiFirebase, SiJavascript } from 'react-icons/si'
import { Database, Brain, Code2, Cloud, GitBranch, Cpu } from 'lucide-react'
import skillsData from '../../data/skills.json'

export default function Skills() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  // Icon mapping - maps string names to React components
  const iconMap: Record<string, any> = {
    Brain,
    Code2,
    Database,
    Cloud,
    Cpu,
    GitBranch,
    FaPython,
    FaReact,
    FaNodeJs,
    FaDocker,
    FaAws,
    FaGitAlt,
    FaJava,
    SiTypescript,
    SiNextdotjs,
    SiDjango,
    SiFastapi,
    SiMongodb,
    SiPostgresql,
    SiOpenai,
    SiKubernetes,
    SiTensorflow,
    SiPytorch,
    SiTailwindcss,
    SiRedis,
    SiFirebase,
    SiJavascript,
  }

  const { categories } = skillsData

  return (
    <section id="skills" className="relative py-20 sm:py-28 lg:py-32 px-4 sm:px-6 overflow-hidden cyber-grid">
      {/* HUD background lines */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyber-blue to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyber-purple to-transparent" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="font-black text-white mb-4 sm:mb-6 leading-tight text-4xl sm:text-5xl md:text-7xl">
            Tech
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Arsenal
            </span>
          </h2>
          <p className="text-white/60 text-base sm:text-lg">
            Technologies I work with to build exceptional products
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((category, categoryIndex) => {
            const CategoryIcon = iconMap[category.icon]
            return (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="cyber-glass-heavy p-5 sm:p-6 rounded-2xl sm:rounded-3xl relative overflow-hidden group tilt-card"
              >
                {/* Neon corner borders */}
                <div className={`absolute top-0 left-0 w-10 sm:w-12 h-10 sm:h-12 border-t-2 border-l-2 border-${category.color} rounded-tl-2xl sm:rounded-tl-3xl opacity-60 group-hover:opacity-100 transition-opacity`} 
                  style={{ 
                    boxShadow: `0 0 15px rgba(${category.color === 'cyber-blue' ? '58, 166, 255' : category.color === 'cyber-purple' ? '138, 43, 226' : category.color === 'cyber-cyan' ? '0, 232, 243' : '255, 27, 141'}, 0.4)` 
                  }}
                />
                <div className={`absolute bottom-0 right-0 w-10 sm:w-12 h-10 sm:h-12 border-b-2 border-r-2 border-${category.color} rounded-br-2xl sm:rounded-br-3xl opacity-60 group-hover:opacity-100 transition-opacity`} 
                  style={{ 
                    boxShadow: `0 0 15px rgba(${category.color === 'cyber-blue' ? '58, 166, 255' : category.color === 'cyber-purple' ? '138, 43, 226' : category.color === 'cyber-cyan' ? '0, 232, 243' : '255, 27, 141'}, 0.4)` 
                  }}
                />

                {/* Category Header */}
                <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-${category.color}/20 to-${category.color}/10 flex items-center justify-center group-hover:shadow-neon-blue transition-all duration-300 shrink-0`}>
                    <CategoryIcon className={`w-5 h-5 sm:w-6 sm:h-6 text-${category.color}`} />
                  </div>
                  <h3 className={`text-xl sm:text-xl font-bold text-${category.color} font-mono`}>
                    {category.category}
                  </h3>
                </div>

                {/* Skills Grid */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {category.skills.map((skill, skillIndex) => {
                    const SkillIcon = iconMap[skill.icon]
                    return (
                      <motion.div
                        key={skillIndex}
                        whileHover={{ scale: 1.05, y: -2 }}
                        className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-2 sm:px-3 sm:py-2 rounded-xl bg-white/5 border border-white/10 hover:border-cyber-blue/50 transition-all duration-300 group/skill cursor-default"
                      >
                        <SkillIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors flex-shrink-0" style={{ color: skill.color }} />
                        <span className="text-xs sm:text-xs text-white/80 font-medium truncate">
                          {skill.name}
                        </span>
                      </motion.div>
                    )
                  })}
                </div>

                {/* 3D Tilt effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl sm:rounded-3xl" />
              </motion.div>
            )
          })}
        </div>

        {/* Bottom Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="text-center mt-12 sm:mt-16 text-white/50 text-xs sm:text-sm px-4"
        >
          And many more tools in the <span className="highlight-keyword">AI engineering</span> ecosystem...
        </motion.p>
      </div>
    </section>
  )
}
