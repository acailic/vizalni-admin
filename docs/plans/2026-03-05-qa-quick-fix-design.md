# QA Quick Fix Design

**Date:** 2026-03-05 **Scope:** Critical fixes only - broken links, nav
branding, embed generator, placeholder pages

## Problem Statement

QA testing revealed several critical issues across the Vizualni Admin
public-facing pages that need immediate fixes before launch.

## Design Decisions

### 1. Docs 404s (Home page links)

**Problem:** The home page "Resources" section links to
`/tutorials/your-first-visualization`, `/tutorials/understanding-chart-types`,
`/tutorials/basic-embedding` - but these tutorial pages don't exist as routes
(only config entries).

**Solution:** Update links to point to existing working pages:

- "Getting started" → `/demos` (demo gallery)
- "Chart types guide" → `/demos/showcase`
- "Embedding guide" → `/embed`
- "Demo gallery" → `/demos` (already correct)

**File:** `app/pages/index.tsx` - `resourcesCopy` object

### 2. Nav-home link target (branding confusion)

**Problem:** The header shows "data.gov.rs" as brand but links to `/` (Vizualni
Admin home), creating confusion about where users will land.

**Solution:** Change the brand text to "Vizualni Admin" to match the actual
destination.

**File:** `app/components/header.tsx`

- Change `longTitle="data.gov.rs"` → `longTitle="Vizualni Admin"`
- Keep `rootHref="/"` pointing to home

### 3. Embed generator iframe src

**Problem:** The embed generator at
`/embed?type=bar&dataset=budget&dataSource=Prod` ignores the URL params and
generates iframe URLs pointing to `/embed/demo?theme=light&lang=en` without the
chart parameters.

**Root cause:** The `passthroughParams` logic in `embed/index.tsx` correctly
filters params, but the `baseEmbedUrl` is hardcoded to `/embed/demo` which is a
static demo page, not a dynamic chart renderer.

**Solution:** Ensure the embed generator correctly passes through all relevant
URL params (`type`, `dataset`, `dataSource`) to the generated iframe URL.

**File:** `app/pages/embed/index.tsx`

### 4. Placeholder demo pages

**Problem:** Demo pages at `/demos/[demoId]` show "coming soon" placeholder text
instead of actual charts.

**Solution:** For quick ship, improve the placeholder UI to:

- Show clear "Coming Soon" badge
- Provide link back to demo gallery
- Reduce repetitive warning icons

**File:** `app/pages/demos/[demoId].tsx`

## Files to Modify

1. `app/pages/index.tsx` - Fix resource links
2. `app/components/header.tsx` - Fix branding
3. `app/pages/embed/index.tsx` - Fix iframe URL generation
4. `app/pages/demos/[demoId].tsx` - Improve placeholder UI

## Out of Scope

- Language/script consistency (Cyrillic/Latin mixing)
- Duplicate UI elements (back arrows, headings)
- Accessibility improvements
- Locale formatting (numbers, dates)
- Full demo page implementations
