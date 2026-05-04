'use client'

import React from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BackgroundBlobs from '@/components/BackgroundBlobs'
import ParticleBackground from '@/components/ParticleBackground'
import Preloader from '@/components/Preloader'
import ThemeToggle from '@/components/ThemeToggle'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="relative min-h-screen">
      {/* Preloader */}
      <Preloader />
      
      {/* Theme Toggle */}
      <ThemeToggle />
      
      {/* Animated background elements */}
      <BackgroundBlobs />
      <ParticleBackground />
      
      {/* Main content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow">
          {children}
        </div>
        <Footer />
      </div>
    </main>
  )
}
