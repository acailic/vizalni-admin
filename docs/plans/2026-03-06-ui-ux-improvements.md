# UI/UX Improvements Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to
> implement this plan task-by-task.

**Goal:** Implement 6 UI/UX improvements: dark mode toggle, chart placeholders,
loading skeletons, demo cards polish, header improvements, and playground
controls.

**Architecture:** Three-phase approach - theme system foundation first, then
visual improvements, then polish. Uses MUI v6 theming with localStorage
persistence.

**Tech Stack:** Next.js 15, React 19, MUI v6, Emotion, TypeScript

---

## Phase 1: Theme System & Dark Mode Toggle

### Task 1.1: Create Light Palette

**Files:**

- Modify: `app/themes/palette.ts`

**Step 1: Write the failing test**

Create `app/themes/__tests__/palette.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { lightPalette, darkPalette } from "../palette";

describe("palette", () => {
  it("should export lightPalette with mode 'light'", () => {
    expect(lightPalette.mode).toBe("light");
    expect(lightPalette.primary).toBeDefined();
    expect(lightPalette.background).toBeDefined();
  });

  it("should export darkPalette with mode 'dark'", () => {
    expect(darkPalette.mode).toBe("dark");
    expect(darkPalette.primary).toBeDefined();
    expect(darkPalette.background).toBeDefined();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd app && vitest run themes/__tests__/palette.test.ts` Expected: FAIL -
lightPalette not exported

**Step 3: Write minimal implementation**

Modify `app/themes/palette.ts` to export both palettes:

```typescript
// Add after the existing palette export

// Light mode palette
export const lightPalette = {
  mode: "light" as const,
  primary: {
    main: blue[700],
    dark: blue[900],
    contrastText: "#fff",
  },
  secondary: {
    main: colors.cobalt[400],
    dark: colors.cobalt[600],
    contrastText: "#fff",
  },
  text: {
    primary: colors.monochrome[900],
    secondary: colors.monochrome[700],
  },
  background: {
    default: "#F8FAFC",
    paper: "#FFFFFF",
  },
  divider: colors.monochrome[200],
  error: {
    main: colors.red[700],
    light: colors.red[50],
    contrastText: "#fff",
  },
  warning: {
    main: orange[600],
    light: orange[50],
    contrastText: "#fff",
  },
  info: {
    main: blue[600],
    light: blue[50],
    contrastText: "#fff",
  },
  success: {
    main: green[600],
    light: green[50],
    contrastText: "#fff",
  },
  cobalt: {
    main: colors.cobalt[500],
    ...colors.cobalt,
  },
  monochrome: {
    main: colors.monochrome[500],
    ...colors.monochrome,
  },
  red: {
    ...colors.red,
    main: "#C6363C",
    700: "#C6363C",
    800: "#B42F35",
    900: "#9E2A2F",
  },
  orange,
  yellow: {
    main: "#F59E0B",
    50: "#FFFBEB",
    100: "#FEF3C7",
    200: "#FDE68A",
    300: "#FCD34D",
    400: "#FBBF24",
    500: "#F59E0B",
    600: "#D97706",
    700: "#B45309",
    800: "#92400E",
    900: "#78350F",
  },
  green,
  blue,
} satisfies ThemeOptions["palette"];

// Rename existing palette to darkPalette
export { palette as darkPalette };
```

**Step 4: Run test to verify it passes**

Run: `cd app && vitest run themes/__tests__/palette.test.ts` Expected: PASS

**Step 5: Commit**

```bash
git add app/themes/palette.ts app/themes/__tests__/palette.test.ts
git commit -m "feat: add light mode palette export"
```

---

### Task 1.2: Create ThemeProvider with Context

**Files:**

- Create: `app/themes/ThemeProvider.tsx`
- Create: `app/themes/__tests__/ThemeProvider.test.tsx`

**Step 1: Write the failing test**

