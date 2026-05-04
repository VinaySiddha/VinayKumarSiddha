import { Metadata } from 'next'
import StatusClient from '@/components/StatusClient'

export const metadata: Metadata = {
  title: 'System Status',
  description: 'Real-time operational status and uptime history for vinaysiddha.dev nodes and AI core engines.',
}

export default function StatusPage() {
  return <StatusClient />
}
