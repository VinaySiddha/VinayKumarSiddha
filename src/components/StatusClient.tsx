'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Activity, Shield, Cpu, Zap, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface StatusHistory {
  date: string
  uptime: number
}

interface StatusData {
  history: StatusHistory[]
  overallUptime: number
  currentTime: string
}

export default function StatusClient() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [statusData, setStatusData] = useState<StatusData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Generate simulated history for the new theme
    const history: StatusHistory[] = []
    const today = new Date()
    for (let i = 44; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      history.push({
        date: date.toISOString(),
        uptime: 100
      })
    }

    setStatusData({
      history,
      overallUptime: 100,
      currentTime: new Date().toISOString()
    })
    setLoading(false)
  }, [])

  if (loading || !statusData) return null

  const { history, overallUptime } = statusData

  return (
    <main className="relative min-h-screen bg-black text-white py-32 px-6 overflow-hidden">
      <div className="container mx-auto max-w-4xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors duration-300 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-mono uppercase tracking-widest">Back to Workspace</span>
          </Link>
        </motion.div>

        <div className="flex flex-col items-start mb-16 border-l-2 border-green-500 pl-8">
          <motion.div
            initial={{ opacity: 0, x: -10, filter: 'blur(5px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8 }}
            className="text-[10px] font-mono tracking-[0.3em] text-green-500 uppercase mb-2"
          >
            Monitor_Node: //SYSTEM_STATUS
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 40, filter: 'blur(20px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="text-4xl md:text-6xl font-black text-white tracking-tighter"
          >
            OPERATIONAL<span className="text-green-500">.</span>
          </motion.h1>
        </div>

        {/* Status Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {[
            { label: 'Core_Uptime', value: `${overallUptime}%`, icon: Activity, color: 'text-green-500' },
            { label: 'Security_Mesh', value: 'Active', icon: Shield, color: 'text-cyber-blue' },
            { label: 'JIT_Compiler', value: 'Ready', icon: Zap, color: 'text-cyber-cyan' }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="bg-[#0a0a0a] p-6 rounded-2xl border border-white/5 flex flex-col justify-between h-32"
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">{stat.label}</span>
                <stat.icon className={`w-4 h-4 ${stat.color} opacity-40`} />
              </div>
              <span className="text-2xl font-black text-white font-mono">{stat.value}</span>
            </motion.div>
          ))}
        </div>

        {/* Uptime Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: 0.7 }}
          className="bg-[#0a0a0a] p-8 rounded-2xl border border-white/5"
        >
          <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
            <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em]">Runtime_Stability_History</span>
            <span className="text-[10px] font-mono text-green-500">Node: vinaysiddha.dev</span>
          </div>

          <div className="flex gap-[3px] h-12">
            {history.map((day, index) => (
              <div
                key={index}
                className="flex-1 group relative"
              >
                <div className="w-full h-full bg-green-500/20 rounded-sm hover:bg-green-500 transition-colors" />
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 bg-[#111] border border-white/10 rounded-lg text-[10px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                  {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: {day.uptime}%
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between mt-4 text-[8px] font-mono text-white/10 uppercase tracking-widest">
            <span>T-45 Days</span>
            <span>Real_Time</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 text-center"
        >
          <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.4em]">
            System timestamp: {currentTime.toLocaleTimeString()}
          </p>
        </motion.div>
      </div>

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-1/3 h-screen bg-green-500/5 blur-[120px] pointer-events-none" />
    </main>
  )
}
