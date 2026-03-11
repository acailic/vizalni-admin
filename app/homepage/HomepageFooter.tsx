import { Trans } from "@lingui/react";
import { Box, IconButton, Link, Typography } from "@mui/material";

import { ContentWrapper } from "@/components/content-wrapper";
import { Icon } from "@/icons";
import { version, gitCommitHash } from "@/utils/version-info";

const GITHUB_REPO_URL = "https://github.com/acailic/vizualni-admin";

export const HomepageFooter = () => {
  const commitUrl = `${GITHUB_REPO_URL}/commit/${gitCommitHash}`;
  const shortHash = gitCommitHash?.slice(0, 7) || "dev";

  return (
    <Box
      component="footer"
      data-testid="homepage-footer"
      sx={{
        borderTop: "1px solid",
        borderColor: "divider",
        py: 6,
        backgroundColor: "background.paper",
      }}
    >
      <ContentWrapper>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 6,
            mb: 4,
          }}
        >
          {/* About Us Section */}
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
              <Trans id="footer.aboutUs">About Us</Trans>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <Trans id="footer.aboutDescription">
                Vizualni Admin allows you to visualize Serbia&apos;s Open
                Government Data. Browse datasets, create interactive charts, and
                embed visualizations.
              </Trans>
            </Typography>
          </Box>

          {/* Stay Informed Section */}
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
              <Trans id="footer.stayInformed">Stay Informed</Trans>
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
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
                href="mailto:info@vizualni.rs"
                size="small"
                aria-label="Email"
              >
                <Icon name="mail" />
              </IconButton>
            </Box>
          </Box>

          {/* Further Information Section */}
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
              <Link href="/tutorials" variant="body2">
                <Trans id="footer.tutorials">Tutorials</Trans>
              </Link>
              <Link href="/statistics" variant="body2">
                <Trans id="footer.statistics">Statistics</Trans>
              </Link>
            </Box>
          </Box>
        </Box>

        {/* Bottom Links */}
        <Box
          sx={{
            display: "flex",
            gap: 4,
            pt: 4,
            borderTop: "1px solid",
            borderColor: "divider",
            flexWrap: "wrap",
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
          <Link href="/imprint" variant="body2">
            <Trans id="footer.imprint">Imprint</Trans>
          </Link>
          <Link href="/legal-framework" variant="body2">
            <Trans id="footer.legalFramework">Legal Framework</Trans>
          </Link>
        </Box>
      </ContentWrapper>
    </Box>
  );
};
