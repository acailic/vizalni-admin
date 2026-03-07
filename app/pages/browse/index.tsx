import { Box, Container, Typography } from "@mui/material";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { AppLayout } from "@/components/layout";
import { useLocale } from "@/locales/use-locale";
import { isStaticExportMode } from "@/utils/public-paths";

interface BrowsePageProps {
  hideHeader?: boolean;
}

export function DatasetBrowser({ hideHeader = false }: BrowsePageProps) {
  const locale = useLocale();
  const router = useRouter();

  // Redirect to showcase in static export mode
  useEffect(() => {
    if (isStaticExportMode) {
      router.replace("/demos/showcase");
    }
  }, [router]);

  // Show redirect message in static export mode
  if (isStaticExportMode) {
    return (
      <AppLayout hideHeader={hideHeader}>
        <Container sx={{ py: 6 }}>
          <Box sx={{ maxWidth: 760, mx: "auto", textAlign: "center" }}>
            <Typography variant="h4" gutterBottom>
              {locale === "sr-Cyrl"
                ? "Preusmeravanje..."
                : locale.startsWith("sr")
                  ? "Preusmeravanje..."
                  : "Redirecting..."}
            </Typography>
            <Typography color="text.secondary">
              {locale === "sr-Cyrl"
                ? "Preusmeravamo vas na galeriju demo primera..."
                : locale.startsWith("sr")
                  ? "Preusmeravamo vas na galeriju demo primera..."
                  : "Redirecting to demo gallery..."}
            </Typography>
          </Box>
        </Container>
      </AppLayout>
    );
  }

  if (typeof window === "undefined") {
    return (
      <AppLayout hideHeader={hideHeader}>
        <Container sx={{ py: 6 }}>
          <>
            <Typography variant="h4" gutterBottom>
              Loading browse iskustvo…
            </Typography>
            <Typography color="text.secondary">
              Ova stranica se učitava samo u pregledaču zbog oslanjanja na
              window/URL API.
            </Typography>
          </>
        </Container>
      </AppLayout>
    );
  }

  return (
    <AppLayout hideHeader={hideHeader}>
      <ClientSideDatasetBrowser />
    </AppLayout>
  );
}

// Client-side only component wrapper
function ClientSideDatasetBrowser() {
  const {
    ConfiguratorStateProvider,
  } = require("@/configurator/configurator-state");
  const { SelectDatasetStep } = require("@/browse/ui/select-dataset-step");

  return (
    <ConfiguratorStateProvider chartId="new" allowDefaultRedirect={false}>
      <SelectDatasetStep variant="page" />
    </ConfiguratorStateProvider>
  );
}

export default DatasetBrowser;

export const getStaticProps: GetStaticProps<BrowsePageProps> = async ({
  locale: _locale,
}) => {
  // Generate static props for browse page - this page loads dataset data client-side
  // but the shell can be static for instant loading
  return {
    props: {
      hideHeader: false,
    },
  };
};
