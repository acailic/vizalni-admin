# Next.js 15 Upgrade Design

**Date:** 2026-01-23 **Status:** Draft **Priority:** High

## Overview

This design documents the upgrade of Vizualni Admin from Next.js 14.2.26 to
Next.js 15.0.0, including the migration to React 19. The upgrade consolidates
fragmented build configuration, eliminates brittle fix scripts, and modernizes
the codebase for upcoming ecosystem changes.

## Current State

- **Next.js 14.2.26** with React 18.2.0
- **Dual configuration setup:** Root `next.config.js` + `app/next.config.js`
- **Fix scripts:** `fix-mui-imports.js` (patches node_modules), `fix-isr.js`
  (modifies source files)
- **MUI 6.4.8** (already React 19 compatible)
- **Extensive manual webpack optimization** for bundle splitting

## Architecture Changes

### React 19 Migration

Next.js 15 requires React 19 as a peer dependency. This brings:

- New async transition APIs
- Changes to Server Component behavior
- Improved form handling with `useActionState`
- Better support for concurrent rendering

**Impact:** MUI v6 fully supports React 19, so the Material-UI stack remains
compatible.

### Async Request APIs

In Next.js 15, `cookies()`, `headers()`, and `params` return promises that must
be awaited.

**Before (Next.js 14):**

```typescript
export default function Page({ params }) {
  const id = params.id; // Synchronous
  const cookieStore = cookies();
  const token = cookieStore.get("token");
}
```

**After (Next.js 15):**

```typescript
export default async function Page({ params }) {
  const id = (await params).id; // Await params
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
}
```

### Caching Behavior Changes

Next.js 15 changes `fetch` caching from opt-in to opt-out. Code relying on
default caching must explicitly add `next: { revalidate: ... }` options.

## Configuration Consolidation

### Single Config File

Merge root and `app/next.config.js` into a single `next.config.js`:

1. **Keep MDX handling:** Use `@next/mdx` wrapper
2. **Preserve vendor chunk splitting:** Framework, MUI, charts, utils,
   animation, maps
3. **Remove redundant aliases:** Keep only mapbox → maplibre
4. **Use `transpilePackages` over babel-loader:** Replace manual MUI babel rules

### Eliminated Fix Scripts

| Script               | Purpose                                | Replacement                                 |
| -------------------- | -------------------------------------- | ------------------------------------------- |
| `fix-mui-imports.js` | Creates package.json in node_modules   | `transpilePackages` + `modularizeImports`   |
| `fix-isr.js`         | Removes `revalidate` from page exports | Use `export const dynamic = 'force-static'` |

### Consolidated Configuration

```javascript
const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
  options: {
    providerImportSource: "@mdx-js/react",
  },
});

const { defaultLocale, locales } = require("./app/locales/locales.json");
const pkg = require("./package.json");

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const isGitHubPages = Boolean(basePath);
const isProduction = process.env.NODE_ENV === "production";

process.env.NEXT_PUBLIC_VERSION = `v${pkg.version}`;

module.exports = withMDX({
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  trailingSlash: isGitHubPages,
  output: isProduction && isGitHubPages ? "export" : undefined,

  images: {
    formats: ["image/avif", "image/webp"],
    unoptimized: true,
  },

  i18n: isGitHubPages ? undefined : { locales, defaultLocale },
  pageExtensions: ["js", "ts", "tsx", "mdx"],
  swcMinify: true,

  transpilePackages: [
    "@mui/material",
    "@mui/icons-material",
    "@mui/lab",
    "@mui/utils",
    "@mui/styles",
  ],

  modularizeImports: {
    "@mui/icons-material": {
      transform: "@mui/icons-material/{{member}}",
      skipDefaultConversion: true,
    },
  },

  webpack(config, { dev, isServer }) {
    config.resolve.alias = {
      ...config.resolve.alias,
      "mapbox-gl": "maplibre-gl",
    };

    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
        crypto: false,
        stream: false,
      };
    }
    return config;
  },

  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
});
```

## Dependency Upgrades

### Core Packages

| Package                 | Current  | Target  |
| ----------------------- | -------- | ------- |
| `next`                  | ^14.2.26 | ^15.0.0 |
| `react`                 | ^18.2.0  | ^19.0.0 |
| `react-dom`             | ^18.2.0  | ^19.0.0 |
| `@types/react`          | ^18.2.79 | ^19.0.0 |
| `@types/react-dom`      | ^18.2.25 | ^19.0.0 |
| `@next/mdx`             | ^16.0.5  | ^15.0.0 |
| `@next/bundle-analyzer` | ^16.0.8  | ^15.0.0 |

### Resolutions Cleanup

Remove unnecessary resolutions from package.json:

- React 18 resolutions
- @next package resolutions that align with main dependencies
- Keep only truly necessary resolutions (esbuild consistency)

### Upgrade Order

1. Next.js 15 peer dependencies
2. React 19
3. @next packages
4. `yarn install` and check for conflicts
5. Address resolution conflicts

## Refactoring Checklist

### Async APIs

- [ ] Find all `cookies()` usages in `app/pages/`
- [ ] Find all `headers()` usages in `app/pages/`
- [ ] Find all `searchParams` usages in `app/pages/`
- [ ] Find route handlers in `app/pages/api/` using these APIs
- [ ] Add `async` to component/function declarations
- [ ] Add `await` before each API call
- [ ] Handle destructured params: `const { id } = await params`

### File Cleanup

- [ ] Delete `fix-mui-imports.js`
- [ ] Delete `fix-isr.js`
- [ ] Delete `app/next.config.js`
- [ ] Remove `fix-mui-imports.js` from any scripts
- [ ] Remove redundant resolutions from package.json

## Verification

### Build Process

```bash
# 1. Clean install
rm -rf node_modules app/.next yarn.lock
yarn install

# 2. Build
yarn build:static

# 3. Dev server smoke test
yarn dev
```

### Success Criteria

- [ ] Build passes without MUI import errors
- [ ] Build passes without ES module errors
- [ ] Dev server starts successfully on port 3000
- [ ] No runtime errors in browser console
- [ ] Static export produces files in `app/out/`
- [ ] All pages load correctly

### Common Issues

| Issue                                 | Cause                           | Fix                              |
| ------------------------------------- | ------------------------------- | -------------------------------- |
| "Module not found"                    | Missing transpilePackages entry | Add package to transpilePackages |
| "cannot read properties of undefined" | Missed await on params/cookies  | Add await                        |
| MUI styling broken                    | Emotion cache issue             | Clear `.next/cache`              |
| MDX files not rendering               | @next/mdx version mismatch      | Ensure matching Next.js version  |

## Post-Upgrade

### Documentation

Create `docs/nextjs-15-migration.md` with:

- What was changed
- Known caveats or workarounds
- How the async API refactor was handled
- Remaining technical debt

### Future Considerations

- **Turbopack:** Next.js 15 stabilizes Turbopack - consider enabling it for
  faster builds
- **App Router:** Migration from pages/ to app/ directory (future work)
- **Server Components:** Review components for Server Component optimization
  opportunities

## References

- [Next.js 15 Upgrade Guide](https://nextjs.org/docs/app/building-your-application/upgrading)
- [React 19 Release Notes](https://react.dev/blog/2024/12/05/react-19)
- [Next.js 15 Async Request APIs](https://nextjs.org/docs/app/api-reference/functions/cookies)
