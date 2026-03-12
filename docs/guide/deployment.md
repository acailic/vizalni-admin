# Deployment Guide

**Complete guide to deploying Vizualni Admin in production**

Deploy Vizualni Admin to various hosting platforms, from static sites to scalable cloud infrastructure. This guide covers security, performance, monitoring, and maintenance.

## 🚀 Quick Deployment Options

### 1. Vercel (Recommended for Next.js Apps)

**⭐ Easiest deployment** with automatic optimization

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
vercel --prod

# Follow the prompts to connect your GitHub account
```

**Environment Variables:**
```env
DATABASE_URL=your_postgres_connection_string
DATA_GOV_RS_API_URL=https://data.gov.rs/api/1
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
```

**Features:**
- ✅ Automatic HTTPS
- ✅ CDN distribution
- ✅ Edge functions
- ✅ Preview deployments
- ✅ Automatic rollbacks

---

### 2. Netlify (Static Sites)

**🏗️ Great for static documentation and demos**

```bash
# Build static version
yarn build:static

# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=app/out
```

**netlify.toml:**
```toml
[build]
  base = "app/"
  command = "yarn build:static"
  publish = "out"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
```

---

### 3. Docker Containers

**🐳 Universal deployment for any cloud provider**

```dockerfile
# Dockerfile
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN yarn install --frozen-lockfile

FROM base AS builder
COPY . .
RUN yarn build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/vizualni_admin
      - DATA_GOV_RS_API_URL=https://data.gov.rs/api/1
      - NEXT_PUBLIC_SITE_URL=https://your-domain.com
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=vizualni_admin
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl/certs
    depends_on:
      - app

volumes:
  postgres_data:
```

**Deploy to AWS:**
```bash
# Build and push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $ECR_REGISTRY
docker build -t vizualni-admin .
docker tag vizualni-admin:latest $ECR_REGISTRY/vizualni-admin:latest
docker push $ECR_REGISTRY/vizualni-admin:latest

# Deploy to ECS/Elastic Beanstalk
```

---

## 🔧 Environment Configuration

### Production Environment Variables

Create `.env.production`:

```env
# Database
DATABASE_URL=postgresql://username:password@hostname:5432/database_name
DATABASE_POOL_SIZE=20
DATABASE_SSL=true

# Data.gov.rs API
DATA_GOV_RS_API_URL=https://data.gov.rs/api/1
DATA_GOV_RS_API_TIMEOUT=30000
DATA_GOV_RS_CACHE_TTL=3600

# Next.js
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://api.your-domain.com

# Analytics & Monitoring
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn

# Security
JWT_SECRET=your-super-secret-jwt-key
ENCRYPTION_KEY=your-32-character-encryption-key

# Performance
NODE_ENV=production
ENABLE_ANALYTICS=true
ENABLE_ERROR_TRACKING=true

# Features
ENABLE_CACHING=true
ENABLE_COMPRESSION=true
ENABLE_RATE_LIMITING=true
```

### Database Setup

**PostgreSQL Production Configuration:**

```sql
-- Create database and user
CREATE DATABASE vizualni_admin;
CREATE USER vizualni_admin_user WITH ENCRYPTED PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE vizualni_admin TO vizualni_admin_user;

-- Create extensions
\c vizualni_admin;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Performance optimizations
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
ALTER SYSTEM SET max_connections = 200;
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';

-- Apply changes
SELECT pg_reload_conf();
```

## 🔒 Security Configuration

### 1. SSL/HTTPS Setup

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/ssl/certs/your-domain.crt;
    ssl_certificate_key /etc/ssl/certs/your-domain.key;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

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

### 2. Rate Limiting

**Rate limiting middleware:**
```typescript
// middleware/rateLimiter.ts
import { NextRequest, NextResponse } from 'next/server'
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
})

export function middleware(request: NextRequest) {
  return limiter(request, NextResponse.next())
}
```

### 3. Content Security Policy

**CSP Configuration:**
```typescript
// next.config.js
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https: blob:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://data.gov.rs https://api.github.com;
  frame-src 'self' https://codesandbox.io https://www.youtube.com;
`.replace(/\s{2,}/g, ' ').trim()

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy,
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
]

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}
```

## 📊 Performance Optimization

### 1. Build Optimization

**next.config.js:**
```javascript
const nextConfig = {
  // Production optimizations
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Image optimization
  images: {
    domains: ['your-domain.com', 'data.gov.rs'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
  },

  // Bundle analyzer
  webpack: (config, { isServer }) => {
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
        })
      )
    }

    return config
  },

  // Compression
  compress: true,

  // Experimental features
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@acailic/vizualni-admin'],
  },
}

module.exports = nextConfig
```

### 2. Caching Strategy

**Redis Cache Setup:**
```typescript
// lib/cache.ts
import Redis from 'ioredis'

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
})

export async function getCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 3600
): Promise<T> {
  // Try to get cached data
  const cached = await redis.get(key)
  if (cached) {
    return JSON.parse(cached)
  }

  // Fetch fresh data
  const data = await fetcher()

  // Cache the result
  await redis.setex(key, ttl, JSON.stringify(data))

  return data
}
```

