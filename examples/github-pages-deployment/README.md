   cp -r examples/github-pages-deployment/* .
   ```

2. **Install dependencies:**

   ```bash
   yarn install
   ```

3. **Configure your repository:**

   - Replace `your-username` and `your-repo-name` in the workflow file
   - Update `package.json` with your project details

4. **Enable GitHub Pages:**

   - Go to your repository Settings → Pages
   - Select "GitHub Actions" as the source
   - Save the configuration

5. **Deploy:**

   Push to the `main` branch to trigger automatic deployment.

## Repository Setup

### 1. Create a New Repository

Create a new GitHub repository or use an existing one. Ensure it's public for GitHub Pages hosting.

### 2. Clone and Setup

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
cp -r path/to/vizualni-admin/examples/github-pages-deployment/* .
```

### 3. Configure Package.json

Update the following fields in `package.json`:

```json
{
  "name": "your-project-name",
  "version": "1.0.0",
  "repository": {
    "type": "git",
    "url": "https://github.com/your-username/your-repo-name"
  }
}
```

### 4. Environment Variables

Create a `.env.local` file for local development:

```bash
NEXT_PUBLIC_BASE_PATH=/your-repo-name
NEXT_PUBLIC_VERSION=1.0.0
NEXT_PUBLIC_GITHUB_REPO=your-username/your-repo-name
```

## Workflow Configuration

The deployment uses GitHub Actions. Copy the workflow from the main repository:

```yaml
# .github/workflows/deploy-github-pages.yml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: "yarn"

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Build static export
        run: |
          yarn exec next build --turbo
        env:
          NEXT_PUBLIC_BASE_PATH: /your-repo-name
          NODE_ENV: production

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v4
        with:
          path: ./out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build

    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Customizing the Workflow

- **Branch:** Change `main` to your default branch name
- **Node version:** Update to match your project's requirements
- **Base path:** Set `NEXT_PUBLIC_BASE_PATH` to `/your-repo-name`
- **Build command:** Modify if you have custom build steps

## Base Path Configuration

GitHub Pages serves sites from subdirectories. Configure the base path in `next.config.js`:

```javascript
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

module.exports = {
  output: "export",
  basePath: basePath,
  assetPrefix: basePath,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};
```

### Environment Variables

Set these in your GitHub repository secrets or workflow:

- `NEXT_PUBLIC_BASE_PATH`: The subdirectory path (e.g., `/your-repo-name`)
- `NEXT_PUBLIC_VERSION`: Your app version
- `NEXT_PUBLIC_GITHUB_REPO`: Your GitHub repository (for links)

## Custom Domain Setup

### 1. Add CNAME File

Create `public/CNAME` with your domain:

```
yourdomain.com
```

### 2. Configure DNS

Add these records to your DNS provider:

- **A Records:**
  - 185.199.108.153
  - 185.199.109.153
  - 185.199.110.153
  - 185.199.111.153

- **AAAA Records (IPv6):**
  - 2606:50c0:8000::153
  - 2606:50c0:8001::153
  - 2606:50c0:8002::153
  - 2606:50c0:8003::153

### 3. Enable HTTPS

In your repository Settings → Pages, enable "Enforce HTTPS".

### 4. Update Base Path

For custom domains, set `NEXT_PUBLIC_BASE_PATH` to an empty string or remove it entirely.

## Local Development

### Testing Static Export

```bash
# Build for production
NEXT_PUBLIC_BASE_PATH=/your-repo-name yarn build

# Serve locally
npx serve out
```

Open `http://localhost:3000/your-repo-name` to test.

### Development Server

```bash
# Start development server
yarn dev
```

## Troubleshooting

### Site Not Updating

1. Check Actions tab for workflow status
2. Verify the correct branch is being deployed
3. Ensure GitHub Pages is enabled in repository settings

### 404 Errors

- Check that `NEXT_PUBLIC_BASE_PATH` matches your repository name
- Verify the workflow completed successfully
- Ensure all assets are in the correct paths

### Build Failures

Common issues:

1. **Missing dependencies:** Run `yarn install` locally
2. **TypeScript errors:** Run `yarn typecheck`
3. **Build errors:** Test with `yarn build`

### Custom Domain Issues

- Wait up to 24 hours for DNS propagation
- Check DNS records are correct
- Ensure CNAME file is in the `public` directory

### Performance Issues

- Enable gzip compression in your web server
- Optimize images and assets
- Use CDN for static assets if needed

## Advanced Configuration

### Multiple Environments

Create separate workflows for staging and production:

```yaml
# .github/workflows/deploy-staging.yml
name: Deploy to Staging
on:
  push:
    branches:
      - develop
env:
  NEXT_PUBLIC_BASE_PATH: /staging
```

### Custom Build Steps

Add preprocessing steps to your workflow:

```yaml
- name: Pre-build setup
  run: |
    yarn run generate-data
    yarn run optimize-assets
```

### Analytics Integration

Add Google Analytics or other tracking:

```javascript
// pages/_app.js
import { Analytics } from '@vercel/analytics/react';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}