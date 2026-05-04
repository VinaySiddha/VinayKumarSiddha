'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Linkedin,
  Twitter,
  Instagram,
  Github,
  ExternalLink,
  ArrowLeft,
  Code2,
  BookOpen,
} from 'lucide-react'
import { FaReddit } from 'react-icons/fa'
import BackgroundBlobs from '@/components/BackgroundBlobs'
import ParticleBackground from '@/components/ParticleBackground'
import ThemeToggle from '@/components/ThemeToggle'

interface SocialPlatform {
  name: string
  handle: string
  description: string
  url: string
  color: string
  gradient: string
  icon: React.ReactNode
  stats: { label: string; value: string }[]
  posts?: { content: string; date: string; tag: string }[]
}

const platforms: SocialPlatform[] = [
  {
    name: 'LinkedIn',
    handle: 'Vinay Kumar Siddha',
    description: 'Professional insights on AI engineering, RAG systems, and full-stack development.',
    url: 'https://linkedin.com/in/vinaysiddha',
    color: '#0A66C2',
    gradient: 'linear-gradient(135deg, #0A66C2 0%, #3AA6FF 100%)',
    icon: <Linkedin className="w-6 h-6" />,
    stats: [
      { label: 'Connections', value: '500+' },
      { label: 'Followers', value: '1.2K' },
      { label: 'Posts', value: '40+' },
    ],
    posts: [
      {
        content:
          '🚀 Just shipped a production-grade RAG system using LangChain + Pinecone + GPT-4! Retrieval accuracy improved 40% using hybrid search.',
        date: '3 days ago',
        tag: 'AI Engineering',
      },
      {
        content:
          '🤖 Multi-agent workflows are the future of AI automation. Built a CrewAI research pipeline that autonomously scrapes arXiv, writes reports & generates visual summaries.',
        date: '1 week ago',
        tag: 'Multi-Agent AI',
      },
      {
        content:
          '💡 Most ML models fail in prod not because of poor accuracy, but poor engineering. Observability, fallback strategies, prompt versioning — non-negotiable.',
        date: '2 weeks ago',
        tag: 'MLOps',
      },
    ],
  },
  {
    name: 'Reddit',
    handle: 'u/vinaysiddha',
    description: 'Discussions on r/MachineLearning, r/LangChain, r/webdev and open-source AI.',
    url: 'https://reddit.com/user/vinaysiddha',
    color: '#FF4500',
    gradient: 'linear-gradient(135deg, #FF4500 0%, #FF6534 100%)',
    icon: <FaReddit className="w-6 h-6" />,
    stats: [
      { label: 'Karma', value: '1.4K' },
      { label: 'Posts', value: '30+' },
      { label: 'Communities', value: '12' },
    ],
    posts: [
      {
        content:
          'Sharing my experience fine-tuning Mistral 7B on domain-specific data. AMA on the RAG vs fine-tuning trade-off decision!',
        date: '5 days ago',
        tag: 'r/MachineLearning',
      },
      {
        content:
          'Built a LangChain agent that extracts structured data from unstructured PDFs with 90%+ accuracy. Sharing the architecture.',
        date: '2 weeks ago',
        tag: 'r/LangChain',
      },
    ],
  },
  {
    name: 'X (Twitter)',
    handle: '@vinaysiddha',
    description: 'Hot takes on AI, quick dev tips, and threads on building with LLMs.',
    url: 'https://twitter.com/vinaysiddha',
    color: '#1DA1F2',
    gradient: 'linear-gradient(135deg, #000000 0%, #1DA1F2 100%)',
    icon: <Twitter className="w-6 h-6" />,
    stats: [
      { label: 'Followers', value: '800+' },
      { label: 'Tweets', value: '200+' },
      { label: 'Impressions', value: '50K+' },
    ],
    posts: [
      {
        content:
          '🧵 Thread: 5 things I learned building production RAG systems that nobody tells you… (1/5)',
        date: '1 day ago',
        tag: '#AI',
      },
      {
        content:
          'Just discovered that proper chunking strategy > model choice when it comes to RAG accuracy. Change my mind.',
        date: '4 days ago',
        tag: '#LLMs',
      },
    ],
  },
  {
    name: 'Instagram',
    handle: '@vinay.siddha',
    description: 'Behind-the-scenes of building AI products, dev setups, and tech lifestyle.',
    url: 'https://instagram.com/vinay.siddha',
    color: '#E1306C',
    gradient: 'linear-gradient(135deg, #833AB4 0%, #FD1D1D 50%, #FCAF45 100%)',
    icon: <Instagram className="w-6 h-6" />,
    stats: [
      { label: 'Posts', value: '50+' },
      { label: 'Followers', value: '600+' },
      { label: 'Following', value: '300' },
    ],
  },
  {
    name: 'GitHub',
    handle: 'VinaySiddha',
    description: 'Open-source projects, AI experiments, full-stack apps, and learning resources.',
    url: 'https://github.com/VinaySiddha',
    color: '#FFFFFF',
    gradient: 'linear-gradient(135deg, #161B22 0%, #30363D 100%)',
    icon: <Github className="w-6 h-6" />,
    stats: [
      { label: 'Repositories', value: '30+' },
      { label: 'Stars', value: '50+' },
      { label: 'Contributions', value: '400+' },
    ],
    posts: [
      {
        content:
          'MLSC SVEC — Full-stack portal for MLSC club with JWT auth, AI-powered resume summarization using Google Genkit + Gemini.',
        date: 'Pinned',
        tag: 'Next.js',
      },
      {
        content:
          'Gen-AI — Unified repo containing RAG experiments, embeddings, crew_ai, chatbot, LLMs, memory buffers, and vector databases.',
        date: 'Pinned',
        tag: 'LangChain',
      },
    ],
  },
  {
    name: 'GeeksForGeeks',
    handle: 'vinaysiddha',
    description: 'Articles and problem solutions on Data Structures, Algorithms, and System Design.',
    url: 'https://auth.geeksforgeeks.org/user/vinaysiddha',
    color: '#2F8D46',
    gradient: 'linear-gradient(135deg, #2F8D46 0%, #4CAF50 100%)',
    icon: <BookOpen className="w-6 h-6" />,
    stats: [
      { label: 'Articles', value: '10+' },
      { label: 'Problems', value: '150+' },
      { label: 'Score', value: '800+' },
    ],
  },
  {
    name: 'LeetCode',
    handle: 'vinaysiddha',
    description: 'Competitive programming, DSA practice, and contest rankings.',
    url: 'https://leetcode.com/vinaysiddha',
    color: '#FFA116',
    gradient: 'linear-gradient(135deg, #1A1A2E 0%, #FFA116 100%)',
    icon: <Code2 className="w-6 h-6" />,
    stats: [
      { label: 'Problems Solved', value: '200+' },
      { label: 'Contest Rating', value: '1600+' },
      { label: 'Streak', value: '30+ days' },
    ],
  },
]

