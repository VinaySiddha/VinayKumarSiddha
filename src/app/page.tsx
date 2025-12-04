import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Skills from '@/components/Skills'
import Projects from '@/components/Projects'
import Experience from '@/components/Experience'
import Contact from '@/components/Contact'
import MindscapeCanvas from '@/components/MindscapeCanvas'
import Footer from '@/components/Footer'
import BackgroundBlobs from '@/components/BackgroundBlobs'
import ParticleBackground from '@/components/ParticleBackground'
import Preloader from '@/components/Preloader'
import ThemeToggle from '@/components/ThemeToggle'
import DesktopNotice from '@/components/DesktopNotice'
import WarningModal from '@/components/WarningModal'

export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* Warning Modal - Shows first time */}
      <WarningModal />
      
      {/* Preloader */}
      <Preloader />
      
      {/* Desktop Notice */}
      <DesktopNotice />
      
      {/* Theme Toggle */}
      <ThemeToggle />
      
      {/* Animated background elements */}
      <BackgroundBlobs />
      <ParticleBackground />
      
      {/* Main content */}
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <MindscapeCanvas />
        <Contact />
        <Footer />
      </div>
    </main>
  )
}
