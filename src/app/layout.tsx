import type { Metadata } from 'next'
import './globals.css'
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import ClientLayout from '@/components/ClientLayout'

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
  metadataBase: new URL('https://vinaysiddha.dev'),
  title: {
    default: 'Vinay Siddha | AI Engineer & Full-Stack Developer',
    template: '%s | Vinay Siddha'
  },
  description: 'Specializing in Production-Grade RAG Systems, Multi-Agent AI, and Scalable Cloud Architectures. Expert in Python, FastAPI, React, and LLM Fine-tuning.',
  keywords: [
    'AI Engineer', 'RAG Systems', 'Multi-Agent AI', 'LangChain', 'LLMs', 'Azure AI', 
    'Full-Stack Developer', 'Python Developer', 'FastAPI', 'React Developer', 
    'Next.js Portfolio', 'Cloud Architecture', 'Machine Learning Engineer'
  ],
  authors: [{ name: 'Vinay Siddha', url: 'https://vinaysiddha.dev' }],
  creator: 'Vinay Siddha',
  publisher: 'Vinay Siddha',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://vinaysiddha.dev',
    title: 'Vinay Siddha — AI Engineer & Developer Portfolio',
    description: 'Expert in RAG, Multi-Agent AI, and Full-Stack Development. Explore my projects and technical innovations.',
    siteName: 'Vinay Siddha Portfolio',
    images: [
      {
        url: '/assets/images/logo.jpg',
        width: 1200,
        height: 630,
        alt: 'Vinay Siddha - AI Engineer & Developer Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vinay Siddha — AI Engineer & Developer Portfolio',
    description: 'Innovative AI solutions and scalable web architectures.',
    creator: '@vinaysiddha',
    images: ['/assets/images/logo.jpg'],
  },
  alternates: {
    canonical: '/',
  },
  category: 'technology',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Vinay Siddha',
              url: 'https://vinaysiddha.dev',
              image: 'https://vinaysiddha.dev/assets/images/logo.jpg',
              description: 'AI Engineer specializing in RAG, Multi-Agent Systems, and Full-Stack Development',
              jobTitle: 'AI Engineer',
              sameAs: [
                'https://github.com/VinaySiddha',
                'https://linkedin.com/in/vinaysiddha',
                'https://twitter.com/vinaysiddha',
              ],
              knowsAbout: [
                'Artificial Intelligence',
                'RAG Systems',
                'LangChain',
                'Multi-Agent Systems',
                'Python',
                'FastAPI',
                'React',
                'Next.js',
                'Cloud Computing'
              ],
            }),
          }}
        />
      </head>
      <body className={spaceGrotesk.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}

