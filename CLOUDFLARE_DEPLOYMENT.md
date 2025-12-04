# Cloudflare Pages Deployment Guide

## Overview
This Next.js portfolio is configured for static export and optimized for Cloudflare Pages deployment.

## Build Configuration
- **Output**: Static export (`output: 'export'` in `next.config.js`)
- **Images**: Unoptimized for static compatibility
- **API Routes**: Removed (incompatible with static export)

## Deployment Steps

### Option 1: Cloudflare Pages Dashboard
1. Login to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Go to **Pages** → **Create a project**
3. Connect your Git repository (GitHub/GitLab)
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
   - **Root directory**: `/`
   - **Node version**: `18` or higher

### Option 2: Wrangler CLI
```bash
# Install Wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy
npm run build
wrangler pages deploy out --project-name=your-project-name
```

## Build Commands
```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build (creates /out directory)
npm run build

# Preview production build locally
npx serve out
```

## Features
- ✅ Fully static export
- ✅ Optimized for Cloudflare Pages
- ✅ Fast global CDN delivery
- ✅ Automatic HTTPS
- ✅ Preview deployments for branches
- ✅ Rollback capability

## Post-Deployment
After deployment, your site will be available at:
- Production: `https://your-project-name.pages.dev`
- Custom domain: Configure in Cloudflare Pages settings

## Troubleshooting

### Build Fails
- Clear cache: `rm -rf .next out`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Node version: `node --version` (should be 18+)

### Routing Issues
- The `_redirects` file in `/public` handles SPA routing
- All routes redirect to `/index.html` for client-side routing

### Images Not Loading
- Ensure images are in `/public` directory
- Use relative paths: `/images/photo.jpg`
- Images are served unoptimized for static export compatibility

## Environment Variables
If you need environment variables:
1. Go to Cloudflare Pages project settings
2. Navigate to **Settings** → **Environment variables**
3. Add variables for Production and Preview environments
4. Prefix public variables with `NEXT_PUBLIC_`

## Performance
- Global CDN distribution
- Automatic asset optimization
- HTTP/3 and Brotli compression
- Edge caching

## Support
For issues related to:
- **Portfolio**: Check GitHub repository issues
- **Cloudflare Pages**: [Cloudflare Docs](https://developers.cloudflare.com/pages/)
- **Next.js Static Export**: [Next.js Docs](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
