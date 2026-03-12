// app/charts/shared/interaction/guidance-hint.tsx
import { Box, Typography } from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";

const GUIDANCE_STORAGE_KEY = "vizualni-guidance-seen";

interface UseGuidanceResult {
  shouldShow: boolean;
  dismiss: () => void;
}

export function useGuidance(chartId: string): UseGuidanceResult {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(`${GUIDANCE_STORAGE_KEY}-${chartId}`);
    setShouldShow(seen !== "true");
  }, [chartId]);

  const dismiss = useCallback(() => {
    localStorage.setItem(`${GUIDANCE_STORAGE_KEY}-${chartId}`, "true");
    setShouldShow(false);
  }, [chartId]);

  return { shouldShow, dismiss };
}

interface GuidanceHintProps {
  message: string;
  chartId?: string;
  autoDismissMs?: number;
}

export function GuidanceHint({
  message,
  chartId = "default",
  autoDismissMs = 5000,
}: GuidanceHintProps) {
  const { shouldShow, dismiss } = useGuidance(chartId);

  useEffect(() => {
    if (shouldShow && autoDismissMs > 0) {
      const timer = setTimeout(dismiss, autoDismissMs);
      return () => clearTimeout(timer);
    }
  }, [shouldShow, autoDismissMs, dismiss]);

  if (!shouldShow) return null;

  return (
    <Box
      sx={{
        position: "absolute",
        top: 16,
        right: 16,
        backgroundColor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        padding: 1.5,
        boxShadow: 2,
        animation: "fadeIn 0.3s ease-out",
        "@keyframes fadeIn": {
          "0%": { opacity: 0, transform: "translateY(-8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      <Typography variant="caption" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}
