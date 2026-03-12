import { useLingui } from "@lingui/react";
import { Box, Container, Paper } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect } from "react";
import { useStore } from "zustand";

import { useStoryStore } from "@/lib/stories/store";
import type { StoryConfig } from "@/types/stories";

import { StoryNavigation } from "./StoryNavigation";
import { StoryStep } from "./StoryStep";

interface StoryContainerProps {
  storyId: string;
  config: StoryConfig;
}

export function StoryContainer({ storyId, config }: StoryContainerProps) {
  const { i18n: _i18n } = useLingui();
  const storyStore = useStoryStore((state) =>
    state.createStory(config, storyId)
  );
  const currentStep = useStore(storyStore, (state) => state.currentStep);
  const completedSteps = useStore(storyStore, (state) => state.completedSteps);
  const setCurrentStep = useStore(storyStore, (state) => state.setCurrentStep);
  const markStepComplete = useStore(
    storyStore,
    (state) => state.markStepComplete
  );

  const step = config.steps[currentStep];
  const isLastStep = currentStep === config.steps.length - 1;
  const isFirstStep = currentStep === 0;

  // Mark step as completed when viewed
  useEffect(() => {
    if (!completedSteps.has(currentStep)) {
      markStepComplete(currentStep);
    }
  }, [currentStep, completedSteps, markStepComplete]);

  const handleNext = useCallback(() => {
    if (!isLastStep) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, isLastStep, setCurrentStep]);

  const handlePrevious = useCallback(() => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep, isFirstStep, setCurrentStep]);

  const handleJump = useCallback(
    (stepIndex: number) => {
      setCurrentStep(stepIndex);
    },
    [setCurrentStep]
  );

  const variants = {
    enter: {
      x: 100,
      opacity: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    exit: {
      x: -100,
      opacity: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, md: 4 },
          borderRadius: 4,
          minHeight: 600,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Story Header */}
        <Box sx={{ mb: 3, textAlign: "center" }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box
              component="span"
              sx={{ fontSize: "2rem", mr: 1, display: "inline-block" }}
            >
              {config.theme === "demographics" && "👥"}
              {config.theme === "economy" && "💰"}
              {config.theme === "climate" && "🌍"}
              {config.theme === "healthcare" && "🏥"}
            </Box>
          </motion.div>
        </Box>

        {/* Progress Navigation */}
        <StoryNavigation
          currentStep={currentStep}
          totalSteps={config.steps.length}
          completedSteps={completedSteps}
          onJump={handleJump}
          theme={config.theme}
        />

        {/* Step Content */}
        <Box sx={{ mt: 4, position: "relative", minHeight: 400 }}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentStep}
              variants={variants as any}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <StoryStep
                step={step}
                stepNumber={currentStep + 1}
                totalSteps={config.steps.length}
                onNext={handleNext}
                onPrevious={handlePrevious}
                isFirst={isFirstStep}
                isLast={isLastStep}
                storyId={storyId}
              />
            </motion.div>
          </AnimatePresence>
        </Box>
      </Paper>
    </Container>
  );
}
