import { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Vinay Siddha | AI Engineer Portfolio',
    short_name: 'Vinay Siddha',
    description: 'Specializing in Production-Grade RAG Systems and Multi-Agent AI.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#3AA6FF',
    icons: [
      {
        src: '/assets/images/logo.jpg',
        sizes: 'any',
        type: 'image/jpeg',
      },
    ],
  }
}
