'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Upload, Camera, Trash2, Sliders, Play, Download, ExternalLink, RefreshCw, X, Check, CheckSquare, Square, History } from 'lucide-react'

interface SearchResult {
  media: {
    id: string
    filename: string
    type: string
    mime_type: string
    path: string
    signed_url: string
    thumbnail_url: string
    width: number
    height: number
    duration?: number
    fps?: number
    upload_date: string
  }
  similarity: number
  recognition_method: 'face' | 'person' | 'hybrid'
  matched_person_ids: string[]
  match_count: number
}

interface SearchHistoryItem {
  id: string
  timestamp: string
  fileName: string
  resultsCount: number
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

export default function SearchPage() {
  const [queryFile, setQueryFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  
  // Search parameters
  const [searchType, setSearchType] = useState<'hybrid' | 'face' | 'person'>('hybrid')
  const [threshold, setThreshold] = useState<number>(0.4)
  const [topK, setTopK] = useState<number>(10)
  
  // Results
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [message, setMessage] = useState<string | null>(null)
  
  // Selection for bulk downloads
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [downloadingZip, setDownloadingZip] = useState(false)
  
  // Lightbox Preview
  const [previewMedia, setPreviewMedia] = useState<SearchResult['media'] | null>(null)
  
  // Search History
  const [history, setHistory] = useState<SearchHistoryItem[]>([])

  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Load search history from local storage
    const savedHistory = localStorage.getItem('agy_search_history')
    if (savedHistory) {
      try { setHistory(jsonParse(savedHistory)) } catch (_) {}
    }
  }, [])

  const jsonParse = (str: string) => JSON.parse(str)

  const saveHistoryItem = (fileName: string, count: number) => {
    const newItem: SearchHistoryItem = {
      id: Math.random().toString(36).substring(2, 11),
      timestamp: new Date().toLocaleTimeString() + ' ' + new Date().toLocaleDateString(),
      fileName,
      resultsCount: count
    }
    const updated = [newItem, ...history.slice(0, 9)] // Limit to 10 items
    setHistory(updated)
    localStorage.setItem('agy_search_history', JSON.stringify(updated))
  }

