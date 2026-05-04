import Projects from '@/components/Projects'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'A library of technical projects and innovations by Vinay Siddha, focusing on AI, RAG systems, and full-stack applications.',
}

export default function ProjectsPage() {
  return <Projects />
}
