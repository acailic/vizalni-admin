import type { Insight, InsightGenerationParams, InsightSeverity } from './types';

const DEFAULT_MAX = 5;

function normalizeLocale(locale?: string): 'sr' | 'en' {
  return locale && locale.startsWith('sr') ? 'sr' : 'en';
}

function severityFromChange(percent: number): InsightSeverity {
  const abs = Math.abs(percent);
  if (abs >= 40) return 'critical';
  if (abs >= 20) return 'warning';
  return 'info';
}

function severityFromZ(z: number): InsightSeverity {
  const abs = Math.abs(z);
  if (abs >= 3) return 'critical';
  if (abs >= 2.2) return 'warning';
  return 'info';
}

function severityFromCorrelation(r: number): InsightSeverity {
  const abs = Math.abs(r);
  if (abs >= 0.85) return 'critical';
  if (abs >= 0.7) return 'warning';
  return 'info';
}

function formatPercent(num: number): string {
  return `${num.toFixed(1)}%`;
}

function detectNumericFields(rows: Record<string, any>[]): string[] {
  if (!rows.length) return [];
  const sample = rows[0];
  return Object.keys(sample).filter((key) => {
    const value = sample[key];
    if (value === null || value === undefined) return false;
    if (typeof value === 'number') return true;
    const parsed = Number(value);
    if (Number.isNaN(parsed)) return false;
    const lowerKey = key.toLowerCase();
    return !lowerKey.includes('date') && !lowerKey.includes('time');
  });
}

function collectSeries(rows: Record<string, any>[], field: string): number[] {
  return rows
    .map((row) => Number(row[field]))
    .filter((value) => Number.isFinite(value));
}

function computeTrend(values: number[]) {
  if (values.length < 5) return null;
  const n = values.length;
  const meanX = (n - 1) / 2;
  const meanY = values.reduce((a, b) => a + b, 0) / n;

  let numerator = 0;
  let denominator = 0;
  values.forEach((y, i) => {
    const dx = i - meanX;
    numerator += dx * (y - meanY);
    denominator += dx * dx;
  });
  const slope = denominator ? numerator / denominator : 0;
  const percentChange = values[0] !== 0 ? ((values[n - 1] - values[0]) / Math.abs(values[0])) * 100 : 0;
  return { slope, percentChange };
}

function computeAnomalies(values: number[]) {
  if (values.length < 8) return [];
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance =
    values.reduce((acc, v) => acc + (v - mean) * (v - mean), 0) / values.length;
  const std = Math.sqrt(variance);
  if (!std || Number.isNaN(std)) return [];

  return values
    .map((v, idx) => {
      const z = (v - mean) / std;
      return { index: idx, value: v, z };
    })
    .filter((entry) => Math.abs(entry.z) >= 2)
    .sort((a, b) => Math.abs(b.z) - Math.abs(a.z))
    .slice(0, 1);
}

function computeCorrelation(a: number[], b: number[]) {
  const n = Math.min(a.length, b.length);
  if (n < 10) return null;
  const sliceA = a.slice(0, n);
  const sliceB = b.slice(0, n);
  const meanA = sliceA.reduce((s, v) => s + v, 0) / n;
  const meanB = sliceB.reduce((s, v) => s + v, 0) / n;

  let num = 0;
  let denA = 0;
  let denB = 0;
  for (let i = 0; i < n; i++) {
    const da = sliceA[i] - meanA;
    const db = sliceB[i] - meanB;
    num += da * db;
    denA += da * da;
    denB += db * db;
  }
  const denom = Math.sqrt(denA * denB);
  if (!denom) return null;
  return num / denom;
}

function generateTrendInsights(fields: string[], rows: Record<string, any>[], locale: 'sr' | 'en'): Insight[] {
  const insights: Insight[] = [];

  fields.forEach((field) => {
    const series = collectSeries(rows, field);
    const trend = computeTrend(series);
    if (!trend || Math.abs(trend.percentChange) < 10) return;

    const severity = severityFromChange(trend.percentChange);
    const rising = trend.percentChange > 0;
    const title =
      locale === 'sr'
        ? rising
          ? `Rastući trend za ${field}`
          : `Opadajući trend za ${field}`
        : rising
          ? `Upward trend for ${field}`
          : `Downward trend for ${field}`;
    const description =
      locale === 'sr'
        ? `Vrednosti su se promenile za ${formatPercent(trend.percentChange)} u odnosu na početni period.`
        : `Values shifted by ${formatPercent(trend.percentChange)} versus the starting period.`;
    const recommendation =
      locale === 'sr'
        ? rising
          ? 'Ispitajte uzroke porasta i uvećajte monitoring.'
          : 'Proverite da li pad odražava poboljšanje ili manjak podataka.'
        : rising
          ? 'Investigate drivers of the increase and tighten monitoring.'
          : 'Check whether the drop reflects improvement or missing data.';

    insights.push({
      id: `trend-${field}`,
      type: 'trend',
      title,
      description,
      severity,
      metric: field,
      value: trend.percentChange,
      recommendation
    });
  });

  return insights;
}

