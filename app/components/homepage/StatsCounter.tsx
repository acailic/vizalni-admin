import { Box, Typography } from "@mui/material";

interface Stat {
  value: number;
  label: string;
}

interface StatsCounterProps {
  stats: Stat[];
  locale?: "en" | "sr" | "sr-Cyrl";
}

function formatNumber(num: number): string {
  return num.toLocaleString();
}

export function StatsCounter({ stats }: StatsCounterProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: { xs: 4, md: 8 },
        flexWrap: "wrap",
        py: 4,
      }}
    >
      {stats.map((stat, index) => (
        <Box key={index} sx={{ textAlign: "center" }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: "primary.main",
            }}
          >
            {formatNumber(stat.value)}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {stat.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
