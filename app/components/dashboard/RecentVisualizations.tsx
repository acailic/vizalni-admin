import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import {
  Avatar,
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";

export type RecentVisualization = {
  id: string;
  title: string;
  dataset: string;
  updatedAt: string;
  href?: string;
};

export const RecentVisualizations = ({
  items,
  fallbackMessage = "No recent visualizations yet.",
}: {
  items: RecentVisualization[];
  fallbackMessage?: string;
}) => {
  return (
    <Card elevation={1}>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="subtitle2" color="text.secondary">
            Recent visualizations
          </Typography>
          {items.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              {fallbackMessage}
            </Typography>
          ) : (
            <List disablePadding>
              {items.map((item) => (
                <ListItem
                  key={item.id}
                  disableGutters
                  secondaryAction={
                    item.href ? (
                      <IconButton
                        component={Link}
                        href={item.href}
                        edge="end"
                        aria-label={`Open ${item.title}`}
                        size="small"
                      >
                        <OpenInNewIcon fontSize="small" />
                      </IconButton>
                    ) : null
                  }
                >
                  <ListItemAvatar>
                    <Avatar>
                      <InsertChartOutlinedIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight={600}>
                        {item.title}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {item.dataset} • Updated {item.updatedAt}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};
