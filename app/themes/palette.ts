import { type ThemeOptions } from "@mui/material";
import { PaletteOptions } from "@mui/material/styles";

import { colors } from "@/themes/constants";

// Serbian national colors - using Serbian blue as primary
const blue: PaletteOptions["blue"] = {
  main: "#0C4076",
  50: "#E8EEF5",
  100: "#C6D5E8",
  200: "#A0BAD9",
  300: "#7A9ECA",
  400: "#5D89BF",
  500: "#3F74B4",
  600: "#396CAD",
  700: "#0C4076",
  800: "#0A3665",
  900: "#082A53",
};

const orange: PaletteOptions["orange"] = {
  main: "#9A3412",
  50: "#FFF7ED",
  100: "#FFEDD5",
  200: "#FED7AA",
  300: "#FDBA74",
  400: "#FB923C",
  500: "#F97316",
  600: "#EA580C",
  700: "#C2410C",
  800: "#9A3412",
  900: "#7C2D12",
};

const green: PaletteOptions["green"] = {
  main: "#047857",
  50: "#ECFDF5",
  100: "#D1FAE5",
  200: "#A7F3D0",
  300: "#6EE7B7",
  400: "#34D399",
  500: "#10B981",
  600: "#059669",
  700: "#047857",
  800: "#065F46",
  900: "#064E3B",
};

// Serbian blue as primary color
export const PRIMARY_COLOR = blue[700];

// Shared Serbian red overrides (used in both light and dark palettes)
const serbianRed = {
  ...colors.red,
  main: "#C6363C",
  700: "#C6363C",
  800: "#B42F35",
  900: "#9E2A2F",
};

// Shared yellow palette (main differs between modes)
const yellowBase = {
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
};

// Shared color extensions
const cobaltExtension = {
  main: colors.cobalt[600],
  ...colors.cobalt,
};

const monochromeExtension = {
  main: colors.monochrome[500],
  ...colors.monochrome,
};

// Light mode palette
export const lightPalette = {
  mode: "light" as const,
  primary: {
    main: blue[700],
    light: blue[500],
    dark: blue[900],
    contrastText: "#fff",
  },
  secondary: {
    main: colors.cobalt[500],
    light: colors.cobalt[300],
    dark: colors.cobalt[700],
    contrastText: "#fff",
  },
  text: {
    primary: colors.monochrome[900],
    secondary: colors.monochrome[700],
  },
  background: {
    default: "#FAFAFA",
    paper: "#FFFFFF",
  },
  divider: colors.monochrome[200],
  error: {
    main: colors.red[600],
    light: colors.red[100],
    dark: colors.red[800],
    contrastText: "#fff",
  },
  warning: {
    main: orange[600],
    light: orange[100],
    dark: orange[800],
    contrastText: "#fff",
  },
  info: {
    main: blue[600],
    light: blue[100],
    dark: blue[800],
    contrastText: "#fff",
  },
  success: {
    main: green[600],
    light: green[100],
    dark: green[800],
    contrastText: "#fff",
  },
  cobalt: cobaltExtension,
  monochrome: monochromeExtension,
  red: serbianRed,
  orange,
  yellow: { ...yellowBase, main: "#D97706" },
  green,
  blue,
} satisfies ThemeOptions["palette"];

// Dark mode palette (default/existing)
export const darkPalette = {
  mode: "dark",
  primary: {
    main: PRIMARY_COLOR,
    dark: blue[900],
    contrastText: "#fff",
  },
  secondary: {
    main: colors.cobalt[400],
    dark: colors.cobalt[600],
    contrastText: "#fff",
  },
  text: {
    primary: colors.monochrome[50],
    secondary: colors.monochrome[300],
  },
  background: {
    default: "#0B1220",
    paper: "#111827",
  },
  divider: colors.monochrome[700],
  error: {
    main: colors.red[800],
    light: colors.red[50],
    contrastText: "#fff",
  },
  warning: {
    main: orange[800],
    light: orange[50],
    contrastText: "#fff",
  },
  info: {
    main: blue[700],
    light: blue[50],
    contrastText: "#fff",
  },
  success: {
    main: green[700],
    light: green[50],
    contrastText: "#fff",
  },
  cobalt: {
    main: colors.cobalt[700],
    ...colors.cobalt,
  },
  monochrome: {
    main: colors.monochrome[700],
    ...colors.monochrome,
  },
  red: serbianRed,
  orange,
  yellow: { ...yellowBase, main: "#92400E" },
  green,
  blue,
} satisfies ThemeOptions["palette"];

// Light mode for government portal style
export const palette = lightPalette;
