import { defineMessage } from "@lingui/macro";
import { Trans, useLingui } from "@lingui/react";
import { Box, Button, Container, Typography } from "@mui/material";
import Link from "next/link";
import { ReactNode } from "react";

import { Flex } from "@/components/flex";
import { Header } from "@/components/header";
import type { DemoDatasetInfo } from "@/types/demos";

interface DemoLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  datasetInfo?: DemoDatasetInfo;
  hideBackButton?: boolean;
}

export function DemoLayout({
  children,
  title,
  description,
  datasetInfo,
  hideBackButton = false,
}: DemoLayoutProps) {
  const { i18n } = useLingui();
  const locale = i18n.locale?.startsWith("sr") ? "sr" : "en";
  const dateLocale = locale === "sr" ? "sr-RS" : "en-US";

  const formattedUpdatedAt = datasetInfo?.updatedAt
    ? new Date(datasetInfo.updatedAt).toLocaleDateString(dateLocale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : undefined;

  return (
    <Flex sx={{ minHeight: "100vh", flexDirection: "column" }}>
      <Header />

      <Box
        component="main"
        sx={{
          flex: 1,
          backgroundColor: "monochrome.100",
          py: 4,
        }}
      >
        <Container maxWidth="xl">
          {!hideBackButton && (
            <Box sx={{ mb: 4 }}>
              <Link href="/demos" passHref legacyBehavior>
                <Button
                  component="a"
                  startIcon={<span>←</span>}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    color: "text.secondary",
                    "&:hover": {
                      color: "primary.main",
                      backgroundColor: "transparent",
                      transform: "translateX(-4px)",
                    },
                    transition: "all 0.2s",
                    pl: 0,
                  }}
                >
                  <Trans id="demos.layout.back">Back to demo gallery</Trans>
                </Button>
              </Link>
            </Box>
          )}

          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 800,
                mb: 2,
                color: "grey.900",
                letterSpacing: "-0.02em",
              }}
            >
              {title}
            </Typography>

            {description && (
              <Typography
                variant="h6"
                component="p"
                sx={{
                  color: "text.secondary",
                  fontWeight: 400,
                  mb: 3,
                  maxWidth: "800px",
                  lineHeight: 1.6,
                }}
              >
                {description}
              </Typography>
            )}

            {datasetInfo && (
              <Box
                sx={{
                  display: "flex",
                  gap: 3,
                  mt: 3,
                  flexWrap: "wrap",
                  alignItems: "center",
                  p: 2,
                  backgroundColor: "background.paper",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  width: "fit-content",
                }}
              >
                {!datasetInfo.datasetUrl && (
                  <Typography
                    variant="body2"
                    sx={{ color: "warning.main", fontWeight: 600, mb: 1 }}
                  >
                    <Trans id="demos.layout.demo-data">Demo Data</Trans>
                  </Typography>
                )}
                {datasetInfo.organization && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight={600}
                    >
                      {i18n._(
                        defineMessage({
                          id: "demos.layout.organization",
                          message: "Organization",
                        })
                      )}
                      :
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                      {datasetInfo.organization}
                    </Typography>
                  </Box>
                )}

                {datasetInfo.organization && formattedUpdatedAt && (
                  <Box
                    sx={{ width: 1, height: 16, backgroundColor: "divider" }}
                  />
                )}

                {formattedUpdatedAt && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight={600}
                    >
                      {i18n._(
                        defineMessage({
                          id: "demos.layout.updated",
                          message: "Updated",
                        })
                      )}
                      :
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                      {formattedUpdatedAt}
                    </Typography>
                  </Box>
                )}

                {datasetInfo.datasetUrl && (
                  <>
                    <Box
                      sx={{ width: 1, height: 16, backgroundColor: "divider" }}
                    />
                    <Link href={datasetInfo.datasetUrl} passHref legacyBehavior>
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#0ea5e9",
                          textDecoration: "none",
                          fontWeight: 600,
                          fontSize: "0.875rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        {i18n._(
                          defineMessage({
                            id: "demos.layout.view-dataset",
                            message: "View on data.gov.rs",
                          })
                        )}{" "}
                        ↗
                      </a>
                    </Link>
                  </>
                )}
              </Box>
            )}
          </Box>

          <Box sx={{ minHeight: 400 }}>{children}</Box>

          <Box
            sx={{
              mt: 6,
              pt: 4,
              borderTop: 1,
              borderColor: "divider",
              textAlign: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {i18n._(
                defineMessage({
                  id: "demos.layout.source",
                  message: locale === "sr" ? "Izvor podataka" : "Data source",
                })
              )}
              :{" "}
              <Link href="https://data.gov.rs" passHref legacyBehavior>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "inherit", textDecoration: "underline" }}
                >
                  data.gov.rs
                </a>
              </Link>
            </Typography>
          </Box>
        </Container>
      </Box>
    </Flex>
  );
}

export function DemoLoading({ message }: { message?: string }) {
  const { i18n } = useLingui();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 8,
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          border: "4px solid",
          borderColor: "primary.light",
          borderTopColor: "primary.main",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          mb: 2,
          "@keyframes spin": {
            "0%": { transform: "rotate(0deg)" },
            "100%": { transform: "rotate(360deg)" },
          },
        }}
      />
      <Typography variant="body1" color="text.secondary">
        {message ||
          i18n._(
            defineMessage({
              id: "demos.layout.loading",
              message: "Loading data from data.gov.rs...",
            })
          )}
      </Typography>
    </Box>
  );
}

export function DemoError({
  error,
  onRetry,
}: {
  error: Error | string;
  onRetry?: () => void;
}) {
  const { i18n } = useLingui();
  const errorMessage = typeof error === "string" ? error : error.message;
  const isNoDatasetsError = errorMessage.includes("No datasets found");

  return (
    <Box
      sx={{
        backgroundColor: "error.lighter",
        border: 1,
        borderColor: "error.light",
        borderRadius: 2,
        p: 4,
        textAlign: "center",
      }}
    >
      <Typography variant="h6" color="error.main" sx={{ mb: 2 }}>
        <Trans id="demos.layout.error-title">Error loading data</Trans>
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {errorMessage}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {isNoDatasetsError ? (
          <Trans id="demos.layout.error-suggestions-no-datasets">
            This demo should display fallback data. Check the browser console
            for more details.
          </Trans>
        ) : (
          <Trans id="demos.layout.error-suggestions">
            Suggestions: try again, check internet connection, or open a
            different dataset from data.gov.rs.
          </Trans>
        )}
      </Typography>
      {onRetry && (
        <Button
          variant="contained"
          color="primary"
          onClick={onRetry}
          sx={{ textTransform: "none" }}
        >
          {i18n._(
            defineMessage({ id: "demos.layout.retry", message: "Try again" })
          )}
        </Button>
      )}
    </Box>
  );
}

export function DemoEmpty({ message }: { message?: string }) {
  const { i18n } = useLingui();

  return (
    <Box
      sx={{
        textAlign: "center",
        py: 8,
      }}
    >
      <Typography variant="h6" color="text.secondary">
        {message ||
          i18n._(
            defineMessage({
              id: "demos.layout.empty",
              message: "No data available",
            })
          )}
      </Typography>
    </Box>
  );
}
