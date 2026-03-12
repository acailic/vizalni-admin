/**
 * Chart Preview Modal Component
 *
 * Modal with mini chart preview, description, and CTA button.
 */

import { useLingui } from "@lingui/react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import Link from "next/link";

import { DemoErrorBoundary } from "@/components/demos/DemoErrorBoundary";
import { DEMO_CONFIGS } from "@/lib/demos/config";

import { CATEGORY_GRADIENTS } from "../_constants/gradients";

interface ChartPreviewModalProps {
  open: boolean;
  onClose: () => void;
  chart: {
    id: string;
    demoId: string;
    title: { sr: string; en: string };
    description: { sr: string; en: string };
    featuredReason: { sr: string; en: string };
  } | null;
}

const TOPIC_ROUTE_IDS = new Set([
  "economy",
  "health",
  "education",
  "demographics",
  "environment",
  "transport",
]);

const getChartDestination = (demoId: string) =>
  TOPIC_ROUTE_IDS.has(demoId) ? `/topics/${demoId}` : `/demos/${demoId}`;

export function ChartPreviewModal({
  open,
  onClose,
  chart,
}: ChartPreviewModalProps) {
  const { i18n } = useLingui();
  const locale = i18n.locale?.startsWith("sr") ? "sr" : "en";

  if (!chart) return null;

  const demoConfig = DEMO_CONFIGS[chart.demoId];
  const icon = demoConfig?.icon || "📊";
  const gradient =
    CATEGORY_GRADIENTS[chart.demoId] || CATEGORY_GRADIENTS.demographics;

  const isCyrillic = i18n.locale === "sr-Cyrl";
  const isSerbian = locale === "sr";
  const viewDemoText = isCyrillic
    ? "Погледај цео демо"
    : isSerbian
      ? "Pogledaj ceo demo"
      : "View Full Demo";
  const closeText = isCyrillic ? "Zatvori" : isSerbian ? "Zatvori" : "Close";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          pb: 1,
        }}
      >
        <Box sx={{ fontSize: "1.5rem" }}>{icon}</Box>
        <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
          {chart.title[locale]}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <DemoErrorBoundary
          fallback={
            <Box
              sx={{
                height: 200,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 2,
                bgcolor: "grey.100",
                mb: 3,
              }}
            >
              <Typography color="text.secondary">
                Chart preview unavailable
              </Typography>
            </Box>
          }
        >
          {/* Preview area with gradient placeholder */}
          <Box
            sx={{
              height: 200,
              background: gradient,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 3,
            }}
          >
            <svg
              width="180"
              height="100"
              viewBox="0 0 180 100"
              aria-hidden="true"
            >
              <rect x="20" y="54" width="18" height="26" rx="4" fill="white" />
              <rect
                x="48"
                y="34"
                width="18"
                height="46"
                rx="4"
                fill="white"
                opacity="0.9"
              />
              <rect
                x="76"
                y="18"
                width="18"
                height="62"
                rx="4"
                fill="white"
                opacity="0.85"
              />
              <rect
                x="104"
                y="42"
                width="18"
                height="38"
                rx="4"
                fill="white"
                opacity="0.8"
              />
              <polyline
                points="20,40 56,24 88,12 120,28 154,20"
                fill="none"
                stroke="rgba(255,255,255,0.8)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="20" cy="40" r="4" fill="white" />
              <circle cx="56" cy="24" r="4" fill="white" />
              <circle cx="88" cy="12" r="4" fill="white" />
              <circle cx="120" cy="28" r="4" fill="white" />
              <circle cx="154" cy="20" r="4" fill="white" />
            </svg>
          </Box>
        </DemoErrorBoundary>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {chart.description[locale]}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {demoConfig?.description[locale]}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} sx={{ textTransform: "none" }}>
          {closeText}
        </Button>
        <Button
          component={Link}
          href={getChartDestination(chart.demoId)}
          variant="contained"
          sx={{
            textTransform: "none",
            fontWeight: 600,
            background: gradient,
            "&:hover": {
              opacity: 0.9,
            },
          }}
        >
          {viewDemoText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
