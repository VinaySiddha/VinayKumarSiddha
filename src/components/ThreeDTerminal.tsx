'use client'

import { motion, useScroll, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { Terminal as TerminalIcon, Cpu, Zap, Activity } from 'lucide-react'

const commands = [
  { cmd: 'vinny --init-intelligence', output: 'INITIALIZING_NEURAL_WEIGHTS... [OK]' },
  { cmd: 'vinny --deploy-rag', output: 'MOUNTING_VECTOR_DATABASE: PINECONE... [CONNECTED]' },
  { cmd: 'vinny --agent-mesh', output: 'CONNECTING_MULTI_AGENT_MESH... [ESTABLISHED]' },
  { cmd: 'vinny --status', output: 'SYSTEM_STATUS: OPTIMIZED | UPTIME: 99.9%' },
]

export default function ThreeDTerminal() {
  const [visibleCommands, setVisibleCommands] = useState<number>(0)
  const [isMounted, setIsMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Scroll-linked 3D animation
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"]
  })

  // Transformations for the 'Rising' effect - intensified for visible 3D
  const yReveal = useTransform(scrollYProgress, [0, 1], [600, 0])
  const rotateXReveal = useTransform(scrollYProgress, [0, 1], [60, 0]) // Steeper initial tilt
  const scaleReveal = useTransform(scrollYProgress, [0, 1], [0.5, 1]) // More dramatic scale
  const opacityReveal = useTransform(scrollYProgress, [0, 0.3, 1], [0, 0.2, 1])

  // 3D Tilt state (mouse interaction combined with scroll)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const mouseRotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [20, -20]), { stiffness: 100, damping: 30 }) // Increased tilt range
  const mouseRotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-25, 25]), { stiffness: 100, damping: 30 }) // Increased tilt range

  useEffect(() => {
    setIsMounted(true)
    // Only start typing when terminal is mostly revealed
    const unsubscribe = scrollYProgress.on("change", (v) => {
      if (v > 0.8 && visibleCommands === 0) {
        const interval = setInterval(() => {
          setVisibleCommands(prev => (prev < commands.length ? prev + 1 : prev))
        }, 800)
        return () => clearInterval(interval)
      }
    })
    return () => unsubscribe()
  }, [scrollYProgress, visibleCommands])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  if (!isMounted) return null

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0) }}
      className="relative py-64 px-6 bg-black overflow-hidden flex flex-col items-center justify-center min-h-screen"
      style={{ perspective: '2000px' }} // Global perspective for the whole section
    >
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-cyber-blue/20 animate-pulse" />
      </div>

      <motion.div
        style={{
          y: yReveal,
          rotateX: rotateXReveal,
          scale: scaleReveal,
          opacity: opacityReveal,
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full max-w-4xl"
      >
        <motion.div
          style={{
            rotateX: mouseRotateX,
            rotateY: mouseRotateY,
            transformStyle: 'preserve-3d',
          }}
          className="bg-[#050505] border border-white/10 rounded-2xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-[#0a0a0a] px-6 py-4 border-b border-white/5 flex items-center justify-between" style={{ transform: 'translateZ(30px)' }}>
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              </div>
              <div className="h-4 w-px bg-white/10 mx-1" />
              <div className="flex items-center gap-2">
                <TerminalIcon size={12} className="text-white/40" />
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">vinny@runtime: ~</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[9px] font-mono text-cyber-blue opacity-60">
              <Activity size={10} className="animate-pulse" />
              LIVE_SHELL
            </div>
          </div>

          {/* Content */}
          <div className="p-10 font-mono text-xs md:text-sm min-h-[400px] flex flex-col gap-6" style={{ transform: 'translateZ(50px)' }}>
            <AnimatePresence>
              {commands.slice(0, visibleCommands).map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-cyber-blue font-bold tracking-tighter">❯</span>
                    <span className="text-white font-medium">{item.cmd}</span>
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-white/40 pl-6 border-l border-white/5 italic"
                  >
                    {item.output}
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {visibleCommands < commands.length ? (
              <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="w-2 h-4 bg-cyber-blue mt-2"
              />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1 rounded bg-cyber-blue/10 border border-cyber-blue/20 shadow-[0_0_15px_rgba(58,166,255,0.2)]">
                    <Cpu size={10} className="text-cyber-blue" />
                    <span className="text-[9px] font-bold text-cyber-blue uppercase tracking-tighter">AI_CORE_ACTIVE</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded bg-cyber-purple/10 border border-cyber-purple/20 shadow-[0_0_15px_rgba(138,43,226,0.2)]">
                    <Zap size={10} className="text-cyber-purple" />
                    <span className="text-[9px] font-bold text-cyber-purple uppercase tracking-tighter">JIT_READY</span>
                  </div>
                </div>
                <span className="text-[9px] font-mono text-white/20 uppercase tracking-[0.3em]">Runtime Stable</span>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* 3D Shadows & Accents */}
        <div className="absolute -inset-8 bg-gradient-to-tr from-cyber-blue/10 to-cyber-purple/10 blur-3xl -z-10 rounded-[3rem]" style={{ transform: 'translateZ(-20px)' }} />
      </motion.div>

      {/* Narrative Label */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-20 text-center"
      >
        <p className="text-white/20 text-[10px] font-mono uppercase tracking-[0.4em]">
          Executing architectural protocols...
        </p>
      </motion.div>
    </section>
  )
}
