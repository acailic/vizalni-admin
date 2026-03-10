import { Box, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";

import { useLocale } from "@/locales/use-locale";

const subtitleByLocale: Record<string, string> = {
  en: "Open Data Portal",
  "sr-Latn": "Portal otvorenih podataka",
  "sr-Cyrl": "Портал отворених података",
};

const CoatOfArms = () => (
  <Box
    component="svg"
    viewBox="0 0 32 40"
    sx={{ width: 28, height: 35, flexShrink: 0 }}
    aria-hidden="true"
  >
    {/* Simplified Serbian coat of arms - shield shape */}
    <path
      d="M16 2 L30 8 L30 20 Q30 32 16 38 Q2 32 2 20 L2 8 Z"
      fill="#C6363C"
      stroke="#8B1A1A"
      strokeWidth="1"
    />
    {/* White cross */}
    <rect x="14" y="8" width="4" height="22" fill="white" rx="0.5" />
    <rect x="7" y="15" width="18" height="4" fill="white" rx="0.5" />
    {/* Four Cyrillic S (ocila) simplified as C shapes */}
    <path
      d="M9 10 Q12 10 12 13 Q12 14 9 14"
      fill="none"
      stroke="white"
      strokeWidth="1.2"
    />
    <path
      d="M23 10 Q20 10 20 13 Q20 14 23 14"
      fill="none"
      stroke="white"
      strokeWidth="1.2"
    />
    <path
      d="M9 20 Q12 20 12 23 Q12 24 9 24"
      fill="none"
      stroke="white"
      strokeWidth="1.2"
    />
    <path
      d="M23 20 Q20 20 20 23 Q20 24 23 24"
      fill="none"
      stroke="white"
      strokeWidth="1.2"
    />
  </Box>
);

export const SimpleHeader = ({
  longTitle,
  shortTitle,
  rootHref,
  sx,
}: {
  longTitle: string;
  shortTitle: string;
  rootHref: string;
  sx?: object;
}) => {
  const router = useRouter();
  const locale = useLocale();
  const subtitle = subtitleByLocale[locale] ?? subtitleByLocale["en"];

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        padding: "16px 48px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #E0E0E0",
        ...sx,
      }}
    >
      <Link href={rootHref} passHref legacyBehavior>
        <Box
          component="a"
          data-testid="nav-home"
          onClick={(e) => {
            e.preventDefault();
            router.push(rootHref);
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            textDecoration: "none",
            cursor: "pointer",
            "&:hover": {
              opacity: 0.8,
            },
          }}
        >
          <CoatOfArms />
          <Box>
            <Typography
              variant="h4"
              sx={{
                color: "#0C4076",
                fontWeight: 700,
                display: { xs: "none", sm: "block" },
                lineHeight: 1.2,
              }}
            >
              {longTitle}
            </Typography>
            <Typography
              variant="h4"
              sx={{
                color: "#0C4076",
                fontWeight: 700,
                display: { xs: "block", sm: "none" },
                lineHeight: 1.2,
              }}
            >
              {shortTitle}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                display: { xs: "none", sm: "block" },
                lineHeight: 1,
              }}
            >
              {subtitle}
            </Typography>
          </Box>
        </Box>
      </Link>
    </Box>
  );
};