```typescript
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { useThemeMode, ThemeProvider } from "../ThemeProvider";

const TestComponent = () => {
  const { mode, toggleTheme, setTheme } = useThemeMode();
  return (
    <div>
      <span data-testid="mode">{mode}</span>
      <button onClick={toggleTheme} data-testid="toggle">
        Toggle
      </button>
      <button onClick={() => setTheme("light")} data-testid="light">
        Light
      </button>
      <button onClick={() => setTheme("dark")} data-testid="dark">
        Dark
      </button>
    </div>
  );
};

describe("ThemeProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: query.includes("dark"),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
  });

  it("should provide default mode from localStorage", () => {
    localStorage.setItem("vizualni-theme", "light");
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    expect(screen.getByTestId("mode").textContent).toBe("light");
  });

  it("should toggle between light and dark", () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    fireEvent.click(screen.getByTestId("toggle"));
    expect(screen.getByTestId("mode").textContent).toBe("light");
    fireEvent.click(screen.getByTestId("toggle"));
    expect(screen.getByTestId("mode").textContent).toBe("dark");
  });

  it("should persist mode to localStorage", () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    fireEvent.click(screen.getByTestId("light"));
    expect(localStorage.getItem("vizualni-theme")).toBe("light");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd app && vitest run themes/__tests__/ThemeProvider.test.tsx` Expected:
FAIL - ThemeProvider not found

**Step 3: Write minimal implementation**

```typescript
// app/themes/ThemeProvider.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from "react";
import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { lightPalette } from "./palette";
import { palette as darkPalette } from "./palette";
import { components } from "./components";
import { breakpoints, shadows, spacing } from "./constants";
import { typography } from "./typography";

type ThemeMode = "light" | "dark" | "system";

interface ThemeContextValue {
  mode: "light" | "dark";
  systemPreference: "light" | "dark";
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "vizualni-theme";

function getSystemPreference(): "light" | "dark" {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getStoredMode(): ThemeMode | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored;
  }
  return null;
}

export function useThemeMode(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeMode must be used within a ThemeProvider");
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
  defaultMode?: ThemeMode;
}

export function ThemeProvider({
  children,
  defaultMode = "system",
}: ThemeProviderProps) {
  const [systemPreference, setSystemPreference] = useState<"light" | "dark">(
    getSystemPreference
  );
  const [preferredMode, setPreferredMode] = useState<ThemeMode>(() => {
    const stored = getStoredMode();
    return stored ?? defaultMode;
  });

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      setSystemPreference(e.matches ? "dark" : "light");
    };
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Persist preference to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, preferredMode);
  }, [preferredMode]);

  const mode = preferredMode === "system" ? systemPreference : preferredMode;

  const theme = useMemo(() => {
    const palette = mode === "light" ? lightPalette : darkPalette;
    return createTheme({
      palette,
      breakpoints,
      spacing,
      shape: { borderRadius: 4 },
      shadows,
      typography,
      components: components as any,
    });
  }, [mode]);

  const contextValue = useMemo<ThemeContextValue>(
    () => ({
      mode,
      systemPreference,
      setTheme: setPreferredMode,
      toggleTheme: () => {
        setPreferredMode((current) => {
          const currentEffective =
            current === "system" ? systemPreference : current;
          return currentEffective === "dark" ? "light" : "dark";
        });
      },
    }),
    [mode, systemPreference]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
```

**Step 4: Run test to verify it passes**

Run: `cd app && vitest run themes/__tests__/ThemeProvider.test.tsx` Expected:
PASS

**Step 5: Commit**

```bash
git add app/themes/ThemeProvider.tsx app/themes/__tests__/ThemeProvider.test.tsx
git commit -m "feat: add ThemeProvider with dark/light mode toggle"
```

---

### Task 1.3: Create ThemeToggle Component

**Files:**

- Create: `app/components/ThemeToggle.tsx`
- Create: `app/components/__tests__/ThemeToggle.test.tsx`

**Step 1: Write the failing test**

```typescript
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "@/themes/ThemeProvider";
import { ThemeToggle } from "../ThemeToggle";

describe("ThemeToggle", () => {
  it("should render toggle button", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should toggle theme on click", () => {
    const { container } = render(
      <ThemeProvider defaultMode="dark">
        <ThemeToggle />
      </ThemeProvider>
    );
    const button = screen.getByRole("button");
    fireEvent.click(button);
    // Theme should have toggled
    expect(button).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd app && vitest run components/__tests__/ThemeToggle.test.tsx` Expected:
