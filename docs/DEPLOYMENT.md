# Deployment Guide

**Водич за деплојмент**  
**Complete deployment guide for Vizuelni Admin Srbije**

---

## 📋 Overview

This guide covers deployment options, configurations, and best practices for the Serbian Government Data Visualization Platform.

---

## 1. Prerequisites

### System Requirements

- **Node.js:** 18.17 or higher
- **npm/yarn/pnpm:** Latest stable version
- **Memory:** Minimum 512MB RAM
- **Storage:** 1GB minimum

### Environment Variables

Copy `.env.example` to `.env.production` and configure:

```env
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME="Vizuelni Admin Srbije"

# API Configuration
DATA_GOV_RS_API_URL=https://data.gov.rs/api/1
DATA_GOV_RS_API_KEY=your_production_key

# Features
NEXT_PUBLIC_DEFAULT_LANGUAGE=sr-cyr
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_GA_ID=UA-XXXXXXXXX-X

# Security
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=https://your-domain.com

# Database (Optional)
DATABASE_URL=postgresql://user:pass@host:5432/db
REDIS_URL=redis://host:6379
```

---

## 2. Build Process

### Local Build

```bash
# Install dependencies
npm ci

# Run tests
npm test

# Build application
npm run build

# Test production build locally
npm run start
```

### Build Optimization

The `next.config.js` includes optimizations:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Smaller deployment size
  compress: true,
  poweredByHeader: false,
  
  // Optimize images
  images: {
    domains: ['data.gov.rs'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Security headers
  async headers() {
    return [{
      source: '/:path*',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
    }];
  },
};
```

---

## 3. Deployment Options

### Option A: Vercel (Recommended) ✅

**Pros:** Zero-config, automatic SSL, edge caching, preview deployments

#### Steps:

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel --prod
```

4. **Configure Environment Variables**
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add all variables from `.env.production`

5. **Custom Domain**
   - Add domain in Vercel Dashboard
   - Configure DNS records
   - SSL is automatic

#### vercel.json Configuration

```json
{
  "version": 2,
  "builds": [
    { "src": "package.json", "use": "@vercel/next" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/$1" },
    { "src": "/(.*)", "dest": "/$1" }
  ],
  "regions": ["iad1"], // US East (closest to Serbia)
  "env": {
    "NEXT_PUBLIC_APP_NAME": "Vizuelni Admin Srbije"
  }
}
```

---

### Option B: Docker 🐳

#### Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATA_GOV_RS_API_URL=https://data.gov.rs/api/1
    env_file:
      - .env.production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
  
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
    restart: unless-stopped
```

#### Deploy with Docker

```bash
# Build image
docker build -t vizuelni-admin-srbije .

# Run container
docker run -p 3000:3000 vizuelni-admin-srbije

# Or use docker-compose
docker-compose up -d
```

---

### Option C: Traditional VPS

#### Using PM2

1. **Install PM2**
```bash
npm install -g pm2
```

2. **Build Application**
```bash
npm ci
npm run build
```

3. **Start with PM2**
```bash
pm2 start npm --name "vizuelni-admin" -- start
```

4. **Configure PM2 Startup**
```bash
pm2 startup
pm2 save
```

#### ecosystem.config.js

```javascript
module.exports = {
  apps: [{
    name: 'vizuelni-admin-srbije',
    script: 'npm',
    args: 'start',
    instances: 'max',
    exec_mode: 'cluster',
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

---

### Option D: Kubernetes

#### Deployment YAML

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vizuelni-admin
spec:
  replicas: 3
  selector:
    matchLabels:
      app: vizuelni-admin
  template:
    metadata:
      labels:
        app: vizuelni-admin
    spec:
      containers:
      - name: app
        image: vizuelni-admin-srbije:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: production
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
---
apiVersion: v1
kind: Service
metadata:
  name: vizuelni-admin-service
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 3000
  selector:
    app: vizuelni-admin
```

---

## 4. Reverse Proxy Configuration

### Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

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

    # Cache static assets
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

---

## 5. SSL/TLS Configuration

### Let's Encrypt (Certbot)

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo certbot renew --dry-run
```

---

## 6. Monitoring & Logging

### Application Monitoring

```typescript
// lib/monitoring.ts
export function initMonitoring() {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: 0.1,
    });
  }
}
```

### Health Check Endpoint

```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
  });
}
```

### Logging

```typescript
// lib/logger.ts
export const logger = {
  info: (message: string, meta?: any) => {
    console.log(JSON.stringify({ level: 'info', message, ...meta }));
  },
  error: (message: string, error?: any) => {
    console.error(JSON.stringify({ level: 'error', message, error: error.toString() }));
  },
};
```

---

## 7. Performance Optimization

### Caching Headers

```typescript
// next.config.js
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Cache-Control', value: 's-maxage=300, stale-while-revalidate' },
      ],
    },
    {
      source: '/_next/static/:path*',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      ],
    },
  ];
}
```

### CDN Configuration

- Use Vercel's Edge Network (automatic)
- Or configure CloudFront/Cloudflare for custom CDN
- Cache static assets at edge locations

---

## 8. Backup & Recovery

### Database Backups (if using PostgreSQL)

```bash
# Backup script
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Restore
psql $DATABASE_URL < backup_20260311.sql
```

### Automated Backups

```bash
# Cron job (runs daily at 2 AM)
0 2 * * * /path/to/backup-script.sh
```

---

## 9. Security Checklist

- ✅ Environment variables properly configured
- ✅ HTTPS enabled with valid SSL certificate
- ✅ Security headers configured
- ✅ Rate limiting implemented
- ✅ Input validation on all forms
- ✅ SQL injection protection (Prisma/parameterized queries)
- ✅ XSS protection (React's default)
- ✅ CSRF protection (Next.js built-in)
- ✅ Dependencies regularly updated
- ✅ Regular security audits

---

## 10. Troubleshooting

### Common Issues

**Build fails:**
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

**Environment variables not loading:**
- Ensure variables start with `NEXT_PUBLIC_` for client-side access
- Restart the server after changing env vars

**API requests failing:**
- Check CORS configuration
- Verify API URL is correct
- Check rate limiting

**Memory issues:**
```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

---

## 11. Rollback Procedure

### Vercel

```bash
# List deployments
vercel list

# Rollback to previous deployment
vercel rollback [deployment-url]
```

### Docker

```bash
# Tag current version
docker tag vizuelni-admin-srbije:latest vizuelni-admin-srbije:backup

# Rollback
docker-compose down
docker-compose up -d vizuelni-admin-srbije:backup
```

---

## 12. Post-Deployment Checklist

- [ ] Application loads successfully
- [ ] All languages work (sr-cyr, sr-lat, en)
- [ ] API integration functional
- [ ] Charts render correctly
- [ ] Mobile responsive
- [ ] SSL certificate valid
- [ ] Analytics tracking
- [ ] Error logging working
- [ ] Performance metrics acceptable
- [ ] Backup system operational

---

## 13. Support & Resources

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **Docker Docs:** https://docs.docker.com
- **Nginx Docs:** https://nginx.org/en/docs/

---

**Document Status:** Complete ✅  
**Last Updated:** March 11, 2026  
**Maintainer:** Vizuelni Admin Srbije Team
