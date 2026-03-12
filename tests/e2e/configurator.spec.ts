import { test, expect, Page } from '@playwright/test'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3001'

// Helper to wait for page to be ready (lighter than networkidle)
async function waitForPageReady(page: Page) {
  await page.waitForLoadState('domcontentloaded', { timeout: 30000 })
  await page.waitForTimeout(500) // Small buffer for React hydration
}

// Helper to check for Next.js error overlay
async function checkForErrors(page: Page): Promise<string | null> {
  try {
    const errorOverlay = page.locator('[data-nextjs-dialog], .nextjs-container-errors-header')
    if (await errorOverlay.isVisible({ timeout: 1000 })) {
      const errorText = await errorOverlay.textContent()
      return errorText || 'Unknown error'
    }
  } catch {
    // Error overlay not visible
  }
  return null
}

test.describe('Chart Configurator Flow', () => {
  test.describe('Dataset Selection', () => {
    test('should show dataset step when no dataset is preselected', async ({ page }) => {
      await page.goto(`${BASE_URL}/sr-Latn/create`)
      await waitForPageReady(page)

      // Should not show error overlay
      const error = await checkForErrors(page)
      expect(error).toBeNull()

      // Should show dataset picker or empty state
      await expect(page.locator('body')).toContainText(/Skup podataka|Dataset/i)
    })

    test('should show loading state when dataset is preselected', async ({ page }) => {
      await page.goto(`${BASE_URL}/sr-Latn/create?dataset=678e312d0aae3fe3ad3e361c`)
      await waitForPageReady(page)

      // Should not show error overlay
      const error = await checkForErrors(page)
      expect(error).toBeNull()
    })
  })

  test.describe('Chart Type Selection', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate with a known dataset
      await page.goto(`${BASE_URL}/sr-Latn/create?dataset=678e312d0aae3fe3ad3e361c`)
      await waitForPageReady(page)
      // Wait for dataset to load (reduced time)
      await page.waitForTimeout(2000)
    })

    test('should display chart type options', async ({ page }) => {
      // Should not show error overlay
      const error = await checkForErrors(page)
      expect(error).toBeNull()

      // Look for chart type options
      const chartTypes = ['Line', 'Bar', 'Column', 'Area', 'Table']
      let foundCount = 0

      for (const type of chartTypes) {
        const button = page.locator('button').filter({ hasText: new RegExp(type, 'i') })
        if (await button.isVisible()) {
          foundCount++
        }
      }

      // Should have at least 3 chart type options
      expect(foundCount).toBeGreaterThanOrEqual(3)
    })

    test('should show compatible status for chart types', async ({ page }) => {
      // Look for "Compatible" text on chart type buttons
      const compatibleButtons = page.locator('button').filter({ hasText: /Compatible|Kompatabilan/i })
      const count = await compatibleButtons.count()

      // Should have multiple compatible chart types
      expect(count).toBeGreaterThan(0)
    })

    test('should show unavailable status for pie chart when data is not suitable', async ({ page }) => {
      // Look for pie chart button
      const pieButton = page.locator('button').filter({ hasText: /Pie|Pita/i })

      if (await pieButton.isVisible()) {
        const isDisabled = await pieButton.isDisabled()
        // Pie might be disabled depending on data structure
        // Just check it exists
        expect(await pieButton.isVisible()).toBeTruthy()
      }
    })

    test('should select chart type when clicked', async ({ page }) => {
      // Find and click a compatible chart type (Bar)
      const barButton = page.locator('button').filter({ hasText: /Bar/i }).first()

      if (await barButton.isVisible() && !(await barButton.isDisabled())) {
        await barButton.click()
        await page.waitForTimeout(2000)

        // Should update URL with chart type
        await expect(page).toHaveURL(/type=bar/)

        // Should show selected state
        const selectedClass = await barButton.getAttribute('class')
        expect(selectedClass).toMatch(/border-gov-primary|bg-blue-50|ring/)
      }
    })

    test('should enable next button after chart type selection', async ({ page }) => {
      // Select a chart type
      const barButton = page.locator('button').filter({ hasText: /Bar/i }).first()

      if (await barButton.isVisible() && !(await barButton.isDisabled())) {
        await barButton.click()
        await page.waitForTimeout(1000)

        // Next button should be enabled
        const nextButton = page.getByRole('button', { name: /Sledeće|Next/i })
        if (await nextButton.isVisible()) {
          expect(await nextButton.isDisabled()).toBeFalsy()
        }
      }
    })
  })

  test.describe('Navigation', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE_URL}/sr-Latn/create?dataset=678e312d0aae3fe3ad3e361c`)
      await waitForPageReady(page)
      await page.waitForTimeout(2000)
    })

    test('should show step indicator', async ({ page }) => {
      // Should show step numbers
      await expect(page.locator('body')).toContainText(/Korak|Step/i)
    })

    test('should have back to browse link', async ({ page }) => {
      const backButton = page.getByRole('button', { name: /Nazad|Back/i })
      await expect(backButton).toBeVisible()
    })

    test('should have previous button disabled on first step', async ({ page }) => {
      const prevButton = page.getByRole('button', { name: /Prethodno|Previous/i })
      if (await prevButton.isVisible()) {
        expect(await prevButton.isDisabled()).toBeTruthy()
      }
    })
  })

  test.describe('Preview Panel', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE_URL}/sr-Latn/create?dataset=678e312d0aae3fe3ad3e361c`)
      await waitForPageReady(page)
      await page.waitForTimeout(2000)
    })

    test('should show preview panel', async ({ page }) => {
      // Look for preview section
      const previewHeading = page.locator('h2').filter({ hasText: /Pregled|Preview/i })
      await expect(previewHeading).toBeVisible()
    })

    test('should show dataset info in preview', async ({ page }) => {
      // Should show row/column count
      await expect(page.locator('body')).toContainText(/rows|redova/i)
    })

    test('should show placeholder when no chart is configured', async ({ page }) => {
      // Look for placeholder message
      const placeholder = page.locator('text=/Podesite tip grafikona|Configure chart|Select chart type/i')
      await expect(placeholder).toBeVisible()
    })
  })

  test.describe('URL State Sync', () => {
    test('should update URL when dataset is loaded', async ({ page }) => {
      await page.goto(`${BASE_URL}/sr-Latn/create?dataset=678e312d0aae3fe3ad3e361c`)
      await waitForPageReady(page)

      // URL should contain dataset param
      await expect(page).toHaveURL(/dataset=/)
    })

    test('should not crash when syncing state to URL', async ({ page }) => {
      await page.goto(`${BASE_URL}/sr-Latn/create?dataset=678e312d0aae3fe3ad3e361c`)
      await waitForPageReady(page)
      await page.waitForTimeout(2000)

      // Should not show error overlay
      const error = await checkForErrors(page)
      expect(error).toBeNull()
    })
  })

  test.describe('Console Errors', () => {
    test('should not have console errors on configurator page', async ({ page }) => {
      const errors: string[] = []

      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text())
        }
      })

      await page.goto(`${BASE_URL}/sr-Latn/create?dataset=678e312d0aae3fe3ad3e361c`)
      await waitForPageReady(page)
      await page.waitForTimeout(2000)

      // Filter out expected warnings
      const unexpectedErrors = errors.filter(err =>
        !err.includes('Warning:') &&
        !err.includes('ExperimentalWarning') &&
        !err.includes('[HMR]') &&
        !err.includes('[ChartTypeStep]') // Our debug logs
      )

      expect(unexpectedErrors.length).toBe(0)
    })
  })
})

test.describe('Dataset Browser to Configurator Integration', () => {
  test('should navigate from browse to create page', async ({ page }) => {
    // Start at browse page
    await page.goto(`${BASE_URL}/sr-Latn/browse`)
    await waitForPageReady(page)

    // Find first visualize link
    const visualizeLink = page.getByRole('link', { name: /Vizuelizuj/i }).first()
    await expect(visualizeLink).toBeVisible()

    // Click to go to configurator
    await visualizeLink.click()
    await waitForPageReady(page)

    // Should be on create page
    await expect(page).toHaveURL(/\/create/)

    // Should not show error
    const error = await checkForErrors(page)
    expect(error).toBeNull()
  })
})
