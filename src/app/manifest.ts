import { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Vinay Siddha - AI Engineer & Developer Portfolio',
    short_name: 'Vinay Siddha',
    description: 'Portfolio showcasing AI engineering projects, full-stack development, and creative work by Vinay Siddha',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
