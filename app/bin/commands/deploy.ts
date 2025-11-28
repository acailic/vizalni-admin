import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { validateConfig } from '../../lib/config/validator';
import { DEFAULT_CONFIG } from '../../lib/config/defaults';

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : String(error);

export async function deployCommand(options: { platform?: string; dryRun?: boolean }) {
  // Load configuration
  const configPath = path.join(process.cwd(), 'vizualni-admin.config.json');
  let config = DEFAULT_CONFIG;

  if (fs.existsSync(configPath)) {
    try {
      const configContent = fs.readFileSync(configPath, 'utf-8');
      const parsed = JSON.parse(configContent);
      const validation = validateConfig(parsed);
      if (!validation.valid) {
        console.error(chalk.red('Invalid configuration:'));
        validation.errors.forEach(error => {
          console.error(chalk.red(`  ${error.path}: ${error.message}`));
        });
        process.exit(1);
      }
      config = validation.data;
    } catch (error) {
      console.error(chalk.red('Failed to load configuration:'), getErrorMessage(error));
      process.exit(1);
    }
  } else {
    console.log(chalk.yellow('No configuration file found, using defaults.'));
  }

  // Determine platform
  let platform = options.platform || config.deployment?.target;
  if (!platform || platform === 'local') {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'platform',
        message: 'Select deployment platform:',
        choices: ['github-pages', 'vercel', 'netlify', 'custom'],
      },
    ]);
    platform = answers.platform;
  }

  // Check if build directory exists
  const buildDir = path.join(process.cwd(), 'dist');
  if (!fs.existsSync(buildDir)) {
    console.error(chalk.red('Build directory not found. Run `vizualni-admin build` first.'));
    process.exit(1);
  }

  if (options.dryRun) {
    console.log(chalk.blue('Dry run: would deploy to'), platform);
    console.log(chalk.blue('Build directory:'), buildDir);
    return;
  }

  // Deploy based on platform
  try {
    switch (platform) {
      case 'github-pages':
        await deployToGitHubPages(config, buildDir);
        break;
      case 'vercel':
        await deployToVercel(config, buildDir);
        break;
      case 'netlify':
        await deployToNetlify(config, buildDir);
        break;
      case 'custom':
        await deployToCustom(config, buildDir);
        break;
      default:
        console.error(chalk.red('Unsupported platform:'), platform);
        process.exit(1);
    }
  } catch (error) {
    console.error(chalk.red('Deployment failed:'), getErrorMessage(error));
    process.exit(1);
  }
}

async function deployToGitHubPages(config: any, buildDir: string) {
  console.log(chalk.blue('Deploying to GitHub Pages...'));
  try {
    execSync(`npx gh-pages -d ${buildDir}`, { stdio: 'inherit' });
    console.log(chalk.green('✓ Deployed to GitHub Pages'));

    // Determine deployment URL
    const remote = execSync('git remote get-url origin', { encoding: 'utf-8' }).trim();
    const match = remote.match(/github\.com[\/:]([^\/]+)\/([^\/]+)\.git$/);
    if (match) {
      const username = match[1];
      const repo = match[2];
      const basePath = config.deployment?.basePath || '/';
      const url = `https://${username}.github.io/${repo}${basePath}`;
      console.log(chalk.blue('Deployment URL:'), url);
    } else {
      console.log(chalk.yellow('Could not determine deployment URL. Check your repository settings.'));
    }
  } catch (error) {
    throw new Error('GitHub Pages deployment failed. Ensure gh-pages is installed and you have push access to the repository.');
  }
}

async function deployToVercel(_config: any, _buildDir: string) {
  console.log(chalk.blue('Deploying to Vercel...'));
  try {
    execSync('npx vercel --prod', { stdio: 'inherit', cwd: process.cwd() });
    console.log(chalk.green('✓ Deployed to Vercel'));
    console.log(chalk.yellow('Check the Vercel CLI output above for the deployment URL.'));
  } catch (error) {
    throw new Error('Vercel deployment failed. Ensure you are logged in with `vercel login`.');
  }
}

async function deployToNetlify(_config: any, buildDir: string) {
  console.log(chalk.blue('Deploying to Netlify...'));
  try {
    execSync(`npx netlify deploy --prod --dir ${buildDir}`, { stdio: 'inherit', cwd: process.cwd() });
    console.log(chalk.green('✓ Deployed to Netlify'));
    console.log(chalk.yellow('Check the Netlify CLI output above for the deployment URL.'));
  } catch (error) {
    throw new Error('Netlify deployment failed. Ensure you are logged in with `netlify login`.');
  }
}

async function deployToCustom(config: any, buildDir: string) {
  console.log(chalk.blue('Deploying to custom server...'));
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'host',
      message: 'Server host (e.g., example.com):',
      validate: (input: string) => input.length > 0,
    },
    {
      type: 'input',
      name: 'user',
      message: 'SSH username:',
      validate: (input: string) => input.length > 0,
    },
    {
      type: 'input',
      name: 'remotePath',
      message: 'Remote path (e.g., /var/www/html):',
      validate: (input: string) => input.length > 0,
    },
  ]);

  const cmd = `rsync -avz --delete ${buildDir}/ ${answers.user}@${answers.host}:${answers.remotePath}`;
  try {
    execSync(cmd, { stdio: 'inherit' });
    console.log(chalk.green('✓ Deployed to custom server'));
    const protocol = answers.host.includes('https') ? 'https' : 'http';
    const url = `${protocol}://${answers.host}${config.deployment?.basePath || '/'}`;
    console.log(chalk.blue('Deployment URL:'), url);
  } catch (error) {
    throw new Error('Custom server deployment failed. Ensure rsync is installed and SSH keys are configured.');
  }
}
