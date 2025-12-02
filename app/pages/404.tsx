import { Box, Container, SxProps, Typography } from "@mui/material";

import {
  Actions,
  ErrorPageHint,
  HomeLink,
} from "@/components/error-pages-components";
import { ContentLayout } from "@/components/layout";

const heroBoxSx: SxProps = {
  background: "linear-gradient(135deg, #0C4076 0%, #C6363C 100%)",
  my: "auto",
  py: 6,
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "repeating-linear-gradient(0deg, transparent, transparent 35px, rgba(255,255,255,.03) 35px, rgba(255,255,255,.03) 70px)",
    pointerEvents: "none",
  },
};

const contentWrapperSx: SxProps = {
  textAlign: "center",
  position: "relative",
  zIndex: 1,
};

const codeTextSx: SxProps = {
  fontSize: { xs: "5rem", md: "8rem" },
  fontWeight: 900,
  color: "white",
  textShadow: "4px 4px 8px rgba(0,0,0,0.3)",
  mb: 2,
};

const sectionSx: SxProps = {
  py: 3,
  borderBottom: "1px solid rgba(255,255,255,0.1)",
  "&:last-child": {
    borderBottom: "none",
  },
};

const titleSx: SxProps = {
  color: "white",
  fontWeight: 700,
  textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
  mb: 1,
  fontSize: { xs: "1.25rem", md: "1.5rem" },
};

const descriptionSx: SxProps = {
  color: "rgba(255,255,255,0.9)",
  mb: 2,
  fontWeight: 400,
  fontSize: { xs: "0.9rem", md: "1rem" },
};

const homeLinkSx: SxProps = {
  backgroundColor: "white",
  color: "#0C4076",
  fontWeight: 600,
  px: 3,
  py: 1,
  borderRadius: 2,
  textDecoration: "none",
  display: "inline-block",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  fontSize: "0.9rem",
  "&:hover": {
    backgroundColor: "#f5f5f5",
    transform: "translateY(-2px)",
    boxShadow: "0 6px 16px rgba(0,0,0,0.3)",
  },
};

const Page = () => (
  <ContentLayout>
    <Box sx={heroBoxSx}>
      <Container maxWidth="md">
        <ErrorPageHint>
          <Box sx={contentWrapperSx}>
            <Typography variant="h1" sx={codeTextSx}>
              404
            </Typography>

            {/* Serbian Latin */}
            <Box sx={sectionSx}>
              <Typography component="div" variant="h2" sx={titleSx}>
                Stranica nije pronađena
              </Typography>
              <Typography variant="body1" sx={descriptionSx}>
                Ups! Izgleda da ste zalutali. Ova stranica ne postoji.
              </Typography>
              <Actions>
                <Box sx={homeLinkSx}>
                  <HomeLink locale="sr-Latn">Povratak na početnu stranu</HomeLink>
                </Box>
              </Actions>
            </Box>

            {/* Serbian Cyrillic */}
            <Box sx={sectionSx}>
              <Typography component="div" variant="h2" sx={titleSx}>
                Страница није пронађена
              </Typography>
              <Typography variant="body1" sx={descriptionSx}>
                Упс! Изгледа да сте залутали. Ова страница не постоји.
              </Typography>
              <Actions>
                <Box sx={homeLinkSx}>
                  <HomeLink locale="sr-Cyrl">Повратак на почетну страну</HomeLink>
                </Box>
              </Actions>
            </Box>

            {/* English */}
            <Box sx={sectionSx}>
              <Typography component="div" variant="h2" sx={titleSx}>
                Page not found
              </Typography>
              <Typography variant="body1" sx={descriptionSx}>
                Oops! Looks like you got lost. This page does not exist.
              </Typography>
              <Actions>
                <Box sx={homeLinkSx}>
                  <HomeLink locale="en">Back to Homepage</HomeLink>
                </Box>
              </Actions>
            </Box>
          </Box>
        </ErrorPageHint>
      </Container>
    </Box>
  </ContentLayout>
);

export default Page;
