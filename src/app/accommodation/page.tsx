'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Landmark, 
  Calendar, 
  Users, 
  IndianRupee, 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle, 
  RefreshCw,
  Search,
  Plus,
  Trash2,
  Undo2,
  Check,
  Lock,
  Unlock,
  Key,
  User,
  ArrowLeft
} from 'lucide-react'

// Backend URL helper
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

interface Member {
  id: string
  name: string
  fri: boolean
  sat: boolean
  sun: boolean
  paid: number
}

interface TripState {
  members: Member[]
  fri_rooms: number
  sat_rooms: number
  sun_rooms: number
  room_cost: number
}

export default function AccommodationPage() {
  const [tripState, setTripState] = useState<TripState>({
    members: [],
    fri_rooms: 7,
    sat_rooms: 2,
    sun_rooms: 4,
    room_cost: 1500
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'saturday' | 'sunday'>('all')
  const [calcMode, setCalcMode] = useState<'flat' | 'dynamic'>('flat') // flat = 375/day, dynamic = split room cost by guests
  const [newMemberName, setNewMemberName] = useState('')
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  // Auth & View Mode State
  const [isAdmin, setIsAdmin] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [authError, setAuthError] = useState(false)

  // Client Form State
  const [clientName, setClientName] = useState('')
  const [clientFri, setClientFri] = useState(true)
  const [clientSat, setClientSat] = useState(false)
  const [clientSun, setClientSun] = useState(false)
  const [clientPaid, setClientPaid] = useState('')
  const [clientSuccess, setClientSuccess] = useState<any | null>(null)

  // Fetch trip state from backend on mount
  useEffect(() => {
    fetchTripState()
    // Check if user is already authenticated in session
    const auth = sessionStorage.getItem('dashboard_auth')
    if (auth === 'true') {
      setIsAdmin(true)
    }
  }, [])

  const fetchTripState = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${getBackendUrl()}/api/trip`)
      if (res.ok) {
        const data = await res.json()
        setTripState(data)
      } else {
        throw new Error('Failed to fetch trip data')
      }
    } catch (err) {
      console.error('Error fetching trip state:', err)
      // Load fallback default state or from localStorage
      const local = localStorage.getItem('trip_settlement_state')
      if (local) {
        setTripState(JSON.parse(local))
      } else {
        // Generate default 28 members
        const defaultMembers: Member[] = []
        for (let i = 1; i <= 28; i++) {
          defaultMembers.push({
            id: `guest_${i}`,
            name: `Guest ${i}`,
            fri: true,
            sat: false,
            sun: false,
            paid: 375 // Paid for Friday stay
          })
        }
        setTripState({
          members: defaultMembers,
          fri_rooms: 7,
          sat_rooms: 2,
          sun_rooms: 4,
          room_cost: 1500
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const saveTripState = async (updatedState: TripState, silent = false) => {
    setSaving(true)
    // Save to local storage first as instant backup
    localStorage.setItem('trip_settlement_state', JSON.stringify(updatedState))
    
    try {
      const res = await fetch(`${getBackendUrl()}/api/trip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedState)
      })
      if (res.ok) {
        if (!silent) {
          showNotification('success', 'Trip calculations saved and synced with cloud database.')
        }
      } else {
        throw new Error('Cloud sync failed')
      }
    } catch (err) {
      console.error('Error saving trip state:', err)
      if (!silent) {
        showNotification('success', 'Saved locally. (Cloud database offline)')
      }
    } finally {
      setSaving(false)
    }
  }

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 4000)
  }

  // Handle input changes
  const handleMemberChange = (id: string, field: keyof Member, value: any) => {
    const updatedMembers = tripState.members.map(m => {
      if (m.id === id) {
        return { ...m, [field]: value }
      }
      return m
    })
    const newState = { ...tripState, members: updatedMembers }
    setTripState(newState)
  }

  const handleRoomCountChange = (field: 'fri_rooms' | 'sat_rooms' | 'sun_rooms', value: number) => {
    const newState = { ...tripState, [field]: Math.max(0, value) }
    setTripState(newState)
  }

  const handleAddMember = () => {
    if (!newMemberName.trim()) return
    const newMember: Member = {
      id: `guest_${Date.now()}`,
      name: newMemberName.trim(),
      fri: true,
      sat: false,
      sun: false,
      paid: 0
    }
    const newState = { ...tripState, members: [...tripState.members, newMember] }
    setTripState(newState)
    setNewMemberName('')
    showNotification('success', `${newMember.name} added to the trip registry.`)
  }

  const handleDeleteMember = (id: string, name: string) => {
    if (confirm(`Remove ${name} from this trip calculations?`)) {
      const updatedMembers = tripState.members.filter(m => m.id !== id)
      const newState = { ...tripState, members: updatedMembers }
      setTripState(newState)
      showNotification('success', `${name} removed.`)
    }
  }

  const handleResetToDefault = () => {
    if (confirm('Reset all members to default (28 members, Friday checked-in, Saturday & Sunday checked-out)? This will overwrite current entries.')) {
      const defaultMembers: Member[] = []
      for (let i = 1; i <= 28; i++) {
        defaultMembers.push({
          id: `guest_${i}`,
          name: `Guest ${i}`,
          fri: true,
          sat: false,
          sun: false,
          paid: 375
        })
      }
      const defaultState = {
        members: defaultMembers,
        fri_rooms: 7,
        sat_rooms: 2,
        sun_rooms: 4,
        room_cost: 1500
      }
      setTripState(defaultState)
      saveTripState(defaultState)
      showNotification('success', 'Trip configuration reset to default 28-member template.')
    }
  }

  // Count active guests per day
  const friGuests = tripState.members.filter(m => m.fri).length
  const satGuests = tripState.members.filter(m => m.sat).length
  const sunGuests = tripState.members.filter(m => m.sun).length

  // Cost calculations
  const friTotalCost = tripState.fri_rooms * tripState.room_cost
  const satTotalCost = tripState.sat_rooms * tripState.room_cost
  const sunTotalCost = tripState.sun_rooms * tripState.room_cost
  const totalTripCost = friTotalCost + satTotalCost + sunTotalCost

  // Day-wise rates per person
  const friRate = calcMode === 'flat' ? 375 : (friGuests > 0 ? friTotalCost / friGuests : 0)
  const satRate = calcMode === 'flat' ? 375 : (satGuests > 0 ? satTotalCost / satGuests : 0)
  const sunRate = calcMode === 'flat' ? 375 : (sunGuests > 0 ? sunTotalCost / sunGuests : 0)

  // Capacity validations
  const satCapacity = tripState.sat_rooms * 4
  const sunCapacity = tripState.sun_rooms * 4
  const isSatOverCapacity = satGuests > satCapacity
  const isSunOverCapacity = sunGuests > sunCapacity

  // Calculate individual guest balances
  const getGuestCost = (member: Member) => {
    let cost = 0
    if (member.fri) cost += friRate
    if (member.sat) cost += satRate
    if (member.sun) cost += sunRate
    return Math.round(cost * 100) / 100
  }

  // Aggregate stats
  const totalCollected = tripState.members.reduce((sum, m) => sum + m.paid, 0)
  
  const guestSettlements = tripState.members.map(m => {
    const expected = getGuestCost(m)
    const diff = m.paid - expected
    return {
      ...m,
      expected,
      diff,
      status: diff === 0 ? 'settled' : (diff > 0 ? 'refund' : 'owes')
    }
  })

  const totalRefunds = guestSettlements.reduce((sum, m) => m.diff > 0 ? sum + m.diff : sum, 0)
  const totalOwed = guestSettlements.reduce((sum, m) => m.diff < 0 ? sum + Math.abs(m.diff) : sum, 0)

  // Filter members based on search and active tab
  const filteredSettlements = guestSettlements.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase())
    if (!matchesSearch) return false

    if (activeTab === 'saturday') {
      return !m.sat && (m.paid > m.expected || m.paid >= 750)
    }
    if (activeTab === 'sunday') {
      return m.sun
    }
    return true
  })

  // Admin Authentication
  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (adminPassword === 'Vinay') {
      setIsAdmin(true)
      setShowAuthModal(false)
      setAdminPassword('')
      setAuthError(false)
      sessionStorage.setItem('dashboard_auth', 'true')
    } else {
      setAuthError(true)
    }
  }

  const handleAdminLogout = () => {
    setIsAdmin(false)
    sessionStorage.removeItem('dashboard_auth')
  }

  // Client registration submit
  const handleClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!clientName.trim()) {
      alert('Please enter your name.')
      return
    }

    const cleanName = clientName.trim()
    const paidVal = parseFloat(clientPaid) || 0

    // Find if guest already exists (case insensitive)
    const existingGuestIndex = tripState.members.findIndex(
      m => m.name.toLowerCase().replace(/\s+/g, '') === cleanName.toLowerCase().replace(/\s+/g, '')
    )

    let updatedMembers = [...tripState.members]
    let targetGuest: Member

    if (existingGuestIndex !== -1) {
      // Update existing guest
      targetGuest = {
        ...updatedMembers[existingGuestIndex],
        fri: clientFri,
        sat: clientSat,
        sun: clientSun,
        paid: paidVal
      }
      updatedMembers[existingGuestIndex] = targetGuest
    } else {
      // Add new guest
      targetGuest = {
        id: `guest_${Date.now()}`,
        name: cleanName,
        fri: clientFri,
        sat: clientSat,
        sun: clientSun,
        paid: paidVal
      }
      updatedMembers.push(targetGuest)
    }

    const updatedState = { ...tripState, members: updatedMembers }
    
    // Save to Firestore and State
    setTripState(updatedState)
    await saveTripState(updatedState, true)

    // Calculate rates and share for client result
    const clientExpected = (clientFri ? friRate : 0) + (clientSat ? satRate : 0) + (clientSun ? sunRate : 0)
    const clientDiff = paidVal - clientExpected

    setClientSuccess({
      name: cleanName,
      expected: clientExpected,
      paid: paidVal,
      diff: clientDiff,
      fri: clientFri,
      sat: clientSat,
      sun: clientSun
    })

    // Reset inputs
    setClientName('')
    setClientFri(true)
    setClientSat(false)
    setClientSun(false)
    setClientPaid('')
  }

  // Client calculations preview
  const previewDays = (clientFri ? 1 : 0) + (clientSat ? 1 : 0) + (clientSun ? 1 : 0)
  const previewExpected = (clientFri ? friRate : 0) + (clientSat ? satRate : 0) + (clientSun ? sunRate : 0)
  const clientPaidNum = parseFloat(clientPaid) || 0
  const previewDiff = clientPaidNum - previewExpected

  return (
    <div className="min-h-screen bg-black text-white px-6 pt-32 pb-24 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full bg-cyber-blue/5 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto z-10 relative">
        
        {/* Header HUD - switches depending on Admin or Client */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 rounded text-[8px] font-mono tracking-widest uppercase font-black ${isAdmin ? 'bg-red-500/10 text-red-400' : 'bg-cyber-blue/10 text-cyber-blue'}`}>
                {isAdmin ? 'Trip Settle Console (ADMIN)' : 'GUEST REGISTRY PORTAL'}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight">
              {isAdmin ? 'ROOM ALLOCATOR & LEDGER' : 'ACCOMMODATION REGISTRY'}
            </h1>
            <p className="text-xs text-white/50 mt-1 font-mono">
              {isAdmin 
                ? 'Track 28 members, day-wise room check-ins, payments, refunds, and collections.' 
                : 'Select the nights you checked in and enter the payment deposited to calculate your settlement.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {isAdmin ? (
              <>
                <button
                  onClick={() => saveTripState(tripState)}
                  disabled={saving}
                  className="py-2.5 px-6 bg-cyber-blue text-black font-mono text-[9px] uppercase font-black tracking-[0.15em] rounded-full hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40"
                >
                  {saving ? <RefreshCw size={12} className="animate-spin" /> : <Check size={12} />}
                  Save & Sync Cloud
                </button>
                <button
                  onClick={handleResetToDefault}
                  className="py-2.5 px-5 bg-white/5 border border-white/10 text-white font-mono text-[9px] uppercase font-bold tracking-[0.1em] rounded-full hover:bg-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Undo2 size={12} />
                  Reset Defaults
                </button>
                <button
                  onClick={handleAdminLogout}
                  className="py-2.5 px-5 bg-red-500/10 border border-red-500/20 text-red-400 font-mono text-[9px] uppercase font-bold tracking-[0.1em] rounded-full hover:bg-red-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Lock size={12} />
                  Exit Admin
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="py-2.5 px-5 bg-white/5 border border-white/10 text-white/60 hover:text-white font-mono text-[9px] uppercase font-bold tracking-[0.15em] rounded-full hover:bg-white/10 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Key size={12} />
                Admin Console
              </button>
            )}
          </div>
        </div>

        {/* Notification Toast */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-6 p-4 rounded-xl border font-mono text-xs flex items-center gap-3 backdrop-blur-xl ${
                notification.type === 'success' 
                  ? 'border-green-500/30 bg-green-950/20 text-green-400' 
                  : 'border-red-500/30 bg-red-950/20 text-red-400'
              }`}
            >
              <CheckCircle size={16} />
              <span>{notification.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* -------------------- CLIENT VIEW -------------------- */}
        {!isAdmin && (
          <div className="max-w-xl mx-auto">
            <AnimatePresence mode="wait">
              {clientSuccess ? (
                /* Registration Success Message */
                <motion.div
                  key="success-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-8 rounded-[32px] bg-white/5 border border-green-500/30 backdrop-blur-xl text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={32} />
                  </div>
                  <h2 className="text-2xl font-black mb-2 tracking-tight uppercase">STAY LOGGED SUCCESSFULLY!</h2>
                  <p className="text-xs text-white/60 mb-6 font-mono">Thank you, <strong className="text-white">{clientSuccess.name}</strong>. Your stay parameters have been registered.</p>

                  <div className="p-6 rounded-2xl bg-black/40 border border-white/5 space-y-3 font-mono text-xs text-white/80 mb-6 text-left">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-white/40">Registered Name:</span>
                      <span className="font-bold text-white">{clientSuccess.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-white/40">Nights Stayed:</span>
                      <span>
                        {[
                          clientSuccess.fri && 'Fri',
                          clientSuccess.sat && 'Sat',
                          clientSuccess.sun && 'Sun'
                        ].filter(Boolean).join(', ') || 'None'}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-white/40">Expected Share:</span>
                      <span className="font-bold text-cyber-blue">₹{clientSuccess.expected}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-white/40">Amount Paid:</span>
                      <span className="font-bold text-green-400">₹{clientSuccess.paid}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1 font-bold">
                      <span className="text-white/40">Status:</span>
                      {clientSuccess.diff === 0 && (
                        <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-[10px] font-bold uppercase border border-green-500/10">
                          Paid Settled
                        </span>
                      )}
                      {clientSuccess.diff > 0 && (
                        <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-[10px] font-bold uppercase border border-yellow-500/10">
                          Refund due: ₹{clientSuccess.diff}
                        </span>
                      )}
                      {clientSuccess.diff < 0 && (
                        <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-[10px] font-bold uppercase border border-red-500/10">
                          Owes: ₹{Math.abs(clientSuccess.diff)}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setClientSuccess(null)}
                    className="w-full py-3.5 bg-cyber-blue text-black font-mono text-[10px] uppercase font-black tracking-[0.2em] rounded-full shadow-lg shadow-cyber-blue/20 hover:brightness-110 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <ArrowLeft size={12} />
                    Register Another Guest / Update
                  </button>
                </motion.div>
              ) : (
                /* Registration Form */
                <motion.div
                  key="form-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl"
                >
                  <form onSubmit={handleClientSubmit} className="space-y-6">
                    {/* Name input */}
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-white/40 tracking-wider mb-2">Guest Full Name</label>
                      <div className="relative flex items-center">
                        <User size={14} className="absolute left-4 text-white/40" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. John Doe"
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 hover:border-white/20 focus:border-cyber-blue outline-none py-3.5 pl-11 pr-4 rounded-xl text-sm transition-all"
                        />
                      </div>
                    </div>

                    {/* Stays Checked Options */}
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-white/40 tracking-wider mb-2.5">Check-In Night(s)</label>
                      <div className="grid grid-cols-3 gap-3">
                        {/* Friday */}
                        <div 
                          onClick={() => setClientFri(!clientFri)}
                          className={`p-3.5 rounded-xl border text-center cursor-pointer transition-all ${
                            clientFri 
                              ? 'bg-cyber-blue/10 border-cyber-blue text-white font-bold' 
                              : 'bg-black/40 border-white/5 text-white/40 hover:border-white/10'
                          }`}
                        >
                          <span className="block text-xs font-mono uppercase">Friday</span>
                          <span className="text-[9px] text-white/40 mt-1 block">Day 1 Stay</span>
                        </div>

                        {/* Saturday */}
                        <div 
                          onClick={() => setClientSat(!clientSat)}
                          className={`p-3.5 rounded-xl border text-center cursor-pointer transition-all ${
                            clientSat 
                              ? 'bg-cyber-blue/10 border-cyber-blue text-white font-bold' 
                              : 'bg-black/40 border-white/5 text-white/40 hover:border-white/10'
                          }`}
                        >
                          <span className="block text-xs font-mono uppercase">Saturday</span>
                          <span className="text-[9px] text-white/40 mt-1 block">Day 2 Stay</span>
                        </div>

                        {/* Sunday */}
                        <div 
                          onClick={() => setClientSun(!clientSun)}
                          className={`p-3.5 rounded-xl border text-center cursor-pointer transition-all ${
                            clientSun 
                              ? 'bg-cyber-blue/10 border-cyber-blue text-white font-bold' 
                              : 'bg-black/40 border-white/5 text-white/40 hover:border-white/10'
                          }`}
                        >
                          <span className="block text-xs font-mono uppercase">Sunday</span>
                          <span className="text-[9px] text-white/40 mt-1 block">Day 3 Stay</span>
                        </div>
                      </div>
                    </div>

                    {/* Rates Info Banner */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-[10px] font-mono text-white/60 leading-relaxed space-y-1">
                      <div>* Standard room rate is ₹1,500/night for a group of 4 guests.</div>
                      <div>* Cost per person per day is flat <strong className="text-cyber-blue">₹375</strong>.</div>
                    </div>

                    {/* Paid Amount */}
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-white/40 tracking-wider mb-2">Amount Paid (₹)</label>
                      <div className="relative flex items-center">
                        <span className="absolute left-4 font-bold text-cyber-blue text-sm">₹</span>
                        <input
                          type="text"
                          inputMode="decimal"
                          required
                          placeholder="e.g. 375"
                          value={clientPaid}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9.]/g, '')
                            setClientPaid(val)
                          }}
                          className="w-full bg-black/40 border border-white/10 hover:border-white/20 focus:border-cyber-blue outline-none py-3 pl-9 pr-4 rounded-xl text-sm font-mono text-white font-bold transition-all"
                        />
                      </div>
                    </div>

                    {/* Live calculations widget */}
                    <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-2 font-mono text-xs text-white/60">
                      <div className="flex justify-between">
                        <span>Total Nights Stayed:</span>
                        <span className="text-white">{previewDays} Night(s)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Expected Share:</span>
                        <span className="text-white font-bold">₹{previewExpected}</span>
                      </div>
                      <div className="flex justify-between border-t border-white/5 pt-2">
                        <span>Deposit Balance:</span>
                        {previewDiff === 0 && <span className="text-green-400">₹0 (Paid Correctly)</span>}
                        {previewDiff < 0 && <span className="text-red-400">Owes ₹{Math.abs(previewDiff)}</span>}
                        {previewDiff > 0 && <span className="text-yellow-400">Refund Due ₹{previewDiff}</span>}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full py-3.5 bg-cyber-blue text-black font-mono text-[10px] uppercase font-black tracking-[0.2em] rounded-full shadow-lg shadow-cyber-blue/20 hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
                    >
                      {saving ? (
                        <RefreshCw size={14} className="animate-spin" />
                      ) : (
                        <Landmark size={14} />
                      )}
                      Register My Stay Details
                    </button>

                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* -------------------- ADMIN VIEW -------------------- */}
        {isAdmin && (
          <div>
            {/* Global Financial Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                <span className="text-white/40 font-mono text-[9px] uppercase tracking-wider block mb-1">Total Rooms Cost</span>
                <div className="text-3xl font-black text-white">₹{totalTripCost.toLocaleString()}</div>
                <span className="text-[9px] text-white/30 font-mono block mt-1">Fri ₹10.5k • Sat ₹3k • Sun ₹6k</span>
              </div>
              
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                <span className="text-white/40 font-mono text-[9px] uppercase tracking-wider block mb-1">Total Collected</span>
                <div className="text-3xl font-black text-green-400">₹{totalCollected.toLocaleString()}</div>
                <span className="text-[9px] text-white/30 font-mono block mt-1">From {tripState.members.length} registered guests</span>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                <span className="text-white/40 font-mono text-[9px] uppercase tracking-wider block mb-1">Saturday Refunds Due</span>
                <div className="text-3xl font-black text-yellow-500">₹{totalRefunds.toLocaleString()}</div>
                <span className="text-[9px] text-yellow-500/60 font-mono block mt-1">Return money to non-stayers</span>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                <span className="text-white/40 font-mono text-[9px] uppercase tracking-wider block mb-1">Uncollected Balance</span>
                <div className="text-3xl font-black text-red-400">₹{totalOwed.toLocaleString()}</div>
                <span className="text-[9px] text-red-400/60 font-mono block mt-1">Pending payments to collect</span>
              </div>
            </div>

            {/* Day-Wise Room Configurations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              
              {/* Friday Details */}
              <div className="p-5 rounded-2xl bg-black/40 border border-white/5 relative">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-xs tracking-wider font-mono text-white/60">DAY 1: FRIDAY NIGHT</span>
                  <span className="px-2 py-0.5 rounded bg-cyber-blue/10 text-cyber-blue text-[9px] font-mono font-bold">
                    {friGuests} Guests
                  </span>
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between items-center bg-white/5 p-2.5 rounded-lg">
                    <span className="text-white/40">Rooms Taken:</span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        value={tripState.fri_rooms}
                        onChange={(e) => handleRoomCountChange('fri_rooms', parseInt(e.target.value) || 0)}
                        className="w-12 bg-black/60 border border-white/10 rounded px-1.5 py-0.5 text-center text-white"
                      />
                      <span>(28 slots)</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Cost:</span>
                    <span>₹{friTotalCost}</span>
                  </div>
                  <div className="flex justify-between font-bold text-cyber-blue pt-1 border-t border-white/5">
                    <span>Per Person Rate:</span>
                    <span>₹{Math.round(friRate * 100) / 100}</span>
                  </div>
                </div>
              </div>

              {/* Saturday Details */}
              <div className={`p-5 rounded-2xl bg-black/40 border relative ${isSatOverCapacity ? 'border-red-500/30' : 'border-white/5'}`}>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-xs tracking-wider font-mono text-white/60">DAY 2: SATURDAY NIGHT</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${isSatOverCapacity ? 'bg-red-500/20 text-red-400' : 'bg-cyber-blue/10 text-cyber-blue'}`}>
                    {satGuests} / {satCapacity} Guests
                  </span>
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between items-center bg-white/5 p-2.5 rounded-lg">
                    <span className="text-white/40">Rooms Taken:</span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        value={tripState.sat_rooms}
                        onChange={(e) => handleRoomCountChange('sat_rooms', parseInt(e.target.value) || 0)}
                        className="w-12 bg-black/60 border border-white/10 rounded px-1.5 py-0.5 text-center text-white"
                      />
                      <span>({satCapacity} slots)</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Cost:</span>
                    <span>₹{satTotalCost}</span>
                  </div>
                  <div className="flex justify-between font-bold text-cyber-blue pt-1 border-t border-white/5">
                    <span>Per Person Rate:</span>
                    <span>₹{Math.round(satRate * 100) / 100}</span>
                  </div>
                </div>
                {isSatOverCapacity && (
                  <div className="absolute -bottom-3 left-4 right-4 bg-red-950 border border-red-500/30 rounded-lg p-1.5 text-[8px] font-mono text-red-400 text-center flex items-center justify-center gap-1">
                    <AlertTriangle size={10} /> Room cap exceeded! Deducted 5 rooms (2 rooms left).
                  </div>
                )}
              </div>

              {/* Sunday Details */}
              <div className={`p-5 rounded-2xl bg-black/40 border relative ${isSunOverCapacity ? 'border-red-500/30' : 'border-white/5'}`}>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-xs tracking-wider font-mono text-white/60">DAY 3: SUNDAY NIGHT</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${isSunOverCapacity ? 'bg-red-500/20 text-red-400' : 'bg-cyber-blue/10 text-cyber-blue'}`}>
                    {sunGuests} / {sunCapacity} Guests
                  </span>
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between items-center bg-white/5 p-2.5 rounded-lg">
                    <span className="text-white/40">Rooms Taken:</span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        value={tripState.sun_rooms}
                        onChange={(e) => handleRoomCountChange('sun_rooms', parseInt(e.target.value) || 0)}
                        className="w-12 bg-black/60 border border-white/10 rounded px-1.5 py-0.5 text-center text-white"
                      />
                      <span>({sunCapacity} slots)</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Cost:</span>
                    <span>₹{sunTotalCost}</span>
                  </div>
                  <div className="flex justify-between font-bold text-cyber-blue pt-1 border-t border-white/5">
                    <span>Per Person Rate:</span>
                    <span>₹{Math.round(sunRate * 100) / 100}</span>
                  </div>
                </div>
                {isSunOverCapacity && (
                  <div className="absolute -bottom-3 left-4 right-4 bg-red-950 border border-red-500/30 rounded-lg p-1.5 text-[8px] font-mono text-red-400 text-center flex items-center justify-center gap-1">
                    <AlertTriangle size={10} /> Room cap exceeded! Check Sunday rooms count.
                  </div>
                )}
              </div>

            </div>

            {/* Filters and Calculation Mode */}
            <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 mb-6">
              {/* Calculation Mode Toggle */}
              <div className="flex items-center gap-3 bg-white/5 p-1.5 rounded-full border border-white/10 max-w-fit">
                <button
                  onClick={() => { setCalcMode('flat'); showNotification('success', 'Calculation set to Flat Rate: ₹375 per day stayed.') }}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase transition-all ${
                    calcMode === 'flat' ? 'bg-cyber-blue text-black' : 'text-white/40 hover:text-white'
                  }`}
                >
                  Flat Rate (₹375/day)
                </button>
                <button
                  onClick={() => { setCalcMode('dynamic'); showNotification('success', 'Calculation set to Dynamic Split: cost/day divided by active guests.') }}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase transition-all ${
                    calcMode === 'dynamic' ? 'bg-cyber-blue text-black' : 'text-white/40 hover:text-white'
                  }`}
                >
                  Dynamic Room Split
                </button>
              </div>

              {/* Quick Find Tabs */}
              <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                    activeTab === 'all' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'
                  }`}
                >
                  All Settlements ({guestSettlements.length})
                </button>
                <button
                  onClick={() => setActiveTab('saturday')}
                  className={`px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 ${
                    activeTab === 'saturday' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 'text-white/40 hover:text-white'
                  }`}
                >
                  <Undo2 size={12} />
                  Saturday Refunds
                </button>
                <button
                  onClick={() => setActiveTab('sunday')}
                  className={`px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 ${
                    activeTab === 'sunday' ? 'bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/20' : 'text-white/40 hover:text-white'
                  }`}
                >
                  <Users size={12} />
                  Sunday Guests ({sunGuests})
                </button>
              </div>
            </div>

            {/* Search and Registry controls */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="relative flex items-center lg:col-span-2">
                <Search size={14} className="absolute left-4 text-white/40" />
                <input
                  type="text"
                  placeholder="Search guest by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-cyber-blue outline-none py-3 pl-11 pr-4 rounded-xl text-sm transition-all"
                />
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add new guest name"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddMember()}
                  className="flex-1 bg-white/5 border border-white/10 hover:border-white/20 focus:border-cyber-blue outline-none py-3 px-4 rounded-xl text-sm transition-all"
                />
                <button
                  onClick={handleAddMember}
                  className="p-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl transition-all flex items-center justify-center"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Main spreadsheet interface */}
            <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-white/15 text-white/40 uppercase tracking-wider">
                      <th className="pb-3 font-semibold">Guest Name</th>
                      <th className="pb-3 font-semibold text-center">Day 1 (Fri)</th>
                      <th className="pb-3 font-semibold text-center">Day 2 (Sat)</th>
                      <th className="pb-3 font-semibold text-center">Day 3 (Sun)</th>
                      <th className="pb-3 font-semibold text-right">Expected Cost</th>
                      <th className="pb-3 font-semibold text-right">Amount Paid</th>
                      <th className="pb-3 font-semibold text-center">Difference</th>
                      <th className="pb-3 font-semibold text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredSettlements.length > 0 ? (
                      filteredSettlements.map((guest) => (
                        <tr key={guest.id} className="text-white/80 hover:bg-white/5 transition-colors">
                          <td className="py-4">
                            <input
                              type="text"
                              value={guest.name}
                              onChange={(e) => handleMemberChange(guest.id, 'name', e.target.value)}
                              className="bg-transparent border-b border-transparent hover:border-white/10 focus:border-cyber-blue focus:bg-black/40 outline-none px-1.5 py-0.5 rounded font-sans font-bold text-white transition-all w-48"
                            />
                          </td>
                          <td className="py-4 text-center">
                            <input
                              type="checkbox"
                              checked={guest.fri}
                              onChange={(e) => handleMemberChange(guest.id, 'fri', e.target.checked)}
                              className="w-4 h-4 rounded border-white/10 accent-cyber-blue bg-black/40 cursor-pointer"
                            />
                          </td>
                          <td className="py-4 text-center">
                            <input
                              type="checkbox"
                              checked={guest.sat}
                              onChange={(e) => handleMemberChange(guest.id, 'sat', e.target.checked)}
                              className="w-4 h-4 rounded border-white/10 accent-cyber-blue bg-black/40 cursor-pointer"
                            />
                          </td>
                          <td className="py-4 text-center">
                            <input
                              type="checkbox"
                              checked={guest.sun}
                              onChange={(e) => handleMemberChange(guest.id, 'sun', e.target.checked)}
                              className="w-4 h-4 rounded border-white/10 accent-cyber-blue bg-black/40 cursor-pointer"
                            />
                          </td>
                          <td className="py-4 text-right text-white/50 font-bold">
                            ₹{guest.expected}
                          </td>
                          <td className="py-4 text-right">
                            <div className="inline-flex items-center bg-black/40 border border-white/5 rounded-lg px-2 py-1 max-w-[100px]">
                              <span className="text-[10px] text-cyber-blue font-bold mr-1">₹</span>
                              <input
                                type="number"
                                value={guest.paid}
                                onChange={(e) => handleMemberChange(guest.id, 'paid', parseFloat(e.target.value) || 0)}
                                className="bg-transparent outline-none w-full text-right font-mono font-bold text-white text-xs hover:bg-black/20 focus:bg-black/60 rounded"
                              />
                            </div>
                          </td>
                          <td className="py-4 text-center">
                            {guest.diff === 0 && (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] uppercase font-bold bg-green-500/10 text-green-400 border border-green-500/10">
                                Settled
                              </span>
                            )}
                            {guest.diff > 0 && (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] uppercase font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/10">
                                Refund ₹{guest.diff}
                              </span>
                            )}
                            {guest.diff < 0 && (
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] uppercase font-bold bg-red-500/10 text-red-400 border border-red-500/10">
                                Owes ₹{Math.abs(guest.diff)}
                              </span>
                            )}
                          </td>
                          <td className="py-4 text-center">
                            <button
                              onClick={() => handleDeleteMember(guest.id, guest.name)}
                              className="p-1.5 hover:bg-red-500/10 text-red-500/60 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 size={12} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-white/20 uppercase tracking-widest font-mono text-[10px]">
                          No guests match the search or filter criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Admin Authorization Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl text-center"
          >
            <div className="w-12 h-12 rounded-full bg-cyber-blue/10 text-cyber-blue flex items-center justify-center mx-auto mb-6">
              <Key size={24} />
            </div>
            <h2 className="text-xl font-black mb-2 tracking-tight">ADMIN AUTHORIZATION</h2>
            <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-6">Access Trip Allocator Settings</p>

            <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 hover:border-white/20 focus:border-cyber-blue outline-none py-3 px-4 rounded-xl text-sm transition-all text-center tracking-widest text-white"
                />
              </div>
              {authError && (
                <p className="text-[10px] font-mono text-red-400">Invalid authorization credentials.</p>
              )}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setShowAuthModal(false); setAuthError(false); setAdminPassword('') }}
                  className="flex-1 py-3 bg-white/5 border border-white/5 text-white/60 font-mono text-[10px] uppercase font-bold rounded-full hover:bg-white/10 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-cyber-blue text-black font-mono text-[10px] uppercase font-black tracking-[0.1em] rounded-full shadow-lg shadow-cyber-blue/20 hover:brightness-110 transition-all cursor-pointer"
                >
                  Verify Access
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  )
}
