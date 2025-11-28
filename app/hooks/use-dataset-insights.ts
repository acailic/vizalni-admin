import { useMemo } from 'react';

import { generateInsights } from '@/lib/insights/generators';
import type { Insight } from '@/lib/insights/types';

interface UseDatasetInsightsOptions {
  rows: Record<string, any>[] | null | undefined;
  datasetName?: string;
  locale?: string;
  maxInsights?: number;
}

interface UseDatasetInsightsResult {
  insights: Insight[];
  loading: boolean;
}

export function useDatasetInsights(options: UseDatasetInsightsOptions): UseDatasetInsightsResult {
  const { rows, datasetName, locale, maxInsights } = options;

  const insights = useMemo(() => {
    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      return [];
    }
    return generateInsights({
      rows,
      datasetName,
      locale: (locale as 'sr' | 'en' | undefined) ?? 'sr',
      maxInsights: maxInsights ?? 5
    });
  }, [rows, datasetName, locale, maxInsights]);

  return { insights, loading: false };
}
