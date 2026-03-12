import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";

import { DemoError, DemoLoading } from "@/components/demos/demo-layout";
import { useDataGovRs } from "@/hooks/use-data-gov-rs";
import { getDemoConfig } from "@/lib/demos/config";
import { DEMO_FALLBACKS } from "@/lib/demos/fallbacks";
import { getValidatedDatasetIds } from "@/lib/demos/validated-datasets";

type LiveDatasetPanelProps = {
  demoId: string;
  title?: string;
  limit?: number;
};

export const LiveDatasetPanel = ({
  demoId,
  title = "Live data preview",
  limit = 10,
}: LiveDatasetPanelProps) => {
  const config = getDemoConfig(demoId);
  const [filter, setFilter] = useState("");

  const fallbackInfo = DEMO_FALLBACKS[demoId]?.fallbackDatasetInfo
    ? {
        title: DEMO_FALLBACKS[demoId]!.fallbackDatasetInfo!.title,
        organization: {
          id: "demo-org",
          name: DEMO_FALLBACKS[demoId]!.fallbackDatasetInfo!.organization ?? "Demo data.gov.rs",
          title: DEMO_FALLBACKS[demoId]!.fallbackDatasetInfo!.organization ?? "Demo data.gov.rs",
        },
      }
    : undefined;

  const { data, dataset, loading, error, refetch } = useDataGovRs({
    searchQuery: config?.searchQuery,
    preferredDatasetIds: getValidatedDatasetIds(demoId),
    preferredTags: config?.preferredTags,
    slugKeywords: config?.slugKeywords,
    fallbackData: DEMO_FALLBACKS[demoId]?.fallbackData,
    fallbackDatasetInfo: fallbackInfo,
    autoFetch: true,
  });

  const rows = useMemo(() => {
    if (!Array.isArray(data)) {
      return [];
    }
    const filtered = filter
      ? data.filter((row) =>
          Object.values(row ?? {}).some((value) =>
            String(value ?? "").toLowerCase().includes(filter.toLowerCase())
          )
        )
      : data;
    return filtered.slice(0, limit);
  }, [data, filter, limit]);

  const columns = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return [];
    const first = data.find((row) => row && typeof row === "object");
    return first ? Object.keys(first).slice(0, 6) : [];
  }, [data]);

  return (
    <Card sx={{ mb: 4 }} variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight={700}>
              {title}
            </Typography>
            <Button onClick={refetch} size="small" variant="outlined">
              Refresh
            </Button>
          </Stack>

          {dataset ? (
            <Typography variant="body2" color="text.secondary">
              {dataset.title} — {dataset.organization.title || dataset.organization.name}
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Using fallback data
            </Typography>
          )}

          <TextField
            size="small"
            label="Filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Type to filter rows"
          />

          <Divider />

          {loading ? (
            <DemoLoading />
          ) : error ? (
            <DemoError error={error} />
          ) : columns.length === 0 || rows.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No rows to display.
            </Typography>
          ) : (
            <TableContainer component={Box}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {columns.map((col) => (
                      <TableCell key={col}>{col}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, idx) => (
                    <TableRow key={idx}>
                      {columns.map((col) => (
                        <TableCell key={col}>{String((row as Record<string, unknown>)[col] ?? "")}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};
