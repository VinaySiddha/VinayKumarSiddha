'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useState, useEffect } from 'react'
import { Code2, Sparkles, Download, Award, Users } from 'lucide-react'
import { FaPython, FaJava, FaReact, FaNodeJs, FaDocker, FaGitAlt, FaAws } from 'react-icons/fa'
import { SiMongodb, SiNextdotjs, SiDjango, SiExpress, SiPostgresql, SiFirebase, SiFastapi, SiTailwindcss, SiTypescript, SiJavascript, SiTensorflow, SiPytorch, SiMysql } from 'react-icons/si'

// Orbiting badges around portrait
const orbitingTechs = [
  { Icon: FaReact, color: '#61DAFB', name: 'React', angle: 0 },
  { Icon: SiNextdotjs, color: '#FFFFFF', name: 'Next.js', angle: 45 },
  { Icon: FaPython, color: '#3776AB', name: 'Python', angle: 90 },
  { Icon: FaJava, color: '#007396', name: 'Java', angle: 135 },
  { Icon: SiMongodb, color: '#47A248', name: 'MongoDB', angle: 180 },
  { Icon: FaNodeJs, color: '#339933', name: 'Node.js', angle: 225 },
  { Icon: SiDjango, color: '#092E20', name: 'Django', angle: 270 },
  { Icon: SiExpress, color: '#FFFFFF', name: 'Express', angle: 315 },
]

// Floating inner badges with proximity effect
const floatingTechs = [
  { Icon: FaDocker, color: '#2496ED', name: 'Docker', x: 8, y: 15 },
  { Icon: FaGitAlt, color: '#F05032', name: 'Git', x: 88, y: 20 },
  { Icon: FaAws, color: '#FF9900', name: 'AWS', x: 15, y: 75 },
  { Icon: SiPostgresql, color: '#336791', name: 'PostgreSQL', x: 85, y: 70 },
  { Icon: SiFirebase, color: '#FFCA28', name: 'Firebase', x: 5, y: 45 },
  { Icon: SiFastapi, color: '#009688', name: 'FastAPI', x: 92, y: 50 },
  { Icon: SiTailwindcss, color: '#06B6D4', name: 'Tailwind', x: 10, y: 88 },
  { Icon: SiTypescript, color: '#3178C6', name: 'TypeScript', x: 90, y: 85 },
  { Icon: SiTensorflow, color: '#FF6F00', name: 'TensorFlow', x: 7, y: 60 },
  { Icon: SiPytorch, color: '#EE4C2C', name: 'PyTorch', x: 93, y: 35 },
  { Icon: SiMysql, color: '#4479A1', name: 'MySQL', x: 12, y: 30 },
  { Icon: SiJavascript, color: '#F7DF1E', name: 'JavaScript', x: 88, y: 55 },
]

