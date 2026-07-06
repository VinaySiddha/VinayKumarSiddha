'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Landmark, Calendar, Users, IndianRupee, CheckCircle, AlertTriangle, AlertCircle, RefreshCw } from 'lucide-react'

const getBackendUrl = () => {
  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    return process.env.NEXT_PUBLIC_BACKEND_URL
  }
  if (typeof window !== 'undefined') {
    return `http://${window.location.hostname}:8000`
  }
  return 'http://localhost:8000'
}

export default function AccommodationPage() {
  const [name, setName] = useState('')
  const [days, setDays] = useState('1')
  const [persons, setPersons] = useState('1')
  const [paid, setPaid] = useState('')
  
  const [submitting, setSubmitting] = useState(false)
  const [successData, setSuccessData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  // Real-time calculations
  const parsedDays = Math.max(1, parseInt(days) || 1)
  const parsedPersons = Math.max(1, parseInt(persons) || 1)
  const parsedPaid = parseFloat(paid) || 0
  const expectedCost = parsedPersons * 375 * parsedDays
  const difference = parsedPaid - expectedCost

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      alert('Please enter guest name.')
      return
    }
    
    setSubmitting(true)
    setError(null)
    setSuccessData(null)
    
    try {
      const res = await fetch(`${getBackendUrl()}/api/accommodation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          days: parsedDays,
          persons: parsedPersons,
          paid: parsedPaid
        })
      })
      if (!res.ok) {
        const errText = await res.text()
        let errMsg = 'Submission failed.'
        try {
          const errJson = JSON.parse(errText)
          errMsg = errJson.detail || errMsg
        } catch {
          errMsg = errText || errMsg
        }
        throw new Error(errMsg)
      }
      const data = await res.json()
      setSuccessData(data)
      // Reset form
      setName('')
      setDays('1')
      setPersons('1')
      setPaid('')
    } catch (err: any) {
      console.error(err)
      setError('Failed to record booking. Please ensure the backend server is running.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 pt-32 pb-24 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-cyber-blue/5 blur-[120px] pointer-events-none" />

      <div className="max-w-xl mx-auto z-10 relative">
        <div className="text-center mb-10">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-cyber-blue font-mono text-[10px] tracking-[0.4em] uppercase mb-2"
          >
            Guest Registry Portal
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-black tracking-tight"
          >
            ACCOMMODATION BOOKING
          </motion.h1>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-950/20 text-red-400 text-xs font-mono flex items-center gap-3"
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </motion.div>
        )}

        <AnimatePresence>
          {successData && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-8 p-6 rounded-[24px] bg-green-950/20 border border-green-500/30 backdrop-blur-xl"
            >
              <div className="flex items-center gap-3 text-green-400 font-bold mb-4 text-sm font-mono uppercase">
                <CheckCircle size={20} />
                Booking Logged Successfully!
              </div>

              <div className="space-y-2.5 text-xs font-mono text-white/80">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-white/40">Guest Name:</span>
                  <span className="font-bold text-white">{successData.name}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-white/40">Stay Duration:</span>
                  <span>{successData.days} Days • {successData.persons} Persons</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-white/40">Total Expected:</span>
                  <span>₹{successData.expected}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-white/40">Amount Deposited:</span>
                  <span>₹{successData.paid}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-white/40">Payment Audit:</span>
                  {successData.status === 'correct' && (
                    <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-[10px] font-bold uppercase">
                      Paid Correctly
                    </span>
                  )}
                  {successData.status === 'less' && (
                    <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-[10px] font-bold uppercase flex items-center gap-1">
                      <AlertTriangle size={10} />
                      Owes ₹{Math.abs(successData.difference)}
                    </span>
                  )}
                  {successData.status === 'extra' && (
                    <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-[10px] font-bold uppercase">
                      Refund ₹{successData.difference}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Booking Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-[10px] font-mono uppercase text-white/40 tracking-wider mb-2">Guest Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Enter guest name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 hover:border-white/20 focus:border-cyber-blue outline-none py-3 px-4 rounded-xl text-sm transition-all"
                />
              </div>
            </div>

            {/* Stay Duration */}
            <div>
              <label className="block text-[10px] font-mono uppercase text-white/40 tracking-wider mb-2">Duration (Days)</label>
              <div className="relative flex items-center">
                <Calendar size={14} className="absolute left-4 text-white/40" />
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  value={days}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '')
                    setDays(val)
                  }}
                  className="w-full bg-black/40 border border-white/10 hover:border-white/20 focus:border-cyber-blue outline-none py-3 pl-11 pr-4 rounded-xl text-sm font-mono transition-all"
                />
              </div>
            </div>

            {/* Price Standard Notification */}
            <div className="p-4 rounded-xl bg-cyber-blue/5 border border-cyber-blue/15 text-[10px] font-mono text-white/60 leading-relaxed">
              * Pricing standard is <strong className="text-cyber-blue">₹375/day</strong> per person.
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
                  placeholder="0.00"
                  value={paid}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9.]/g, '')
                    const parts = val.split('.')
                    const formatted = parts[0] + (parts.length > 1 ? '.' + parts.slice(1).join('') : '')
                    setPaid(formatted)
                  }}
                  className="w-full bg-black/40 border border-white/10 hover:border-white/20 focus:border-cyber-blue outline-none py-3 pl-9 pr-4 rounded-xl text-sm font-mono text-white font-bold transition-all"
                />
              </div>
            </div>

            {/* Real-time Calculation Panel */}
            <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-2 font-mono text-xs text-white/60">
              <div className="flex justify-between">
                <span>Calculated Cost:</span>
                <span className="text-white">₹{expectedCost}</span>
              </div>
              <div className="flex justify-between border-t border-white/5 pt-2 font-bold">
                <span>Deposit Difference:</span>
                {difference === 0 && <span className="text-green-400">₹0 (Paid Correctly)</span>}
                {difference < 0 && <span className="text-red-400">Owes ₹{Math.abs(difference)} (Paid Less)</span>}
                {difference > 0 && <span className="text-yellow-400">Return ₹{difference} (Paid Extra)</span>}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-cyber-blue text-black font-mono text-[10px] uppercase font-black tracking-[0.2em] rounded-full shadow-lg shadow-cyber-blue/20 hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
            >
              {submitting ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : (
                <Landmark size={14} />
              )}
              Log Accommodation Entry
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
