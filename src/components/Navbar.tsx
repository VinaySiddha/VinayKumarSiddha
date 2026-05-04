'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Experience', href: '/experience' },
  { name: 'Projects', href: '/projects' },
  { name: 'Skills', href: '/skills' },
  { name: 'Social', href: '/social' },
  { name: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center pointer-events-none">
      {/* Brand - Left */}
      <Link href="/" className="pointer-events-auto">
        <motion.div
          className="text-xl font-black text-white tracking-tighter cursor-pointer flex items-center gap-1"
          whileHover={{ scale: 1.05 }}
        >
          VINAY SIDDHA<span className="text-cyber-blue">.</span>
        </motion.div>
      </Link>

      {/* Modern Center Nav - Floating Pill */}
      <div className="hidden md:flex items-center pointer-events-auto">
        <motion.div
          className={`
            flex items-center gap-1 p-1.5 rounded-full border transition-all duration-500
            ${scrolled 
              ? 'bg-black/60 backdrop-blur-xl border-white/10 shadow-2xl scale-95' 
              : 'bg-white/5 backdrop-blur-md border-white/5'}
          `}
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link key={link.name} href={link.href}>
                <motion.div
                  className={`
                    px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest cursor-pointer transition-all
                    ${isActive 
                      ? 'bg-white text-black shadow-lg shadow-white/10' 
                      : 'text-white/40 hover:text-white hover:bg-white/5'}
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {link.name}
                </motion.div>
              </Link>
            )
          })}
        </motion.div>
      </div>

      {/* CTA - Right */}
      <div className="hidden md:block pointer-events-auto">
        <Link href="/contact">
          <motion.div
            className="px-6 py-2.5 bg-cyber-blue text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg shadow-cyber-blue/20 cursor-pointer flex items-center gap-2 group"
            whileHover={{ scale: 1.05, filter: 'brightness(1.1)' }}
          >
            Initiate
            <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </motion.div>
        </Link>
      </div>

      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-3 rounded-full bg-white/5 border border-white/10 text-white pointer-events-auto"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Overlay Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-40 bg-black flex flex-col items-center justify-center gap-8 md:hidden pointer-events-auto"
          >
            <div className="flex flex-col items-center gap-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link href={link.href} onClick={() => setIsOpen(false)}>
                    <span className="text-3xl font-black text-white tracking-tighter uppercase">
                      {link.name}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
            <Link href="/contact" onClick={() => setIsOpen(false)}>
              <div className="mt-4 px-10 py-4 bg-cyber-blue text-black font-black uppercase tracking-widest rounded-full">
                Connect
              </div>
            </Link>
            
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/5 border border-white/10 text-white"
            >
              <X size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
