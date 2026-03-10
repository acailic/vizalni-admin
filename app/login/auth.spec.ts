import { afterEach, describe, expect, it, vi } from "vitest";

import { getSignInProvider } from "@/login/auth";

describe("getSignInProvider", () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalE2EEnv = process.env.E2E_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    process.env.E2E_ENV = originalE2EEnv;
    vi.unstubAllEnvs();
  });

  it("returns credentials for non-production runtimes", () => {
    process.env.NODE_ENV = "development";
    delete process.env.E2E_ENV;

    expect(getSignInProvider()).toBe("credentials");
  });

  it("returns credentials for e2e runs in production", () => {
    process.env.NODE_ENV = "production";
    process.env.E2E_ENV = "true";

    expect(getSignInProvider()).toBe("credentials");
  });

  it("returns credentials for preview hosts in production", () => {
    process.env.NODE_ENV = "production";
    delete process.env.E2E_ENV;

    expect(getSignInProvider("visualization-tool-branch-ixt1.vercel.app")).toBe(
      "credentials"
    );
  });

  it("returns adfs for production server hosts", () => {
    process.env.NODE_ENV = "production";
    delete process.env.E2E_ENV;

    expect(getSignInProvider("vizualni-admin.example.com")).toBe("adfs");
  });
});
