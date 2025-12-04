'use client'

import { motion, useAnimation } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Github, Linkedin, Mail, Download, Sparkles } from 'lucide-react'
import aboutData from '../../data/about.json'

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [particleCount, setParticleCount] = useState(20)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    const updateParticleCount = () => {
      setParticleCount(window.innerWidth < 768 ? 10 : 20)
    }
    updateParticleCount()
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', updateParticleCount)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', updateParticleCount)
    }
  }, [])

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.5,
      },
    }),
  }

  const { name, title, greeting, description, highlights, availability, social } = aboutData
  const keywords = ['AI', 'SDE']

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6"
    >
      {/* Morphing gradient blobs - reduced on mobile */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-48 sm:w-80 md:w-96 h-48 sm:h-80 md:h-96 rounded-full opacity-20 sm:opacity-30"
          style={{
            background: 'radial-gradient(circle, #3AA6FF 0%, transparent 70%)',
            filter: 'blur(60px) sm:blur(80px)',
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, -25, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-48 sm:w-80 md:w-96 h-48 sm:h-80 md:h-96 rounded-full opacity-20 sm:opacity-30"
          style={{
            background: 'radial-gradient(circle, #8A2BE2 0%, transparent 70%)',
            filter: 'blur(60px) sm:blur(80px)',
          }}
          animate={{
            x: [0, -50, 0],
            y: [0, 25, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/2 right-1/3 w-40 sm:w-64 md:w-80 h-40 sm:h-64 md:h-80 rounded-full opacity-15 sm:opacity-25"
          style={{
            background: 'radial-gradient(circle, #FF1B8D 0%, transparent 70%)',
            filter: 'blur(60px) sm:blur(80px)',
          }}
          animate={{
            x: [0, 30, 0],
            y: [0, -40, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Particle effects - reduced count on mobile */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(particleCount)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyber-blue rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto max-w-5xl relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="cyber-glass-heavy p-6 sm:p-10 lg:p-16 rounded-2xl sm:rounded-3xl relative overflow-hidden scan-line"
        >
          {/* Holographic corner accents */}
          <div className="absolute top-0 left-0 w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20 border-t-2 border-l-2 border-cyber-blue rounded-tl-2xl sm:rounded-tl-3xl" 
            style={{ boxShadow: '0 0 15px rgba(58, 166, 255, 0.5)' }} 
          />
          <div className="absolute bottom-0 right-0 w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20 border-b-2 border-r-2 border-cyber-purple rounded-br-2xl sm:rounded-br-3xl" 
            style={{ boxShadow: '0 0 15px rgba(138, 43, 226, 0.5)' }} 
          />

          <div className="text-center relative">
            {/* Availability Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full cyber-glass border border-cyber-cyan/50 mb-4 sm:mb-6"
            >
              <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-cyber-cyan pulse-dot" 
                style={{ boxShadow: '0 0 10px #00E8F3' }}
              />
              <span className="text-xs sm:text-sm font-mono text-cyber-cyan">{availability.status}</span>
            </motion.div>

            {/* Greeting */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-cyber-blue text-base sm:text-lg md:text-xl mb-4 sm:mb-6 font-medium tracking-wide"
            >
              {greeting}
            </motion.p>

            {/* Name with letter-by-letter reveal - fluid typography */}
            <div className="mb-4 sm:mb-6">
              <h1 className="font-extrabold mb-2" style={{ fontSize: 'clamp(3rem, 12vw, 9rem)' }}>
                {name.split('').map((letter, i) => (
                  <motion.span
                    key={i}
                    custom={i}
                    variants={letterVariants}
                    initial="hidden"
                    animate="visible"
                    className="inline-block gradient-text-fusion"
                    style={{ textShadow: '0 0 40px rgba(58, 166, 255, 0.6)' }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </h1>
            </div>

            {/* Title with highlighted keywords - fluid typography */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="font-bold mb-6 sm:mb-8 text-white/90"
              style={{ fontSize: 'clamp(1.5rem, 5vw, 3rem)' }}
            >
              {title.split(' ').map((word, i) => 
                keywords.includes(word) ? (
                  <span key={i} className="highlight-keyword font-mono mx-1 sm:mx-2">
                    {word}
                  </span>
                ) : (
                  <span key={i} className="mx-1 sm:mx-2">{word}</span>
                )
              )}
            </motion.h2>

            {/* Subtitle with keywords highlighted - fluid typography */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="text-white/70 max-w-3xl mx-auto mb-6 sm:mb-10 leading-relaxed px-2"
              style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1.25rem)' }}
            >
              {description}
            </motion.p>

            {/* Specializations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
              className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-10"
            >
              {highlights.map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full cyber-glass border border-white/10 hover:border-cyber-blue/50 transition-all duration-300 group"
                >
                  <Sparkles className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-cyber-blue group-hover:text-cyber-cyan transition-colors" />
                  <span className="text-xs sm:text-sm font-medium text-white/80 group-hover:text-white transition-colors">
                    {item}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons with magnetic effect */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-10"
            >
              <motion.a
                href="#projects"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-white bg-gradient-to-r from-cyber-blue to-cyber-purple overflow-hidden group cursor-pointer magnetic-button w-full sm:w-auto text-center text-sm sm:text-base"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Github className="w-4 sm:w-5 h-4 sm:h-5" />
                  View Projects
                </span>
                <motion.span
                  className="absolute inset-0 rounded-full"
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(58, 166, 255, 0.4)',
                      '0 0 40px rgba(138, 43, 226, 0.6)',
                      '0 0 20px rgba(58, 166, 255, 0.4)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.a>

              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold border-2 border-cyber-cyan/50 text-white hover:bg-cyber-cyan/10 transition-all duration-300 cursor-pointer magnetic w-full sm:w-auto text-center comet-trail text-sm sm:text-base"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Mail className="w-4 sm:w-5 h-4 sm:h-5" />
                  Get in Touch
                </span>
              </motion.a>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="flex items-center justify-center gap-3 sm:gap-4"
            >
              {[
                { icon: Github, href: social.github, label: 'GitHub', color: 'cyber-blue' },
                { icon: Linkedin, href: social.linkedin, label: 'LinkedIn', color: 'cyber-purple' },
                { icon: Mail, href: `mailto:${social.email}`, label: 'Email', color: 'cyber-pink' },
                { icon: Download, href: social.resume, label: 'Resume', color: 'cyber-cyan' },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-2 sm:p-3 rounded-full cyber-glass border border-white/10 hover:border-${social.color}/50 transition-all duration-300 group glow-hover`}
                  aria-label={social.label}
                >
                  <social.icon className={`w-4 sm:w-5 h-4 sm:h-5 text-white/70 group-hover:text-${social.color} transition-colors`} />
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Pulse rings */}
          <motion.div
            className="absolute inset-0 rounded-2xl sm:rounded-3xl pointer-events-none"
            animate={{
              boxShadow: [
                '0 0 0 0 rgba(58, 166, 255, 0.4)',
                '0 0 0 20px rgba(58, 166, 255, 0)',
                '0 0 0 0 rgba(58, 166, 255, 0)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="flex justify-center mt-8 sm:mt-12"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center gap-2 cursor-pointer"
          >
            <span className="text-white/50 text-xs sm:text-sm font-medium">Scroll to explore</span>
            <motion.div
              className="w-5 sm:w-6 h-8 sm:h-10 rounded-full border-2 border-white/30 flex justify-center pt-2"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1 h-2 sm:h-3 rounded-full bg-gradient-to-b from-cyber-blue to-cyber-purple"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
