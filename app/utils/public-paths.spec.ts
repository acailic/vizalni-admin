import { afterEach, describe, expect, it, vi } from "vitest";

const originalBasePath = process.env.NEXT_PUBLIC_BASE_PATH;
const originalPublicUrl = process.env.PUBLIC_URL;

const loadPublicPaths = async () => {
  vi.resetModules();
  return await import("@/utils/public-paths");
};

describe("public paths", () => {
  afterEach(() => {
    if (originalBasePath === undefined) {
      delete process.env.NEXT_PUBLIC_BASE_PATH;
    } else {
      process.env.NEXT_PUBLIC_BASE_PATH = originalBasePath;
    }

    if (originalPublicUrl === undefined) {
      delete process.env.PUBLIC_URL;
    } else {
      process.env.PUBLIC_URL = originalPublicUrl;
    }
  });

  it("treats server runtime as supported when no base path is configured", async () => {
    delete process.env.NEXT_PUBLIC_BASE_PATH;
    delete process.env.PUBLIC_URL;

    const mod = await loadPublicPaths();

    expect(mod.isStaticExportMode).toBe(false);
    expect(mod.supportsServerRuntime).toBe(true);
    expect(mod.supportsPersistedChartPages).toBe(true);
    expect(mod.supportsAuthSessionRoutes).toBe(true);
    expect(mod.supportsStatisticsRoutes).toBe(true);
    expect(mod.buildPublicPath("/browse")).toBe("/browse");
    expect(mod.buildAbsolutePublicUrl("https://example.com", "/browse")).toBe(
      "https://example.com/browse"
    );
    expect(mod.getDatasetBrowserPath()).toBe("/browse");
  });

  it("switches to static-export behavior when a base path is configured", async () => {
    process.env.NEXT_PUBLIC_BASE_PATH = "/vizualni-admin";
    delete process.env.PUBLIC_URL;

    const mod = await loadPublicPaths();

    expect(mod.isStaticExportMode).toBe(true);
    expect(mod.supportsServerRuntime).toBe(false);
    expect(mod.supportsPersistedChartPages).toBe(false);
    expect(mod.supportsAuthSessionRoutes).toBe(false);
    expect(mod.supportsStatisticsRoutes).toBe(false);
    expect(mod.buildPublicPath("/browse")).toBe("/vizualni-admin/browse");
    expect(mod.getDatasetBrowserPath()).toBe("/demos/showcase");
  });

  it("prefers PUBLIC_URL when building public paths", async () => {
    process.env.NEXT_PUBLIC_BASE_PATH = "/vizualni-admin";
    process.env.PUBLIC_URL = "https://cdn.example.com/vizualni-admin";

    const mod = await loadPublicPaths();

    expect(mod.buildPublicPath("/embed/demo")).toBe(
      "https://cdn.example.com/vizualni-admin/embed/demo"
    );
    expect(
      mod.buildAbsolutePublicUrl("https://ignored.example.com", "/embed/demo")
    ).toBe("https://cdn.example.com/vizualni-admin/embed/demo");
  });
});
