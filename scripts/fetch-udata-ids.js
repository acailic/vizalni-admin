#!/usr/bin/env node

/**
 * Fetch Dataset IDs from data.gov.rs uData API (api/1)
 *
 * This script searches the data.gov.rs API for specific keywords and
 * finds datasets with CSV/JSON resources to populate DEMO_CONFIGS.
 *
 * Usage: node scripts/fetch-udata-ids.js
 */

const API_BASE = 'https://data.gov.rs/api/1';
const SEARCH_KEYWORDS = [
  'budzet', 'budžet',
  'vazduh', 'vazduha', 'kvalitet vazduha',
  'skole', 'škole', 'obrazovanje',
  'saobracaj', 'saobraćaj'
];
const TARGET_FORMATS = ['csv', 'json', 'xlsx', 'xls'];

/**
 * Search datasets by tag using uData API
 */
async function searchByTag(tag) {
  const url = `${API_BASE}/datasets/?tag=${encodeURIComponent(tag)}&page_size=20`;
  console.log(`\n🔍 Searching for tag: "${tag}"...`);
  console.log(`   URL: ${url}`);

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) return [];
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error(`❌ Error searching for tag "${tag}":`, error.message);
    return [];
  }
}

/**
 * Search datasets by keyword using uData API
 */
async function searchDatasets(query) {
  // uData datasets endpoint
  const url = `${API_BASE}/datasets/?q=${encodeURIComponent(query)}&page_size=20`;

  console.log(`\n🔍 Searching for: "${query}"...`);
  console.log(`   URL: ${url}`);

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'sr-RS,sr;q=0.9,en;q=0.8',
        'Referer': 'https://data.gov.rs/'
      }
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status}: ${response.statusText}\n${text.substring(0, 200)}`);
    }

    const data = await response.json();

    // uData API returns data in data property
    if (data.data) {
      return data.data;
    }

    return [];
  } catch (error) {
    console.error(`❌ Error searching for "${query}":`, error.message);
    return [];
  }
}

/**
 * Filter resources by format
 */
function filterResources(dataset) {
  if (!dataset.resources || dataset.resources.length === 0) {
    return [];
  }

  return dataset.resources.filter(resource => {
    const format = (resource.format || '').toLowerCase();
    return TARGET_FORMATS.includes(format);
  });
}

/**
 * Format date string
 */
function formatDate(dateString) {
  if (!dateString) return 'N/A';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  } catch {
    return dateString;
  }
}

/**
 * Print dataset info
 */
function printDatasetInfo(dataset, resources) {
  console.log('\n' + '='.repeat(80));
  console.log(`📊 ${dataset.title || 'Untitled'}`);
  console.log('='.repeat(80));
  console.log(`Dataset ID:    ${dataset.id || 'N/A'}`);
  console.log(`Organization:  ${dataset.organization?.name || 'N/A'}`);
  console.log(`Created:       ${formatDate(dataset.created_at)}`);
  console.log(`Modified:      ${formatDate(dataset.last_modified)}`);
  console.log(`License:       ${dataset.license || 'N/A'}`);
  console.log(`Page:          ${dataset.page || 'unknown'}`);

  if (dataset.description) {
    let notes = dataset.description;
    if (notes.length > 150) {
      const lastSpace = notes.lastIndexOf(' ', 150);
      if (lastSpace >= 0) {
        notes = notes.substring(0, lastSpace);
      } else {
        notes = notes.substring(0, 150);
      }
      console.log(`Description:   ${notes.replace(/\n/g, ' ')}...`);
    } else {
      console.log(`Description:   ${notes.replace(/\n/g, ' ')}`);
    }
  }

  console.log('\n📁 Resources:');
  resources.forEach((resource, idx) => {
    console.log(`\n  [${idx + 1}] ${resource.title || 'Unnamed Resource'}`);
    console.log(`      Resource ID:   ${resource.id || 'N/A'}`);
    console.log(`      Format:        ${resource.format || 'N/A'}`);
    console.log(`      Size:          ${resource.filesize || 'N/A'}`);
    console.log(`      Created:       ${formatDate(resource.created_at)}`);
    console.log(`      Modified:      ${formatDate(resource.last_modified)}`);
    console.log(`      URL:           ${resource.url || 'N/A'}`);
  });
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Fetching Dataset IDs from data.gov.rs uData API (api/1)');
  console.log('━'.repeat(80));

  const allResults = [];

  for (const keyword of SEARCH_KEYWORDS) {
    let datasets = await searchDatasets(keyword);

    if (datasets.length === 0) {
      // Try tag search for specific keywords
      if (keyword.includes('vazduh')) {
        const tagDatasets = await searchByTag('kvalitet-vazdukha');
        datasets = [...datasets, ...tagDatasets];
      }
    }

    if (datasets.length === 0) {
      console.log(`   No datasets found for "${keyword}"`);
      continue;
    }

    console.log(`   Found ${datasets.length} dataset(s)`);

    for (const dataset of datasets) {
      const resources = filterResources(dataset);

      if (resources.length > 0) {
        allResults.push({ dataset, resources, keyword });
      }
    }

    // Rate limiting - be nice to the API
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n\n');
  console.log('╔' + '═'.repeat(78) + '╗');
  console.log('║' + ' '.repeat(20) + '📋 RESULTS SUMMARY' + ' '.repeat(40) + '║');
  console.log('╚' + '═'.repeat(78) + '╝');

  if (allResults.length === 0) {
    console.log('\n❌ No datasets found with CSV/JSON resources.');
    return;
  }

  console.log(`\n✅ Found ${allResults.length} dataset(s) with CSV/JSON resources:\n`);

  // Group by keyword
  const byKeyword = {};
  for (const result of allResults) {
    if (!byKeyword[result.keyword]) {
      byKeyword[result.keyword] = [];
    }
    byKeyword[result.keyword].push(result);
  }

  // Print grouped results
  for (const keyword of SEARCH_KEYWORDS) {
    const results = byKeyword[keyword];
    if (!results || results.length === 0) continue;

    console.log(`\n${'▀'.repeat(80)}`);
    console.log(`🔑 Keyword: "${keyword}" - ${results.length} dataset(s)`);
    console.log('▄'.repeat(80));

    for (const { dataset, resources } of results) {
      printDatasetInfo(dataset, resources);
    }
  }

  // Print summary for config.ts
  console.log('\n\n');
  console.log('╔' + '═'.repeat(78) + '╗');
  console.log('║' + ' '.repeat(15) + '📝 QUICK REFERENCE FOR config.ts' + ' '.repeat(30) + '║');
  console.log('╚' + '═'.repeat(78) + '╝');
  console.log('\nCopy these IDs into your DEMO_CONFIGS:\n');

  for (const { dataset, resources, keyword } of allResults) {
    console.log(`// Keyword: ${keyword}`);
    console.log(`// Dataset: ${dataset.title}`);
    console.log(`preferredDatasetIds: ['${dataset.id}'],`);

    if (resources.length > 0) {
      console.log(`// Resource ID: ${resources[0].id} (${resources[0].format})`);
    }
    console.log('');
  }

  console.log('\n✨ Done!\n');
}

// Run the script
main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
