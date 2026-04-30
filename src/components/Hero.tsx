'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Github, Linkedin, Mail, Download, Sparkles } from 'lucide-react'
import aboutData from '../../data/about.json'

export default function Hero() {
  const [particleCount, setParticleCount] = useState(20)

  useEffect(() => {
    const updateParticleCount = () => {
      setParticleCount(window.innerWidth < 768 ? 10 : 20)
    }
    updateParticleCount()
    window.addEventListener('resize', updateParticleCount)
    return () => {
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
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6"
    >
      <div className="container mx-auto max-w-5xl relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="cyber-glass-heavy p-5 sm:p-10 lg:p-16 rounded-2xl sm:rounded-3xl relative overflow-hidden scan-line"
        >
          {/* Holographic corner accents */}
          <div className="absolute top-0 left-0 w-8 sm:w-16 md:w-20 h-8 sm:h-16 md:h-20 border-t-2 border-l-2 border-cyber-blue rounded-tl-2xl sm:rounded-tl-3xl opacity-50 sm:opacity-100" 
            style={{ boxShadow: '0 0 15px rgba(58, 166, 255, 0.5)' }} 
          />
          <div className="absolute bottom-0 right-0 w-8 sm:w-16 md:w-20 h-8 sm:h-16 md:h-20 border-b-2 border-r-2 border-cyber-purple rounded-br-2xl sm:rounded-br-3xl opacity-50 sm:opacity-100" 
            style={{ boxShadow: '0 0 15px rgba(138, 43, 226, 0.5)' }} 
          />

          <div className="text-center relative">
            {/* Availability Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full cyber-glass border border-cyber-cyan/30 mb-4 sm:mb-6"
            >
              <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-cyber-cyan pulse-dot" 
                style={{ boxShadow: '0 0 10px #00E8F3' }}
              />
              <span className="text-[10px] sm:text-xs md:text-sm font-mono text-cyber-cyan uppercase tracking-wider">{availability.status}</span>
            </motion.div>

            {/* Greeting */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-cyber-blue text-sm sm:text-lg md:text-xl mb-3 sm:mb-6 font-medium tracking-wide uppercase"
            >
              {greeting}
            </motion.p>

            {/* Name with letter-by-letter reveal - explicit sizes */}
            <div className="mb-4 sm:mb-6">
              <h1 className="font-extrabold mb-2 text-4xl sm:text-6xl md:text-8xl lg:text-[9rem] tracking-tight leading-none">
                {name.split('').map((letter, i) => (
                  <motion.span
                    key={i}
                    custom={i}
                    variants={letterVariants}
                    initial="hidden"
                    animate="visible"
                    className="inline-block gradient-text-fusion"
                    style={{ textShadow: '0 0 30px rgba(58, 166, 255, 0.4)' }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </h1>
            </div>

            {/* Title with highlighted keywords - explicit sizes */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="font-bold mb-4 sm:mb-8 text-white/90 text-lg sm:text-2xl md:text-3xl lg:text-4xl leading-tight"
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

            {/* Subtitle - normal on mobile */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="text-white/70 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2 text-sm sm:text-base md:text-lg"
            >
              {description}
            </motion.p>

            {/* Specializations - normal text and padding */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
              className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10 sm:mb-12"
            >
              {highlights.map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full cyber-glass border border-white/10 hover:border-cyber-blue/50 transition-all duration-300 group"
                >
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyber-blue group-hover:text-cyber-cyan transition-colors" />
                  <span className="text-xs sm:text-sm font-medium text-white/80 group-hover:text-white transition-colors">
                    {item}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons - true full width on mobile, larger padding */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 mb-10 sm:mb-12 w-full max-w-md mx-auto sm:max-w-none"
            >
              <motion.a
                href="#projects"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-full sm:w-auto px-8 py-4 sm:py-4 rounded-full font-bold text-white bg-gradient-to-r from-cyber-blue to-cyber-purple overflow-hidden group cursor-pointer text-base sm:text-lg shadow-lg shadow-cyber-blue/20"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Github className="w-5 h-5" />
                  Explore Projects
                </span>
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-cyber-purple to-cyber-pink opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
              </motion.a>

              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-full sm:w-auto px-8 py-4 sm:py-4 rounded-full font-bold border-2 border-cyber-cyan/50 text-white hover:bg-cyber-cyan/10 transition-all duration-300 cursor-pointer text-base sm:text-lg"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Mail className="w-5 h-5" />
                  Contact Me
                </span>
              </motion.a>
            </motion.div>

            {/* Social Links - larger touch targets */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="flex items-center justify-center gap-5 sm:gap-6"
            >
              {[
                { icon: Github, href: social.github, label: 'GitHub', color: 'text-cyber-blue' },
                { icon: Linkedin, href: social.linkedin, label: 'LinkedIn', color: 'text-cyber-purple' },
                { icon: Mail, href: `mailto:${social.email}`, label: 'Email', color: 'text-cyber-pink' },
                { icon: Download, href: social.resume, label: 'Resume', color: 'text-cyber-cyan' },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-3 sm:p-4 rounded-xl cyber-glass border border-white/10 hover:border-white/20 transition-all duration-300 group`}
                  aria-label={social.label}
                >
                  <social.icon className={`w-6 h-6 text-white/60 group-hover:${social.color} transition-colors`} />
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
