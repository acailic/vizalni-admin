import { useRouter } from "next/router";
import { GetStaticProps } from "next";

import { SelectDatasetStep } from "@/browse/ui/select-dataset-step";
import { AppLayout } from "@/components/layout";
import { ConfiguratorStateProvider } from "@/configurator/configurator-state";

interface BrowsePageProps {
  hideHeader?: boolean;
}

export function DatasetBrowser({ hideHeader = false }: BrowsePageProps) {
  const router = useRouter();

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
      hideHeader: false,
    },
    revalidate: 300, // Revalidate every 5 minutes for potential updates
  };
};
