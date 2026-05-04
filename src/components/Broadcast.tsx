'use client'

import { motion } from 'framer-motion'
import { Briefcase, Users, Zap, Terminal } from 'lucide-react'

export default function Broadcast() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  }

  return (
    <section className="relative py-32 px-6 bg-black overflow-hidden">
      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 gap-8"
        >
          {/* Recruiter Broadcast */}
          <motion.div
            variants={itemVariants}
            className="group relative p-8 md:p-12 rounded-3xl bg-[#0a0a0a] border border-white/5 hover:border-cyber-blue/30 transition-all duration-500 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <Briefcase size={120} className="text-cyber-blue" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-cyber-blue/10 flex items-center justify-center border border-cyber-blue/20">
                  <Terminal size={18} className="text-cyber-blue" />
                </div>
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em]">Broadcast: //FOR_RECRUITERS</span>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-black text-white mb-6 tracking-tighter uppercase leading-none">
                Ready to <span className="text-cyber-blue">Scale</span> Your
                <br />Intelligence Mesh.
              </h3>
              
              <p className="text-white/60 text-sm md:text-base leading-relaxed font-mono opacity-80 mb-8">
                {`> I've been deep in the AI ecosystem—architecting RAG pipelines and fine-tuning LLMs. I'm not just looking for a job; I'm looking for a mission. I'm ready to join your team, learn your stack, and deploy high-impact solutions from day one.`}
              </p>
              
              <div className="flex items-center gap-2 text-[10px] font-mono text-cyber-blue uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                <Zap size={10} className="animate-pulse" />
                System_Ready_For_Deployment
              </div>
            </div>
          </motion.div>

          {/* Peer Link */}
          <motion.div
            variants={itemVariants}
            className="group relative p-8 md:p-12 rounded-3xl bg-[#0a0a0a] border border-white/5 hover:border-cyber-purple/30 transition-all duration-500 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <Users size={120} className="text-cyber-purple" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-cyber-purple/10 flex items-center justify-center border border-cyber-purple/20">
                  <Zap size={18} className="text-cyber-purple" />
                </div>
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em]">Peer_Link: //FOR_BUILDERS</span>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-black text-white mb-6 tracking-tighter uppercase leading-none">
                Let's Build the <span className="text-cyber-purple">Future</span>
                <br />Together.
              </h3>
              
              <p className="text-white/60 text-sm md:text-base leading-relaxed font-mono opacity-80 mb-8">
                {`> To my fellow hackers: we're living through a paradigm shift. I've been building AI solutions and learning by doing. If you're pushing boundaries, let's sync. I'm ready to learn anything, break things, and build tools that actually matter.`}
              </p>

              <div className="flex items-center gap-2 text-[10px] font-mono text-cyber-purple uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                <Users size={10} className="animate-pulse" />
                Active_Collaboration_Enabled
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Narrative Label */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-24 text-center"
        >
          <p className="text-white/20 text-[10px] font-mono uppercase tracking-[0.4em]">
            Bridging the gap between code and intelligence...
          </p>
        </motion.div>
      </div>
    </section>
  )
}
