import { test, expect, Page } from '@playwright/test'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3001'

// Helper to wait for page to be ready
async function waitForPageReady(page: Page) {
  await page.waitForLoadState('domcontentloaded', { timeout: 30000 })
  await page.waitForTimeout(1000)
}

test.describe('Vizuelni Admin Srbije - Integration Tests', () => {
  test.describe('Homepage', () => {
    test('should load homepage with Serbian Latin locale', async ({ page }) => {
      await page.goto(`${BASE_URL}/sr-Latn`)
      await waitForPageReady(page)

      // Check title
      await expect(page).toHaveTitle(/Визуелни Администратор Србије|Visual Admin Serbia/)

      // Check main heading
      await expect(page.locator('h1')).toContainText('Pregledaj skupove podataka')

      // Check CTA buttons exist
      await expect(page.getByRole('link', { name: /Pregledaj/i })).toBeVisible()
    })

    test('should load homepage with English locale', async ({ page }) => {
      await page.goto(`${BASE_URL}/en`)
      await waitForPageReady(page)

      await expect(page.locator('h1')).toContainText('Browse Datasets')
    })

    test('should load homepage with Serbian Cyrillic locale', async ({ page }) => {
      await page.goto(`${BASE_URL}/sr-Cyrl`)
      await waitForPageReady(page)

      // Check for Cyrillic text
      await expect(page.locator('body')).toContainText('Прегледај')
    })
  })

  test.describe('Browse Datasets', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE_URL}/sr-Latn/browse`)
      await waitForPageReady(page)
    })

    test('should display dataset list', async ({ page }) => {
      // Check for dataset count
      await expect(page.locator('body')).toContainText('Pronađeno', { timeout: 15000 })
    })

    test('should filter by search query', async ({ page }) => {
      const searchInput = page.locator('input[type="search"], input[placeholder*="Pretražite"]')
      await searchInput.fill('statistika')
      await page.keyboard.press('Enter')
      await page.waitForTimeout(2000)

      // Should show results
      await expect(page.locator('body')).toContainText('Pronađeno')
    })
  })

  test.describe('Charts Gallery', () => {
    test('should display charts gallery page', async ({ page }) => {
      await page.goto(`${BASE_URL}/sr-Latn/charts`)
      await waitForPageReady(page)

      // Check for gallery content
      await expect(page.locator('h1, h2').first()).toBeVisible()
    })
  })

  test.describe('Login Page', () => {
    test('should display login form', async ({ page }) => {
      await page.goto(`${BASE_URL}/sr-Latn/login`)
      await waitForPageReady(page)

      // Check for OAuth buttons
      await expect(page.getByRole('button', { name: /GitHub/i })).toBeVisible()
      await expect(page.getByRole('button', { name: /Google/i })).toBeVisible()

      // Check for email/password fields
      await expect(page.locator('input[type="email"]')).toBeVisible()
      await expect(page.locator('input[type="password"]')).toBeVisible()
    })
  })

  test.describe('Accessibility Page', () => {
    test('should display accessibility statement', async ({ page }) => {
      await page.goto(`${BASE_URL}/sr-Latn/accessibility`)
      await waitForPageReady(page)

      // Check for WCAG mention
      await expect(page.locator('body')).toContainText('WCAG')
    })
  })

  test.describe('API Endpoints', () => {
    test('should return browse API data', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/browse?page=1&limit=5`)
      expect(response.ok()).toBeTruthy()

      const data = await response.json()
      expect(data).toHaveProperty('data')
      expect(Array.isArray(data.data)).toBeTruthy()
    })

    test('should return dataset count', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/browse?page=1&limit=1`)
      expect(response.ok()).toBeTruthy()

      const data = await response.json()
      expect(data.total).toBeGreaterThan(3000)
    })
  })

  test.describe('Error Handling', () => {
    test('should handle 404 pages gracefully', async ({ page }) => {
      await page.goto(`${BASE_URL}/sr-Latn/nonexistent-page`)
      await waitForPageReady(page)

      // Should show 404 message
      await expect(page.locator('body')).toContainText(/404|not found/i)
    })
  })

  test.describe('Responsive Design', () => {
    test('should display correctly on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto(`${BASE_URL}/sr-Latn`)
      await waitForPageReady(page)

      // Check that main content is visible
      await expect(page.locator('h1')).toBeVisible()
    })
  })
})
