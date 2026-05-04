import Contact from '@/components/Contact'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Initialize a connection with Vinay Siddha for project inquiries, collaborations, or professional opportunities.',
}

export default function ContactPage() {
  return <Contact />
}
