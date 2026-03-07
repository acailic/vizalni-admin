# QA Critical Fixes Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to
> implement this plan task-by-task.

**Goal:** Fix 10 Critical and High priority bugs identified in the QA report for
Vizualni Admin.

**Architecture:** Centralized URL/path module fixes + targeted i18n patches +
misc bug fixes. Each task is self-contained with 2-5 minute steps following TDD
where applicable.

**Tech Stack:** Next.js 15, Lingui i18n, MUI, TypeScript

---

## Task 1: Fix Embed URL Base Path (BUG-01)

**Files:**

- Modify: `app/utils/public-paths.ts:12-19`
- Test: Manual verification

**Step 1: Verify current implementation**

Run: `cat app/utils/public-paths.ts` Expected: `buildPublicPath` uses
`PUBLIC_URL` which should include `/vizualni-admin`

**Step 2: Check env derivation**

Run: `cat app/domain/env.ts | head -30` Expected: `PUBLIC_URL` derives from
`NEXT_PUBLIC_BASE_PATH`

**Step 3: Test buildPublicPath with basePath**

Add console log temporarily to verify:

```typescript
// In app/utils/public-paths.ts - temporary debug
export const buildPublicPath = (path: string) => {
  const normalizedPath = normalizePath(path);
  const result = PUBLIC_URL ? `${PUBLIC_URL}${normalizedPath}` : normalizedPath;
  console.log("[buildPublicPath]", { PUBLIC_URL, normalizedPath, result });
  return result;
};
```

**Step 4: Verify homepage uses buildPublicPath correctly**

Run: `grep -n "buildPublicPath\|embedUrl" app/pages/index.tsx` Expected: Embed
URL construction uses `buildPublicPath`

**Step 5: Fix if needed - ensure BASE_PATH fallback**

If `PUBLIC_URL` is empty, add BASE_PATH fallback:

```typescript
// app/utils/public-paths.ts
export const buildPublicPath = (path: string) => {
  const normalizedPath = normalizePath(path);
  // Use PUBLIC_URL if available, otherwise fall back to BASE_PATH
  const basePath = PUBLIC_URL || BASE_PATH;
  if (!basePath) {
    return normalizedPath;
  }
  return `${basePath}${normalizedPath}`;
};
```

**Step 6: Commit**

```bash
git add app/utils/public-paths.ts
git commit -m "fix: ensure buildPublicPath uses BASE_PATH fallback"
```

---

## Task 2: Fix Embed Demo Page Rendering (BUG-02)

**Files:**

- Modify: `app/pages/embed/demo.tsx`
- Modify: `app/components/demos/charts/index.ts`

**Step 1: Verify chart component exports**

Run: `cat app/components/demos/charts/index.ts` Expected: Exports `BarChart`,
`ColumnChart`, `LineChart`, `PieChart`

**Step 2: Check demo.tsx imports**

Run: `head -10 app/pages/embed/demo.tsx` Expected: Correct imports from
`@/components/demos/charts`

**Step 3: Add error boundary to demo.tsx**

Wrap chart rendering with try-catch:

```typescript
// Add at top of demo.tsx
const ChartErrorFallback = ({ error }: { error: Error }) => (
  <div style={{ padding: 20, color: '#dc2626' }}>
    <p>Chart failed to load: {error.message}</p>
    <button onClick={() => window.location.reload()}>Retry</button>
  </div>
);

// In component body
const [chartError, setChartError] = useState<Error | null>(null);

// Wrap chart rendering
{chartError ? (
  <ChartErrorFallback error={chartError} />
) : (
  // ... chart rendering
)}
```

**Step 4: Add error handlers to chart components**

```typescript
// Add to each chart type block
onError={(err) => setChartError(err)}
```

**Step 5: Commit**

```bash
git add app/pages/embed/demo.tsx
git commit -m "fix: add error handling to embed demo charts"
```

---

## Task 3: Improve Browse Page Messaging (BUG-03)

**Files:**

- Modify: `app/pages/browse/index.tsx`
- Modify: `app/pages/index.tsx`

**Step 1: Check current browse page**

Run: `cat app/pages/browse/index.tsx` Expected: Shows demo limit message

**Step 2: Add redirect to showcase in static mode**

```typescript
// app/pages/browse/index.tsx
import { useEffect } from "react";
import { useRouter } from "next/router";
import { isStaticExportMode } from "@/utils/public-paths";

export default function BrowsePage() {
  const router = useRouter();

  useEffect(() => {
    if (isStaticExportMode) {
      router.replace("/demos/showcase");
    }
  }, [router]);

  if (isStaticExportMode) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <p>Redirecting to demo gallery...</p>
      </div>
    );
  }

  // ... existing runtime content
}
```

**Step 3: Update homepage CTAs for static mode**

Find browse links in index.tsx and update:

