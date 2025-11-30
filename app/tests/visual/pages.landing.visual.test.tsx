/**
 * Visual regression tests for landing page
 * Tests responsive design and interactive states
 */

import { test, expect, VIEWPORTS, navigateAndStabilize, testResponsiveDesign, testInteractiveStates } from '@/test-utils/visual-regression';

test.describe('Landing Page Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    await navigateAndStabilize(page, '/');
  });

  test('should render correctly on desktop', async ({ page, takeScreenshot }) => {
    await takeScreenshot('landing-page-desktop');
  });

  test('should render correctly on mobile', async ({ page, takeScreenshot }) => {
    await page.setViewportSize(VIEWPORTS.mobile);
    await takeScreenshot('landing-page-mobile');
  });

  test('should render correctly on tablet', async ({ page, takeScreenshot }) => {
    await page.setViewportSize(VIEWPORTS.tablet);
    await takeScreenshot('landing-page-tablet');
  });

  test('should render correctly in dark mode', async ({ page, takeScreenshot }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await takeScreenshot('landing-page-dark-mode');
  });

  test('should render correctly in RTL', async ({ page, takeScreenshot }) => {
    await page.evaluate(() => {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    });
    await takeScreenshot('landing-page-rtl');
  });

  test('should render correctly with high contrast', async ({ page, takeScreenshot }) => {
    await page.emulateMedia({ forcedColors: 'active' });
    await takeScreenshot('landing-page-high-contrast');
  });

  test('should handle navigation interactions correctly', async ({ page, takeScreenshot }) => {
    // Test hover states on navigation
    await page.hover('[data-testid="nav-home"]');
    await takeScreenshot('landing-page-nav-hover');

    await page.hover('[data-testid="nav-about"]');
    await takeScreenshot('landing-page-nav-about-hover');
  });

  test('should handle button interactions correctly', async ({ page, takeScreenshot }) => {
    // Test button states
    const primaryButton = page.locator('[data-testid="primary-cta"]');

    // Hover state
    await primaryButton.hover();
    await takeScreenshot('landing-page-cta-hover');

    // Focus state
    await primaryButton.focus();
    await takeScreenshot('landing-page-cta-focus');
  });

  test('should handle form interactions correctly', async ({ page, takeScreenshot }) => {
    // Focus on form field
    const emailInput = page.locator('[data-testid="email-input"]');
    await emailInput.focus();
    await takeScreenshot('landing-page-form-focus');

    // Type in form field
    await emailInput.fill('test@example.com');
    await takeScreenshot('landing-page-form-filled');
  });

  test('should be responsive across all breakpoints', async ({ page }) => {
    await testResponsiveDesign(page, '/', 'landing-page', {
      viewports: ['mobile', 'tablet', 'desktop', 'widescreen'],
    });
  });
});

test.describe('Landing Page Component Visual Tests', () => {
  test('should render header correctly', async ({ page, takeScreenshot }) => {
    await page.goto('/');
    const header = page.locator('[data-testid="header"]');
    await header.scrollIntoViewIfNeeded();
    await takeScreenshot('component-header');
  });

  test('should render hero section correctly', async ({ page, takeScreenshot }) => {
    await page.goto('/');
    const hero = page.locator('[data-testid="hero-section"]');
    await hero.scrollIntoViewIfNeeded();
    await takeScreenshot('component-hero');
  });

  test('should render features section correctly', async ({ page, takeScreenshot }) => {
    await page.goto('/');
    const features = page.locator('[data-testid="features-section"]');
    await features.scrollIntoViewIfNeeded();
    await takeScreenshot('component-features');
  });

  test('should render footer correctly', async ({ page, takeScreenshot }) => {
    await page.goto('/');
    const footer = page.locator('[data-testid="footer"]');
    await footer.scrollIntoViewIfNeeded();
    await takeScreenshot('component-footer');
  });

  test('should handle component states correctly', async ({ page }) => {
    await page.goto('/');

    // Test interactive states for main CTA button
    await testInteractiveStates(page, '[data-testid="primary-cta"]', 'primary-cta');

    // Test interactive states for secondary button
    await testInteractiveStates(page, '[data-testid="secondary-cta"]', 'secondary-cta');
  });
});

test.describe('Landing Page Performance Visual Tests', () => {
  test('should load without layout shifts', async ({ page, takeScreenshot }) => {
    // Take screenshot before JS loads
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await takeScreenshot('landing-page-dom-loaded');

    // Take screenshot after full load
    await navigateAndStabilize(page, '/');
    await takeScreenshot('landing-page-fully-loaded');
  });

  test('should handle slow loading correctly', async ({ page, takeScreenshot }) {
    // Simulate slow network
    await page.route('**/*', (route) => {
      // Delay CSS and image loading
      if (route.request().resourceType() === 'stylesheet' ||
          route.request().resourceType() === 'image') {
        setTimeout(() => route.continue(), 1000);
      } else {
        route.continue();
      }
    });

    await navigateAndStabilize(page, '/');
    await takeScreenshot('landing-page-slow-network');
  });
});

test.describe('Landing Page Error States Visual Tests', () => {
  test('should handle missing images gracefully', async ({ page, takeScreenshot }) => {
    // Block image loading to simulate missing images
    await page.route('**/*.png', (route) => route.abort());
    await page.route('**/*.jpg', (route) => route.abort());
    await page.route('**/*.jpeg', (route) => route.abort());
    await page.route('**/*.webp', (route) => route.abort());

    await navigateAndStabilize(page, '/');
    await takeScreenshot('landing-page-missing-images');
  });

  test('should handle font loading failures gracefully', async ({ page, takeScreenshot }) => {
    // Block font loading
    await page.route('**/*.woff', (route) => route.abort());
    await page.route('**/*.woff2', (route) => route.abort());
    await page.route('**/*.ttf', (route) => route.abort());

    await navigateAndStabilize(page, '/');
    await takeScreenshot('landing-page-missing-fonts');
  });
});