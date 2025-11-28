import { useState, useEffect, useCallback } from 'react';
import { Insight } from '../components/insights/InsightCard';

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

export function useDatasetInsights(datasetId: string): UseDatasetInsightsResult {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [summary, setSummary] = useState<{ en: string; sr: string } | undefined>();

  const fetchInsights = useCallback(async () => {
    if (!datasetId) return;

    setLoading(true);
    setError(null);

    try {
      // In a real app, this would fetch from an API endpoint
      // For now, we'll simulate a delay and return mock data or fetch from a static file

      // Check if we have a static insights file for this dataset
      try {
        const response = await fetch(`/api/insights/${datasetId}`);
        if (response.ok) {
          const data = await response.json();
          setInsights(data.insights || []);
          setSummary(data.summary);
          return;
        }
      } catch (e) {
        // Ignore and fall back to mock generation if API fails
      }

      // Fallback: Generate mock insights based on dataset ID for demo purposes
      await new Promise(resolve => setTimeout(resolve, 800));

      let mockInsights: Insight[] = [];
      let mockSummary = { en: '', sr: '' };

      switch (datasetId) {
        case 'economy-demo':
          mockInsights = [
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
          ];
          mockSummary = {
            en: 'Economic indicators show mixed signals with rising inflation but stable GDP growth.',
            sr: 'Ekonomski pokazatelji daju mešovite signale sa rastućom inflacijom ali stabilnim rastom BDP-a.'
          };
          break;

        case 'demographics-demo':
          mockInsights = [
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
          ];
          mockSummary = {
            en: 'Demographic trends indicate critical population decline requiring immediate attention.',
            sr: 'Demografski trendovi ukazuju na kritičan pad populacije koji zahteva hitnu pažnju.'
          };
          break;

        case 'air-quality-demo':
          mockInsights = [
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
          ];
          mockSummary = {
            en: 'Air quality shows strong seasonal patterns with critical winter pollution spikes.',
            sr: 'Kvalitet vazduha pokazuje jake sezonske obrasce sa kritičnim skokovima zagađenja zimi.'
          };
          break;

        default:
          mockInsights = [
            {
              type: 'trend',
              severity: 'info',
              message: {
                en: 'Data shows a stable trend over the last period',
                sr: 'Podaci pokazuju stabilan trend u poslednjem periodu'
              },
              data: { direction: 'stable', confidence: 0.85 }
            }
          ];
          mockSummary = {
            en: 'General analysis shows stable data patterns.',
            sr: 'Opšta analiza pokazuje stabilne obrasce podataka.'
          };
      }

      setInsights(mockInsights);
      setSummary(mockSummary);

    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch insights'));
    } finally {
      setLoading(false);
    }
  }, [datasetId]);

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
