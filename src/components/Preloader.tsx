'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function Preloader() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-cyber-dark"
        >
          {/* Animated background blobs */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-30"
            style={{
              background: 'radial-gradient(circle, #3AA6FF 0%, transparent 70%)',
              filter: 'blur(100px)',
            }}
            animate={{
              scale: [1, 1.3, 1],
              x: [0, 50, 0],
              y: [0, -50, 0],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-30"
            style={{
              background: 'radial-gradient(circle, #8A2BE2 0%, transparent 70%)',
              filter: 'blur(100px)',
            }}
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -50, 0],
              y: [0, 50, 0],
            }}
            transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
          />

          {/* Logo morph animation */}
          <div className="relative z-10">
            <motion.div
              className="relative w-32 h-32"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 180, 360],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              {/* Outer ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-transparent"
                style={{
                  background: 'linear-gradient(45deg, #3AA6FF, #8A2BE2, #FF1B8D, #00E8F3)',
                  backgroundClip: 'padding-box',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                  padding: '4px',
                }}
                animate={{
                  rotate: [0, -360],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              />

              {/* Inner morphing shape */}
              <motion.div
                className="absolute inset-4 bg-gradient-to-br from-cyber-blue to-cyber-purple flex items-center justify-center text-4xl font-bold text-white"
                animate={{
                  borderRadius: [
                    '60% 40% 30% 70% / 60% 30% 70% 40%',
                    '30% 60% 70% 40% / 50% 60% 30% 60%',
                    '60% 40% 30% 70% / 60% 30% 70% 40%',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  boxShadow: '0 0 40px rgba(58, 166, 255, 0.6), 0 0 80px rgba(138, 43, 226, 0.4)',
                }}
              >
                V
              </motion.div>

              {/* Orbiting particles */}
              {[0, 120, 240].map((angle, index) => (
                <motion.div
                  key={index}
                  className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-cyber-cyan"
                  style={{
                    transformOrigin: '0 0',
                  }}
                  animate={{
                    rotate: [angle, angle + 360],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    rotate: { duration: 3, repeat: Infinity, ease: 'linear' },
                    scale: { duration: 1, repeat: Infinity, ease: 'easeInOut' },
                  }}
                >
                  <div
                    className="w-full h-full rounded-full"
                    style={{
                      transform: `translateX(60px)`,
                      boxShadow: '0 0 10px #00E8F3',
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Loading text */}
            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-2xl font-bold gradient-text-fusion mb-2">
                Loading <span className="highlight-keyword font-mono">Experience</span>
              </h2>
              
              {/* Progress bar */}
              <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyber-blue via-cyber-purple to-cyber-cyan"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2.5, ease: 'easeInOut' }}
                  style={{
                    boxShadow: '0 0 20px rgba(58, 166, 255, 0.8)',
                  }}
                />
              </div>

              {/* Loading dots */}
              <div className="flex justify-center gap-2 mt-4">
                {[0, 1, 2].map((index) => (
                  <motion.div
                    key={index}
                    className="w-2 h-2 rounded-full bg-cyber-blue"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: index * 0.2,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
