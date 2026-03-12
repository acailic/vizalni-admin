import "iframe-resizer/js/iframeResizer.contentWindow.js";
import { GetStaticPaths, GetStaticProps } from "next";
import dynamic from "next/dynamic";
import ErrorPage from "next/error";
import Head from "next/head";
import Script from "next/script";

import { useEmbedQueryParams } from "@/components/embed-params";
import type { ConfiguratorStatePublished } from "@/config-types";

import { Config as PrismaConfig } from "../../db/prisma-types";

const ChartPublishedWrapper = dynamic(
  () =>
    import("@/components/chart-published").then((mod) => {
      const { ConfiguratorStateProvider } = require("@/configurator");
      return {
        default: ({ key, state, embedParams }: any) => (
          <ConfiguratorStateProvider
            chartId="published"
            initialState={{ ...state, state: "PUBLISHED" }}
          >
            <mod.ChartPublished configKey={key} embedParams={embedParams} />
          </ConfiguratorStateProvider>
        ),
      };
    }),
  {
    ssr: false,
    loading: () => null,
  }
);

type PageProps =
  | {
      status: "notfound";
    }
  | {
      status: "found";
      config: Omit<PrismaConfig, "data"> & {
        data: Omit<ConfiguratorStatePublished, "activeField" | "state">;
      };
    };

// For static export, we'll return an empty array
// Charts won't be pre-rendered in demo mode
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  // In static export mode, return notfound
  // In production with a database, this would fetch the config
  return {
    props: {
      status: "notfound",
    },
  };
};

const EmbedPage = (props: PageProps) => {
  const { embedParams } = useEmbedQueryParams();

  if (props.status === "notfound") {
    return <ErrorPage statusCode={404} />;
  }

  const {
    config: { key, data: state },
  } = props;

  return (
    <>
      <Head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self' 'unsafe-inline'; script-src 'unsafe-inline' 'self' https://cdn.jsdelivr.net/npm/@open-iframe-resizer/; style-src 'self' 'unsafe-inline';"
        />
      </Head>
      <Script
        type="module"
        src="https://cdn.jsdelivr.net/npm/@open-iframe-resizer/core@1.6.0/dist/index.js"
      />
      <ChartPublishedWrapper
        key={key}
        state={state}
        embedParams={embedParams}
      />
    </>
  );
};

export default EmbedPage;
