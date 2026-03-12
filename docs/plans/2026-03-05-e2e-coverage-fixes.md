# E2E Test Coverage for Recent Fixes - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to
> implement this plan task-by-task.

**Goal:** Add E2E tests to cover new embed datasets and locale handling fixes
from the last 4 hours.

**Architecture:** Add tests to existing `e2e/public-pages.live.spec.ts`
organized with `test.describe()` groups for "Embed datasets" and "Locale/i18n".

**Tech Stack:** Playwright, TypeScript, Next.js i18n routing

---

## Task 1: Add Embed Dataset Tests

**Files:**

- Modify: `e2e/public-pages.live.spec.ts` (add tests after line 319)

**Step 1: Add test.describe block for embed datasets**

Add this after the existing "embed preview shows fallback" test (around line
319):

```typescript
test.describe("Embed datasets", () => {
  test("embed preview with air dataset renders line chart", async ({
    page,
  }) => {
    await page.goto(
      withPrefix(
        "/embed/demo?type=line&dataset=air&dataSource=Prod&theme=light&lang=en"
      )
    );

    // Wait for chart to render
    await expect(page.getByText(/Dataset:\s*air/)).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText(/Source:\s*Prod/)).toBeVisible();

    // Verify line chart renders (SVG)
    await expect(page.locator("svg").first()).toBeVisible({ timeout: 10_000 });
  });

  test("embed preview with students dataset renders bar chart", async ({
    page,
  }) => {
    await page.goto(
      withPrefix(
        "/embed/demo?type=bar&dataset=students&dataSource=Prod&theme=light&lang=en"
      )
    );

    // Wait for chart to render
    await expect(page.getByText(/Dataset:\s*students/)).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText(/Source:\s*Prod/)).toBeVisible();

    // Verify bar chart renders (SVG)
    await expect(page.locator("svg").first()).toBeVisible({ timeout: 10_000 });
  });
});
```

**Step 2: Run tests to verify they pass**

Run:
`npx playwright test e2e/public-pages.live.spec.ts --grep "Embed datasets" --project=chromium`
Expected: 2 tests PASS

**Step 3: Commit**

```bash
git add e2e/public-pages.live.spec.ts
git commit -m "test: add E2E tests for air and students datasets"
```

---

## Task 2: Add Locale/i18n Tests

**Files:**

- Modify: `e2e/public-pages.live.spec.ts` (add tests after Task 1)

**Step 1: Add test.describe block for locale tests**

Add this after the embed datasets tests:

```typescript
test.describe("Locale/i18n", () => {
  test("topics page with sr-Cyrl locale shows Cyrillic script", async ({
    page,
  }) => {
    // Navigate with sr-Cyrl locale prefix
    await page.goto(withPrefix("/sr-Cyrl/topics/environment?dataSource=Prod"));

    await expect(page.locator("h1").first()).toBeVisible({ timeout: 15_000 });

    // Verify Cyrillic characters are present in the heading
    const headingText = await page.locator("h1").first().innerText();
    expect(headingText).toMatch(/[А-Яа-яЉЊЋЏЂЈ]/);
  });

  test("dataset cards show correct locale labels for sr-Latn", async ({
    page,
  }) => {
    // Default locale is sr-Latn
    await page.goto(withDataSource("/topics/environment"));

    // Verify "Ažurirano:" label (Latin script, not English or Cyrillic)
    const updatedLine = page.getByTestId("dataset-updated").first();
    await expect(updatedLine).toBeVisible({ timeout: 15_000 });

    const updatedText = await updatedLine.innerText();
    // Should contain "Ažurirano:" (Latin) not "Updated:" (English) or "Ажурирано:" (Cyrillic)
    expect(updatedText).toContain("Ažurirano:");
    expect(updatedText).not.toContain("Updated:");
    expect(updatedText).not.toContain("Ажурирано:");
  });

  test("dataset cards show correct locale labels for sr-Cyrl", async ({
    page,
  }) => {
    await page.goto(withPrefix("/sr-Cyrl/topics/environment?dataSource=Prod"));

    // Verify "Ажурирано:" label (Cyrillic script)
    const updatedLine = page.getByTestId("dataset-updated").first();
    await expect(updatedLine).toBeVisible({ timeout: 15_000 });

    const updatedText = await updatedLine.innerText();
    // Should contain "Ажурирано:" (Cyrillic) not "Updated:" (English) or "Ažurirano:" (Latin)
    expect(updatedText).toContain("Ажурирано:");
    expect(updatedText).not.toContain("Updated:");
    expect(updatedText).not.toContain("Ažurirano:");
  });
});
```

**Step 2: Run tests to verify they pass**

Run:
`npx playwright test e2e/public-pages.live.spec.ts --grep "Locale" --project=chromium`
Expected: 3 tests PASS

**Step 3: Commit**

```bash
git add e2e/public-pages.live.spec.ts
git commit -m "test: add E2E tests for locale handling (sr-Latn/sr-Cyrl)"
```

---

## Task 3: Run Full Test Suite and Final Commit

**Step 1: Run all public-pages tests**

Run: `npx playwright test e2e/public-pages.live.spec.ts --project=chromium`
Expected: All tests PASS (should be 18 total now)

**Step 2: Verify test count**

The file should now have:

- 13 existing tests
- 2 new embed dataset tests
- 3 new locale tests
- **Total: 18 tests**

**Step 3: Push changes**

```bash
git push
```

---

## Summary

| Task      | Tests Added | Coverage                                                  |
| --------- | ----------- | --------------------------------------------------------- |
| 1         | 2           | Embed datasets (air, students) with different chart types |
| 2         | 3           | Locale handling (sr-Latn, sr-Cyrl) on dataset cards       |
| 3         | -           | Verification and push                                     |
| **Total** | **5**       |                                                           |
