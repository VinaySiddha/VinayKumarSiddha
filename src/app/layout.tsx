import type { Metadata } from 'next'
import './globals.css'
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Vinny | AI Engineer & SDE',
  description: 'Portfolio of Vinny - AI Engineer and Software Developer specializing in RAG systems, LangChain, Multi-Agent architectures, and full-stack development. Expert in LLMs, Azure AI, Python, and modern web technologies.',
  keywords: ['AI Engineer', 'Software Developer', 'RAG Systems', 'LangChain', 'Multi-Agent Systems', 'LLMs', 'Azure AI', 'Python', 'Full Stack Developer', 'Machine Learning'],
  authors: [{ name: 'Vinny' }],
  creator: 'Vinny',
  openGraph: {
    title: 'Vinny - AI Engineer & SDE',
    description: 'Architecting Advanced RAG, Multi-Agent Systems, LangChain Workflows, and Scalable Full-Stack Applications.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className={spaceGrotesk.className}>
        {children}
      </body>
    </html>
  )
}
