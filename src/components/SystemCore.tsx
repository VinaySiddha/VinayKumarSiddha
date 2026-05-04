'use client'

import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { Cpu, Network, Database, Zap, Activity } from 'lucide-react'

const nodes = [
  { label: 'VECTOR_CACHE', icon: Database, color: 'text-cyber-purple', bg: 'bg-cyber-purple/10', border: 'border-cyber-purple/30', pos: '-top-12 -left-12' },
  { label: 'LOGIC_NODE', icon: Network, color: 'text-cyber-blue', bg: 'bg-cyber-blue/10', border: 'border-cyber-blue/30', pos: '-top-12 -right-12' },
  { label: 'JIT_COMPILER', icon: Zap, color: 'text-cyber-cyan', bg: 'bg-cyber-cyan/10', border: 'border-cyber-cyan/30', pos: '-bottom-12 -left-12' },
  { label: 'TELEMETRY', icon: Activity, color: 'text-cyber-pink', bg: 'bg-cyber-pink/10', border: 'border-cyber-pink/30', pos: '-bottom-12 -right-12' },
]

export default function SystemCore() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"]
  })

  // Rising from bottom
  const yReveal = useTransform(scrollYProgress, [0, 1], [300, 0])
  const opacityReveal = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 1])
  const scaleReveal = useTransform(scrollYProgress, [0, 1], [0.7, 1])

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), { stiffness: 100, damping: 30 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), { stiffness: 100, damping: 30 })

  useEffect(() => {
    setIsMounted(true)
  }, [])

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
      className="relative py-48 px-6 bg-black overflow-hidden flex flex-col items-center justify-center min-h-[80vh]"
      style={{ perspective: '2000px' }}
    >
      <div className="flex flex-col items-center text-center mb-32 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
        >
          <span className="text-[10px] font-mono tracking-[0.3em] text-white/40 uppercase">Hardware Topology</span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 40, filter: 'blur(20px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase"
        >
          NEURAL<span className="text-cyber-blue">.</span>ENGINE
        </motion.h2>
      </div>

      <motion.div
        style={{
          y: yReveal,
          scale: scaleReveal,
          opacity: opacityReveal,
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d'
        }}
        className="relative w-[280px] h-[280px] md:w-[350px] md:h-[350px] flex items-center justify-center mt-10"
      >
        {/* Core Chip */}
        <div 
          className="relative w-48 h-48 md:w-56 md:h-56 rounded-3xl bg-[#050505] border border-white/10 shadow-[0_0_80px_rgba(58,166,255,0.15)] flex flex-col items-center justify-center z-20 backdrop-blur-xl"
          style={{ transform: 'translateZ(60px)' }}
        >
          {/* Inner Grid */}
          <div className="absolute inset-2 rounded-2xl border border-white/5 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:10px_10px]" />
          
          <Cpu className="w-12 h-12 text-white mb-4 z-10" />
          <span className="text-[10px] font-mono text-white/60 tracking-widest uppercase z-10">VINNY_M1_CORE</span>
          
          <div className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-cyber-blue animate-pulse shadow-[0_0_15px_#3AA6FF]" />
        </div>

        {/* Orbiting / Attached Nodes */}
        {nodes.map((node, i) => (
          <motion.div
            key={i}
            className={`absolute ${node.pos} flex flex-col items-center gap-3 z-30`}
            style={{ transform: 'translateZ(90px)' }}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + (i * 0.1), type: 'spring' }}
          >
            <div className={`w-14 h-14 rounded-2xl ${node.bg} ${node.border} border backdrop-blur-md flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-xl`}>
              <node.icon className={`w-6 h-6 ${node.color}`} />
            </div>
            <span className="text-[9px] font-mono tracking-widest uppercase text-white/80 bg-black/60 px-2.5 py-1 rounded-md border border-white/10 backdrop-blur-md">
              {node.label}
            </span>
          </motion.div>
        ))}

        {/* Concentric Rings */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-[-20%] border border-dashed border-white/10 rounded-full pointer-events-none"
          style={{ transform: 'translateZ(20px)' }}
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-[-40%] border border-white/5 rounded-full pointer-events-none"
          style={{ transform: 'translateZ(0px)' }}
        >
          <div className="absolute top-0 left-1/2 w-2 h-2 bg-cyber-blue rounded-full shadow-[0_0_10px_#3AA6FF] -translate-x-1/2 -translate-y-1/2" />
        </motion.div>

        {/* Glow */}
        <div className="absolute inset-0 bg-cyber-blue/5 blur-[100px] -z-10 rounded-full" style={{ transform: 'translateZ(-50px)' }} />
      </motion.div>

      {/* Narrative Label */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-32 text-center"
      >
        <p className="text-white/20 text-[10px] font-mono uppercase tracking-[0.4em]">
          Central processing unit synchronized...
        </p>
      </motion.div>
    </section>
  )
}
