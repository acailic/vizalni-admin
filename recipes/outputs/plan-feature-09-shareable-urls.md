# Feature 09: Shareable URLs with Encoded Chart State

## Current State

- **Existing codec**: `src/lib/url/` contains `encode-state.ts`, `decode-state.ts`, `state-schema.ts`, and `index.ts` — a partial URL state layer is in place.
- **Configurator URL integration**: `src/components/configurator/ConfiguratorShell.tsx` and `src/components/charts/CreateChartWorkspace.tsx` already manipulate search params for step/type state.
- **Dataset params**: `src/app/[locale]/create/page.tsx` reads `dataset` and `resource` from search params.
- **Placeholder share UI**: `src/components/configurator/PreviewStep.tsx` uses `window.location.href` as a share URL placeholder with copy URL/embed actions.
- **Locale files**: `src/lib/i18n/locales/*/common.json` and `public/locales/*/common.json` have generic share labels but no dedicated share-dialog/state-error key set.
- **Missing**: No `/v/chart` route; no confirmed versioned payload schema; no share dialog component; no debounce+replaceState sync.

---

## Remaining Workstreams

### 1. Harden URL Codec (Versioned Payload)

**Files (existing)**: `src/lib/url/encode-state.ts`, `src/lib/url/decode-state.ts`, `src/lib/url/state-schema.ts`, `src/lib/url/index.ts`

1. Define a typed schema in `state-schema.ts`:
   - `version: number` (start at `1`)
   - `datasetId: string | null`
   - `resourceId: string | null`
   - `chartType: ChartType`
   - `filters: Record<string, unknown>` (active filters)
   - `appearance: { palette?: string; theme?: "light" | "dark" }`
   - Optional: `locale?: string`
2. Implement versioned encoding:
   - JSON-stringify the payload, compress (optional: base64 or LZ-string), produce a URL-safe string.
   - Ensure deterministic ordering for stable URLs.
3. Implement strict decoding:
   - Validate presence of `version` and required fields.
   - Reject unknown versions with a typed error (e.g., `DecodeError.UnsupportedVersion`).
   - Guard against malformed or oversized payloads; return typed errors (`DecodeError.InvalidPayload`, `DecodeError.TooLarge`).
4. Export `{ encodeChartState, decodeChartState, ChartStateSchema, DecodeError }` from `index.ts`.

### 2. Create Read-Only Route `/v/chart`

**Files (to add)**:
- `src/app/[locale]/v/chart/page.tsx`
- (Optional) `src/app/[locale]/v/chart/error.tsx`

1. Define route that reads `?s=<state>` search param.
2. SSR-safe decoding:
   - If `s` is missing or decoding fails, render error UI (localized) with message: invalid link / unsupported version.
   - On success, extract `datasetId`, `resourceId`, `chartType`, `filters`, `appearance`.
3. Fetch dataset/resource server-side (or client-side with suspense) using existing data-fetching hooks.
4. Render chart using existing chart component (e.g., `ChartRenderer` from configurator) in read-only mode:
   - Hide configurator sidebar.
   - Apply `appearance.theme` if provided; otherwise use system/default.
   - Pass `filters` to chart data processing.
5. Ensure route respects `locale` and i18n.

### 3. Share Dialog with Copyable URL

**Files (existing to modify)**:
- `src/components/configurator/PreviewStep.tsx`
- `src/lib/i18n/locales/en/common.json`, `src/lib/i18n/locales/sr/common.json` (and `public/locales/...` equivalents)
  
**Files (to add)**:
- `src/components/share/ShareDialog.tsx`
- `src/components/share/ShareDialog.module.css`

1. Extract share UI from `PreviewStep.tsx` into new `ShareDialog` component.
2. Share dialog features:
   - Input field with generated share URL (read-only).
   - Copy button with "Copied!" feedback (use `navigator.clipboard.writeText`).
   - Optional embed code textarea (`<iframe>` snippet).
   - Error state display if encoding fails.
