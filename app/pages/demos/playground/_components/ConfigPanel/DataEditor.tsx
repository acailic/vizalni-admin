// app/pages/demos/playground/_components/ConfigPanel/DataEditor.tsx
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Chip,
  TextField,
  Alert,
} from "@mui/material";
import { useState } from "react";

import { SAMPLE_DATASETS } from "../../_constants";

import type { Datum } from "../../_types";

interface DataEditorProps {
  data: Datum[];
  onChange: (data: Datum[]) => void;
}

export function DataEditor({ data, onChange }: DataEditorProps) {
  const [customJson, setCustomJson] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);

  const handleDatasetSelect = (datasetKey: string) => {
    const dataset = SAMPLE_DATASETS[datasetKey];
    if (dataset) {
      onChange(dataset.data);
      setCustomJson("");
      setJsonError(null);
    }
  };

  const handleJsonChange = (value: string) => {
    setCustomJson(value);
    if (!value.trim()) {
      setJsonError(null);
      return;
    }
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        onChange(parsed);
        setJsonError(null);
      } else {
        setJsonError("Data must be an array");
      }
    } catch {
      setJsonError("Invalid JSON");
    }
  };

  const currentDatasetKey = Object.entries(SAMPLE_DATASETS).find(
    ([, ds]) => JSON.stringify(ds.data) === JSON.stringify(data)
  )?.[0];

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom fontWeight={600}>
        Data Source
      </Typography>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Sample Dataset</InputLabel>
        <Select
          value={currentDatasetKey || ""}
          label="Sample Dataset"
          onChange={(e) => handleDatasetSelect(e.target.value)}
        >
          {Object.entries(SAMPLE_DATASETS).map(([key, dataset]) => (
            <MenuItem key={key} value={key}>
              {dataset.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ mb: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
        <Chip
          label={`${data.length} data points`}
          size="small"
          color="primary"
          variant="outlined"
        />
        {data[0] && (
          <Chip
            label={`${Object.keys(data[0]).length} fields`}
            size="small"
            variant="outlined"
          />
        )}
      </Box>

      <TextField
        fullWidth
        multiline
        rows={4}
        label="Custom JSON"
        placeholder='[{"label": "A", "value": 10}]'
        value={customJson}
        onChange={(e) => handleJsonChange(e.target.value)}
        error={!!jsonError}
        sx={{ fontFamily: "monospace", mb: 1 }}
      />

      {jsonError && <Alert severity="error">{jsonError}</Alert>}
    </Box>
  );
}
