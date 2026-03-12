# Feature Request

## Title
Embeddable charts via iframe with responsive resizing

## Problem
Government agencies, journalists, and NGOs need to embed charts in their own websites, reports, and CMS pages. The Swiss tool has a full embed system (`app/pages/embed/`, `embed/` script) with iframe resizing and embed code generation. We need the same for Serbian data charts.

## Proposed behavior

### Embed page (`/embed/chart`)
- Minimal chrome: no header, no navigation, no footer
- Renders the chart from encoded state (same as Feature 09 `/v/chart` but stripped-down)
- Includes: chart, title, legend, source attribution ("Извор: data.gov.rs")
- Respects color scheme from parent page (light/dark via query param `?theme=light|dark`)
- Responsive: fills available width, maintains aspect ratio

### Embed code generation
In the Share dialog (Feature 09), add an "Embed" tab that generates:
```html
<iframe
  src="https://vizuelni.example.rs/embed/chart?s={encoded-state}"
  width="100%"
  height="400"
  frameborder="0"
  title="{chart-title}"
  loading="lazy"
></iframe>
```

With a copy button and preview of how it will look.

### Responsive iframe resizing
Embed page includes a small script that communicates its content height to the parent:
```javascript
// Inside embed page
window.parent.postMessage({
  type: 'vizuelni-resize',
  height: document.body.scrollHeight
}, '*')
```

Optional: provide a small embeddable script (`/embed.js`) that auto-resizes iframes:
```html
<script src="https://vizuelni.example.rs/embed.js"></script>
<div data-vizuelni-chart="{encoded-state}" data-height="400"></div>
```
The script creates the iframe and handles resize messages.

### Embed options
- Width: auto (100%) or fixed px
- Height: auto-resize or fixed
- Theme: light / dark / auto (inherit from parent)
- Show/hide: title, legend, source attribution
- Interactive: enable/disable filters in embedded view

### Embed page implementation
- `src/app/embed/chart/page.tsx` — server component
- Minimal layout: no `<AppLayout>`, no navigation
- Only loads chart-related CSS/JS (no sidebar, no theme switcher, no i18n switcher)
- CSP headers allow framing from any origin (or configurable allowed origins)
- Cache-Control headers for CDN caching

## Affected areas
- `src/app/embed/` (new route group)
  - `chart/page.tsx` — embed chart page
  - `layout.tsx` — minimal embed layout (no header/footer)
- `public/embed.js` (new: optional auto-sizing script, ~2KB)
- `src/components/charts/shared/ShareDialog.tsx` (extend with Embed tab)
- `src/components/embed/` (new)
  - `EmbedPreview.tsx` — preview of embedded chart
  - `EmbedCodeGenerator.tsx` — generate and copy embed code
- `next.config.js` (update headers for iframe CSP)
- `public/locales/*/common.json` (embed labels: "Embed", "Copy code", "Preview", etc.)

## Constraints
- Embed page must load fast (<2s on 3G) — minimize JS bundle for embed route
- Do not include the full app shell, i18n switcher, or navigation in embed
- CSP `frame-ancestors` must be permissive for embeds but restrictable via env var
- Embed URLs must be stable — don't break existing embeds when updating the app
- Embedded charts must still show source attribution (legal requirement for government data)
- `embed.js` script must be small (<3KB minified), no dependencies

## Out of scope
- Embed analytics (tracking where charts are embedded)
- Embed customization API (programmatic control of embedded charts)
- Embedding dashboards (single charts only for now)

## Acceptance criteria
- [ ] `/embed/chart?s={state}` renders a chart without app chrome (no header/nav/footer)
- [ ] Embed page loads in under 2 seconds on throttled connection
- [ ] Share dialog generates correct iframe embed code
- [ ] Embed code copy button works
- [ ] Embedded chart is responsive (fills container width)
- [ ] iframe resize message is sent to parent window
- [ ] Optional `embed.js` script creates and auto-sizes iframes
- [ ] Theme parameter works (light/dark)
- [ ] Source attribution is visible in embedded view
- [ ] All embed dialog text translated in three locales
- [ ] CSP headers configured to allow embedding from any origin

## Prior art / references
- Swiss tool: `app/pages/embed/[chartId].tsx` — embed page
- Swiss tool: `embed/` directory — standalone embed resize script
- Swiss tool uses postMessage for iframe height communication
