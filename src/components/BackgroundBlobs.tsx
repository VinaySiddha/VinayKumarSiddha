'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const BackgroundBlobs = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Blob 1 - Purple (Essential) */}
      <motion.div
        animate={isMobile ? {
          x: [0, 40, 0],
          y: [0, -40, 0],
        } : {
          x: [0, 100, 0],
          y: [0, -100, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: isMobile ? 15 : 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-0 left-0 w-72 h-72 sm:w-96 sm:h-96 bg-neonPurple opacity-[0.12] sm:opacity-20 blob"
        style={{ filter: isMobile ? 'blur(80px)' : 'blur(100px)' }}
      />

      {/* Blob 2 - Blue (Essential) */}
      <motion.div
        animate={isMobile ? {
          x: [0, -40, 0],
          y: [0, 40, 0],
        } : {
          x: [0, -150, 0],
          y: [0, 100, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: isMobile ? 18 : 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 right-0 w-80 h-80 sm:w-[500px] sm:h-[500px] bg-neonBlue opacity-[0.12] sm:opacity-20 blob"
        style={{ filter: isMobile ? 'blur(80px)' : 'blur(100px)' }}
      />

      {/* Blob 3 - Pink (Desktop Only) */}
      {!isMobile && (
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -80, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-0 left-1/4 w-[450px] h-[450px] bg-neonPink opacity-15 blob"
          style={{ filter: 'blur(100px)' }}
        />
      )}

      {/* Blob 4 - Cyan (Desktop Only) */}
      {!isMobile && (
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 120, 0],
            scale: [1, 1.25, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-400 opacity-10 blob"
          style={{ filter: 'blur(100px)' }}
        />
      )}
    </div>
  )
}

export default BackgroundBlobs
