# Embed Builder QA Fixes Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to
> implement this plan task-by-task.

**Goal:** Fix embed builder UX issues - layout options not reflecting in
generated code, and parameter propagation inconsistencies.

**Architecture:** Direct fixes in 2 existing files - add `optimizeSpace`
handling to snippet builder and pass it from the embed page.

**Tech Stack:** React, Next.js, TypeScript, Vitest

---

## Problem Statement

### Issue 1: Layout Options UX Mismatch

- **Remove border:** Working correctly - toggling changes border style in
  generated code
- **Optimize space:** Adds `optimizeSpace=true` to params but iframe height
  stays at default 520px, so the option appears to do nothing

### Issue 2: Parameter Propagation Inconsistency

- `dataSource` sometimes missing from generated embed URL after editing inputs
- Likely a state update timing bug in parameter generation

---

## Tasks

### Task 1: Add optimizeSpace test to embed-generator

**Files:**

- Modify: `app/__tests__/unit/embed-generator.test.ts`

**Step 1: Add test for optimizeSpace height reduction**

Add a new test case after the existing `buildIframeSnippet` tests:

```ts
it("reduces height when optimizeSpace is true and height is default", () => {
  // With optimizeSpace=true and default height, should reduce to 320px
  expect(
    buildIframeSnippet({
      iframeSrc: "https://example.com/embed/demo?type=bar",
      width: "100%",
      height: "520px",
      removeBorder: false,
      optimizeSpace: true,
    })
  ).toContain("height: 320px");

  // With optimizeSpace=false, should keep original height
  expect(
    buildIframeSnippet({
      iframeSrc: "https://example.com/embed/demo?type=bar",
      width: "100%",
      height: "520px",
      removeBorder: false,
      optimizeSpace: false,
    })
  ).toContain("height: 520px");

  // With optimizeSpace=true but custom height, should keep custom height
  expect(
    buildIframeSnippet({
      iframeSrc: "https://example.com/embed/demo?type=bar",
      width: "100%",
      height: "720px",
      removeBorder: false,
      optimizeSpace: true,
    })
  ).toContain("height: 720px");
});
```

**Step 2: Run test to verify it fails**

Run:
`cd /home/nistrator/Documents/github/vizualni-admin && yarn vitest run app/__tests__/unit/embed-generator.test.ts`
Expected: FAIL - `optimizeSpace` property does not exist on type

**Step 3: Commit**

```bash
git add app/__tests__/unit/embed-generator.test.ts
git commit -m "test: add failing test for optimizeSpace height reduction"
```

---

### Task 2: Implement optimizeSpace in buildIframeSnippet

**Files:**

- Modify: `app/lib/embed-generator.ts:110-131`

**Step 1: Add optimizeSpace parameter to buildIframeSnippet**

Update the function signature and implementation:

```ts
export const buildIframeSnippet = ({
  iframeSrc,
  width,
  height,
  removeBorder,
  optimizeSpace,
}: {
  iframeSrc: string;
  width: string;
  height: string;
  removeBorder: boolean;
  optimizeSpace: boolean;
}) => {
  const borderStyle = removeBorder
    ? "border: 0;"
    : "border: 1px solid rgba(15, 23, 42, 0.16);";

  // Reduce height when optimizeSpace is true and height is the default
  const effectiveHeight =
    optimizeSpace && height === "520px" ? "320px" : height;

  return `<iframe
  src="${iframeSrc}"
  style="width: ${width}; height: ${effectiveHeight}; ${borderStyle}"
  loading="lazy"
  referrerpolicy="no-referrer"
></iframe>`;
};
```

**Step 2: Run test to verify it passes**

Run:
`cd /home/nistrator/Documents/github/vizualni-admin && yarn vitest run app/__tests__/unit/embed-generator.test.ts`
Expected: PASS

**Step 3: Commit**

```bash
git add app/lib/embed-generator.ts
git commit -m "feat: add optimizeSpace height reduction to buildIframeSnippet"
```

---

### Task 3: Pass optimizeSpace from embed page

**Files:**

- Modify: `app/pages/embed/index.tsx:253-267`

**Step 1: Update iframeSnippet useMemo to pass optimizeSpace**

Update the `iframeSnippet` useMemo from:

```ts
const iframeSnippet = useMemo(
  () =>
    buildIframeSnippet({
      iframeSrc,
      width: effectiveWidth,
      height: effectiveHeight,
      removeBorder: effectiveLayoutParams.removeBorder,
    }),
  [
    effectiveHeight,
    effectiveLayoutParams.removeBorder,
    effectiveWidth,
    iframeSrc,
  ]
);
```

To:

```ts
const iframeSnippet = useMemo(
  () =>
    buildIframeSnippet({
      iframeSrc,
      width: effectiveWidth,
      height: effectiveHeight,
      removeBorder: effectiveLayoutParams.removeBorder,
      optimizeSpace: effectiveLayoutParams.optimizeSpace,
    }),
  [
    effectiveHeight,
    effectiveLayoutParams.optimizeSpace,
    effectiveLayoutParams.removeBorder,
    effectiveWidth,
    iframeSrc,
  ]
);
```

**Step 2: Run type check**

Run: `cd /home/nistrator/Documents/github/vizualni-admin && npx tsc --noEmit`
Expected: No errors

**Step 3: Run all embed-related tests**

Run:
`cd /home/nistrator/Documents/github/vizualni-admin && yarn vitest run app/__tests__/unit/embed-generator.test.ts`
Expected: PASS

**Step 4: Commit**

```bash
git add app/pages/embed/index.tsx
git commit -m "fix: pass optimizeSpace to buildIframeSnippet for height reduction"
```

---

### Task 4: Final verification

**Step 1: Run full test suite**

Run: `cd /home/nistrator/Documents/github/vizualni-admin && yarn vitest run`
Expected: All tests pass

**Step 2: Type check**

Run: `cd /home/nistrator/Documents/github/vizualni-admin && npx tsc --noEmit`
Expected: No errors

**Step 3: Commit any remaining changes**

```bash
git status
# If any uncommitted changes:
git add -A && git commit -m "fix: embed builder layout options QA fixes"
```

---

## Verification Checklist

- [ ] `optimizeSpace=true` reduces iframe height from 520px to 320px in
      generated code
- [ ] `optimizeSpace=true` with custom height preserves custom height
- [ ] `optimizeSpace=false` keeps default 520px height
- [ ] All existing tests pass
- [ ] TypeScript compiles without errors
