import Social from '@/components/LinkedIn'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Social',
  description: 'Connect with Vinay Siddha across professional networks and explore latest activity and technical insights.',
}

export default function SocialPage() {
  return <Social />
}
