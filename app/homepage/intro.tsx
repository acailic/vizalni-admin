import { Box, Button, Typography } from "@mui/material";
import NextLink from "next/link";
import { ReactNode } from "react";

import { ContentWrapper } from "@/components/content-wrapper";
import { Icon } from "@/icons";
import { useLocale } from "@/locales/use-locale";

const eyebrowByLocale: Record<string, string> = {
  en: "Serbia Open Data Portal",
  "sr-Latn": "Portal otvorenih podataka Srbije",
  "sr-Cyrl": "Портал отворених података Србије",
};

export const Intro = ({
  title,
  teaser,
  buttonLabel,
}: {
  title: string;
  teaser: string;
  buttonLabel: string;
}) => {
  const locale = useLocale();
  const eyebrow = eyebrowByLocale[locale] ?? eyebrowByLocale.en;

  return (
    <Box
      sx={{
        background:
          "linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 38%, #F3F6FA 100%)",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <ContentWrapper
        sx={{
          py: { xs: 10, md: 16, lg: 20 },
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.15fr) 360px" },
            gap: { xs: 6, lg: 8 },
            alignItems: "stretch",
            width: "100%",
          }}
        >
          <Box sx={{ maxWidth: 760 }}>
            <Typography
              variant="overline"
              sx={{
                display: "inline-flex",
                mb: 3,
                px: 2,
                py: 1,
                borderRadius: "999px",
                bgcolor: "rgba(12,64,118,0.08)",
                color: "primary.dark",
                fontWeight: 700,
                letterSpacing: "0.08em",
              }}
            >
              {eyebrow}
            </Typography>
            <Title>{title}</Title>
            <Teaser>{teaser}</Teaser>
            <NextLink href="/browse" passHref legacyBehavior>
              <Button
                variant="contained"
                size="lg"
                endIcon={<Icon name="arrowRight" />}
                sx={{ boxShadow: "none" }}
              >
                {buttonLabel}
              </Button>
            </NextLink>
          </Box>

          <Box
            sx={{
              display: { xs: "none", lg: "grid" },
              alignSelf: "stretch",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 2,
              p: 3,
              borderRadius: 3,
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 24px 60px rgba(12, 64, 118, 0.08)",
            }}
          >
            <PreviewPanel accent="primary.main" lines={[82, 56, 68, 47]} />
            <PreviewPanel accent="#00A36C" lines={[61, 73, 45, 80]} />
            <PreviewPanel accent="#F59E0B" lines={[58, 34, 78, 49]} />
            <PreviewPanel accent="#475569" lines={[74, 62, 41, 69]} />
          </Box>
        </Box>
      </ContentWrapper>
    </Box>
  );
};

const PreviewPanel = ({
  accent,
  lines,
}: {
  accent: string;
  lines: number[];
}) => {
  return (
    <Box
      sx={{
        minHeight: 164,
        p: 2,
        borderRadius: 2,
        background:
          "linear-gradient(180deg, rgba(248,250,252,1) 0%, rgba(255,255,255,1) 100%)",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box
        sx={{
          width: 36,
          height: 6,
          borderRadius: "999px",
          bgcolor: accent,
          mb: 2,
        }}
      />
      <Box sx={{ display: "grid", gap: 1.25 }}>
        {lines.map((width, index) => (
          <Box
            key={`${accent}-${index}`}
            sx={{
              height: index === 0 ? 10 : 8,
              width: `${width}%`,
              borderRadius: "999px",
              bgcolor: index === 0 ? "text.primary" : "grey.300",
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

const Title = ({ children }: { children: ReactNode }) => (
  <Typography
    variant="h2"
    component="h1"
    sx={{
      mb: { xs: 4, md: 5 },
      fontWeight: 700,
      textWrap: "balance",
      maxWidth: "12ch",
    }}
  >
    {children}
  </Typography>
);

const Teaser = ({ children }: { children: ReactNode }) => (
  <Box sx={{ mb: { xs: 5, md: 6 }, maxWidth: 720 }}>
    <Typography
      variant="body1"
      sx={{
        color: "text.secondary",
        lineHeight: 1.7,
        fontSize: { xs: "1rem", md: "1.125rem" },
      }}
    >
      {children}
    </Typography>
  </Box>
);
