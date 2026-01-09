# Deployment Guide / Водич за распоређивање

Complete guide to deploying Vizualni Admin to various platforms.

---

## 📋 Table of Contents

- [Before You Deploy](#before-you-deploy)
- [GitHub Pages (Recommended)](#github-pages)
- [Vercel](#vercel)
- [Netlify](#netlify)
- [Docker](#docker)
- [Custom Server](#custom-server)
- [Static Export](#static-export)
- [Environment Variables](#environment-variables)

---

## Before You Deploy

### Checklist
- [ ] Update `package.json` version
- [ ] Test your build locally: `yarn build`
- [ ] Review environment variables
- [ ] Check responsive design
- [ ] Test all interactive features

### Build Commands

```bash
# Standard build
yarn build

# Static export (for GitHub Pages)
NEXT_PUBLIC_BASE_PATH=/your-repo-name yarn build:static

# Optimized build
yarn build:optimized

# Build for production with analysis
yarn build:analyze
```

---

## GitHub Pages (Recommended) / GitHub Pages (Препоручено)

### Automatic Deployment (Easiest)

1. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main` and `/ (root)`
   - Save

2. **Push to Main**
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

3. **Wait for Deployment**
   - GitHub Actions will automatically build and deploy
   - Visit: `https://username.github.io/vizualni-admin/`

### Manual Deployment

```bash
# Build for GitHub Pages
NEXT_PUBLIC_BASE_PATH=/vizualni-admin yarn build:gh-pages

# Deploy using gh-pages CLI
npm install -g gh-pages
cd app/out
gh-pages -d . -b gh-pages
```

### Local Testing for GitHub Pages

```bash
# Build and serve locally
yarn build:gh-pages-local
yarn serve:gh-pages

# Visit http://localhost:3000/vizualni-admin/
```

---

## Environment Variables

### Required for Production

```bash
# Next.js
NODE_ENV=production

# App Configuration
NEXT_PUBLIC_APP_NAME=Vizualni Admin
NEXT_PUBLIC_DEFAULT_LOCALE=sr
NEXT_PUBLIC_SUPPORTED_LOCALES=sr,en

# Maps (optional)
NEXT_PUBLIC_MAPTILER_STYLE_KEY=your_key

# Authentication (optional)
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your_secret
```

### Optional
- `DATA_GOV_RS_API_KEY` - API key for data.gov.rs (for write operations)
- `DATA_GOV_RS_API_URL` - API URL (default: https://data.gov.rs/api/1)
- `NEXT_PUBLIC_MAPTILER_STYLE_KEY` - Maptiler API key for map visualizations
- `PREVENT_SEARCH_BOTS` - Set to `true` to prevent search engine indexing

## Docker Deployment

### Build the Image

```bash
docker build -t vizualni-admin:latest .
```

### Run the Container

```bash
docker run -d \
  --name vizualni-admin \
  -p 3000:3000 \
  -e DATABASE_URL="postgres://user:pass@host:5432/db" \
  -e NEXTAUTH_SECRET="your-secret-here" \
  -e NEXTAUTH_URL="https://your-domain.com" \
  vizualni-admin:latest
```

### Docker Compose

Create a `docker-compose.production.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgres://postgres:password@db:5432/vizualni_admin
      NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}
      NEXTAUTH_URL: ${NEXTAUTH_URL}
      DATA_GOV_RS_API_KEY: ${DATA_GOV_RS_API_KEY}
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:15
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: vizualni_admin
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    restart: unless-stopped

volumes:
  postgres_data:
```

Deploy:

```bash
docker-compose -f docker-compose.production.yml up -d
```

## Cloud Platforms

### Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Set environment variables in Vercel dashboard

4. Connect PostgreSQL database (use Vercel Postgres or external provider)

### Heroku

1. Create a new Heroku app:
   ```bash
   heroku create vizualni-admin
   ```

2. Add PostgreSQL addon:
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

3. Set environment variables:
   ```bash
   heroku config:set NEXTAUTH_SECRET="your-secret"
   heroku config:set NEXTAUTH_URL="https://your-app.herokuapp.com"
   ```

4. Deploy:
   ```bash
   git push heroku main
   ```

### AWS (EC2)

1. Launch an EC2 instance (Ubuntu 22.04 recommended)

2. Install dependencies:
   ```bash
   sudo apt update
   sudo apt install -y nodejs npm postgresql
   npm install -g yarn pm2
   ```

3. Clone and build:
   ```bash
   git clone https://github.com/acailic/vizualni-admin.git
   cd vizualni-admin
   yarn install
   yarn build
   ```

4. Start with PM2:
   ```bash
   pm2 start yarn --name "vizualni-admin" -- start
   pm2 save
   pm2 startup
   ```

5. Set up Nginx reverse proxy (optional)

### Google Cloud Platform (Cloud Run)

1. Build and push to Container Registry:
   ```bash
   gcloud builds submit --tag gcr.io/PROJECT_ID/vizualni-admin
   ```

2. Deploy to Cloud Run:
   ```bash
   gcloud run deploy vizualni-admin \
     --image gcr.io/PROJECT_ID/vizualni-admin \
     --platform managed \
     --region europe-west1 \
     --allow-unauthenticated
   ```

3. Add Cloud SQL PostgreSQL database

4. Set environment variables in Cloud Run console

## Database Setup

### PostgreSQL on Production

1. Create database:
   ```sql
   CREATE DATABASE vizualni_admin;
   CREATE USER vizualni_user WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE vizualni_admin TO vizualni_user;
   ```

2. Run migrations:
   ```bash
   yarn db:migrate
   ```

### Managed PostgreSQL Services

Consider using managed services:
- **Heroku Postgres** - Easy setup, good for small-medium apps
- **AWS RDS** - Scalable, enterprise-grade
- **Google Cloud SQL** - Integrated with GCP
- **DigitalOcean Managed Databases** - Simple and affordable
- **Supabase** - Modern, open-source alternative

## SSL/HTTPS

### Let's Encrypt with Nginx

1. Install Certbot:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   ```

2. Obtain certificate:
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

3. Auto-renewal:
   ```bash
   sudo certbot renew --dry-run
   ```

## Monitoring and Logging

### Application Monitoring

Consider these services:
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **New Relic** - Performance monitoring
- **DataDog** - Infrastructure monitoring

### Log Management

- **Docker logs**: `docker logs vizualni-admin`
- **PM2 logs**: `pm2 logs vizualni-admin`
- **Cloud platform logs**: Use platform-specific logging

## Performance Optimization

### Caching

1. Enable Redis for caching:
   ```env
   REDIS_URL=redis://localhost:6379
   ```

2. Configure CDN for static assets (CloudFlare, AWS CloudFront)

### Build Optimization

```bash
# Analyze bundle size
yarn build
npx @next/bundle-analyzer
```

## Security Checklist

- [ ] Use strong `NEXTAUTH_SECRET`
- [ ] Enable HTTPS in production
- [ ] Set `NODE_ENV=production`
- [ ] Restrict database access
- [ ] Enable rate limiting
- [ ] Keep dependencies updated
- [ ] Use environment variables for secrets
- [ ] Enable CORS only for trusted domains
- [ ] Regular security audits

## Backup Strategy

### Database Backups

1. Automated PostgreSQL backups:
   ```bash
   pg_dump -U vizualni_user vizualni_admin > backup_$(date +%Y%m%d).sql
   ```

2. Schedule with cron:
   ```
   0 2 * * * /path/to/backup-script.sh
   ```

### Configuration Backups

- Keep `.env` files in secure, encrypted storage
- Document all environment variables
- Maintain infrastructure-as-code (Terraform, CloudFormation)

## Scaling

### Horizontal Scaling

- Deploy multiple app instances behind a load balancer
- Use stateless sessions (database-backed sessions)
- Share Redis instance across app instances

### Vertical Scaling

- Increase server resources (CPU, RAM)
- Optimize PostgreSQL configuration
- Use database connection pooling (PgBouncer)

## Troubleshooting

### Common Issues

**App won't start:**
- Check environment variables
- Verify database connection
- Check logs for errors

**Slow performance:**
- Enable caching
- Optimize database queries
- Use CDN for static assets

**Database connection errors:**
- Verify DATABASE_URL
- Check firewall rules
- Ensure database is running

## Support

For deployment issues:
- Check [GitHub Issues](https://github.com/acailic/vizualni-admin/issues)
- Review [documentation](README.md)
- Contact the maintainers
