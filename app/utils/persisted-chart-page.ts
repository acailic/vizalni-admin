import type { ConfiguratorStatePublished } from "@/config-types";
import { getConfig } from "@/db/config";
import type { Config as PrismaConfig } from "@/db/prisma-types";
import { serializeProps, type Serialized } from "@/db/serialize";
import { validateConfigKey } from "@/server/validation";
import { supportsPersistedChartPages } from "@/utils/public-paths";

import type { GetStaticPaths, GetStaticPropsContext } from "next";

export type PersistedChartPageProps =
  | {
      status: "notfound";
      config: null;
    }
  | {
      status: "found";
      config: Omit<PrismaConfig, "data"> & {
        data: Omit<ConfiguratorStatePublished, "activeField" | "state">;
      };
    };

export type SerializedPersistedChartPageProps =
  Serialized<PersistedChartPageProps>;

const getNotFoundProps = (): SerializedPersistedChartPageProps => {
  return serializeProps({
    status: "notfound" as const,
    config: null,
  });
};

export const getPersistedChartStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: supportsPersistedChartPages ? "blocking" : false,
  };
};

export const getPersistedChartStaticProps = async ({
  params,
}: GetStaticPropsContext<{ chartId: string }>) => {
  if (!supportsPersistedChartPages) {
    return {
      props: getNotFoundProps(),
    };
  }

  const chartId = params?.chartId;

  if (typeof chartId !== "string") {
    return {
      props: getNotFoundProps(),
      revalidate: 1,
    };
  }

  try {
    const key = validateConfigKey(chartId);
    const config = await getConfig(key);

    if (!config) {
      return {
        props: getNotFoundProps(),
        revalidate: 1,
      };
    }

    return {
      props: serializeProps({
        status: "found" as const,
        config,
      }),
      revalidate: 1,
    };
  } catch {
    return {
      props: getNotFoundProps(),
      revalidate: 1,
    };
  }
};
