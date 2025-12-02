import { Card, CardContent, Grid, Stack, Typography } from "@mui/material";

export type StatItem = {
  label: string;
  value: string | number;
  delta?: string;
  color?: "primary" | "secondary" | "success" | "warning" | "info";
};

interface QuickStatsProps {
  title: string;
  stats: StatItem[];
}

export const QuickStats = ({ title, stats }: QuickStatsProps) => {
  return (
    <Card elevation={1}>
      <CardContent>
        <Stack spacing={1} sx={{ mb: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            {title}
          </Typography>
        </Stack>
        <Grid container spacing={2}>
          {stats.map((stat) => (
            <Grid key={stat.label} item xs={12} sm={4}>
              <Stack spacing={0.5}>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {stat.value}
                </Typography>
                {stat.delta ? (
                  <Typography
                    variant="caption"
                    color={stat.color ? `${stat.color}.main` : "success.main"}
                  >
                    {stat.delta}
                  </Typography>
                ) : null}
              </Stack>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};
