import { defineMessage } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CircleIcon from "@mui/icons-material/Circle";
import {
  Box,
  LinearProgress,
  ToggleButton,
  Tooltip,
  Typography,
} from "@mui/material";

import type { StoryTheme } from "@/types/stories";

interface StoryNavigationProps {
  currentStep: number;
  totalSteps: number;
  completedSteps: Set<number>;
  onJump: (step: number) => void;
  theme: StoryTheme;
}

export function StoryNavigation({
  currentStep,
  totalSteps,
  completedSteps,
  onJump,
  theme,
}: StoryNavigationProps) {
  const { i18n } = useLingui();

  const progressPercent = ((currentStep + 1) / totalSteps) * 100;

  const themeColors: Record<
    StoryTheme,
    { primary: string; secondary: string }
  > = {
    demographics: { primary: "#ec4899", secondary: "#fce7f3" },
    economy: { primary: "#f59e0b", secondary: "#fef3c7" },
    climate: { primary: "#10b981", secondary: "#d1fae5" },
    healthcare: { primary: "#ef4444", secondary: "#fee2e2" },
  };

  const colors = themeColors[theme];

  return (
    <Box>
      {/* Progress Bar */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {i18n._(
              defineMessage({
                id: "stories.progress",
                message: "Progress",
              })
            )}
          </Typography>
          <Typography variant="body2" color="text.secondary" fontWeight={600}>
            {currentStep + 1} / {totalSteps}
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progressPercent}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: colors.secondary,
            "& .MuiLinearProgress-bar": {
              backgroundColor: colors.primary,
              borderRadius: 4,
            },
          }}
        />
      </Box>

      {/* Step Thumbnails */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: 1,
          mb: 2,
        }}
      >
        {Array.from({ length: totalSteps }).map((_, index) => {
          const isCompleted = completedSteps.has(index);
          const isCurrent = index === currentStep;

          return (
            <Tooltip
              key={index}
              title={`${i18n._(defineMessage({ id: "stories.step", message: "Step" }))} ${index + 1}`}
            >
              <ToggleButton
                value={index}
                selected={isCurrent}
                onClick={() => onJump(index)}
                sx={{
                  p: 0.5,
                  minWidth: 40,
                  border: `2px solid ${isCurrent ? colors.primary : "divider"}`,
                  backgroundColor: isCompleted
                    ? colors.secondary
                    : "transparent",
                  "&.Mui-selected": {
                    backgroundColor: colors.primary,
                    color: "white",
                    "&:hover": {
                      backgroundColor: colors.primary,
                    },
                  },
                }}
              >
                {isCompleted && !isCurrent ? (
                  <CheckCircleIcon sx={{ fontSize: 20 }} />
                ) : (
                  <CircleIcon sx={{ fontSize: 20 }} />
                )}
              </ToggleButton>
            </Tooltip>
          );
        })}
      </Box>
    </Box>
  );
}
