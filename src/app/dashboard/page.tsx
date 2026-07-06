'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Image as ImageIcon, 
  Video as VideoIcon, 
  UserCheck, 
  HardDrive, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  ShieldAlert, 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  Key, 
  DoorOpen, 
  UserPlus, 
  X,
  Cpu
} from 'lucide-react'

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

interface Room {
  id: string
  name: string
  cost: number
  guests: string[]
}

const getBackendUrl = () => {
  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    return process.env.NEXT_PUBLIC_BACKEND_URL
  }
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return `http://${window.location.hostname}:8000`
    }
  }
  return 'https://media-ai-backend-376409105264.us-central1.run.app'
}

export default function Dashboard() {
  // Password Protection State
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [passwordError, setPasswordError] = useState(false)

  // Core Stats state
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [rebuilding, setRebuilding] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [accommodationLogs, setAccommodationLogs] = useState<any[]>([])

  // Room Manager State
  const [rooms, setRooms] = useState<Room[]>([])
  const [loadingRooms, setLoadingRooms] = useState(true)
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null)
  const [editingCostValue, setEditingCostValue] = useState('')
  const [newGuestInputs, setNewGuestInputs] = useState<Record<string, string>>({})

  // Verify authentication on mount
  useEffect(() => {
    const auth = sessionStorage.getItem('dashboard_auth')
    if (auth === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordInput === 'Vinay') {
      sessionStorage.setItem('dashboard_auth', 'true')
      setIsAuthenticated(true)
      setPasswordError(false)
    } else {
      setPasswordError(true)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('dashboard_auth')
    setIsAuthenticated(false)
    setPasswordInput('')
  }

  // Fetch core statistics
  const fetchStats = async () => {
    try {
      const res = await fetch(`${getBackendUrl()}/api/dashboard/stats`)
      if (!res.ok) throw new Error('Failed to fetch dashboard statistics.')
      const data = await res.json()
      setStats(data)
      setError(null)
    } catch (err: any) {
      console.error(err)
      setError('Could not connect to the backend server. Make sure it is running.')
    } finally {
      setLoading(false)
    }
  }

  // Fetch guest accommodation logs
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

  // Fetch Rooms config
  const fetchRooms = async () => {
    try {
      const res = await fetch(`${getBackendUrl()}/api/rooms`)
      if (res.ok) {
        const data = await res.json()
        setRooms(data)
      }
    } catch (err) {
      console.error("Failed to fetch rooms:", err)
    } finally {
      setLoadingRooms(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats()
      fetchAccommodation()
      fetchRooms()
      const interval = setInterval(() => {
        fetchStats()
        fetchAccommodation()
        fetchRooms()
      }, 10000) // Poll every 10s
      return () => clearInterval(interval)
    }
  }, [isAuthenticated])

  const handleRebuildIndex = async () => {
    setRebuilding(true)
    try {
      const res = await fetch(`${getBackendUrl()}/api/admin/rebuild-index`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })
      if (!res.ok) throw new Error('Rebuild failed.')
      alert('Index rebuilding completed successfully.')
      fetchStats()
    } catch (err: any) {
      alert(`Index rebuild failed: ${err.message}`)
    } finally {
      setRebuilding(false)
    }
  }

  // Room Management Actions
  const handleSaveRoom = async (room: Room) => {
    try {
      const res = await fetch(`${getBackendUrl()}/api/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(room)
      })
      if (res.ok) {
        const updated = await res.json()
        setRooms(prev => prev.map(r => r.id === room.id ? updated : r))
      }
    } catch (err) {
      console.error("Failed to save room:", err)
    }
  }

  const handleAddGuest = (roomId: string) => {
    const guestName = newGuestInputs[roomId]?.trim()
    if (!guestName) return
    
    const targetRoom = rooms.find(r => r.id === roomId)
    if (!targetRoom) return
    
    if (targetRoom.guests.length >= 4) {
      alert("This room is already full (maximum 4 guests).")
      return
    }

    const updatedRoom = {
      ...targetRoom,
      guests: [...targetRoom.guests, guestName]
    }

    // Save to Firestore and state
    handleSaveRoom(updatedRoom)
    setNewGuestInputs(prev => ({ ...prev, [roomId]: '' }))
  }

  const handleDeleteGuest = (roomId: string, guestIndex: number) => {
    const targetRoom = rooms.find(r => r.id === roomId)
    if (!targetRoom) return

    const updatedGuests = [...targetRoom.guests]
    updatedGuests.splice(guestIndex, 1)

    const updatedRoom = {
      ...targetRoom,
      guests: updatedGuests
    }

    handleSaveRoom(updatedRoom)
  }

  const handleStartEditCost = (room: Room) => {
    setEditingRoomId(room.id)
    setEditingCostValue(room.cost.toString())
  }

  const handleSaveCost = (roomId: string) => {
    const targetRoom = rooms.find(r => r.id === roomId)
    if (!targetRoom) return

    const parsedCost = parseFloat(editingCostValue) || 0
    const updatedRoom = {
      ...targetRoom,
      cost: parsedCost
    }

    handleSaveRoom(updatedRoom)
    setEditingRoomId(null)
  }

  // Format helper for storage bytes
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  }

  // Render Login Card if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute w-[600px] h-[600px] rounded-full bg-cyber-blue/5 blur-[120px] pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl text-center"
        >
          <div className="w-12 h-12 rounded-full bg-cyber-blue/10 text-cyber-blue flex items-center justify-center mx-auto mb-6">
            <Key size={24} />
          </div>
          <h1 className="text-2xl font-black mb-2 tracking-tight">ADMINISTRATOR PORTAL</h1>
          <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-6">Security authorization required</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Enter password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-black/40 border border-white/10 hover:border-white/20 focus:border-cyber-blue outline-none py-3 px-4 rounded-xl text-sm transition-all text-center tracking-widest"
              />
            </div>
            {passwordError && (
              <p className="text-[10px] font-mono text-red-400">Invalid authorization credentials.</p>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-cyber-blue text-black font-mono text-[10px] uppercase font-black tracking-[0.2em] rounded-full shadow-lg shadow-cyber-blue/20 hover:brightness-110 transition-all cursor-pointer"
            >
              Verify Security Code
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  // Render dashboard contents if authenticated
  return (
    <div className="min-h-screen bg-black text-white px-6 pt-32 pb-24 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full bg-cyber-blue/5 blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto z-10 relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <p className="text-cyber-blue font-mono text-[10px] tracking-[0.4em] uppercase mb-2">Operations Center</p>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight">MEDIA INTEL CONSOLE</h1>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleRebuildIndex}
              disabled={rebuilding}
              className="py-2.5 px-6 bg-white/5 border border-white/10 text-white font-mono text-[9px] uppercase font-bold tracking-[0.15em] rounded-full hover:bg-white/10 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40"
            >
              <RefreshCw size={12} className={rebuilding ? 'animate-spin' : ''} />
              Rebuild Vector Index
            </button>
            <button
              onClick={handleLogout}
              className="py-2.5 px-6 bg-red-500/10 border border-red-500/20 text-red-400 font-mono text-[9px] uppercase font-bold tracking-[0.15em] rounded-full hover:bg-red-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <X size={12} />
              Exit Panel
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-xl border border-red-500/30 bg-red-950/20 text-red-400 text-xs font-mono flex items-center gap-3">
            <ShieldAlert size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* 1. Main Statistics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-[24px] bg-white/5 border border-white/10 backdrop-blur-xl"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-white/40 font-mono text-[10px] tracking-wider uppercase">Ingested Images</span>
              <div className="p-2 rounded-lg bg-white/10 text-white/60">
                <ImageIcon size={18} />
              </div>
            </div>
            <h3 className="text-4xl font-black mb-1">{loading ? '...' : stats?.total_images}</h3>
            <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Images</p>
          </motion.div>

          {/* Videos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="p-6 rounded-[24px] bg-white/5 border border-white/10 backdrop-blur-xl"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-white/40 font-mono text-[10px] tracking-wider uppercase">Ingested Videos</span>
              <div className="p-2 rounded-lg bg-white/10 text-white/60">
                <VideoIcon size={18} />
              </div>
            </div>
            <h3 className="text-4xl font-black mb-1">{loading ? '...' : stats?.total_videos}</h3>
            <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Videos</p>
          </motion.div>

          {/* Faces */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-[24px] bg-white/5 border border-white/10 backdrop-blur-xl"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-white/40 font-mono text-[10px] tracking-wider uppercase">Indexed Faces</span>
              <div className="p-2 rounded-lg bg-white/10 text-cyber-blue">
                <UserCheck size={18} />
              </div>
            </div>
            <h3 className="text-4xl font-black mb-1">{loading ? '...' : stats?.total_faces}</h3>
            <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Embeddings</p>
          </motion.div>

          {/* Persons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="p-6 rounded-[24px] bg-white/5 border border-white/10 backdrop-blur-xl"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-white/40 font-mono text-[10px] tracking-wider uppercase">Indexed Persons</span>
              <div className="p-2 rounded-lg bg-white/10 text-cyber-blue">
                <Cpu size={18} />
              </div>
            </div>
            <h3 className="text-4xl font-black mb-1">{loading ? '...' : stats?.total_persons}</h3>
            <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">ReID Nodes</p>
          </motion.div>

          {/* Storage Used */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-[24px] bg-white/5 border border-white/10 backdrop-blur-xl col-span-2 lg:col-span-1"
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

        {/* 2. Room Manager Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
              <DoorOpen className="text-cyber-blue" />
              DYNAMIC ROOM MANAGER
            </h2>
            <span className="text-[10px] font-mono uppercase text-white/40">Capped at 4 guests/room</span>
          </div>

          {loadingRooms ? (
            <div className="py-12 text-center text-white/20 font-mono uppercase text-xs animate-pulse">
              Syncing rooms from database...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {rooms.map((room) => {
                const isEditing = editingRoomId === room.id
                const filledSlots = room.guests.length
                const perPersonCost = filledSlots > 0 ? Math.round((room.cost / filledSlots) * 100) / 100 : 0

                return (
                  <div 
                    key={room.id} 
                    className="p-5 rounded-2xl bg-black/40 border border-white/5 hover:border-white/10 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      {/* Room Header */}
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-bold text-sm tracking-tight text-white">{room.name}</span>
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold ${filledSlots === 4 ? 'bg-red-500/10 text-red-400' : 'bg-cyber-blue/10 text-cyber-blue'}`}>
                          {filledSlots}/4 Slots
                        </span>
                      </div>

                      {/* Daily Cost Controller */}
                      <div className="mb-4 bg-white/5 p-3 rounded-xl border border-white/5 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-white/40 font-mono uppercase">Cost/Day:</span>
                          {isEditing ? (
                            <input
                              type="text"
                              inputMode="numeric"
                              value={editingCostValue}
                              onChange={(e) => setEditingCostValue(e.target.value.replace(/[^0-9.]/g, ''))}
                              className="w-20 bg-black/60 border border-white/10 px-2 py-0.5 rounded text-xs font-mono text-white text-center focus:border-cyber-blue outline-none"
                            />
                          ) : (
                            <span className="text-xs font-bold text-cyber-blue font-mono">₹{room.cost}</span>
                          )}
                        </div>
                        {isEditing ? (
                          <div className="flex gap-1">
                            <button 
                              onClick={() => handleSaveCost(room.id)}
                              className="p-1 rounded bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                            >
                              <Save size={12} />
                            </button>
                            <button 
                              onClick={() => setEditingRoomId(null)}
                              className="p-1 rounded bg-white/5 text-white/40 hover:bg-white/10 transition-colors"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleStartEditCost(room)}
                            className="p-1 rounded hover:bg-white/5 text-white/40 hover:text-white transition-colors"
                          >
                            <Edit size={12} />
                          </button>
                        )}
                      </div>

                      {/* Room Guests List */}
                      <div className="space-y-1.5 mb-4">
                        <span className="block text-[8px] font-mono uppercase text-white/30 tracking-wider">Allocated Guests</span>
                        {room.guests.length > 0 ? (
                          room.guests.map((g, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-white/5 px-2.5 py-1.5 rounded-lg text-xs font-mono">
                              <span className="truncate pr-2 font-sans font-bold">{g}</span>
                              <button 
                                onClick={() => handleDeleteGuest(room.id, idx)}
                                className="text-red-500/60 hover:text-red-500 p-0.5 transition-colors cursor-pointer"
                              >
                                <Trash2 size={10} />
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="py-3 text-center border border-dashed border-white/5 rounded-xl text-[9px] text-white/20 uppercase font-mono">
                            Empty Room
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Add Guest & Calculation footer */}
                    <div className="space-y-3 pt-3 border-t border-white/5">
                      {/* Add guest input */}
                      {room.guests.length < 4 ? (
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            placeholder="Guest Name"
                            value={newGuestInputs[room.id] || ''}
                            onChange={(e) => setNewGuestInputs(prev => ({ ...prev, [room.id]: e.target.value }))}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddGuest(room.id)}
                            className="flex-1 bg-black/60 border border-white/5 px-2.5 py-1.5 rounded-xl text-[10px] outline-none focus:border-cyber-blue/30"
                          />
                          <button 
                            onClick={() => handleAddGuest(room.id)}
                            className="p-1.5 bg-cyber-blue text-black rounded-xl hover:brightness-110 transition-all flex items-center justify-center cursor-pointer"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      ) : (
                        <div className="py-1.5 text-center bg-red-950/10 border border-red-500/10 rounded-xl text-[9px] text-red-400 font-mono uppercase font-bold">
                          Room Full Capacity
                        </div>
                      )}

                      {/* Share Calculation */}
                      <div className="flex justify-between text-[9px] font-mono text-white/40 pt-1">
                        <span>Share / Guest:</span>
                        <span className="font-bold text-white">₹{perPersonCost}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </motion.div>

        {/* 3. Ingestion Queue Section */}
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

        {/* 4. Guest Accommodation Audit Log */}
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
