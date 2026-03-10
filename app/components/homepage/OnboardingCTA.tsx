import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";

type Locale = "en" | "sr" | "sr-Cyrl";

const COPY: Record<
  Locale,
  { title: string; description: string; cta: string }
> = {
  en: {
    title: "New here?",
    description:
      "Start with our guided wizard to create your first visualization",
    cta: "Get Started",
  },
  sr: {
    title: "Prvi put ovde?",
    description: "Započnite sa vodičem da kreirate prvu vizualizaciju",
    cta: "Započni",
  },
  "sr-Cyrl": {
    title: "Први пут овде?",
    description: "Започите човод ченим да креирате прву визуализацију",
    cta: "Започни",
  },
};

interface OnboardingCTAProps {
  locale?: Locale;
}

export function OnboardingCTA({ locale = "en" }: OnboardingCTAProps) {
  const copy = COPY[locale];

  return (
    <Box
      sx={{
        backgroundColor: "primary.light",
        borderRadius: 2,
        p: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      <Typography variant="h5" component="h2">
        {copy.title}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400 }}>
        {copy.description}
      </Typography>
      <Link href="/onboarding" passHref>
        <Button variant="contained" color="primary">
          {copy.cta}
        </Button>
      </Link>
    </Box>
  );
}
