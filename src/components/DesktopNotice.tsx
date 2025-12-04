'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function DesktopNotice() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if notice was previously dismissed
    const dismissed = localStorage.getItem('desktopNoticeDismissed')
    if (!dismissed) {
      setIsVisible(true)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem('desktopNoticeDismissed', 'true')
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-2xl"
        >
          <div className="bg-gradient-to-r from-cyber-blue/10 to-cyber-purple/10 backdrop-blur-md border border-cyber-blue/30 rounded-lg px-4 py-3 flex items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3 flex-1">
              <span className="text-cyber-cyan text-xl">⚠</span>
              <p className="text-white/90 text-sm">
                This site is currently optimized for desktop. Mobile layout will be added soon. For best experience, view on a larger screen.
              </p>
            </div>
            <button
              onClick={handleDismiss}
              className="text-white/60 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10"
              aria-label="Dismiss notice"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
