import { spawn } from 'child_process';
import path from 'path';

import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb', // Allow larger payloads for datasets
    },
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { data, value_col, time_col } = req.body;

  if (!data || !Array.isArray(data) || !value_col) {
    return res.status(400).json({ error: 'Invalid input. Required: data (array), value_col (string)' });
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
      res.status(200).json(result);
    } catch (e) {
      console.error('Failed to parse Python output:', outputData);
      res.status(500).json({ error: 'Invalid response from analysis engine' });
    }
  });

  // Send input data to Python script
  pythonProcess.stdin.write(JSON.stringify({ data, value_col, time_col }));
  pythonProcess.stdin.end();
}
