'use client'

import { motion } from 'framer-motion'
import { GraduationCap, Award, Trophy, CheckCircle } from 'lucide-react'

const education = [
  {
    degree: 'B.Tech - Computer Science Engineering (AI)',
    institution: 'Sri Vasavi Engineering College',
    date: 'Nov 2022 - Present',
    score: 'CGPA: 9.05',
    color: 'text-cyber-blue'
  },
  {
    degree: 'Intermediate (MPC)',
    institution: 'Sasi Junior College',
    date: 'July 2020 - June 2022',
    score: 'Percentage: 94.5%',
    color: 'text-cyber-purple'
  },
  {
    degree: 'Secondary School Certificate (CBSE)',
    institution: 'Lotus High School',
    date: 'Mar 2019 - Mar 2020',
    score: 'Percentage: 83.4%',
    color: 'text-cyber-cyan'
  }
]

const certifications = [
  'Microsoft: Azure AI Fundamentals AI-900',
  'Microsoft: Azure AI Associate AI-102',
  'Oracle: OCI 2024 Generative AI Certified',
  'Oracle: OCI 2025 Data Science Certified',
  'NPTEL: Google Cloud Computing Foundations'
]

const achievements = [
  'Solved 700+ problems on GeeksforGeeks',
  'LeetCode Contest Rating: 1561',
  'AIMpact Challenge Winner (Recommendation Engine)',
  '3rd Place - Brainovision AWS Hackathon (Nov 2023)',
  'Runner Up - CodeWizardy Contest (Jan 2023)',
  'Creative Lead & GDGoC Organiser 2025'
]

export default function Milestones() {
  return (
    <section className="relative py-32 px-6 bg-[#050505] overflow-hidden">
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid md:grid-cols-2 gap-16">
          
          {/* Left Column: Education & Certifications */}
          <div className="flex flex-col gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-3xl font-black text-white tracking-tighter mb-8 flex items-center gap-3">
                <GraduationCap className="text-cyber-blue" />
                ACADEMIC_RECORD
              </h3>
              <div className="space-y-6 border-l border-white/10 pl-6">
                {education.map((edu, i) => (
                  <div key={i} className="relative">
                    <div className={`absolute -left-[29px] top-1.5 w-3 h-3 rounded-full bg-black border-2 border-white/20`} />
                    <h4 className={`text-lg font-bold ${edu.color} leading-none mb-2`}>{edu.degree}</h4>
                    <p className="text-white text-sm mb-1">{edu.institution}</p>
                    <div className="flex items-center gap-4 text-white/40 text-xs font-mono">
                      <span>{edu.date}</span>
                      <span className="text-cyber-pink">{edu.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h3 className="text-3xl font-black text-white tracking-tighter mb-6 flex items-center gap-3">
                <Award className="text-cyber-purple" />
                CERTIFICATIONS
              </h3>
              <ul className="space-y-4">
                {certifications.map((cert, i) => (
                  <li key={i} className="flex items-start gap-3 bg-[#0a0a0a] p-4 rounded-xl border border-white/5">
                    <CheckCircle size={16} className="text-cyber-purple shrink-0 mt-0.5" />
                    <span className="text-white/80 text-sm font-medium">{cert}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Right Column: Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="text-3xl font-black text-white tracking-tighter mb-8 flex items-center gap-3">
              <Trophy className="text-cyber-cyan" />
              ACHIEVEMENTS
            </h3>
            <div className="grid gap-4">
              {achievements.map((achievement, i) => (
                <div key={i} className="group relative bg-[#0a0a0a] p-6 rounded-2xl border border-white/5 hover:border-cyber-cyan/30 transition-all duration-300 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-cyan/5 blur-3xl rounded-full pointer-events-none group-hover:bg-cyber-cyan/10 transition-colors" />
                  <p className="text-white/90 text-sm md:text-base font-medium relative z-10 leading-relaxed">
                    {achievement}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
