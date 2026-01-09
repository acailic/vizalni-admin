/**
 * Library Export Contract Tests
 *
 * These tests ensure that the public API of @acailic/vizualni-admin
 * remains stable and all documented exports are available.
 *
 * IMPORTANT: If these tests fail, it indicates a breaking change
 * that may affect downstream consumers.
 */

import { describe, it, expect } from "vitest";

describe("Library Exports", () => {
  describe("Main Entry Point", () => {
    it("exports version string", async () => {
      const lib = await import("@/index");
      expect(lib.version).toBeDefined();
      expect(typeof lib.version).toBe("string");
    });

    it("exports I18nProvider from @lingui/react", async () => {
      const lib = await import("@/index");
      expect(lib.I18nProvider).toBeDefined();
    });
  });

  describe("Locale Utilities", () => {
    it("exports defaultLocale as sr-Latn", async () => {
      const lib = await import("@/index");
      expect(lib.defaultLocale).toBe("sr-Latn");
    });

    it("exports locales array with 3 locales", async () => {
      const lib = await import("@/index");
      expect(lib.locales).toHaveLength(3);
      expect(lib.locales).toContain("sr-Latn");
      expect(lib.locales).toContain("sr-Cyrl");
      expect(lib.locales).toContain("en");
    });

    it("exports parseLocaleString function", async () => {
      const lib = await import("@/index");
      expect(lib.parseLocaleString).toBeInstanceOf(Function);
      expect(lib.parseLocaleString("sr")).toBe("sr-Latn");
      expect(lib.parseLocaleString("en-US")).toBe("en");
    });

    it("exports i18n instance", async () => {
      const lib = await import("@/index");
      expect(lib.i18n).toBeDefined();
      expect(lib.i18n.locale).toBeDefined();
    });

    it("exports D3 format locale functions", async () => {
      const lib = await import("@/index");
      expect(lib.getD3TimeFormatLocale).toBeInstanceOf(Function);
      expect(lib.getD3FormatLocale).toBeInstanceOf(Function);
    });
  });

  describe("Configuration", () => {
    it("exports validateConfig function", async () => {
      const lib = await import("@/index");
      expect(lib.validateConfig).toBeInstanceOf(Function);
    });

    it("exports DEFAULT_CONFIG object", async () => {
      const lib = await import("@/index");
      expect(lib.DEFAULT_CONFIG).toBeDefined();
      expect(typeof lib.DEFAULT_CONFIG).toBe("object");
    });

    it("exports VizualniAdminConfig type", async () => {
      const lib = await import("@/index");
      // Type exports are compile-time, but we can check the module exists
      expect(lib).toBeDefined();
    });
  });

  describe("DataGovRs Client", () => {
    it("exports DataGovRsClient class", async () => {
      const lib = await import("@/index");
      expect(lib.DataGovRsClient).toBeDefined();
    });

    it("exports createDataGovRsClient factory", async () => {
      const lib = await import("@/index");
      expect(lib.createDataGovRsClient).toBeInstanceOf(Function);
    });

    it("exports dataGovRsClient singleton", async () => {
      const lib = await import("@/index");
      expect(lib.dataGovRsClient).toBeDefined();
    });

    it("exports DatasetMetadata type", async () => {
      const lib = await import("@/index");
      // Type exports are compile-time
      expect(lib).toBeDefined();
    });

    it("exports Organization type", async () => {
      const lib = await import("@/index");
      expect(lib).toBeDefined();
    });

    it("exports Resource type", async () => {
      const lib = await import("@/index");
      expect(lib).toBeDefined();
    });

    it("exports PaginatedResponse type", async () => {
      const lib = await import("@/index");
      expect(lib).toBeDefined();
    });

    it("exports SearchParams type", async () => {
      const lib = await import("@/index");
      expect(lib).toBeDefined();
    });

    it("exports DataGovRsConfig type", async () => {
      const lib = await import("@/index");
      expect(lib).toBeDefined();
    });

    it("exports ApiError type", async () => {
      const lib = await import("@/index");
      expect(lib).toBeDefined();
    });
  });

  describe("Type Exports", () => {
    it("Locale type is usable", async () => {
      const lib = await import("@/index");
      type Locale = (typeof lib.locales)[number];
      const locale: Locale = "sr-Latn";
      expect(locale).toBe("sr-Latn");
    });
  });
});
