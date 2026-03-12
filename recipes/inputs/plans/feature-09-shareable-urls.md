# Feature Request

## Title
Shareable URLs with encoded chart state

## Problem
Users cannot share a specific chart view — including chart type, dimension mappings, filter selections, and time ranges — via a URL. Every view is ephemeral. The Swiss tool encodes full chart state in URL hashes, making any view bookmarkable and shareable.

## Proposed behavior

### State encoding
Encode the complete chart view state into URL query parameters:
- Chart configuration: chart type, dimension mappings, measure selections
- Active filters: dimension filter values, time range, legend toggles
- Dataset reference: dataset ID, resource ID
- Appearance: color palette, custom title (if changed from default)

### URL format
```
/v/chart?s={encoded-state}
```
Where `{encoded-state}` is a compressed, URL-safe representation of the chart config.

### Encoding strategy
Use a compressed JSON approach:
1. Serialize state to JSON
2. Compress with `lz-string` (or similar) to reduce URL length
3. Base64url encode for URL safety
4. Decode on page load and restore state

Alternative: use `rison` format (more readable URLs, used by the Swiss tool in `app/utils/hash-utils.ts`).

Decision point: readability vs. compression. For Serbian Cyrillic values in filters, compression is probably necessary to keep URLs under 2000 characters.

### View page (`/v/chart`)
- Server component that decodes the URL state
- Renders the chart with full config restored
- Shows chart title, source attribution, and a "Create your own" link
- No configurator UI — this is a read-only view

### Share dialog
When user clicks "Share" on a chart:
1. Generate the shareable URL
2. Show a dialog with:
   - Copyable URL (with copy-to-clipboard button)
   - QR code (optional, nice for presentations)
   - Social sharing buttons (optional): copy link, email
3. URL is immediately valid — no server persistence required

### URL update behavior in configurator
- As user changes configuration in the configurator, update the URL hash (not the full path)
- Use `replaceState` (not `pushState`) to avoid polluting browser history
- Debounce URL updates (500ms) to avoid thrashing during rapid changes
- On page load, if URL contains state, restore it and skip initial dataset selection

### Backwards compatibility
- Old URLs without state params show the default home/browse page
- If encoded state references a dataset that no longer exists, show a clear error
- If state format changes in future, version the encoding: `?v=1&s={state}`

## Affected areas
- `src/lib/url/` (new directory)
  - `encode-state.ts` — serialize + compress + base64url encode
  - `decode-state.ts` — base64url decode + decompress + deserialize + validate
  - `state-schema.ts` — Zod schema for validated state decoding
- `src/app/v/` (new route group)
  - `chart/page.tsx` — shareable chart view page
- `src/components/charts/shared/ShareDialog.tsx` (new)
- `src/components/configurator/` (update: sync config state to URL)
- `package.json` (add lz-string or similar compression library)
- `public/locales/*/common.json` (share labels: "Share", "Copy link", "Link copied", etc.)

## Constraints
- URL must be under 2000 characters for universal browser/platform support
- Cyrillic text in filter values must survive encoding/decoding without corruption
- State validation on decode must be strict — reject corrupted or tampered URLs gracefully
- Do not put sensitive data in URLs (no auth tokens, no private dataset references)
- Must work without JavaScript on initial render (SSR the chart from decoded state)

## Out of scope
- Short URLs (URL shortener integration)
- Server-side state persistence (that's Feature 13)
- Embedding in iframes (that's Feature 10)
- Dashboard URL encoding (that's more complex, addressed in Feature 07 + 13)

## Acceptance criteria
- [ ] Chart state encodes to a URL under 2000 characters for typical configurations
- [ ] Encoded URL restores exact chart view: chart type, data, filters, appearance
- [ ] Cyrillic filter values survive round-trip encoding/decoding
- [ ] Share dialog shows copyable URL with one-click copy
- [ ] `/v/chart?s={state}` renders the chart server-side (works without JS on first render)
- [ ] Invalid/corrupted state URLs show a user-friendly error, not a crash
- [ ] URL state is versioned for forward compatibility
- [ ] Configurator syncs state to URL hash without polluting browser history
- [ ] All share UI translated in three locales

## Prior art / references
- Swiss tool: `app/utils/hash-utils.ts` — rison-based state encoding/decoding
- Swiss tool: `app/pages/v/[chartId].tsx` — chart view page
- lz-string library: client-side string compression
- rison format: readable URL-safe object encoding