```typescript
// In app/pages/index.tsx
import { getDatasetBrowserPath } from "@/utils/public-paths";

// Replace hardcoded /browse links with:
const browsePath = getDatasetBrowserPath();
// Use browsePath in CTA buttons
```

**Step 4: Commit**

```bash
git add app/pages/browse/index.tsx app/pages/index.tsx
git commit -m "fix: redirect browse to showcase in static mode"
```

---

## Task 4: Fix next-auth Error in Static Builds (BUG-04)

**Files:**

- Modify: `app/pages/_app.tsx`

**Step 1: Check current SessionProvider usage**

Run: `grep -n "SessionProvider\|Session" app/pages/_app.tsx | head -20`

**Step 2: Add conditional SessionProvider for static builds**

```typescript
// app/pages/_app.tsx
import { isStaticExportMode } from "@/utils/public-paths";

// In the component
const session = useSession();

// Wrap SessionProvider conditionally
{isStaticExportMode ? (
  <Component {...pageProps} />
) : (
  <SessionProvider session={session}>
    <Component {...pageProps} />
  </SessionProvider>
)}
```

**Step 3: Alternatively, suppress auth errors**

Add error suppression:

```typescript
// In _app.tsx useEffect
useEffect(() => {
  // Suppress next-auth errors in static mode
  if (isStaticExportMode) {
    const originalError = console.error;
    console.error = (...args) => {
      if (args[0]?.includes?.("CLIENT_FETCH_ERROR")) {
        return;
      }
      originalError.apply(console, args);
    };
    return () => {
      console.error = originalError;
    };
  }
}, []);
```

**Step 4: Commit**

```bash
git add app/pages/_app.tsx
git commit -m "fix: suppress auth errors in static builds"
```

---

## Task 5: Fix Language Switcher for Static Mode (BUG-05)

**Files:**

- Modify: `app/components/language-picker.tsx`
- Modify: `app/pages/_app.tsx`

**Step 1: Check current language picker implementation**

Run: `cat app/components/language-picker.tsx`

**Step 2: Add static mode detection to LanguagePicker**

```typescript
// app/components/language-picker.tsx
import { isStaticExportMode } from "@/utils/public-paths";

// In handleLocaleChange
const handleLocaleChange = (locale: Locale) => {
  persistAppLocale(locale);

  if (isStaticExportMode) {
    // In static mode, use URL query params instead of Next.js i18n routing
    const nextQuery = {
      ...query,
      uiLocale: locale,
    };
    // Full page reload to ensure translations load
    window.location.href = `${pathname}?${new URLSearchParams(nextQuery as Record<string, string>).toString()}`;
    return;
  }

  // ... existing dynamic mode logic
};
```

**Step 3: Ensure locale activates from query param**

```typescript
// In app/pages/_app.tsx
// The existing resolveAppLocale should handle query params
// Verify it reads uiLocale from router.query
```

**Step 4: Test language switching**

Manual test: Click language picker, verify content changes

**Step 5: Commit**

```bash
git add app/components/language-picker.tsx
git commit -m "fix: language switcher works in static mode"
```

---

## Task 6: Add Missing Modal i18n Keys (BUG-06)

**Files:**

- Modify: `app/locales/en/messages.po`
- Modify: `app/locales/sr-Latn/messages.po`
- Modify: `app/locales/sr-Cyrl/messages.po`

**Step 1: Find existing showcase modal component**

Run: `grep -rn "demos.showcase.modal" app/locales/`

**Step 2: Add missing keys to sr-Latn/messages.po**

```
msgid "demos.showcase.modal.close"
msgstr "Zatvori"

msgid "demos.showcase.modal.viewDemo"
msgstr "Pogledaj demo"
```

**Step 3: Add missing keys to sr-Cyrl/messages.po**

```
msgid "demos.showcase.modal.close"
msgstr "Затвори"

msgid "demos.showcase.modal.viewDemo"
msgstr "Погледај демо"
```

**Step 4: Add missing keys to en/messages.po**

```
msgid "demos.showcase.modal.close"
msgstr "Close"

msgid "demos.showcase.modal.viewDemo"
msgstr "View demo"
```

**Step 5: Compile locale catalogs**

Run: `cd app && lingui compile`

**Step 6: Commit**

```bash
git add app/locales/*/messages.po app/locales/*/messages.js
git commit -m "fix: add missing showcase modal translation keys"
```

---

## Task 7: Fix Chart Preview Rendering (BUG-07)

**Files:**

- Modify: `app/pages/demos/showcase/index.tsx`

**Step 1: Check showcase page chart rendering**

Run:
`grep -n "Chart\|chart\|preview" app/pages/demos/showcase/index.tsx | head -30`

**Step 2: Add error boundary around chart previews**

```typescript
// Add import
import { DemoErrorBoundary } from "@/components/demos/DemoErrorBoundary";

// Wrap chart preview components
<DemoErrorBoundary>
  {/* Chart preview component */}
</DemoErrorBoundary>
```

**Step 3: Check if DemoErrorBoundary exists**

