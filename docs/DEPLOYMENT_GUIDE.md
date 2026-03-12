# Deployment Guide

## Overview

This guide covers deployment strategies for the Visual Admin Serbia platform, from development to production environments.

## Prerequisites

### System Requirements
- **Node.js**: v18.17 or higher
- **npm**: v9.0 or higher
- **Memory**: Minimum 2GB RAM
- **Storage**: Minimum 10GB free space
- **Network**: HTTPS (port 443) access

### Environment Variables
Copy `.env.example` to `.env.production` and configure:

```bash
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://vizuelni-admin-srbije.rs
NEXT_PUBLIC_APP_NAME="Визуелни Админ Србије"

# API
NEXT_PUBLIC_API_URL=https://data.gov.rs/api/1
NEXT_PUBLIC_API_V2_URL=https://data.gov.rs/api/2

# Features
NEXT_PUBLIC_ENABLE_MAPS=true
NEXT_PUBLIC_ENABLE_CHARTS=true
NEXT_PUBLIC_ENABLE_DOWNLOADS=true

# Localization
NEXT_PUBLIC_DEFAULT_LOCALE=sr-Cyrl

# Caching
CACHE_TTL_SECONDS=3600
API_TIMEOUT_MS=30000
```

## Build Process

### 1. Install Dependencies
```bash
npm ci --production=false
```

### 2. Run Tests
```bash
npm run test
npm run lint
npm run type-check
```

### 3. Build Application
```bash
npm run build
```

This creates:
- `.next/` directory with compiled application
- Optimized production bundles
- Static assets in `public/`

### 4. Test Production Build Locally
```bash
npm run start
```

Visit `http://localhost:3000` to verify.

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel provides optimal Next.js hosting with automatic deployments.

#### Setup
1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login
   vercel login
   
   # Link project
   vercel link
   ```

2. **Configure Environment**
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.production`

3. **Deploy**
   ```bash
   # Preview deployment
   vercel
   
   # Production deployment
   vercel --prod
   ```

4. **Custom Domain**
   - Add domain in Vercel dashboard
   - Configure DNS records
   - Enable HTTPS (automatic)

#### Automatic Deployments
- **Preview**: Every pull request
- **Production**: Every merge to `main` branch

#### Benefits
- ✅ Zero configuration
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Serverless functions
- ✅ Real-time analytics
- ✅ Preview deployments

### Option 2: Docker

Deploy using Docker containers for full control.

#### Dockerfile
```dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Production
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

#### Build & Run
```bash
# Build image
docker build -t vizuelni-admin-srbije .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://data.gov.rs/api/1 \
  vizuelni-admin-srbije
```

#### Docker Compose
```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=https://data.gov.rs/api/1
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### Option 3: Traditional VPS

Deploy on any VPS (DigitalOcean, Hetzner, AWS EC2, etc.)

#### Prerequisites
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx
```

#### Deploy Steps
```bash
# 1. Clone repository
git clone https://github.com/your-org/vizuelni-admin-srbije.git
cd vizuelni-admin-srbije

# 2. Install dependencies
npm ci

# 3. Build application
npm run build

# 4. Start with PM2
pm2 start npm --name "vizuelni-admin" -- start

# 5. Save PM2 config
pm2 save
pm2 startup
```

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name vizuelni-admin-srbije.rs www.vizuelni-admin-srbije.rs;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### HTTPS with Let's Encrypt
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d vizuelni-admin-srbije.rs -d www.vizuelni-admin-srbije.rs

# Auto-renewal
sudo systemctl enable certbot.timer
```

### Option 4: Static Export

For static hosting (GitHub Pages, Netlify, etc.)

#### Configure next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

module.exports = nextConfig;
```

#### Build & Deploy
```bash
# Build static site
npm run build

# Deploy to GitHub Pages
npm install -g gh-pages
gh-pages -d out

# Or deploy to Netlify
netlify deploy --prod --dir=out
```

**Note**: Static export has limitations:
- No server-side API routes
- No incremental static regeneration
- No server-side features

## Monitoring & Logging

### Application Monitoring

#### Vercel Analytics
- Automatic performance monitoring
- Real user metrics (RUM)
- Web Vitals tracking

#### Custom Analytics
```typescript
// lib/analytics.ts
export function trackEvent(category: string, action: string, label?: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label
    });
  }
}

// Usage
trackEvent('Dataset', 'View', 'budget-2025');
trackEvent('Chart', 'Create', 'bar-chart');
trackEvent('Export', 'Download', 'csv');
```

### Error Tracking

#### Sentry Integration
```bash
npm install @sentry/nextjs
```

```javascript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0
});
```

### Logging

#### Structured Logging
```typescript
// lib/logger.ts
interface LogEntry {
  level: 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
  context?: Record<string, any>;
}

export function log(entry: LogEntry) {
  const formatted = {
    ...entry,
    timestamp: new Date().toISOString(),
    service: 'vizuelni-admin-srbije'
  };
  
  if (process.env.NODE_ENV === 'production') {
    // Send to logging service
    console.log(JSON.stringify(formatted));
  } else {
    console.log(`[${entry.level.toUpperCase()}] ${entry.message}`, entry.context);
  }
}

// Usage
log({
  level: 'info',
  message: 'Dataset viewed',
  context: { datasetId: 'budget-2025', userId: 'anonymous' }
});
```

## Performance Optimization

### 1. Caching Strategy

#### Next.js Cache
```typescript
// app/api/datasets/route.ts
export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  const data = await fetchDatasets();
  return Response.json(data);
}
```

#### Redis Cache
```typescript
// lib/cache.ts
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 3600
): Promise<T> {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);
  
  const data = await fetcher();
  await redis.setex(key, ttl, JSON.stringify(data));
  return data;
}
```

### 2. CDN Configuration

#### Vercel (Automatic)
- Global edge network
- Automatic static asset caching
- Image optimization

#### Custom CDN
```javascript
// next.config.js
module.exports = {
  assetPrefix: process.env.CDN_URL || '',
  images: {
    loader: 'custom',
    loaderFile: './lib/imageLoader.js'
  }
};
```

### 3. Database Optimization (Optional)

If using database for caching or user data:

```typescript
// lib/db.ts
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn'] : ['error']
});

// Connection pooling
prisma.$connect();
```

## Security Checklist

### 1. Environment Variables
- ✅ Never commit `.env` files
- ✅ Use `.env.example` as template
- ✅ Encrypt secrets in CI/CD
- ✅ Rotate API keys regularly

### 2. HTTPS
- ✅ Enforce HTTPS redirects
- ✅ Use HSTS headers
- ✅ Valid SSL certificate
- ✅ Secure cookie flags

### 3. Security Headers
```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders
      }
    ];
  }
};
```

### 4. Content Security Policy
```javascript
{
  key: 'Content-Security-Policy',
  value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
}
```

## CI/CD Pipeline

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.API_URL }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## Backup & Recovery

### Database Backups (if applicable)
```bash
# Daily backup script
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Upload to S3
aws s3 cp backup-$(date +%Y%m%d).sql s3://backups/
```

### Application State
- Export user data regularly
- Backup environment configurations
- Version control all code changes

## Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

#### Memory Issues
```bash
# Increase Node memory
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

#### API Connection Issues
- Check `NEXT_PUBLIC_API_URL` is correct
- Verify network access to data.gov.rs
- Check rate limiting

### Health Check Endpoint
```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version
  });
}
```

## Support

- **Documentation**: `/docs`
- **Issues**: GitHub Issues
- **Email**: opendata@example.gov.rs

---

**Last Updated**: March 11, 2026
