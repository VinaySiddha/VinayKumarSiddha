'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ArrowDown } from 'lucide-react'
import experienceData from '../../data/experience.json'

export default function Experience() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.05,
  })

  return (
    <section id="experience" className="relative py-16 px-6 bg-[#050505] overflow-hidden" ref={ref}>
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col items-start mb-12 border-l-2 border-cyber-purple pl-6">
          <motion.div
            initial={{ opacity: 0, x: -10, filter: 'blur(5px)' }}
            whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8 }}
            className="text-[10px] font-mono tracking-[0.3em] text-cyber-purple uppercase mb-2"
          >
            System_Event: //DEPLOYMENT_HISTORY
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 40, filter: 'blur(20px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="text-4xl md:text-6xl font-black text-white tracking-tighter"
          >
            EXPERIENCE<span className="text-cyber-purple">.</span>
          </motion.h2>
        </div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-[7px] top-0 bottom-0 w-px bg-white/10" />

          <div className="flex flex-col gap-8">
            {experienceData.timeline.map((milestone, index) => {
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
                  whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
                  className="relative pl-10 group"
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-0 w-[15px] h-[15px] bg-[#050505] border border-white/20 rounded-full z-10 flex items-center justify-center -translate-x-[7px] mt-1.5">
                    <div className="w-1.5 h-1.5 bg-cyber-purple rounded-full group-hover:scale-150 transition-transform" />
                  </div>
                  
                  <motion.div 
                    initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
                    whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 + 0.2 }}
                    className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-cyber-purple/30 transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                      <div className="flex flex-col">
                        <span className="text-cyber-purple font-mono text-[10px] uppercase tracking-widest mb-1">
                          {milestone.year} // REL_STABLE
                        </span>
                        <h3 className="text-xl font-bold text-white tracking-tight">
                          {milestone.role}
                        </h3>
                      </div>
                      <span className="px-3 py-1 rounded-md bg-white/5 text-white/40 text-[10px] font-mono border border-white/5">
                        {milestone.company}
                      </span>
                    </div>
                    <p className="text-white/50 text-xs leading-relaxed font-mono opacity-80 italic">
                      {`> ${milestone.description}`}
                    </p>
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        </div>

        <div className="flex justify-center mt-32">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center justify-center w-12 h-12 rounded-full border border-white/10"
          >
            <ArrowDown className="w-5 h-5 text-white/40" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
