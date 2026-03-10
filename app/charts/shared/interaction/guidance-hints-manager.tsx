// app/charts/shared/interaction/guidance-hints-manager.tsx
import { Box, Button, Typography, Paper } from "@mui/material";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export interface GuidanceHintConfig {
  id: string;
  target: string;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
}

interface GuidanceHintsContextValue {
  currentHintIndex: number;
  dismissHint: () => void;
  skipAll: () => void;
  totalHints: number;
}

const GuidanceHintsContext = createContext<GuidanceHintsContextValue | null>(
  null
);

export const useGuidanceHints = (): GuidanceHintsContextValue => {
  const context = useContext(GuidanceHintsContext);
  if (!context) {
    throw new Error(
      "useGuidanceHints must be used within GuidanceHintsManager"
    );
  }
  return context;
};

const STORAGE_KEY_PREFIX = "vizualni-guidance-hints";

interface GuidanceHintsManagerProps {
  hints: GuidanceHintConfig[];
  chartId: string;
  children?: ReactNode;
}

export const GuidanceHintsManager = ({
  hints,
  chartId,
  children,
}: GuidanceHintsManagerProps) => {
  const storageKey = `${STORAGE_KEY_PREFIX}-${chartId}`;

  const getInitialDismissedHints = (): Set<string> => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  };

  const [dismissedHints, setDismissedHints] = useState<Set<string>>(
    getInitialDismissedHints
  );

  // Calculate the first undismissed hint index based on current dismissedHints
  const getFirstUndismissedIndex = useCallback(
    (dismissed: Set<string>) => {
      const firstUndismissed = hints.findIndex((h) => !dismissed.has(h.id));
      return firstUndismissed >= 0 ? firstUndismissed : -1;
    },
    [hints]
  );

  const [currentHintIndex, setCurrentHintIndex] = useState<number>(() =>
    getFirstUndismissedIndex(getInitialDismissedHints())
  );

  const currentHint = currentHintIndex >= 0 ? hints[currentHintIndex] : null;

  const persistToStorage = useCallback(
    (dismissed: Set<string>) => {
      localStorage.setItem(storageKey, JSON.stringify([...dismissed]));
    },
    [storageKey]
  );

  const dismissHint = useCallback(() => {
    if (currentHintIndex >= 0 && currentHint) {
      const newDismissed = new Set(dismissedHints);
      newDismissed.add(currentHint.id);
      setDismissedHints(newDismissed);
      persistToStorage(newDismissed);

      // Find next undismissed hint
      const nextIndex = hints.findIndex(
        (h, i) => i > currentHintIndex && !newDismissed.has(h.id)
      );
      setCurrentHintIndex(nextIndex >= 0 ? nextIndex : -1);
    }
  }, [currentHintIndex, currentHint, dismissedHints, hints, persistToStorage]);

  const skipAll = useCallback(() => {
    const allIds = new Set(hints.map((h) => h.id));
    setDismissedHints(allIds);
    persistToStorage(allIds);
    setCurrentHintIndex(-1);
  }, [hints, persistToStorage]);

  const goToPrevious = useCallback(() => {
    if (currentHintIndex > 0) {
      setCurrentHintIndex(currentHintIndex - 1);
    }
  }, [currentHintIndex]);

  return (
    <GuidanceHintsContext.Provider
      value={{
        currentHintIndex,
        dismissHint,
        skipAll,
        totalHints: hints.length,
      }}
    >
      {children}
      {currentHint && (
        <GuidanceHintPopover
          hint={currentHint}
          currentIndex={currentHintIndex}
          totalHints={hints.length}
          onDismiss={dismissHint}
          onSkipAll={skipAll}
          onPrevious={currentHintIndex > 0 ? goToPrevious : undefined}
        />
      )}
    </GuidanceHintsContext.Provider>
  );
};

interface GuidanceHintPopoverProps {
  hint: GuidanceHintConfig;
  currentIndex: number;
  totalHints: number;
  onDismiss: () => void;
  onSkipAll: () => void;
  onPrevious?: () => void;
}

const GuidanceHintPopover = ({
  hint,
  currentIndex,
  totalHints,
  onDismiss,
  onSkipAll,
  onPrevious,
}: GuidanceHintPopoverProps) => {
  const isLastHint = currentIndex === totalHints - 1;

  return (
    <Paper
      elevation={4}
      sx={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 1300,
        p: 2,
        maxWidth: 320,
      }}
    >
      <Typography variant="body2" sx={{ mb: 1.5 }}>
        {hint.content}
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="caption" color="text.secondary">
          {currentIndex + 1} / {totalHints}
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          {onPrevious && (
            <Button size="small" onClick={onPrevious}>
              Back
            </Button>
          )}
          <Button size="small" variant="contained" onClick={onDismiss}>
            {isLastHint ? "Got it" : "Next"}
          </Button>
          <Button size="small" color="inherit" onClick={onSkipAll}>
            Skip all
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};
