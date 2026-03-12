import { useEffect, useRef } from "react";

export const useTrackChartView = (configKey?: string) => {
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    if (!configKey || hasTrackedRef.current) {
      return;
    }

    hasTrackedRef.current = true;

    void fetch("/api/config/view", {
      method: "POST",
      body: JSON.stringify({ type: "view", configKey }),
    });
  }, [configKey]);
};
