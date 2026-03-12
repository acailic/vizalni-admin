import { spawn } from 'child_process';
import path from 'path';

import { populationTrends } from '@/data/serbia-demographics';
import { economicIndicators } from '@/data/serbia-economy';
import { energyProduction } from '@/data/serbia-energy';
import { DEMO_FALLBACKS } from '@/lib/demos/fallbacks';

import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

type DatasetConfig = {
  data: any[];
  value_col: string;
  time_col?: string;
};

const DATASETS: Record<string, DatasetConfig> = {
  'economy-demo': {
    data: economicIndicators,
    value_col: 'gdpGrowth',
    time_col: 'year',
  },
  'demographics-demo': {
    data: populationTrends,
    value_col: 'total',
    time_col: 'year',
  },
  'energy-demo': {
    data: energyProduction,
    value_col: 'totalProductionGWh',
    time_col: 'year',
  },
  'air-quality-demo': {
    data: DEMO_FALLBACKS['air-quality']?.fallbackData ?? [],
    value_col: 'PM25',
    time_col: 'Godina',
  },
  'transport-demo': {
    data: DEMO_FALLBACKS['transport']?.fallbackData ?? [],
    value_col: 'Poginuli',
    time_col: 'Godina',
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const datasetId = String(req.query.datasetId || '').trim();
  if (!datasetId) {
    return res.status(400).json({ error: 'datasetId is required' });
  }

  const datasetConfig = DATASETS[datasetId];
  if (!datasetConfig || !Array.isArray(datasetConfig.data) || datasetConfig.data.length === 0) {
    return res.status(404).json({ error: 'Dataset not found or has no fallback data' });
  }

  const scriptPath = path.join(process.cwd(), 'amplifier/scenarios/dataset_insights/run_analysis.py');
  const pythonProcess = spawn('python3', [scriptPath]);

  let outputData = '';
  let errorData = '';

  pythonProcess.stdout.on('data', (chunk) => {
    outputData += chunk.toString();
  });

  pythonProcess.stderr.on('data', (chunk) => {
    errorData += chunk.toString();
    console.error(`Python Error: ${chunk}`);
  });

  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`Python process exited with code ${code}`);
      return res.status(500).json({ error: 'Analysis failed', details: errorData });
    }

    try {
      const result = JSON.parse(outputData);
      if (result.error) {
        return res.status(500).json({ error: result.error });
      }
      return res.status(200).json({ datasetId, ...result });
    } catch (e) {
      console.error('Failed to parse Python output:', outputData);
      return res.status(500).json({ error: 'Invalid response from analysis engine' });
    }
  });

  const payload = {
    data: datasetConfig.data.slice(0, 2000),
    value_col: datasetConfig.value_col,
    time_col: datasetConfig.time_col,
  };

  pythonProcess.stdin.write(JSON.stringify(payload));
  pythonProcess.stdin.end();
}
