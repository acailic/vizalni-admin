# Next.js 15 Migration

**Date:** 2026-01-23 **Status:** Complete

## Changes Made

### Dependency Upgrades

- Next.js: 14.2.26 → 15.5.9
- React: 18.2.0 → 19.0.0
- React DOM: 18.2.0 → 19.0.0
- @types/react: 18.2.79 → 19.0.0
- @types/react-dom: 18.2.25 → 19.0.0
- catalog: 3.6.2 → 4.0.1-canary.2 (for React 19 support)
- @next/mdx: 16.0.5 → 15.5.9
- eslint-config-next: 14.2.23 → 15.5.9

### Configuration Changes

**Consolidated Next.js Config:**

- Merged app/next.config.js into root next.config.js
- Removed manual webpack babel-loader rules for MUI
- Added transpilePackages for all MUI packages
- Removed swcMinify (deprecated in Next.js 15)
- Kept MDX support via @next/mdx wrapper
- Maintained static export configuration for GitHub Pages

**Removed Files:**

- app/next.config.js - consolidated into root config
- fix-mui-imports.js - replaced by transpilePackages
- fix-isr.js - no longer needed

**Added Files:**

- React version resolutions in package.json

### Package Resolutions

Added React version resolutions to enforce React 19 across all dependencies:

- react: ^19.0.0
- react-dom: ^19.0.0

Removed obsolete React 18 resolutions. Kept MUI and emotion resolutions for
consistency.

## Testing

- [x] yarn build compiles successfully (webpack build)
- [x] yarn dev starts without errors
- [x] Dev server responds with HTTP 200
- [x] MUI components render correctly
- [ ] yarn build:static has i18n issues (pre-existing, not caused by upgrade)

## Known Issues

### Static Export with i18n

The static export (yarn build:static) fails during the export phase with
i18n-related errors. This is a pre-existing issue related to conflicting
getStaticPaths and locale page generation, not caused by the Next.js 15 upgrade.

### Plugin System Exports

The plugin system has missing type exports that need to be addressed separately.

## Next Steps

- Consider enabling Turbopack for faster builds (next dev --turbo)
- Monitor for catalog v4 stable release (currently using canary)
- Review components for Server Component optimization opportunities
- Address static export i18n configuration issues

## References

- [Next.js 15 Upgrade Guide](https://nextjs.org/docs/app/building-your-application/upgrading)
- [React 19 Release Notes](https://react.dev/blog/2024/12/05/react-19)
