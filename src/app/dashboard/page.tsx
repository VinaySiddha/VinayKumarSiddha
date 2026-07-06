'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Image as ImageIcon, Video as VideoIcon, UserCheck, HardDrive, RefreshCw, AlertCircle, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react'

interface MediaFile {
  id: string
  filename: string
  type: string
  status: string
  error: string
  upload_date: string
  file_size: number
  thumbnail_url?: string
}

interface DashboardStats {
  total_images: number
  total_videos: number
  total_faces: number
  total_persons: number
  total_size_bytes: number
  worker_status: string
  recent_media: MediaFile[]
}

const getBackendUrl = () => {
  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    return process.env.NEXT_PUBLIC_BACKEND_URL
  }
  if (typeof window !== 'undefined') {
    return `http://${window.location.hostname}:8000`
  }
  return 'http://localhost:8000'
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [rebuilding, setRebuilding] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [accommodationLogs, setAccommodationLogs] = useState<any[]>([])

  const fetchStats = async () => {
    try {
      const res = await fetch(`${getBackendUrl()}/api/dashboard/stats`)
      if (!res.ok) throw new Error('Failed to fetch dashboard statistics.')
      const data = await res.json()
      setStats(data)
      setError(null)
    } catch (err: any) {
      console.error(err)
      setError('Could not connect to the backend server. Make sure it is running on port 8000.')
    } finally {
      setLoading(false)
    }
  }

  const fetchAccommodation = async () => {
    try {
      const res = await fetch(`${getBackendUrl()}/api/accommodation`)
      if (res.ok) {
        const data = await res.json()
        setAccommodationLogs(data)
      }
    } catch (err) {
      console.error("Failed to fetch accommodation logs:", err)
    }
  }

  useEffect(() => {
    fetchStats()
    fetchAccommodation()
    const interval = setInterval(() => {
      fetchStats()
      fetchAccommodation()
    }, 10000) // Poll stats every 10s
    return () => clearInterval(interval)
  }, [])

  const handleRebuildIndex = async () => {
    setRebuilding(true)
    try {
      const res = await fetch(`${getBackendUrl()}/api/admin/rebuild-index`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })
      if (!res.ok) throw new Error('Rebuild failed.')
      alert('FAISS vector indexes successfully rebuilt!')
      fetchStats()
    } catch (err: any) {
      alert(`Error rebuilding indexes: ${err.message}`)
    } finally {
      setRebuilding(false)
    }
  }

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  }

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white px-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="p-4 rounded-full border border-cyber-blue/30 text-cyber-blue mb-4"
        >
          <RefreshCw size={32} />
        </motion.div>
        <span className="font-mono text-sm tracking-widest text-white/50 uppercase">Loading System Health...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 pt-32 pb-24 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-cyber-blue/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto z-10 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-cyber-blue font-mono text-[10px] tracking-[0.4em] uppercase mb-2"
            >
              Enterprise Media Console
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-black tracking-tight"
            >
              AI ANALYTICS DASHBOARD
            </motion.h1>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRebuildIndex}
            disabled={rebuilding}
            className="flex items-center gap-2 px-6 py-3 border border-purple-500/30 bg-purple-950/20 hover:bg-purple-900/30 text-purple-300 font-mono text-[10px] uppercase font-bold tracking-widest rounded-full transition-all duration-300 shadow-lg shadow-purple-500/10 cursor-pointer disabled:opacity-50"
          >
            {rebuilding ? (
              <RefreshCw size={12} className="animate-spin" />
            ) : (
              <Cpu size={12} />
            )}
            Rebuild Vector Index
          </motion.button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-4 rounded-xl border border-red-500/30 bg-red-950/20 text-red-400 text-xs font-mono flex items-center gap-3"
          >
            <ShieldAlert size={16} />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Card 1: Images */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="p-6 rounded-[24px] bg-white/5 border border-white/10 backdrop-blur-xl relative overflow-hidden group hover:border-cyber-blue/30 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-white/40 font-mono text-[10px] tracking-wider uppercase">Total Stored Images</span>
              <div className="p-2 rounded-lg bg-cyber-blue/10 text-cyber-blue">
                <ImageIcon size={18} />
              </div>
            </div>
            <h3 className="text-4xl font-black mb-1">{stats?.total_images ?? 0}</h3>
            <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Active Frame Repositories</p>
          </motion.div>

          {/* Card 2: Videos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-[24px] bg-white/5 border border-white/10 backdrop-blur-xl relative overflow-hidden group hover:border-purple-500/30 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-white/40 font-mono text-[10px] tracking-wider uppercase">Total Stored Videos</span>
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                <VideoIcon size={18} />
              </div>
            </div>
            <h3 className="text-4xl font-black mb-1">{stats?.total_videos ?? 0}</h3>
            <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Motion Footage Batches</p>
          </motion.div>

          {/* Card 3: AI Vectors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="p-6 rounded-[24px] bg-white/5 border border-white/10 backdrop-blur-xl relative overflow-hidden group hover:border-pink-500/30 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-white/40 font-mono text-[10px] tracking-wider uppercase">Indexed Faces & Bodies</span>
              <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
                <UserCheck size={18} />
              </div>
            </div>
            <h3 className="text-4xl font-black mb-1">
              {(stats?.total_faces ?? 0) + (stats?.total_persons ?? 0)}
            </h3>
            <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
              {stats?.total_faces ?? 0} Faces / {stats?.total_persons ?? 0} Bodies
            </p>
          </motion.div>

          {/* Card 4: Storage */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-[24px] bg-white/5 border border-white/10 backdrop-blur-xl relative overflow-hidden group hover:border-white/20 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-white/40 font-mono text-[10px] tracking-wider uppercase">Storage Allocation</span>
              <div className="p-2 rounded-lg bg-white/10 text-white/60">
                <HardDrive size={18} />
              </div>
            </div>
            <h3 className="text-4xl font-black mb-1">{formatBytes(stats?.total_size_bytes ?? 0)}</h3>
            <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest flex items-center gap-1.5">
              Worker: 
              <span className={`inline-block w-2 h-2 rounded-full ${stats?.worker_status === 'online' ? 'bg-green-500 shadow-lg shadow-green-500/50' : 'bg-red-500'}`} />
              <span className="uppercase font-bold text-[9px]">{stats?.worker_status ?? 'offline'}</span>
            </p>
          </motion.div>
        </div>

        {/* Console logs / Recent Media files */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Queue Table */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl"
          >
            <h2 className="text-2xl font-black mb-6 tracking-tight flex items-center gap-2">
              PROCESSING QUEUE STATUS
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-white/15 text-white/40 uppercase tracking-wider">
                    <th className="pb-3 font-semibold">File Name</th>
                    <th className="pb-3 font-semibold">Type</th>
                    <th className="pb-3 font-semibold">Size</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {stats?.recent_media && stats.recent_media.length > 0 ? (
                    stats.recent_media.map((file) => (
                      <tr key={file.id} className="text-white/80 hover:bg-white/5 transition-colors">
                        <td className="py-4 font-sans font-bold max-w-[200px] truncate">{file.filename}</td>
                        <td className="py-4 uppercase text-[10px] text-white/40">{file.type}</td>
                        <td className="py-4 text-white/50">{formatBytes(file.file_size)}</td>
                        <td className="py-4">
                          <span className={`
                            inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] uppercase font-bold
                            ${file.status === 'completed' ? 'bg-green-500/10 text-green-400' : ''}
                            ${file.status === 'processing' ? 'bg-blue-500/10 text-blue-400 animate-pulse' : ''}
                            ${file.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' : ''}
                            ${file.status === 'failed' ? 'bg-red-500/10 text-red-400' : ''}
                          `}>
                            {file.status === 'completed' && <CheckCircle2 size={10} />}
                            {file.status === 'failed' && <AlertCircle size={10} />}
                            {file.status === 'processing' && <RefreshCw size={10} className="animate-spin" />}
                            {file.status}
                          </span>
                          {file.status === 'failed' && (
                            <span className="block text-[9px] text-red-500/80 mt-1 max-w-[180px] truncate" title={file.error}>
                              {file.error}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-white/20 uppercase tracking-widest font-mono text-[10px]">
                        No active file processes found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Quick Preview Panel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl"
          >
            <h2 className="text-2xl font-black mb-6 tracking-tight">RECENT INGESTION</h2>
            <div className="grid grid-cols-2 gap-4">
              {stats?.recent_media && stats.recent_media.filter(f => f.status === 'completed').length > 0 ? (
                stats.recent_media
                  .filter(file => file.status === 'completed')
                  .slice(0, 4)
                  .map((file) => (
                    <div key={file.id} className="relative aspect-square rounded-xl bg-black/40 border border-white/5 overflow-hidden group">
                      <img
                        src={file.thumbnail_url || file.filename}
                        alt={file.filename}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[9px] font-sans font-bold text-white truncate">{file.filename}</span>
                        <span className="text-[8px] font-mono text-cyber-blue uppercase">{file.type}</span>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="col-span-2 py-12 flex flex-col items-center justify-center text-white/20 border border-dashed border-white/10 rounded-xl">
                  <span className="uppercase text-[9px] font-mono tracking-widest">No preview thumbnails available</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Guest Accommodation Audit Log */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl"
        >
          <h2 className="text-2xl font-black mb-6 tracking-tight flex items-center gap-2">
            GUEST ACCOMMODATION AUDITS
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-white/15 text-white/40 uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Guest Name</th>
                  <th className="pb-3 font-semibold">Duration (Days)</th>
                  <th className="pb-3 font-semibold">Guest Count</th>
                  <th className="pb-3 font-semibold">Expected Cost</th>
                  <th className="pb-3 font-semibold">Amount Paid</th>
                  <th className="pb-3 font-semibold">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {accommodationLogs.length > 0 ? (
                  accommodationLogs.map((log) => (
                    <tr key={log.id} className="text-white/80 hover:bg-white/5 transition-colors">
                      <td className="py-4 font-sans font-bold">{log.name}</td>
                      <td className="py-4 text-white/50">{log.days} Days</td>
                      <td className="py-4 text-white/50">{log.persons} Persons</td>
                      <td className="py-4 text-white/50">₹{log.expected}</td>
                      <td className="py-4 font-bold">₹{log.paid}</td>
                      <td className="py-4">
                        {log.status === 'correct' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] uppercase font-bold bg-green-500/10 text-green-400">
                            <CheckCircle2 size={10} />
                            Paid Correctly
                          </span>
                        )}
                        {log.status === 'less' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] uppercase font-bold bg-red-500/10 text-red-400">
                            <AlertCircle size={10} />
                            Owes ₹{Math.abs(log.difference)}
                          </span>
                        )}
                        {log.status === 'extra' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] uppercase font-bold bg-yellow-500/10 text-yellow-400">
                            <AlertCircle size={10} />
                            Refund ₹{log.difference}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-white/20 uppercase tracking-widest font-mono text-[10px]">
                      No guest accommodation records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
