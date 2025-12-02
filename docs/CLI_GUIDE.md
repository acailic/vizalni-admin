npm install -g vizualni-admin
```

Or install it locally in your project:

```bash
npm install vizualni-admin --save-dev
```

After installation, verify the CLI is working:

```bash
vizualni-admin --version
# Output: 0.1.0-beta.1
```

## Configuration

The CLI uses configuration files to customize behavior. By default, it looks for `vizualni-admin.config.json` or `vizualni-admin.config.ts` in the project root.

### Configuration File Structure

```json
{
  "name": "My Vizualni Admin Project",
  "version": "1.0.0",
  "datasets": [
    {
      "id": "population-data",
      "url": "https://data.gov.rs/api/datasets/population",
      "format": "json"
    }
  ],
  "theme": {
    "primaryColor": "#007bff",
    "secondaryColor": "#6c757d"
  },
  "deployment": {
    "platform": "github-pages",
    "basePath": "/my-project"
  }
}
```

### Environment Variables

- `VIZUALNI_ADMIN_CONFIG`: Path to custom config file
- `DATA_GOV_RS_API_KEY`: API key for data.gov.rs (if required)
- `NODE_ENV`: Set to 'production' for production builds

## Commands

### init

Scaffold a new Vizualni Admin project with interactive prompts.

```bash
vizualni-admin init
```

**Options:**
- None (interactive mode)

**Example:**
```bash
vizualni-admin init
# Follow the prompts to set up your project
```

This command will:
- Ask for project name, language, and categories
- Generate project structure
- Create configuration files
- Initialize git repository
- Install dependencies

### discover

Search and discover datasets from data.gov.rs.

```bash
vizualni-admin discover [options]
```

**Options:**
- `-c, --category <category>`: Filter by category (e.g., "health", "education")
- `-k, --keyword <keyword>`: Search keyword
- `-q, --quality <threshold>`: Minimum quality threshold (0-1)
- `-s, --save`: Save results to configuration file

**Examples:**
```bash
# Discover all health-related datasets
vizualni-admin discover --category health

# Search for datasets containing "covid"
vizualni-admin discover --keyword covid --quality 0.8

# Save high-quality education datasets to config
vizualni-admin discover --category education --quality 0.9 --save
```

**Sample Output:**
```
Discovering datasets from data.gov.rs...

Found 15 datasets matching criteria:

┌─────────────────────────────────┬─────────────────┬─────────┬─────────┐
│ Dataset Name                    │ Organization    │ Format  │ Quality │
├─────────────────────────────────┼─────────────────┼─────────┼─────────┤
│ COVID-19 Daily Cases            │ Ministry of Health │ JSON    │ 0.95    │
│ Vaccination Statistics          │ Institute of Public Health │ CSV     │ 0.92    │
│ Hospital Capacity               │ Serbian Government │ XML     │ 0.88    │
└─────────────────────────────────┴─────────────────┴─────────┴─────────┘

Use --save flag to add these to your configuration.
```

### validate

Validate configuration files against the JSON schema.

```bash
vizualni-admin validate <file>
```

**Arguments:**
- `file`: Path to configuration file (JSON or TypeScript)

**Examples:**
```bash
# Validate JSON config
vizualni-admin validate vizualni-admin.config.json

# Validate TypeScript config
vizualni-admin validate vizualni-admin.config.ts
```

**Sample Output (Valid):**
```
✓ Configuration is valid
- Found 3 datasets
- All required fields present
- No validation errors
```

**Sample Output (Invalid):**
```
✗ Configuration validation failed:

1. datasets[0].url: Invalid URL format
   Suggestion: Ensure URL starts with http:// or https://

2. theme.colors.primary: Invalid color format
   Suggestion: Use hex colors like #ff0000 or named colors

3. Missing required field: deployment.platform
   Suggestion: Add "platform" field to deployment section
```

### build

Build the project for production deployment.

```bash
vizualni-admin build [options]
```

**Options:**
- `-t, --target <target>`: Build target (static|server|docker) [default: static]
- `-o, --output <dir>`: Output directory [default: dist]

**Examples:**
```bash
# Build for static hosting (GitHub Pages, Netlify)
vizualni-admin build

# Build for server deployment
vizualni-admin build --target server

# Build with custom output directory
vizualni-admin build --output ./build
```

**Sample Output:**
```
Building Vizualni Admin project...

✓ TypeScript compilation completed
✓ Assets optimized
✓ Pages generated (12 pages)
✓ Static files copied

