/**
 * Featured Chart Card Component
 *
 * Enhanced card with thumbnail, gradient, and click handler for modal preview.
 */

import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";
import Link from "next/link";

import { DEMO_CONFIGS } from "@/lib/demos/config";

import { CATEGORY_COLORS, CATEGORY_GRADIENTS } from "../_constants/gradients";

interface FeaturedChartCardProps {
  chart: {
    id: string;
    demoId: string;
    title: { sr: string; en: string };
    description: { sr: string; en: string };
    featuredReason: { sr: string; en: string };
  };
  locale: "sr" | "en";
  href: string;
  onClick: () => void;
}

export function FeaturedChartCard({
  chart,
  locale,
  href,
  onClick,
}: FeaturedChartCardProps) {
  const demoConfig = DEMO_CONFIGS[chart.demoId];
  const icon = demoConfig?.icon || "📊";
  const gradient =
    CATEGORY_GRADIENTS[chart.demoId] || CATEGORY_GRADIENTS.demographics;
  const color = CATEGORY_COLORS[chart.demoId] || CATEGORY_COLORS.demographics;

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "pointer",
        position: "relative",
        "&:hover": {
          transform: "translateY(-8px) scale(1.02)",
          boxShadow: `0 20px 40px ${color}40`,
        },
      }}
    >
      <CardActionArea
        onClick={onClick}
        sx={{ display: "block" }}
        aria-label={
          locale === "sr"
            ? `Brzi pregled grafikona: ${chart.title[locale]}`
            : `Quick preview chart: ${chart.title[locale]}`
        }
      >
        {/* Thumbnail area with gradient */}
        <Box
          sx={{
            height: 120,
            background: gradient,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              fontSize: "3rem",
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardActionArea>

      <CardContent
        sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, mb: 1.5, lineHeight: 1.3 }}
        >
          {chart.title[locale]}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, flex: 1 }}
        >
          {chart.description[locale]}
        </Typography>
        <Chip
          label={chart.featuredReason[locale]}
          size="small"
          sx={{
            alignSelf: "flex-start",
            background: gradient,
            color: "white",
            fontWeight: 600,
            fontSize: "0.75rem",
          }}
        />
      </CardContent>
      <Box sx={{ px: 3, pb: 3 }}>
        <Button
          component={Link}
          href={href}
          size="small"
          variant="outlined"
          fullWidth
          aria-label={
            locale === "sr"
              ? `Otvori stranicu: ${chart.title[locale]}`
              : `Open page: ${chart.title[locale]}`
          }
        >
          {locale === "sr" ? "Otvori stranicu" : "Open page"}
        </Button>
      </Box>
    </Card>
  );
}
