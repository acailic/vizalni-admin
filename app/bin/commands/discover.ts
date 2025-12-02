import fs from 'fs/promises';
import path from 'path';

import chalk from 'chalk';
import { table } from 'table';

import { dataGovRsClient } from '../../domain/data-gov-rs/client';

// Assuming DatasetMetadata has these fields based on typical CKAN API
interface DatasetMetadata {
  id: string;
  title: string;
  organization?: { title?: string };
  resources?: { format: string }[];
  quality_score?: number;
}

export interface DiscoverOptions {
  query?: string;
  category?: string;
  organization?: string;
  threshold?: number;
  save?: string;
  limit?: number;
}

export async function discoverCommand(options: DiscoverOptions) {
  try {
    console.log(chalk.blue('Searching data.gov.rs...'));

    const threshold = options.threshold ?? 0;

    const params = {
      q: options.query,
      tag: options.category,
      organization: options.organization,
      page_size: options.limit,
    };

    const response = await dataGovRsClient.searchDatasets(params);
    let datasets: DatasetMetadata[] = response.data;

    // Filter by quality threshold if specified
    if (threshold > 0) {
      datasets = datasets.filter((d) => (d.quality_score || 0) >= threshold);
    }

    if (datasets.length === 0) {
      console.log(chalk.yellow('No datasets found matching criteria.'));
      return;
    }

    // Prepare table data
    const tableData = [
      ['Name', 'Organization', 'Format', 'Quality Score'],
      ...datasets.map((d) => [
        d.title,
        d.organization?.title || 'Unknown',
        d.resources?.[0]?.format || 'Unknown',
        d.quality_score?.toFixed(2) || 'N/A',
      ]),
    ];

    console.log(table(tableData));

    // Save to file if specified
    if (options.save) {
      const configPath = path.resolve(options.save);
      const config = {
        discovered: new Date().toISOString(),
        datasets: datasets.map((d) => ({
          id: d.id,
          title: d.title,
          organization: d.organization?.title,
          format: d.resources?.[0]?.format,
          quality_score: d.quality_score,
        })),
      };

      await fs.writeFile(configPath, JSON.stringify(config, null, 2));
      console.log(chalk.green(`Results saved to ${configPath}`));
    }
  } catch (error) {
    console.error(chalk.red('Error discovering datasets:'), (error as Error).message);
    process.exit(1);
  }
}
