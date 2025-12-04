import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Status - Vinay Siddha Portfolio | System Uptime Monitor',
  description: 'Real-time status monitoring for Vinay Siddha\'s portfolio website. Check uptime, performance metrics, and service availability.',
  openGraph: {
    title: 'Status - Vinay Siddha Portfolio',
    description: 'Real-time status monitoring and uptime statistics',
    url: 'https://vinaysiddha.dev/status',
  },
  twitter: {
    card: 'summary',
    title: 'Status - Vinay Siddha Portfolio',
    description: 'Real-time status monitoring and uptime statistics',
  },
  alternates: {
    canonical: 'https://vinaysiddha.dev/status',
  },
}

export default function StatusLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
