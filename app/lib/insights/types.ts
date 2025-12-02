export type InsightSeverity = 'info' | 'warning' | 'critical';

export type InsightType = 'trend' | 'anomaly' | 'correlation';

export interface Insight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  severity: InsightSeverity;
  metric?: string;
  value?: number | string;
  evidence?: string;
  recommendation?: string;
}

export interface InsightGenerationParams {
  rows: Record<string, any>[];
  locale?: 'sr' | 'en';
  maxInsights?: number;
  datasetName?: string;
}
