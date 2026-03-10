// app/components/search/GlobalSearch.tsx
import SearchIcon from "@mui/icons-material/Search";
import { Box, InputBase, IconButton } from "@mui/material";
import { useState } from "react";

type Locale = "en" | "sr" | "sr-Cyrl";

const PLACEHOLDERS: Record<Locale, string> = {
  en: "Search...",
  sr: "Pretraga...",
  "sr-Cyrl": "Претрага...",
};

interface GlobalSearchProps {
  locale?: Locale;
}

export function GlobalSearch({ locale = "en" }: GlobalSearchProps) {
  const [value, setValue] = useState("");

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.15)",
        borderRadius: 1,
        width: { xs: "100%", sm: 200, md: 250 },
      }}
    >
      <InputBase
        placeholder={PLACEHOLDERS[locale]}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        inputProps={{ "aria-label": "Search", role: "search" }}
        sx={{
          color: "white",
          ml: 0.5,
          flex: 1,
          "& .MuiInputBase-input::placeholder": {
            color: "rgba(255,255,255,0.7)",
            opacity: 1,
          },
        }}
      />
      <IconButton type="submit" size="small" sx={{ color: "white", p: 0.5 }}>
        <SearchIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}
