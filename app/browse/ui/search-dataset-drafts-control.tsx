import { t } from "@lingui/macro";
import {
  Tooltip,
  Switch,
  FormControlLabel,
  CircularProgress,
  Box,
} from "@mui/material";
import { Drafts as DraftsIcon } from "@mui/icons-material";

export const SearchDatasetDraftsControl = ({
  checked,
  onChange,
  count,
  loading = false,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  count?: number;
  loading?: boolean;
}) => {
  const label =
    count !== undefined
      ? t({
          id: "dataset.includeDrafts",
          message: "Include draft datasets",
        }) + ` (${count})`
      : t({
          id: "dataset.includeDrafts",
          message: "Include draft datasets",
        });

  return (
    <Tooltip
      title={t({
        id: "dataset.draftsTooltip",
        message: "Draft datasets are unpublished versions that are still being edited.",
      })}
    >
      <Box display="flex" alignItems="center">
        <DraftsIcon sx={{ mr: 1 }} />
        {loading ? (
          <CircularProgress size={24} />
        ) : (
          <FormControlLabel
            control={
              <Switch
                checked={checked}
                onChange={() => onChange(!checked)}
                inputProps={{
                  "aria-label": t({
                    id: "dataset.includeDraftsAria",
                    message: "Toggle to include draft datasets",
                  }),
                }}
              />
            }
            label={label}
          />
        )}
      </Box>
    </Tooltip>
  );
};
