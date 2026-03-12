import { t } from "@lingui/macro";
import { Box, Link, SxProps, Typography } from "@mui/material";
import NextLink from "next/link";

import { Footer as FooterComponent } from "@/components/footer-components";
import contentRoutes from "@/content-routes.json";
import { BUILD_COMMIT, BUILD_GITHUB_REPO, BUILD_VERSION } from "@/domain/env";
import { useLocale } from "@/locales/use-locale";
import { OWNER_ORGANIZATION_EMAIL } from "@/templates/email/config";

const mkVersionLink = () => {
  let commitLink = "";
  let href = "";

  if (BUILD_COMMIT && BUILD_COMMIT !== "undefined") {
    commitLink = `(${BUILD_COMMIT.substr(0, 7)})`;
  }

  if (BUILD_GITHUB_REPO && BUILD_COMMIT && BUILD_COMMIT !== "undefined") {
    href = `${BUILD_GITHUB_REPO}/commit/${BUILD_COMMIT}`;
  }

  return {
    title: `${BUILD_VERSION || ""} ${commitLink}`.trim(),
    href,
    external: true,
  };
};

export const Footer = ({ sx }: { sx?: SxProps }) => {
  const locale = useLocale();

  const getLocalizedRoute = <
    T extends Record<string, { title: string; path: string }>
  >(
    routes: T
  ) => {
    const key = (locale in routes ? locale : "en") as keyof T;
    return routes[key];
  };

  const legalRoute = getLocalizedRoute(contentRoutes.legal);
  const imprintRoute = getLocalizedRoute(contentRoutes.imprint);
  const legalLink = {
    title: legalRoute.title,
    href: legalRoute.path,
    external: false,
  };
  const imprintLink = {
    title: imprintRoute.title,
    href: imprintRoute.path,
    external: false,
  };
  const versionLink = mkVersionLink();

  return (
    <FooterComponent
      ContentWrapperProps={{ sx: sx ?? undefined }}
      bottomLinks={[versionLink, imprintLink, legalLink]}
      nCols={3}
    >
      <Box
        sx={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: 6,
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            {t({
              id: "footer.about_us.label",
              message: "About this portal",
            })}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {t({
              id: "footer.about_us.text",
              message:
                "The portal data.gov.rs allows the visualization of Serbian Open Government Data. Open Government Data (OGD) are data that are made available to the public free of charge in computer-readable format.",
            })}
          </Typography>
        </Box>
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            {t({ id: "footer.contact.title", message: "Stay informed" })}
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Link
              href="https://youtube.com/@vizualni"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              YouTube
            </Link>
            <Link
              href="https://github.com/acailic/vizualni-admin"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              GitHub
            </Link>
            <Link
              href={`mailto:${OWNER_ORGANIZATION_EMAIL}`}
              aria-label="Contact via email"
            >
              Email
            </Link>
          </Box>
        </Box>
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            {t({
              id: "footer.information.title",
              message: "Further information",
            })}
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Link
              href="https://data.gov.rs"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t({
                id: "footer.button.open_data_portal",
                message: "Serbia Open Data Portal",
              })}
            </Link>
            <Link
              href="https://github.com/acailic/vizualni-admin/wiki"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t({
                id: "footer.tutorials",
                message: "Documentation",
              })}
            </Link>
            <NextLink href="/statistics" passHref legacyBehavior>
              <Link>
                {t({
                  id: "footer.statistics",
                  message: "Statistics",
                })}
              </Link>
            </NextLink>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          maxWidth: "1200px",
          margin: "24px auto 0",
          pt: 4,
          borderTop: "1px solid",
          borderColor: "divider",
          display: "flex",
          gap: 3,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {versionLink.href ? (
          <Link
            href={versionLink.href}
            target="_blank"
            rel="noopener noreferrer"
            variant="body2"
          >
            {versionLink.title}
          </Link>
        ) : (
          <Typography variant="body2">{versionLink.title}</Typography>
        )}
        <NextLink href={imprintLink.href} passHref legacyBehavior>
          <Link variant="body2">{imprintLink.title}</Link>
        </NextLink>
      </Box>
    </FooterComponent>
  );
};
