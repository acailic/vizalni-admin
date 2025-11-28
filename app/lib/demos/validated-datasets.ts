import validated from './validated-datasets.json';

export const VALIDATED_DATASETS: Record<string, string[]> = validated;

export function getValidatedDatasetIds(demoId: string): string[] {
  return VALIDATED_DATASETS[demoId] ?? [];
}
