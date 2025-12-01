'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Experience', href: '#experience' },
  { name: 'LinkedIn', href: '#linkedin' },
  { name: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const { scrollY } = useScroll()
  
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ['rgba(255, 255, 255, 0.03)', 'rgba(255, 255, 255, 0.08)']
  )
  
  const borderOpacity = useTransform(
    scrollY,
    [0, 100],
    [0.1, 0.2]
  )

  useEffect(() => {
    const handleScroll = () => {
      const sections = navLinks.map(link => link.href.substring(1))
      
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (href: string) => {
    setIsOpen(false)
    const element = document.getElementById(href.substring(1))
    if (element) {
      const offsetTop = element.offsetTop - 100
      window.scrollTo({ top: offsetTop, behavior: 'smooth' })
    }
  }

  return (
    <>
      <motion.nav
        style={{
          backgroundColor,
        }}
        className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] sm:w-[90%] max-w-6xl rounded-full backdrop-blur-glass border border-white/10 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 shadow-cyber-glow"
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="#home"
            onClick={(e) => {
              e.preventDefault()
              scrollToSection('#home')
            }}
            className="text-xl sm:text-2xl font-bold gradient-text-cyber font-mono tracking-tight group cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative">
              {'<Vinny />'}
              <motion.span
                className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-cyber-blue to-cyber-purple"
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.3 }}
              />
            </span>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {navLinks.map((link, index) => {
              const isActive = activeSection === link.href.substring(1)
              return (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection(link.href)
                  }}
                  className="relative px-5 py-2.5 font-medium text-sm transition-all duration-300 rounded-full group cursor-pointer magnetic"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <span
                    className={`relative z-10 transition-colors duration-300 ${
                      isActive
                        ? 'text-cyber-blue font-bold'
                        : 'text-white/70 group-hover:text-white'
                    }`}
                  >
                    {link.name}
                  </span>
                  
                  {/* Magnetic hover background */}
                  <motion.span
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-cyber-blue/20 to-cyber-purple/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    layoutId={isActive ? 'active-nav' : undefined}
                  />
                  
                  {/* Active neon underline */}
                  {isActive && (
                    <motion.span
                      layoutId="active-indicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-0.5 rounded-full"
                      style={{
                        background: 'linear-gradient(90deg, #3AA6FF, #8A2BE2)',
                        boxShadow: '0 0 10px #3AA6FF, 0 0 20px #8A2BE2',
                      }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.a>
              )
            })}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-3">
            <motion.a
              href="/status"
              className="relative px-5 py-2 font-medium text-sm rounded-full border-2 border-cyber-cyan/50 text-cyber-cyan hover:bg-cyber-cyan/10 overflow-hidden group cursor-hover"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Status
              </span>
            </motion.a>
            
            <motion.a
              href="#contact"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection('#contact')
              }}
              className="relative px-6 py-2.5 font-semibold text-sm rounded-full bg-gradient-to-r from-cyber-blue to-cyber-purple text-white overflow-hidden group cursor-pointer magnetic-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Let's Connect</span>
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-cyber-purple to-cyber-pink opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
              <motion.span
                className="absolute inset-0 rounded-full"
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(58, 166, 255, 0.3)',
                    '0 0 40px rgba(138, 43, 226, 0.4)',
                    '0 0 20px rgba(58, 166, 255, 0.3)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-full cyber-glass-heavy text-white relative z-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle menu"
          >
            <motion.div
              animate={isOpen ? { rotate: 180 } : { rotate: 0 }}
              transition={{ duration: 0.3 }}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.div>
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, x: '100%' }}
        animate={{
          opacity: isOpen ? 1 : 0,
          x: isOpen ? 0 : '100%',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-24 right-6 z-40 lg:hidden w-[90%] max-w-sm cyber-glass-heavy rounded-3xl p-6 shadow-neon-blue"
      >
        <div className="flex flex-col gap-3">
          {navLinks.map((link, index) => {
            const isActive = activeSection === link.href.substring(1)
            return (
              <motion.a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection(link.href)
                  setIsOpen(false)
                }}
                className={`relative px-6 py-3 font-medium text-base rounded-2xl transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-cyber-blue/30 to-cyber-purple/30 text-cyber-blue border border-cyber-blue/50'
                    : 'text-white/80 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {link.name}
                {isActive && (
                  <motion.span
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyber-blue"
                    animate={{
                      boxShadow: [
                        '0 0 5px #3AA6FF',
                        '0 0 15px #3AA6FF',
                        '0 0 5px #3AA6FF',
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.a>
            )
          })}
          
          <motion.a
            href="#contact"
            onClick={(e) => {
              e.preventDefault()
              scrollToSection('#contact')
              setIsOpen(false)
            }}
            className="mt-4 px-6 py-3 font-bold text-base rounded-2xl bg-gradient-to-r from-cyber-blue to-cyber-purple text-white text-center shadow-neon-blue cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileTap={{ scale: 0.95 }}
          >
            Let's Connect
          </motion.a>
        </div>
      </motion.div>

      {/* Mobile Menu Backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
        />
      )}
    </>
  )
}
