import { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function sitemap(): { url: string; lastModified: Date; changeFrequency: string; priority: number }[] {
  const baseUrl = 'https://vinaysiddha.dev'
  const lastModified = new Date()

  const routes = [
    '',
    '/about',
    '/experience',
    '/projects',
    '/skills',
    '/social',
    '/contact',
    '/status',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: route === '' || route === '/projects' ? 'weekly' : 'monthly' as const,
    priority: route === '' ? 1.0 : route === '/projects' ? 0.9 : 0.8,
  }))

  return routes
}
