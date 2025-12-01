'use client'

import { motion } from 'framer-motion'
import { Heart, Code2 } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative py-8 px-6 overflow-hidden border-t border-white/10">
      {/* Minimal glass strip */}
      <div className="absolute inset-0 bg-white/3 backdrop-blur-glass" />
      
      {/* Glowing divider line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyber-blue to-transparent" 
        style={{ boxShadow: '0 0 10px rgba(58, 166, 255, 0.6)' }}
      />

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          {/* Copyright */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-white/60 flex items-center gap-2"
          >
            © {currentYear} <span className="highlight-keyword text-base">Vinny</span>. All rights reserved.
          </motion.p>

          {/* Built with love */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center gap-2 text-white/60"
          >
            Built with
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Heart className="w-4 h-4 text-cyber-pink fill-cyber-pink" />
            </motion.div>
            and
            <Code2 className="w-4 h-4 text-cyber-blue" />
            using
            <span className="highlight-keyword">Next.js</span>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-6"
          >
            <a
              href="#home"
              className="text-white/60 hover:text-cyber-blue transition-colors duration-300"
            >
              Home
            </a>
            <a
              href="#about"
              className="text-white/60 hover:text-cyber-purple transition-colors duration-300"
            >
              About
            </a>
            <a
              href="#projects"
              className="text-white/60 hover:text-cyber-cyan transition-colors duration-300"
            >
              Projects
            </a>
            <a
              href="#contact"
              className="text-white/60 hover:text-cyber-pink transition-colors duration-300"
            >
              Contact
            </a>
          </motion.div>
        </div>

        {/* Signature */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mt-6 pt-6 border-t border-white/5"
        >
          <p className="text-white/40 text-xs">
            Crafted with <span className="font-mono text-cyber-blue">cutting-edge</span> tech stack •{' '}
            <span className="highlight-keyword text-xs">AI Engineer</span> & <span className="highlight-keyword text-xs">SDE</span>
          </p>
        </motion.div>
      </div>

      {/* Ambient glow effect */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-cyber-purple/50 to-transparent blur-sm" />
    </footer>
  )
}
