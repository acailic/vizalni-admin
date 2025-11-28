# Troubleshooting Guide

This guide helps you resolve common issues when using or developing with Vizualni Admin. If you encounter an issue not covered here, please check the [GitHub Issues](https://github.com/acailic/vizualni-admin/issues) or create a new one.

## Table of Contents

- [Installation Problems](#installation-problems)
- [Build Errors](#build-errors)
- [Runtime Errors](#runtime-errors)
- [Performance Issues](#performance-issues)
- [Deployment Problems](#deployment-problems)

## Installation Problems

### Issue: Node.js Version Not Supported

**Symptoms:** Installation fails with errors like "Node version X is not supported" or dependency installation errors.

**Causes:** Vizualni Admin requires Node.js 18 or higher.

**Solutions:**
1. Update Node.js to version 18 or later.
2. Use a version manager like nvm: `nvm install 18 && nvm use 18`.
3. Check your Node version: `node --version`.

**Diagnostic Steps:**
- Run `node --version` and `npm --version`.
- Ensure your package.json specifies `"engines": {"node": ">=18"}`.

### Issue: Dependencies Not Installing

**Symptoms:** `npm install` or `yarn install` fails with network or permission errors.

**Causes:** Network issues, proxy settings, or insufficient permissions.

**Solutions:**
1. Clear npm cache: `npm cache clean --force`.
2. Use a different registry if behind a proxy: `npm config set registry https://registry.npmjs.org/`.
3. Install with verbose logging: `npm install --verbose`.
4. If permission errors, use `sudo` (not recommended) or fix npm permissions.

**Diagnostic Steps:**
- Check internet connection.
- Verify proxy settings: `npm config get proxy`.
- Try installing a single package: `npm install react`.

### Issue: Module Not Found Errors After Installation

**Symptoms:** Import errors like "Cannot find module 'vizualni-admin'".

**Causes:** Incorrect installation or missing peer dependencies.

**Solutions:**
1. Reinstall the package: `npm uninstall vizualni-admin && npm install vizualni-admin`.
2. Ensure peer dependencies are installed: React, Next.js, etc.
3. Check package.json for correct version.

**Diagnostic Steps:**
- Verify installation: `npm list vizualni-admin`.
- Check node_modules: `ls node_modules/vizualni-admin`.

## Build Errors

### Issue: TypeScript Compilation Errors

**Symptoms:** Build fails with TypeScript errors like "Property 'X' does not exist".

**Causes:** Type mismatches, missing type definitions, or outdated types.

**Solutions:**
1. Update TypeScript: `npm update typescript`.
2. Check for type definition updates: `npm update @types/*`.
3. Fix type issues in your code or report to Vizualni Admin if it's a library issue.

**Diagnostic Steps:**
- Run `npx tsc --noEmit` to check types without building.
- Check tsconfig.json for correct settings.

### Issue: Module Resolution Errors

**Symptoms:** "Cannot resolve module" or "Module not found" during build.

**Causes:** Incorrect import paths or missing dependencies.

**Solutions:**
1. Verify import paths match file structure.
2. Ensure all dependencies are listed in package.json.
3. Use absolute imports if relative paths are problematic.

**Diagnostic Steps:**
- Check webpack or bundler logs for detailed errors.
- Verify file existence: `ls src/path/to/module`.

### Issue: Static Export Build Failures

**Symptoms:** Build fails during static export with errors related to dynamic routes or API calls.

**Causes:** Incompatible code for static generation.

**Solutions:**
- Refer to [Static Export Troubleshooting](./STATIC_EXPORT_TROUBLESHOOTING.md) for detailed steps.
- Change `fallback: "blocking"` to `fallback: false` in `getStaticPaths`.
- Pre-generate all paths in `getStaticPaths`.

**Diagnostic Steps:**
- Run `next build --debug` for more details.
- Check `.next/prerender-manifest.json` for prerendered routes.
- Inspect `out/` directory for generated files.

**Related Issues:** [GitHub Issue #45](https://github.com/acailic/vizualni-admin/issues/45)

## Runtime Errors

### Issue: Hydration Mismatches

**Symptoms:** Console errors like "Text content does not match server-rendered HTML".

**Causes:** Differences between server and client rendering, often due to browser-specific code.

**Solutions:**
1. Avoid using `window` or `document` without checks.
2. Use `useEffect` for client-side only code.
3. Ensure consistent data between server and client.

**Diagnostic Steps:**
- Check browser console for hydration warnings.
- Use React DevTools to inspect component state.

### Issue: Chart Rendering Failures

**Symptoms:** Charts don't render or show errors like "Invalid data format".

**Causes:** Incorrect data structure or missing dependencies.

**Solutions:**
1. Validate data against expected schema.
2. Ensure D3.js or charting library is properly imported.
3. Check for data loading errors.

**Diagnostic Steps:**
- Log data before passing to chart components.
- Test with sample data from examples.

**Related Issues:** [GitHub Issue #78](https://github.com/acailic/vizualni-admin/issues/78)

### Issue: API Calls Failing

**Symptoms:** Data not loading, network errors in console.

**Causes:** CORS issues, incorrect URLs, or API downtime.

**Solutions:**
1. Verify API endpoints are accessible.
2. Add CORS headers if needed.
3. Implement error handling and retries.

**Diagnostic Steps:**
- Use browser dev tools network tab to inspect requests.
- Test API endpoints directly with curl or Postman.

## Performance Issues

### Issue: Large Bundle Size

**Symptoms:** Slow loading times, large JS bundles.

**Causes:** Unused imports, missing tree-shaking, or large dependencies.

**Solutions:**
1. Use dynamic imports: `import('module')`.
2. Enable code splitting in webpack/tsup config.
3. Analyze bundle: `npm run analyze` (if available).

**Diagnostic Steps:**
- Run bundle analyzer: `npx webpack-bundle-analyzer`.
- Check for duplicate dependencies: `npm ls --depth=0`.

### Issue: Slow Chart Rendering

**Symptoms:** Charts take long to render with large datasets.

**Causes:** Inefficient rendering or data processing.

**Solutions:**
1. Implement virtualization for large datasets.
2. Use memoization: `React.memo`, `useMemo`.
3. Optimize data transformations.

**Diagnostic Steps:**
- Profile with React DevTools Profiler.
- Measure render times with `performance.mark`.

**Related Issues:** [GitHub Issue #92](https://github.com/acailic/vizualni-admin/issues/92)

### Issue: Memory Leaks

**Symptoms:** Increasing memory usage over time.

**Causes:** Uncleaned event listeners or retained references.

**Solutions:**
1. Clean up event listeners in `useEffect` return function.
2. Avoid storing large objects in state unnecessarily.
3. Use weak references where possible.

**Diagnostic Steps:**
- Use Chrome DevTools Memory tab to take heap snapshots.
- Monitor memory usage over time.

## Deployment Problems

### Issue: GitHub Pages Deployment Fails

**Symptoms:** Deployment workflow fails or site doesn't load correctly.

**Causes:** Incorrect base path, missing assets, or build configuration.

**Solutions:**
1. Set `NEXT_PUBLIC_BASE_PATH` to your repository name.
2. Ensure all assets are in the correct path.
3. Check deployment logs for errors.

**Diagnostic Steps:**
- Test locally with base path: `NEXT_PUBLIC_BASE_PATH=/repo-name npm run build`.
- Verify `out/` directory structure.

**Related Issues:** [GitHub Issue #23](https://github.com/acailic/vizualni-admin/issues/23)

### Issue: Static Export Issues

**Symptoms:** Pages not generating or 404 errors on static export.

**Causes:** Dynamic routes not handled properly.

**Solutions:**
- Refer to [Static Export Troubleshooting](./STATIC_EXPORT_TROUBLESHOOTING.md).
- Pre-generate all paths.
- Use client-side routing for dynamic routes.

**Diagnostic Steps:**
- Check build output for missing HTML files.
- Test with `npx serve out/` locally.

### Issue: Environment Variables Not Working

**Symptoms:** Config values undefined in production.

**Causes:** Variables not prefixed with `NEXT_PUBLIC_` or not set in deployment.

**Solutions:**
1. Prefix client-side vars with `NEXT_PUBLIC_`.
2. Set variables in deployment platform settings.
3. Use `.env.local` for local development.

**Diagnostic Steps:**
- Log environment variables in code.
- Check deployment platform documentation.

If these steps don't resolve your issue, please provide:
- Your environment (OS, Node version, package version)
- Full error messages and stack traces
- Steps to reproduce
- Relevant code snippets

This will help us assist you better!