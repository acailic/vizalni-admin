import { GetStaticProps } from "next";
import { useRouter } from "next/router";

import { SelectDatasetStep } from "@/browse/ui/select-dataset-step";
import { AppLayout } from "@/components/layout";
import { ConfiguratorStateProvider } from "@/configurator/configurator-state";
import { Container, Typography } from "@mui/material";

interface BrowsePageProps {
  hideHeader?: boolean;
}

export function DatasetBrowser({ hideHeader = false }: BrowsePageProps) {
  const router = useRouter();
  const isStaticExport = Boolean(process.env.NEXT_PUBLIC_BASE_PATH);

  if (typeof window === "undefined" && isStaticExport) {
    return (
      <AppLayout hideHeader={hideHeader}>
        <Container sx={{ py: 6 }}>
          <Typography variant="h4" gutterBottom>
            Demo limita za statički build
          </Typography>
          <Typography color="text.secondary">
            Pregled datasets zahteva runtime API pozive. U GitHub Pages statičkom
            izdanju ova stranica je onemogućena; koristi embed demo ili lokalni
            build za punu funkcionalnost.
          </Typography>
        </Container>
      </AppLayout>
    );
  }

  return (
    <AppLayout hideHeader={hideHeader}>
      <ConfiguratorStateProvider chartId="new" allowDefaultRedirect={false}>
        <SelectDatasetStep variant="page" />
      </ConfiguratorStateProvider>
    </AppLayout>
  );
}

export default DatasetBrowser;

export const getStaticProps: GetStaticProps<BrowsePageProps> = async ({
  locale
}) => {
  // Generate static props for browse page - this page loads dataset data client-side
  // but the shell can be static for instant loading
  return {
    props: {
      hideHeader: false
    }

  };
};
