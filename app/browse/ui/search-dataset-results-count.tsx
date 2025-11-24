import { Plural } from "@lingui/macro";
import { Box, Skeleton, Typography } from "@mui/material";
import { List as ListIcon } from "@mui/icons-material";

import { SearchCubeResult } from "@/graphql/query-hooks";

export const SearchDatasetResultsCount = ({
  cubes,
  total,
  isLoading = false,
  hasActiveFilters = false,
}: {
  cubes: SearchCubeResult[];
  total?: number;
  isLoading?: boolean;
  hasActiveFilters?: boolean;
}) => {
  if (isLoading) {
    return (
      <Box display="flex" alignItems="center" gap={1}>
        <Skeleton variant="circular" width={24} height={24} />
        <Skeleton variant="text" width={120} height={32} />
      </Box>
    );
  }

  const countText =
    cubes.length > 0 ? (
      <Plural
        id="dataset.results"
        value={cubes.length}
        zero="No datasets"
        one="# dataset"
        other="# datasets"
      />
    ) : null;

  const contextText = total
    ? `Showing ${cubes.length} of ${total} datasets${hasActiveFilters ? " (filtered)" : ""}`
    : countText;

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <ListIcon sx={{ color: "primary.main" }} aria-label="Dataset list icon" />
      <Typography
        key={cubes.length} // Triggers subtle re-render animation on count change
        variant="h4"
        component="p"
        sx={{ color: "primary.main", fontWeight: 600 }}
        aria-live="polite"
        data-testid="search-results-count"
      >
        {contextText}
      </Typography>
    </Box>
  );
};
