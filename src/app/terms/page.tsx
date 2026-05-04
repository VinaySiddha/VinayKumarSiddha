import { Metadata } from 'next'
import TermsClient from '@/components/TermsClient'

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Professional protocols and technical deployment standards for using the vinaysiddha.dev portfolio.',
}

export default function TermsPage() {
  return <TermsClient />
}