3. URL generation:
   - Call `encodeChartState` with current configurator state.
   - Append encoded blob to `https://${host}/v/chart?s=${blob}`.
4. Integrate `ShareDialog` into `PreviewStep.tsx` via button that opens dialog (modal).
5. Add locale keys:
   - `share.title`, `share.copyLink`, `share.copied`, `share.embedCode`, `share.error`, `share.invalidState`.

### 4. Sync Configurator State to URL with Debounce + replaceState

**Files (existing)**: `src/components/configurator/ConfiguratorShell.tsx`, `src/components/charts/CreateChartWorkspace.tsx`

1. In `ConfiguratorShell.tsx`:
   - On configurator state change (chart type, filters, appearance), call a debounced handler (150-300ms).
   - Handler calls `encodeChartState`, then `history.replaceState` to update `?s=<state>` without navigation.
2. Ensure sync is skipped during initial render and when state is being restored from URL (avoid loop).
3. Preserve existing step/type params alongside new `s` param if they must coexist, or migrate entirely to state blob.
4. Handle edge cases: very long URLs (truncate or warn), SSR (no `history` object).

### 5. Error Handling & UX Polish

**Files (existing to modify)**:
- `src/app/[locale]/v/chart/page.tsx`
- Locale files as above

1. `/v/chart` error cases:
   - Missing `s` param → Show "Invalid or expired link".
   - Decode error → Show specific message (unsupported version, malformed).
   - Dataset fetch failure → Show "Dataset unavailable" with retry button.
2. Style error states consistently with app design system.
3. Add "Create your own chart" CTA link back to `/create`.

---

## Risks

- **URL length limits**: Large filter/annotation state may exceed browser/server URL limits (~2KB safe, 8KB risky). Mitigation: compress, exclude non-essential fields, or warn user.
- **State schema evolution**: New versions may break old links. Mitigation: Maintain backward-compatible decoders for N versions; display clear "unsupported version" message.
- **SSR/CSR mismatch**: Decoding on server vs client could diverge. Mitigation: Centralize decoding in a shared utility; ensure deterministic JSON serialization.
- **Privacy leakage**: State may encode dataset IDs or filter values that reveal sensitive info. Mitigation: Do not encode PII; document that URLs are shareable and not encrypted.
- **Locale/translation gaps**: New share dialog keys may not exist in all locales. Mitigation: Add keys to all locale files; fallback to English.

---

## Verification

1. **Unit tests**:
   - Codec roundtrip: `encodeChartState(decodeChartState(encodeChartState(state))) === state`.
   - Version rejection: Attempt to decode `{ version: 99 }` → `DecodeError.UnsupportedVersion`.
   - Malformed payload handling: Invalid base64, missing fields → appropriate errors.
2. **Integration tests**:
   - Configure chart → Open share dialog → Copy URL → Open in new tab → Chart renders identically.
   - Apply filters → Sync URL → Reload page → Filters persist.
3. **Manual QA**:
   - Test URLs across browsers (Chrome, Firefox, Safari, Edge).
   - Test on mobile devices (copy/paste, render).
   - Verify SSR: `/v/chart` renders server-side without `window is not defined` errors.
   - Verify long URL handling (add many filters; ensure no breakage).
4. **Accessibility**:
   - Share dialog is keyboard-navigable.
   - Screen reader announces "Copied" feedback.

---

## Complexity

**Medium-High**

- **Codec**: Low-Medium (straightforward with existing files, but versioning adds nuance).
- **Route + SSR**: Medium (requires careful handling of search params and data fetching).
- **Share Dialog**: Low (UI extraction, copy logic).
- **URL Sync with Debounce**: Medium (state management, edge cases).
- **Error Handling + i18n**: Medium (many cases, locale coverage).

Estimated effort: 2–3 days for core implementation + 1 day for polish and testing.
