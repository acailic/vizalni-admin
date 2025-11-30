/**
 * Global teardown for visual regression tests
 * Cleans up testing environment and generates reports
 */

import { FullConfig } from '@playwright/test';
import path from 'path';
import fs from 'fs';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Cleaning up visual regression test environment...');

  // Generate visual testing report
  const reportData = {
    timestamp: new Date().toISOString(),
    testSuite: 'Visual Regression Tests',
    summary: {
      totalScreenshots: countScreenshots('./screenshots/current'),
      newScreenshots: countNewScreenshots(),
      failedComparisons: countFailedComparisons(),
    },
    directories: {
      current: './screenshots/current',
      baseline: './screenshots/baseline',
      diff: './screenshots/diff',
    },
  };

  // Save report
  const reportPath = path.join(process.cwd(), './screenshots/visual-test-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
  console.log(`📊 Visual test report generated: ${reportPath}`);

  // Cleanup old diff files (keep last 5 runs)
  await cleanupOldDiffs();

  console.log('✅ Visual regression test environment cleaned up');
}

function countScreenshots(dir: string): number {
  const fullPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(fullPath)) return 0;

  const files = fs.readdirSync(fullPath);
  return files.filter(file => file.endsWith('.png')).length;
}

function countNewScreenshots(): number {
  // Logic to determine which screenshots are new
  // For now, return a placeholder
  return 0;
}

function countFailedComparisons(): number {
  const diffDir = path.join(process.cwd(), './screenshots/diff');
  if (!fs.existsSync(diffDir)) return 0;

  const files = fs.readdirSync(diffDir);
  return files.filter(file => file.endsWith('.png')).length;
}

async function cleanupOldDiffs(): Promise<void> {
  const diffDir = path.join(process.cwd(), './screenshots/diff');
  if (!fs.existsSync(diffDir)) return;

  const files = fs.readdirSync(diffDir)
    .filter(file => file.endsWith('.png'))
    .map(file => ({
      name: file,
      path: path.join(diffDir, file),
      time: fs.statSync(path.join(diffDir, file)).mtime,
    }))
    .sort((a, b) => b.time.getTime() - a.time.getTime());

  // Keep only the 5 most recent diff files
  const filesToDelete = files.slice(5);

  for (const file of filesToDelete) {
    try {
      fs.unlinkSync(file.path);
      console.log(`🗑️  Deleted old diff file: ${file.name}`);
    } catch (error) {
      console.warn(`⚠️  Failed to delete ${file.name}:`, error);
    }
  }
}

export default globalTeardown;