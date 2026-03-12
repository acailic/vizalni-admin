import {
  Box,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useCallback, useState } from "react";

type InputFormat = "csv" | "json";

interface DataInputProps {
  value: Array<Record<string, string | number>>;
  onChange: (data: Array<Record<string, string | number>>) => void;
}

/**
 * Parse CSV text into an array of records.
 * First line is treated as headers.
 * Values are converted to numbers when possible.
 */
function parseCSV(text: string): Array<Record<string, string | number>> {
  const lines = text.trim().split("\n");
  if (lines.length < 2) {
    return [];
  }
  const headers = lines[0].split(",").map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const values = line.split(",");
    const row: Record<string, string | number> = {};
    headers.forEach((header, i) => {
      const val = values[i]?.trim() ?? "";
      // Try to convert to number if possible
      row[header] = isNaN(Number(val)) ? val : Number(val);
    });
    return row;
  });
}

/**
 * Convert data array to CSV format string.
 */
function toCSV(data: Array<Record<string, string | number>>): string {
  if (data.length === 0) {
    return "label,value";
  }
  const headers = Object.keys(data[0]);
  const headerLine = headers.join(",");
  const dataLines = data.map((row) =>
    headers.map((h) => String(row[h] ?? "")).join(",")
  );
  return [headerLine, ...dataLines].join("\n");
}

/**
 * Convert data array to JSON format string.
 */
function toJSON(data: Array<Record<string, string | number>>): string {
  return JSON.stringify(data, null, 2);
}

/**
 * DataInput component for the interactive playground.
 * Allows users to input chart data in CSV or JSON format.
 */
export const DataInput = ({ value, onChange }: DataInputProps) => {
  const theme = useTheme();
  const [format, setFormat] = useState<InputFormat>("csv");
  const [error, setError] = useState<string | null>(null);

  // Get the text representation of the current data based on format
  const getInitialText = useCallback(
    (fmt: InputFormat): string => {
      return fmt === "csv" ? toCSV(value) : toJSON(value);
    },
    [value]
  );

  const [inputText, setInputText] = useState<string>(() =>
    getInitialText("csv")
  );

  /**
   * Handle format toggle change
   */
  const handleFormatChange = useCallback(
    (_: React.MouseEvent<HTMLElement>, newFormat: InputFormat | null) => {
      if (newFormat !== null && newFormat !== format) {
        setFormat(newFormat);
        // Convert current data to the new format
        const newText = getInitialText(newFormat);
        setInputText(newText);
        setError(null);
      }
    },
    [format, getInitialText]
  );

  /**
   * Handle textarea input changes
   */
  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const text = e.target.value;
      setInputText(text);

      // Try to parse and validate
      try {
        let parsedData: Array<Record<string, string | number>>;

        if (format === "csv") {
          parsedData = parseCSV(text);
          if (text.trim() && parsedData.length === 0) {
            setError("CSV must have a header row and at least one data row");
            return;
          }
        } else {
          const parsed = JSON.parse(text);
          if (!Array.isArray(parsed)) {
            setError("JSON must be an array");
            return;
          }
          // Validate each item is an object
          for (const item of parsed) {
            if (
              typeof item !== "object" ||
              item === null ||
              Array.isArray(item)
            ) {
              setError("Each JSON item must be an object");
              return;
            }
          }
          parsedData = parsed;
        }

        setError(null);
        onChange(parsedData);
      } catch (e) {
        if (format === "json") {
          setError("Invalid JSON format");
        } else {
          setError("Invalid CSV format");
        }
      }
    },
    [format, onChange]
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {/* Format Toggle Section */}
      <Box>
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.text.secondary,
            fontWeight: 500,
            mb: 1,
            display: "block",
          }}
        >
          Input Format
        </Typography>
        <ToggleButtonGroup
          value={format}
          exclusive
          onChange={handleFormatChange}
          aria-label="Data input format selection"
          sx={{
            "& .MuiToggleButtonGroup-grouped": {
              margin: 0,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: `${theme.shape.borderRadius}px !important`,
              "&.Mui-selected": {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                borderColor: theme.palette.primary.main,
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                },
              },
              "&:not(:first-of-type)": {
                borderRadius: `${theme.shape.borderRadius}px !important`,
              },
              "&:first-of-type": {
                borderRadius: `${theme.shape.borderRadius}px !important`,
              },
            },
          }}
        >
          <ToggleButton
            value="csv"
            aria-label="CSV format"
            sx={{
              padding: "6px 16px",
              textTransform: "none",
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            CSV
          </ToggleButton>
          <ToggleButton
            value="json"
            aria-label="JSON format"
            sx={{
              padding: "6px 16px",
              textTransform: "none",
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            JSON
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Data Input Textarea */}
      <Box>
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.text.secondary,
            fontWeight: 500,
            mb: 1,
            display: "block",
          }}
        >
          {format === "csv" ? "CSV Data" : "JSON Data"}
        </Typography>
        <TextField
          multiline
          fullWidth
          minRows={6}
          maxRows={12}
          value={inputText}
          onChange={handleTextChange}
          placeholder={
            format === "csv"
              ? "label,value\nA,30\nB,50\nC,40"
              : '[\n  { "label": "A", "value": 30 },\n  { "label": "B", "value": 50 }\n]'
          }
          error={!!error}
          helperText={error || `Enter data in ${format.toUpperCase()} format`}
          sx={{
            "& .MuiInputBase-root": {
              fontFamily: "monospace",
              fontSize: "0.875rem",
            },
          }}
          inputProps={{
            "aria-label": `Data input in ${format.toUpperCase()} format`,
          }}
        />
      </Box>
    </Box>
  );
};

export default DataInput;
