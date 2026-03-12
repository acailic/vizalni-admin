// app/hooks/use-playground-state.ts
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

export type ChartType = "line" | "bar" | "column" | "pie" | "area" | "scatter";

export interface PlaygroundState {
  chartType: ChartType;
  title: string;
  subtitle: string;
  xAxisLabel: string;
  yAxisLabel: string;
  data: Array<Record<string, string | number>>;
  colors: string[];
  showLegend: boolean;
  showGrid: boolean;
}

const DEFAULT_STATE: PlaygroundState = {
  chartType: "bar",
  title: "My Chart",
  subtitle: "",
  xAxisLabel: "Category",
  yAxisLabel: "Value",
  data: [
    { label: "A", value: 30 },
    { label: "B", value: 50 },
    { label: "C", value: 40 },
    { label: "D", value: 70 },
  ],
  colors: ["#0ea5e9", "#2563eb", "#7c3aed", "#db2777"],
  showLegend: true,
  showGrid: true,
};

export function usePlaygroundState() {
  const router = useRouter();
  const [state, setState] = useState<PlaygroundState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load state from URL on mount
  useEffect(() => {
    if (router.isReady && router.query.state) {
      try {
        const compressed = router.query.state as string;
        const decompressed = decompressFromEncodedURIComponent(compressed);
        if (decompressed) {
          const parsed = JSON.parse(decompressed);
          setState({ ...DEFAULT_STATE, ...parsed });
        }
      } catch (e) {
        console.error("Failed to parse playground state from URL", e);
      }
    }
    setIsLoaded(true);
  }, [router.isReady, router.query.state]);

  // Update URL when state changes
  const updateState = useCallback((newState: Partial<PlaygroundState>) => {
    setState((prev) => {
      const updated = { ...prev, ...newState };

      // Debounce URL update
      const compressed = compressToEncodedURIComponent(JSON.stringify(updated));
      const newUrl = `${window.location.pathname}?state=${compressed}`;
      window.history.replaceState({}, "", newUrl);

      return updated;
    });
  }, []);

  const resetState = useCallback(() => {
    setState(DEFAULT_STATE);
    router.push(router.pathname, undefined, { shallow: true });
  }, [router]);

  const getShareUrl = useCallback(() => {
    const compressed = compressToEncodedURIComponent(JSON.stringify(state));
    return `${window.location.origin}/playground?state=${compressed}`;
  }, [state]);

  const getEmbedCode = useCallback(() => {
    const shareUrl = getShareUrl();
    return `<iframe src="${shareUrl}" width="100%" height="500" style="border:0;"></iframe>`;
  }, [getShareUrl]);

  return {
    state,
    updateState,
    resetState,
    getShareUrl,
    getEmbedCode,
    isLoaded,
  };
}