FAIL - ThemeToggle not found

**Step 3: Write minimal implementation**

```typescript
// app/components/ThemeToggle.tsx
"use client";

import { IconButton, Tooltip } from "@mui/material";
import { useThemeMode } from "@/themes/ThemeProvider";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

export function ThemeToggle() {
  const { mode, toggleTheme } = useThemeMode();

  return (
    <Tooltip title={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
      <IconButton
        onClick={toggleTheme}
        color="inherit"
        aria-label="toggle theme"
        data-testid="theme-toggle"
      >
        {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Tooltip>
  );
}
```

**Step 4: Run test to verify it passes**

Run: `cd app && vitest run components/__tests__/ThemeToggle.test.tsx` Expected:
PASS

**Step 5: Commit**

```bash
git add app/components/ThemeToggle.tsx app/components/__tests__/ThemeToggle.test.tsx
git commit -m "feat: add ThemeToggle component"
```

---

### Task 1.4: Integrate ThemeProvider and ThemeToggle

**Files:**

- Modify: `app/pages/_app.tsx`
- Modify: `app/components/header.tsx`

**Step 1: Update \_app.tsx to use ThemeProvider**

Wrap the existing app with ThemeProvider. Find the existing theme provider and
replace it with the new ThemeProvider.

**Step 2: Update header.tsx to include ThemeToggle**

Add ThemeToggle button to the header navigation area, next to LanguagePicker.

**Step 3: Test manually**

Run: `yarn dev` Visit: http://localhost:3000 Verify: Theme toggle button appears
and toggles theme

**Step 4: Commit**

```bash
git add app/pages/_app.tsx app/components/header.tsx
git commit -m "feat: integrate ThemeProvider and ThemeToggle in app"
```

---

## Phase 2: Chart Placeholders & Loading Skeletons

### Task 2.1: Create ChartPlaceholder Component

**Files:**

- Create: `app/charts/shared/ChartPlaceholder.tsx`
- Create: `app/charts/shared/__tests__/ChartPlaceholder.test.tsx`

**Step 1: Write the failing test**

```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChartPlaceholder } from "../ChartPlaceholder";

describe("ChartPlaceholder", () => {
  it("should render with message", () => {
    render(<ChartPlaceholder type="bar" message="No data available" />);
    expect(screen.getByText("No data available")).toBeInTheDocument();
  });

  it("should render action button when provided", () => {
    render(
      <ChartPlaceholder
        type="bar"
        action={<button>Load sample</button>}
      />
    );
    expect(screen.getByText("Load sample")).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd app && vitest run charts/shared/__tests__/ChartPlaceholder.test.tsx`
Expected: FAIL

**Step 3: Write minimal implementation**

```typescript
// app/charts/shared/ChartPlaceholder.tsx
"use client";

import { Box, Typography, alpha, useTheme } from "@mui/material";
import { ReactNode } from "react";
import BarChartIcon from "@mui/icons-material/BarChart";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import PieChartIcon from "@mui/icons-material/PieChart";
import InsertChartIcon from "@mui/icons-material/InsertChart";

export interface ChartPlaceholderProps {
  type: "bar" | "line" | "pie" | "column" | "area";
  message?: string;
  action?: ReactNode;
}

const iconMap = {
  bar: BarChartIcon,
  line: ShowChartIcon,
  pie: PieChartIcon,
  column: InsertChartIcon,
  area: ShowChartIcon,
};

export function ChartPlaceholder({
  type,
  message = "No data available",
  action,
}: ChartPlaceholderProps) {
  const theme = useTheme();
  const Icon = iconMap[type] || BarChartIcon;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        minHeight: 200,
        p: 4,
        borderRadius: 2,
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.primary.main,
          0.05
        )} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
        border: "1px dashed",
        borderColor: alpha(theme.palette.primary.main, 0.2),
      }}
    >
      <Icon
        sx={{
          fontSize: 64,
          color: alpha(theme.palette.primary.main, 0.3),
          mb: 2,
        }}
      />
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: action ? 2 : 0 }}
      >
        {message}
      </Typography>
      {action}
    </Box>
  );
}
```

