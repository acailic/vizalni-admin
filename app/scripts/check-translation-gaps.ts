#!/usr/bin/env node
/**
 * Script to audit translation gaps between en and sr locales
 * Extracts translation keys from locale files and compares them
 */

const fs = require("fs");
const path = require("path");

// Extract keys from the compiled message files
function extractKeys(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf-8");

    // The files have format: export const messages=JSON.parse("...")as Messages;
    // We'll extract all key names from the JSON string using regex

    // Find all occurrences of "key":"value" patterns
    const keyPattern = /"([^"]+)":/g;
    const keys = [];
    let match;

    while ((match = keyPattern.exec(content)) !== null) {
      keys.push(match[1]);
    }

    return keys;
  } catch (e) {
    console.error(`Error reading ${filePath}:`, e.message);
    return [];
  }
}

function findMissingKeys(sourceKeys, targetKeys) {
  return sourceKeys.filter((key) => !targetKeys.includes(key));
}

function findExtraKeys(sourceKeys, targetKeys) {
  return targetKeys.filter((key) => !sourceKeys.includes(key));
}

async function main() {
  const localesDir = path.join(__dirname, "../locales");
  const enFile = path.join(localesDir, "en/messages.ts");
  const srLatnFile = path.join(localesDir, "sr-Latn/messages.ts");
  const srCyrlFile = path.join(localesDir, "sr-Cyrl/messages.ts");

  console.log("Loading locale files...");

  const enKeys = extractKeys(enFile);
  const srLatnKeys = extractKeys(srLatnFile);
  const srCyrlKeys = extractKeys(srCyrlFile);

  // Remove duplicates (just in case)
  const uniqueEnKeys = [...new Set(enKeys)];
  const uniqueSrLatnKeys = [...new Set(srLatnKeys)];
  const uniqueSrCyrlKeys = [...new Set(srCyrlKeys)];

  console.log("\n=== Translation Audit Report ===\n");
  console.log(`Total keys in English: ${uniqueEnKeys.length}`);
  console.log(`Total keys in sr-Latn: ${uniqueSrLatnKeys.length}`);
  console.log(`Total keys in sr-Cyrl: ${uniqueSrCyrlKeys.length}\n`);

  // Find missing keys
  const missingInSrLatn = findMissingKeys(uniqueEnKeys, uniqueSrLatnKeys);
  const missingInSrCyrl = findMissingKeys(uniqueEnKeys, uniqueSrCyrlKeys);

  // Find extra keys (keys that exist in sr but not en)
  const extraInSrLatn = findExtraKeys(uniqueEnKeys, uniqueSrLatnKeys);
  const extraInSrCyrl = findExtraKeys(uniqueEnKeys, uniqueSrCyrlKeys);

  if (missingInSrLatn.length > 0) {
    console.log(`❌ Missing in sr-Latn (${missingInSrLatn.length}):`);
    missingInSrLatn.forEach((key) => console.log(`   - ${key}`));
  } else {
    console.log("✅ No missing keys in sr-Latn");
  }

  if (missingInSrCyrl.length > 0) {
    console.log(`\n❌ Missing in sr-Cyrl (${missingInSrCyrl.length}):`);
    missingInSrCyrl.forEach((key) => console.log(`   - ${key}`));
  } else {
    console.log("✅ No missing keys in sr-Cyrl");
  }

  if (extraInSrLatn.length > 0) {
    console.log(
      `\n⚠️  Extra keys in sr-Latn (not in en) (${extraInSrLatn.length}):`
    );
    extraInSrLatn.slice(0, 10).forEach((key) => console.log(`   - ${key}`));
    if (extraInSrLatn.length > 10) {
      console.log(`   ... and ${extraInSrLatn.length - 10} more`);
    }
  }

  if (extraInSrCyrl.length > 0) {
    console.log(
      `\n⚠️  Extra keys in sr-Cyrl (not in en) (${extraInSrCyrl.length}):`
    );
    extraInSrCyrl.slice(0, 10).forEach((key) => console.log(`   - ${key}`));
    if (extraInSrCyrl.length > 10) {
      console.log(`   ... and ${extraInSrCyrl.length - 10} more`);
    }
  }

  // Summary
  console.log("\n📊 Summary:");
  console.log(`   - Missing keys in sr-Latn: ${missingInSrLatn.length}`);
  console.log(`   - Missing keys in sr-Cyrl: ${missingInSrCyrl.length}`);
  console.log(`   - Extra keys in sr-Latn: ${extraInSrLatn.length}`);
  console.log(`   - Extra keys in sr-Cyrl: ${extraInSrCyrl.length}`);

  const totalIssues = missingInSrLatn.length + missingInSrCyrl.length;

  if (totalIssues === 0) {
    console.log("\n✅ All translation keys are in sync!");
  } else {
    console.log(`\n⚠️  Found ${totalIssues} missing translation keys`);
  }

  // Check for priority UI surfaces
  console.log("\n🔍 Priority UI Surfaces Check:\n");

  const priorityKeys = [
    "demos.layout.back",
    "demos.layout.error-title",
    "demos.layout.loading",
    "demos.layout.retry",
    "demos.layout.updated",
    "demos.layout.empty",
    "demos.layout.source",
    "demos.layout.organization",
    "demos.index.title",
    "demos.index.description",
    "demos.index.hero.title",
    "demos.index.hero.body",
    "demos.index.hero.intro",
    "demos.index.about.title",
    "demos.index.about.paragraph1",
    "demos.index.about.paragraph2",
    "demos.index.showcase.title",
    "demos.index.showcase.description",
    "demos.index.showcase.cta",
    "demos.index.stats.available",
    "demos.index.stats.organizations",
    "demos.index.stats.resources",
    "demos.showcase.title",
    "demos.showcase.description",
    "demos.showcase.hero",
    "demos.showcase.hero.body",
    "demos.showcase.cta",
    "demos.showcase.cta.title",
    "demos.showcase.cta.body",
    "demos.showcase.chip.economy",
    "demos.showcase.chip.mobility",
    "demos.showcase.chip.energy",
    "demos.showcase.chip.digital",
    "demos.showcase.economy.title",
    "demos.showcase.economy.description",
    "demos.showcase.transport.title",
    "demos.showcase.transport.description",
    "demos.showcase.energy.title",
    "demos.showcase.energy.description",
    "demos.showcase.digital.title",
    "demos.showcase.digital.description",
    "controls.nav.back-to-configurator",
    "controls.nav.back-to-preview",
    "button.download.data",
    "button.download.data.all",
    "button.download.data.visible",
    "button.share",
    "button.embed",
    "button.copy-preview-link",
    "button.save-draft",
    "button.publish",
    "button.update",
    "button.new.visualization",
    "button.copy.visualization",
    "button.back",
    "button.confirm",
    "button.hint.click.to.copy",
    "button.hint.copied",
    "button.copy-preview-link.success",
    "button.copy-preview-link.explanation",
    "button.layout",
    "error.boundary.title",
    "error.boundary.message",
    "error.boundary.retry",
    "hint.nodata.title",
    "hint.nodata.message",
    "hint.loading.data",
    "hint.chartunexpected.title",
    "hint.chartunexpected.message",
    "dataset.search.placeholder",
    "dataset.search.label",
    "dataset.search.preview.title",
    "dataset.search.preview.description",
    "dataset.search.preview.datasets",
    "browse.dataset.all",
    "browse.dataset.find",
    "browse.dataset.create-visualization",
    "login.sign-in",
    "login.sign-out",
    "login.chart.view",
    "login.chart.edit",
    "login.chart.delete",
    "login.chart.share",
    "login.chart.embed",
    "login.chart.preview",
    "login.chart.rename",
    "login.chart.duplicate",
    "login.profile.my-visualizations",
    "login.profile.my-drafts",
    "login.profile.my-published-visualizations",
    "footer.about_us.label",
    "footer.about_us.text",
    "footer.information.title",
    "footer.statistics",
    "footer.status",
    "footer.tutorials",
    "footer.contact.title",
    "footer.button.lindas",
    "a11y.skip.to.content",
  ];

  let missingPriority = 0;
  for (const key of priorityKeys) {
    if (!uniqueSrLatnKeys.includes(key)) {
      console.log(`   ❌ Missing priority key in sr-Latn: ${key}`);
      missingPriority++;
    }
    if (!uniqueSrCyrlKeys.includes(key)) {
      console.log(`   ❌ Missing priority key in sr-Cyrl: ${key}`);
      missingPriority++;
    }
  }

  if (missingPriority === 0) {
    console.log(
      "✅ All priority UI surface keys are present in both sr-Latn and sr-Cyrl"
    );
  } else {
    console.log(`\n⚠️  Total missing priority keys: ${missingPriority}`);
  }
}

main();
