import {
  Card,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";

export type CategoryStatus = {
  name: string;
  enabled: boolean;
  health: "good" | "warning" | "critical";
  coverage: number; // 0-100
};

const healthColor = {
  good: "success",
  warning: "warning",
  critical: "error",
} as const;

export const CategoryOverview = ({
  categories,
}: {
  categories: CategoryStatus[];
}) => {
  return (
    <Card elevation={1}>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle2" color="text.secondary">
              Category overview
            </Typography>
          </Stack>
          <Grid container spacing={2}>
            {categories.map((category) => (
              <Grid key={category.name} item xs={12} sm={6} md={4}>
                <Stack spacing={1.2} sx={{ p: 1.5, borderRadius: 1, bgcolor: "grey.50" }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="subtitle1" fontWeight={600}>
                      {category.name}
                    </Typography>
                    <Chip
                      size="small"
                      label={category.enabled ? "Enabled" : "Disabled"}
                      color={category.enabled ? "success" : "default"}
                      variant={category.enabled ? "filled" : "outlined"}
                    />
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip
                      size="small"
                      label={category.health}
                      color={healthColor[category.health]}
                      variant="outlined"
                    />
                    <Typography variant="caption" color="text.secondary">
                      Coverage {category.coverage}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={category.coverage}
                    color={healthColor[category.health]}
                  />
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </CardContent>
    </Card>
  );
};
