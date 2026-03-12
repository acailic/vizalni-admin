import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

import chalk from 'chalk';

export async function buildCommand(options: { target: string; output: string }) {
  const { target, output } = options;

  console.log(chalk.blue(`Building for target: ${target}`));

  const startTime = Date.now();

  try {
    if (target === 'static') {
      console.log(chalk.yellow('Running Next.js build...'));
      execSync('npx next build', { stdio: 'inherit' });

      console.log(chalk.yellow('Exporting static files...'));
      execSync(`npx next export -o ${output}`, { stdio: 'inherit' });
    } else if (target === 'server') {
      console.log(chalk.yellow('Running Next.js build for server...'));
      execSync('npx next build', { stdio: 'inherit' });
    } else if (target === 'docker') {
      console.log(chalk.yellow('Building Docker image...'));
      execSync('docker build -t vizualni-admin .', { stdio: 'inherit' });
    } else {
      throw new Error(`Unknown target: ${target}`);
    }

    const buildTime = Date.now() - startTime;
    console.log(chalk.green(`Build completed in ${buildTime}ms`));

    // Calculate and display build statistics
    if (target === 'static') {
      const outDir = path.resolve(output);
      if (fs.existsSync(outDir)) {
        const stats = getDirStats(outDir);
        const pageCount = countPages(outDir);
        console.log(chalk.blue('Build Statistics:'));
        console.log(`- Bundle size: ${formatBytes(stats.size)}`);
        console.log(`- Files: ${stats.files}`);
        console.log(`- Pages: ${pageCount}`);
      }
    } else if (target === 'server') {
      const nextDir = path.resolve('.next');
      if (fs.existsSync(nextDir)) {
        const stats = getDirStats(nextDir);
        const pageCount = countPages(path.join(nextDir, 'server', 'pages'));
        console.log(chalk.blue('Build Statistics:'));
        console.log(`- Bundle size: ${formatBytes(stats.size)}`);
        console.log(`- Files: ${stats.files}`);
        console.log(`- Pages: ${pageCount}`);
      }
    }
  } catch (error: any) {
    throw new Error(`Build failed: ${error.message}`);
  }
}

function getDirStats(dir: string): { size: number; files: number } {
  let size = 0;
  let files = 0;

  function calc(dirPath: string) {
    if (!fs.existsSync(dirPath)) return;
    const items = fs.readdirSync(dirPath);
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        calc(fullPath);
      } else {
        size += stat.size;
        files++;
      }
    }
  }

  calc(dir);
  return { size, files };
}

function countPages(dir: string): number {
  if (!fs.existsSync(dir)) return 0;
  let count = 0;
  function countHtml(dirPath: string) {
    const items = fs.readdirSync(dirPath);
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        countHtml(fullPath);
      } else if (path.extname(fullPath) === '.html') {
        count++;
      }
    }
  }
  countHtml(dir);
  return count;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}