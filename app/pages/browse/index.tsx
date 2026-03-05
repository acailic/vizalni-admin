import { Container, Typography } from "@mui/material";
import { GetStaticProps } from "next";

import { AppLayout } from "@/components/layout";

interface BrowsePageProps {
  hideHeader?: boolean;
}

export function DatasetBrowser({ hideHeader = false }: BrowsePageProps) {
  const isStaticExport = Boolean(process.env.NEXT_PUBLIC_BASE_PATH);

  // Keep static-export environments on the explanatory fallback view on both
  // server and client. Attempting to hydrate the full browse flow on GitHub
  // Pages leads to runtime failures because API routes are unavailable there.
  if (isStaticExport) {
    return (
      <AppLayout hideHeader={hideHeader}>
        <Container sx={{ py: 6 }}>
          <>
            <Typography variant="h4" gutterBottom>
              Demo limita za statički build
            </Typography>
            <Typography color="text.secondary">
              Pregled datasets zahteva runtime API pozive. U GitHub Pages
              statičkom izdanju ova stranica je onemogućena; koristi embed demo
              ili lokalni build za punu funkcionalnost.
            </Typography>
          </>
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
