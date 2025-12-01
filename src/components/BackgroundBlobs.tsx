'use client'

import { motion } from 'framer-motion'

const BackgroundBlobs = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Blob 1 - Purple */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-0 left-0 w-96 h-96 bg-neonPurple opacity-20 blob"
        style={{ filter: 'blur(100px)' }}
      />

      {/* Blob 2 - Blue */}
      <motion.div
        animate={{
          x: [0, -150, 0],
          y: [0, 100, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-neonBlue opacity-20 blob"
        style={{ filter: 'blur(100px)' }}
      />

      {/* Blob 3 - Pink */}
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

      {/* Blob 4 - Cyan */}
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

      {/* Additional small blobs for depth */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, -50, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/2 left-1/3 w-64 h-64 bg-neonBlue opacity-10 blob"
        style={{ filter: 'blur(80px)' }}
      />

      <motion.div
        animate={{
          x: [0, -70, 0],
          y: [0, 60, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 19,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-2/3 right-1/3 w-72 h-72 bg-neonPurple opacity-15 blob"
        style={{ filter: 'blur(90px)' }}
      />
    </div>
  )
}

export default BackgroundBlobs
