# Deployment Guide

This guide covers deploying your portfolio to various platforms.

## 🚀 Vercel (Recommended)

Vercel is the recommended platform as it's built by the creators of Next.js.

### Method 1: Deploy via Vercel Dashboard

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/portfolio.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"

3. **Configure Domain (Optional)**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

### Method 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Environment Variables

If you add environment variables later:
1. Go to Project Settings → Environment Variables
2. Add your variables
3. Redeploy

## 🌐 Netlify

### Deploy to Netlify

1. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: 18.x

2. **Via Netlify Dashboard**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub
   - Select your repository
   - Configure build settings
   - Deploy

3. **Via Netlify CLI**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli

   # Login
   netlify login

   # Deploy
   netlify deploy --prod
   ```

## ☁️ AWS Amplify

### Deploy to AWS Amplify

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click "New app" → "Host web app"
3. Connect your GitHub repository
4. Configure build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```
5. Deploy

## 🔷 Azure Static Web Apps

### Deploy to Azure

1. Install Azure CLI
2. Create Static Web App:
   ```bash
   az staticwebapp create \
     --name my-portfolio \
     --resource-group my-resource-group \
     --source https://github.com/yourusername/portfolio \
     --location "eastus2" \
     --branch main \
     --app-location "/" \
     --output-location ".next"
   ```

## 🐳 Docker Deployment

### Create Dockerfile

Already included in the project. Build and run:

```bash
# Build
docker build -t portfolio .

# Run
docker run -p 3000:3000 portfolio
```

### Deploy to Docker Hub

```bash
# Tag
docker tag portfolio yourusername/portfolio:latest

# Push
docker push yourusername/portfolio:latest
```

## 📊 Performance Optimization for Production

### 1. Image Optimization

Add to `next.config.js`:
```javascript
module.exports = {
  images: {
    formats: ['image/webp', 'image/avif'],
    domains: ['your-cdn-domain.com'],
  },
}
```

### 2. Enable Compression

Already enabled in Next.js by default.

### 3. Add Analytics

**Vercel Analytics:**
```bash
npm install @vercel/analytics
```

In `src/app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react'

// Add <Analytics /> to body
```

**Google Analytics:**
```bash
npm install @next/third-parties
```

### 4. Optimize Fonts

Already optimized with next/font in the project.

## 🔒 Security Headers

Add to `next.config.js`:
```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
        ],
      },
    ]
  },
}
```

## 📈 Post-Deployment Checklist

- [ ] Test all links (projects, social media)
- [ ] Verify contact form works
- [ ] Check mobile responsiveness
- [ ] Test loading speed (use Lighthouse)
- [ ] Verify SEO meta tags
- [ ] Test on different browsers
- [ ] Check console for errors
- [ ] Verify images load correctly
- [ ] Test resume download
- [ ] Check all animations work

## 🛠️ Troubleshooting

### Build Fails

**Issue**: TypeScript errors
```bash
# Check for errors
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

**Issue**: Module not found
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

### Slow Loading

1. Use Lighthouse to identify issues
2. Optimize images (compress, use WebP)
3. Enable caching
4. Use CDN for static assets

### Environment Variables Not Working

1. Prefix with `NEXT_PUBLIC_` for client-side variables
2. Restart dev server after adding variables
3. Rebuild for production

## 🎯 Domain Setup

### Custom Domain on Vercel

1. Go to Project Settings → Domains
2. Add your domain (e.g., `yourdomain.com`)
3. Update DNS records at your domain registrar:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### SSL Certificate

SSL is automatically provisioned on Vercel, Netlify, and other platforms.

## 📱 Progressive Web App (PWA)

To make your portfolio a PWA:

```bash
npm install next-pwa
```

See PWA_SETUP.md for detailed instructions.

## 🔄 Continuous Deployment

All mentioned platforms support automatic deployments:
- Push to `main` branch → Auto-deploy to production
- Push to other branches → Deploy preview

## 📊 Monitoring

### Vercel
- Analytics automatically included
- Real-time monitoring in dashboard

### Custom Monitoring
Add Sentry for error tracking:
```bash
npm install @sentry/nextjs
```

---

## 🎉 Success!

Your portfolio should now be live and accessible worldwide!

**Don't forget to:**
1. Share your portfolio link
2. Add it to your resume
3. Link it on LinkedIn
4. Share on social media

Need help? Check the [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
