/**
 * Global setup for visual regression tests
 * Ensures consistent testing environment
 */

import { chromium, FullConfig } from '@playwright/test';
import path from 'path';
import fs from 'fs';

async function globalSetup(config: FullConfig) {
  console.log('🎨 Setting up visual regression test environment...');

  // Ensure screenshot directories exist
  const screenshotDirs = [
    './screenshots',
    './screenshots/baseline',
    './screenshots/diff',
    './screenshots/components',
    './screenshots/responsive',
    './screenshots/states',
    './screenshots/current',
  ];

  screenshotDirs.forEach(dir => {
    const fullPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    }
  });

  // Launch browser to ensure it's available
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  });

  // Warm up the browser
  const page = await context.newPage();
  await page.goto('about:blank');
  await browser.close();

  // Set up environment variables
  process.env.VISUAL_TESTING = 'true';
  process.env.SCREENSHOT_DIR = './screenshots';
  process.env.BASELINE_DIR = './screenshots/baseline';
  process.env.DIFF_DIR = './screenshots/diff';

  console.log('✅ Visual regression test environment ready');
}

export default globalSetup;