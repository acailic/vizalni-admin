import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { validateConfig } from '../../lib/config/validator';

const validateCommand = new Command('validate');

validateCommand
  .description('Validate configuration file against JSON schema and check for common issues')
  .argument('<file>', 'Path to config file (JSON or TS)')
  .action(async (file) => {
    if (!fs.existsSync(file)) {
      console.error(chalk.red(`File not found: ${file}`));
      process.exit(1);
    }

    let config: unknown;
    try {
      if (file.endsWith('.ts')) {
        require('ts-node/register');
        config = require(path.resolve(file)).default;
      } else if (file.endsWith('.json')) {
        config = JSON.parse(fs.readFileSync(file, 'utf8'));
      } else {
        console.error(chalk.red('Unsupported file type. Use .json or .ts'));
        process.exit(1);
      }
    } catch (e) {
      console.error(chalk.red(`Error loading config: ${(e as Error).message}`));
      process.exit(1);
    }

    const result = validateConfig(config);
    if (result.valid) {
      console.log(chalk.green('✓ Configuration is valid!'));

      // Additional checks for common issues
      const issues = checkCommonIssues(result.data);
      if (issues.length > 0) {
        console.log(chalk.yellow('Warnings:'));
        issues.forEach(issue => console.log(`  - ${issue}`));
      }
    } else {
      console.error(chalk.red('✗ Configuration has validation errors:'));
      result.errors.forEach(error => {
        console.error(`  ${chalk.red('✗')} ${error.path}: ${error.message}`);
        // Provide helpful suggestions based on error type
        if (error.keyword === 'required') {
          console.error(`    Suggestion: Add the missing required field '${error.path.split('.').pop()}' to your configuration.`);
        } else if (error.keyword === 'enum') {
          console.error(`    Suggestion: Use one of the allowed values for this field.`);
        } else if (error.keyword === 'type') {
          console.error(`    Suggestion: Ensure the value is of the correct type (e.g., string, number, boolean).`);
        } else if (error.keyword === 'pattern') {
          console.error(`    Suggestion: Check the format requirements (e.g., hex colors should be #fff or #ffffff).`);
        }
      });
      process.exit(1);
    }
  });

function checkCommonIssues(config: any): string[] {
  const issues: string[] = [];

  // Check for missing datasets
  if (!config.datasets?.autoDiscovery && (!config.datasets?.manualIds || Object.keys(config.datasets.manualIds).length === 0)) {
    issues.push('No datasets configured. Consider enabling autoDiscovery or adding entries to manualIds for better functionality.');
  }

  // Check for invalid custom colors (beyond schema validation)
  if (config.visualization?.customColors) {
    config.visualization.customColors.forEach((color: string, index: number) => {
      if (!/^#(?:[0-9a-fA-F]{3}){1,2}$/.test(color)) {
        issues.push(`Invalid custom color at index ${index}: '${color}'. Use hex format like '#fff' or '#ffffff'.`);
      }
    });
  }

  // Check for potentially broken URLs in deployment settings
  if (config.deployment?.customDomain) {
    if (!isValidUrl(config.deployment.customDomain)) {
      issues.push(`Invalid custom domain URL: '${config.deployment.customDomain}'. Ensure it starts with 'http://' or 'https://'.`);
    }
  }

  // Additional check: warn if basePath doesn't start with '/'
  if (config.deployment?.basePath && !config.deployment.basePath.startsWith('/')) {
    issues.push(`Base path '${config.deployment.basePath}' should start with '/'.`);
  }

  return issues;
}

function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

export default validateCommand;