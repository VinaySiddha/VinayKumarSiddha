'use client'

import { useEffect, useState } from 'react'
import { motion, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([])

  const cursorX = useSpring(0, { stiffness: 500, damping: 28 })
  const cursorY = useSpring(0, { stiffness: 500, damping: 28 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true)
      // Create ripple effect
      const newRipple = { id: Date.now(), x: e.clientX, y: e.clientY }
      setRipples(prev => [...prev, newRipple])
      
      // Remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id))
      }, 1000)
    }

    const handleMouseUp = () => {
      setIsClicking(false)
    }

    const handleHoverElements = () => {
      const hoverElements = document.querySelectorAll('a, button, .cursor-hover, .cursor-pointer')
      
      hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => setIsHovering(true))
        element.addEventListener('mouseleave', () => setIsHovering(false))
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    
    // Delay to ensure DOM is ready
    setTimeout(handleHoverElements, 100)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [cursorX, cursorY])

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
        }}
      >
        <motion.div
          className="relative -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: isClicking ? 0.8 : isHovering ? 1.5 : 1,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          {/* Inner dot */}
          <div className="w-2 h-2 rounded-full bg-white" />
          
          {/* Glow ring */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
            style={{
              borderColor: isHovering ? '#3AA6FF' : '#FFFFFF',
            }}
            animate={{
              width: isHovering ? 40 : 24,
              height: isHovering ? 40 : 24,
              opacity: isHovering ? 0.6 : 0.3,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          />

          {/* Expanding ring on click */}
          {isClicking && (
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-cyber-blue"
              initial={{ width: 0, height: 0, opacity: 0.8 }}
              animate={{ width: 60, height: 60, opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          )}
        </motion.div>
      </motion.div>

      {/* Glow trail */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: cursorX,
          y: cursorY,
        }}
      >
        <motion.div
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl opacity-30"
          style={{
            width: 100,
            height: 100,
            background: 'radial-gradient(circle, #3AA6FF 0%, transparent 70%)',
          }}
          animate={{
            scale: isHovering ? 1.5 : 1,
            opacity: isHovering ? 0.5 : 0.3,
          }}
        />
      </motion.div>

      {/* Click ripples */}
      {ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          className="fixed pointer-events-none z-[9997] rounded-full border-2 border-cyber-blue"
          style={{
            left: ripple.x,
            top: ripple.y,
          }}
          initial={{ width: 0, height: 0, opacity: 0.8, x: '-50%', y: '-50%' }}
          animate={{ width: 120, height: 120, opacity: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      ))}
    </>
  )
}
