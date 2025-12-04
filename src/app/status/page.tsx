'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Activity, Server, Zap, Clock, CheckCircle, AlertTriangle, XCircle, TrendingUp, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import axios from 'axios'

interface StatusData {
  uptime: number
  responseTime: number
  lastChecked: string
  status: 'operational' | 'degraded' | 'down'
  services: {
    name: string
    status: 'operational' | 'degraded' | 'down'
    responseTime: number
  }[]
  history: {
    timestamp: string
    uptime: number
    responseTime: number
  }[]
}

export default function StatusPage() {
  const [statusData, setStatusData] = useState<StatusData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Use mock data for static export (Cloudflare Pages)
    setStatusData(mockStatusData)
    setLoading(false)
    
    // Optional: You can still update this with client-side fetch to external monitoring service
    // const interval = setInterval(fetchStatus, 10000)
    // return () => clearInterval(interval)
  }, [])

  const fetchStatus = async () => {
    try {
      // For Cloudflare deployment, you can fetch from external monitoring API
      // or use Cloudflare Workers for server-side logic
      setStatusData(mockStatusData)
    } catch (error) {
      console.error('Status fetch error:', error)
      setStatusData(mockStatusData)
    } finally {
      setLoading(false)
    }
  }

  const mockStatusData: StatusData = {
    uptime: 99.98,
    responseTime: 142,
    lastChecked: new Date().toISOString(),
    status: 'operational',
    services: [
      { name: 'Website', status: 'operational', responseTime: 98 },
      { name: 'API Server', status: 'operational', responseTime: 156 },
      { name: 'Database', status: 'operational', responseTime: 23 },
      { name: 'CDN', status: 'operational', responseTime: 45 },
    ],
    history: Array.from({ length: 30 }, (_, i) => ({
      timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      uptime: 99.5 + Math.random() * 0.5,
      responseTime: 100 + Math.random() * 100,
    })).reverse(),
  }

  const data = statusData || mockStatusData

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return { bg: 'bg-green-500/10', border: 'border-green-500/50', text: 'text-green-400', icon: CheckCircle }
      case 'degraded':
        return { bg: 'bg-yellow-500/10', border: 'border-yellow-500/50', text: 'text-yellow-400', icon: AlertTriangle }
      case 'down':
        return { bg: 'bg-red-500/10', border: 'border-red-500/50', text: 'text-red-400', icon: XCircle }
      default:
        return { bg: 'bg-gray-500/10', border: 'border-gray-500/50', text: 'text-gray-400', icon: Activity }
    }
  }

  const statusColor = getStatusColor(data.status)
  const StatusIcon = statusColor.icon

  return (
    <main className="relative min-h-screen bg-cyber-dark py-20 px-6 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyber-dark via-cyber-blue/5 to-cyber-dark" />
      <motion.div
        className="absolute top-1/4 right-1/3 w-96 h-96 rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, #00E8F3 0%, transparent 70%)',
          filter: 'blur(120px)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-cyber-blue hover:text-cyber-cyan transition-colors mb-8 cursor-hover"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-mono text-sm">Back to Portfolio</span>
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <Activity className="w-12 h-12 text-cyber-cyan" />
            <h1 className="text-5xl md:text-6xl font-bold gradient-text-fusion">
              System <span className="highlight-keyword font-mono">Status</span>
            </h1>
          </div>
          <p className="text-white/60 text-lg">Real-time monitoring and uptime statistics</p>
        </motion.div>

        {/* Overall Status Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`cyber-glass-heavy p-8 rounded-3xl mb-8 border-2 ${statusColor.border} ${statusColor.bg}`}
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <StatusIcon className={`w-12 h-12 ${statusColor.text}`} />
              </motion.div>
              <div>
                <h2 className={`text-3xl font-bold ${statusColor.text} mb-1`}>
                  {data.status === 'operational' && 'All Systems Operational'}
                  {data.status === 'degraded' && 'Partial Outage'}
                  {data.status === 'down' && 'Major Outage'}
                </h2>
                <p className="text-white/50 text-sm font-mono">
                  Last checked: {new Date(data.lastChecked).toLocaleString()}
                </p>
              </div>
            </div>
            {loading && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-8 h-8 border-2 border-cyber-blue border-t-transparent rounded-full"
              />
            )}
          </div>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="cyber-glass p-6 rounded-2xl relative overflow-hidden group"
          >
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-green-400" />
              <span className="text-3xl font-bold text-green-400">{data.uptime.toFixed(2)}%</span>
            </div>
            <h3 className="text-white/70 font-medium mb-1">Uptime</h3>
            <p className="text-white/40 text-sm font-mono">Last 30 days</p>
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-cyan-500"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: data.uptime / 100 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="cyber-glass p-6 rounded-2xl relative overflow-hidden group"
          >
            <div className="flex items-center justify-between mb-4">
              <Zap className="w-8 h-8 text-cyber-blue" />
              <span className="text-3xl font-bold text-cyber-blue">{data.responseTime}ms</span>
            </div>
            <h3 className="text-white/70 font-medium mb-1">Response Time</h3>
            <p className="text-white/40 text-sm font-mono">Average latency</p>
            <motion.div
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: 'radial-gradient(circle at center, rgba(58, 166, 255, 0.1), transparent)' }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="cyber-glass p-6 rounded-2xl relative overflow-hidden group"
          >
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-8 h-8 text-cyber-purple" />
              <span className="text-3xl font-bold text-cyber-purple">24/7</span>
            </div>
            <h3 className="text-white/70 font-medium mb-1">Monitoring</h3>
            <p className="text-white/40 text-sm font-mono">Always online</p>
            <motion.div
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: 'radial-gradient(circle at center, rgba(138, 43, 226, 0.1), transparent)' }}
            />
          </motion.div>
        </div>

        {/* Services Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="cyber-glass-heavy p-8 rounded-3xl mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Server className="w-6 h-6 text-cyber-cyan" />
            Service Status
          </h2>
          <div className="space-y-4">
            {data.services.map((service, index) => {
              const serviceColor = getStatusColor(service.status)
              const ServiceIcon = serviceColor.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group cursor-hover"
                >
                  <div className="flex items-center gap-4">
                    <ServiceIcon className={`w-5 h-5 ${serviceColor.text}`} />
                    <span className="text-white font-medium">{service.name}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-white/50 text-sm font-mono">{service.responseTime}ms</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${serviceColor.bg} ${serviceColor.border} ${serviceColor.text} border`}>
                      {service.status}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Uptime History Graph */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="cyber-glass-heavy p-8 rounded-3xl"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-green-400" />
            30-Day Uptime History
          </h2>
          <div className="flex items-end gap-1 h-32">
            {data.history.map((entry, index) => (
              <motion.div
                key={index}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.3, delay: 0.9 + index * 0.02 }}
                className="flex-1 group relative cursor-hover"
              >
                <div
                  className={`w-full rounded-t transition-all duration-300 ${
                    entry.uptime >= 99.9 ? 'bg-green-500' : entry.uptime >= 99 ? 'bg-yellow-500' : 'bg-red-500'
                  } group-hover:opacity-80`}
                  style={{ height: `${entry.uptime}%` }}
                />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-cyber-dark border border-white/20 rounded text-xs font-mono text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {new Date(entry.timestamp).toLocaleDateString()}: {entry.uptime.toFixed(2)}%
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-white/40 font-mono">
            <span>30 days ago</span>
            <span>Today</span>
          </div>
        </motion.div>

        {/* API Setup Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-8 cyber-glass p-6 rounded-2xl border border-purple-500/30 bg-purple-500/5"
        >
          <p className="text-xs text-purple-400 font-mono leading-relaxed">
            🔧 <strong>Configure Real Monitoring:</strong> Create <code className="bg-white/10 px-2 py-1 rounded">/api/status</code> endpoint with actual uptime monitoring. Options:
            <br />• Use UptimeRobot API (uptimerobot.com)
            <br />• Use Pingdom API (pingdom.com)
            <br />• Use StatusCake API (statuscake.com)
            <br />• Build custom monitoring with Node.js + cron jobs
          </p>
        </motion.div>
      </div>
    </main>
  )
}
