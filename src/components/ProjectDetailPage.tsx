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
import BackgroundBlobs from '@/components/BackgroundBlobs'
import ParticleBackground from '@/components/ParticleBackground'
import ThemeToggle from '@/components/ThemeToggle'

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
  FaPython,
  FaReact,
  FaNodeJs,
  FaDocker,
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
}

export default function ProjectDetailPage({ project }: { project: Project }) {
  return (
    <main className="relative min-h-screen">
      <ThemeToggle />
      <BackgroundBlobs />
      <ParticleBackground />

      <div className="relative z-10 px-4 sm:px-6 py-24 sm:py-28">
        <div className="container mx-auto max-w-5xl">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 text-white/60 hover:text-cyber-blue transition-colors duration-300 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Projects</span>
            </Link>
          </motion.div>

          {/* Project badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-white/80 font-mono tracking-widest uppercase">
              Project Brief
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-4xl sm:text-6xl font-black text-white mb-4 leading-tight"
          >
            {project.title}
          </motion.h1>

          {/* Gradient bar */}
          <motion.div
            className="h-1.5 rounded-full mb-8 w-32"
            style={{ background: project.gradient }}
            initial={{ width: 0 }}
            animate={{ width: '8rem' }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />

          {/* Main card */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left — description + tech */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Description */}
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-6 sm:p-8">
                <div
                  className="absolute inset-0 opacity-5 pointer-events-none"
                  style={{ background: project.gradient }}
                />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <Layers className="w-5 h-5 text-white/40" />
                    <span className="text-white/40 text-xs font-mono uppercase tracking-widest">
                      About This Project
                    </span>
                  </div>
                  <p className="text-white/80 text-base sm:text-lg leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </div>

              {/* Tech Stack */}
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-5">
                  <Code2 className="w-5 h-5 text-white/40" />
                  <span className="text-white/40 text-xs font-mono uppercase tracking-widest">
                    Tech Stack
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {project.tags.map((tag) => {
                    const Icon = iconMap[tag.icon]
                    return (
                      <motion.div
                        key={tag.name}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl border bg-white/5 backdrop-blur-sm"
                        style={{ borderColor: `${tag.color}30` }}
                        whileHover={{ scale: 1.05 }}
                      >
                        {Icon && (
                          <Icon
                            className="w-5 h-5 flex-shrink-0"
                            style={{ color: tag.color }}
                          />
                        )}
                        <span className="text-white/80 text-sm font-medium">{tag.name}</span>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </motion.div>

            {/* Right — actions */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="space-y-4"
            >
              {/* Project number */}
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-6 text-center">
                <div
                  className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{ background: project.gradient }}
                />
                <p className="text-white/30 text-xs font-mono uppercase tracking-widest mb-2">
                  Project
                </p>
                <p
                  className="text-7xl font-black leading-none"
                  style={{
                    background: project.gradient,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {String(project.id).padStart(2, '0')}
                </p>
              </div>

              {/* Links */}
              <div className="space-y-3">
                {project.demo && (
                  <motion.a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm text-white w-full"
                    style={{ background: project.gradient }}
                    whileHover={{ scale: 1.03, filter: 'brightness(1.1)' }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <ExternalLink className="w-4 h-4" />
                    Live Demo
                    <ArrowUpRight className="w-4 h-4" />
                  </motion.a>
                )}

                {project.github && (
                  <motion.a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm text-white/80 border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:text-white transition-all w-full"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Github className="w-4 h-4" />
                    View Source
                  </motion.a>
                )}

                <Link href="/#projects" className="block">
                  <motion.div
                    className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-medium text-sm text-white/60 border border-white/10 bg-white/3 hover:bg-white/8 hover:text-white/80 transition-all w-full cursor-pointer"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    All Projects
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  )
}
