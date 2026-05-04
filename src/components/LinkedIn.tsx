'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Linkedin, Github, Twitter, ExternalLink, ArrowUpRight, MessageCircle, ThumbsUp } from 'lucide-react'
import aboutData from '../../data/about.json'

const linkedinPosts = [
  {
    id: 1,
    content: '🚀 Just shipped a production-grade RAG system using LangChain + Pinecone + GPT-4! The retrieval accuracy improved by 40% using hybrid search (BM25 + semantic).',
    date: '3 days ago',
    likes: 142,
    comments: 28,
    tag: 'AI Engineering',
  },
  {
    id: 2,
    content: '🤖 Multi-agent workflows are the future of AI automation. I built a research agent pipeline using CrewAI that autonomously scrapes & summarises papers.',
    date: '1 week ago',
    likes: 89,
    comments: 15,
    tag: 'Multi-Agent AI',
  },
  {
    id: 3,
    content: '💡 Hot take: most ML models fail in production not because of poor accuracy, but poor engineering. Observability is non-negotiable.',
    date: '2 weeks ago',
    likes: 203,
    comments: 47,
    tag: 'MLOps',
  },
]

export default function Social() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const { social } = aboutData

  const profiles = [
    { name: 'LinkedIn', url: social.linkedin, icon: Linkedin, color: '#0A66C2', label: '@vinaysiddha' },
    { name: 'GitHub', url: social.github, icon: Github, color: '#FFFFFF', label: '@vinaysiddha' },
    { name: 'Twitter', url: social.twitter || '#', icon: Twitter, color: '#1DA1F2', label: '@vinaysiddha' },
  ]

  return (
    <section id="social" className="relative py-16 px-6 bg-[#050505] overflow-hidden" ref={ref}>
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-start mb-12 border-l-2 border-cyber-blue pl-6">
          <motion.div
            initial={{ opacity: 0, x: -10, filter: 'blur(5px)' }}
            whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8 }}
            className="text-[10px] font-mono tracking-[0.3em] text-cyber-blue uppercase mb-2"
          >
            System_Output: //NETWORK_MESH
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 40, filter: 'blur(20px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="text-4xl md:text-6xl font-black text-white tracking-tighter"
          >
            CONNECTED<span className="text-cyber-blue">.</span>
          </motion.h2>
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {profiles.map((profile, index) => (
            <motion.a
              key={profile.name}
              href={profile.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 + index * 0.1 }}
              className="group bg-[#0a0a0a] p-8 rounded-2xl border border-white/5 hover:border-white/20 transition-all flex flex-col justify-between h-48"
            >
              <div className="flex justify-between items-start">
                <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-white/30 transition-all`}>
                  <profile.icon className="w-6 h-6 text-white/60 group-hover:text-white transition-colors" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-white/20 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
              <div>
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">{profile.name}</p>
                <h3 className="text-xl font-bold text-white tracking-tight">{profile.label}</h3>
              </div>
            </motion.a>
          ))}
        </div>

        {/* LinkedIn Activity Sub-header */}
        <motion.div
          initial={{ opacity: 0, filter: 'blur(5px)' }}
          whileInView={{ opacity: 1, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex items-center gap-4 mb-8 pl-1"
        >
          <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em]">Latest_Activity</span>
          <div className="h-px flex-grow bg-white/5" />
        </motion.div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {linkedinPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30, filter: 'blur(15px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.7 + index * 0.1 }}
              className="bg-[#0a0a0a] p-6 rounded-2xl border border-white/5 flex flex-col justify-between hover:bg-[#111] transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                  <span className="text-[9px] font-mono text-cyber-blue tracking-widest uppercase border border-cyber-blue/30 px-2 py-0.5 rounded-md bg-cyber-blue/5">
                    {post.tag}
                  </span>
                  <span className="text-white/20 text-[9px] font-mono">{post.date}</span>
                </div>
                <p className="text-white/60 text-[11px] leading-relaxed font-mono opacity-80 mb-6 line-clamp-4">
                  {`// ${post.content}`}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="flex gap-4">
                  <span className="flex items-center gap-1.5 text-white/20 text-[9px] font-mono">
                    <ThumbsUp className="w-3 h-3" /> {post.likes}
                  </span>
                  <span className="flex items-center gap-1.5 text-white/20 text-[9px] font-mono">
                    <MessageCircle className="w-3 h-3" /> {post.comments}
                  </span>
                </div>
                <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-white transition-colors">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
