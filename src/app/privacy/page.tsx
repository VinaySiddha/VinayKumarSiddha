import { Metadata } from 'next'
import PrivacyClient from '@/components/PrivacyClient'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Technical privacy protocols and data collection standards for the vinaysiddha.dev runtime environment.',
}

export default function PrivacyPage() {
  return <PrivacyClient />
}
