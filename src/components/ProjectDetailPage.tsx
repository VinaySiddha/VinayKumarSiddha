'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Github,
  ExternalLink,
  ArrowLeft,
  ArrowUpRight,
  Code2,
  Layers,
  Sparkles,
} from 'lucide-react'
import { FaPython, FaReact, FaNodeJs, FaDocker } from 'react-icons/fa'
import {
  SiLangchain,
  SiFastapi,
  SiDjango,
  SiMongodb,
  SiPostgresql,
  SiNextdotjs,
  SiPytorch,
  SiRedis,
  SiOpenai,
  SiFirebase,
  SiTypescript,
  SiTailwindcss,
  SiKubernetes,
  SiSupabase,
  SiJavascript,
  SiExpress,
  SiWhatsapp,
  SiFlask,
  SiPython,
} from 'react-icons/si'

interface Tag {
  name: string
  icon: string
  color: string
}

interface Project {
  id: number
  title: string
  description: string
  tags: Tag[]
  github?: string
  demo?: string
  gradient: string
  image?: string
}

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  FaPython, FaReact, FaNodeJs, FaDocker, SiLangchain, SiFastapi, SiDjango,
  SiMongodb, SiPostgresql, SiNextdotjs, SiPytorch, SiRedis, SiOpenai,
  SiFirebase, SiTypescript, SiTailwindcss, SiKubernetes, SiSupabase,
  SiJavascript, SiExpress, SiWhatsapp, SiFlask, SiPython,
}

export default function ProjectDetailPage({ project }: { project: Project }) {
  return (
    <main className="relative min-h-screen bg-black">
      <div className="relative z-10 px-4 sm:px-6 py-24 sm:py-32">
        <div className="container mx-auto max-w-5xl">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors duration-300 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-mono uppercase tracking-widest">Back to Archive</span>
            </Link>
          </motion.div>

          <div className="flex flex-col items-start mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
            >
              <span className="text-xs font-mono tracking-widest text-white/60 uppercase">Case Study {String(project.id).padStart(2, '0')}</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 40, filter: 'blur(20px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6"
            >
              {project.title.toUpperCase()}<span className="text-cyber-blue">.</span>
            </motion.h1>

            <motion.div
              className="w-16 h-1 bg-white/20"
              initial={{ width: 0 }}
              animate={{ width: '4rem' }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left — description + tech */}
            <motion.div
              initial={{ opacity: 0, y: 40, filter: 'blur(20px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
              className="lg:col-span-2 flex flex-col gap-6"
            >
              {/* Description */}
              <div className="bg-[#0a0a0a] rounded-[2rem] border border-white/5 p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                    <Layers className="w-5 h-5 text-white/40" />
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Overview</h3>
                </div>
                <p className="text-white/60 text-base md:text-lg leading-relaxed font-light">
                  {project.description}
                </p>
              </div>

              {/* Tech Stack */}
              <div className="bg-[#0a0a0a] rounded-[2rem] border border-white/5 p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                    <Code2 className="w-5 h-5 text-white/40" />
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Architecture</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {project.tags.map((tag, i) => {
                    const Icon = iconMap[tag.icon]
                    return (
                      <motion.div
                        key={tag.name}
                        initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        transition={{ duration: 0.8, delay: 0.6 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5"
                      >
                        {Icon && <Icon className="w-4 h-4 text-white/40" />}
                        <span className="text-white/80 text-xs font-medium">{tag.name}</span>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </motion.div>

            {/* Right — actions */}
            <motion.div
              initial={{ opacity: 0, x: 20, filter: 'blur(20px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
              className="space-y-6"
            >
              {/* Visual Element / Placeholder */}
              <div 
                className="w-full h-56 rounded-[2rem] border border-white/5 bg-cover bg-center relative overflow-hidden"
                style={{ 
                  backgroundImage: `url(${project.image || 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop'})`,
                  backgroundBlendMode: 'overlay',
                  backgroundColor: project.gradient.match(/#[a-fA-F0-9]{3,6}/)?.[0] || '#000'
                }}
              >
                <img 
                  src={project.image || 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop'} 
                  alt={`${project.title} - AI Project by Vinay Siddha`}
                  className="sr-only"
                />
              </div>

              <div className="bg-[#0a0a0a] rounded-[2rem] border border-white/5 p-6 flex flex-col gap-3">
                <h3 className="text-lg font-bold text-white mb-1">Access Portal</h3>
                
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 px-6 py-3.5 bg-white text-black font-bold rounded-xl hover:bg-white/90 transition-colors w-full text-sm"
                  >
                    Launch Demo
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                )}

                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 px-6 py-3.5 bg-white/5 text-white border border-white/10 font-bold rounded-xl hover:bg-white/10 transition-colors w-full text-sm"
                  >
                    <Github className="w-4 h-4" />
                    Source Code
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  )
}
