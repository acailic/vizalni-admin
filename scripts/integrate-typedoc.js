#!/usr/bin/env node

/**
 * Script to integrate TypeDoc generated HTML documentation into VitePress
 *
 * This script:
 * 1. Copies TypeDoc generated API docs to VitePress public directory
 * 2. Creates VitePress markdown pages that embed the TypeDoc HTML
 * 3. Updates navigation configuration
 */

const fs = require("fs").promises;
const path = require("path");

const CONFIG = {
  typedocOutputDir: "./docs/api",
  vitepressApiDir: "./docs/api-reference",
  publicDir: "./docs/public",
  apiEmbedDir: "./docs/public/api",
};

async function ensureDir(dir) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

async function copyTypeDocToPublic() {
  console.log("📚 Copying TypeDoc output to VitePress public directory...");

  await ensureDir(CONFIG.apiEmbedDir);

  // Copy TypeDoc output to public directory
  const copyRecursive = async (src, dest) => {
    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        await fs.mkdir(destPath, { recursive: true });
        await copyRecursive(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  };

  await copyRecursive(CONFIG.typedocOutputDir, CONFIG.apiEmbedDir);
  console.log("✅ TypeDoc documentation copied to public directory");
}

async function createVitePressApiPages() {
  console.log("📄 Creating VitePress API reference pages...");

  await ensureDir(CONFIG.vitepressApiDir);

  // Create main API index page
  const apiIndexContent = `# API Referenca

Ova stranica sadrži automatski generisanu API dokumentaciju pomoću TypeDoc-a.

<iframe
  src="/api/index.html"
  style="width: 100%; height: 80vh; border: none; border-radius: 8px;"
  frameborder="0"
  title="Vizualni Admin API Documentation"
></iframe>

## Korišćenje

API dokumentacija sadrži detaljne informacije o:
- [Tipovima podataka](/api-reference/types)
- [Konfiguracijskim opcijama](/api-reference/configuration)
- [Pomoćnim funkcijama](/api-reference/utilities)
- [Komponentama](/api-reference/components)

Sva dokumentacija se automatski generiše iz TypeScript koda i održava je ažurnom.
`;

  await fs.writeFile(
    path.join(CONFIG.vitepressApiDir, "index.md"),
    apiIndexContent
  );

  // Create categorized pages
  const categories = [
    {
      name: "Tipovi",
      file: "types.md",
      htmlFile: "modules.html",
    },
    {
      name: "Konfiguracija",
      file: "configuration.md",
      htmlFile: "interfaces.html",
    },
    {
      name: "Funkcije",
      file: "utilities.md",
      htmlFile: "functions.html",
    },
  ];

  for (const category of categories) {
    const content = `# ${category.name}

<iframe
  src="/api/${category.htmlFile}"
  style="width: 100%; height: 80vh; border: none; border-radius: 8px;"
  frameborder="0"
  title="${category.name} - Vizualni Admin API Documentation"
></iframe>
`;

    await fs.writeFile(
      path.join(CONFIG.vitepressApiDir, category.file),
      content
    );
  }

  console.log("✅ VitePress API pages created");
}

async function createEnglishApiPages() {
  console.log("📄 Creating English API reference pages...");

  const enApiDir = "./docs/en/api-reference";
  await ensureDir(enApiDir);

  // Create English API index page
  const apiIndexContent = `# API Reference

This page contains automatically generated API documentation using TypeDoc.

<iframe
  src="/api/index.html"
  style="width: 100%; height: 80vh; border: none; border-radius: 8px;"
  frameborder="0"
  title="Vizualni Admin API Documentation"
></iframe>

## Usage

The API documentation contains detailed information about:
- [Data Types](/en/api-reference/types)
- [Configuration Options](/en/api-reference/configuration)
- [Utility Functions](/en/api-reference/utilities)
- [Components](/en/api-reference/components)

All documentation is automatically generated from TypeScript code and kept up-to-date.
`;

  await fs.writeFile(path.join(enApiDir, "index.md"), apiIndexContent);

  // Create English categorized pages
  const categories = [
    {
      name: "Types",
      file: "types.md",
      htmlFile: "modules.html",
    },
    {
      name: "Configuration",
      file: "configuration.md",
      htmlFile: "interfaces.html",
    },
    {
      name: "Functions",
      file: "utilities.md",
      htmlFile: "functions.html",
    },
  ];

  for (const category of categories) {
    const content = `# ${category.name}

<iframe
  src="/api/${category.htmlFile}"
  style="width: 100%; height: 80vh; border: none; border-radius: 8px;"
  frameborder="0"
  title="${category.name} - Vizualni Admin API Documentation"
></iframe>
`;

    await fs.writeFile(path.join(enApiDir, category.file), content);
  }

  console.log("✅ English API pages created");
}

async function createCyrillicApiPages() {
  console.log("📄 Creating Cyrillic API reference pages...");

  const srCyrlApiDir = "./docs/sr-cyrl/api-reference";
  await ensureDir(srCyrlApiDir);

  // Create Cyrillic API index page
  const apiIndexContent = `# API Референца

Ова страница садржи аутоматски генерисану API документацију помоћу TypeDoc-а.

<iframe
  src="/api/index.html"
  style="width: 100%; height: 80vh; border: none; border-radius: 8px;"
  frameborder="0"
  title="Vizualni Admin API Documentation"
></iframe>

## Коришћење

API документација садржи детаљне информације о:
- [Типовима података](/sr-cyrl/api-reference/types)
- [Конфигурационим опцијама](/sr-cyrl/api-reference/configuration)
- [Помоћним функцијама](/sr-cyrl/api-reference/utilities)
- [Компонентама](/sr-cyrl/api-reference/components)

Сва документација се аутоматски генерише из TypeScript кода и одржава је ажурном.
`;

  await fs.writeFile(path.join(srCyrlApiDir, "index.md"), apiIndexContent);

  // Create Cyrillic categorized pages
  const categories = [
    {
      name: "Типови",
      file: "types.md",
      htmlFile: "modules.html",
    },
    {
      name: "Конфигурација",
      file: "configuration.md",
      htmlFile: "interfaces.html",
    },
    {
      name: "Функције",
      file: "utilities.md",
      htmlFile: "functions.html",
    },
  ];

  for (const category of categories) {
    const content = `# ${category.name}

<iframe
  src="/api/${category.htmlFile}"
  style="width: 100%; height: 80vh; border: none; border-radius: 8px;"
  frameborder="0"
  title="${category.name} - Vizualni Admin API Documentation"
></iframe>
`;

    await fs.writeFile(path.join(srCyrlApiDir, category.file), content);
  }

  console.log("✅ Cyrillic API pages created");
}

async function updateNavigation() {
  console.log("🔄 Updating VitePress navigation configuration...");

  // Note: Navigation is already configured in docs/.vitepress/config.mts
  // No automatic update needed - the config is already set up with API reference links
  console.log("✅ Navigation already configured in docs/.vitepress/config.mts");
  return;

  // Note: In a real implementation, you would parse and modify the config object
  // For now, we'll create a manual instruction file
  const navigationUpdate = `
// Manual Navigation Update Required
// Please add the following to your sidebar configuration:

// For Serbian (Latin) sidebar:
{
  text: 'API Referenca',
  items: [
    { text: 'Pregled', link: '/api-reference/' },
    { text: 'Tipovi', link: '/api-reference/types' },
    { text: 'Konfiguracija', link: '/api-reference/configuration' },
    { text: 'Funkcije', link: '/api-reference/utilities' }
  ]
},

// For English sidebar:
{
  text: 'API Reference',
  items: [
    { text: 'Overview', link: '/en/api-reference/' },
    { text: 'Types', link: '/en/api-reference/types' },
    { text: 'Configuration', link: '/en/api-reference/configuration' },
    { text: 'Functions', link: '/en/api-reference/utilities' }
  ]
},

// For Serbian (Cyrillic) sidebar:
{
  text: 'API Референца',
  items: [
    { text: 'Преглед', link: '/sr-cyrl/api-reference/' },
    { text: 'Типови', link: '/sr-cyrl/api-reference/types' },
    { text: 'Конфигурација', link: '/sr-cyrl/api-reference/configuration' },
    { text: 'Функције', link: '/sr-cyrl/api-reference/utilities' }
  ]
},
`;

  await fs.writeFile("./NAVIGATION_UPDATE.md", navigationUpdate);
  console.log(
    "📝 Navigation update instructions saved to NAVIGATION_UPDATE.md"
  );
}

async function main() {
  try {
    console.log("🚀 Starting TypeDoc to VitePress integration...\n");

    await copyTypeDocToPublic();
    await createVitePressApiPages();
    await createEnglishApiPages();
    await createCyrillicApiPages();
    await updateNavigation();

    console.log("\n✅ TypeDoc integration completed successfully!");
    console.log("\n📋 Next steps:");
    console.log(
      "1. Update your VitePress sidebar configuration (see NAVIGATION_UPDATE.md)"
    );
    console.log("2. Run: npm run docs:dev to test the integration");
    console.log("3. Build your docs: npm run docs:build");
  } catch (error) {
    console.error("❌ Error during integration:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };
