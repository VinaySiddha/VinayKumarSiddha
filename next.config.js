/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  
  // Performance optimizations
  experimental: {
    optimizeCss: true,
  },
}

module.exports = nextConfig


