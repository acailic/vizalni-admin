# Professional Portal Gap Analysis & Design

**Date:** 2026-03-10 **Author:** Claude (superpowers:brainstorming) **Status:**
Draft for Approval

## Executive Summary

This document identifies gaps between vizualni-admin and professional open data
portals like visualize.admin.ch, with prioritized recommendations for achieving
professional quality.

## Current State Analysis

### Existing Pages

| Page       | Path                | Purpose                               |
| ---------- | ------------------- | ------------------------------------- |
| Homepage   | `/`                 | Hero, showcase cards, featured charts |
| Gallery    | `/gallery`          | Static dataset cards from data.gov.rs |
| Topics     | `/topics`           | Category-based browsing               |
| Browse     | `/browse`           | Dataset search and selection          |
| Statistics | `/statistics`       | Usage analytics dashboard             |
| Docs       | `/docs`             | Documentation guides                  |
| Tutorials  | `/tutorials`        | Tutorial pages                        |
| Demos      | `/demos`            | Demo showcase                         |
| Create     | `/create/[chartId]` | Chart configurator                    |
| View       | `/v/[chartId]`      | Published chart viewer                |
| Embed      | `/embed/[chartId]`  | Embeddable charts                     |

### Current Navigation

- **Header:** Demo Gallery button, GitHub link, Language picker
- **Footer:** About, Tutorials, Status, Version, Legal, Imprint
- **No main navigation menu**

---

## Gap Analysis

### 1. Navigation & Information Architecture

**Priority: HIGH**

| Gap             | Current      | Target                                     |
| --------------- | ------------ | ------------------------------------------ |
| Main Navigation | 2 links only | Full nav menu with all sections            |
| Breadcrumbs     | None         | Present on nested pages                    |
| Active State    | None         | Clear visual indication of current section |
| Mobile Nav      | Basic        | Hamburger menu with full navigation        |

**Design Recommendation:**

```
Header Layout:
┌─────────────────────────────────────────────────────────────────┐
│ Logo  │ Browse │ Create │ Topics │ Gallery │ Docs │ [Search] │ EN │
└─────────────────────────────────────────────────────────────────┘
```

### 2. Search & Discovery

**Priority: HIGH**

| Gap             | Current        | Target                        |
| --------------- | -------------- | ----------------------------- |
| Global Search   | None           | Site-wide search in header    |
| Gallery Filters | None           | Type, category, date filters  |
| Gallery Sort    | None           | Recent, popular, alphabetical |
| Tag Navigation  | Static display | Clickable tag filters         |
| Search Results  | N/A            | Dedicated search results page |

**Design Recommendation:**

```
Search Experience:
1. Header search bar with autocomplete
2. Search results page with filters sidebar
3. Gallery page with filter chips and sort dropdown
```

### 3. Homepage Enhancements

**Priority: MEDIUM**

| Gap                | Current | Target                                          |
| ------------------ | ------- | ----------------------------------------------- |
| Statistics Preview | None    | "X charts created, Y datasets" counter          |
| Quick Actions      | None    | "Create Chart" and "Browse Data" prominent CTAs |
| Use Cases          | None    | 2-3 example use case cards                      |
| Testimonials       | None    | User quotes or case studies                     |
| Latest Charts      | None    | Carousel of recent visualizations               |

**Design Recommendation:**

```
Homepage Sections (in order):
1. Hero with primary CTAs
2. Statistics counter (animated)
3. Quick actions grid
4. Featured charts carousel
5. Use case examples
6. Getting started section
7. Footer
```

### 4. Onboarding & User Guidance

**Priority: MEDIUM**

| Gap                 | Current | Target                       |
| ------------------- | ------- | ---------------------------- |
| First-time UX       | None    | Guided onboarding wizard     |
| Tooltips            | None    | Contextual help tooltips     |
| Progress Indicators | None    | Step progress in create flow |
| Empty States        | Basic   | Helpful guidance with CTAs   |

**Design Recommendation:**

- Link existing `/onboarding` wizard from homepage
- Add "First time? Start here" callout on homepage
- Add tooltips to chart configurator fields

### 5. Visual Design & Polish

**Priority: MEDIUM**

| Gap            | Current      | Target                               |
| -------------- | ------------ | ------------------------------------ |
| Typography     | MUI default  | Custom font scale (Inter or similar) |
| Spacing        | Inconsistent | Design tokens with 8px base          |
| Animations     | None         | Subtle transitions (150-300ms)       |
| Hover States   | Basic        | Enhanced with elevation/color        |
| Loading States | Spinner only | Skeleton loaders                     |
| Illustrations  | None         | Custom icons for empty states        |

**Design Recommendation:**