function generateAnomalyInsights(fields: string[], rows: Record<string, any>[], locale: 'sr' | 'en'): Insight[] {
  const insights: Insight[] = [];

  fields.forEach((field) => {
    const series = collectSeries(rows, field);
    const anomalies = computeAnomalies(series);
    if (!anomalies.length) return;
    const { index, value, z } = anomalies[0];
    const severity = severityFromZ(z);
    const title =
      locale === 'sr'
        ? `Uočen izuzetan skok u ${field}`
        : `Significant spike detected in ${field}`;
    const description =
      locale === 'sr'
        ? `Vrednost na poziciji ${index + 1} odstupa ${z.toFixed(1)}σ od proseka.`
        : `Value at position ${index + 1} deviates ${z.toFixed(1)}σ from the mean.`;
    const recommendation =
      locale === 'sr'
        ? 'Potvrdite izvor podataka i proverite da li je u pitanju incident ili greška.'
        : 'Verify data source to confirm if this is an incident or data issue.';

    insights.push({
      id: `anomaly-${field}-${index}`,
      type: 'anomaly',
      title,
      description,
      severity,
      metric: field,
      value,
      evidence: `z=${z.toFixed(2)}`,
      recommendation
    });
  });

  return insights;
}

function generateCorrelationInsights(fields: string[], rows: Record<string, any>[], locale: 'sr' | 'en'): Insight[] {
  const insights: Insight[] = [];

  for (let i = 0; i < fields.length; i++) {
    for (let j = i + 1; j < fields.length; j++) {
      const a = collectSeries(rows, fields[i]);
      const b = collectSeries(rows, fields[j]);
      const r = computeCorrelation(a, b);
      if (r === null || Math.abs(r) < 0.65) continue;
      const severity = severityFromCorrelation(r);
      const title =
        locale === 'sr'
          ? `Jaka veza između ${fields[i]} i ${fields[j]}`
          : `Strong link between ${fields[i]} and ${fields[j]}`;
      const direction =
        r > 0
          ? locale === 'sr'
            ? 'pozitivno'
            : 'positively'
          : locale === 'sr'
            ? 'negativno'
            : 'negatively';
      const description =
        locale === 'sr'
          ? `Metrike su ${direction} korelisane (r=${r.toFixed(2)}).`
          : `Metrics are ${direction} correlated (r=${r.toFixed(2)}).`;
      const recommendation =
        locale === 'sr'
          ? 'Istražite da li postoji uzročno-posledična veza ili zajednički faktor.'
          : 'Investigate causal links or shared drivers.';

      insights.push({
        id: `corr-${fields[i]}-${fields[j]}`,
        type: 'correlation',
        title,
        description,
        severity,
        metric: `${fields[i]} ↔ ${fields[j]}`,
        value: r,
        recommendation
      });
    }
  }

  return insights;
}

export function generateInsights(params: InsightGenerationParams): Insight[] {
  const { rows, locale: rawLocale, maxInsights = DEFAULT_MAX } = params;
  if (!rows || rows.length === 0) return [];

  const locale = normalizeLocale(rawLocale);
  const numericFields = detectNumericFields(rows);
  if (!numericFields.length) return [];

  const trendInsights = generateTrendInsights(numericFields, rows, locale);
  const anomalyInsights = generateAnomalyInsights(numericFields, rows, locale);
  const correlationInsights = generateCorrelationInsights(numericFields, rows, locale);

  const combined = [...trendInsights, ...anomalyInsights, ...correlationInsights];
  combined.sort((a, b) => {
    const priority = { critical: 3, warning: 2, info: 1 } as const;
    return priority[b.severity] - priority[a.severity];
  });

  return combined.slice(0, maxInsights);
}
