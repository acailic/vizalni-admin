import { t } from "@lingui/macro";
import SearchIcon from "@mui/icons-material/Search";
import { Button, Icon } from "@mui/material";
import { KeyboardEvent, useState } from "react";

import { BrowseState } from "@/browse/model/context";
import { Flex } from "@/components/flex";
import { SearchField, SearchFieldProps } from "@/components/form";

export const SearchDatasetInput = ({
  browseState: { inputRef, search, onSubmitSearch, onReset },
  searchFieldProps,
}: {
  browseState: BrowseState;
  searchFieldProps?: Partial<SearchFieldProps>;
}) => {
  const [_, setShowDraftCheckbox] = useState(false);
  const searchLabel = t({
    id: "dataset.search.label",
    message: "Search",
  });
  const placeholder = t({
    id: "dataset.search.placeholder",
    message: "Name, description, organization, theme, keyword",
  });
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputRef.current) {
      onSubmitSearch(inputRef.current.value);
    }
  };
  const handleSearchClick = () => {
    if (inputRef.current) {
      onSubmitSearch(inputRef.current.value);
    }
  };

  return (
    <Flex sx={{ alignItems: "center", gap: 2, pt: 4 }}>
      <SearchField
        key={search}
        inputRef={inputRef}
        id="datasetSearch"
        label={searchLabel}
        defaultValue={search ?? ""}
        InputProps={{
          inputProps: {
            "data-testid": "datasetSearch",
            "aria-describedby": "search-description",
          },
          startAdornment: (
            <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
          ),
          onKeyPress: handleKeyPress,
          onReset,
          onFocus: () => setShowDraftCheckbox(true),
        }}
        placeholder={placeholder}
        {...searchFieldProps}
        sx={{
          ...searchFieldProps?.sx,
          width: "100%",
          maxWidth: 820,
          minHeight: 48,
          backgroundColor: "white",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          borderRadius: 2,
          "& .MuiInput-root.Mui-focused": {
            boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.5)",
          },
        }}
      />
      <Button
        variant="contained"
        onClick={handleSearchClick}
        aria-label={t({
          id: "dataset.search.button",
          message: "Submit search",
        })}
        sx={{ minHeight: 48, px: 3 }}
      >
        <Icon>search</Icon>
      </Button>
      <div id="search-description" style={{ display: "none" }}>
        {t({
          id: "dataset.search.description",
          message:
            "Search for datasets by name, description, organization, theme, or keyword",
        })}
      </div>
    </Flex>
  );
};
