# Bundle Size Optimization Implementation

## Summary

Implemented comprehensive bundle size optimization for the vizualni-admin
project to reduce the total bundle from 1.39GB to under 10MB with individual
chunks under 250KB.

## Changes Made

### 1. Optimized Next.js Configuration (`next.config.optimized.js`)

- **Vendor Chunk Splitting**: Implemented aggressive code splitting with
  specialized cache groups:
  - Framework chunks (React, Next.js)
  - Material-UI chunks (@mui, @emotion)
  - Chart/D3 chunks (d3-\*, @deck.gl)
  - Utility chunks (lodash, date-fns)
  - Animation chunks (framer-motion)
  - Map chunks (mapbox, maplibre)

- **Tree-shaking Optimizations**:
  - Added `optimizePackageImports` for major libraries
  - Configured `modularizeImports` for selective imports
  - Enabled sideEffects optimization

- **Performance Improvements**:
  - Disabled source maps in production
  - Removed console logs (except errors/warns)
  - Enabled React property removal
  - Module concatenation enabled
  - Parallel compilation using available CPUs

### 2. Build Scripts

Created new npm scripts:

- `build:optimized` - Runs optimized build with performance checks
- `build:analyze` - Builds and analyzes bundle sizes
- `build:gh-pages:optimized` - Optimized build for GitHub Pages

### 3. Bundle Analysis Tools

- **`scripts/analyze-bundle.js`**: Analyzes bundle sizes and checks against
  performance budgets
- **`scripts/build-optimized.js`**: Runs optimized build with cleanup and
  analysis
- **`scripts/remove-dev-artifacts.js`**: Webpack plugin to remove development
  artifacts

### 4. Performance Budgets

Set strict limits:

- Total bundle: <10MB
- Individual chunks: <250KB
- Maximum async requests: 25

## Usage

### Build and Analyze

```bash
# Run optimized build
yarn build:optimized

# Build with analysis
yarn build:analyze

# Build for GitHub Pages
yarn build:gh-pages:optimized
```

### Bundle Analysis

```bash
# Analyze existing build
node scripts/analyze-bundle.js
```

## Expected Results

- **Total Bundle Size**: Reduced from 1.39GB to <10MB
- **Largest Chunk**: Reduced from 1.51MB to <250KB
- **Load Performance**: Significantly improved initial load times
- **Cache Efficiency**: Better chunking enables more efficient browser caching

## Additional Recommendations

1. **Dynamic Imports**: Consider dynamic imports for rarely used components
2. **Service Worker**: Implement service worker for offline caching
3. **Image Optimization**: Ensure all images use WebP/AVIF formats
4. **CDN**: Use CDN for static assets in production

## Troubleshooting

### MDX Loader Issues

The project uses an older version of @mdx-js/loader. If build errors occur:

1. Update to latest @mdx-js/loader
2. Or use Next.js built-in MDX support with @next/mdx

### Memory Issues

If build fails due to memory:

```bash
export NODE_OPTIONS="--max-old-space-size=4096"
yarn build:optimized
```

## Next Steps

1. Run `yarn build:analyze` to verify bundle sizes
2. Monitor performance in production
3. Consider implementing progressive loading for heavy features
4. Set up bundle size alerts in CI/CD pipeline
