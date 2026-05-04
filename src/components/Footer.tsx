'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative py-24 px-6 bg-black border-t border-white/5">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-12 mb-20">
          {/* Brand & Description */}
          <motion.div 
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="sm:col-span-2 md:col-span-2"
          >
            <h2 className="text-2xl font-black text-white tracking-tighter mb-6">VINNY<span className="text-cyber-blue">.</span></h2>
            <p className="text-white/40 max-w-xs leading-relaxed text-sm font-light">
              Engineering the next generation of intelligent systems with a focus on precision, performance, and scalability.
            </p>
          </motion.div>
          
          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-[10px] opacity-60">Navigation</h4>
            <ul className="flex flex-col gap-3">
              {['Home', 'About', 'Projects', 'Skills', 'Contact'].map((item) => (
                <li key={item}>
                  <Link href={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="text-white/40 hover:text-white transition-colors text-xs font-mono lowercase">
                    {`./${item}`}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social */}
          <motion.div
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-[10px] opacity-60">Social</h4>
            <ul className="flex flex-col gap-3">
              {[
                { name: 'GitHub', url: 'https://github.com/VinaySiddha' },
                { name: 'LinkedIn', url: 'https://linkedin.com/in/vinaysiddha' },
                { name: 'Twitter', url: 'https://twitter.com/vinaysiddha' }
              ].map((item) => (
                <li key={item.name}>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors text-xs font-mono lowercase">
                    {`//${item.name}`}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal */}
          <motion.div
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          >
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-[10px] opacity-60">Legal</h4>
            <ul className="flex flex-col gap-3">
              {[
                { name: 'Privacy', href: '/privacy' },
                { name: 'Terms', href: '/terms' },
                { name: 'Status', href: '/status' }
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-white/40 hover:text-white transition-colors text-xs font-mono lowercase">
                    {`sys.${item.name}`}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0, filter: 'blur(5px)' }}
          whileInView={{ opacity: 1, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-white/5 gap-8"
        >
          <p className="text-white/20 text-[10px] font-mono tracking-widest uppercase">
            © {currentYear} VINNY_OS. ALL_RIGHTS_RESERVED.
          </p>
          
          <div className="flex gap-12 text-[9px] font-mono tracking-[0.3em] text-white/10 uppercase">
            <span className="hover:text-cyber-blue transition-colors cursor-default">Precision</span>
            <span className="hover:text-cyber-purple transition-colors cursor-default">Scale</span>
            <span className="hover:text-cyber-cyan transition-colors cursor-default">Intelligence</span>
          </div>

          <div className="text-white/10 text-[9px] font-mono uppercase tracking-widest">
            Engineered in Hyderabad
          </div>
        </motion.div>
      </div>
    </footer>
  )
}


