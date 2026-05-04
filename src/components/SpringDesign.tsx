'use client'

import { motion } from 'framer-motion'

export default function SpringDesign() {
  // Number of segments in the "spring"
  const segments = 20
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20 flex items-center">
      <svg width="100%" height="200" viewBox="0 0 1000 200" preserveAspectRatio="none" className="w-full">
        <motion.path
          d="M 0 100 Q 25 20, 50 100 T 100 100 T 150 100 T 200 100 T 250 100 T 300 100 T 350 100 T 400 100 T 450 100 T 500 100 T 550 100 T 600 100 T 650 100 T 700 100 T 750 100 T 800 100 T 850 100 T 900 100 T 950 100 T 1000 100"
          fill="transparent"
          stroke="url(#springGradient)"
          strokeWidth="1"
          strokeDasharray="5 5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: 1, 
            opacity: 1,
            d: [
              "M 0 100 Q 25 20, 50 100 T 100 100 T 150 100 T 200 100 T 250 100 T 300 100 T 350 100 T 400 100 T 450 100 T 500 100 T 550 100 T 600 100 T 650 100 T 700 100 T 750 100 T 800 100 T 850 100 T 900 100 T 950 100 T 1000 100",
              "M 0 100 Q 25 180, 50 100 T 100 100 T 150 100 T 200 100 T 250 100 T 300 100 T 350 100 T 400 100 T 450 100 T 500 100 T 550 100 T 600 100 T 650 100 T 700 100 T 750 100 T 800 100 T 850 100 T 900 100 T 950 100 T 1000 100",
              "M 0 100 Q 25 20, 50 100 T 100 100 T 150 100 T 200 100 T 250 100 T 300 100 T 350 100 T 400 100 T 450 100 T 500 100 T 550 100 T 600 100 T 650 100 T 700 100 T 750 100 T 800 100 T 850 100 T 900 100 T 950 100 T 1000 100"
            ]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        <defs>
          <linearGradient id="springGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3AA6FF" stopOpacity="0" />
            <stop offset="50%" stopColor="#3AA6FF" stopOpacity="1" />
            <stop offset="100%" stopColor="#8A2BE2" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Floating particles along the spring */}
      {[...Array(segments)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyber-blue rounded-full shadow-[0_0_10px_#3AA6FF]"
          style={{ left: `${(i / segments) * 100}%`, top: '50%' }}
          animate={{
            y: [0, i % 2 === 0 ? -40 : 40, 0],
            opacity: [0.2, 1, 0.2]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}
