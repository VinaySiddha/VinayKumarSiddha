'use client'

import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function TermsClient() {
  return (
    <main className="relative min-h-screen bg-black text-white py-32 px-6 overflow-hidden">
      <div className="container mx-auto max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors duration-300 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-mono uppercase tracking-widest">Back to Terminal</span>
          </Link>
        </motion.div>

        <div className="flex flex-col items-start mb-16 border-l-2 border-cyber-purple pl-8">
          <motion.div
            initial={{ opacity: 0, x: -10, filter: 'blur(5px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8 }}
            className="text-[10px] font-mono tracking-[0.3em] text-cyber-purple uppercase mb-2"
          >
            Legal_Module: //TERMS_CONDITIONS
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 40, filter: 'blur(20px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="text-4xl md:text-6xl font-black text-white tracking-tighter"
          >
            TERMS<span className="text-cyber-purple">.</span>
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="space-y-12 text-white/60 leading-relaxed font-light"
        >
          <section>
            <h2 className="text-xl font-bold text-white mb-4 tracking-tight uppercase font-mono tracking-widest text-sm opacity-80">// 01. PROTOCOL_USAGE</h2>
            <p>
              By accessing this portfolio, you agree to the technical and professional standards outlined. All content, including code snippets and architectural diagrams, are provided for review purposes and remain the intellectual property of the developer.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 tracking-tight uppercase font-mono tracking-widest text-sm opacity-80">// 02. SYSTEM_INTEGRITY</h2>
            <p>
              Unauthorized attempts to penetrate or disrupt the site's runtime environment, including its API links or communication protocols, are strictly prohibited. The site is provided "as-is" with no warranties regarding continuous uptime or error-free execution.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 tracking-tight uppercase font-mono tracking-widest text-sm opacity-80">// 03. INTELLECTUAL_ASSETS</h2>
            <p>
              Projects listed under the Archive are the results of independent research and professional execution. Use of these assets without explicit attribution or authorization is a violation of technical deployment ethics.
            </p>
          </section>

          <section className="pt-12 border-t border-white/5">
            <p className="text-[10px] font-mono uppercase tracking-[0.2em]">Last Updated: May 2026</p>
          </section>
        </motion.div>
      </div>

      {/* Abstract Background */}
      <div className="absolute top-0 right-0 w-1/3 h-screen bg-cyber-purple/5 blur-[120px] pointer-events-none" />
    </main>
  )
}
