'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Database, Cpu, MessageSquare, Zap, Globe, Layers } from 'lucide-react'

const nodes = [
  { 
    id: 'input', 
    label: 'User Query', 
    icon: MessageSquare, 
    x: 0, 
    y: 50,
    details: 'Semantic analysis and query expansion to improve retrieval accuracy.'
  },
  { 
    id: 'processor', 
    label: 'Query Rewriter', 
    icon: Cpu, 
    x: 200, 
    y: 50,
    details: 'Using LLMs to break down complex queries into sub-tasks for agents.'
  },
  { 
    id: 'vectordb', 
    label: 'Vector DB', 
    icon: Database, 
    x: 400, 
    y: 0,
    details: 'Pinecone / Milvus implementation for sub-200ms semantic search.'
  },
  { 
    id: 'agent', 
    label: 'Agent Executor', 
    icon: Layers, 
    x: 400, 
    y: 100,
    details: 'Autonomous workflow management with ReAct and function calling.'
  },
  { 
    id: 'output', 
    label: 'Final Response', 
    icon: Zap, 
    x: 600, 
    y: 50,
    details: 'Grounded generation with source citations and Hallucination checks.'
  }
]

export default function ArchSpotlight() {
  const [activeNode, setActiveNode] = useState<string | null>(null)

  return (
    <section className="relative py-24 px-6 bg-black">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col items-start mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyber-purple/5 border border-cyber-purple/20 mb-6">
            <Layers className="w-4 h-4 text-cyber-purple" />
            <span className="text-[10px] font-mono tracking-[0.3em] text-white/40 uppercase">System Architecture</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase mb-4 leading-none">
            RAG<span className="text-cyber-purple">.</span>Intelligence<span className="text-cyber-blue">.</span>Mesh
          </h2>
          <p className="text-white/40 text-sm font-mono max-w-lg">
            // Hover over architectural nodes to inspect technical implementation strategies.
          </p>
        </div>

        <div className="relative min-h-[500px] bg-[#0a0a0a] rounded-3xl border border-white/5 p-8 md:p-12 overflow-x-auto overflow-y-hidden">
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="white" />
              </marker>
            </defs>
            {/* Lines between nodes */}
            <line x1="100" y1="250" x2="300" y2="250" stroke="white" strokeWidth="1" markerEnd="url(#arrow)" />
            <line x1="500" y1="250" x2="700" y2="100" stroke="white" strokeWidth="1" markerEnd="url(#arrow)" />
            <line x1="500" y1="250" x2="700" y2="400" stroke="white" strokeWidth="1" markerEnd="url(#arrow)" />
            <line x1="900" y1="100" x2="1100" y2="250" stroke="white" strokeWidth="1" markerEnd="url(#arrow)" />
            <line x1="900" y1="400" x2="1100" y2="250" stroke="white" strokeWidth="1" markerEnd="url(#arrow)" />
          </svg>

          <div className="relative h-[400px] min-w-[1200px]">
            {nodes.map((node) => (
              <motion.div
                key={node.id}
                className={`
                  absolute p-6 rounded-2xl border transition-all duration-300 cursor-help z-10
                  ${activeNode === node.id ? 'bg-white text-black border-white scale-110' : 'bg-[#050505] text-white border-white/10 hover:border-white/40'}
                `}
                style={{ 
                  left: `${node.x * 2}px`, 
                  top: `${node.y * 2.5 + 50}px`,
                  width: '180px'
                }}
                onMouseEnter={() => setActiveNode(node.id)}
                onMouseLeave={() => setActiveNode(null)}
              >
                <node.icon className={`w-6 h-6 mb-4 ${activeNode === node.id ? 'text-black' : 'text-cyber-purple'}`} />
                <h4 className="font-bold text-xs uppercase tracking-widest">{node.label}</h4>
              </motion.div>
            ))}

            {/* Detailed Explanation Overlay */}
            <div className="absolute top-0 right-0 w-[300px] h-full flex flex-col justify-center">
              <motion.div
                key={activeNode || 'none'}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl"
              >
                {activeNode ? (
                  <>
                    <h5 className="text-cyber-purple text-[10px] font-mono uppercase tracking-[0.3em] mb-4">Implementation_Detail</h5>
                    <p className="text-white text-sm leading-relaxed font-mono italic">
                      {nodes.find(n => n.id === activeNode)?.details}
                    </p>
                  </>
                ) : (
                  <p className="text-white/20 text-xs font-mono uppercase tracking-widest italic animate-pulse">
                    Waiting_for_node_selection...
                  </p>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
