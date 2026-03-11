import { Trans } from "@lingui/macro";
import { Box, IconButton, Link, Typography } from "@mui/material";
import NextLink from "next/link";

import { ContentWrapper } from "@/components/content-wrapper";
import contentRoutes from "@/content-routes.json";
import { BUILD_GITHUB_REPO } from "@/domain/env";
import { Icon } from "@/icons";
import { useLocale } from "@/locales/use-locale";
import { OWNER_ORGANIZATION_EMAIL } from "@/templates/email/config";
import { version, gitCommitHash } from "@/utils/version-info";

const GITHUB_REPO_URL =
  BUILD_GITHUB_REPO || "https://github.com/acailic/vizualni-admin";

export const HomepageFooter = () => {
  const locale = useLocale();
  const commitUrl = `${GITHUB_REPO_URL}/commit/${gitCommitHash}`;
  const shortHash = gitCommitHash?.slice(0, 7) || "dev";
  const localizedContentRoutes = (
    locale in contentRoutes.imprint ? locale : "en"
  ) as keyof typeof contentRoutes.imprint;
  const imprintRoute = contentRoutes.imprint[localizedContentRoutes];
  const legalRoute = contentRoutes.legal[localizedContentRoutes];

  return (
    <Box
      component="footer"
      data-testid="homepage-footer"
      sx={{
        borderTop: "4px solid",
        borderColor: "primary.main",
        py: { xs: 6, md: 8 },
        backgroundColor: "background.paper",
      }}
    >
      <ContentWrapper>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: { xs: 5, md: 6 },
            mb: 4,
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
              <Trans id="footer.aboutUs">About Us</Trans>
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ maxWidth: 340, lineHeight: 1.7 }}
            >
              <Trans id="footer.aboutDescription">
                Vizualni Admin allows you to visualize Serbia&apos;s Open
                Government Data. Browse datasets, create interactive charts, and
                embed visualizations.
              </Trans>
            </Typography>
          </Box>

          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
              <Trans id="footer.stayInformed">Stay Informed</Trans>
            </Typography>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <IconButton
                component="a"
                href="https://youtube.com/@vizualni"
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                aria-label="YouTube"
              >
                <Icon name="youtube" />
              </IconButton>
              <IconButton
                component="a"
                href={`mailto:${OWNER_ORGANIZATION_EMAIL}`}
                size="small"
                aria-label="Email"
              >
                <Icon name="mail" />
              </IconButton>
            </Box>
          </Box>

          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
              <Trans id="footer.furtherInfo">Further Information</Trans>
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link
                href="https://data.gov.rs"
                target="_blank"
                rel="noopener noreferrer"
                variant="body2"
              >
                <Trans id="footer.dataPortal">Data Portal</Trans>
              </Link>
              <NextLink href="/tutorials" passHref legacyBehavior>
                <Link variant="body2">
                  <Trans id="footer.tutorials">Tutorials</Trans>
                </Link>
              </NextLink>
              <NextLink href="/statistics" passHref legacyBehavior>
                <Link variant="body2">
                  <Trans id="footer.statistics">Statistics</Trans>
                </Link>
              </NextLink>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 3,
            pt: 4,
            borderTop: "1px solid",
            borderColor: "divider",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <Link
            href={commitUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="body2"
          >
            v{version} ({shortHash})
          </Link>
          <NextLink href={imprintRoute.path} passHref legacyBehavior>
            <Link variant="body2">
              <Trans id="footer.imprint">Imprint</Trans>
            </Link>
          </NextLink>
          <NextLink href={legalRoute.path} passHref legacyBehavior>
            <Link variant="body2">
              <Trans id="footer.legalFramework">Legal Framework</Trans>
            </Link>
          </NextLink>
        </Box>
      </ContentWrapper>
    </Box>
  );
};
