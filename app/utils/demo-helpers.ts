import { DemoLocale, LocaleContent } from '@/types/demos';

export const chartDefaults = {
  column: {
    width: 760,
    height: 360,
    margin: { top: 20, right: 30, bottom: 60, left: 80 }
  },
  line: {
    width: 760,
    height: 360
  },
  pie: {
    width: 540,
    height: 420
  }
} as const;

export const selectLocaleContent = <T,>(
  content: LocaleContent<T>,
  locale: DemoLocale
): T => content[locale];

export interface DemographicBreakdown {
  totalPopulation: number;
  totalMale: number;
  totalFemale: number;
  maleShare: number;
  femaleShare: number;
}

export interface FormatDemographicOptions {
  valuesInThousands?: boolean;
}

export function formatDemographicData(
  ageGroups: Array<{ male: number; female: number }>,
  options: FormatDemographicOptions = { valuesInThousands: true }
): DemographicBreakdown {
  const multiplier = options.valuesInThousands === false ? 1 : 1000;
  const totalMale = ageGroups.reduce((sum, group) => sum + group.male, 0) * multiplier;
  const totalFemale = ageGroups.reduce((sum, group) => sum + group.female, 0) * multiplier;
  const totalPopulation = totalMale + totalFemale;

  const maleShare = totalPopulation ? totalMale / totalPopulation : 0;
  const femaleShare = totalPopulation ? totalFemale / totalPopulation : 0;

  return {
    totalPopulation,
    totalMale,
    totalFemale,
    maleShare,
    femaleShare
  };
}

export interface PopulationPoint {
  year: number;
  total: number;
}

export interface PopulationChangeStats {
  baseYear: number;
  baseValue: number;
  targetYear: number;
  targetValue: number;
  absoluteChange: number;
  percentChange: number;
}

export function calculatePopulationChange(
  data: PopulationPoint[],
  baseYear: number,
  targetYear?: number
): PopulationChangeStats {
  const basePoint = data.find((point) => point.year === baseYear) ?? data[data.length - 2];
  const targetPoint = targetYear
    ? data.find((point) => point.year === targetYear)
    : data[data.length - 1];

  if (!basePoint || !targetPoint) {
    throw new Error('Unable to calculate population change with provided years.');
  }

  const absoluteChange = targetPoint.total - basePoint.total;
  const percentChange = basePoint.total
    ? (absoluteChange / basePoint.total) * 100
    : 0;

  return {
    baseYear: basePoint.year,
    baseValue: basePoint.total,
    targetYear: targetPoint.year,
    targetValue: targetPoint.total,
    absoluteChange,
    percentChange
  };
}
