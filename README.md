# 🚀 Vinay Siddha's Ultra-Premium AI Engineer Portfolio

An elite, production-ready portfolio website featuring cutting-edge animations, real-time integrations, and futuristic cyber aesthetics.

![Next.js](https://img.shields.io/badge/Next.js-14.1.0-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.0-38bdf8?style=for-the-badge&logo=tailwind-css)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.0.3-ff0055?style=for-the-badge&logo=framer)

## ✨ Premium Features Implemented

### 🎯 Custom Animated Cursor
- Smooth glow trail with spring physics
- Expanding neon ring on click
- Hover state detection
- Click ripples with fade-out

### 🎨 Tech Arsenal Portrait
- 8 orbiting tech badges (React, Next.js, Python, Java, TensorFlow, PyTorch, Docker, AWS)
- 10 floating inner badges with cursor proximity effect
- Rotating gradient rim (360° animation)
- Scrolling text strip marquee (40s infinite loop)
- Glass portrait frame with scanning line
- Tech Arsenal modal popup

### 🎭 Achievement Counters
- Animated counting (50+ projects, 30+ clients, 5+ years)
- Hover scale effects
- Icon integration

### 📧 Functional Contact Form
- EmailJS integration for real-time emails
- Form validation
- Success/error toasts
- Glowing inputs on focus
- Magnetic submit button

### 💼 LinkedIn Feed Section
- Animated carousel with 6 sample posts
- Glass cards with hover scan
- Hashtag pills
- Auto-refresh (10s interval)
- API endpoint at `/api/linkedin`

### 📊 Real-Time Status Page
- Route at `/status`
- System status banner
- Key metrics (uptime, response time)
- Service status grid
- 30-day uptime graph
- Auto-refresh (10s)

### 🌙 Theme Toggle
- Light/Dark mode switcher
- Persistent localStorage
- Animated icon rotation
- Floating button (bottom-right)

### ⏳ Preloader Animation
- Logo morph (borderRadius animation)
- Rotating gradient ring
- 3 orbiting particles
- Progress bar
- 3-second display

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your API keys

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🔗 API Setup Required

### EmailJS (Contact Form)
1. Sign up at [emailjs.com](https://www.emailjs.com/)
2. Create service + template
3. Update `src/components/Contact.tsx` lines 39-41

### LinkedIn Feed (Optional)
- Use LinkedIn API or RapidAPI scraper
- Update `/api/linkedin/route.ts`

### Status Monitoring (Optional)
- Use UptimeRobot or custom pings
- Update `/api/status/route.ts`

## 📁 Structure

```
src/
├── app/
│   ├── api/linkedin/route.ts
│   ├── api/status/route.ts
│   ├── status/page.tsx
│   └── page.tsx
├── components/
│   ├── About.tsx (Tech Arsenal)
│   ├── CustomCursor.tsx
│   ├── Contact.tsx
│   ├── LinkedInFeed.tsx
│   ├── Preloader.tsx
│   ├── ThemeToggle.tsx
│   └── ... (other sections)
```

## 🎨 Customization

**Colors** - Edit `tailwind.config.ts`
**Fonts** - Update `src/app/layout.tsx`
**Tech Badges** - Modify arrays in `About.tsx`
**Counters** - Change targets in `About.tsx`

## 📱 Responsive
- Mobile (320px+)
- Tablet (768px+)
- Desktop (1024px+)
- Large screens (1920px+)

---

Built with ❤️ by Vinay Siddha | © 2025
