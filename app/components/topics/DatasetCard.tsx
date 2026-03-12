// app/components/topics/DatasetCard.tsx
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Stack,
} from "@mui/material";
import Link from "next/link";

import type { Dataset, LocalizedString } from "@/types/topics";
import { cyrillicToLatin } from "@/utils/serbian-script";

function getLocalizedText(text: LocalizedString, locale: string): string {
  if (locale === "sr-Cyrl") return text.sr;
  if (locale.startsWith("sr")) {
    return text["sr-Latn"] || cyrillicToLatin(text.sr);
  }
  return text.en;
}

interface DatasetCardProps {
  dataset: Dataset;
  locale: string;
}

export function DatasetCard({ dataset, locale }: DatasetCardProps) {
  const title = getLocalizedText(dataset.title, locale);
  const description =
    getLocalizedText(dataset.description, locale).trim() ||
    (locale === "sr-Cyrl"
      ? "Опис није доступан за овај скуп података."
      : locale.startsWith("sr")
        ? "Opis nije dostupan za ovaj skup podataka."
        : "Description is not available for this dataset.");
  const openLabel =
    locale === "sr-Cyrl"
      ? "Отвори на data.gov.rs"
      : locale.startsWith("sr")
        ? "Otvori na data.gov.rs"
        : "Open on data.gov.rs";
  const updatedLabel =
    locale === "sr-Cyrl"
      ? "Ажурирано"
      : locale.startsWith("sr")
        ? "Ažurirano"
        : "Updated";
  const unknownLabel =
    locale === "en"
      ? "Unknown"
      : locale === "sr-Cyrl"
        ? "Непознато"
        : "Nepoznato";

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
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              alignItems={{ xs: "flex-start", sm: "center" }}
            >
              <Chip
                label={dataset.format || unknownLabel}
                size="small"
                variant="outlined"
                data-testid="dataset-format"
              />
              <Typography
                variant="caption"
                color="text.secondary"
                component="span"
                data-testid="dataset-updated"
                sx={{
                  display: "inline-flex",
                  alignItems: "baseline",
                  gap: 0.5,
                  flexWrap: "nowrap",
                  whiteSpace: "nowrap",
                }}
              >
                <Box component="span">{`${updatedLabel}:`}</Box>
                <Box component="span">
                  {dataset.lastUpdated || unknownLabel}
                </Box>
              </Typography>
            </Stack>
          </Box>
          <Box sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
            <Link href={dataset.dataGovRsUrl} passHref legacyBehavior>
              <Button
                variant="contained"
                color="primary"
                component="a"
                target="_blank"
                endIcon={<OpenInNewIcon />}
              >
                {openLabel}
              </Button>
            </Link>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
