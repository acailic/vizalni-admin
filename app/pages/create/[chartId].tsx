import { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";

import { AppLayout } from "@/components/layout";

const ConfiguratorWithProvider = dynamic(
  () =>
    import("@/configurator/components/configurator").then((m) => {
      const { ConfiguratorStateProvider } = require("@/configurator");
      const {
        AddNewDatasetPanel,
      } = require("@/configurator/components/add-new-dataset-panel");
      return {
        default: ({ chartId }: { chartId: string }) => (
          <ConfiguratorStateProvider chartId={chartId}>
            <m.Configurator />
            <AddNewDatasetPanel />
          </ConfiguratorStateProvider>
        ),
      };
    }),
  {
    ssr: false,
    loading: () => null,
  }
);

const ChartConfiguratorPage: NextPage = () => {
  const router = useRouter();
  const chartId = router.query.chartId as string;
  return (
    <>
      <Head>
        {/* Disables responsive scaling for this page (other pages still work) */}
        <meta name="viewport" content="width=1280"></meta>
      </Head>
      <AppLayout editing>
        <ConfiguratorWithProvider chartId={chartId} />
      </AppLayout>
    </>
  );
};

export default ChartConfiguratorPage;
