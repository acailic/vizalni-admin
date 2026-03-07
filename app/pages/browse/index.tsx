import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { GetStaticProps } from "next";
import Link from "next/link";

import { AppLayout } from "@/components/layout";
import { useLocale } from "@/locales/use-locale";
import { isStaticExportMode } from "@/utils/public-paths";

interface BrowsePageProps {
  hideHeader?: boolean;
}

export function DatasetBrowser({ hideHeader = false }: BrowsePageProps) {
  const locale = useLocale();
  const isCyrillic = locale === "sr-Cyrl";
  const isSerbian = locale.startsWith("sr");

  // Keep static-export environments on the explanatory fallback view on both
  // server and client. Attempting to hydrate the full browse flow on GitHub
  // Pages leads to runtime failures because API routes are unavailable there.
  if (isStaticExportMode) {
    return (
      <AppLayout hideHeader={hideHeader}>
        <Container sx={{ py: 6 }}>
          <Box sx={{ maxWidth: 760 }}>
            <Typography variant="h4" gutterBottom>
              {isCyrillic
                ? "Ograničenje statičkog izdanja"
                : isSerbian
                  ? "Ograničenje statičkog izdanja"
                  : "Static build limitation"}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              {isCyrillic
                ? "Pregled dataset-a zahteva runtime API pozive. GitHub Pages izdanje zato ne može da učita puni browser, ali možete odmah da otvorite showcase i playground."
                : isSerbian
                  ? "Pregled dataseta zahteva runtime API pozive. GitHub Pages izdanje zato ne može da učita puni browser, ali možete odmah da otvorite showcase i playground."
                  : "Browsing datasets requires runtime API calls. The GitHub Pages build cannot load the full browser, but you can still use the showcase and playground."}
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button
                component={Link}
                href="/demos/showcase"
                variant="contained"
              >
                {isCyrillic
                  ? "Pogledaj istaknute demoe"
                  : isSerbian
                    ? "Pogledaj istaknute demoe"
                    : "View featured demos"}
              </Button>
              <Button
                component={Link}
                href="/demos/playground"
                variant="outlined"
              >
                {isCyrillic
                  ? "Otvorite playground"
                  : isSerbian
                    ? "Otvorite playground"
                    : "Open playground"}
              </Button>
            </Stack>
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
