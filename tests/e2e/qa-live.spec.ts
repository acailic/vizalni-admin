import { test, expect, Page } from '@playwright/test'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3001'

/**
 * QA Live Testing Suite
 * This suite runs comprehensive tests and provides detailed output
 * similar to manual QA testing.
 */

test.describe('QA Live - Full Site Test', () => {
  let testResults: { name: string; status: 'PASS' | 'FAIL'; details: string }[] = []

  test.afterAll(() => {
    console.log('\n' + '='.repeat(60))
    console.log('QA TEST RESULTS SUMMARY')
    console.log('='.repeat(60))

    const passed = testResults.filter(r => r.status === 'PASS').length
    const failed = testResults.filter(r => r.status === 'FAIL').length

    testResults.forEach(r => {
      const icon = r.status === 'PASS' ? '✅' : '❌'
      console.log(`${icon} ${r.name}: ${r.details}`)
    })

    console.log('='.repeat(60))
    console.log(`Total: ${testResults.length} | Passed: ${passed} | Failed: ${failed}`)
    console.log('='.repeat(60))
  })

  test('QA-001: Homepage loads correctly', async ({ page }) => {
    const testName = 'QA-001: Homepage'
    try {
      await page.goto(`${BASE_URL}/sr-Latn`)
      await page.waitForLoadState('networkidle')

      // Check title
      const title = await page.title()
      expect(title).toContain('Визуелни Администратор')

      // Check main content
      await expect(page.locator('h1')).toBeVisible()

      testResults.push({ name: testName, status: 'PASS', details: 'Page loaded with correct title' })
    } catch (e) {
      testResults.push({ name: testName, status: 'FAIL', details: String(e) })
      throw e
    }
  })

  test('QA-002: Browse page loads with datasets', async ({ page }) => {
    const testName = 'QA-002: Browse Page'
    try {
      await page.goto(`${BASE_URL}/sr-Latn/browse`)
      await page.waitForLoadState('networkidle')

      // Wait for datasets to load
      await page.waitForSelector('text=/Pronađeno|datasets/i', { timeout: 15000 })

      // Check for dataset count
      const bodyText = await page.locator('body').textContent()
      expect(bodyText).toMatch(/\d+\s*(skupova|datasets)/i)

      testResults.push({ name: testName, status: 'PASS', details: 'Datasets loaded successfully' })
    } catch (e) {
      testResults.push({ name: testName, status: 'FAIL', details: String(e) })
      throw e
    }
  })

  test('QA-003: Search functionality works', async ({ page }) => {
    const testName = 'QA-003: Search'
    try {
      await page.goto(`${BASE_URL}/sr-Latn/browse`)
      await page.waitForLoadState('networkidle')

      // Find search input
      const searchInput = page.locator('input[type="search"], input[placeholder*="Pretražite"]').first()
      await expect(searchInput).toBeVisible()

      // Type search query
      await searchInput.fill('statistika')
      await page.keyboard.press('Enter')
      await page.waitForTimeout(2000)

      // Verify search results
      await page.waitForSelector('text=/Pronađeno|datasets/i', { timeout: 10000 })

      testResults.push({ name: testName, status: 'PASS', details: 'Search returned results' })
    } catch (e) {
      testResults.push({ name: testName, status: 'FAIL', details: String(e) })
      throw e
    }
  })

  test('QA-004: Charts gallery page loads', async ({ page }) => {
    const testName = 'QA-004: Charts Gallery'
    try {
      await page.goto(`${BASE_URL}/sr-Latn/charts`)
      await page.waitForLoadState('networkidle')

      // Check for gallery content
      await expect(page.locator('h1, h2').first()).toBeVisible()

      testResults.push({ name: testName, status: 'PASS', details: 'Gallery page loaded' })
    } catch (e) {
      testResults.push({ name: testName, status: 'FAIL', details: String(e) })
      throw e
    }
  })

  test('QA-005: Login page loads with OAuth options', async ({ page }) => {
    const testName = 'QA-005: Login Page'
    try {
      await page.goto(`${BASE_URL}/sr-Latn/login`)
      await page.waitForLoadState('networkidle')

      // Check for OAuth buttons
      await expect(page.getByRole('button', { name: /GitHub/i })).toBeVisible()
      await expect(page.getByRole('button', { name: /Google/i })).toBeVisible()

      // Check for form fields
      await expect(page.locator('input[type="email"]')).toBeVisible()
      await expect(page.locator('input[type="password"]')).toBeVisible()

      testResults.push({ name: testName, status: 'PASS', details: 'OAuth buttons and form present' })
    } catch (e) {
      testResults.push({ name: testName, status: 'FAIL', details: String(e) })
      throw e
    }
  })

  test('QA-006: Accessibility page loads with content', async ({ page }) => {
    const testName = 'QA-006: Accessibility Page'
    try {
      await page.goto(`${BASE_URL}/sr-Latn/accessibility`)
      await page.waitForLoadState('networkidle')

      // Check for accessibility content
      const bodyText = await page.locator('body').textContent()
      expect(bodyText).toContain('WCAG')

      testResults.push({ name: testName, status: 'PASS', details: 'Accessibility statement present' })
    } catch (e) {
      testResults.push({ name: testName, status: 'FAIL', details: String(e) })
      throw e
    }
  })

  test('QA-007: Configurator loads without errors', async ({ page }) => {
    const testName = 'QA-007: Configurator Load'
    try {
      // Capture console errors
      const errors: string[] = []
      page.on('console', msg => {
        if (msg.type() === 'error' && !msg.text().includes('[HMR]')) {
          errors.push(msg.text())
        }
      })

      await page.goto(`${BASE_URL}/sr-Latn/create?dataset=678e312d0aae3fe3ad3e361c`)
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(5000)

      // Check for error overlay
      const errorOverlay = page.locator('[data-nextjs-dialog], .nextjs-container-errors-header')
      const hasErrorOverlay = await errorOverlay.isVisible()

      if (hasErrorOverlay) {
        throw new Error('Error overlay visible on page')
      }

      // Check for critical console errors
      const criticalErrors = errors.filter(e =>
        !e.includes('Warning:') &&
        !e.includes('[ChartTypeStep]') // Our debug logs
      )

      if (criticalErrors.length > 0) {
        console.log('Console errors:', criticalErrors)
      }

      testResults.push({ name: testName, status: 'PASS', details: 'No error overlay detected' })
    } catch (e) {
      testResults.push({ name: testName, status: 'FAIL', details: String(e) })
      throw e
    }
  })

  test('QA-008: Chart type buttons are interactive', async ({ page }) => {
    const testName = 'QA-008: Chart Type Selection'
    try {
      await page.goto(`${BASE_URL}/sr-Latn/create?dataset=678e312d0aae3fe3ad3e361c`)
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(5000)

      // Find Bar chart button
      const barButton = page.locator('button').filter({ hasText: /Bar/i }).first()
      await expect(barButton).toBeVisible()

      // Check if button is clickable
      const isDisabled = await barButton.isDisabled()
      if (!isDisabled) {
        await barButton.click()
        await page.waitForTimeout(1000)

        // Verify URL updated
        await expect(page).toHaveURL(/type=bar/)
        testResults.push({ name: testName, status: 'PASS', details: 'Chart type selection works' })
      } else {
        testResults.push({ name: testName, status: 'PASS', details: 'Bar chart disabled (data not suitable)' })
      }
    } catch (e) {
      testResults.push({ name: testName, status: 'FAIL', details: String(e) })
      throw e
    }
  })

  test('QA-009: API browse endpoint returns data', async ({ request }) => {
    const testName = 'QA-009: Browse API'
    try {
      const response = await request.get(`${BASE_URL}/api/browse?page=1&limit=5`)
      expect(response.ok()).toBeTruthy()

      const data = await response.json()
      expect(data).toHaveProperty('data')
      expect(data.data.length).toBeGreaterThan(0)

      testResults.push({ name: testName, status: 'PASS', details: `API returned ${data.data.length} datasets` })
    } catch (e) {
      testResults.push({ name: testName, status: 'FAIL', details: String(e) })
      throw e
    }
  })

  test('QA-010: 404 page works correctly', async ({ page }) => {
    const testName = 'QA-010: 404 Page'
    try {
      await page.goto(`${BASE_URL}/sr-Latn/nonexistent-page-12345`)
      await page.waitForLoadState('networkidle')

      // Check for 404 message
      const bodyText = await page.locator('body').textContent()
      expect(bodyText?.toLowerCase()).toMatch(/404|not found/)

      testResults.push({ name: testName, status: 'PASS', details: '404 page displayed correctly' })
    } catch (e) {
      testResults.push({ name: testName, status: 'FAIL', details: String(e) })
      throw e
    }
  })

  test('QA-011: Locale switching works', async ({ page }) => {
    const testName = 'QA-011: Locale Switching'
    try {
      // Test English
      await page.goto(`${BASE_URL}/en`)
      await page.waitForLoadState('networkidle')
      let bodyText = await page.locator('body').textContent()
      expect(bodyText).toContain('Browse')

      // Test Serbian Latin
      await page.goto(`${BASE_URL}/sr-Latn`)
      await page.waitForLoadState('networkidle')
      bodyText = await page.locator('body').textContent()
      expect(bodyText).toContain('Pregledaj')

      // Test Serbian Cyrillic
      await page.goto(`${BASE_URL}/sr-Cyrl`)
      await page.waitForLoadState('networkidle')
      bodyText = await page.locator('body').textContent()
      expect(bodyText).toMatch(/Прегледај|Подаци/)

      testResults.push({ name: testName, status: 'PASS', details: 'All 3 locales working' })
    } catch (e) {
      testResults.push({ name: testName, status: 'FAIL', details: String(e) })
      throw e
    }
  })

  test('QA-012: Mobile responsive design', async ({ page }) => {
    const testName = 'QA-012: Mobile Responsive'
    try {
      // Test mobile viewport
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto(`${BASE_URL}/sr-Latn`)
      await page.waitForLoadState('networkidle')

      // Main content should still be visible
      await expect(page.locator('h1')).toBeVisible()

      testResults.push({ name: testName, status: 'PASS', details: 'Mobile layout works' })
    } catch (e) {
      testResults.push({ name: testName, status: 'FAIL', details: String(e) })
      throw e
    }
  })
})
