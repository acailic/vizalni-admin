import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

import inquirer from 'inquirer';

import { DEFAULT_CONFIG } from '../../lib/config/defaults';

export async function init() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Project name:',
      default: 'my-vizualni-admin',
      validate: (input: string) => {
        if (!input.trim()) {
          return 'Project name cannot be empty';
        }
        if (!/^[a-zA-Z0-9-_]+$/.test(input)) {
          return 'Project name can only contain letters, numbers, hyphens, and underscores';
        }
        return true;
      }
    },
    {
      type: 'list',
      name: 'language',
      message: 'Language:',
      choices: ['sr', 'en'],
      default: 'sr'
    },
    {
      type: 'checkbox',
      name: 'categories',
      message: 'Enabled categories:',
      choices: ['air-quality', 'budget', 'education', 'health', 'transport'],
      default: ['air-quality', 'budget', 'education'],
      validate: (input: string[]) => {
        if (input.length === 0) {
          return 'At least one category must be selected';
        }
        return true;
      }
    },
    {
      type: 'list',
      name: 'deployment',
      message: 'Deployment target:',
      choices: ['local', 'github-pages', 'vercel', 'netlify'],
      default: 'local'
    }
  ]);

  const projectDir = path.join(process.cwd(), answers.name);

  if (fs.existsSync(projectDir)) {
    console.error(`Directory "${answers.name}" already exists. Please choose a different name or remove the existing directory.`);
    process.exit(1);
  }

  console.log(`Creating project in ${projectDir}...`);
  fs.mkdirSync(projectDir, { recursive: true });

  // Generate config
  const config = { ...DEFAULT_CONFIG };
  config.project.name = answers.name;
  config.project.language = answers.language;
  config.categories.enabled = answers.categories;
  config.deployment.target = answers.deployment;

  fs.writeFileSync(path.join(projectDir, 'vizualni-admin.config.json'), JSON.stringify(config, null, 2));

  // Generate package.json
  const packageJson = {
    name: answers.name,
    version: '1.0.0',
    private: true,
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      lint: 'next lint'
    },
    dependencies: {
      'vizualni-admin': '^0.1.0-beta.1',
      'next': '^14.0.0',
      'react': '^18.0.0',
      'react-dom': '^18.0.0'
    },
    devDependencies: {
      '@types/node': '^20.0.0',
      '@types/react': '^18.0.0',
      '@types/react-dom': '^18.0.0',
      'typescript': '^5.0.0'
    }
  };

  fs.writeFileSync(path.join(projectDir, 'package.json'), JSON.stringify(packageJson, null, 2));

  // Copy template files from examples/basic-usage
  const templateDir = path.join(__dirname, '../../../examples/basic-usage');
  const pagesDir = path.join(projectDir, 'pages');
  fs.mkdirSync(pagesDir, { recursive: true });

  // Copy index.tsx
  const indexTemplate = path.join(templateDir, 'pages/index.tsx');
  if (fs.existsSync(indexTemplate)) {
    fs.copyFileSync(indexTemplate, path.join(pagesDir, 'index.tsx'));
  }

  // Copy README
  const readmeTemplate = path.join(templateDir, 'README.md');
  if (fs.existsSync(readmeTemplate)) {
    fs.copyFileSync(readmeTemplate, path.join(projectDir, 'README.md'));
  }

  // Create basic next.config.js
  const nextConfig = `
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
`;
  fs.writeFileSync(path.join(projectDir, 'next.config.js'), nextConfig);

  // Create tsconfig.json
  const tsconfig = {
    compilerOptions: {
      target: 'es5',
      lib: ['dom', 'dom.iterable', 'es6'],
      allowJs: true,
      skipLibCheck: true,
      strict: true,
      noEmit: true,
      esModuleInterop: true,
      module: 'esnext',
      moduleResolution: 'bundler',
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: 'preserve',
      incremental: true,
      plugins: [
        {
          name: 'next'
        }
      ],
      baseUrl: '.',
      paths: {
        '@/*': ['./*']
      }
    },
    include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
    exclude: ['node_modules']
  };
  fs.writeFileSync(path.join(projectDir, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2));

  // Initialize git repository
  console.log('Initializing git repository...');
  try {
    execSync('git init', { cwd: projectDir, stdio: 'inherit' });
    execSync('git add .', { cwd: projectDir, stdio: 'inherit' });
    execSync('git commit -m "Initial commit"', { cwd: projectDir, stdio: 'inherit' });
  } catch (error) {
    console.warn('Failed to initialize git repository. You can do this manually later.');
  }

  // Install dependencies
  console.log('Installing dependencies...');
  try {
    execSync('npm install', { cwd: projectDir, stdio: 'inherit' });
  } catch (error) {
    console.warn('Failed to install dependencies. Please run "npm install" manually in the project directory.');
  }

  console.log(`
🎉 Project "${answers.name}" initialized successfully!

Next steps:
  cd ${answers.name}
  npm run dev

This will start the development server. Open http://localhost:3000 to see your new Vizualni Admin project.

For more information, check the README.md file in your project directory.
`);
}

export const initCommand = init;
