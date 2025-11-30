import { defineConfig, devices } from '@playwright/test';
import { VisualRegressionTracker } from '@visual-regression-tracker/sdk';

/**
 * Playwright configuration for visual regression testing
 * Separate from E2E tests to focus on visual validation
 */
export default defineConfig({
  testDir: './app/tests/visual',
  testMatch: '**/*.visual.{test,spec}.{js,ts,jsx,tsx}',

  // Global setup for visual tests
  globalSetup: require.resolve('./app/tests/visual/global-setup.ts'),
  globalTeardown: require.resolve('./app/tests/visual/global-teardown.ts'),

  // Retry visual tests (they can be flaky)
  retries: 2,

  // Timeout for visual tests (longer due to rendering)
  timeout: 30000,

  // Parallel execution for visual tests
  workers: process.env.CI ? 2 : 4,

  // Reporter configuration
  reporter: [
    ['html', { outputFolder: './playwright-visual-report' }],
    ['json', { outputFile: './playwright-visual-results.json' }],
    ['junit', { outputFile: './playwright-visual-results.xml' }],
  ],

  // Use configured browsers for visual testing
  use: {
    // Base URL for the application
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:3000',

    // Take screenshot on failure
    screenshot: 'only-on-failure',

    // Record video on failure
    video: 'retain-on-failure',

    // Trace on failure
    trace: 'retain-on-failure',

    // Ignore HTTPS errors for local testing
    ignoreHTTPSErrors: true,

    // Wait for network idle before considering page loaded
    waitUntil: 'networkidle',

    // Timeout for actions
    actionTimeout: 10000,

    // Disable animations for consistent screenshots
    launchOptions: {
      args: [
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-features=TranslateUI',
        '--disable-ipc-flooding-protection',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-default-browser-check',
        '--disable-default-apps',
        '--disable-popup-blocking',
      ],
    },
  },

  // Projects for different browsers and viewports
  projects: [
    {
      name: 'chrome-desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
    },

    {
      name: 'chrome-mobile',
      use: {
        ...devices['Pixel 5'],
        viewport: { width: 393, height: 851 },
      },
    },

    {
      name: 'chrome-tablet',
      use: {
        ...devices['iPad Pro'],
        viewport: { width: 1024, height: 1366 },
      },
    },

    {
      name: 'firefox-desktop',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 720 },
      },
    },

    {
      name: 'safari-desktop',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 720 },
      },
    },

    // Dark mode variants
    {
      name: 'chrome-desktop-dark',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
        colorScheme: 'dark',
        reducedMotion: 'reduce',
      },
    },

    // High contrast mode
    {
      name: 'chrome-desktop-high-contrast',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
        forcedColors: 'active',
      },
    },

    // RTL layout
    {
      name: 'chrome-desktop-rtl',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
        locale: 'ar-SA',
      },
    },
  ],

  // Web server for local testing
  webServer: {
    command: 'yarn dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },

  // Output directory for test artifacts
  outputDir: './playwright-visual-results',

  // Environment variables
  env: {
    VISUAL_TESTING: 'true',
    SCREENSHOT_DIR: './screenshots',
    BASELINE_DIR: './screenshots/baseline',
    DIFF_DIR: './screenshots/diff',
  },
});