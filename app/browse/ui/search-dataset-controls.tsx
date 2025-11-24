import { Divider } from "@mui/material";

import { BrowseState } from "@/browse/model/context";
import { SearchDatasetDraftsControl } from "@/browse/ui/search-dataset-drafts-control";
import { SearchDatasetResultsCount } from "@/browse/ui/search-dataset-results-count";
import { SearchDatasetSortControl } from "@/browse/ui/search-dataset-sort-control";
import { Flex } from "@/components/flex";
import { SearchCubeResult, SearchCubeResultOrder } from "@/graphql/query-hooks";
import { Icon } from "@/icons";
import { sleep } from "@/utils/sleep";
import { useEvent } from "@/utils/use-event";

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
    <Flex sx={{ justifyContent: "space-between", alignItems: "center", mb: 2 }}>
      <SearchDatasetResultsCount cubes={cubes} />
      <Flex sx={{ alignItems: "center", gap: 5 }}>
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
            color: isSearching ? "var(--mui-palette-primary-main)" : "var(--mui-palette-monochrome-700)",
          }}
        >
          <Icon name="search" size={20} />
        </span>
        <SearchDatasetDraftsControl
          checked={includeDrafts}
          onChange={onToggleIncludeDrafts}
        />
        <Divider flexItem orientation="vertical" />
        <SearchDatasetSortControl
          value={order}
          onChange={onSetOrder}
          disableScore={!isSearching}
        />
      </Flex>
    </Flex>
  );
};