  // Camera control
  const startCamera = async () => {
    setIsCameraActive(true)
    setPreviewUrl(null)
    setQueryFile(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
      setCameraStream(stream)
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error('Camera access failed:', err)
      alert('Could not access camera. Please make sure permissions are granted.')
      setIsCameraActive(false)
    }
  }

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop())
    }
    setCameraStream(null)
    setIsCameraActive(false)
  }

  const captureSnapshot = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'camera_capture.jpg', { type: 'image/jpeg' })
            setQueryFile(file)
            setPreviewUrl(URL.createObjectURL(file))
            stopCamera()
          }
        }, 'image/jpeg')
      }
    }
  }

  // File selectors
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setQueryFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      stopCamera()
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      setQueryFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      stopCamera()
    }
  }

  const clearQuery = () => {
    setQueryFile(null)
    setPreviewUrl(null)
    stopCamera()
  }

  // Search trigger
  const triggerSearch = async () => {
    if (!queryFile) return
    setLoading(true)
    setResults([])
    setMessage(null)
    setSelectedIds(new Set())
    
    const formData = new FormData()
    formData.append('file', queryFile)
    formData.append('threshold', threshold.toString())
    formData.append('top_k', topK.toString())
    formData.append('search_type', searchType)
    
    try {
      const res = await fetch(`${getBackendUrl()}/api/search`, {
        method: 'POST',
        body: formData
      })
      if (!res.ok) throw new Error('Search failed.')
      const data = await res.json()
      
      setResults(data.results)
      setMessage(data.message)
      
      saveHistoryItem(queryFile.name, data.results_count)
    } catch (err: any) {
      console.error(err)
      alert('Failed to connect to search pipeline.')
    } finally {
      setLoading(false)
    }
  }

  // Selection controls
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectAll = () => {
    if (selectedIds.size === results.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(results.map(r => r.media.id)))
    }
  }

  // Bulk ZIP download
  const handleBulkDownload = async () => {
    if (selectedIds.size === 0) return
    setDownloadingZip(true)
    try {
      const res = await fetch(`${getBackendUrl()}/api/media/bulk-download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedIds) })
      })
      if (!res.ok) throw new Error('Bulk ZIP generation failed.')
      const data = await res.json()
      
      // Trigger download
      window.open(data.download_url)
    } catch (err: any) {
      alert(`Download failed: ${err.message}`)
    } finally {
      setDownloadingZip(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 pt-32 pb-24 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-cyber-blue/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto z-10 relative">
        {/* Header */}
        <div className="mb-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-cyber-blue font-mono text-[10px] tracking-[0.4em] uppercase mb-2"
          >
            AI Recognition System
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black tracking-tight"
          >
            FACE & REID SEARCH
          </motion.h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Query Ingestion Panel */}
          <div className="space-y-6">
            <h3 className="font-mono text-[10px] tracking-widest text-white/40 uppercase">Search Ingestion</h3>
            
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="relative aspect-square rounded-[32px] bg-white/5 border border-white/10 overflow-hidden backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:border-cyber-blue/30 transition-all duration-300"
              onClick={() => !isCameraActive && fileInputRef.current?.click()}
            >
              {previewUrl ? (
                <div className="relative w-full h-full rounded-2xl overflow-hidden group">
                  <img src={previewUrl} alt="Query Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button
                      onClick={(e) => { e.stopPropagation(); clearQuery() }}
                      className="p-3 bg-red-600 rounded-full text-white hover:bg-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ) : isCameraActive ? (
                <div className="relative w-full h-full rounded-2xl overflow-hidden bg-black">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
                  <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 px-6 z-20">
                    <button
                      onClick={(e) => { e.stopPropagation(); captureSnapshot() }}
                      className="px-6 py-2.5 bg-cyber-blue text-black font-mono text-[10px] uppercase font-bold tracking-widest rounded-full hover:bg-white transition-all cursor-pointer"
                    >
                      Capture Frame
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); stopCamera() }}
                      className="px-6 py-2.5 border border-white/20 bg-black/40 text-white font-mono text-[10px] uppercase font-bold tracking-widest rounded-full hover:bg-black/60 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <Upload size={32} className="text-cyber-blue mb-4" />
                  <h4 className="text-sm font-bold mb-1">Drag Image Here</h4>
                  <p className="text-[11px] text-white/30 mb-6 max-w-[200px]">JPG, PNG, WEBP, or HEIC files supported.</p>
                  
                  <div className="flex gap-3 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-5 py-2 bg-white text-black font-mono text-[9px] uppercase font-bold tracking-widest rounded-full hover:bg-white/90 transition-all cursor-pointer"
                    >
                      Browse
                    </button>
                    <button
                      onClick={startCamera}
                      className="px-5 py-2 border border-white/10 bg-white/5 text-white font-mono text-[9px] uppercase font-bold tracking-widest rounded-full hover:bg-white/10 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Camera size={10} />
                      Live Feed
                    </button>
                  </div>
                </>
              )}
              
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Parameters Panel */}
            <div className="p-6 rounded-[24px] bg-white/5 border border-white/10 backdrop-blur-xl">
              <h4 className="font-mono text-[10px] tracking-wider text-white/40 uppercase mb-4 flex items-center gap-1.5">
                <Sliders size={12} />
                Search Settings
              </h4>
              
              {/* Search Type */}
              <div className="mb-6">
                <span className="block text-[10px] font-mono uppercase text-white/40 mb-2">Algorithm Mode</span>
                <div className="grid grid-cols-3 gap-2 bg-black/40 p-1 rounded-xl border border-white/5">
                  {(['hybrid', 'face', 'person'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setSearchType(mode)}
                      className={`
                        py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer
                        ${searchType === mode ? 'bg-cyber-blue text-black font-black' : 'text-white/40 hover:text-white'}
                      `}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>



              <button
                onClick={triggerSearch}
                disabled={!queryFile || loading}
                className="w-full py-3.5 bg-cyber-blue text-black font-mono text-[10px] uppercase font-black tracking-[0.2em] rounded-full shadow-lg shadow-cyber-blue/20 hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <Search size={14} />
                )}
                Compute AI Search
              </button>
            </div>
          </div>

          {/* Results Grid */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-mono text-[10px] tracking-widest text-white/40 uppercase">
                {results.length > 0 ? `Search Matches (${results.length})` : 'Search Results'}
              </h3>
              {results.length > 0 && (
                <div className="flex items-center gap-4">
                  <button
                    onClick={selectAll}
                    className="flex items-center gap-1.5 font-mono text-[10px] text-white/40 hover:text-white uppercase transition-colors"
                  >
                    {selectedIds.size === results.length ? (
                      <CheckSquare size={12} className="text-cyber-blue" />
                    ) : (
                      <Square size={12} />
                    )}
                    Select All
                  </button>
                  
                  <button
                    onClick={handleBulkDownload}
                    disabled={selectedIds.size === 0 || downloadingZip}
                    className="flex items-center gap-1.5 px-4 py-2 border border-white/10 bg-white/5 hover:bg-white/10 text-white font-mono text-[9px] uppercase font-bold tracking-wider rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {downloadingZip ? (
                      <RefreshCw size={10} className="animate-spin" />
                    ) : (
                      <Download size={10} />
                    )}
                    ZIP Download ({selectedIds.size})
                  </button>
                </div>
              )}
            </div>

            {/* Feedback notifications */}
            {message && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-xl border border-cyber-blue/30 bg-cyber-blue/5 text-cyber-blue font-mono text-[10px] uppercase tracking-wider flex items-center gap-2"
              >
                <Check size={12} />
                {message}
              </motion.div>
            )}

            {loading ? (
              <div className="aspect-[2/1] rounded-[32px] bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                  className="p-3 rounded-full border border-cyber-blue/30 text-cyber-blue mb-4"
                >
                  <RefreshCw size={24} />
                </motion.div>
                <span className="font-mono text-[10px] tracking-widest text-white/40 uppercase">Analyzing Frames & Matching Features...</span>
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[750px] overflow-y-auto pr-2 custom-scrollbar">
                {results.map((result) => {
                  const media = result.media
                  const isSelected = selectedIds.has(media.id)
                  
                  return (
                    <motion.div
                      key={media.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`
                        group relative rounded-[24px] bg-white/5 border backdrop-blur-xl p-4 transition-all duration-300
                        ${isSelected ? 'border-cyber-blue bg-cyber-blue/5' : 'border-white/10 hover:border-white/20'}
                      `}
                    >
                      {/* Checkbox */}
                      <button
                        onClick={() => toggleSelect(media.id)}
                        className="absolute top-6 left-6 z-20 p-1.5 rounded-lg bg-black/60 text-white hover:text-cyber-blue border border-white/10 transition-colors cursor-pointer"
                      >
                        {isSelected ? <CheckSquare size={14} className="text-cyber-blue" /> : <Square size={14} />}
                      </button>

                      {/* Image container */}
                      <div
                        onClick={() => setPreviewMedia(media)}
                        className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black/50 border border-white/5 mb-4 cursor-pointer"
                      >
                        <img
                          src={media.thumbnail_url || media.signed_url}
                          alt={media.filename}
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                        />
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white border border-white/20">
                            <ExternalLink size={16} />
                          </span>
                        </div>
                        
                        {/* Indicator tag */}
                        <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 rounded-md text-[8px] font-mono font-bold text-cyber-blue uppercase tracking-wider">
                          {media.type}
                        </div>
                      </div>

                      {/* Info */}
                      <div>
                        <div className="flex justify-between items-start gap-3 mb-2">
                          <h4 className="text-sm font-bold truncate flex-grow" title={media.filename}>
                            {media.filename}
                          </h4>
                          <span className="text-xs font-mono font-black text-cyber-blue">
                            {Math.round(result.similarity * 100)}% Match
                          </span>
                        </div>

                        <div className="flex justify-between items-center font-mono text-[9px] text-white/40 uppercase">
                          <span>Method: <strong className="text-white/60">{result.recognition_method}</strong></span>
                          <span>Clusters: <strong className="text-white/60">{result.matched_person_ids.join(', ')}</strong></span>
                        </div>
                        
                        {/* Action buttons */}
                        <div className="flex gap-2 mt-4 pt-3 border-t border-white/5">
                          <button
                            onClick={() => setPreviewMedia(media)}
                            className="flex-1 py-2 border border-white/10 hover:border-white/20 bg-white/5 text-white font-mono text-[9px] uppercase font-bold tracking-widest rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
                          >
                            <Play size={10} />
                            Preview Original
                          </button>
                          
                          <a
                            href={media.signed_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-2 border border-white/10 hover:border-white/20 bg-white/5 text-white hover:text-cyber-blue rounded-lg transition-colors cursor-pointer flex items-center justify-center"
                            title="Download Original Quality"
                          >
                            <Download size={10} />
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <div className="aspect-[2/1] rounded-[32px] bg-white/5 border border-white/10 border-dashed flex flex-col items-center justify-center text-center text-white/20">
                <span className="uppercase text-[9px] font-mono tracking-widest">Awaiting search ingestion query</span>
              </div>
            )}

            {/* History Panel */}
            {history.length > 0 && (
              <div className="pt-6 border-t border-white/10">
                <h4 className="font-mono text-[10px] tracking-wider text-white/40 uppercase mb-3 flex items-center gap-1.5">
                  <History size={12} />
                  Recent Search History
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center gap-4 text-[10px] font-mono text-white/60"
                    >
                      <div className="min-w-0">
                        <span className="block font-bold text-white truncate max-w-[160px]" title={item.fileName}>
                          {item.fileName}
                        </span>
                        <span className="block text-[8px] text-white/30 mt-0.5">{item.timestamp}</span>
                      </div>
                      <span className="flex-shrink-0 px-2 py-0.5 border border-cyber-blue/20 bg-cyber-blue/5 text-cyber-blue rounded">
                        {item.resultsCount} matches
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox / Preview Modal */}
      <AnimatePresence>
        {previewMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-6"
            onClick={() => setPreviewMedia(null)}
          >
            <button
              onClick={() => setPreviewMedia(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white cursor-pointer z-55"
            >
              <X size={20} />
            </button>

            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="relative max-w-5xl max-h-[85vh] w-full h-full flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {previewMedia.type === 'video' ? (
                <video
                  src={previewMedia.signed_url}
                  controls
                  autoPlay
                  className="w-full h-full object-contain rounded-2xl border border-white/5 bg-black"
                />
              ) : (
                <img
                  src={previewMedia.signed_url}
                  alt={previewMedia.filename}
                  className="w-full h-full object-contain rounded-2xl border border-white/5 bg-black"
                />
              )}
              
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 rounded-b-2xl flex justify-between items-center text-sm">
                <div>
                  <h4 className="font-bold text-white mb-0.5">{previewMedia.filename}</h4>
                  <p className="text-[10px] font-mono text-white/40 uppercase">
                    {previewMedia.width} x {previewMedia.height} • {previewMedia.mime_type}
                    {previewMedia.duration ? ` • ${(previewMedia.duration).toFixed(1)}s` : ''}
                  </p>
                </div>
                <a
                  href={previewMedia.signed_url}
                  download={previewMedia.filename}
                  className="px-6 py-2.5 bg-cyber-blue text-black font-mono text-[10px] uppercase font-black tracking-widest rounded-full hover:brightness-110 flex items-center gap-2 transition-all"
                >
                  <Download size={12} />
                  Download Original
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
