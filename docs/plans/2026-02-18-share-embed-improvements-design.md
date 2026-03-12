# Share & Embed Improvements Design

**Date:** 2026-02-18 **Goal:** Increase embeds and shares of charts on external
sites and social media **Target Audience:** Developers (evaluating library) +
General public (exploring open data)

## Problem Statement

Current demo experience has three key gaps:

1. **Discovery** — demos are hard to find/browse
2. **Engagement** — demos feel static, don't showcase capabilities
3. **Sharing** — users can't easily share, embed, or export

## Solution: Phased Rollout

Three phases delivering incremental value:

---

## Phase 1: One-Click Embed Experience

**Goal:** Make embedding a chart take < 5 seconds with zero friction.

### Changes

1. **Enhanced `EmbedContent` component** (`publish-actions.tsx`)
   - Add "Copy Embed Code" as primary action button (not just text input)
   - Add live iframe preview panel showing how embed will look
   - Add preset sizes: Small (400px), Medium (640px), Large (960px), Responsive

2. **New `/embed/[chartId]` enhancements**
   - Add `?utm_source=embed` tracking parameter
   - Add "View Full Chart" link back to source
   - Optimize for fast load (lazy load non-essential JS)

3. **Share button improvements**
   - Add "Copy Link" as primary action (one click copies to clipboard + toast
     confirmation)
   - Add QR code for mobile sharing
   - Add "Download as Image" with watermark/branding option

4. **Prominent CTAs on demo pages**
   - Add floating "Share this chart" sticky bar on `/demos/*` pages
   - Add "Embed" button to chart headers

### Files to Modify

- `app/components/publish-actions.tsx`
- `app/components/social-media-share.tsx`
- `app/pages/demos/[category].tsx`
- `app/pages/embed/[chartId].tsx`

---

## Phase 2: Featured Showcase Gallery

**Goal:** Surface the best charts prominently with clear share/embed CTAs.

### Changes

1. **New `/showcase` page** (or enhance `/demos/showcase`)
   - Curated selection of 6-8 "featured" charts (hand-picked or metrics-driven)
   - Each chart displayed with:
     - Large preview (not thumbnail)
     - One-sentence description
     - **"Embed" button** — opens embed modal with one-click copy
     - **"Share" button** — opens share modal
     - **"View Full Chart"** — links to full interactive version

2. **Homepage (`/`) enhancements**
   - Add "Featured Visualizations" section above the fold
   - Show 3 charts in a horizontal scroll/carousel
   - Each with "Embed this chart" button

3. **Featured chart selection**
   - Create `FEATURED_CHARTS` config in `app/lib/demos/config.ts`
   - Include: title, description, chartId, thumbnail, category, why it's
     featured
   - Support dynamic selection based on analytics (future)

4. **Showcase card component**

```
┌─────────────────────────────────────┐
│  [Chart Preview Image/iframe]       │
│                                     │
│  📊 Population Trends in Serbia    │
│  Real-time demographics data        │
│                                     │
│  [Embed] [Share] [View Full Chart] │
└─────────────────────────────────────┘
```

### Files to Modify/Create

- `app/pages/demos/showcase.tsx` (enhance)
- `app/pages/index.tsx` (add featured section)
- `app/components/demos/showcase-card.tsx` (new)
- `app/lib/demos/config.ts` (add featured config)

---

## Phase 3: Interactive Playground

**Goal:** Let users modify charts and share their custom creations.

### Changes

1. **New `/playground` page**
   - Split-screen layout: Chart preview (left) | Controls panel (right)
   - Chart type selector (line, bar, pie, area, map)
   - Data input options:
     - **Sample data** — pre-loaded demo datasets
     - **Paste CSV/JSON** — user provides data
     - **data.gov.rs fetch** — search and load from Serbian Open Data Portal
   - Customization controls:
     - Title, subtitle, axis labels
     - Color palette (presets + custom picker)
     - Legend position, show/hide gridlines
   - **Output:**
     - Live preview updates as user makes changes
     - "Share My Chart" — generates unique URL with encoded state
     - "Embed My Chart" — generates iframe code
     - "Download as PNG/SVG"

2. **URL-based state persistence**
   - Encode playground state in URL query params (compressed)
   - Example: `/playground?type=bar&data=...&colors=...`
   - Shareable links recreate exact chart configuration
   - No backend required — all client-side

3. **Playground embed widget**
   - Option to embed an interactive version (not just static)
   - Embed recipients can modify colors/data in-place
   - "Made with vizualni-admin" branding

### Component Architecture

```
/playground
├── PlaygroundLayout.tsx      # Main layout wrapper
├── ChartPreview.tsx          # Live chart renderer
├── ControlPanel/
│   ├── DataTypeSelector.tsx  # Sample / CSV / API
│   ├── ChartTypeSelector.tsx # Line, bar, pie, etc.
│   ├── DataInput.tsx         # CSV/JSON textarea
│   ├── ColorPicker.tsx       # Palette + custom
│   └── LabelEditor.tsx       # Title, axis labels
├── SharePanel.tsx            # Share/embed/download
└── usePlaygroundState.ts     # URL state management
```

### Files to Create

- `app/pages/playground/index.tsx`
- `app/components/playground/*.tsx` (5-6 new components)
- `app/hooks/use-playground-state.ts`
- `app/lib/playground/presets.ts` (sample datasets, color palettes)

---

## Success Metrics

- **Primary:** Increase in embeds/shares (track via UTM parameters)
- **Secondary:**
  - Time from landing to first embed action
  - Playground usage (charts created/shared)
  - Featured showcase click-through rate

## Dependencies

- Phase 1: No new dependencies
- Phase 2: No new dependencies
- Phase 3: May need URL compression library (lz-string or similar)