### 3. CDN Configuration

**CloudFlare Setup:**
```javascript
// Cache rules
const cacheRules = {
  // Static assets - long cache
  '/_next/static/*': {
    edgeCacheTTL: 365 * 24 * 60 * 60, // 1 year
    browserCacheTTL: 365 * 24 * 60 * 60,
  },

  // API responses - medium cache
  '/api/*': {
    edgeCacheTTL: 5 * 60, // 5 minutes
    browserCacheTTL: 0,
  },

  // Pages - short cache
  '/*': {
    edgeCacheTTL: 10 * 60, // 10 minutes
    browserCacheTTL: 0,
  }
}
```

## 📈 Monitoring & Analytics

### 1. Error Tracking

**Sentry Integration:**
```typescript
// sentry.client.config.js
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  beforeSend(event) {
    // Filter out sensitive data
    if (event.exception) {
      const error = event.exception.values?.[0]
      if (error?.value?.includes('DATABASE_URL')) {
        return null
      }
    }
    return event
  }
})
```

### 2. Performance Monitoring

**Web Vitals:**
```typescript
// components/analytics.tsx
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

function sendToAnalytics(metric: any) {
  // Send to your analytics service
  gtag('event', metric.name, {
    value: Math.round(metric.value),
    event_category: 'Web Vitals',
    event_label: metric.id,
    non_interaction: true,
  })
}

export function reportWebVitals() {
  getCLS(sendToAnalytics)
  getFID(sendToAnalytics)
  getFCP(sendToAnalytics)
  getLCP(sendToAnalytics)
  getTTFB(sendToAnalytics)
}
```

### 3. Health Checks

**Health endpoint:**
```typescript
// pages/api/health.ts
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Check database connection
    await db.raw('SELECT 1')

    // Check external API
    const apiCheck = await fetch('https://data.gov.rs/api/1')

    // Check Redis
    await redis.ping()

    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      checks: {
        database: 'ok',
        external_api: apiCheck.ok ? 'ok' : 'error',
        cache: 'ok'
      }
    })
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message
    })
  }
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy Vizualni Admin

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'yarn'

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Run type checking
        run: yarn typecheck

      - name: Run linting
        run: yarn lint

      - name: Run tests
        run: yarn test
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db

      - name: Build application
        run: yarn build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### Deployment Scripts

**deploy.sh:**
```bash
#!/bin/bash

set -e

echo "🚀 Starting deployment..."

# Load environment variables
if [ -f .env.production ]; then
  export $(cat .env.production | grep -v '^#' | xargs)
fi

# Run database migrations
echo "📊 Running database migrations..."
yarn db:migrate

# Build application
echo "🔨 Building application..."
yarn build

# Run health check
echo "🏥 Running health check..."
curl -f http://localhost:3000/api/health || exit 1

# Deploy to production
echo "🚀 Deploying to production..."
if command -v vercel &> /dev/null; then
  vercel --prod
elif command -v docker &> /dev/null; then
  docker build -t vizualni-admin .
  docker push $ECR_REGISTRY/vizualni-admin:latest
else
  echo "❌ No deployment tool found"
  exit 1
fi

echo "✅ Deployment complete!"

# Notify team
if [ -n "$SLACK_WEBHOOK" ]; then
  curl -X POST -H 'Content-type: application/json' \
    --data "{\"text\":\"✅ Vizualni Admin deployed successfully!\"}" \
    $SLACK_WEBHOOK
fi
```

## 🔧 Maintenance

### Backup Strategy

**Database Backups:**
```bash
#!/bin/bash

# backup-db.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="vizualni_admin_backup_$DATE.sql"

# Create backup
pg_dump $DATABASE_URL > $BACKUP_FILE

# Compress
gzip $BACKUP_FILE

# Upload to S3
aws s3 cp $BACKUP_FILE.gz s3://your-backup-bucket/

# Clean up old backups (keep last 30 days)
aws s3 ls s3://your-backup-bucket/ | while read -r line; do
  createDate=`echo $line|awk {'print $1" "$2'}`
  createDate=`date -d"$createDate" +%s`
  olderThan=`date -d"30 days ago" +%s`
  if [[ $createDate -lt $olderThan ]]; then
    fileName=`echo $line|awk {'print $4'}`
    if [[ $fileName != "" ]]; then
      aws s3 rm s3://your-backup-bucket/$fileName
    fi
  fi
done
```

### Log Management

**Log Rotation:**
```bash
# /etc/logrotate.d/vizualni-admin
/var/log/vizualni-admin/*.log {
  daily
  missingok
  rotate 30
  compress
  delaycompress
  notifempty
  create 644 node node
  postrotate
    systemctl reload vizualni-admin
  endscript
}
```

---

*Need help with deployment? [Contact our support team](mailto:support@vizualni-admin.rs) or [open an issue](https://github.com/acailic/vizualni-admin/issues).*