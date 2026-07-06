'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadCloud, FolderOpen, File, Play, Pause, X, AlertTriangle, Check, RefreshCw } from 'lucide-react'

interface UploadQueueItem {
  id: string
  file: File
  relativePath: string
  progress: number
  status: 'pending' | 'uploading' | 'paused' | 'completed' | 'failed' | 'duplicate'
  error?: string
  speed?: string // KB/s or MB/s
  eta?: string // Time remaining
  xhr?: XMLHttpRequest
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
const CONCURRENT_LIMIT = 3 // Number of concurrent uploads

export default function UploadPage() {
  const [queue, setQueue] = useState<UploadQueueItem[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)
  const activeUploadsCount = useRef(0)

  // Drag handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files) {
      addFilesToQueue(Array.from(e.dataTransfer.files))
    }
  }

  // Handle files selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFilesToQueue(Array.from(e.target.files))
    }
  }

  // Handle folder selection (recursive HTML5 folder select)
  const handleFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      // Extract paths for recursive structure
      const queueItems = filesArray.map(file => ({
        file,
        relativePath: (file as any).webkitRelativePath || file.name
      }))
      addFilesToQueue(filesArray, queueItems)
    }
  }

  const addFilesToQueue = (files: File[], customItems?: { file: File; relativePath: string }[]) => {
    const newItems: UploadQueueItem[] = files.map((file, idx) => {
      const path = customItems ? customItems[idx].relativePath : file.name
      return {
        id: uuid(),
        file,
        relativePath: path,
        progress: 0,
        status: 'pending'
      }
    })
    
    setQueue(prev => {
      const updated = [...prev, ...newItems]
      // Start processing queue next tick
      setTimeout(() => processQueue(updated), 50)
      return updated
    })
  }

  const uuid = () => Math.random().toString(36).substring(2, 15)

  // Process queue with concurrency limit
  const processQueue = (currentQueue: UploadQueueItem[]) => {
    const uploadingCount = currentQueue.filter(item => item.status === 'uploading').length
    activeUploadsCount.current = uploadingCount

    if (uploadingCount >= CONCURRENT_LIMIT) return

    const pendingItem = currentQueue.find(item => item.status === 'pending')
    if (!pendingItem) return

    // Start upload
    uploadFile(pendingItem.id)
  }

  const uploadFile = (id: string) => {
    setQueue(prev => {
      const updated = prev.map(item => {
        if (item.id !== id) return item

        const xhr = new XMLHttpRequest()
        const formData = new FormData()
        formData.append('files', item.file, item.file.name)
        
        let startTime = Date.now()

        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100)
            const elapsedTime = (Date.now() - startTime) / 1000 // seconds
            const speedBytesPerSec = elapsedTime > 0 ? e.loaded / elapsedTime : 0
            
            // Format speed
            let speedStr = '0 KB/s'
            if (speedBytesPerSec > 1024 * 1024) {
              speedStr = `${(speedBytesPerSec / (1024 * 1024)).toFixed(1)} MB/s`
            } else if (speedBytesPerSec > 1024) {
              speedStr = `${(speedBytesPerSec / 1024).toFixed(0)} KB/s`
            }

            // Calculate ETA
            let etaStr = '--'
            const bytesRemaining = e.total - e.loaded
            if (speedBytesPerSec > 0) {
              const secondsRemaining = bytesRemaining / speedBytesPerSec
              if (secondsRemaining > 60) {
                etaStr = `${Math.floor(secondsRemaining / 60)}m ${Math.round(secondsRemaining % 60)}s`
              } else {
                etaStr = `${Math.round(secondsRemaining)}s`
              }
            }

            setQueue(curr => curr.map(c => c.id === id ? { ...c, progress, speed: speedStr, eta: etaStr } : c))
          }
        })

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const res = JSON.parse(xhr.responseText)
              const result = res.results[0]
              
              setQueue(curr => {
                const nextQueue = curr.map(c => {
                  if (c.id !== id) return c
                  
                  if (result.status === 'duplicate') {
                    return { ...c, progress: 100, status: 'duplicate' as const }
                  } else if (result.status === 'failed') {
                    return { ...c, status: 'failed' as const, error: result.error }
                  } else {
                    return { ...c, progress: 100, status: 'completed' as const }
                  }
                })
                // Trigger next uploads
                setTimeout(() => processQueue(nextQueue), 50)
                return nextQueue
              })
            } catch (err) {
              markAsFailed(id, 'Invalid response from server.')
            }
          } else {
            markAsFailed(id, `Server error: ${xhr.statusText}`)
          }
        })

        xhr.addEventListener('error', () => {
          markAsFailed(id, 'Network connection failed.')
        })

        xhr.open('POST', `${getBackendUrl()}/api/media/bulk-upload`)
        xhr.send(formData)

        return { ...item, status: 'uploading' as const, xhr }
      })
      return updated
    })
  }

  const markAsFailed = (id: string, errorMsg: string) => {
    setQueue(curr => {
      const nextQueue = curr.map(c => c.id === id ? { ...c, status: 'failed' as const, error: errorMsg, speed: undefined, eta: undefined } : c)
      setTimeout(() => processQueue(nextQueue), 50)
      return nextQueue
    })
  }

  // Cancel single upload
  const cancelUpload = (id: string) => {
    setQueue(curr => {
      const item = curr.find(c => c.id === id)
      if (item?.xhr) {
        item.xhr.abort()
      }
      const nextQueue = curr.filter(c => c.id !== id)
      setTimeout(() => processQueue(nextQueue), 50)
      return nextQueue
    })
  }

  // Pause single upload
  const pauseUpload = (id: string) => {
    setQueue(curr => {
      const item = curr.find(c => c.id === id)
      if (item?.xhr) {
        item.xhr.abort()
      }
      const nextQueue = curr.map(c => c.id === id ? { ...c, status: 'paused' as const, xhr: undefined, speed: undefined, eta: undefined } : c)
      setTimeout(() => processQueue(nextQueue), 50)
      return nextQueue
    })
  }

  // Resume single upload
  const resumeUpload = (id: string) => {
    setQueue(curr => {
      const nextQueue = curr.map(c => c.id === id ? { ...c, status: 'pending' as const } : c)
      setTimeout(() => processQueue(nextQueue), 50)
      return nextQueue
    })
  }

  // Overall calculation
  const totalFiles = queue.length
  const completedFiles = queue.filter(item => item.status === 'completed' || item.status === 'duplicate').length
  const overallProgress = totalFiles > 0 ? Math.round((completedFiles / totalFiles) * 100) : 0

  return (
    <div className="min-h-screen bg-black text-white px-6 pt-32 pb-24 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-cyber-blue/5 blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto z-10 relative">
        <div className="mb-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-cyber-blue font-mono text-[10px] tracking-[0.4em] uppercase mb-2"
          >
            Data Ingestion Portal
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black tracking-tight"
          >
            BULK MEDIA INGESTION
          </motion.h1>
        </div>

        {/* Drag Drop Area */}
        <motion.div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          whileHover={{ borderColor: 'rgba(76, 201, 240, 0.4)' }}
          className={`
            border border-dashed rounded-[32px] p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 mb-8 backdrop-blur-xl relative overflow-hidden
            ${isDragging 
              ? 'bg-cyber-blue/10 border-cyber-blue/80 shadow-2xl shadow-cyber-blue/10 scale-[0.99]' 
              : 'bg-white/5 border-white/10 hover:bg-white/10'}
          `}
        >
          <UploadCloud size={48} className="text-cyber-blue mb-4 animate-bounce" />
          <h3 className="text-xl font-bold mb-2">Drag and drop images or videos here</h3>
          <p className="text-sm text-white/40 mb-6 max-w-sm">
            Supports folder structure indexing. Resolves nested elements recursively and validates original media preservation.
          </p>

          <div className="flex gap-4 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-2.5 bg-white text-black font-mono text-[10px] uppercase font-bold tracking-widest rounded-full hover:bg-white/90 transition-all duration-300 shadow-lg shadow-white/5 cursor-pointer"
            >
              Select Files
            </button>
            
            <button
              onClick={() => folderInputRef.current?.click()}
              className="px-6 py-2.5 border border-white/20 bg-white/5 hover:bg-white/10 text-white font-mono text-[10px] uppercase font-bold tracking-widest rounded-full transition-all duration-300 cursor-pointer flex items-center gap-2"
            >
              <FolderOpen size={12} />
              Select Folder
            </button>
          </div>

          {/* Hidden inputs */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept="image/*,video/*"
            className="hidden"
          />
          <input
            type="file"
            ref={folderInputRef}
            onChange={handleFolderChange}
            multiple
            // @ts-ignore
            webkitdirectory=""
            directory=""
            className="hidden"
          />
        </motion.div>

        {/* Global Progress Bar */}
        {totalFiles > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-[24px] bg-white/5 border border-white/10 backdrop-blur-xl mb-8 flex flex-col md:flex-row justify-between items-center gap-6"
          >
            <div className="flex-1 w-full">
              <div className="flex justify-between items-center mb-2 font-mono text-xs uppercase tracking-wider text-white/50">
                <span>Upload Ingestion Progress</span>
                <span>{overallProgress}% ({completedFiles}/{totalFiles} Files)</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-cyber-blue"
                  initial={{ width: 0 }}
                  animate={{ width: `${overallProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
            {overallProgress === 100 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 text-green-400 rounded-full text-xs font-mono font-bold uppercase">
                <Check size={14} />
                Ingestion Completed
              </div>
            )}
          </motion.div>
        )}

        {/* Queue Items */}
        {queue.length > 0 && (
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            <h3 className="font-mono text-[10px] tracking-widest text-white/40 uppercase mb-2">Ingestion Queue List</h3>
            <AnimatePresence>
              {queue.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between gap-6 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-grow min-w-0">
                    <div className={`p-2.5 rounded-lg ${item.status === 'completed' ? 'bg-green-500/15 text-green-400' : 'bg-white/5 text-white/60'}`}>
                      <File size={16} />
                    </div>
                    <div className="min-w-0 flex-grow">
                      <span className="block text-sm font-bold truncate" title={item.relativePath}>
                        {item.relativePath}
                      </span>
                      <span className="block text-[10px] font-mono text-white/30 uppercase mt-0.5">
                        {item.status === 'uploading' && `Uploading • ${item.speed || '--'} • ETA: ${item.eta || '--'}`}
                        {item.status === 'pending' && 'Queue Pending'}
                        {item.status === 'paused' && 'Ingestion Paused'}
                        {item.status === 'completed' && 'Ingested Successfully'}
                        {item.status === 'duplicate' && 'Duplicate Skipped (Linked)'}
                        {item.status === 'failed' && `Failed: ${item.error || 'Network error'}`}
                      </span>
                      
                      {/* Individual Progress Bar */}
                      {item.status === 'uploading' && (
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-2">
                          <div className="h-full bg-cyber-blue transition-all" style={{ width: `${item.progress}%` }} />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.status === 'uploading' && (
                      <button
                        onClick={() => pauseUpload(item.id)}
                        className="p-2 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors cursor-pointer"
                        title="Pause Upload"
                      >
                        <Pause size={14} />
                      </button>
                    )}
                    {item.status === 'paused' && (
                      <button
                        onClick={() => resumeUpload(item.id)}
                        className="p-2 hover:bg-white/10 rounded-full text-cyber-blue hover:text-cyber-blue transition-colors cursor-pointer"
                        title="Resume Upload"
                      >
                        <Play size={14} />
                      </button>
                    )}
                    {item.status === 'duplicate' && (
                      <div className="p-2 text-yellow-400" title="Duplicate warning: SHA-256 matches existing item. Skipped redundant storage.">
                        <AlertTriangle size={14} />
                      </div>
                    )}
                    {item.status === 'failed' && (
                      <button
                        onClick={() => resumeUpload(item.id)}
                        className="p-2 hover:bg-white/10 rounded-full text-red-400 hover:text-white transition-colors cursor-pointer"
                        title="Retry Ingestion"
                      >
                        <RefreshCw size={14} />
                      </button>
                    )}
                    {(item.status === 'uploading' || item.status === 'pending' || item.status === 'paused') && (
                      <button
                        onClick={() => cancelUpload(item.id)}
                        className="p-2 hover:bg-white/10 rounded-full text-white/40 hover:text-red-400 transition-colors cursor-pointer"
                        title="Cancel Ingestion"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
