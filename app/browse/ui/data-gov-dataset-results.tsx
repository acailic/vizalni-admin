import { Trans } from "@lingui/macro";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Loading, LoadingDataError } from "@/components";
import { DatasetMetadata } from "@/domain/data-gov-rs";

export const DataGovDatasetResults = ({
  results,
  fetching,
  error,
}: {
  results: DatasetMetadata[];
  fetching: boolean;
  error?: Error;
}) => {
  if (fetching) {
    return <Loading />;
  }

  if (error) {
    return <LoadingDataError message={error.message} />;
  }

  if (results.length === 0) {
    return (
      <Typography
        variant="h2"
        sx={{ mt: 8, color: "grey.600", textAlign: "center" }}
      >
        <Trans id="No results">No results</Trans>
      </Typography>
    );
  }

  return (
    <Stack spacing={4} sx={{ my: 4 }}>
      {results.map((dataset) => (
        <Card key={dataset.id} variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent>
            <Stack spacing={2}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                flexWrap="wrap"
                gap={2}
              >
                <Typography variant="h5" fontWeight={700}>
                  {dataset.title}
                </Typography>
                <Button
                  component="a"
                  href={dataset.page || `https://data.gov.rs/sr/datasets/${dataset.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                >
                  <Trans id="browse.dataset.open-data-gov">
                    Pogledaj na data.gov.rs
                  </Trans>
                </Button>
              </Stack>
              {dataset.description ? (
                <Typography variant="body2" color="text.secondary">
                  {dataset.description}
                </Typography>
              ) : null}
              <Stack direction="row" spacing={2} flexWrap="wrap" rowGap={1}>
                {dataset.organization?.name ? (
                  <TagPill>
                    <Trans id="browse.dataset.organization">
                      Organizacija:
                    </Trans>{" "}
                    {dataset.organization.name}
                  </TagPill>
                ) : null}
                {dataset.tags?.slice(0, 4).map((tag) => (
                  <TagPill key={tag}>#{tag}</TagPill>
                ))}
                {dataset.frequency ? (
                  <TagPill>
                    <Trans id="browse.dataset.frequency">Ažuriranje</Trans>:{" "}
                    {dataset.frequency}
                  </TagPill>
                ) : null}
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};

const TagPill = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      component="span"
      sx={{
        display: "inline-block",
        px: 1.5,
        py: 0.5,
        borderRadius: 2,
        backgroundColor: "monochrome.100",
        color: "text.primary",
        fontSize: 12,
      }}
    >
      {children}
    </Box>
  );
};
