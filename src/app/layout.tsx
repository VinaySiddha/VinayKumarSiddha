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
  metadataBase: new URL('https://vinaysiddha.dev'),
  title: 'Vinay Siddha | Portfolio | AI Engineer & Developer',
  description: 'Portfolio of Vinay Siddha - AI Engineer and Full-Stack Developer specializing in RAG systems, Multi-Agent AI, LangChain, LLM fine-tuning, and cloud architecture. Expert in Python, Django, FastAPI, React, Next.js, Node.js, and modern web technologies. Explore projects, experience, and skills.',
  keywords: [
    'Vinay Siddha portfolio',
    'Vinay Siddha developer portfolio',
    'Vinay Siddha ai engineer',
    'vinay siddha',
    'vinaysiddha',
    'full stack developer portfolio',
    'creative portfolio design',
    'nextjs portfolio',
    'tailwind portfolio ui',
    'motion portfolio website',
    'react developer portfolio',
    'ai engineer website',
    'backend developer',
    'frontend developer',
    'machine learning engineer',
    'deep learning projects',
    'rag development portfolio',
    'langchain developer',
    'mongodb express react node',
    'python developer portfolio',
    'java developer portfolio',
    'cloud projects',
    'personal developer website',
    'Vinay Siddha site',
    'Vinay Siddha resume online',
    'modern portfolio ui',
    'web development projects showcase',
    'interactive web portfolio',
    'creative web engineer',
    'software engineer online portfolio',
    'AI Engineer',
    'RAG Systems',
    'Multi-Agent Systems',
    'LLMs',
    'Azure AI',
    'Django',
    'FastAPI',
    'Node.js',
    'Docker',
    'Kubernetes',
    'AWS',
    'Firebase',
    'PostgreSQL',
    'MongoDB'
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
    description: 'Projects | Experience | Skills | Creative Work. Specializing in RAG, Multi-Agent AI, LangChain, and Full-Stack Development.',
    siteName: 'Vinay Siddha Portfolio',
    images: [
      {
        url: '../public/assets/images/logo.jpg',
        width: 1200,
        height: 630,
        alt: 'Vinay Siddha - AI Engineer & Developer Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vinay Siddha — AI Engineer & Developer Portfolio',
    description: 'Projects | Experience | Skills | Creative Work',
    creator: '@vinaysiddha',
    images: ['../public/assets/images/logo.jpg'],
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://vinaysiddha.dev',
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
        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="/_next/static/media/space-grotesk.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Vinay Siddha',
              alternateName: 'Vinay Siddha',
              jobTitle: 'AI Engineer / Full-Stack Developer',
              url: 'https://vinaysiddha.dev',
              image: 'https://vinaysiddha.dev/og-image.png',
              description: 'Developer specializing in AI, LLMs, RAG, LangChain, Multi-Agent Systems & Full Stack Development',
              sameAs: [
                'https://github.com/VinaySiddha',
                'https://linkedin.com/in/vinaysiddha',
                'https://twitter.com/vinaysiddha',
              ],
              knowsAbout: [
                'Artificial Intelligence',
                'Machine Learning',
                'RAG Systems',
                'LangChain',
                'Multi-Agent Systems',
                'Python',
                'Django',
                'FastAPI',
                'React',
                'Next.js',
                'Node.js',
                'Cloud Computing',
                'Docker',
                'Kubernetes',
              ],
              alumniOf: {
                '@type': 'CollegeOrUniversity',
                name: 'Sri Vasavi Engineering College',
              },
            }),
          }}
        />
        
        {/* Additional metadata */}
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="theme-color" content="#000000" />
        <link rel="canonical" href="https://vinaysiddha.dev" />
      </head>
      <body className={spaceGrotesk.className}>
        {children}
      </body>
    </html>
  )
}
