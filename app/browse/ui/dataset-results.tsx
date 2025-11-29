import { Trans } from "@lingui/macro";
import { SearchOff as SearchOffIcon } from "@mui/icons-material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Divider from "@mui/material/Divider";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import { ComponentProps } from "react";
import { CombinedError } from "urql";

import { DatasetResult, DatasetResultProps } from "@/browse/ui/dataset-result";
import { LoadingDataError } from "@/components/hint";
import { SearchCube } from "@/domain/data";
import { SearchCubeResult } from "@/graphql/query-hooks";

export type DatasetResultsProps = ComponentProps<typeof DatasetResults>;

const DatasetSkeleton = ({ index }: { index: number }) => (
  <Fade in timeout={300 + index * 100}>
    <Box
      sx={{ mb: 3, p: 2, border: 1, borderColor: "grey.200", borderRadius: 1 }}
    >
      <Skeleton variant="text" width="70%" height={32} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="90%" height={20} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="50%" height={20} sx={{ mb: 2 }} />
      <Box sx={{ display: "flex", gap: 1 }}>
        <Skeleton variant="rectangular" width={60} height={24} />
        <Skeleton variant="rectangular" width={80} height={24} />
        <Skeleton variant="rectangular" width={70} height={24} />
      </Box>
    </Box>
  </Fade>
);

export const DatasetResults = ({
  fetching,
  error,
  cubes,
  datasetResultProps,
}: {
  fetching: boolean;
  error?: CombinedError;
  cubes: SearchCubeResult[];
  datasetResultProps?: ({
    cube,
  }: {
    cube: SearchCube;
  }) => Partial<DatasetResultProps>;
}) => {
  if (fetching) {
    return (
      <Box>
        {Array.from({ length: 5 }).map((_, index) => (
          <DatasetSkeleton key={index} index={index} />
        ))}
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 8, textAlign: "center" }}>
        <LoadingDataError message={error.message} />
        <Typography variant="body2" sx={{ mt: 2, color: "grey.600" }}>
          <Trans id="troubleshooting.error">
            If the problem persists, try refreshing the page or contact support.
          </Trans>
        </Typography>
        <Button
          variant="outlined"
          sx={{ mt: 2 }}
          onClick={() => window.location.reload()}
        >
          <Trans id="retry">Retry</Trans>
        </Button>
      </Box>
    );
  }

  if (cubes.length === 0) {
    return (
      <Box sx={{ mt: 8, textAlign: "center", color: "grey.600" }}>
        <SearchOffIcon sx={{ fontSize: 64, mb: 2, color: "grey.400" }} />
        <Typography variant="h2" sx={{ mb: 2 }}>
          <Trans id="No results">No results</Trans>
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          <Trans id="empty.state.suggestions">
            Try adjusting your search terms, clearing filters, or exploring
            different categories.
          </Trans>
        </Typography>
        <Button variant="outlined" sx={{ mr: 2 }}>
          <Trans id="clear.filters">Clear Filters</Trans>
        </Button>
        <Button variant="contained">
          <Trans id="browse.all">Browse All Datasets</Trans>
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {cubes.map(
        ({ cube, highlightedTitle, highlightedDescription }, index) => (
          <Fade in key={cube.iri} timeout={300 + index * 50}>
            <Box>
              <DatasetResult
                dataCube={cube}
                highlightedTitle={highlightedTitle}
                highlightedDescription={highlightedDescription}
                {...datasetResultProps?.({ cube })}
              />
              {index < cubes.length - 1 && (
                <Divider sx={{ my: 2, borderColor: "grey.200" }} />
              )}
            </Box>
          </Fade>
        )
      )}
    </Box>
  );
};
