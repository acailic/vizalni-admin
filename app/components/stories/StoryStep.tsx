import { defineMessage } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

import type { StoryStepConfig } from "@/types/stories";

import { StoryInsight } from "./StoryInsight";

interface StoryStepProps {
  step: StoryStepConfig;
  stepNumber: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  isFirst: boolean;
  isLast: boolean;
  storyId: string;
}

export function StoryStep({
  step,
  stepNumber,
  totalSteps,
  onNext,
  onPrevious,
  isFirst,
  isLast,
  storyId,
}: StoryStepProps) {
  const { i18n } = useLingui();
  const ChartComponent = step.chartComponent;

  return (
    <Stack spacing={4}>
      {/* Step Header */}
      <Box>
        <Chip
          label={`${i18n._(defineMessage({ id: "stories.step", message: "Step" }))} ${stepNumber} / ${totalSteps}`}
          size="small"
          sx={{ mb: 2 }}
        />
        <Typography variant="h4" component="h2" gutterBottom fontWeight={700}>
          {step.title[i18n.locale?.startsWith("sr") ? "sr" : "en"]}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ fontSize: "1.1rem" }}
        >
          {step.narrative[i18n.locale?.startsWith("sr") ? "sr" : "en"]}
        </Typography>
      </Box>

      {/* Chart Visualization */}
      <Card elevation={2}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ minHeight: 300 }}>
            <ChartComponent {...step.chartProps} />
          </Box>
        </CardContent>
      </Card>

      {/* Insights */}
      {step.insights.length > 0 && (
        <Box>
          <Stack spacing={2}>
            {step.insights.map((insight, index) => (
              <StoryInsight key={index} insight={insight} index={index} />
            ))}
          </Stack>
        </Box>
      )}

      {/* Callout */}
      {step.callout && (
        <Card
          sx={{
            background:
              "linear-gradient(135deg, rgba(14,165,233,0.1) 0%, rgba(37,99,235,0.1) 100%)",
            border: "2px solid",
            borderColor: "primary.light",
          }}
        >
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <LightbulbIcon color="primary" sx={{ fontSize: 28, mt: 0.5 }} />
              <Box>
                <Typography
                  variant="subtitle2"
                  color="primary"
                  fontWeight={700}
                  gutterBottom
                >
                  {i18n._(
                    defineMessage({
                      id: "stories.takeaway",
                      message: "Key Takeaway",
                    })
                  )}
                </Typography>
                <Typography variant="body2">
                  {step.callout[i18n.locale?.startsWith("sr") ? "sr" : "en"]}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <Stack direction="row" spacing={2} justifyContent="space-between">
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={onPrevious}
          disabled={isFirst}
        >
          {i18n._(
            defineMessage({ id: "stories.previous", message: "Previous" })
          )}
        </Button>

        <Button
          variant={isLast ? "outlined" : "contained"}
          endIcon={isLast ? null : <ArrowForwardIcon />}
          onClick={onNext}
        >
          {isLast
            ? i18n._(defineMessage({ id: "stories.finish", message: "Finish" }))
            : i18n._(defineMessage({ id: "stories.next", message: "Next" }))}
        </Button>
      </Stack>
    </Stack>
  );
}
