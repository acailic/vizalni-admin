import { describe, it, expect } from "vitest";

describe("Import Test", () => {
  it("should import with require", async () => {
    // Use dynamic import to avoid caching issues
    const module = await import("../../domain/data-gov-rs/client");
    const { DataGovRsClient } = module;
    const client = new DataGovRsClient({});
    console.log("Config:", JSON.stringify(client.config, null, 2));
    expect(client.config.retryConfig).toBeDefined();
  });
});
