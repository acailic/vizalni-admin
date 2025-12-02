import { describe, it, expect } from "vitest";

import {
  parseLocaleString,
  defaultLocale,
  locales,
} from "../../locales/locales";

describe("locale-utils", () => {
  describe("parseLocaleString", () => {
    it("should parse valid locale strings", () => {
      expect(parseLocaleString("sr-Latn")).toBe("sr-Latn");
      expect(parseLocaleString("sr-Cyrl")).toBe("sr-Cyrl");
      expect(parseLocaleString("en")).toBe("en");
    });

    it("should parse locale strings with additional parameters", () => {
      expect(parseLocaleString("sr-Latn,en;q=0.5")).toBe("sr-Latn");
      expect(parseLocaleString("en,sr-Latn;q=0.8")).toBe("en");
      expect(parseLocaleString("sr-Cyrl,en-US;q=0.7,en;q=0.3")).toBe("sr-Cyrl");
    });

    it("should return default locale for invalid strings", () => {
      expect(parseLocaleString("fr")).toBe(defaultLocale);
      expect(parseLocaleString("sr")).toBe(defaultLocale);
      expect(parseLocaleString("invalid")).toBe(defaultLocale);
      expect(parseLocaleString("")).toBe(defaultLocale);
    });

    it("should return default locale for null or undefined", () => {
      expect(parseLocaleString(null)).toBe(defaultLocale);
      expect(parseLocaleString(undefined)).toBe(defaultLocale);
    });
  });

  describe("defaultLocale", () => {
    it("should be a valid locale", () => {
      expect(locales).toContain(defaultLocale);
    });

    it("should be 'sr-Latn'", () => {
      expect(defaultLocale).toBe("sr-Latn");
    });
  });

  describe("locales", () => {
    it("should contain all supported locales", () => {
      expect(locales).toEqual(["sr-Latn", "sr-Cyrl", "en"]);
    });

    it("should be an array of strings", () => {
      expect(Array.isArray(locales)).toBe(true);
      locales.forEach((locale) => {
        expect(typeof locale).toBe("string");
      });
    });
  });
});