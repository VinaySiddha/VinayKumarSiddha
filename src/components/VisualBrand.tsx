'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Sparkles } from 'lucide-react'

function FadeInWord({ children, progress, range }: { children: string, progress: any, range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.1, 1])
  return (
    <motion.span style={{ opacity }} className="inline-block mr-[0.2em]">
      {children}
    </motion.span>
  )
}

export default function VisualBrand() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const text = "Building Digital Experiences That Actually Matter."
  const words = text.split(" ")

  return (
    <section ref={containerRef} className="relative py-48 px-6 bg-black flex flex-col items-center justify-center text-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-cyber-blue/5 blur-[160px] rounded-full" />
      </div>

      <div className="container mx-auto max-w-5xl z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/40 text-[10px] font-bold uppercase tracking-[0.4em] mb-16"
        >
          <Sparkles size={10} className="text-cyber-blue" />
          The New Standard
        </motion.div>
        
        <h2 className="text-6xl md:text-[9rem] font-black text-white tracking-tighter leading-[0.85] mb-16 flex flex-wrap justify-center">
          {words.map((word, i) => {
            const start = i / words.length
            const end = (i + 1) / words.length
            return (
              <FadeInWord key={i} progress={scrollYProgress} range={[start * 0.4, start * 0.4 + 0.1]}>
                {word}
              </FadeInWord>
            )
          })}
        </h2>
        
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-white/30 text-xl md:text-2xl font-light leading-relaxed tracking-tight"
        >
          I specialize in bridging the gap between <span className="text-white/60">complex artificial intelligence</span> and <span className="text-white/60">intuitive user experiences</span>. Creating high-performance, product-ready solutions for the modern digital landscape.
        </motion.p>
      </div>
    </section>
  )
}
