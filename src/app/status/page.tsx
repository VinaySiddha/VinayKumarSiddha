'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { CheckCircle, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

interface Incident {
  id: string
  title: string
  status: 'resolved' | 'identified' | 'monitoring'
  date: string
  resolvedTime: string
  identifiedTime: string
  updates: { time: string; message: string; status: string }[]
}

interface StatusHistory {
  date: string
  uptime: number
}

interface StatusData {
  incidents: Incident[]
  history: StatusHistory[]
  overallUptime: number
  currentTime: string
  currentStatus?: {
    status: 'up' | 'down'
    responseTime: number
  }
}

// Client-side monitoring
async function checkWebsiteStatus(url: string): Promise<{ status: 'up' | 'down', responseTime: number }> {
  const startTime = Date.now()
  
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)
    
    const response = await fetch(url, {
      method: 'HEAD',
      mode: 'no-cors', // For cross-origin requests
      cache: 'no-store'
    })
    
    clearTimeout(timeoutId)
    const responseTime = Date.now() - startTime
    
    return {
      status: 'up',
      responseTime
    }
  } catch (error) {
    return {
      status: 'down',
      responseTime: Date.now() - startTime
    }
  }
}

export default function StatusPage() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [statusData, setStatusData] = useState<StatusData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    fetchStatusData()
    // Refresh status every 30 seconds
    const interval = setInterval(fetchStatusData, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchStatusData = async () => {
    try {
      // Check website status
      const websiteUrl = 'https://vinaysiddha.dev'
      const currentStatus = await checkWebsiteStatus(websiteUrl)
      
      // Get stored monitoring data from localStorage
      const storedData = localStorage.getItem('monitoring-history')
      const monitoringHistory: Array<{timestamp: string, status: 'up' | 'down', responseTime: number}> = 
        storedData ? JSON.parse(storedData) : []
      
      // Add current check
      monitoringHistory.push({
        timestamp: new Date().toISOString(),
        status: currentStatus.status,
        responseTime: currentStatus.responseTime
      })
      
      // Keep last 500 checks
      if (monitoringHistory.length > 500) {
        monitoringHistory.splice(0, monitoringHistory.length - 500)
      }
      
      // Save to localStorage
      localStorage.setItem('monitoring-history', JSON.stringify(monitoringHistory))
      
      // Generate 45-day history
      const history: StatusHistory[] = []
      const today = new Date()
      
      for (let i = 44; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        
        const dayStart = new Date(date.setHours(0, 0, 0, 0))
        const dayEnd = new Date(date.setHours(23, 59, 59, 999))
        
        const dayData = monitoringHistory.filter(d => {
          const timestamp = new Date(d.timestamp)
          return timestamp >= dayStart && timestamp <= dayEnd
        })
        
        const uptime = dayData.length > 0
          ? (dayData.filter(d => d.status === 'up').length / dayData.length) * 100
          : 100
        
        history.push({
          date: date.toISOString(),
          uptime: Math.round(uptime * 100) / 100
        })
      }
      
      // Calculate overall uptime
      const overallUptime = monitoringHistory.length > 0
        ? (monitoringHistory.filter(d => d.status === 'up').length / monitoringHistory.length) * 100
        : 100
      
      // Get incidents from localStorage
      const storedIncidents = localStorage.getItem('status-incidents')
      const incidents: Incident[] = storedIncidents ? JSON.parse(storedIncidents) : []
      
      setStatusData({
        currentStatus,
        incidents,
        history,
        overallUptime: Math.round(overallUptime * 100) / 100,
        currentTime: new Date().toISOString()
      })
    } catch (error) {
      console.error('Failed to fetch status:', error)
      
      // Fallback data
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
        incidents: [],
        history,
        overallUptime: 100,
        currentTime: new Date().toISOString()
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading || !statusData) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-2 border-green-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-400">Loading status...</p>
        </div>
      </main>
    )
  }

  const { incidents, history, overallUptime } = statusData

  const getStatusColor = (uptime: number) => {
    if (uptime === 100) return 'bg-green-500'
    if (uptime >= 99) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    }
    return date.toLocaleString('en-US', options)
  }

  return (
    <main className="min-h-screen bg-black text-white py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 text-sm"
          >
            ← Back to Portfolio
          </Link>

          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  M
                </span>
              </h1>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400 mb-1">
                {formatDate(currentTime)}
              </div>
            </div>
          </div>
        </motion.div>

        {/* All Systems Operational Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-12 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-6"
        >
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div>
              <h2 className="text-2xl font-bold text-green-500">All Systems Operational</h2>
              <p className="text-sm text-gray-400 mt-1">
                {formatDate(currentTime)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Status History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-400">vinaysiddha.dev</h3>
            <div className="text-sm">
              <span className="text-green-500 font-bold">{overallUptime}%</span>
              <span className="text-gray-500 ml-1">uptime</span>
            </div>
          </div>

          {/* Uptime bars */}
          <div className="flex gap-[2px] h-10 mb-2">
            {history.map((day, index) => {
              const date = new Date(day.date)
              return (
                <div
                  key={index}
                  className="flex-1 group relative cursor-pointer"
                >
                  <div
                    className={`w-full h-full ${getStatusColor(day.uptime)} transition-opacity hover:opacity-80`}
                  />
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    <div className="font-medium">{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                    <div className="text-gray-400">{day.uptime}% uptime</div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex justify-between text-xs text-gray-500">
            <span>45 days ago</span>
            <span>today</span>
          </div>
        </motion.div>

        {/* Status Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Status</h2>
            <div className="flex items-center gap-4 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Events</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Monitors</a>
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                Get updates
              </button>
            </div>
          </div>
        </motion.div>

        {/* Incidents Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-8"
        >
          {incidents.map((incident) => (
            <div key={incident.id} className="relative">
              {/* Date */}
              <div className="text-sm font-medium text-gray-400 mb-4">{incident.date}</div>

              {/* Incident Card */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-white/20 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-medium">{incident.title}</h3>
                  <span className="text-sm text-gray-400">{incident.updates[0].time}</span>
                </div>

                {/* Status Updates */}
                <div className="space-y-4">
                  {/* Resolved */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-black" />
                      </div>
                      {incident.updates.length > 1 && (
                        <div className="w-px h-full bg-gray-700 mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-green-500">Resolved</span>
                        <span className="text-sm text-gray-500">{incident.resolvedTime}</span>
                      </div>
                      <p className="text-sm text-gray-400">{incident.updates[0].message}</p>
                    </div>
                  </div>

                  {/* Identified */}
                  {incident.updates.length > 1 && (
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                          <AlertTriangle className="w-4 h-4 text-black" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-orange-500">Identified</span>
                          <span className="text-sm text-gray-500">{incident.identifiedTime}</span>
                        </div>
                        <p className="text-sm text-gray-400">{incident.updates[1].message}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* View Events History */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <button className="text-sm text-gray-400 hover:text-white transition-colors">
            View events history
          </button>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 pt-8 border-t border-white/10 text-center"
        >
          <p className="text-sm text-gray-500">
            powered by{' '}
            <a
              href="https://openstatus.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              vinaysiddha.dev
            </a>
          </p>
          <p className="text-xs text-gray-600 mt-2">
            Monitoring Region:{' '}
            <span className="text-gray-500">Asia/Calcutta</span>
          </p>
        </motion.footer>
      </div>
    </main>
  )
}
