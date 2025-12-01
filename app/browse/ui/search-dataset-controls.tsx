import {
  Divider,
  Card,
  Button,
  CircularProgress,
  Typography,
  Switch,
} from "@mui/material";

import { BrowseState } from "@/browse/model/context";
// import { SearchDatasetDraftsControl } from "@/browse/ui/search-dataset-drafts-control"; // Removed, using Switch instead
import { SearchDatasetResultsCount } from "@/browse/ui/search-dataset-results-count";
import { SearchDatasetSortControl } from "@/browse/ui/search-dataset-sort-control";
import { PartialSearchCube } from "@/browse/ui/dataset-result";
import { Flex } from "@/components/flex";
import { SearchCubeResultOrder } from "@/graphql/resolver-types";
import { Icon } from "@/icons";
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
  const prefillEducation = useEvent(() => {
    const educationTerms = [
      "obrazovanje",
      "ucenici",
      "studenti",
      "skola",
      "nastava",
      "osnovno obrazovanje",
      "srednje obrazovanje",
      "visoko obrazovanje",
    ];
    onSubmitSearch(educationTerms.join(" OR "));
  });
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
          {/* Quick actions for common searches */}
          <Flex sx={{ gap: 1, mr: 2 }}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => onSubmitSearch("recent")}
            >
              Recent
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => onSubmitSearch("popular")}
            >
              Popular
            </Button>
          </Flex>
          <span
            role="button"
            tabIndex={0}
            aria-label="Pretraži obrazovanje"
            onClick={prefillEducation}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                prefillEducation();
              }
            }}
            style={{
              display: "inline-flex",
              cursor: "pointer",
              color: isSearching
                ? "var(--mui-palette-primary-main)"
                : "var(--mui-palette-monochrome-700)",
            }}
          >
            <Icon name="search" size={20} />
          </span>
          <Typography variant="body2" sx={{ mr: 1 }}>
            Include drafts
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
