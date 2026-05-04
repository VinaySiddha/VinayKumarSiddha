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
      const SERVICE_ID = 'service_4o8xbnc'
      const TEMPLATE_ID = 'template_js1p70m'
      const PUBLIC_KEY = 'K3RhISgmwwgC89AqN'

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
        setTimeout(() => setSubmitStatus('idle'), 5000)
      }
    } catch (error) {
      console.error('EmailJS Error:', error)
      setSubmitStatus('error')
      setStatusMessage('Failed to send message. Please try again or email me directly.')
      setTimeout(() => setSubmitStatus('idle'), 5000)
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

  return (
    <section id="contact" className="relative py-16 px-6 bg-[#050505] overflow-hidden" ref={ref}>
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col items-start mb-12 border-l-2 border-cyber-cyan pl-6">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[10px] font-mono tracking-[0.3em] text-cyber-cyan uppercase mb-2"
          >
            System_Comms: //REMOTE_LINK
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 40, filter: 'blur(20px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="text-4xl md:text-6xl font-black text-white tracking-tighter"
          >
            CONTACT<span className="text-cyber-cyan">.</span>
          </motion.h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 items-start">
          {/* Left Info Column */}
          <motion.div
            initial={{ opacity: 0, x: -20, filter: 'blur(15px)' }}
            whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="flex flex-col gap-4"
          >
            <div className="bg-[#0a0a0a] p-8 rounded-2xl border border-white/5">
              <h3 className="text-xl font-bold text-white mb-6 tracking-tight font-mono lowercase opacity-60">// direct_lines</h3>
              <div className="flex flex-col gap-4">
                <a href="mailto:vinaysiddha19@gmail.com" className="flex items-center gap-4 group bg-white/3 p-4 rounded-xl border border-transparent hover:border-cyber-cyan/30 transition-all">
                  <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center border border-white/10 group-hover:text-cyber-cyan">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[9px] text-white/20 font-mono tracking-widest uppercase mb-0.5">Email_Address</p>
                    <p className="text-sm text-white font-medium group-hover:text-cyber-cyan transition-colors">vinaysiddha19@gmail.com</p>
                  </div>
                </a>
                
                <a href="tel:+919849372827" className="flex items-center gap-4 group bg-white/3 p-4 rounded-xl border border-transparent hover:border-cyber-cyan/30 transition-all">
                  <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center border border-white/10 group-hover:text-cyber-cyan">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[9px] text-white/20 font-mono tracking-widest uppercase mb-0.5">Secure_Line</p>
                    <p className="text-sm text-white font-medium group-hover:text-cyber-cyan transition-colors">+91 984-937-2827</p>
                  </div>
                </a>
              </div>
            </div>

            <div className="bg-[#0a0a0a] p-8 rounded-2xl border border-white/5">
              <h3 className="text-xl font-bold text-white mb-6 tracking-tight font-mono lowercase opacity-60">// social_mesh</h3>
              <div className="flex gap-4">
                {[
                  { icon: Github, href: 'https://github.com/VinaySiddha' },
                  { icon: Linkedin, href: 'https://linkedin.com/in/vinaysiddha' },
                  { icon: Twitter, href: 'https://twitter.com/vinaysiddha' }
                ].map((social, i) => (
                  <a key={i} href={social.href} target="_blank" className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors group">
                    <social.icon className="w-5 h-5 text-white/30 group-hover:text-white" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Form Column */}
          <motion.div
            initial={{ opacity: 0, x: 20, filter: 'blur(15px)' }}
            whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          >
            <form ref={formRef} onSubmit={handleSubmit} className="bg-[#0a0a0a] p-8 rounded-2xl border border-white/5 flex flex-col gap-4">
              <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-6">
                <h3 className="text-xl font-bold text-white tracking-tight font-mono lowercase opacity-60">// message_stack</h3>
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-white/10" />
                  <div className="w-2 h-2 rounded-full bg-white/10" />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-[9px] font-mono tracking-widest text-white/20 uppercase mb-2 ml-1">Param: NAME</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 text-white text-xs placeholder-white/10 focus:border-cyber-cyan focus:bg-white/5 transition-all outline-none"
                    placeholder="ENTER_NAME"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-[9px] font-mono tracking-widest text-white/20 uppercase mb-2 ml-1">Param: EMAIL</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 text-white text-xs placeholder-white/10 focus:border-cyber-cyan focus:bg-white/5 transition-all outline-none"
                    placeholder="ENTER_EMAIL"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-[9px] font-mono tracking-widest text-white/20 uppercase mb-2 ml-1">Param: BODY</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 text-white text-xs placeholder-white/10 focus:border-cyber-cyan focus:bg-white/5 transition-all outline-none resize-none"
                  placeholder="COMPOSE_MESSAGE..."
                />
              </div>

              {submitStatus !== 'idle' && (
                <div className={`flex items-center gap-2 p-3 rounded-xl ${
                  submitStatus === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                }`}>
                  <span className="text-[10px] font-mono uppercase tracking-widest">{statusMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 px-6 py-4 rounded-xl bg-cyber-cyan text-black font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-cyber-cyan/80 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'TRANSMITTING...' : 'TRANSMIT_PACKET'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
