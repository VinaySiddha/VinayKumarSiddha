import About from '@/components/About'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn more about Vinay Siddha, an AI Engineer and Full-Stack Developer specializing in RAG systems and scalable architectures.',
}

export default function AboutPage() {
  return <About />
}
