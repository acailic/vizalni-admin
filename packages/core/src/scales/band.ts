import { scaleBand } from "d3-scale";

export interface BandScaleOptions {
  /** Input domain (categories) */
  domain: string[];
  /** Output range [min, max] */
  range: [number, number];
  /** Padding between bars (0-1) */
  padding?: number;
  /** Padding between bars (0-1) */
  paddingInner?: number;
  /** Padding at edges (0-1) */
  paddingOuter?: number;
  /** Round output values to integers */
  round?: boolean;
}

/**
 * Creates a band scale for categorical data
 */
export function createBandScale(options: BandScaleOptions) {
  const {
    domain,
    range,
    padding = 0.1,
    paddingInner,
    paddingOuter,
    round = false,
  } = options;

  const scale = scaleBand<string>().domain(domain).range(range).round(round);

  if (paddingInner !== undefined && paddingOuter !== undefined) {
    scale.paddingInner(paddingInner).paddingOuter(paddingOuter);
  } else {
    scale.padding(padding);
  }

  return scale;
}
