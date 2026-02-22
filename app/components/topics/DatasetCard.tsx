// app/components/topics/DatasetCard.tsx
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
} from "@mui/material";
import Link from "next/link";

import type { Dataset, LocalizedString } from "@/types/topics";

function getLocalizedText(text: LocalizedString, locale: string): string {
  if (locale === "sr") return text.sr;
  if (locale === "sr-Latn") return text["sr-Latn"] || text.sr;
  return text.en;
}

interface DatasetCardProps {
  dataset: Dataset;
  locale: string;
}

export function DatasetCard({ dataset, locale }: DatasetCardProps) {
  const title = getLocalizedText(dataset.title, locale);
  const description = getLocalizedText(dataset.description, locale);
  const visualizeLabel =
    locale === "sr"
      ? "Визуализуј"
      : locale === "sr-Latn"
        ? "Vizualizuj"
        : "Visualize";
  const viewOnDataGovLabel =
    locale === "sr"
      ? "Погледај на data.gov.rs"
      : locale === "sr-Latn"
        ? "Pogledaj na data.gov.rs"
        : "View on data.gov.rs";

  const visualizeHref = dataset.recommendedChart
    ? `/create/new?dataset=${dataset.dataGovRsId}&chart=${dataset.recommendedChart}`
    : `/create/new?dataset=${dataset.dataGovRsId}`;

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Typography variant="h6" component="h3" gutterBottom>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {description}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Chip label={dataset.format} size="small" variant="outlined" />
              <Typography variant="caption" color="text.secondary">
                {locale === "sr" || locale === "sr-Latn"
                  ? "Ажурирано"
                  : "Updated"}
                : {dataset.lastUpdated}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
            <Link href={visualizeHref} passHref legacyBehavior>
              <Button variant="contained" color="primary" component="a">
                {visualizeLabel}
              </Button>
            </Link>
            <Link href={dataset.dataGovRsUrl} passHref legacyBehavior>
              <Button
                variant="text"
                size="small"
                component="a"
                target="_blank"
                endIcon={<OpenInNewIcon />}
              >
                {viewOnDataGovLabel}
              </Button>
            </Link>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
