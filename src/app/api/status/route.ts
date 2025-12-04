import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

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
  responseTime?: number
}

interface MonitoringData {
  timestamp: string
  status: 'up' | 'down'
  responseTime: number
}

// Store monitoring data in memory (for demo - use database in production)
let monitoringHistory: MonitoringData[] = []
let incidents: Incident[] = []

// Function to check website status
async function checkWebsiteStatus(url: string): Promise<{ status: 'up' | 'down', responseTime: number }> {
  const startTime = Date.now()
  
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
    
    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      cache: 'no-store'
    })
    
    clearTimeout(timeoutId)
    const responseTime = Date.now() - startTime
    
    return {
      status: response.ok ? 'up' : 'down',
      responseTime
    }
  } catch (error) {
    return {
      status: 'down',
      responseTime: Date.now() - startTime
    }
  }
}

// Calculate uptime percentage from monitoring data
function calculateUptime(data: MonitoringData[]): number {
  if (data.length === 0) return 100
  
  const upCount = data.filter(d => d.status === 'up').length
  return (upCount / data.length) * 100
}

// Generate historical data based on real checks
function generateHistory(): StatusHistory[] {
  const history: StatusHistory[] = []
  const today = new Date()
  
  for (let i = 44; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    // Get monitoring data for this day
    const dayStart = new Date(date.setHours(0, 0, 0, 0))
    const dayEnd = new Date(date.setHours(23, 59, 59, 999))
    
    const dayData = monitoringHistory.filter(d => {
      const timestamp = new Date(d.timestamp)
      return timestamp >= dayStart && timestamp <= dayEnd
    })
    
    const uptime = dayData.length > 0 ? calculateUptime(dayData) : 100
    const avgResponseTime = dayData.length > 0
      ? dayData.reduce((sum, d) => sum + d.responseTime, 0) / dayData.length
      : 0
    
    history.push({
      date: date.toISOString(),
      uptime: Math.round(uptime * 100) / 100,
      responseTime: Math.round(avgResponseTime)
    })
  }
  
  return history
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const monitorUrl = searchParams.get('url') || 'https://vinayaksiddha.pages.dev' // Your deployed URL
    
    // Perform real-time status check
    const currentStatus = await checkWebsiteStatus(monitorUrl)
    
    // Store the check result
    monitoringHistory.push({
      timestamp: new Date().toISOString(),
      status: currentStatus.status,
      responseTime: currentStatus.responseTime
    })
    
    // Keep only last 1000 checks (adjust based on your needs)
    if (monitoringHistory.length > 1000) {
      monitoringHistory = monitoringHistory.slice(-1000)
    }
    
    // Generate history from actual monitoring data
    const history = generateHistory()
    
    // Calculate overall uptime
    const overallUptime = calculateUptime(monitoringHistory)
    
    // Get average response time
    const avgResponseTime = monitoringHistory.length > 0
      ? Math.round(monitoringHistory.reduce((sum, d) => sum + d.responseTime, 0) / monitoringHistory.length)
      : 0

    return NextResponse.json({
      success: true,
      data: {
        currentStatus: {
          status: currentStatus.status,
          responseTime: currentStatus.responseTime,
          url: monitorUrl
        },
        incidents,
        history,
        overallUptime: Math.round(overallUptime * 100) / 100,
        avgResponseTime,
        totalChecks: monitoringHistory.length,
        currentTime: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Status API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch status data' },
      { status: 500 }
    )
  }
}

// POST endpoint to manually add incidents
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    if (body.action === 'add_incident') {
      const newIncident: Incident = {
        id: Date.now().toString(),
        title: body.title,
        status: body.status || 'identified',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        resolvedTime: body.resolvedTime || '',
        identifiedTime: new Date().toLocaleString('en-US', { 
          month: 'long', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        updates: body.updates || []
      }
      
      incidents.unshift(newIncident)
      
      return NextResponse.json({
        success: true,
        message: 'Incident added',
        incident: newIncident
      })
    }
    
    if (body.action === 'update_incident') {
      const incident = incidents.find(i => i.id === body.id)
      if (incident) {
        Object.assign(incident, body.updates)
        return NextResponse.json({
          success: true,
          message: 'Incident updated',
          incident
        })
      }
    }
    
    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Status POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
