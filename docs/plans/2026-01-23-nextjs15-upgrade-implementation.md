# Next.js 15 Upgrade Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to
> implement this plan task-by-task.

**Goal:** Upgrade Vizualni Admin from Next.js 14.2.26 to Next.js 15.0.0 with
React 19

**Architecture:**

1. Upgrade core dependencies (next, react, react-dom)
2. Consolidate dual Next.js config into single file
3. Remove fix scripts (replace with proper transpilePackages)
4. Test build and dev server

**Tech Stack:** Next.js 15, React 19, MUI 6, TypeScript

---

## Task 1: Update package.json dependencies

**Files:**

- Modify: `package.json`

**Step 1: Update core dependencies**

Edit `package.json` and change the following versions:

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@next/mdx": "^15.0.0",
    "@next/bundle-analyzer": "^15.0.0",
    "eslint-config-next": "^15.0.0"
  }
}
```

**Step 2: Update resolutions**

Edit the `resolutions` section in `package.json`:

```json
{
  "resolutions": {
    "@babel/core": "^7.14.6",
    "@babel/parser": "^7.14.6",
    "ansi-regex": "^5.0.1",
    "cross-spawn": "^7.0.6",
    "esbuild": "^0.25.0",
    "js-yaml": "^4.1.0",
    "json5": "^2.2.3",
    "semver": "^7.6.3",
    "glob": "^10.5.0",
    "minimist": "^1.2.8",
    "loader-utils": "^3.2.1",
    "debug": "^4.3.4",
    "postcss": "^8.4.49",
    "browserslist": "^4.24.4",
    "node-forge": "^1.3.1",
    "strip-ansi": "^6.0.1",
    "follow-redirects": "^1.15.9",
    "@mui/styled-engine": "npm:@mui/styled-engine@^6.4.8",
    "@mui/system": "^6.4.8",
    "@mui/private-theming": "^6.4.8",
    "@mui/types": "^7.2.19",
    "@mui/utils": "^6.4.8",
    "@mui/lab": "6.0.0-beta.15",
    "@emotion/react": "^11.13.5",
    "@emotion/styled": "^11.13.5"
  }
}
```

Remove the old React 18 resolutions - no longer needed.

**Step 3: Commit dependency updates**

```bash
git add package.json
git commit -m "chore: upgrade to Next.js 15 and React 19

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 2: Clean install dependencies

**Files:**

- None (operation)

**Step 1: Remove old node_modules and lock file**

```bash
rm -rf node_modules app/.next yarn.lock
```

Expected: Directory removed without errors

**Step 2: Install updated dependencies**

```bash
yarn install
```

Expected: Installation completes without errors. Look for any peer dependency
warnings - these may need attention.

**Step 3: Check for conflicts**

```bash
# Verify no resolution conflicts
yarn list --pattern "next" --pattern "react" --pattern "react-dom"
```

Expected: Shows Next.js 15.x and React 19.x installed

**Step 4: Commit if package.json was updated**

If yarn updated package.json with resolved versions:

```bash
git add package.json yarn.lock
git commit -m "chore: update lockfile for Next.js 15 and React 19

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 3: Delete app/next.config.js

**Files:**

- Delete: `app/next.config.js`

**Step 1: Remove the duplicate config**

```bash
rm app/next.config.js
```

Expected: File deleted

**Step 2: Delete fix-mui-imports.js**

```bash
rm fix-mui-imports.js
```

Expected: File deleted

**Step 3: Delete fix-isr.js**

```bash
rm fix-isr.js
```

Expected: File deleted

**Step 4: Commit file deletions**

```bash
git add -A
git commit -m "chore: remove duplicate config and fix scripts

- Remove app/next.config.js (consolidated into root)
- Remove fix-mui-imports.js (replaced by transpilePackages)
- Remove fix-isr.js (no longer needed with Next.js 15)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 4: Create consolidated Next.js config

**Files:**

- Modify: `next.config.js` (root)
- Replace entire file content

**Step 1: Replace next.config.js with consolidated version**

Replace the entire content of `next.config.js` with:

```javascript
/**
 * CONSOLIDATED Next.js Configuration for Next.js 15
 * Combines previous root and app/next.config.js into single config
 */

const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
  options: {
    providerImportSource: "@mdx-js/react",
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

const { defaultLocale, locales } = require("./app/locales/locales.json");
const pkg = require("./package.json");

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const isGitHubPages = Boolean(basePath);
const isProduction = process.env.NODE_ENV === "production";

// Populate build-time variables
process.env.NEXT_PUBLIC_VERSION = `v${pkg.version}`;
process.env.NEXT_PUBLIC_GITHUB_REPO = pkg.repository.url.replace(
  /(\/|\.git)$/,
  ""
);

module.exports = withMDX({
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  trailingSlash: isGitHubPages,

  // Static export for GitHub Pages
  output: isProduction && isGitHubPages ? "export" : undefined,

  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    unoptimized: true, // Required for static export
  },

  i18n: isGitHubPages ? undefined : { locales, defaultLocale },

  swcMinify: true,
  productionBrowserSourceMaps: false,
  pageExtensions: ["js", "ts", "tsx", "mdx"],

  // Transpile MUI packages instead of babel-loader hacks
  transpilePackages: [
    "@mui/material",
    "@mui/icons-material",
    "@mui/lab",
    "@mui/utils",
    "@mui/styles",
    "@emotion/react",
    "@emotion/styled",
  ],

  // Modular imports for tree-shaking
  modularizeImports: {
    "@mui/icons-material": {
      transform: "@mui/icons-material/{{member}}",
      skipDefaultConversion: true,
    },
    lodash: {
      transform: "lodash/{{member}}",
    },
    "date-fns": {
      transform: "date-fns/{{member}}",
    },
  },

  webpack(config, { dev, isServer }) {
    // Add conditional resolution for .dev.ts and .prod.ts files
    config.resolve.extensions = Array.from(
      new Set([
        dev ? ".dev.ts" : ".prod.ts",
        ".ts",
        ".tsx",
        ".js",
        ".jsx",
        ".mjs",
        ".cjs",
        ".json",
        ".wasm",
        ...(config.resolve.extensions || []),
      ])
    );

    config.resolve.alias = {
      ...config.resolve.alias,
      "mapbox-gl": "maplibre-gl",
      // Fix for @mdx-js/loader compatibility
      "@mdx-js/loader": require.resolve("@mdx-js/loader"),
    };

    // GraphQL files
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: "graphql-tag/loader",
    });

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        buffer: false,
      };
    }

    if (!dev) {
      config.devtool = false;
    }

    return config;
  },

  eslint: {
    ignoreDuringBuilds: true,
    dirs: ["app"],
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  logging: {
    level: "error",
    fetches: {
      fullUrl: true,
    },
  },
});
```

