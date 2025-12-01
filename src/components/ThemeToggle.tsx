'use client'

import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setIsDark(savedTheme === 'dark')
      document.documentElement.classList.toggle('light', savedTheme === 'light')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
    document.documentElement.classList.toggle('light', !newTheme)
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full cyber-glass-heavy border-2 border-cyber-blue/50 flex items-center justify-center cursor-hover group"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      style={{
        boxShadow: isDark 
          ? '0 0 30px rgba(58, 166, 255, 0.4)' 
          : '0 0 30px rgba(255, 215, 0, 0.4)',
      }}
    >
      <motion.div
        animate={{ rotate: isDark ? 0 : 180 }}
        transition={{ duration: 0.5 }}
      >
        {isDark ? (
          <Sun className="w-6 h-6 text-yellow-400" />
        ) : (
          <Moon className="w-6 h-6 text-cyber-blue" />
        )}
      </motion.div>

      {/* Ripple effect */}
      <motion.span
        className="absolute inset-0 rounded-full border-2"
        style={{
          borderColor: isDark ? '#3AA6FF' : '#FFD700',
        }}
        animate={{
          scale: [1, 1.5],
          opacity: [0.5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeOut',
        }}
      />
    </motion.button>
  )
}
