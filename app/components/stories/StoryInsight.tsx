import InfoIcon from "@mui/icons-material/Info";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { Box, Card, CardContent, Stack, Typography } from "@mui/material";

interface StoryInsightProps {
  insight: string;
  index: number;
}

export function StoryInsight({ insight, index: _index }: StoryInsightProps) {
  // Detect sentiment for icon selection
  const lowerInsight = insight.toLowerCase();
  const isPositive =
    lowerInsight.includes("povećanje") ||
    lowerInsight.includes("rast") ||
    lowerInsight.includes("porast") ||
    lowerInsight.includes("growth") ||
    lowerInsight.includes("increase");
  const isNegative =
    lowerInsight.includes("pad") ||
    lowerInsight.includes("smanjenje") ||
    lowerInsight.includes("kriz") ||
    lowerInsight.includes("decline") ||
    lowerInsight.includes("decrease");

  const getIcon = () => {
    if (isPositive) return <TrendingUpIcon color="success" />;
    if (isNegative) return <TrendingDownIcon color="error" />;
    return <InfoIcon color="info" />;
  };

  const getColor = () => {
    if (isPositive) return "success.light";
    if (isNegative) return "error.light";
    return "info.light";
  };

  return (
    <Card
      sx={{
        backgroundColor: getColor(),
        borderLeft: 4,
        borderLeftColor: isPositive
          ? "success.main"
          : isNegative
            ? "error.main"
            : "info.main",
      }}
    >
      <CardContent sx={{ py: 2 }}>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Box sx={{ mt: 0.5 }}>{getIcon()}</Box>
          <Typography variant="body2">{insight}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
