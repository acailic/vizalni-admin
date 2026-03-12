import {
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";

export type DatasetStatus = {
  name: string;
  status: "healthy" | "warning" | "offline";
  issues?: string;
};

const statusColor = {
  healthy: "success",
  warning: "warning",
  offline: "error",
} as const;

export const DatasetHealth = ({ datasets }: { datasets: DatasetStatus[] }) => {
  return (
    <Card elevation={1}>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="subtitle2" color="text.secondary">
            Dataset health
          </Typography>
          <List disablePadding>
            {datasets.map((dataset, idx) => (
              <Stack key={dataset.name} spacing={1}>
                <ListItem disableGutters>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight={600}>
                        {dataset.name}
                      </Typography>
                    }
                    secondary={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip
                          size="small"
                          color={statusColor[dataset.status]}
                          label={dataset.status}
                        />
                        {dataset.issues ? (
                          <Typography variant="caption" color="text.secondary">
                            {dataset.issues}
                          </Typography>
                        ) : null}
                      </Stack>
                    }
                  />
                </ListItem>
                {idx < datasets.length - 1 ? <Divider /> : null}
              </Stack>
            ))}
          </List>
        </Stack>
      </CardContent>
    </Card>
  );
};
