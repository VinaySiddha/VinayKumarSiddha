'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
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

function ProjectShowcase({ project, index }: { project: any; index: number }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [50, -50])

  return (
    <div ref={ref} className="relative h-[45vh] md:h-[55vh] w-full mb-12 md:mb-16">
      <div className="absolute inset-0 rounded-2xl overflow-hidden bg-[#0a0a0a] border border-white/5 group">
        {/* Background Parallax Image / Gradient */}
        <motion.div 
          style={{ y }}
          className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-700"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-[#050505]" />
          <div 
            className="w-full h-[120%] bg-cover bg-center" 
            style={{ 
              backgroundImage: `url(${project.image || 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop'})`,
              backgroundBlendMode: 'overlay',
              backgroundColor: project.gradient.match(/#[a-fA-F0-9]{3,6}/)?.[0] || '#000'
            }} 
          >
            <img 
              src={project.image || 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop'} 
              alt={`${project.title} Featured Project`}
              className="sr-only"
            />
          </div>
        </motion.div>

        {/* Content Overlay */}
        <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex items-center gap-4 mb-4"
            >
              <span className="text-cyber-blue font-mono text-[10px] tracking-[0.3em] uppercase">MODULE_PRJ_{String(index + 1).padStart(2, '0')}</span>
              <div className="h-px w-8 bg-white/10" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tighter"
            >
              {project.title.toUpperCase()}<span className="text-cyber-blue">.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
              className="text-white/40 text-xs md:text-sm max-w-lg mb-8 font-mono leading-relaxed opacity-80"
            >
              {`// ${project.description}`}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
              className="flex items-center gap-6"
            >
              <Link href={`/projects/${project.id}`}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-white text-black font-bold rounded-lg cursor-pointer flex items-center gap-2 text-[10px] uppercase tracking-widest"
                >
                  Inspect_Module
                  <ArrowUpRight className="w-3 h-3" />
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FeaturedProjects() {
  const featuredProjects = projectsData.projects.slice(0, 3).map(project => ({
    ...project,
    tech: project.tags.map(tag => ({
      name: tag.name,
      icon: iconMap[tag.icon],
      color: tag.color
    }))
  }))

  return (
    <section className="relative py-24 px-6 bg-[#050505]">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col items-start mb-24 border-l-2 border-cyber-blue pl-6">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[10px] font-mono tracking-[0.3em] text-cyber-blue uppercase mb-2"
          >
            System_Output: //FEATURED_GALLERY
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl font-black text-white tracking-tighter"
          >
            SELECT PROJECTS<span className="text-cyber-blue">.</span>
          </motion.h2>
        </div>

        <div className="flex flex-col">
          {featuredProjects.map((project, index) => (
            <ProjectShowcase key={project.id} project={project} index={index} />
          ))}
        </div>

        <div className="flex justify-start mt-12 pl-6">
          <Link href="/projects">
            <motion.div
              whileHover={{ x: 10 }}
              className="group flex items-center gap-4 text-white/40 hover:text-white transition-colors cursor-pointer"
            >
              <span className="text-sm font-mono tracking-[0.2em] uppercase">Open_Archive</span>
              <ArrowUpRight className="w-4 h-4 group-hover:text-cyber-blue" />
            </motion.div>
          </Link>
        </div>
      </div>
    </section>
  )
}
