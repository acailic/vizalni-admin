#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { initCommand } from './commands/init';
import { discoverCommand } from './commands/discover';
import { validateCommand } from './commands/validate';
import { buildCommand } from './commands/build';
import { devCommand } from './commands/dev';
import { deployCommand } from './commands/deploy';

const program = new Command();

program
  .name('vizualni-admin')
  .description(chalk.blue('CLI tool for Vizualni Admin - Serbian Open Data Visualization Framework'))
  .version('0.1.0-beta.1');

program
  .command('init')
  .description(chalk.green('Scaffold a new Vizualni Admin project'))
  .action(async () => {
    try {
      await initCommand();
    } catch (error) {
      console.error(chalk.red('Error during init:'), error.message);
      process.exit(1);
    }
  });

program
  .command('discover')
  .description(chalk.green('Discover datasets from data.gov.rs'))
  .option('-c, --category <category>', 'Filter by category')
  .option('-k, --keyword <keyword>', 'Search keyword')
  .option('-q, --quality <threshold>', 'Minimum quality threshold', parseFloat)
  .option('-s, --save', 'Save results to configuration file')
  .action(async (options) => {
    try {
      await discoverCommand(options);
    } catch (error) {
      console.error(chalk.red('Error during discover:'), error.message);
      process.exit(1);
    }
  });

program
  .command('validate')
  .description(chalk.green('Validate configuration files'))
  .argument('<file>', 'Configuration file to validate')
  .action(async (file) => {
    try {
      await validateCommand(file);
    } catch (error) {
      console.error(chalk.red('Validation failed:'), error.message);
      process.exit(1);
    }
  });

program
  .command('build')
  .description(chalk.green('Build project for production'))
  .option('-t, --target <target>', 'Build target (static|server|docker)', 'static')
  .option('-o, --output <dir>', 'Output directory', 'dist')
  .action(async (options) => {
    try {
      await buildCommand(options);
    } catch (error) {
      console.error(chalk.red('Build failed:'), error.message);
      process.exit(1);
    }
  });

program
  .command('dev')
  .description(chalk.green('Start development server'))
  .option('-p, --port <port>', 'Port to run on', parseInt, 3000)
  .option('-h, --host <host>', 'Host to bind to', 'localhost')
  .action(async (options) => {
    try {
      await devCommand(options);
    } catch (error) {
      console.error(chalk.red('Dev server failed:'), error.message);
      process.exit(1);
    }
  });

program
  .command('deploy')
  .description(chalk.green('Deploy to various platforms'))
  .option('-p, --platform <platform>', 'Deployment platform (github-pages|vercel|netlify|custom)')
  .option('-d, --dry-run', 'Show deployment steps without executing')
  .action(async (options) => {
    try {
      await deployCommand(options);
    } catch (error) {
      console.error(chalk.red('Deployment failed:'), error.message);
      process.exit(1);
    }
  });

// Global error handling
process.on('uncaughtException', (error) => {
  console.error(chalk.red('Uncaught Exception:'), error.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(chalk.red('Unhandled Rejection at:'), promise, 'reason:', reason);
  process.exit(1);
});

program.parse();