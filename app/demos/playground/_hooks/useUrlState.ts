// app/pages/demos/playground/_hooks/useUrlState.ts
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import { useCallback } from "react";

import type { PlaygroundState } from "../_types";

/**
 * Shareable state interface for URL serialization.
 * Uses short property names to minimize URL length.
 * yAxis is stored as array for consistent handling of single/multi-series.
 */
interface ShareableState {
  t: PlaygroundState["chartType"];
  d: PlaygroundState["data"];
  c: {
    x: string;
    y: string | string[];
    color?: string;
  };
  th: string;
}

/**
 * Type guard to validate that a parsed object is a valid ShareableState
 */
function isShareableState(value: unknown): value is ShareableState {
  if (typeof value !== "object" || value === null) return false;

  const obj = value as Record<string, unknown>;

  // Validate required fields
  if (typeof obj.t !== "string") return false;
  if (!Array.isArray(obj.d)) return false;
  if (typeof obj.th !== "string") return false;

  // Validate config object
  if (typeof obj.c !== "object" || obj.c === null) return false;
  const config = obj.c as Record<string, unknown>;
  if (typeof config.x !== "string") return false;

  // yAxis can be string or string[]
  if (typeof config.y !== "string" && !Array.isArray(config.y)) return false;
  if (
    Array.isArray(config.y) &&
    !config.y.every((y) => typeof y === "string")
  ) {
    return false;
  }

  // color is optional but must be string if present
  if (config.color !== undefined && typeof config.color !== "string")
    return false;

  return true;
}

export function compressState(state: PlaygroundState): string {
  const shareable: ShareableState = {
    t: state.chartType,
    d: state.data,
    c: {
      x: state.config.xAxis,
      y: state.config.yAxis,
      color: state.config.color,
    },
    th: state.themeId,
  };
  return compressToEncodedURIComponent(JSON.stringify(shareable));
}

export function decompressState(
  compressed: string
): Partial<PlaygroundState> | null {
  try {
    const decompressed = decompressFromEncodedURIComponent(compressed);
    if (!decompressed) return null;

    const parsed: unknown = JSON.parse(decompressed);

    // Validate the structure before using it
    if (!isShareableState(parsed)) return null;

    return {
      chartType: parsed.t,
      data: parsed.d,
      config: {
        xAxis: parsed.c.x,
        yAxis: parsed.c.y,
        color: parsed.c.color,
      },
      themeId: parsed.th,
    };
  } catch {
    return null;
  }
}

export function useUrlState() {
  const getShareUrl = useCallback((state: PlaygroundState): string => {
    const compressed = compressState(state);
    if (typeof window === "undefined") return "";
    const url = new URL(window.location.href);
    url.searchParams.set("s", compressed);
    return url.toString();
  }, []);

  const getStateFromUrl = useCallback((): Partial<PlaygroundState> | null => {
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    const compressed = params.get("s");
    if (!compressed) return null;
    return decompressState(compressed);
  }, []);

  return { getShareUrl, getStateFromUrl };
}
