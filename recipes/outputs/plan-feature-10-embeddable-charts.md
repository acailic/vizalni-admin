# Feature 10: Embeddable Charts via iframe with Responsive Resizing

## Current State

**Already exists:**
- URL state layer: `src/lib/url/encode-state.ts`, `src/lib/url/decode-state.ts`, `src/lib/url/state-schema.ts`, `src/lib/url/index.ts`
- Placeholder UI: `src/components/configurator/PreviewStep.tsx` with copy URL and copy embed code actions
- Localization: `src/lib/i18n/locales/*/common.json` contains `copy_embed` text

**Needs creation:**
- Embed route: `src/app/embed/chart/route.tsx` (or page.tsx)
- Embed helper script: `public/embed.js`
- Embed code generator utility

---

## Remaining Workstreams

### 1. Create Embed Route (Priority: High)
**Files to add:**
- `src/app/embed/chart/page.tsx` — Minimal chrome wrapper for chart rendering

**Implementation:**
- Decode chart state from URL query params using `src/lib/url/decode-state.ts`
- Render chart using existing chart component (reuse from main app)
- Strip all app chrome (header, sidebar, footer, configurator panels)
- Apply theme via URL parameter (`?theme=light|dark`)
- Include source attribution badge/link (non-removable)
- Set appropriate viewport meta for responsive scaling

### 2. Extend Sharing Flow (Priority: High)
**Files to modify:**
- `src/components/configurator/PreviewStep.tsx` — Replace placeholder with functional embed code generation

**Files to add:**
- `src/lib/embed/generate-embed-code.ts` — Generate iframe snippet with src, dimensions, attributes

**Implementation:**
- Generate iframe code: `<iframe src="{baseUrl}/embed/chart?{state}&theme={theme}" width="100%" height="500" frameborder="0"></iframe>`
- Include optional `embed.js` script tag for auto-resize
- Add "Copy Embed Code" button with clipboard integration
- Show preview of iframe dimensions

### 3. Implement Auto-Resize Support (Priority: Medium)
**Files to add:**
- `public/embed.js` — Lightweight helper script (~2KB)
- `src/app/embed/chart/page.tsx` — Add postMessage sender on resize

**Implementation:**

*In embed route:*
- Send initial height via `window.parent.postMessage({ type: 'viz-admin-resize', height: document.body.scrollHeight }, '*')`
- Set up ResizeObserver to send updates on content changes
- Include origin check for security

*In embed.js:*
- Find all iframes with `data-viz-admin-embed` attribute
- Listen for `message` events from embed origin
- Update iframe height based on received payload
- Provide cleanup method

### 4. Theme Parameter Support (Priority: Medium)
**Files to modify:**
- `src/app/embed/chart/page.tsx` — Parse and apply theme param
- `src/lib/url/state-schema.ts` — Add optional theme field if not present

**Implementation:**
- Accept `?theme=light|dark|auto` query parameter
- Default to light theme if unspecified
- Apply theme CSS variables/classes to embed container
- If auto, respect `prefers-color-scheme` media query

### 5. Source Attribution (Priority: Low)
**Files to modify:**
- `src/app/embed/chart/page.tsx` — Add attribution element

**Implementation:**
- Small "Powered by" or source logo in bottom corner
- Link to original dataset source or app homepage
- Style to be unobtrusive but always visible

---

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| postMessage origin security | High | Validate message origin; use specific origin instead of `'*'` |
| Embed.js CDN availability | Medium | Host on same domain; consider inline option |
| Chart rendering performance in iframe | Medium | Lazy-load heavy dependencies; optimize bundle split |
| URL length limits for complex state | Medium | Consider short-URL service or hash-based state |
| Responsive edge cases | Low | Test across breakpoints; document minimum width |

---

## Verification

1. **Unit tests:**
   - `generate-embed-code.ts` output format
   - Theme parameter parsing
   - State encoding/decoding roundtrip

2. **Integration tests:**
   - Embed route renders chart from URL state
   - Theme switching reflects correctly
   - Attribution displays and links correctly

3. **Manual tests:**
   - Paste embed code into external page → chart renders
   - Resize container → iframe height updates (with embed.js)
   - Mobile viewport → chart remains usable
   - Copy embed code → clipboard contains valid HTML

4. **Cross-browser:**
   - Test postMessage in Chrome, Firefox, Safari, Edge
   - Verify iframe sandbox behavior

---

## Complexity

**Estimated effort:** 1-2 days

| Component | Effort |
|-----------|--------|
| Embed route setup | 2-3 hours |
| Chart reuse + chrome removal | 2-3 hours |
| Embed code generator | 1-2 hours |
| postMessage auto-resize | 2-3 hours |
| embed.js helper | 1-2 hours |
| Theme support | 1 hour |
| Attribution UI | 30 min |
| Testing | 2-3 hours |

**Dependencies:** None blocking — builds directly on feature 09 URL state layer.
