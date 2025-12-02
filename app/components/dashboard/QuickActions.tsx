import { ArrowForward } from "@mui/icons-material";
import { Button, Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import Link from "next/link";

type Action = {
  label: string;
  description: string;
  href: string;
  variant?: "contained" | "outlined" | "text";
};

export const QuickActions = ({ actions }: { actions: Action[] }) => {
  return (
    <Card elevation={1}>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="subtitle2" color="text.secondary">
            Quick actions
          </Typography>
          <Grid container spacing={1.5}>
            {actions.map((action) => (
              <Grid key={action.label} item xs={12} sm={4}>
                <Stack spacing={0.5} sx={{ p: 1, border: "1px solid", borderColor: "grey.200", borderRadius: 1 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {action.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {action.description}
                  </Typography>
                  <Button
                    component={Link}
                    href={action.href}
                    variant={action.variant ?? "outlined"}
                    endIcon={<ArrowForward />}
                    size="small"
                    sx={{ alignSelf: "flex-start", mt: 0.5 }}
                  >
                    Go
                  </Button>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </CardContent>
    </Card>
  );
};
