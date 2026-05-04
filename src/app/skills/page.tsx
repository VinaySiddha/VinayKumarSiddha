import Skills from '@/components/Skills'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Skills',
  description: 'Technical stack and expertise of Vinay Siddha, including Python, FastAPI, React, LLMs, and Cloud Infrastructure.',
}

export default function SkillsPage() {
  return <Skills />
}