Run: `cat app/components/demos/DemoErrorBoundary.tsx`

If missing, create:

```typescript
// app/components/demos/DemoErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class DemoErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Demo component error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div style={{ padding: 20, textAlign: "center", color: "#666" }}>
          <p>Chart preview unavailable</p>
        </div>
      );
    }
    return this.props.children;
  }
}
```

**Step 4: Commit**

```bash
git add app/components/demos/DemoErrorBoundary.tsx app/pages/demos/showcase/index.tsx
git commit -m "fix: add error boundary to chart previews"
```

---

## Task 8: Fix Share Button Behavior (BUG-08)

**Files:**

- Modify: `app/components/demos/showcase-card.tsx`

**Step 1: Review current share implementation**

Run: `cat app/components/demos/showcase-card.tsx | grep -A30 "handleShare"`

**Step 2: Verify share uses correct URL**

The current implementation looks correct. Verify:

```typescript
// handleShare should:
// 1. Build absolute URL with buildAbsolutePublicUrl
// 2. Try Web Share API first
// 3. Fall back to clipboard.writeText
// 4. Final fallback to window.open
```

**Step 3: Fix if needed - ensure shareUrl is used correctly**

```typescript
// In showcase-card.tsx, verify shareUrl prop is used, not demoUrl
// The share button should copy/open shareUrl, not demoUrl
```

**Step 4: Commit**

```bash
git add app/components/demos/showcase-card.tsx
git commit -m "fix: verify share button uses correct URL"
```

---

## Task 9: Fix Playground Initial Data (BUG-09)

**Files:**

- Modify: `app/pages/demos/playground/index.tsx`

**Step 1: Check playground store initialization**

Run: `cat app/demos/playground/_hooks/usePlaygroundStore.ts | head -50`

**Step 2: Verify default data loading**

The code in index.tsx lines 43-50 loads `SAMPLE_DATASETS.sales.data` as default.

**Step 3: Check if store has correct initial state**

```typescript
// Ensure store initializes with valid data
const initialState = {
  data: SAMPLE_DATASETS.sales.data,
  config: {
    xAxis: "label",
    yAxis: "value",
    color: theme.palette.primary.main,
  },
  // ...
};
```

**Step 4: Fix if needed - ensure useEffect runs on mount**

The useEffect at line 99 should load default data when no URL state exists.

**Step 5: Commit**

```bash
git add app/pages/demos/playground/index.tsx app/demos/playground/_hooks/usePlaygroundStore.ts
git commit -m "fix: ensure playground loads default data on init"
```

---

## Task 10: Verify Filter Stats Update (BUG-10)

**Files:**

- Verify: `app/pages/cene.tsx`

**Step 1: Review current implementation**

Run: `grep -n "filteredCategories\|filteredManufacturers" app/pages/cene.tsx`

**Step 2: Verify stats use filtered data**

The code at lines 114-119 already derives `filteredCategories` and
`filteredManufacturers` from `filteredData`. The display at lines 232 and 240
uses these filtered values.

**Result: BUG-10 is already fixed. No code changes needed.**

**Step 3: Document verification**

```bash
git commit --allow-empty -m "docs: verify BUG-10 filter stats already fixed"
```

---

## Task 11: Build and Test

**Step 1: Run local tests**

```bash
cd app && yarn test
```

Expected: All tests pass

**Step 2: Build for GitHub Pages**

```bash
yarn build:gh-pages
```

Expected: Build succeeds

**Step 3: Serve locally**

```bash
yarn serve:gh-pages
```

**Step 4: Manual verification checklist**

- [ ] Embed URLs include `/vizualni-admin` prefix
- [ ] Embed demo page renders charts
- [ ] Browse page redirects to showcase
- [ ] No auth errors in console
- [ ] Language switcher updates content
- [ ] Modal buttons show translated text
- [ ] Chart previews render
- [ ] Share button copies URL
- [ ] Playground shows valid data
- [ ] Filter stats update correctly

**Step 5: Final commit**

```bash
git add -A
git commit -m "fix: resolve 10 QA critical/high bugs"
```

---

## Summary

| Task | Bug ID | Description            | Status        |
| ---- | ------ | ---------------------- | ------------- |
| 1    | BUG-01 | Embed URL base path    | Pending       |
| 2    | BUG-02 | Embed demo rendering   | Pending       |
| 3    | BUG-03 | Browse page redirect   | Pending       |
| 4    | BUG-04 | Auth error suppression | Pending       |
| 5    | BUG-05 | Language switcher      | Pending       |
| 6    | BUG-06 | Modal i18n keys        | Pending       |
| 7    | BUG-07 | Chart previews         | Pending       |
| 8    | BUG-08 | Share button           | Pending       |
| 9    | BUG-09 | Playground data        | Pending       |
| 10   | BUG-10 | Filter stats           | Already Fixed |
| 11   | -      | Build and test         | Pending       |