Build completed successfully!

Bundle Statistics:
- Main bundle: 245 KB (gzipped: 78 KB)
- Vendor bundle: 180 KB (gzipped: 62 KB)
- Total size: 425 KB (gzipped: 140 KB)

Build time: 45.2 seconds
Output directory: ./dist
```

### dev

Start the development server with hot reloading.

```bash
vizualni-admin dev [options]
```

**Options:**
- `-p, --port <port>`: Port to run on [default: 3000]
- `-h, --host <host>`: Host to bind to [default: localhost]

**Examples:**
```bash
# Start dev server on default port
vizualni-admin dev

# Start on custom port and host
vizualni-admin dev --port 8080 --host 0.0.0.0
```

**Sample Output:**
```
Starting development server...

✓ Next.js compiled successfully
✓ Server listening on http://localhost:3000

Ready in 8.5 seconds
```

### deploy

Deploy the project to various platforms.

```bash
vizualni-admin deploy [options]
```

**Options:**
- `-p, --platform <platform>`: Deployment platform (github-pages|vercel|netlify|custom)
- `-d, --dry-run`: Show deployment steps without executing

**Examples:**
```bash
# Deploy to GitHub Pages
vizualni-admin deploy --platform github-pages

# Dry run deployment to Vercel
vizualni-admin deploy --platform vercel --dry-run

# Deploy to custom platform
vizualni-admin deploy --platform custom
```

**Sample Output:**
```
Deploying to GitHub Pages...

✓ Build completed
✓ GitHub Pages configured
✓ Files uploaded to gh-pages branch
✓ Deployment triggered

Deployment URL: https://username.github.io/my-project/
Status: https://github.com/username/my-project/actions
```

## Common Workflows

### Quick Start Project

```bash
# 1. Initialize new project
vizualni-admin init

# 2. Discover and add datasets
vizualni-admin discover --category health --save

# 3. Validate configuration
vizualni-admin validate vizualni-admin.config.json

# 4. Start development
vizualni-admin dev

# 5. Build for production
vizualni-admin build

# 6. Deploy
vizualni-admin deploy --platform github-pages
```

### Dataset Integration

```bash
# Find relevant datasets
vizualni-admin discover --keyword "education statistics"

# Validate and fix config
vizualni-admin validate config.json

# Test in development
vizualni-admin dev

# Deploy updates
vizualni-admin deploy
```

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy
on: [push]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: vizualni-admin validate config.json
      - run: vizualni-admin build
      - run: vizualni-admin deploy --platform github-pages
```

## Troubleshooting

### Common Issues

**Command not found**
```
Error: vizualni-admin: command not found
```
**Solution:** Install globally with `npm install -g vizualni-admin` or use `npx vizualni-admin`

**Build failures**
```
Error: TypeScript compilation failed
```
**Solution:** Check for type errors with `npm run typecheck` and fix them

**Validation errors**
```
Error: Configuration validation failed
```
**Solution:** Review error messages and fix configuration file according to suggestions

**Deployment issues**
```
Error: Deployment to GitHub Pages failed
```
**Solution:** Ensure GitHub Pages is enabled in repository settings and gh-pages branch exists

### Debug Mode

Enable verbose logging with the `DEBUG` environment variable:

```bash
DEBUG=vizualni-admin:* vizualni-admin build
```

### Getting Help

- Check the version: `vizualni-admin --version`
- View help: `vizualni-admin --help`
- Command-specific help: `vizualni-admin <command> --help`

## Automation and CI/CD Integration

### GitHub Actions

Use the CLI in your GitHub Actions workflows for automated testing and deployment:

```yaml
name: CI/CD
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: vizualni-admin validate config.json
      - run: npm test
      - run: vizualni-admin build --target static

  deploy:
    if: github.ref == 'refs/heads/main'
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: vizualni-admin deploy --platform github-pages
```

### Pre-commit Hooks

Use Husky to run validation before commits:

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "vizualni-admin validate config.json && npm run lint"
    }
  }
}
```

### Docker Integration

Build Docker images with the CLI:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx vizualni-admin build --target server
EXPOSE 3000
CMD ["npm", "start"]
```

### NPM Scripts

Add CLI commands to your package.json scripts:

```json
{
  "scripts": {
    "dev": "vizualni-admin dev",
    "build": "vizualni-admin build",
    "validate": "vizualni-admin validate config.json",
    "deploy": "vizualni-admin deploy --platform github-pages"
  }
}