'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function Preloader() {
  const [loading, setLoading] = useState(true)
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setLoading(false), 500)
          return 100
        }
        return prev + 1
      })
    }, 20)

    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, filter: 'blur(20px)' }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black"
        >
          <div className="relative w-full max-w-sm px-10">
            {/* The Label */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-between items-end mb-4"
            >
              <span className="text-[10px] font-mono tracking-[0.3em] text-white/40 uppercase">System Initialize</span>
              <span className="text-xl font-black text-white italic">{percent}%</span>
            </motion.div>

            {/* The Minimal Bar */}
            <div className="h-[2px] w-full bg-white/5 relative overflow-hidden">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-white"
                initial={{ width: '0%' }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            {/* Status Trace */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 flex flex-col gap-1"
            >
              <span className="text-[8px] font-mono text-white/20 uppercase tracking-tighter">
                {percent > 20 ? '> LOADING_CORE_ENGINE' : ''}
              </span>
              <span className="text-[8px] font-mono text-white/20 uppercase tracking-tighter">
                {percent > 50 ? '> MOUNTING_AI_MODULES' : ''}
              </span>
              <span className="text-[8px] font-mono text-white/20 uppercase tracking-tighter">
                {percent > 80 ? '> ESTABLISHING_NEURAL_LINK' : ''}
              </span>
            </motion.div>
          </div>

          {/* Background Ambient Reveal */}
          <motion.div 
            className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05)_0%,transparent_70%)]"
            animate={{ 
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

