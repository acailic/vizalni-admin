import { beforeEach, describe, expect, it, vi } from "vitest";

import { deserializeProps } from "@/db/serialize";
import {
  getPersistedChartStaticPaths,
  getPersistedChartStaticProps,
} from "@/utils/persisted-chart-page";

const mocks = vi.hoisted(() => {
  return {
    supportsPersistedChartPages: true,
    getConfig: vi.fn(),
    validateConfigKey: vi.fn((key: string) => key),
  };
});

vi.mock("@/db/config", () => ({
  getConfig: mocks.getConfig,
}));

vi.mock("@/server/validation", () => ({
  validateConfigKey: mocks.validateConfigKey,
}));

vi.mock("@/utils/public-paths", () => ({
  get supportsPersistedChartPages() {
    return mocks.supportsPersistedChartPages;
  },
}));

describe("persisted chart page helpers", () => {
  beforeEach(() => {
    mocks.supportsPersistedChartPages = true;
    mocks.getConfig.mockReset();
    mocks.validateConfigKey.mockReset();
    mocks.validateConfigKey.mockImplementation((key: string) => key);
  });

  it("returns blocking fallback when persisted chart pages are supported", async () => {
    mocks.supportsPersistedChartPages = true;

    await expect(getPersistedChartStaticPaths()).resolves.toEqual({
      paths: [],
      fallback: "blocking",
    });
  });

  it("disables fallback when persisted chart pages are unsupported", async () => {
    mocks.supportsPersistedChartPages = false;

    await expect(getPersistedChartStaticPaths()).resolves.toEqual({
      paths: [],
      fallback: false,
    });
  });

  it("returns notfound props without hitting the database when unsupported", async () => {
    mocks.supportsPersistedChartPages = false;

    const result = (await getPersistedChartStaticProps({
      params: { chartId: "chart-1" },
    } as any)) as { props: unknown };
    const props = deserializeProps(result.props as any);

    expect(props).toEqual({
      status: "notfound",
      config: null,
    });
    expect(mocks.getConfig).not.toHaveBeenCalled();
  });

  it("returns notfound props when validation fails", async () => {
    mocks.validateConfigKey.mockImplementation(() => {
      throw new Error("invalid key");
    });

    const result = (await getPersistedChartStaticProps({
      params: { chartId: "../bad" },
    } as any)) as { props: unknown; revalidate: number };
    const props = deserializeProps(result.props as any);

    expect(props).toEqual({
      status: "notfound",
      config: null,
    });
    expect(result.revalidate).toBe(1);
    expect(mocks.getConfig).not.toHaveBeenCalled();
  });

  it("returns found props for an existing persisted chart", async () => {
    const config = {
      id: 1,
      key: "chart-1",
      user_id: 7,
      created_at: new Date("2026-03-01T00:00:00.000Z"),
      updated_at: new Date("2026-03-02T00:00:00.000Z"),
      published_state: "PUBLISHED",
      data: {
        key: "chart-1",
        dataSource: {
          type: "sparql",
          url: "https://example.com/query",
        },
      },
    };
    mocks.getConfig.mockResolvedValue(config);

    const result = (await getPersistedChartStaticProps({
      params: { chartId: "chart-1" },
    } as any)) as { props: unknown; revalidate: number };
    const props = deserializeProps(result.props as any);

    expect(mocks.validateConfigKey).toHaveBeenCalledWith("chart-1");
    expect(mocks.getConfig).toHaveBeenCalledWith("chart-1");
    expect(props).toEqual({
      status: "found",
      config,
    });
    expect(result.revalidate).toBe(1);
  });
});
