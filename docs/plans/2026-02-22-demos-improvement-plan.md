# Demos Improvement Plan

> **Status:** Planning **Created:** 2026-02-22 **Priority:** High - 25 broken
> links on demos page

## Current State Analysis

### What's Working

- `/demos/` - Demos index page (200)
- `/demos/playground/` - Interactive playground (200)
- `/topics/` - New topic-based exploration with 6 topics (all 200)

### What's Broken (25 pages)

All demo category pages return 404:

- Agriculture, Air Quality, Budget, Climate, Culture
- Demographics, Digital, Economy, Education, Education-Trends
- Employment, Energy, Environment, Health, Healthcare
- Infrastructure, Modern-API, Pitch, Playground-v2, Presentation
- Public-Health-Crisis, Regional-Development, Showcase, Tourism, Transport

### Root Cause

Demo pages were disabled to fix GitHub Pages build failures caused by:

1. **Uncompiled lingui messages** - Hash IDs generated at runtime
2. **SSR-disabled chart components** - Charts use `ssr: false` but pages are
   statically generated
3. **Mixed i18n systems** - Some pages use `next-i18next`, others use `@lingui`

---

## Improvement Strategy

### Option A: Fix Demo Pages for Static Export (Recommended)

**Approach:** Make demo pages compatible with static export

**Tasks:**

1. **Fix lingui message extraction**
   - Identify all components with uncompiled messages
   - Move inline `defineMessage` to top-level exports
   - Run `locales:extract` and `locales:compile` before build

2. **Fix chart SSR issues**
   - Create SSR-safe chart wrappers that render placeholder during build
   - Charts hydrate on client-side only
   - Add `loading` state for static builds

3. **Consolidate i18n**
   - Remove `next-i18next` usage (incompatible with static export)
   - Use `@lingui` consistently across all demo pages

4. **Re-enable demo pages**
   - Move `.disabled` files back to `.tsx`
   - Test each page individually

**Estimated effort:** 2-3 days

---

### Option B: Update Demos Index to Remove Broken Links

**Approach:** Quick fix - remove links to non-existent pages

**Tasks:**

1. Update demos index to only show working demos
2. Add "Coming Soon" placeholders for planned demos
3. Link to `/topics/` as alternative for data exploration

**Estimated effort:** 1 hour

---

### Option C: Merge Demos into Topics (Strategic)

**Approach:** Consolidate demo categories into the new Topics feature

**Rationale:**

- Topics already cover similar categories (economy, health, education, etc.)
- Topics are working and statically exported
- Reduces maintenance burden
- Better user experience (one place for all data exploration)

**Tasks:**

1. Map demo categories to topics:
   - `/demos/economy/` → `/topics/economy/`
   - `/demos/health/` → `/topics/health/`
   - `/demos/education/` → `/topics/education/`
   - etc.

2. Add "Featured Visualizations" section to each topic page

3. Redirect old demo URLs to topics

4. Update navigation and links

**Estimated effort:** 1-2 days

---

## Recommended Implementation Order

### Phase 1: Immediate Fix (Today)

1. ✅ Update demos index to remove broken links (Option B)
2. ✅ Add link to `/topics/` as primary data exploration entry point

### Phase 2: Strategic Improvement (This Week)

1. Implement Option C - Merge demos into topics
2. Add visualization examples to each topic page
3. Create redirect rules for old demo URLs

### Phase 3: Long-term (Next Sprint)

1. Re-enable standalone demo pages with fixes (Option A)
2. Create showcase gallery with working visualizations
3. Add demo submission workflow for community contributions

---

## Technical Debt to Address

1. **Lingui Configuration**
   - Ensure all messages use explicit IDs
   - Configure `onMissing` handler to fail builds
   - Add pre-commit hook to run `locales:extract`

2. **Chart Components**
   - Create `StaticSafeChart` wrapper component
   - Add placeholder/hydration pattern
   - Document SSR-safe chart usage

3. **I18n Consolidation**
   - Remove `next-i18next` dependency
   - Standardize on `@lingui/react`
   - Update all i18n usage to lingui patterns

---

## Files to Modify

### Phase 1 (Immediate)

- `app/pages/demos/index.tsx` - Remove broken links, add topics link

### Phase 2 (Strategic)

- `app/pages/topics/[topic].tsx` - Add featured visualizations section
- `app/data/topics/*.json` - Add visualization examples to topic data
- `app/components/topics/DatasetCard.tsx` - Add "View Demo" link
- `next.config.js` - Add redirect rules

### Phase 3 (Long-term)

- `app/pages/demos/*.tsx.disabled` - Re-enable and fix
- `app/components/demos/charts/*.tsx` - Make SSR-safe
- `app/locales/**/*.po` - Extract and compile all messages

---

## Success Metrics

- [ ] Zero 404 errors from demos page
- [ ] All topic pages have at least 1 working visualization
- [ ] Build time under 10 minutes
- [ ] No lingui warnings in build output
- [ ] All demo links either work or redirect to working pages