export default function SocialPage() {
  return (
    <main className="relative min-h-screen">
      <ThemeToggle />
      <BackgroundBlobs />
      <ParticleBackground />

      <div className="relative z-10 px-4 sm:px-6 py-24 sm:py-28">
        <div className="container mx-auto max-w-7xl">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/60 hover:text-cyber-blue transition-colors duration-300 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="w-2 h-2 rounded-full bg-cyber-blue animate-pulse" />
              <span className="text-sm font-medium text-white/80 font-mono tracking-widest uppercase">
                Social Presence
              </span>
            </motion.div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white mb-6 leading-tight">
              Find Me{' '}
              <span className="bg-gradient-to-r from-cyber-blue via-cyber-purple to-cyber-pink bg-clip-text text-transparent">
                Online
              </span>
            </h1>
            <p className="text-white/50 text-base sm:text-lg max-w-2xl mx-auto">
              I share insights on AI engineering, open-source projects, and tech across multiple
              platforms. Let&apos;s connect!
            </p>
          </motion.div>

          {/* Platforms grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {platforms.map((platform, index) => (
              <PlatformCard key={platform.name} platform={platform} index={index} />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

function PlatformCard({
  platform,
  index,
}: {
  platform: SocialPlatform
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
    >
      <motion.a
        href={platform.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl transition-all duration-500 hover:border-white/20"
        whileHover={{ y: -4, boxShadow: `0 20px 60px ${platform.color}25` }}
      >
        {/* Gradient top bar */}
        <div
          className="absolute top-0 left-0 w-full h-1"
          style={{ background: platform.gradient }}
        />

        {/* Background glow on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl"
          style={{ background: platform.gradient }}
        />

        <div className="relative z-10 p-6">
          {/* Platform header */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                style={{ background: platform.gradient }}
              >
                {platform.icon}
              </div>
              <div>
                <h2 className="text-white font-bold text-lg leading-tight">
                  {platform.name}
                </h2>
                <p className="text-white/40 text-xs font-mono">{platform.handle}</p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors mt-1" />
          </div>

          {/* Description */}
          <p className="text-white/60 text-sm leading-relaxed mb-5">{platform.description}</p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {platform.stats.map((stat) => (
              <div
                key={stat.label}
                className="text-center rounded-lg py-2 px-1"
                style={{ backgroundColor: `${platform.color}10` }}
              >
                <p className="font-bold text-sm" style={{ color: platform.color }}>
                  {stat.value}
                </p>
                <p className="text-white/40 text-[10px] mt-0.5 leading-tight">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Recent posts */}
          {platform.posts && platform.posts.length > 0 && (
            <div className="space-y-3">
              <p className="text-white/30 text-[10px] font-mono uppercase tracking-widest">
                Recent Activity
              </p>
              {platform.posts.slice(0, 2).map((post, i) => (
                <div
                  key={i}
                  className="rounded-xl p-3 border border-white/5 bg-white/3"
                  style={{ backgroundColor: `${platform.color}08` }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${platform.color}20`,
                        color: platform.color,
                        border: `1px solid ${platform.color}30`,
                      }}
                    >
                      {post.tag}
                    </span>
                    <span className="text-white/30 text-[10px]">{post.date}</span>
                  </div>
                  <p className="text-white/60 text-xs leading-relaxed line-clamp-2">
                    {post.content}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          <motion.div
            className="mt-5 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm text-white"
            style={{ background: platform.gradient }}
            whileHover={{ filter: 'brightness(1.15)' }}
          >
            {platform.icon}
            <span>Visit {platform.name}</span>
          </motion.div>
        </div>
      </motion.a>
    </motion.div>
  )
}
