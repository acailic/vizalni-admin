# GitHub Pages Local Development Guide

This guide explains how to properly preview your GitHub Pages deployment locally before pushing to production.

## The Problem

When building for GitHub Pages, Next.js adds a base path (`/vizualni-admin/`) to all asset URLs. This works correctly on GitHub Pages because it serves your site from that subdirectory. However, when serving the static files locally, the base path doesn't resolve correctly, causing 404 errors for assets.

## The Solution

We've created two tools to solve this issue:

1. **Build Script** (`scripts/build-for-gh-pages.js`) - Prepares the build for local testing
2. **Local Server** (`scripts/serve-gh-pages.js`) - Serves files with proper base path routing

## Quick Start

### Method 1: Build and Serve (Recommended)

```bash
# Build for GitHub Pages (creates structure for local testing)
yarn build:gh-pages-local

# Start the local server
yarn serve:gh-pages
```

Then visit: http://localhost:3000/vizualni-admin/

### Method 2: Manual Build and Serve

```bash
# Build for GitHub Pages
NEXT_PUBLIC_BASE_PATH=/vizualni-admin yarn build:static

# Start the custom server
yarn serve:gh-pages
```

Then visit: http://localhost:3000/vizualni-admin/

## Available Scripts

| Script | Description |
|--------|-------------|
| `yarn build:gh-pages` | Builds static files with base path for GitHub Pages deployment |
| `yarn build:gh-pages-local` | Builds and creates temporary structure for local testing |
| `yarn serve:gh-pages` | Starts a local server that properly handles the base path |
| `yarn build:gh-pages:optimized` | Builds optimized version with base path |

## How It Works

### The Local Server

The custom server (`scripts/serve-gh-pages.js`) handles:

1. **Base Path Stripping** - Removes `/vizualni-admin/` from incoming requests
2. **Static Asset Serving** - Serves JS, CSS, images, and other static files with correct MIME types
3. **SPA Routing** - Serves `index.html` for client-side routes
4. **Security Headers** - Adds security headers for production-like behavior
5. **Caching** - Implements appropriate caching for static assets

### Directory Structure

After building, your files are located at:
- Production: `app/out/`
- Local Testing: `app/out/temp-for-local/` (created by `build:gh-pages-local`)

## Development Workflow

1. **Regular Development**:
   ```bash
   yarn dev
   ```

2. **Test GitHub Pages Build Locally**:
   ```bash
   yarn build:gh-pages-local
   yarn serve:gh-pages
   ```

3. **Deploy to GitHub Pages**:
   - Push to `main` branch (automatic deployment)
   - Or run `yarn deploy:gh-pages` locally

## Troubleshooting

### 404 Errors for Static Assets

If you see 404 errors for `_next/static/*` files:

1. Make sure you're using `yarn serve:gh-pages` (not a generic file server)
2. Ensure you built with the base path: `NEXT_PUBLIC_BASE_PATH=/vizualni-admin`
3. Check that you're visiting `http://localhost:3000/vizualni-admin/` (not `http://localhost:3000/`)

### Blank Page or JavaScript Errors

1. Check the browser console for errors
2. Ensure all assets are loading (check Network tab)
3. Make sure you're not opening the HTML file directly (file:// protocol)

### Port Already in Use

Change the port:
```bash
PORT=3001 yarn serve:gh-pages
```

## Production Deployment

The GitHub Actions workflow automatically:
1. Builds with the base path (`/vizualni-admin/`)
2. Deploys to GitHub Pages from the `app/out/` directory

No additional configuration is needed - just push to the `main` branch.

## Alternative Local Testing Methods

### Using Node's http-server

```bash
# Build
NEXT_PUBLIC_BASE_PATH=/vizualni-admin yarn build:static

# Move files to subdirectory
cd app/out
mkdir -p vizualni-admin
cp -r * vizualni-admin/ 2>/dev/null || true
cd ../..

# Serve
npx http-server app/out -p 3000
```

Then visit: http://localhost:3000/vizualni-admin/

### Using Python

```bash
# Build and move files (same as above)
NEXT_PUBLIC_BASE_PATH=/vizualni-admin yarn build:static
cd app/out
mkdir -p vizualni-admin
find . -maxdepth 1 -not -name "." -not -name "./vizualni-admin" -exec mv {} ./vizualni-admin/ \;
python3 -m http.server 3000
```

Then visit: http://localhost:3000/vizualni-admin/

## Tips and Best Practices

1. **Always test with the custom server** - Generic servers don't handle base paths correctly
2. **Use the build script** - `build:gh-pages-local` creates the proper structure
3. **Check the full URL** - Make sure to include the base path when visiting locally
4. **Clear cache** - Hard refresh (Ctrl+Shift+R) if assets seem outdated
5. **Test in different browsers** - Ensure compatibility across browsers

## Environment Variables

The build process uses these environment variables:
- `NEXT_PUBLIC_BASE_PATH` - Set to `/vizualni-admin` for GitHub Pages
- `NODE_ENV` - Set to `production` for optimized builds

## Related Files

- `scripts/serve-gh-pages.js` - Local server implementation
- `scripts/build-for-gh-pages.js` - Build helper for local testing
- `app/next.config.js` - Next.js configuration with base path settings
- `.github/workflows/deploy-github-pages.yml` - GitHub Actions deployment workflow