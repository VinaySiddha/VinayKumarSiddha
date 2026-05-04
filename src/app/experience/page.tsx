import Experience from '@/components/Experience'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Experience',
  description: 'Explore the professional journey and deployment history of Vinay Siddha, featuring roles in AI engineering and software development.',
}

export default function ExperiencePage() {
  return <Experience />
}
