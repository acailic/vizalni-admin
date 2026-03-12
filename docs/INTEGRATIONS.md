# Integrations Guide

This guide covers integrating Vizualni Admin with various third-party tools and platforms. Whether you're embedding visualizations in content management systems, tracking usage with analytics, connecting to external data sources, or deploying your application, this document provides examples and best practices.

## Table of Contents

- [CMS Integrations](#cms-integrations)
  - [WordPress](#wordpress)
  - [Drupal](#drupal)
- [Analytics Tools](#analytics-tools)
  - [Google Analytics](#google-analytics)
  - [Plausible](#plausible)
- [Data Sources](#data-sources)
  - [APIs](#apis)
  - [Databases](#databases)
- [Deployment Platforms](#deployment-platforms)
  - [Vercel](#vercel)
  - [Netlify](#netlify)
  - [GitHub Pages](#github-pages)
  - [Custom Server](#custom-server)

## CMS Integrations

Vizualni Admin visualizations can be embedded into popular CMS platforms using iframes, custom plugins, or shortcodes. This allows you to display interactive charts directly within your website's content.

### WordPress

To integrate Vizualni Admin charts into WordPress:

1. **Deploy your Vizualni Admin app** to a publicly accessible URL (e.g., using Vercel or Netlify).
2. **Use an iframe shortcode** to embed the chart in posts or pages.

#### Example: Embedding a Chart via Iframe

Install a plugin like "Iframe" or use the built-in shortcode support. Add the following shortcode to your post:

```html
[iframe src="https://your-vizualni-admin-app.com/chart-page" width="100%" height="600"]
```

For more advanced integration, create a custom plugin that loads Vizualni Admin components directly.

#### Best Practices

- Ensure the iframe allows cross-origin access if needed.
- Use responsive widths (e.g., 100%) for mobile compatibility.
- Optimize chart data to reduce load times.
- Test embedding in different themes to avoid styling conflicts.

### Drupal

In Drupal, you can embed Vizualni Admin visualizations using modules like "Iframe" or custom blocks.

1. **Deploy your app** as described above.
2. **Create a custom block** or use the CKEditor to insert an iframe.

#### Example: Custom Block with Iframe

Create a custom block in Drupal:

```php
// In a custom module, define a block
function my_module_block_info() {
  $blocks['vizualni_chart'] = array(
    'info' => t('Vizualni Admin Chart'),
  );
  return $blocks;
}

function my_module_block_view($delta = '') {
  $block = array();
  if ($delta == 'vizualni_chart') {
    $block['content'] = '<iframe src="https://your-vizualni-admin-app.com/chart-page" width="100%" height="600" frameborder="0"></iframe>';
  }
  return $block;
}
```

#### Best Practices

- Use Drupal's caching mechanisms to improve performance.
- Secure iframes with appropriate CSP headers.
- Provide fallback content for users with JavaScript disabled.
- Integrate with Drupal's theming system for consistent styling.

## Analytics Tools

Integrate analytics to track user interactions with your visualizations. This helps understand usage patterns and improve the user experience.

### Google Analytics

Add Google Analytics tracking to your Vizualni Admin app.

1. **Install the gtag library** in your Next.js app.
2. **Initialize GA** in `_app.tsx` or a layout component.
3. **Track custom events** for chart interactions.

#### Example: Setting Up GA

```typescript
// In _app.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Load GA script
    const script = document.createElement('script');
    script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');

    // Track page views
    const handleRouteChange = (url) => {
      gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: url,
      });
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return <Component {...pageProps} />;
}

export default MyApp;
```

#### Best Practices

- Respect user privacy with consent management (e.g., GDPR compliance).
- Track meaningful events like chart loads, filters applied, or data exports.
- Use GA4 for modern analytics features.
- Avoid tracking sensitive data.

### Plausible

Plausible is a privacy-focused analytics alternative. It's lightweight and doesn't use cookies.

1. **Add the Plausible script** to your app.
2. **Configure custom events** for visualizations.

#### Example: Integrating Plausible

```typescript
// In _app.tsx
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://plausible.io/js/script.js';
    script.defer = true;
    script.setAttribute('data-domain', 'your-domain.com');
    document.head.appendChild(script);
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
```

To track custom events (e.g., chart interactions):

```typescript
// In a chart component
import { useEffect } from 'react';

function ChartComponent() {
  useEffect(() => {
    // Track chart view
    if (window.plausible) {
      window.plausible('Chart View', { props: { chartType: 'bar' } });
    }
  }, []);

  return <div>Your chart here</div>;
}
```

#### Best Practices

- Use Plausible for privacy-compliant analytics.
- Track aggregated events without personal data.
- Combine with server-side analytics for comprehensive insights.
- Monitor performance impact (Plausible is very lightweight).

## Data Sources

Vizualni Admin can connect to various data sources to populate visualizations dynamically.

### APIs

Connect to REST or GraphQL APIs for real-time data.

#### Example: Fetching Data from an API

```typescript
// In a Next.js page or component
import { useEffect, useState } from 'react';

function DataVisualization() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('https://api.example.com/data')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      {/* Render chart with data */}
    </div>
  );
}
```

For Serbian open data, integrate with data.gov.rs:

```typescript
import { DataGovRsClient } from 'vizualni-admin';

const client = new DataGovRsClient();

async function fetchSerbianData() {
  const datasets = await client.searchDatasets({ category: 'finance' });
  // Process and visualize data
}
```

#### Best Practices

- Implement error handling and loading states.
- Use caching (e.g., SWR or React Query) to reduce API calls.
- Handle rate limits and authentication.
- Validate data before visualization.

### Databases

Connect to databases via APIs or direct connections (server-side).

#### Example: Connecting via API

For databases exposed via REST APIs:

```typescript
// Server-side data fetching in Next.js
export async function getServerSideProps() {
  const res = await fetch('https://your-api.com/database-query');
  const data = await res.json();

  return { props: { data } };
}
```

For direct database connections (use serverless functions):

```typescript
// In a Next.js API route (/pages/api/data.js)
import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const [rows] = await connection.execute('SELECT * FROM your_table');
  res.status(200).json(rows);
}
```

#### Best Practices

- Use environment variables for connection credentials.
- Implement connection pooling for performance.
- Sanitize queries to prevent SQL injection.
- Cache results to reduce database load.

## Deployment Platforms

Deploy your Vizualni Admin application to various platforms for global accessibility.

### Vercel

Vercel is optimized for Next.js applications.

1. **Connect your GitHub repo** to Vercel.
2. **Configure build settings** in vercel.json.

#### Example: vercel.json

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["fra1"]
}
```

#### Best Practices

- Use Vercel's preview deployments for testing.
- Configure custom domains and SSL.
- Monitor performance with Vercel Analytics.
- Set up environment variables securely.

### Netlify

Netlify supports static and serverless deployments.

1. **Deploy from Git** or drag-and-drop builds.
2. **Configure build settings** in netlify.toml.

#### Example: netlify.toml

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

#### Best Practices

- Use Netlify Functions for serverless APIs.
- Enable Netlify's CDN for fast global delivery.
- Set up form handling and authentication.
- Integrate with Netlify's CMS for content management.

### GitHub Pages

For static deployments, use GitHub Pages.

1. **Build the app statically** using `next export`.
2. **Deploy via GitHub Actions**.

#### Example: GitHub Actions Workflow

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run export
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
```

#### Best Practices

- Use a custom domain for professional appearance.
- Enable HTTPS for security.
- Monitor repository size limits.
- Use GitHub's CDN for performance.

### Custom Server

For full control, deploy to your own server.

1. **Build the app** for production.
2. **Serve with a Node.js server** or static hosting.

#### Example: Express Server

```javascript
const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});
```

#### Best Practices

- Use a reverse proxy like Nginx for performance.
- Implement SSL/TLS certificates.
- Set up monitoring and logging.
- Configure backups and scaling.

For more detailed deployment guides, see the [GitHub Pages Deployment Example](../examples/github-pages-deployment/README.md) and the [CLI Guide](../docs/CLI_GUIDE.md).