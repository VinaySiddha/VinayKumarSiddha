'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Linkedin, ExternalLink, MessageCircle, Repeat2, ThumbsUp } from 'lucide-react'

const linkedinPosts = [
  {
    id: 1,
    content:
      '🚀 Just shipped a production-grade RAG system using LangChain + Pinecone + GPT-4! The retrieval accuracy improved by 40% using hybrid search (BM25 + semantic).\n\nKey learnings:\n✅ Chunking strategy matters more than model choice\n✅ Reranking with Cohere adds massive value\n✅ Metadata filtering = game changer\n\nHappy to share the architecture — drop a comment! 👇',
    date: '3 days ago',
    likes: 142,
    comments: 28,
    reposts: 19,
    tag: 'AI Engineering',
  },
  {
    id: 2,
    content:
      '🤖 Multi-agent workflows are the future of AI automation. I built a research agent pipeline using CrewAI that autonomously:\n\n→ Scrapes & summarises papers from arXiv\n→ Writes structured reports\n→ Generates visual summaries\n\nAll while I sleep! 🌙 The future of knowledge work is here — are you building with agents yet?',
    date: '1 week ago',
    likes: 89,
    comments: 15,
    reposts: 12,
    tag: 'Multi-Agent AI',
  },
  {
    id: 3,
    content:
      '💡 Hot take: most ML models fail in production not because of poor accuracy, but poor engineering.\n\nThings I have learned shipping AI to prod:\n→ Observability is non-negotiable\n→ Fallback strategies save you at 3 am\n→ Prompt versioning is as critical as code versioning\n→ Cost optimisation cannot be an afterthought\n\nWhat would you add? ⬇️',
    date: '2 weeks ago',
    likes: 203,
    comments: 47,
    reposts: 31,
    tag: 'MLOps',
  },
]

const LINKEDIN_URL = 'https://linkedin.com/in/vinaysiddha'

export default function LinkedIn() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section
      id="linkedin"
      className="relative py-24 sm:py-32 px-4 sm:px-6 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyber-dark via-[#0A66C2]/5 to-cyber-dark" />
      <motion.div
        className="absolute top-1/3 right-1/4 w-72 h-72 sm:w-96 sm:h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, #0A66C2 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.06, 0.14, 0.06] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="container mx-auto max-w-7xl relative z-10" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: '#0A66C2' }}
            >
              <Linkedin className="w-6 h-6 text-white" />
            </div>
            <span className="text-white/50 text-sm font-mono tracking-widest uppercase">
              Social Feed
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-4 sm:mb-6 leading-tight">
            LinkedIn
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  'linear-gradient(90deg, #0A66C2, #3AA6FF, #8A2BE2)',
              }}
            >
              Activity
            </span>
          </h2>
          <p className="text-white/50 text-base sm:text-lg">
            Thoughts, insights &amp; AI engineering deep-dives
          </p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="cyber-glass-heavy p-6 sm:p-8 rounded-2xl sm:rounded-3xl mb-8 max-w-2xl mx-auto"
        >
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-0.5"
                style={{
                  background:
                    'linear-gradient(45deg, #0A66C2, #8A2BE2, #3AA6FF)',
                }}
              >
                <div className="w-full h-full rounded-full cyber-glass flex items-center justify-center text-2xl sm:text-3xl font-bold text-white">
                  V
                </div>
              </div>
              <div
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#0A66C2' }}
              >
                <Linkedin className="w-3 h-3 text-white" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-base sm:text-lg">
                Vinay Kumar Siddha
              </h3>
              <p className="text-white/60 text-xs sm:text-sm">
                AI Engineer · Full Stack Developer · LLMs &amp; RAG Systems
              </p>
              <p className="text-white/40 text-xs mt-1">
                Hyderabad, Telangana, India
              </p>
            </div>

            {/* Desktop CTA */}
            <motion.a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm text-white flex-shrink-0"
              style={{ backgroundColor: '#0A66C2' }}
              whileHover={{ scale: 1.05, filter: 'brightness(1.15)' }}
              whileTap={{ scale: 0.95 }}
            >
              <Linkedin className="w-4 h-4" />
              Connect
            </motion.a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
            {[
              { label: 'Connections', value: '500+' },
              { label: 'Followers', value: '1.2K' },
              { label: 'Posts', value: '40+' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-bold text-lg sm:text-xl text-cyber-blue">
                  {stat.value}
                </p>
                <p className="text-white/50 text-xs mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Mobile CTA */}
          <motion.a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="sm:hidden mt-5 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-white w-full"
            style={{ backgroundColor: '#0A66C2' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            <Linkedin className="w-4 h-4" />
            Connect on LinkedIn
          </motion.a>
        </motion.div>

        {/* Posts Grid */}
        <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-6">
          {linkedinPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.15 }}
              className="cyber-glass p-5 sm:p-6 rounded-2xl flex flex-col gap-4 transition-all duration-300"
              style={{ borderColor: 'rgba(10, 102, 194, 0.25)' }}
              whileHover={{
                boxShadow: '0 0 25px rgba(10, 102, 194, 0.2)',
                borderColor: 'rgba(10, 102, 194, 0.5)',
              }}
            >
              {/* Post Header */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full p-0.5 flex-shrink-0"
                  style={{
                    background: 'linear-gradient(45deg, #0A66C2, #3AA6FF)',
                  }}
                >
                  <div className="w-full h-full rounded-full bg-[#050505] flex items-center justify-center text-sm font-bold text-white">
                    V
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm font-semibold truncate">
                    Vinay Kumar Siddha
                  </p>
                  <p className="text-white/40 text-xs">{post.date}</p>
                </div>
                <span
                  className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-mono font-bold whitespace-nowrap flex-shrink-0"
                  style={{
                    backgroundColor: 'rgba(10, 102, 194, 0.15)',
                    color: '#3AA6FF',
                    border: '1px solid rgba(58, 166, 255, 0.25)',
                  }}
                >
                  #{post.tag}
                </span>
              </div>

              {/* Content */}
              <p className="text-white/70 text-sm leading-relaxed whitespace-pre-line line-clamp-6 flex-1">
                {post.content}
              </p>

              {/* Engagement */}
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-white/40 text-xs">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    {post.likes}
                  </span>
                  <span className="flex items-center gap-1.5 text-white/40 text-xs">
                    <MessageCircle className="w-3.5 h-3.5" />
                    {post.comments}
                  </span>
                  <span className="flex items-center gap-1.5 text-white/40 text-xs">
                    <Repeat2 className="w-3.5 h-3.5" />
                    {post.reposts}
                  </span>
                </div>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-white/30 hover:text-cyber-blue transition-colors text-xs"
                >
                  <ExternalLink className="w-3 h-3" />
                  View
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View Profile CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <motion.a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-white text-base relative overflow-hidden group"
            style={{
              background:
                'linear-gradient(135deg, #0A66C2, #3AA6FF, #8A2BE2)',
            }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            <Linkedin className="w-5 h-5" />
            <span>View Full LinkedIn Profile</span>
            <ExternalLink className="w-4 h-4 opacity-70" />
            <motion.span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.a>
          <p className="text-white/30 text-xs mt-3 font-mono">
            linkedin.com/in/vinaysiddha
          </p>
        </motion.div>
      </div>
    </section>
  )
}
