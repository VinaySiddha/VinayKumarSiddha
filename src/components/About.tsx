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
    threshold: 0.2,
  })

  const [isModalOpen, setIsModalOpen] = useState(false)

  // Achievement counters
  const [counters, setCounters] = useState({ projects: 0, clients: 0, experience: 0 })

  useEffect(() => {
    if (inView) {
      const targets = { projects: 50, clients: 30, experience: 5 }
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

      return () => clearInterval(interval)
    }
  }, [inView])

  return (
    <section id="about" className="relative py-32 px-6 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyber-dark via-cyber-purple/5 to-cyber-dark" />
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, #8A2BE2 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      {/* Dispersed Tech Badges Throughout Section */}
      {floatingTechs.map((tech, index) => (
        <motion.div
          key={tech.name}
          className="absolute cursor-hover group"
          style={{
            left: `${tech.x}%`,
            top: `${tech.y}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: 0.6, 
            scale: 1,
            y: [0, -15, 0],
          }}
          transition={{
            opacity: { delay: index * 0.1, duration: 0.5 },
            scale: { delay: index * 0.1, duration: 0.5 },
            y: {
              duration: 4 + index * 0.3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 0.2,
            },
          }}
          whileHover={{ scale: 1.2, opacity: 1 }}
        >
          <div
            className="w-16 h-16 rounded-xl cyber-glass border-2 flex items-center justify-center transition-all duration-300"
            style={{
              borderColor: `${tech.color}40`,
              backgroundColor: `${tech.color}10`,
              boxShadow: `0 0 15px ${tech.color}30`,
            }}
          >
            <tech.Icon className="w-8 h-8" style={{ color: tech.color }} />
          </div>

          {/* Tooltip */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-cyber-dark border border-white/20 rounded text-xs font-mono text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            {tech.name}
          </div>
        </motion.div>
      ))}

      <div className="container mx-auto max-w-7xl relative z-10" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            About
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Me
            </span>
          </h2>
          <p className="text-white/60 text-lg">AI Engineer crafting intelligent solutions</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Tech Arsenal Portrait */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center"
          >
            {/* Main Portrait Container */}
            <div className="relative w-80 h-80">
              {/* Rotating gradient rim */}
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
                {/* Glass portrait frame */}
                <div className="w-full h-full rounded-full cyber-glass-heavy flex items-center justify-center text-7xl font-bold text-white relative overflow-hidden group cursor-hover">
                  <span className="relative z-10 select-none">V</span>
                  
                  {/* Hover glow effect */}
                  <motion.div
                    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: 'radial-gradient(circle, rgba(58, 166, 255, 0.3), transparent)',
                    }}
                  />

                  {/* Scanning line */}
                  <motion.div
                    className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyber-blue to-transparent opacity-50"
                    animate={{ y: ['-100%', '200%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  />
                </div>
              </motion.div>

            </div>
          </motion.div>

          {/* Right: Bio + Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            {/* Bio Text */}
            <div className="space-y-4">
              <p className="text-white/80 text-lg leading-relaxed">
                Hi, I'm <span className="highlight-keyword font-mono">Vinny</span>, an{' '}
                <span className="text-cyber-blue font-semibold">AI Engineer</span> and{' '}
                <span className="text-cyber-purple font-semibold">Full Stack Developer</span> passionate about building intelligent systems that solve real-world problems.
              </p>
              <p className="text-white/70 leading-relaxed">
                I specialize in <span className="highlight-keyword font-mono">RAG systems</span>,{' '}
                <span className="highlight-keyword font-mono">LLMs</span>,{' '}
                <span className="highlight-keyword font-mono">multi-agent workflows</span>, and scalable cloud architectures. From designing AI-powered applications to deploying enterprise-grade solutions, I thrive on turning complex challenges into elegant, efficient code.
              </p>
              <p className="text-white/70 leading-relaxed">
                When I'm not coding, you'll find me exploring the latest AI research, contributing to open-source projects, or mentoring aspiring developers.
              </p>
            </div>

            {/* Achievement Counters */}
            <div className="grid grid-cols-3 gap-4">
              <motion.div
                className="cyber-glass p-4 rounded-2xl text-center group cursor-hover"
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center justify-center mb-2">
                  <Code2 className="w-5 h-5 text-cyber-blue mr-2" />
                  <span className="text-3xl font-bold text-cyber-blue">{counters.projects}+</span>
                </div>
                <p className="text-white/60 text-sm font-medium">Projects</p>
              </motion.div>

              <motion.div
                className="cyber-glass p-4 rounded-2xl text-center group cursor-hover"
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-5 h-5 text-cyber-purple mr-2" />
                  <span className="text-3xl font-bold text-cyber-purple">{counters.clients}+</span>
                </div>
                <p className="text-white/60 text-sm font-medium">Clients</p>
              </motion.div>

              <motion.div
                className="cyber-glass p-4 rounded-2xl text-center group cursor-hover"
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center justify-center mb-2">
                  <Award className="w-5 h-5 text-cyber-cyan mr-2" />
                  <span className="text-3xl font-bold text-cyber-cyan">{counters.experience}+</span>
                </div>
                <p className="text-white/60 text-sm font-medium">Years Exp</p>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <motion.button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyber-blue to-cyber-purple text-white font-semibold flex items-center gap-2 magnetic-button cursor-hover group relative overflow-hidden"
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
                href="/resume.pdf"
                download
                className="px-6 py-3 rounded-xl border-2 border-cyber-cyan/50 text-cyber-cyan font-semibold flex items-center gap-2 hover:bg-cyber-cyan/10 transition-all cursor-hover group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-5 h-5 group-hover:animate-bounce" />
                Resume
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Scrolling Text Strip */}
        <div className="relative mt-24 overflow-hidden">
          <div className="relative h-16 flex items-center bg-gradient-to-r from-transparent via-white/5 to-transparent">
            <motion.div
              className="flex whitespace-nowrap font-mono text-sm font-bold tracking-widest"
              animate={{ x: ['0%', '-50%'] }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              {/* Duplicate content for seamless loop */}
              <span className="flex items-center">
                <span className="text-cyber-blue px-6">AI ENGINEER</span>
                <span className="text-white/40 px-2">•</span>
                <span className="text-cyber-purple px-6">RAG SYSTEMS</span>
                <span className="text-white/40 px-2">•</span>
                <span className="text-cyber-cyan px-6">LANGCHAIN</span>
                <span className="text-white/40 px-2">•</span>
                <span className="text-cyber-blue px-6">MULTI-AGENT WORKFLOWS</span>
                <span className="text-white/40 px-2">•</span>
                <span className="text-cyber-purple px-6">JAVA</span>
                <span className="text-white/40 px-2">•</span>
                <span className="text-cyber-cyan px-6">PYTHON</span>
                <span className="text-white/40 px-2">•</span>
                <span className="text-cyber-blue px-6">JAVASCRIPT</span>
                <span className="text-white/40 px-2">•</span>
                <span className="text-cyber-purple px-6">MONGODB</span>
                <span className="text-white/40 px-2">•</span>
                <span className="text-cyber-cyan px-6">DJANGO</span>
                <span className="text-white/40 px-2">•</span>
                <span className="text-cyber-blue px-6">EXPRESS JS</span>
                <span className="text-white/40 px-2">•</span>
                {/* Duplicate for seamless loop */}
                <span className="text-cyber-blue px-6">AI ENGINEER</span>
                <span className="text-white/40 px-2">•</span>
                <span className="text-cyber-purple px-6">RAG SYSTEMS</span>
                <span className="text-white/40 px-2">•</span>
                <span className="text-cyber-cyan px-6">LANGCHAIN</span>
                <span className="text-white/40 px-2">•</span>
                <span className="text-cyber-blue px-6">MULTI-AGENT WORKFLOWS</span>
                <span className="text-white/40 px-2">•</span>
                <span className="text-cyber-purple px-6">JAVA</span>
                <span className="text-white/40 px-2">•</span>
                <span className="text-cyber-cyan px-6">PYTHON</span>
                <span className="text-white/40 px-2">•</span>
                <span className="text-cyber-blue px-6">JAVASCRIPT</span>
                <span className="text-white/40 px-2">•</span>
                <span className="text-cyber-purple px-6">MONGODB</span>
                <span className="text-white/40 px-2">•</span>
                <span className="text-cyber-cyan px-6">DJANGO</span>
                <span className="text-white/40 px-2">•</span>
                <span className="text-cyber-blue px-6">EXPRESS JS</span>
                <span className="text-white/40 px-2">•</span>
              </span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Tech Arsenal Modal */}
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6"
          onClick={() => setIsModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="cyber-glass-heavy p-8 rounded-3xl max-w-4xl w-full max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-3xl font-bold gradient-text-fusion mb-6">
              Tech <span className="highlight-keyword font-mono">Arsenal</span>
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...orbitingTechs, ...floatingTechs].map((tech, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="cyber-glass p-4 rounded-xl flex flex-col items-center gap-3 cursor-hover group"
                  whileHover={{ scale: 1.05 }}
                  style={{
                    borderColor: `${tech.color}40`,
                    backgroundColor: `${tech.color}10`,
                  }}
                >
                  <tech.Icon className="w-10 h-10" style={{ color: tech.color }} />
                  <span className="text-white text-sm font-medium">{tech.name}</span>
                </motion.div>
              ))}
            </div>

            <motion.button
              onClick={() => setIsModalOpen(false)}
              className="mt-8 w-full py-3 rounded-xl bg-gradient-to-r from-cyber-blue to-cyber-purple text-white font-semibold cursor-hover"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Close
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}
