import { Trans } from "@lingui/macro";
import {
  Divider,
  Card,
  CircularProgress,
  Typography,
  Switch,
} from "@mui/material";

import { BrowseState } from "@/browse/model/context";
// import { SearchDatasetDraftsControl } from "@/browse/ui/search-dataset-drafts-control"; // Removed, using Switch instead
import { PartialSearchCube } from "@/browse/ui/dataset-result";
import { SearchDatasetResultsCount } from "@/browse/ui/search-dataset-results-count";
import { SearchDatasetSortControl } from "@/browse/ui/search-dataset-sort-control";
import { Flex } from "@/components/flex";
import { SearchCubeResultOrder } from "@/graphql/resolver-types";
import { sleep } from "@/utils/sleep";
import { useEvent } from "@/utils/use-event";

type SearchCubeResult = {
  cube: PartialSearchCube;
  highlightedTitle?: string | null;
  highlightedDescription?: string | null;
};

export const SearchDatasetControls = ({
  browseState: {
    inputRef,
    search,
    onSubmitSearch,
    includeDrafts,
    setIncludeDrafts,
    order = SearchCubeResultOrder.CreatedDesc,
    onSetOrder,
  },
  cubes,
}: {
  browseState: BrowseState;
  cubes: SearchCubeResult[];
}) => {
  const isSearching = search !== "" && search !== undefined;

  const onToggleIncludeDrafts = useEvent(async () => {
    setIncludeDrafts(!includeDrafts);
    const input = inputRef.current;

    if (input && input.value.length > 0) {
      // We need to wait here otherwise the includeDrafts is reset :/
      await sleep(200);
      onSubmitSearch(input.value);
    }
  });

  return (
    <Card sx={{ p: 2, backgroundColor: "grey.50", mb: 2 }}>
      <Flex sx={{ justifyContent: "space-between", alignItems: "center" }}>
        {isSearching && cubes.length === 0 ? (
          <CircularProgress size={24} />
        ) : (
          <SearchDatasetResultsCount cubes={cubes} />
        )}
        <Flex sx={{ alignItems: "center", gap: 3 }}>
          <Typography variant="body2" sx={{ mr: 1 }}>
            <Trans id="dataset.includeDrafts">Include draft datasets</Trans>
          </Typography>
          <Switch
            checked={includeDrafts}
            onChange={() => onToggleIncludeDrafts()}
          />
          <Divider flexItem orientation="vertical" />
          <SearchDatasetSortControl
            value={order}
            onChange={onSetOrder}
            disableScore={!isSearching}
          />
          {/* Future: Add view toggle for list/grid */}
        </Flex>
      </Flex>
    </Card>
  );
};