**Step 2: Test the config syntax**

```bash
node -e "require('./next.config.js')"
```

Expected: No syntax errors

**Step 3: Commit new config**

```bash
git add next.config.js
git commit -m "chore: consolidate Next.js configuration

- Merge root and app/next.config.js
- Remove aggressive webpack optimization (let Next.js 15 handle it)
- Use transpilePackages instead of babel-loader for MUI
- Keep MDX support and static export configuration

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 5: Build the application

**Files:**

- None (operation)

**Step 1: Run static build**

```bash
yarn build:static
```

Expected: Build completes successfully. Watch for:

- MUI import errors (if transpilePackages missing something)
- TypeScript errors (should be ignored)
- ESLint errors (should be ignored)

**Step 2: Check for build output**

```bash
ls -la app/out/
```

Expected: Directory exists with static files

**Step 3: If build fails, investigate**

If build fails with MUI errors, check which package is missing and add to
`transpilePackages` in `next.config.js`.

**Step 4: Commit any fixes if needed**

If config adjustments were needed:

```bash
git add next.config.js
git commit -m "fix: adjust transpilePackages for build

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 6: Start dev server

**Files:**

- None (operation)

**Step 1: Start development server**

```bash
yarn dev
```

Expected: Server starts on http://localhost:3000

**Step 2: Verify no startup errors**

Check console for:

- MUI import warnings
- Module resolution errors
- React version conflicts

**Step 3: Test key pages manually**

Visit in browser:

- http://localhost:3000 - Home page loads
- http://localhost:3000/create - Create page loads
- http://localhost:3000/tutorials - Tutorials page loads

**Step 4: Kill dev server**

```bash
# Press Ctrl+C in terminal
```

---

## Task 7: Create migration documentation

**Files:**

- Create: `docs/nextjs-15-migration.md`

**Step 1: Create migration documentation**

```bash
cat > docs/nextjs-15-migration.md << 'EOF'
# Next.js 15 Migration

**Date:** 2026-01-23
**Status:** Complete

## Changes Made

### Dependency Upgrades

- Next.js: 14.2.26 → 15.0.0
- React: 18.2.0 → 19.0.0
- React DOM: 18.2.0 → 19.0.0
- @types/react: 18.2.79 → 19.0.0
- @types/react-dom: 18.2.25 → 19.0.0

### Configuration Changes

**Consolidated Next.js Config:**
- Merged `app/next.config.js` into root `next.config.js`
- Removed manual webpack babel-loader rules for MUI
- Added `transpilePackages` for all MUI packages
- Kept MDX support via `@next/mdx` wrapper
- Maintained static export configuration for GitHub Pages

**Removed Files:**
- `app/next.config.js` - consolidated into root config
- `fix-mui-imports.js` - replaced by `transpilePackages`
- `fix-isr.js` - no longer needed

### Package Resolutions

Removed obsolete React 18 resolutions. Kept MUI and emotion resolutions for consistency.

## Testing

- [x] `yarn build:static` completes successfully
- [x] `yarn dev` starts without errors
- [x] Static export produces files in `app/out/`
- [x] Key pages load in browser

## Known Issues

None at this time.

## Next Steps

- Consider enabling Turbopack for faster builds (`next dev --turbo`)
- Monitor for React 19 compatibility issues in third-party packages
- Review components for Server Component optimization opportunities

## References

- [Next.js 15 Upgrade Guide](https://nextjs.org/docs/app/building-your-application/upgrading)
- [React 19 Release Notes](https://react.dev/blog/2024/12/05/react-19)
EOF
```

**Step 2: Commit documentation**

```bash
git add docs/nextjs-15-migration.md
git commit -m "docs: add Next.js 15 migration notes

Document changes made during upgrade from Next.js 14 to 15.

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 8: Final verification

**Files:**

- None (operation)

**Step 1: Run git log to verify all changes**

```bash
git log --oneline -10
```

Expected: See commits for:

- Dependency upgrades
- Lockfile update
- Removed files
- Consolidated config
- Migration documentation

**Step 2: Verify build one more time**

```bash
yarn build:static
```

Expected: Build completes successfully

**Step 3: Quick smoke test of dev server**

```bash
yarn dev &
sleep 10
curl -I http://localhost:3000
pkill -f "next dev"
```

Expected: Server responds with HTTP 200

---

## Summary

This plan upgrades Vizualni Admin to Next.js 15 and React 19 by:

1. Upgrading core dependencies in package.json
2. Removing duplicate config and fix scripts
3. Consolidating into a single next.config.js with transpilePackages
4. Building and testing the application

**Estimated time:** 15-20 minutes

**Risk level:** Medium (major version upgrade, but MUI already supports
React 19)
