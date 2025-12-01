'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Github, ExternalLink, ArrowUpRight, Sparkles } from 'lucide-react'
import { FaPython, FaReact, FaNodeJs, FaDocker } from 'react-icons/fa'
import { SiLangchain, SiFastapi, SiDjango, SiMongodb, SiPostgresql, SiNextdotjs, SiPytorch, SiRedis, SiOpenai } from 'react-icons/si'
import { useState, useRef } from 'react'

interface Project {
  title: string
  tagline: string
  tech: Array<{ name: string; icon: any; color: string }>
  github?: string
  demo?: string
  gradient: string
  image?: string
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    mouseX.set((e.clientX - centerX) / rect.width)
    mouseY.set((e.clientY - centerY) / rect.height)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.15 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative group"
      style={{
        perspective: '1500px',
      }}
    >
      <motion.div
        className="relative overflow-hidden"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Main card container with diagonal cut */}
        <div
          className="relative bg-black/40 backdrop-blur-xl border border-white/10 overflow-hidden"
          style={{
            clipPath: 'polygon(0 0, 100% 0, 100% 85%, 92% 100%, 0 100%)',
            minHeight: '420px',
          }}
        >
          {/* Gradient overlay */}
          <div
            className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500"
            style={{
              background: project.gradient,
            }}
          />

          {/* Animated gradient border */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100"
            style={{
              background: `linear-gradient(135deg, ${project.gradient})`,
              mixBlendMode: 'overlay',
            }}
            animate={isHovered ? {
              scale: [1, 1.1, 1],
              opacity: [0, 0.3, 0],
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Floating particles */}
          {isHovered && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    left: `${20 + i * 12}%`,
                    top: `${30 + (i % 3) * 20}%`,
                  }}
                  animate={{
                    y: [-10, -30, -10],
                    opacity: [0, 1, 0],
                    scale: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.2,
                    repeat: Infinity,
                  }}
                />
              ))}
            </>
          )}

          {/* Content */}
          <div className="relative z-10 p-8" style={{ transform: 'translateZ(50px)' }}>
            {/* Index number */}
            <div className="absolute top-4 right-4 text-6xl font-black text-white/5 leading-none">
              {String(index + 1).padStart(2, '0')}
            </div>

            {/* Tech icons row */}
            <div className="flex items-center gap-3 mb-6">
              {project.tech.slice(0, 4).map((tech, i) => (
                <motion.div
                  key={i}
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-sm"
                  whileHover={{
                    scale: 1.2,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    rotate: [0, -10, 10, 0],
                  }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <tech.icon className="w-5 h-5" style={{ color: tech.color }} />
                </motion.div>
              ))}
            </div>

            {/* Project title */}
            <h3 className="text-3xl font-bold text-white mb-3 leading-tight">
              {project.title}
            </h3>

            {/* Animated underline */}
            <motion.div
              className="h-1 mb-4 rounded-full"
              style={{ background: project.gradient }}
              initial={{ width: 0 }}
              whileInView={{ width: '80px' }}
              transition={{ duration: 0.8, delay: index * 0.15 + 0.3 }}
            />

            {/* Tagline */}
            <p className="text-white/70 text-sm leading-relaxed mb-6 max-w-md">
              {project.tagline}
            </p>

            {/* Tech stack chips */}
            <div className="flex flex-wrap gap-2 mb-8">
              {project.tech.map((tech, i) => (
                <motion.span
                  key={i}
                  className="px-3 py-1 text-xs font-medium rounded-md bg-white/5 border border-white/10 text-white/80 backdrop-blur-sm"
                  whileHover={{
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    scale: 1.05,
                  }}
                >
                  {tech.name}
                </motion.span>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              {project.demo && (
                <motion.a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn relative flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm text-white overflow-hidden"
                  style={{
                    background: project.gradient,
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10">Live Demo</span>
                  <ArrowUpRight className="w-4 h-4 relative z-10 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: '-100%', skewX: -15 }}
                    whileHover={{ x: '200%' }}
                    transition={{ duration: 0.6 }}
                  />
                </motion.a>
              )}
              
              {project.github && (
                <motion.a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm text-white/80 border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:text-white transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Github className="w-4 h-4" />
                  <span>Source</span>
                </motion.a>
              )}
            </div>
          </div>

          {/* Layered shadow effect on bottom right */}
          <div
            className="absolute -bottom-2 -right-2 w-32 h-32 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"
            style={{
              background: project.gradient,
            }}
          />
        </div>

        {/* Floating decorative element */}
        <motion.div
          className="absolute -top-3 -right-3 w-20 h-20 rounded-full opacity-20 blur-2xl pointer-events-none"
          style={{
            background: project.gradient,
          }}
          animate={isHovered ? {
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </motion.div>
  )
}

export default function Projects() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const projects: Project[] = [
    {
      title: 'Advanced RAG System',
      tagline: 'Production-grade multi-stage retrieval with hybrid search, reranking, and query expansion for intelligent question answering.',
      tech: [
        { name: 'LangChain', icon: SiLangchain, color: '#1C3C3C' },
        { name: 'Python', icon: FaPython, color: '#3776AB' },
        { name: 'FastAPI', icon: SiFastapi, color: '#009688' },
        { name: 'OpenAI', icon: SiOpenai, color: '#10A37F' },
      ],
      github: 'https://github.com',
      demo: 'https://demo.com',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      title: 'CrewAI Multi-Agent System',
      tagline: 'Collaborative AI agents with role-based workflows for automated research, content creation, and fact-checking.',
      tech: [
        { name: 'Python', icon: FaPython, color: '#3776AB' },
        { name: 'LangChain', icon: SiLangchain, color: '#1C3C3C' },
        { name: 'OpenAI', icon: SiOpenai, color: '#10A37F' },
        { name: 'FastAPI', icon: SiFastapi, color: '#009688' },
      ],
      github: 'https://github.com',
      demo: 'https://demo.com',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
      title: 'WhatsApp AI Assistant',
      tagline: 'Intelligent conversational chatbot with context memory, NLP capabilities, and seamless Twilio integration.',
      tech: [
        { name: 'Python', icon: FaPython, color: '#3776AB' },
        { name: 'OpenAI', icon: SiOpenai, color: '#10A37F' },
        { name: 'Redis', icon: SiRedis, color: '#DC382D' },
        { name: 'FastAPI', icon: SiFastapi, color: '#009688' },
      ],
      github: 'https://github.com',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
    {
      title: 'Django Enterprise Platform',
      tagline: 'Scalable full-stack application with role-based access control, RESTful APIs, and PostgreSQL integration.',
      tech: [
        { name: 'Django', icon: SiDjango, color: '#092E20' },
        { name: 'PostgreSQL', icon: SiPostgresql, color: '#336791' },
        { name: 'React', icon: FaReact, color: '#61DAFB' },
        { name: 'Docker', icon: FaDocker, color: '#2496ED' },
      ],
      github: 'https://github.com',
      demo: 'https://demo.com',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    },
    {
      title: 'LLM Fine-tuning Pipeline',
      tagline: 'End-to-end automated pipeline for fine-tuning Mistral models with LoRA adapters and evaluation metrics.',
      tech: [
        { name: 'Python', icon: FaPython, color: '#3776AB' },
        { name: 'PyTorch', icon: SiPytorch, color: '#EE4C2C' },
        { name: 'FastAPI', icon: SiFastapi, color: '#009688' },
        { name: 'Docker', icon: FaDocker, color: '#2496ED' },
      ],
      github: 'https://github.com',
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    },
    {
      title: 'Express.js Microservices',
      tagline: 'Modern microservices architecture with MongoDB, Redis caching, JWT auth, and API Gateway orchestration.',
      tech: [
        { name: 'Node.js', icon: FaNodeJs, color: '#339933' },
        { name: 'MongoDB', icon: SiMongodb, color: '#47A248' },
        { name: 'Redis', icon: SiRedis, color: '#DC382D' },
        { name: 'Docker', icon: FaDocker, color: '#2496ED' },
      ],
      github: 'https://github.com',
      gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    },
  ]

  return (
    <section id="projects" className="relative py-32 px-6 overflow-hidden bg-gradient-to-b from-black via-gray-900/50 to-black">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10" ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-white/80">Featured Work</span>
          </motion.div>
          
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            Projects That
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Define Excellence
            </span>
          </h2>
          
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Innovative solutions built with cutting-edge technologies
          </p>
        </motion.div>

        {/* Projects grid - Asymmetric layout */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className={`
                ${index === 0 ? 'lg:col-span-2' : ''}
                ${index === 3 ? 'lg:col-span-2' : ''}
              `}
            >
              <ProjectCard project={project} index={index} />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-center mt-20"
        >
          <motion.a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg shadow-2xl hover:shadow-purple-500/50 transition-shadow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Github className="w-5 h-5" />
            <span>Explore All Projects</span>
            <ArrowUpRight className="w-5 h-5" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
