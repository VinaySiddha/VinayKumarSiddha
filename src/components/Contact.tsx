'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useState, useRef } from 'react'
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react'
import emailjs from '@emailjs/browser'

export default function Contact() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  })

  const formRef = useRef<HTMLFormElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Initialize EmailJS with your credentials
      // Get your credentials from https://www.emailjs.com/
      const SERVICE_ID = 'YOUR_SERVICE_ID' // Replace with your EmailJS service ID
      const TEMPLATE_ID = 'YOUR_TEMPLATE_ID' // Replace with your EmailJS template ID
      const PUBLIC_KEY = 'YOUR_PUBLIC_KEY' // Replace with your EmailJS public key

      const result = await emailjs.sendForm(
        SERVICE_ID,
        TEMPLATE_ID,
        formRef.current!,
        PUBLIC_KEY
      )

      if (result.status === 200) {
        setSubmitStatus('success')
        setStatusMessage('Message sent successfully! I\'ll get back to you soon.')
        setFormData({ name: '', email: '', subject: '', message: '' })
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          setSubmitStatus('idle')
        }, 5000)
      }
    } catch (error) {
      console.error('EmailJS Error:', error)
      setSubmitStatus('error')
      setStatusMessage('Failed to send message. Please try again or email me directly.')
      
      // Reset error message after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle')
      }, 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'vinny@example.com',
      href: 'mailto:vinny@example.com',
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+1 234 567 8900',
      href: 'tel:+12345678900',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'City, Country',
      href: null,
    },
  ]

  const socialLinks = [
    {
      icon: Github,
      name: 'GitHub',
      href: 'https://github.com',
      color: 'cyber-blue',
    },
    {
      icon: Linkedin,
      name: 'LinkedIn',
      href: 'https://linkedin.com',
      color: 'cyber-purple',
    },
    {
      icon: Twitter,
      name: 'Twitter',
      href: 'https://twitter.com',
      color: 'cyber-cyan',
    },
    {
      icon: ExternalLink,
      name: 'Portfolio',
      href: 'https://vinny.dev',
      color: 'cyber-pink',
    },
  ]

  return (
    <section id="contact" className="relative py-32 px-6 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyber-dark via-cyber-blue/5 to-cyber-dark" />
      <motion.div
        className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, #8A2BE2 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="container mx-auto max-w-6xl relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            Get in
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Touch
            </span>
          </h2>
          <p className="text-white/60 text-lg">
            Let's collaborate on your next AI project
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Contact Info - 2 columns */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Contact Cards */}
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="cyber-glass p-5 rounded-2xl flex items-center gap-4 group cursor-hover"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyber-blue/20 to-cyber-purple/20 flex items-center justify-center group-hover:shadow-neon-blue transition-all duration-300">
                    <info.icon className="w-6 h-6 text-cyber-blue group-hover:text-cyber-cyan transition-colors" />
                  </div>
                  <div>
                    <p className="text-white/50 text-sm mb-1">{info.label}</p>
                    {info.href ? (
                      <a
                        href={info.href}
                        className="text-white font-medium hover:text-cyber-blue transition-colors cursor-hover"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-white font-medium">{info.value}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Social Links */}
            <div className="cyber-glass p-6 rounded-2xl">
              <h3 className="text-lg font-bold text-white mb-4 font-mono">Connect on Social</h3>
              <div className="grid grid-cols-2 gap-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-${social.color}/50 hover:bg-${social.color}/10 transition-all duration-300 group cursor-hover`}
                  >
                    <social.icon className={`w-4 h-4 text-white/60 group-hover:text-${social.color} transition-colors`} />
                    <span className="text-sm text-white/70 group-hover:text-white transition-colors font-medium">
                      {social.name}
                    </span>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Holographic Contact Form - 3 columns */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-3"
          >
            <form ref={formRef} onSubmit={handleSubmit} className="cyber-glass-heavy p-8 rounded-3xl relative overflow-hidden scan-line">
              {/* Holographic corner accents */}
              <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-cyber-blue rounded-tr-3xl" 
                style={{ boxShadow: '0 0 20px rgba(58, 166, 255, 0.5)' }} 
              />
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-cyber-purple rounded-bl-3xl" 
                style={{ boxShadow: '0 0 20px rgba(138, 43, 226, 0.5)' }} 
              />

              <div className="space-y-5 relative z-10">
                {/* Name Input */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white/70 mb-2 font-mono">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border-2 border-white/10 text-white placeholder-white/30 focus:border-cyber-blue focus:bg-cyber-blue/5 focus:shadow-neon-blue transition-all duration-300 outline-none cursor-hover"
                    placeholder="John Doe"
                  />
                </div>

                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-2 font-mono">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border-2 border-white/10 text-white placeholder-white/30 focus:border-cyber-blue focus:bg-cyber-blue/5 focus:shadow-neon-blue transition-all duration-300 outline-none cursor-hover"
                    placeholder="john@example.com"
                  />
                </div>

                {/* Subject Input */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-white/70 mb-2 font-mono">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border-2 border-white/10 text-white placeholder-white/30 focus:border-cyber-purple focus:bg-cyber-purple/5 focus:shadow-neon-purple transition-all duration-300 outline-none cursor-hover"
                    placeholder="Project Inquiry"
                  />
                </div>

                {/* Message Textarea */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-white/70 mb-2 font-mono">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border-2 border-white/10 text-white placeholder-white/30 focus:border-cyber-cyan focus:bg-cyber-cyan/5 focus:shadow-neon-cyan transition-all duration-300 outline-none resize-none cursor-hover"
                    placeholder="Tell me about your project..."
                  />
                </div>

                {/* Status Message */}
                {submitStatus !== 'idle' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center gap-2 p-4 rounded-xl ${
                      submitStatus === 'success'
                        ? 'bg-green-500/10 border border-green-500/50 text-green-400'
                        : 'bg-red-500/10 border border-red-500/50 text-red-400'
                    }`}
                  >
                    {submitStatus === 'success' ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <AlertCircle className="w-5 h-5" />
                    )}
                    <span className="text-sm font-medium">{statusMessage}</span>
                  </motion.div>
                )}

                {/* Submit Button with ripple glow + magnetic hover */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  className={`w-full px-6 py-4 rounded-xl bg-gradient-to-r from-cyber-blue to-cyber-purple text-white font-bold text-lg relative overflow-hidden group magnetic-button cursor-hover ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </span>
                  {!isSubmitting && (
                    <motion.span
                      className="absolute inset-0 rounded-xl"
                      animate={{
                        boxShadow: [
                          '0 0 20px rgba(58, 166, 255, 0.4)',
                          '0 0 40px rgba(138, 43, 226, 0.6)',
                          '0 0 60px rgba(58, 166, 255, 0.4)',
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.button>

                {/* EmailJS Setup Instructions */}
                <div className="mt-4 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
                  <p className="text-xs text-yellow-400 font-mono">
                    📧 To enable email functionality, update EmailJS credentials in Contact.tsx with your service ID, template ID, and public key from{' '}
                    <a href="https://www.emailjs.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-yellow-300">
                      emailjs.com
                    </a>
                  </p>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
