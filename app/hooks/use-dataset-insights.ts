import { useCallback, useEffect, useState } from 'react';

import { Insight } from '../components/insights/InsightCard';

export interface UseDatasetInsightsOptions {
  datasetId?: string;
  sampleData?: any[];
  valueColumn?: string;
  timeColumn?: string;
  maxInsights?: number;
}

interface UseDatasetInsightsResult {
  insights: Insight[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  summary?: {
    en: string;
    sr: string;
  };
}

function normalizeOptions(
  datasetIdOrOptions: string | UseDatasetInsightsOptions,
  options?: UseDatasetInsightsOptions
): UseDatasetInsightsOptions {
  if (typeof datasetIdOrOptions === 'string') {
    return {
      ...(options ?? {}),
      datasetId: datasetIdOrOptions,
    };
  }
  return datasetIdOrOptions;
}

function buildMock(datasetId?: string): { insights: Insight[]; summary: { en: string; sr: string } } {
  switch (datasetId) {
    case 'economy-demo':
      return {
        insights: [
          {
            type: 'trend',
            subtype: 'linear',
            severity: 'warning',
            message: {
              en: 'Inflation shows a significant increasing trend (12.5% growth)',
              sr: 'Inflacija pokazuje značajan rastući trend (12.5% rast)'
            },
            data: { direction: 'increasing', pct_change: 12.5, confidence: 0.95 },
            recommendations: [
              { en: 'Monitor monetary policy impact', sr: 'Pratiti uticaj monetarne politike' }
            ]
          },
          {
            type: 'trend',
            subtype: 'moving_average',
            severity: 'info',
            message: {
              en: 'GDP Growth is stabilizing around 2.5%',
              sr: 'Rast BDP-a se stabilizuje oko 2.5%'
            },
            data: { direction: 'stable', window: 5 },
            recommendations: []
          },
          {
            type: 'correlation',
            severity: 'info',
            message: {
              en: 'Strong correlation between FDI and GDP Growth',
              sr: 'Jaka korelacija između SDI i rasta BDP-a'
            },
            data: { variable: 'FDI', correlation: 0.82 },
            recommendations: [
              { en: 'Focus on attracting foreign investment', sr: 'Fokusirati se na privlačenje stranih investicija' }
            ]
          }
        ],
        summary: {
          en: 'Economic indicators show mixed signals with rising inflation but stable GDP growth.',
          sr: 'Ekonomski pokazatelji daju mešovite signale sa rastućom inflacijom ali stabilnim rastom BDP-a.'
        }
      };
    case 'demographics-demo':
      return {
        insights: [
          {
            type: 'trend',
            subtype: 'linear',
            severity: 'critical',
            message: {
              en: 'Population is declining at an accelerating rate',
              sr: 'Populacija opada ubrzanom stopom'
            },
            data: { direction: 'decreasing', pct_change: -15.2, confidence: 0.98 },
            recommendations: [
              { en: 'Review population retention strategies', sr: 'Preispitati strategije zadržavanja stanovništva' }
            ]
          },
          {
            type: 'anomaly',
            severity: 'warning',
            message: {
              en: 'Spike in emigration detected in 2022',
              sr: 'Detektovan skok u emigraciji tokom 2022.'
            },
            data: { year: 2022, deviation: '2.5 sigma' },
            recommendations: []
          }
        ],
        summary: {
          en: 'Demographic trends indicate critical population decline requiring immediate attention.',
          sr: 'Demografski trendovi ukazuju na kritičan pad populacije koji zahteva hitnu pažnju.'
        }
      };
    case 'air-quality-demo':
      return {
        insights: [
          {
            type: 'trend',
            subtype: 'seasonal',
            severity: 'warning',
            message: {
              en: 'PM2.5 levels peak consistently in January',
              sr: 'Nivoi PM2.5 dostižu vrhunac svakog Januara'
            },
            data: { peak_month: 1, variation_pct: 350 },
            recommendations: [
              { en: 'Prepare winter mitigation measures', sr: 'Pripremiti mere ublažavanja za zimu' }
            ]
          },
          {
            type: 'anomaly',
            severity: 'critical',
            message: {
              en: 'Extreme pollution event detected on 2024-01-15',
              sr: 'Ekstremno zagađenje detektovano 15.01.2024.'
            },
            data: { date: '2024-01-15', value: 185, unit: 'µg/m³' },
            recommendations: [
              { en: 'Issue public health warning', sr: 'Izdati upozorenje za javno zdravlje' }
            ]
          }
        ],
        summary: {
          en: 'Air quality shows strong seasonal patterns with critical winter pollution spikes.',
          sr: 'Kvalitet vazduha pokazuje jake sezonske obrasce sa kritičnim skokovima zagađenja zimi.'
        }
      };
    default:
      return {
        insights: [
          {
            type: 'trend',
            severity: 'info',
            message: {
              en: 'Data shows a stable trend over the last period',
              sr: 'Podaci pokazuju stabilan trend u poslednjem periodu'
            },
            data: { direction: 'stable', confidence: 0.85 }
          }
        ],
        summary: {
          en: 'General analysis shows stable data patterns.',
          sr: 'Opšta analiza pokazuje stabilne obrasce podataka.'
        }
      };
  }
}

export function useDatasetInsights(
  datasetIdOrOptions: string | UseDatasetInsightsOptions,
  options?: UseDatasetInsightsOptions
): UseDatasetInsightsResult {
  const {
    datasetId,
    sampleData,
    valueColumn,
    timeColumn,
  } = normalizeOptions(datasetIdOrOptions, options);

  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [summary, setSummary] = useState<{ en: string; sr: string } | undefined>();

  const fetchInsights = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Prefer real analysis when sample data is available
      if (sampleData && sampleData.length > 0 && valueColumn) {
        const payload = {
          data: sampleData.slice(0, 1000),
          value_col: valueColumn,
          time_col: timeColumn,
        };

        const response = await fetch('/api/insights/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const details = await response.text();
          throw new Error(details || 'Failed to generate insights');
        }

        const result = await response.json();
        setInsights(result.insights || []);
        setSummary(result.summary);
        return;
      }

      // Try precomputed insights if we have a datasetId
      if (datasetId) {
        try {
          const response = await fetch(`/api/insights/${datasetId}`);
          if (response.ok) {
            const data = await response.json();
            setInsights(data.insights || []);
            setSummary(data.summary);
            return;
          }
        } catch {
          // Ignore and fall back to mock generation if API fails
        }
      }

      // Fallback mock insights to keep UI functional
      await new Promise(resolve => setTimeout(resolve, 400));
      const mock = buildMock(datasetId);
      setInsights(mock.insights);
      setSummary(mock.summary);

    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch insights'));
    } finally {
      setLoading(false);
    }
  }, [datasetId, sampleData, valueColumn, timeColumn]);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  return {
    insights,
    loading,
    error,
    refresh: fetchInsights,
    summary
  };
}
