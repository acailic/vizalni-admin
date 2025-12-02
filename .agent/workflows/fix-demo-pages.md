---
description: Fix all demo pages for GitHub static pages deployment
---

# Fix Demo Pages for GitHub Pages Static Export

This workflow fixes all demo pages to ensure proper data visualization and no loading issues on GitHub Pages.

## Issues Identified

1. **Import order violations** in gallery.tsx and other files
2. **Data loading** - Some demos may have issues with static data
3. **GitHub Pages compatibility** - Ensure all pages work with static export
4. **Code organization** - Improve structure for maintainability

## Steps to Fix

### 1. Fix Import Order Issues

Fix the import order in `/app/pages/gallery.tsx` to comply with ESLint rules:
- External imports first (React, MUI, etc.)
- Internal imports second (components, utils, etc.)
- Proper spacing between import groups

### 2. Verify All Demo Pages Have Static Data

Check that all demo pages in `/app/pages/demos/` properly use static data from `/app/data/`:
- `air-quality.tsx` - Uses API data (needs static fallback)
- `climate.tsx` - Uses static data from `serbia-climate.ts` ✓
- `demographics.tsx` - Uses static data from `serbia-demographics.ts` ✓
- `digital.tsx` - Uses static data from `serbia-digital.ts` ✓
- `economy.tsx` - Uses static data from `serbia-economy.ts` ✓
- `employment.tsx` - Uses static data from `serbia-employment.ts` ✓
- `energy.tsx` - Uses static data from `serbia-energy.ts` ✓
- `healthcare.tsx` - Uses static data from `serbia-healthcare.ts` ✓
- `transport.tsx` - Uses static data from `serbia-traffic-safety.ts` ✓

### 3. Fix DemoGallery Component

The `DemoGallery` component currently fetches data from API at runtime. For GitHub Pages:
- Add static data fallback
- Handle loading states properly
- Ensure no runtime API calls that could fail

### 4. Verify Static Export Configuration

Ensure `next.config.js` is properly configured:
- `output: "export"` when `NEXT_PUBLIC_BASE_PATH` is set
- `basePath` and `assetPrefix` properly configured
- `images.unoptimized: true` for static export
- No server-side features used

### 5. Test Build Process

// turbo
Run the static build to verify everything works:
```bash
cd /Users/aleksandarilic/Documents/github/acailic/vizualni-admin
NEXT_PUBLIC_BASE_PATH=/vizualni-admin yarn build:static
```

### 6. Verify Output

Check the generated `app/out` directory:
- All demo pages are generated
- Assets are properly linked with base path
- No broken links or missing resources

## Implementation Order

1. Fix import order in gallery.tsx
2. Update DemoGallery component with static data
3. Verify all demo pages use static data
4. Test static build
5. Document any remaining issues