```css
/* Typography Scale */
--font-size-xs: 0.75rem; /* 12px */
--font-size-sm: 0.875rem; /* 14px */
--font-size-base: 1rem; /* 16px */
--font-size-lg: 1.125rem; /* 18px */
--font-size-xl: 1.25rem; /* 20px */
--font-size-2xl: 1.5rem; /* 24px */
--font-size-3xl: 1.875rem; /* 30px */
--font-size-4xl: 2.25rem; /* 36px */

/* Spacing Scale (8px base) */
--space-1: 0.25rem; /* 4px */
--space-2: 0.5rem; /* 8px */
--space-3: 0.75rem; /* 12px */
--space-4: 1rem; /* 16px */
--space-6: 1.5rem; /* 24px */
--space-8: 2rem; /* 32px */
--space-12: 3rem; /* 48px */
--space-16: 4rem; /* 64px */

/* Animation Timing */
--transition-fast: 150ms ease;
--transition-base: 200ms ease;
--transition-slow: 300ms ease;
```

### 6. Accessibility

**Priority: HIGH**

| Gap              | Current    | Target                 |
| ---------------- | ---------- | ---------------------- |
| Skip Link        | Present    | Maintain               |
| ARIA Labels      | Partial    | Comprehensive          |
| Focus Management | Basic      | Visible focus rings    |
| Color Contrast   | Unverified | WCAG AA compliant      |
| Keyboard Nav     | Partial    | Full keyboard support  |
| Screen Reader    | Basic      | Enhanced announcements |

**Design Recommendation:**

- Run accessibility audit (axe-core)
- Add focus-visible styles
- Ensure 4.5:1 contrast ratio
- Add aria-labels to interactive elements

### 7. SEO & Metadata

**Priority: MEDIUM**

| Gap             | Current     | Target                    |
| --------------- | ----------- | ------------------------- |
| Meta Tags       | Basic title | Full Open Graph + Twitter |
| Structured Data | None        | Schema.org JSON-LD        |
| Canonical URLs  | None        | Present on all pages      |
| Sitemap         | None        | Generated sitemap.xml     |
| robots.txt      | None        | Properly configured       |

**Design Recommendation:**

```html
<!-- Open Graph -->
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:image" content="..." />
<meta property="og:type" content="website" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />

<!-- Structured Data -->
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Vizualni Admin",
    "description": "...",
    "applicationCategory": "DataVisualizationApplication"
  }
</script>
```

### 8. Community & Engagement

**Priority: LOW**

| Gap            | Current     | Target                  |
| -------------- | ----------- | ----------------------- |
| Social Sharing | None        | Share buttons on charts |
| Feedback       | GitHub only | In-app feedback widget  |
| Newsletter     | None        | Email signup option     |
| Changelog      | None        | Version history page    |

**Design Recommendation:**

- Add share buttons to chart view pages
- Add "Was this helpful?" feedback on docs
- Consider newsletter signup in footer

---

## Implementation Phases

### Phase 1: Foundation (High Priority)

**Estimated: 1-2 weeks**

1. Add main navigation component
2. Add global search bar to header
3. Link onboarding from homepage
4. Add statistics preview to homepage
5. Basic accessibility audit

### Phase 2: Discovery (Medium Priority)

**Estimated: 1-2 weeks**

6. Add gallery filters and sorting
7. Implement search results page
8. Add Open Graph meta tags
9. Add share buttons to charts

### Phase 3: Polish (Lower Priority)

**Estimated: 1-2 weeks**

10. Typography and spacing refinements
11. Add subtle animations
12. Add structured data
13. Add use case examples
14. Enhanced loading states

---

## Technical Considerations

### Component Architecture

```
app/
├── components/
│   ├── navigation/
│   │   ├── MainNav.tsx        # New main navigation
│   │   ├── NavItem.tsx        # Nav link with active state
│   │   └── MobileNav.tsx      # Mobile hamburger menu
│   ├── search/
│   │   ├── GlobalSearch.tsx   # Header search component
│   │   ├── SearchResults.tsx  # Search results page
│   │   └── SearchAutocomplete.tsx
│   └── homepage/
│       ├── StatsCounter.tsx   # Animated statistics
│       ├── QuickActions.tsx   # CTA grid
│       └── UseCases.tsx       # Example use cases
```

### Data Requirements

- Search index (consider Algolia or local lunr.js)
- Statistics API endpoint (already exists at `/api/statistics/summary`)
- Chart metadata for filtering

### Testing Strategy

- Visual regression tests for navigation
- E2E tests for search flow
- Accessibility tests with axe-core
- Performance tests for search

---

## Success Metrics

| Metric              | Current | Target                   |
| ------------------- | ------- | ------------------------ |
| Navigation items    | 2       | 6+                       |
| Search capability   | None    | Full site search         |
| Accessibility score | Unknown | 90+ (Lighthouse)         |
| SEO score           | Unknown | 90+ (Lighthouse)         |
| Time to first chart | Unknown | < 3 clicks from homepage |

---

## Open Questions

1. Should search use external service (Algolia) or local index?
2. What is the priority for dark mode support?
3. Should we implement internationalization for all new content immediately?

---

## Approval

- [ ] Design approved by user
- [ ] Ready for implementation plan
