import { useLingui } from "@lingui/react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

import type { StoryConfig, StoryDifficulty } from "@/types/stories";

interface StoryCardProps {
  story: StoryConfig;
  href: string;
}

const difficultyColors: Record<StoryDifficulty, string> = {
  beginner: "#22c55e",
  intermediate: "#f59e0b",
  advanced: "#ef4444",
};

export function StoryCard({ story, href }: StoryCardProps) {
  const { i18n } = useLingui();
  const locale = i18n.locale?.startsWith("sr") ? "sr" : "en";

  return (
    <Card
      component="a"
      href={href}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        textDecoration: "none",
        transition: "all 0.3s ease",
        borderRadius: 3,
        overflow: "hidden",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 20px 40px rgba(14, 165, 233, 0.25)",
        },
      }}
    >
      <CardActionArea
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          justifyContent: "flex-start",
        }}
      >
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          {/* Icon */}
          <Box
            sx={{
              fontSize: "3rem",
              mb: 2,
              textAlign: "center",
              p: 2,
              borderRadius: 3,
              background:
                "linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            {story.theme === "demographics" && "👥"}
            {story.theme === "economy" && "💰"}
            {story.theme === "climate" && "🌍"}
            {story.theme === "healthcare" && "🏥"}
          </Box>

          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 600,
              mb: 1.5,
              color: "text.primary",
            }}
          >
            {story.title[locale]}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, lineHeight: 1.6 }}
          >
            {story.description[locale]}
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            sx={{ mt: "auto" }}
          >
            <Chip
              icon={<AccessTimeIcon sx={{ fontSize: 16 }} />}
              label={`${story.estimatedMinutes} ${locale === "sr" ? "min" : "min"}`}
              size="small"
              sx={{ fontSize: "0.75rem" }}
            />
            <Chip
              icon={<TrendingUpIcon sx={{ fontSize: 16 }} />}
              label={story.difficulty}
              size="small"
              sx={{
                fontSize: "0.75rem",
                backgroundColor: difficultyColors[story.difficulty],
                color: "white",
                fontWeight: 600,
              }}
            />
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