**Step 4: Run test to verify it passes**

Run: `cd app && vitest run charts/shared/__tests__/ChartPlaceholder.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add app/charts/shared/ChartPlaceholder.tsx app/charts/shared/__tests__/ChartPlaceholder.test.tsx
git commit -m "feat: add ChartPlaceholder component for empty states"
```

---

### Task 2.2: Enhance DemoSkeleton with Animations

**Files:**

- Modify: `app/components/demos/DemoSkeleton.tsx`

**Step 1: Add CSS keyframes for shimmer effect**

Add a shimmer animation keyframes to the existing DemoSkeleton component using
MUI's keyframes utility.

**Step 2: Apply animation to skeletons**

Update the Skeleton components to use a custom shimmer animation.

**Step 3: Test manually**

Run: `yarn dev` Visit: http://localhost:3000/demos/showcase Verify: Skeleton
loading states have smooth shimmer animation

**Step 4: Commit**

```bash
git add app/components/demos/DemoSkeleton.tsx
git commit -m "feat: add shimmer animation to DemoSkeleton"
```

---

## Phase 3: Demo Cards, Header & Playground Polish

### Task 3.1: Add Category Icons and Hover Effects to Demo Cards

**Files:**

- Modify: `app/demos/showcase/_components/FeaturedChartCard.tsx`
- Check existing file for current implementation

**Step 1: Add category icon mapping**

Create a mapping from category/topic to MUI icon.

**Step 2: Add hover effects**

Add transform and box-shadow on hover using MUI sx prop.

**Step 3: Add featured badge**

Add a "Featured" Chip component for highlighted cards.

**Step 4: Test manually**

Run: `yarn dev` Visit: http://localhost:3000/demos/showcase Verify: Cards have
icons, hover effects, and badges

**Step 5: Commit**

```bash
git add app/demos/showcase/_components/FeaturedChartCard.tsx
git commit -m "feat: add category icons and hover effects to demo cards"
```

---

### Task 3.2: Make Header Sticky with Mobile Responsiveness

**Files:**

- Modify: `app/components/header.tsx`

**Step 1: Add sticky positioning**

Add `position: sticky`, `top: 0`, and `zIndex` to the header container.

**Step 2: Add subtle shadow**

Add a subtle box-shadow that appears on scroll.

**Step 3: Ensure mobile responsiveness**

Use MUI's `useMediaQuery` or hidden props to adjust padding and layout on
mobile.

**Step 4: Test manually**

Run: `yarn dev` Visit: http://localhost:3000 Verify: Header sticks on scroll,
looks good on mobile

**Step 5: Commit**

```bash
git add app/components/header.tsx
git commit -m "feat: make header sticky with mobile responsiveness"
```

---

### Task 3.3: Group Playground Controls with Tooltips

**Files:**

- Modify: `app/demos/playground/_components/ConfigPanel/index.tsx`

**Step 1: Group controls in sections**

Wrap related controls in Card or Accordion components.

**Step 2: Add tooltips**

Wrap control labels in MUI Tooltip components with helpful descriptions.

**Step 3: Add preset buttons**

Add preset configuration buttons for common chart setups.

**Step 4: Test manually**

Run: `yarn dev` Visit: http://localhost:3000/demos/playground Verify: Controls
are grouped, tooltips work, presets apply configurations

**Step 5: Commit**

```bash
git add app/demos/playground/_components/ConfigPanel/
git commit -m "feat: group playground controls with tooltips and presets"
```

---

## Final Verification

### Task 4.1: Run Full Test Suite

Run: `cd app && vitest run` Expected: All tests pass

### Task 4.2: Run Linting

Run: `yarn lint` Expected: No errors

### Task 4.3: Manual E2E Verification

1. Visit each page and verify:
   - Theme toggle works on all pages
   - Loading skeletons animate smoothly
   - Chart placeholders display correctly
   - Demo cards have hover effects
   - Header is sticky
   - Playground controls are grouped

### Task 4.4: Final Commit

```bash
git add -A
git commit -m "feat: complete UI/UX improvements implementation"
```
