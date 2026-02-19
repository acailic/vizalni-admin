// app/charts/line/rendering-utils.ts
// Utility functions for LineChart rendering

export type TrendDirection = "up" | "down" | "neutral";

export function calculateTrendDirection(
  previousValue: number,
  currentValue: number
): TrendDirection {
  const diff = currentValue - previousValue;
  if (diff > 0) return "up";
  if (diff < 0) return "down";
  return "neutral";
}