export default function About() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Achievement counters
  const [counters, setCounters] = useState({ projects: 0, clients: 0, experience: 0 })

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    if (inView) {
      const targets = { projects: 10, clients: 3, experience: 1 }
      const duration = 2000
      const steps = 60

      let step = 0
      const interval = setInterval(() => {
        step++
        const progress = step / steps
        setCounters({
          projects: Math.floor(targets.projects * progress),
          clients: Math.floor(targets.clients * progress),
          experience: Math.floor(targets.experience * progress),
        })
        if (step >= steps) clearInterval(interval)
      }, duration / steps)

      return () => {
        clearInterval(interval)
        window.removeEventListener('resize', checkMobile)
      }
    }
    return () => window.removeEventListener('resize', checkMobile)
  }, [inView])

  return (
    <section id="about" className="relative py-24 sm:py-32 px-4 sm:px-6 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyber-dark via-cyber-purple/5 to-cyber-dark" />
      <motion.div
        className="absolute top-1/4 left-1/4 w-72 h-72 sm:w-96 sm:h-96 rounded-full opacity-10 sm:opacity-20"
        style={{
          background: 'radial-gradient(circle, #8A2BE2 0%, transparent 70%)',
          filter: 'blur(80px) sm:blur(100px)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      {/* Dispersed Tech Badges - Filtered for mobile performance */}
      {floatingTechs.filter((_, i) => !isMobile || i % 2 === 0).map((tech, index) => (
        <motion.div
          key={tech.name}
          className="absolute cursor-pointer group z-10"
          style={{
            left: `${tech.x}%`,
            top: `${tech.y}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: 0.4, 
            scale: 1,
            y: [0, -10, 0],
          }}
          transition={{
            opacity: { delay: index * 0.05, duration: 0.5 },
            scale: { delay: index * 0.05, duration: 0.5 },
            y: {
              duration: 4 + index * 0.3,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          }}
          whileHover={{ scale: 1.2, opacity: 1 }}
        >
          <div
            className="w-10 h-10 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl cyber-glass border flex items-center justify-center transition-all duration-300"
            style={{
              borderColor: `${tech.color}30`,
              backgroundColor: `${tech.color}05`,
              boxShadow: `0 0 10px ${tech.color}20`,
            }}
          >
            <tech.Icon className="w-5 h-5 sm:w-8 sm:h-8" style={{ color: tech.color }} />
          </div>
        </motion.div>
      ))}

      <div className="container mx-auto max-w-7xl relative z-10" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-20"
        >
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-4 sm:mb-6 leading-tight">
            About
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Me
            </span>
          </h2>
          <p className="text-white/50 text-base sm:text-lg">AI Engineer crafting intelligent solutions</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 items-center">
          {/* Left: Tech Arsenal Portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center"
          >
            {/* Main Portrait Container */}
            <div className="relative w-64 h-64 sm:w-80 sm:h-80">
              <motion.div
                className="absolute inset-0 rounded-full p-1"
                style={{
                  background: 'linear-gradient(45deg, #3AA6FF, #8A2BE2, #FF1B8D, #00E8F3)',
                  backgroundSize: '200% 200%',
                }}
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  backgroundPosition: { duration: 5, repeat: Infinity },
                }}
              >
                <div className="w-full h-full rounded-full cyber-glass-heavy flex items-center justify-center text-5xl sm:text-7xl font-bold text-white relative overflow-hidden group">
                  <span className="relative z-10 select-none">V</span>
                  
                  <motion.div
                    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: 'radial-gradient(circle, rgba(58, 166, 255, 0.3), transparent)',
                    }}
                  />

                  <motion.div
                    className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyber-blue to-transparent opacity-30"
                    animate={{ y: ['-100%', '200%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Bio + Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8 sm:space-y-10"
          >
            {/* Bio Text */}
            <div className="space-y-6 text-center lg:text-left">
              <p className="text-white/80 text-base sm:text-lg leading-relaxed">
                Hi, I'm <span className="highlight-keyword font-mono">Vinny</span>, an{' '}
                <span className="text-cyber-blue font-semibold">AI Engineer</span> and{' '}
                <span className="text-cyber-purple font-semibold">Full Stack Developer</span> passionate about building intelligent systems.
              </p>
              <p className="text-white/70 text-sm sm:text-base leading-relaxed">
                I specialize in <span className="highlight-keyword font-mono">RAG systems</span>,{' '}
                <span className="highlight-keyword font-mono">LLMs</span>, and{' '}
                <span className="highlight-keyword font-mono">multi-agent workflows</span>. I thrive on turning complex challenges into elegant, efficient code.
              </p>
            </div>

            {/* Achievement Counters - Responsive Grid */}
            <div className="grid grid-cols-1 xs:grid-cols-3 gap-4 sm:gap-6">
              {[
                { label: 'Projects', count: counters.projects, color: 'text-cyber-blue', icon: Code2 },
                { label: 'Clients', count: counters.clients, color: 'text-cyber-purple', icon: Users },
                { label: 'Years Exp', count: counters.experience, color: 'text-cyber-cyan', icon: Award }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="cyber-glass p-4 sm:p-5 rounded-2xl text-center group"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="flex items-center justify-center mb-1.5">
                    <item.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${item.color} mr-2`} />
                    <span className={`text-2xl sm:text-3xl font-bold ${item.color}`}>{item.count}+</span>
                  </div>
                  <p className="text-white/50 text-[10px] sm:text-xs font-medium uppercase tracking-wider mt-1">{item.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <motion.button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 sm:py-4 rounded-xl bg-gradient-to-r from-cyber-blue to-cyber-purple text-white text-sm sm:text-base font-semibold flex items-center justify-center gap-2 group relative overflow-hidden w-full sm:w-auto shadow-lg shadow-cyber-blue/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Sparkles className="w-5 h-5" />
                <span className="relative z-10">Tech Arsenal</span>
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-cyber-purple to-cyber-pink opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </motion.button>

              <motion.a
                href="https://drive.google.com/file/d/1ZRv8l9RlO91aXLi-MEcsI0FU95T5iYjg/view?usp=sharing"
                target="_blank"
                className="px-6 py-3 sm:py-4 rounded-xl border border-cyber-cyan/50 text-cyber-cyan text-sm sm:text-base font-semibold flex items-center justify-center gap-2 hover:bg-cyber-cyan/10 transition-all w-full sm:w-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-5 h-5 group-hover:animate-bounce" />
                Resume
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Scrolling Text Strip - Optimized for performance */}
        <div className="relative mt-20 sm:mt-24 overflow-hidden py-4">
          <motion.div
            className="flex whitespace-nowrap font-mono text-xs sm:text-sm font-bold tracking-widest opacity-30"
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <span className="flex items-center">
              {['AI ENGINEER', 'RAG SYSTEMS', 'LANGCHAIN', 'MULTI-AGENT WORKFLOWS', 'PYTHON', 'DJANGO', 'NEXT JS'].map((text, i) => (
                <span key={i} className="flex items-center">
                  <span className="text-white px-6">{text}</span>
                  <span className="text-white/20 px-2">•</span>
                </span>
              ))}
              {/* Duplicate for loop */}
              {['AI ENGINEER', 'RAG SYSTEMS', 'LANGCHAIN', 'MULTI-AGENT WORKFLOWS', 'PYTHON', 'DJANGO', 'NEXT JS'].map((text, i) => (
                <span key={i + 10} className="flex items-center">
                  <span className="text-white px-6">{text}</span>
                  <span className="text-white/20 px-2">•</span>
                </span>
              ))}
            </span>
          </motion.div>
        </div>
      </div>

      {/* Tech Arsenal Modal - Improved responsive grid */}
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6"
          onClick={() => setIsModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="cyber-glass-heavy p-6 sm:p-8 rounded-2xl sm:rounded-3xl max-w-4xl w-full max-h-[85vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-2xl sm:text-3xl font-bold gradient-text-fusion mb-6">
              Tech <span className="highlight-keyword font-mono">Arsenal</span>
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {[...orbitingTechs, ...floatingTechs].map((tech, index) => (
                <motion.div
                  key={index}
                  className="cyber-glass p-3 sm:p-4 rounded-xl flex flex-col items-center gap-2 sm:gap-3 group"
                  whileHover={{ scale: 1.05 }}
                  style={{
                    borderColor: `${tech.color}20`,
                    backgroundColor: `${tech.color}05`,
                  }}
                >
                  <tech.Icon className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: tech.color }} />
                  <span className="text-white text-[10px] sm:text-sm font-medium">{tech.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}
