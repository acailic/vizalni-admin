# Showcase & Demographics Polish Design

**Date**: 2026-03-02 **Status**: Approved **Owner**: Vizualni Admin Team

## Overview

Polish the Showcase page with clickable cards and modal previews, and enable +
polish the Demographics page with improved layout and visual hierarchy.

## Goals

1. **Showcase Page**: Make cards interactive with modal preview, add visual
   thumbnails, improve styling
2. **Demographics Page**: Enable the disabled page, add hero section, polish
   stats cards and chart presentation

---

## Part 1: Showcase Page - Modal Preview System

### Current Issues

- Cards are not clickable - no way to explore further
- No visual chart previews - just text content
- Same styling as demos index - lacks differentiation
- Chips all look the same - no visual distinction by category

### Card Enhancements

**Visual improvements:**

- Add topic-specific gradient icons for each card (matching demo icons from
  config)
- Add subtle thumbnail area with gradient preview (placeholder for chart)
- Improve chip styling with topic-specific colors
- Add hover scale effect and shadow enhancement

**Clickable behavior:**

- Entire card is clickable
- Opens a modal with mini chart preview, description, and CTA

### Modal Component

```tsx
interface ChartPreviewModalProps {
  open: boolean;
  onClose: () => void;
  chart: FeaturedChart;
}
```

**Modal content:**

- Header with chart icon + title
- Chart preview area (300x200px, renders actual chart component)
- Description text
- "View Full Demo" button linking to /topics/[topic]

### Component Structure

```
app/pages/demos/showcase/
├── index.tsx                      # Main page (modified)
├── _components/
│   ├── ChartPreviewModal.tsx      # New: Modal with chart preview
│   └── FeaturedChartCard.tsx      # New: Enhanced card component
```

### Card Styling Details

**Thumbnail area:**

- Height: 120px
- Background: Gradient based on category
  - Demographics: `linear-gradient(135deg, #f59e0b, #d97706)`
  - Energy: `linear-gradient(135deg, #10b981, #059669)`
  - Education: `linear-gradient(135deg, #8b5cf6, #7c3aed)`
  - Healthcare: `linear-gradient(135deg, #ef4444, #dc2626)`
  - Transport: `linear-gradient(135deg, #3b82f6, #2563eb)`
  - Economy: `linear-gradient(135deg, #f97316, #ea580c)`
- Center: Large icon from DEMO_CONFIGS

**Card hover:**

- Transform: `translateY(-8px) scale(1.02)`
- Shadow: Enhanced blue glow
- Transition: `0.3s cubic-bezier(0.4, 0, 0.2, 1)`

**Chip colors:**

- Match gradient colors for visual consistency
- White text, gradient background

---

## Part 2: Demographics Page - Layout Polish

### Current Issues

- Page is disabled (`.disabled` extension)
- No hero section - starts directly with alert
- Stats cards lack visual hierarchy
- Chart sections could be more engaging

### Page Structure

**1. Hero Section (new)**

- Gradient background: `linear-gradient(135deg, #f59e0b 0%, #d97706 100%)`
- Page title with icon
- Brief intro text
- Key stat highlight card (total population)

**2. Alert Banner**

- Keep demographic warning alert
- Add warning icon
- Improve styling with better visual weight

**3. Stats Cards Row (polished)**

- Add icons: 👥 (population), 📉 (change), 🎂 (age), ⚖️ (dependency)
- Use gradient accents on left border
- Better typography hierarchy
- Subtle hover effect

**4. Chart Sections (improved)**

- Add section icons
- Improve Paper styling with subtle shadows
- Better chart title typography
- Add "Key Insight" callout boxes below charts

**5. Regional Distribution**

- Keep existing card layout
- Add visual bar indicators for percentages

**6. Key Challenges Section**

- Improve chip styling with semantic colors
- Better grid layout
- Add visual separators

### File Changes

```
app/pages/demos/
├── demographics.tsx.disabled  →  demographics.tsx  # Rename + modify
```

### Stats Card Polish

**Icons and colors:** | Card | Icon | Border Color |
|------|------|--------------| | Total Population | 👥 | primary.main | | Change
by 2050 | 📉 | error.main | | Median Age | 🎂 | warning.main | | Elderly
Dependency | ⚖️ | info.main |

**Typography:**

- Label: `caption`, text.secondary
- Value: `h4`, fontWeight 700
- Subtitle: `body2`, text.secondary

### Chart Section Improvements

**Paper styling:**

- Elevation: 2
- Padding: 3
- Border radius: 3
- Subtle border: 1px solid divider

**Section headers:**

- Icon + Title
- Typography: h5, fontWeight 600
- Margin bottom: 3

**Insight callouts:**

- Box with light background
- Border left: 3px solid primary
- Padding: 2
- Typography: body2, italic

---

## Dependencies

**No new packages required:**

- MUI components (Dialog, Card, Chip, Box, Typography)
- Existing chart components (PopulationPyramid, PopulationTrends)
- Lingui for i18n
- Next.js Link

---

## Testing Strategy

| Type          | Coverage                     | Tools             |
| ------------- | ---------------------------- | ----------------- |
| Visual        | Modal opens, cards clickable | Manual testing    |
| Functional    | Links work, charts render    | Browser testing   |
| Accessibility | Keyboard nav, screen reader  | Manual a11y check |

---

## Success Criteria

- Showcase cards are clickable and open modal preview
- Modal shows chart preview with description
- Demographics page is enabled and accessible
- Stats cards have icons and improved visual hierarchy
- Chart sections have better presentation
- All text properly internationalized
