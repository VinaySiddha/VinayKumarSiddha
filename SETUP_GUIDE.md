# 🚀 Quick Setup Guide

Follow these steps to get your portfolio up and running:

## Step 1: Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

This will install all required dependencies:
- Next.js 14
- React 18
- Framer Motion (animations)
- Lucide React (icons)
- Tailwind CSS
- TypeScript

## Step 2: Customize Your Content

### Update Personal Information

1. **Hero Section** (`src/components/Hero.tsx`):
   - Change name from "Vinny" to your name
   - Update title and subtitle
   - Add your actual social media links (GitHub, LinkedIn, Email)

2. **About Section** (`src/components/About.tsx`):
   - Modify the description to match your background
   - Update highlights to reflect your achievements

3. **Skills Section** (`src/components/Skills.tsx`):
   - Add/remove skills based on your expertise
   - Update statistics (DSA problems, certifications, etc.)

4. **Projects Section** (`src/components/Projects.tsx`):
   - Replace with your actual projects
   - Update project descriptions, tech stacks, and links
   - Add project screenshots to `public/projects/` folder

5. **Experience Section** (`src/components/Experience.tsx`):
   - Add your work experience, education, and achievements
   - Update timeline with your milestones

6. **Contact Section** (`src/components/Contact.tsx`):
   - Update email address
   - Add your actual social media URLs

## Step 3: Add Your Resume

Place your resume PDF in the `public` folder:
```
public/resume.pdf
```

## Step 4: Add Project Images

Create project screenshots and add them to:
```
public/projects/
├── rag.png
├── weather.png
├── whatsapp.png
├── coding.png
├── mistral.png
└── analytics.png
```

Recommended image dimensions: 1200x675px (16:9 ratio)

## Step 5: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your portfolio!

## Step 6: Test Responsiveness

Test your portfolio on different screen sizes:
- Mobile (375px)
- Tablet (768px)
- Desktop (1280px)
- Large Desktop (1920px)

## Step 7: Build for Production

When you're ready to deploy:

```bash
npm run build
```

Test the production build locally:
```bash
npm start
```

## Step 8: Deploy to Vercel

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Click "Deploy"

Your portfolio will be live in minutes!

## 🎨 Customization Tips

### Change Colors

Edit `tailwind.config.ts`:
```typescript
colors: {
  neonBlue: '#YOUR_COLOR',
  neonPurple: '#YOUR_COLOR',
  neonPink: '#YOUR_COLOR',
}
```

### Adjust Animations

Modify animation durations in components using Framer Motion:
```typescript
transition={{ duration: 0.8 }} // Change to your preference
```

### Add More Sections

Create new components in `src/components/` and import them in `src/app/page.tsx`

## 🐛 Common Issues

### Issue: Module not found errors
**Solution**: Run `npm install` again

### Issue: Port 3000 already in use
**Solution**: Run on different port: `npm run dev -- -p 3001`

### Issue: Animations not smooth
**Solution**: Ensure hardware acceleration is enabled in your browser

### Issue: Build fails
**Solution**: Check for TypeScript errors: `npm run lint`

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)

## ✨ Pro Tips

1. **Optimize Images**: Use WebP format for faster loading
2. **Add Analytics**: Integrate Google Analytics or Vercel Analytics
3. **SEO**: Update meta tags in `src/app/layout.tsx`
4. **Performance**: Test with Lighthouse in Chrome DevTools
5. **Accessibility**: Ensure proper contrast ratios and ARIA labels

## 🎯 Next Steps

- [ ] Customize all content
- [ ] Add your projects
- [ ] Upload resume
- [ ] Test on mobile devices
- [ ] Deploy to Vercel
- [ ] Share your portfolio!

---

Need help? Check the README.md for detailed documentation.

**Good luck with your portfolio! 🚀**
