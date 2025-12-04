'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Monitor, X } from 'lucide-react'

export default function WarningModal() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    // Check if desktop (screen width >= 1024px)
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    
    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  useEffect(() => {
    // Only show on desktop
    if (!isDesktop) return
    
    // Check if user has already seen the warning
    const hasSeenWarning = localStorage.getItem('portfolio-warning-seen')
    
    if (!hasSeenWarning) {
      // Show warning after a brief delay
      setTimeout(() => setIsVisible(true), 800)
    }
  }, [isDesktop])

  const handleAccept = () => {
    localStorage.setItem('portfolio-warning-seen', 'true')
    setIsVisible(false)
  }

  const handleClose = () => {
    setIsVisible(false)
    // Set a temporary flag that expires after session
    sessionStorage.setItem('portfolio-warning-dismissed', 'true')
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]"
            onClick={handleClose}
          />

          {/* Compact Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md z-[10000]"
          >
            <div className="relative cyber-glass border border-cyan-500/50 rounded-2xl p-6 shadow-2xl">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 text-white/50 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-cyan-500 rounded-full blur-xl opacity-30" />
                  <Monitor className="w-12 h-12 text-cyan-400 relative z-10" />
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold text-center mb-3 text-white">
                Best Viewed on Desktop
              </h2>

              {/* Content */}
              <p className="text-center text-sm text-white/70 mb-5">
                This portfolio is optimized for desktop viewing. Some features and animations work best on larger screens.
              </p>

              {/* Action */}
              <button
                onClick={handleAccept}
                className="w-full px-4 py-2.5 rounded-lg font-medium transition-all
                  bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400
                  text-white shadow-lg shadow-cyan-500/25"
              >
                Got it!
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
