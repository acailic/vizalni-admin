import { t, Trans } from "@lingui/macro";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Sort as SortIcon,
  TrendingUp,
  TextFields,
  Schedule,
} from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";

import { Flex } from "@/components/flex";
import { SearchCubeResultOrder } from "@/graphql/query-hooks";

export const SearchDatasetSortControl = ({
  value,
  onChange,
  disableScore,
}: {
  value: SearchCubeResultOrder;
  onChange: (order: SearchCubeResultOrder) => void;
  disableScore?: boolean;
}) => {
  const [announceChange, setAnnounceChange] = useState<string>("");

  const options = useMemo(() => {
    const baseOptions = [
      {
        value: SearchCubeResultOrder.Score,
        label: t({
          id: "dataset.order.relevance",
          message: "Relevance (by search score)",
        }),
        icon: <TrendingUp fontSize="small" />,
        tooltip: t({
          id: "dataset.order.relevance.tooltip",
          message: "Sort by how well results match your search query",
        }),
        shortcut: "r",
      },
      {
        value: SearchCubeResultOrder.TitleAsc,
        label: t({ id: "dataset.order.title", message: "Title (A-Z)" }),
        icon: <TextFields fontSize="small" />,
        tooltip: t({
          id: "dataset.order.title.tooltip",
          message: "Sort alphabetically by dataset title",
        }),
        shortcut: "t",
      },
      {
        value: SearchCubeResultOrder.CreatedDesc,
        label: t({ id: "dataset.order.newest", message: "Newest first" }),
        icon: <Schedule fontSize="small" />,
        tooltip: t({
          id: "dataset.order.newest.tooltip",
          message: "Sort by most recently created datasets",
        }),
        shortcut: "n",
      },
    ];

    return disableScore
      ? baseOptions.filter((o) => o.value !== SearchCubeResultOrder.Score)
      : baseOptions;
  }, [disableScore]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const option = options.find(
        (o) => o.shortcut === event.key.toLowerCase()
      );
      if (option && !event.ctrlKey && !event.altKey && !event.metaKey) {
        event.preventDefault();
        onChange(option.value);
        setAnnounceChange(`Sorted by ${option.label}`);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [options, onChange]);

  const handleChange = (newValue: SearchCubeResultOrder) => {
    onChange(newValue);
    const option = options.find((o) => o.value === newValue);
    setAnnounceChange(`Sorted by ${option?.label || "unknown"}`);
  };

  return (
    <Flex alignItems="center" gap={1}>
      <SortIcon color="action" />
      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel id="dataset-sort-label" sx={{ fontWeight: 600 }}>
          <Trans id="dataset.sortby">Sort by</Trans>
        </InputLabel>
        <MuiSelect
          labelId="dataset-sort-label"
          id="datasetSort"
          data-testid="datasetSort"
          value={value}
          label={<Trans id="dataset.sortby">Sort by</Trans>}
          onChange={(e) =>
            handleChange(e.target.value as SearchCubeResultOrder)
          }
          sx={{
            "& .MuiOutlinedInput-root": {
              transition: "all 0.2s ease-in-out",
              "&:hover": { boxShadow: 1 },
              "&.Mui-focused": { boxShadow: 2, transform: "scale(1.02)" },
            },
          }}
          renderValue={(selected) => {
            const option = options.find((o) => o.value === selected);
            return (
              <Box display="flex" alignItems="center" gap={1}>
                {option?.icon}
                <Typography variant="body2">{option?.label}</Typography>
              </Box>
            );
          }}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Tooltip title={option.tooltip} placement="right">
                <Box display="flex" alignItems="center" gap={1}>
                  {option.icon}
                  <Typography variant="body2">{option.label}</Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ ml: "auto" }}
                  >
                    ({option.shortcut.toUpperCase()})
                  </Typography>
                </Box>
              </Tooltip>
            </MenuItem>
          ))}
        </MuiSelect>
      </FormControl>
      <Box
        component="div"
        aria-live="polite"
        aria-atomic="true"
        sx={{
          position: "absolute",
          left: "-10000px",
          top: "auto",
          width: "1px",
          height: "1px",
          overflow: "hidden",
        }}
      >
        {announceChange}
      </Box>
    </Flex>
  );
};
