'use client'

import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function PrivacyClient() {
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

        <div className="flex flex-col items-start mb-16 border-l-2 border-cyber-blue pl-8">
          <motion.div
            initial={{ opacity: 0, x: -10, filter: 'blur(5px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8 }}
            className="text-[10px] font-mono tracking-[0.3em] text-cyber-blue uppercase mb-2"
          >
            Legal_Module: //PRIVACY_POLICY
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 40, filter: 'blur(20px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="text-4xl md:text-6xl font-black text-white tracking-tighter"
          >
            PRIVACY<span className="text-cyber-blue">.</span>
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="space-y-12 text-white/60 leading-relaxed font-light"
        >
          <section>
            <h2 className="text-xl font-bold text-white mb-4 tracking-tight uppercase font-mono tracking-widest text-sm opacity-80">// 01. DATA_COLLECTION</h2>
            <p>
              This portfolio is a static site designed for professional showcase. We do not actively track or collect personal identification information from visitors unless explicitly provided through the contact form. Standard server logs and basic analytics may be used to optimize system performance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 tracking-tight uppercase font-mono tracking-widest text-sm opacity-80">// 02. COOKIE_POLICY</h2>
            <p>
              We utilize essential cookies for site functionality and security. Third-party services like Vercel or Cloudflare may deploy technical cookies to ensure a stable runtime environment. No marketing or tracking cookies are utilized for advertisement profiling.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 tracking-tight uppercase font-mono tracking-widest text-sm opacity-80">// 03. SECURITY_SANDBOX</h2>
            <p>
              Information transmitted through the contact link is processed securely via EmailJS protocols. We implement industry-standard encryption to maintain data integrity within our communication mesh.
            </p>
          </section>

          <section className="pt-12 border-t border-white/5">
            <p className="text-[10px] font-mono uppercase tracking-[0.2em]">Last Updated: May 2026</p>
          </section>
        </motion.div>
      </div>

      {/* Abstract Background */}
      <div className="absolute top-0 right-0 w-1/3 h-screen bg-cyber-blue/5 blur-[120px] pointer-events-none" />
    </main>
  )
}
