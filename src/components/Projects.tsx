'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ArrowUpRight, Github } from 'lucide-react'
import { FaPython, FaReact, FaNodeJs, FaDocker } from 'react-icons/fa'
import { 
  SiLangchain, SiFastapi, SiDjango, SiMongodb, SiPostgresql, SiNextdotjs, 
  SiPytorch, SiRedis, SiOpenai, SiFirebase, SiTypescript, SiTailwindcss, 
  SiKubernetes, SiSupabase, SiJavascript, SiExpress, SiWhatsapp, SiFlask, SiPython
} from 'react-icons/si'
import Link from 'next/link'
import projectsData from '../../data/projects.json'

// Icon mapping
const iconMap: Record<string, any> = {
  FaPython, FaReact, FaNodeJs, FaDocker, SiLangchain, SiFastapi, SiDjango,
  SiMongodb, SiPostgresql, SiNextdotjs, SiPytorch, SiRedis, SiOpenai,
  SiFirebase, SiTypescript, SiTailwindcss, SiKubernetes, SiSupabase,
  SiJavascript, SiExpress, SiWhatsapp, SiFlask, SiPython
}

function ProjectCard({ project }: { project: any }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, filter: 'blur(20px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="group relative bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden flex flex-col hover:border-cyber-purple/30 transition-all duration-500"
    >
      {/* Top visual area */}
      <div className="relative h-56 w-full overflow-hidden bg-[#111]">
        <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-500">
          <div 
            className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
            style={{ 
              backgroundImage: `url(${project.image || 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop'})`,
              backgroundBlendMode: 'overlay',
              backgroundColor: project.gradient.match(/#[a-fA-F0-9]{3,6}/)?.[0] || '#000'
            }} 
          />
          <img 
            src={project.image || 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop'} 
            alt={`${project.title} Project Thumbnail`}
            className="sr-only"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
        
        {/* Floating ID Tag */}
        <div className="absolute top-4 right-6 px-3 py-1 rounded-md bg-black/60 border border-white/10 backdrop-blur-md">
          <span className="text-[9px] font-mono text-cyber-purple tracking-widest font-bold">ID: LIB_{String(project.id).padStart(3, '0')}</span>
        </div>
      </div>

      {/* Content area */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-white mb-2 tracking-tight group-hover:text-cyber-purple transition-colors">
          {project.title}
        </h3>
        <p className="text-white/40 text-xs leading-relaxed mb-6 flex-grow font-mono opacity-80">
          {`// DESC: ${project.description}`}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-white/5">
          <Link href={`/projects/${project.id}`}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 transition-colors cursor-pointer"
            >
              EXEC_LOG
            </motion.div>
          </Link>

          <div className="flex gap-2">
            {project.tech.slice(0, 3).map((t: any, i: number) => (
              <t.icon key={i} className="w-3.5 h-3.5 text-white/20" />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Projects() {
  const projects = projectsData.projects.map(project => ({
    ...project,
    tech: project.tags.map(tag => ({
      name: tag.name,
      icon: iconMap[tag.icon],
      color: tag.color
    }))
  }))

  return (
    <section id="projects" className="relative py-16 px-6 bg-[#050505] overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col items-start mb-12 border-l-2 border-cyber-purple pl-6">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[10px] font-mono tracking-[0.3em] text-cyber-purple uppercase mb-2"
          >
            System_Storage: //PROJECT_LIBRARY
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 40, filter: 'blur(20px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="text-4xl md:text-6xl font-black text-white tracking-tighter"
          >
            PROJECTS<span className="text-cyber-purple">.</span>
          </motion.h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}
