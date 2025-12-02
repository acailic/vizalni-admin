/**
 * Lightweight schema profiler to make visualizations resilient to schema drift.
 * - Detects numeric/text/date columns
 * - Suggests chart types
 * - Picks default category/value columns
 */

export type ChartKind = 'line' | 'column' | 'bar' | 'pie' | 'scatterplot';

export interface SchemaProfile {
  totalRows: number;
  numericColumns: string[];
  textColumns: string[];
  dateColumns: string[];
}

function isProbablyDate(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  // ISO date or YYYY-MM or DD.MM.YYYY patterns
  return Boolean(
    value.match(/^\d{4}-\d{2}(-\d{2})?/) ||
      value.match(/^\d{2}\.\d{2}\.\d{4}$/) ||
      value.match(/^\d{4}\/\d{2}\/\d{2}$/)
  );
}

export function profileData(data: any[], sampleSize: number = 30): SchemaProfile {
  if (!Array.isArray(data) || data.length === 0) {
    return { totalRows: 0, numericColumns: [], textColumns: [], dateColumns: [] };
  }

  const sample = data.slice(0, sampleSize);
  const columns = Object.keys(sample[0] ?? {});

  const numericColumns: string[] = [];
  const textColumns: string[] = [];
  const dateColumns: string[] = [];

  for (const column of columns) {
    const values = sample.map((row) => row[column]).filter((v) => v !== undefined && v !== null);
    if (values.length === 0) continue;

    const numericCount = values.filter((v) => !Number.isNaN(Number(v))).length;
    const dateCount = values.filter((v) => isProbablyDate(v)).length;

    if (dateCount >= values.length * 0.6) {
      dateColumns.push(column);
      continue;
    }

    if (numericCount >= values.length * 0.6) {
      numericColumns.push(column);
      continue;
    }

    textColumns.push(column);
  }

  return {
    totalRows: data.length,
    numericColumns,
    textColumns,
    dateColumns
  };
}

export function suggestChartType(profile: SchemaProfile): ChartKind {
  if (profile.dateColumns.length > 0 && profile.numericColumns.length > 0) {
    return 'line';
  }
  if (profile.numericColumns.length >= 2 && profile.textColumns.length > 0) {
    return 'column';
  }
  if (profile.numericColumns.length >= 1 && profile.textColumns.length > 0) {
    return 'bar';
  }
  if (profile.numericColumns.length >= 1 && profile.textColumns.length === 0) {
    return 'column';
  }
  if (profile.textColumns.length > 0 && profile.numericColumns.length === 0) {
    return 'pie';
  }
  return 'bar';
}

export function selectColumns(profile: SchemaProfile): {
  category: string | null;
  value: string | null;
} {
  const category = profile.dateColumns[0] ?? profile.textColumns[0] ?? null;
  const value = profile.numericColumns[0] ?? profile.numericColumns[1] ?? null;
  return { category, value };
}
