import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#050505',
          blue: '#3AA6FF',
          purple: '#8A2BE2',
          pink: '#FF1B8D',
          cyan: '#00E8F3',
        },
      },
      fontFamily: {
        sans: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      backdropBlur: {
        xs: '2px',
        glass: '28px',
        heavy: '40px',
      },
      boxShadow: {
        'neon-blue': '0 0 20px rgba(58, 166, 255, 0.6), 0 0 40px rgba(58, 166, 255, 0.3)',
        'neon-purple': '0 0 20px rgba(138, 43, 226, 0.6), 0 0 40px rgba(138, 43, 226, 0.3)',
        'neon-pink': '0 0 20px rgba(255, 27, 141, 0.6), 0 0 40px rgba(255, 27, 141, 0.3)',
        'neon-cyan': '0 0 20px rgba(0, 232, 243, 0.6), 0 0 40px rgba(0, 232, 243, 0.3)',
        'cyber-glow': '0 0 30px rgba(58, 166, 255, 0.5), 0 0 60px rgba(138, 43, 226, 0.3), 0 0 90px rgba(255, 27, 141, 0.2)',
        '3d': '0 20px 60px rgba(0, 0, 0, 0.5), 0 10px 30px rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'gradient-shift': 'gradient-shift 10s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'blob': 'blob 8s ease-in-out infinite',
        'morph': 'morph 10s ease-in-out infinite',
        'scan': 'scan 4s linear infinite',
        'text-reveal': 'text-reveal 1.5s ease-out forwards',
        'neon-flicker': 'neon-flicker 0.3s ease-in-out infinite alternate',
        'tilt': 'tilt 10s infinite linear',
        'magnetic': 'magnetic 0.3s ease-out',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'orbit': 'orbit 20s linear infinite',
        'marquee': 'marquee 40s linear infinite',
        'marquee-reverse': 'marquee-reverse 40s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
        'border-sweep': 'border-sweep 2s ease-in-out infinite',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': {
            'background-position': '0% 50%',
          },
          '50%': {
            'background-position': '100% 50%',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-20px) rotate(2deg)' },
          '66%': { transform: 'translateY(10px) rotate(-2deg)' },
        },
        'glow-pulse': {
          '0%, 100%': { 
            opacity: '0.8',
            boxShadow: '0 0 20px rgba(58, 166, 255, 0.4), 0 0 40px rgba(138, 43, 226, 0.2)'
          },
          '50%': { 
            opacity: '1',
            boxShadow: '0 0 40px rgba(58, 166, 255, 0.8), 0 0 80px rgba(138, 43, 226, 0.4)'
          },
        },
        blob: {
          '0%, 100%': {
            transform: 'translate(0px, 0px) scale(1) rotate(0deg)',
          },
          '25%': {
            transform: 'translate(50px, -50px) scale(1.2) rotate(90deg)',
          },
          '50%': {
            transform: 'translate(-30px, 30px) scale(0.9) rotate(180deg)',
          },
          '75%': {
            transform: 'translate(40px, 20px) scale(1.1) rotate(270deg)',
          },
        },
        morph: {
          '0%, 100%': {
            'border-radius': '60% 40% 30% 70% / 60% 30% 70% 40%',
          },
          '50%': {
            'border-radius': '30% 60% 70% 40% / 50% 60% 30% 60%',
          },
        },
        scan: {
          '0%': {
            transform: 'translateY(-100%)',
          },
          '100%': {
            transform: 'translateY(100%)',
          },
        },
        'text-reveal': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
            filter: 'blur(10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
            filter: 'blur(0)',
          },
        },
        'neon-flicker': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        tilt: {
          '0%, 100%': { transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)' },
          '25%': { transform: 'perspective(1000px) rotateX(5deg) rotateY(-5deg)' },
          '50%': { transform: 'perspective(1000px) rotateX(-5deg) rotateY(5deg)' },
          '75%': { transform: 'perspective(1000px) rotateX(5deg) rotateY(5deg)' },
        },
        magnetic: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'pulse-ring': {
          '0%': {
            transform: 'scale(0.95)',
            boxShadow: '0 0 0 0 rgba(58, 166, 255, 0.7)',
          },
          '70%': {
            transform: 'scale(1)',
            boxShadow: '0 0 0 20px rgba(58, 166, 255, 0)',
          },
          '100%': {
            transform: 'scale(0.95)',
            boxShadow: '0 0 0 0 rgba(58, 166, 255, 0)',
          },
        },
        orbit: {
          '0%': {
            transform: 'rotate(0deg) translateX(140px) rotate(0deg)',
          },
          '100%': {
            transform: 'rotate(360deg) translateX(140px) rotate(-360deg)',
          },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        'border-sweep': {
          '0%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
          '100%': { 'background-position': '0% 50%' },
        },
      },
    },
  },
  plugins: [],
}
export default config
