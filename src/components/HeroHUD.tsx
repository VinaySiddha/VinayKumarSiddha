'use client'

import { motion } from 'framer-motion'

export default function HeroHUD() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Rotating Ring 1 */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-cyber-blue/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-cyber-blue rounded-full shadow-[0_0_10px_#3AA6FF]" />
      </motion.div>

      {/* Rotating Ring 2 */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-cyber-purple/10"
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-cyber-purple rounded-full shadow-[0_0_15px_#8A2BE2]" />
      </motion.div>

      {/* Grid Lines */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-cyber-blue to-transparent" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-cyber-purple to-transparent" />
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyber-blue to-transparent" />
        <div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyber-purple to-transparent" />
      </div>

      {/* Corner Markers */}
      <div className="absolute top-10 left-10 w-20 h-20 border-t border-l border-white/20" />
      <div className="absolute top-10 right-10 w-20 h-20 border-t border-r border-white/20" />
      <div className="absolute bottom-10 left-10 w-20 h-20 border-b border-l border-white/20" />
      <div className="absolute bottom-10 right-10 w-20 h-20 border-b border-r border-white/20" />

      {/* Scanning Line */}
      <motion.div
        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-cyan/30 to-transparent shadow-[0_0_20px_#00E8F3]"
        animate={{ y: ['0vh', '100vh'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />
      
      {/* Floating Tech Numbers */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute font-mono text-[10px] text-white/20"
          style={{
            left: `${10 + i * 20}%`,
            top: `${20 + (i % 3) * 20}%`,
          }}
          animate={{
            opacity: [0.1, 0.4, 0.1],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        >
          {Math.random().toString(16).substring(2, 10).toUpperCase()}
        </motion.div>
      ))}
    </div>
  )
}
