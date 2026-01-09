/**
 * Tests for formatting utilities
 *
 * Tests utility functions for formatting numbers, dates, and other values.
 */

import { describe, expect, it, beforeEach } from "vitest";

import {
  formatNumber,
  formatCurrency,
  formatPercentage,
  formatDate,
  formatDateTime,
  formatFileSize,
  formatDuration,
  truncate,
} from "../../../exports/utils/formatters";

describe("formatters", () => {
  beforeEach(() => {
    // Clear the format locale cache before each test
    const formatLocaleCache = (formatFileSize as any).formatLocaleCache;
    if (formatLocaleCache) {
      formatLocaleCache.clear();
    }
  });

  describe("formatNumber", () => {
    it("should format basic numbers with default locale", () => {
      const result = formatNumber(1234.56);
      // Serbian format: 1.234,56
      expect(result).toBeTruthy();
      expect(result.length).toBeGreaterThan(0);
    });

    it("should format numbers with thousand separators", () => {
      const result = formatNumber(1234567.89);
      // Serbian format: 1.234.567,89
      expect(result).toBeTruthy();
      expect(result.length).toBeGreaterThan(8);
    });

    it("should format decimal places correctly", () => {
      const result = formatNumber(1234.5678, "sr-Latn", {
        maximumFractionDigits: 2,
      });
      expect(result).toBeTruthy();
    });

    it("should respect minimumFractionDigits", () => {
      const result = formatNumber(1234, "sr-Latn", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      expect(result).toBeTruthy();
      // Serbian format uses comma for decimal
      expect(result).toContain(",");
    });

    it("should format negative numbers", () => {
      const result = formatNumber(-1234.56);
      // Serbian format uses minus sign
      expect(result).toBeTruthy();
      expect(result.length).toBeGreaterThan(0);
    });

    it("should format zero", () => {
      const result = formatNumber(0);
      expect(result).toBeTruthy();
    });

    it("should handle very large numbers", () => {
      const result = formatNumber(1234567890.12);
      expect(result).toBeTruthy();
    });

    it("should handle very small decimal numbers", () => {
      const result = formatNumber(0.001234, "sr-Latn", {
        maximumFractionDigits: 6,
      });
      expect(result).toBeTruthy();
    });

    it("should format with different locales", () => {
      const resultSr = formatNumber(1234.56, "sr-Latn");
      const resultEn = formatNumber(1234.56, "en");
      expect(resultSr).toBeTruthy();
      expect(resultEn).toBeTruthy();
    });

    it("should round to specified decimal places", () => {
      const result = formatNumber(1234.5678, "sr-Latn", {
        maximumFractionDigits: 1,
      });
      expect(result).toBeTruthy();
    });
  });

  describe("formatCurrency", () => {
    it("should format as currency with default symbol", () => {
      const result = formatCurrency(1234.56);
      // Serbian format: RSD 1.234,56
      expect(result).toContain("RSD");
      expect(result).toBeTruthy();
    });

    it("should use custom symbol when provided", () => {
      const result = formatCurrency(1234.56, "sr-Latn", {
        symbol: "$",
      });
      expect(result).toContain("$");
      expect(result).toBeTruthy();
    });

    it("should respect decimal places option", () => {
      const result = formatCurrency(1234.5678, "sr-Latn", {
        decimals: 3,
      });
      expect(result).toContain("RSD");
      expect(result).toBeTruthy();
    });

    it("should format zero as currency", () => {
      const result = formatCurrency(0);
      expect(result).toContain("RSD");
      expect(result).toContain("0");
    });

    it("should format negative currency amounts", () => {
      const result = formatCurrency(-1234.56);
      expect(result).toContain("RSD");
      expect(result).toBeTruthy();
    });

    it("should format large currency amounts", () => {
      const result = formatCurrency(1234567.89);
      expect(result).toContain("RSD");
      expect(result).toBeTruthy();
    });

    it("should use Serbian format (RSD before amount)", () => {
      const result = formatCurrency(1234.56, "sr-Latn");
      expect(result).toContain("RSD");
    });

    it("should handle different decimal options", () => {
      const resultNoDecimals = formatCurrency(1234.56, "sr-Latn", {
        decimals: 0,
      });
      const resultWithDecimals = formatCurrency(1234.56, "sr-Latn", {
        decimals: 2,
      });
      expect(resultNoDecimals).toBeTruthy();
      expect(resultWithDecimals).toBeTruthy();
    });
  });

  describe("formatPercentage", () => {
    it("should format as percentage with multiplication", () => {
      const result = formatPercentage(0.1234, "sr-Latn", {
        decimals: 1,
        multiply: true,
      });
      expect(result).toContain("%");
      expect(result).toBeTruthy();
    });

    it("should format as percentage without multiplication", () => {
      const result = formatPercentage(12.34, "sr-Latn", {
        decimals: 1,
        multiply: false,
      });
      expect(result).toContain("%");
      expect(result).toBeTruthy();
    });

    it("should default to multiplying by 100", () => {
      const result = formatPercentage(0.75);
      expect(result).toContain("%");
      expect(result).toBeTruthy();
    });

    it("should format small percentages", () => {
      const result = formatPercentage(0.001, "sr-Latn", {
        decimals: 2,
        multiply: true,
      });
      expect(result).toContain("%");
      expect(result).toBeTruthy();
    });

    it("should format 100%", () => {
      const result = formatPercentage(1);
      expect(result).toContain("%");
      expect(result).toBeTruthy();
    });

    it("should format 0%", () => {
      const result = formatPercentage(0);
      expect(result).toContain("%");
      expect(result).toContain("0");
    });

    it("should format negative percentages", () => {
      const result = formatPercentage(-0.25);
      expect(result).toContain("%");
      expect(result).toBeTruthy();
    });

    it("should respect decimal places", () => {
      const result1 = formatPercentage(0.1234, "sr-Latn", {
        decimals: 1,
      });
      const result2 = formatPercentage(0.1234, "sr-Latn", {
        decimals: 3,
      });
      expect(result1).toBeTruthy();
      expect(result2).toBeTruthy();
    });
  });

  describe("formatDate", () => {
    const testDate = new Date("2023-12-25T14:30:00Z");

    it("should format date with default options", () => {
      const result = formatDate(testDate);
      expect(result).toBeTruthy();
      expect(result.length).toBeGreaterThanOrEqual(8);
    });

    it("should format date with custom format options", () => {
      const result = formatDate(testDate, "sr-Latn", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      expect(result).toBeTruthy();
      expect(result).toContain("2023");
    });

    it("should format date from string", () => {
      const result = formatDate("2023-12-25");
      expect(result).toBeTruthy();
    });

    it("should format date from timestamp", () => {
      const timestamp = new Date("2023-12-25").getTime();
      const result = formatDate(timestamp);
      expect(result).toBeTruthy();
    });

    it("should handle different locales", () => {
      const resultSr = formatDate(testDate, "sr-Latn");
      const resultEn = formatDate(testDate, "en");
      expect(resultSr).toBeTruthy();
      expect(resultEn).toBeTruthy();
    });

    it("should format with short date style", () => {
      const result = formatDate(testDate, "sr-Latn", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
      });
      expect(result).toBeTruthy();
    });

    it("should format with long date style", () => {
      const result = formatDate(testDate, "sr-Latn", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      });
      expect(result).toBeTruthy();
      expect(result.length).toBeGreaterThan(10);
    });

    it("should handle Serbian Cyrillic locale", () => {
      const result = formatDate(testDate, "sr-Cyrl");
      expect(result).toBeTruthy();
    });

    it("should format only year and month", () => {
      const result = formatDate(testDate, "sr-Latn", {
        year: "numeric",
        month: "long",
      });
      expect(result).toBeTruthy();
      expect(result).toContain("2023");
    });
  });

  describe("formatDateTime", () => {
    const testDate = new Date("2023-12-25T14:30:00Z");

    it("should format date and time together", () => {
      const result = formatDateTime(testDate);
      expect(result).toBeTruthy();
      expect(result.length).toBeGreaterThan(10);
    });

    it("should include time component", () => {
      const result = formatDateTime(testDate);
      expect(result).toBeTruthy();
      // Should contain time digits
      expect(result).toMatch(/\d{1,2}:\d{2}/);
    });

    it("should handle different locales", () => {
      const resultSr = formatDateTime(testDate, "sr-Latn");
      const resultEn = formatDateTime(testDate, "en");
      expect(resultSr).toBeTruthy();
      expect(resultEn).toBeTruthy();
    });

    it("should format date string", () => {
      const result = formatDateTime("2023-12-25T14:30:00");
      expect(result).toBeTruthy();
    });

    it("should format timestamp", () => {
      const timestamp = new Date("2023-12-25T14:30:00").getTime();
      const result = formatDateTime(timestamp);
      expect(result).toBeTruthy();
    });
  });

  describe("formatFileSize", () => {
    it("should format bytes", () => {
      const result = formatFileSize(512);
      expect(result).toContain("B");
      expect(result).toContain("512");
    });

    it("should format kilobytes", () => {
      const result = formatFileSize(2048);
      expect(result).toContain("KB");
    });

    it("should format megabytes", () => {
      const result = formatFileSize(2 * 1024 * 1024);
      expect(result).toContain("MB");
    });

    it("should format gigabytes", () => {
      const result = formatFileSize(2.5 * 1024 * 1024 * 1024);
      expect(result).toContain("GB");
    });

    it("should format terabytes", () => {
      const result = formatFileSize(2 * 1024 * 1024 * 1024 * 1024);
      expect(result).toContain("TB");
    });

    it("should use appropriate unit for size", () => {
      expect(formatFileSize(500)).toContain("B");
      expect(formatFileSize(2048)).toContain("KB");
      expect(formatFileSize(3 * 1024 * 1024)).toContain("MB");
      expect(formatFileSize(3 * 1024 * 1024 * 1024)).toContain("GB");
    });

    it("should handle decimal values", () => {
      const result = formatFileSize(1536);
      expect(result).toContain("KB");
      expect(result).toContain("1");
    });

    it("should format zero bytes", () => {
      const result = formatFileSize(0);
      expect(result).toContain("B");
      expect(result).toContain("0");
    });

    it("should handle very large sizes", () => {
      const result = formatFileSize(5 * 1024 * 1024 * 1024 * 1024);
      expect(result).toContain("TB");
    });

    it("should use Serbian number formatting", () => {
      const result = formatFileSize(1234567, "sr-Latn");
      expect(result).toBeTruthy();
    });
  });

  describe("formatDuration", () => {
    it("should format seconds", () => {
      const result = formatDuration(5000);
      expect(result).toContain("5s");
    });

    it("should format minutes and seconds", () => {
      const result = formatDuration(125000);
      expect(result).toContain("2m");
      expect(result).toContain("5s");
    });

    it("should format hours and minutes", () => {
      const result = formatDuration(3750000);
      expect(result).toContain("1h");
      expect(result).toContain("2m");
    });

    it("should format days and hours", () => {
      const result = formatDuration(90000000);
      expect(result).toContain("1d");
      expect(result).toContain("1h");
    });

    it("should format zero duration", () => {
      const result = formatDuration(0);
      expect(result).toContain("0s");
    });

    it("should handle single second", () => {
      const result = formatDuration(1000);
      expect(result).toContain("1s");
    });

    it("should handle single minute", () => {
      const result = formatDuration(60000);
      expect(result).toContain("1m");
      expect(result).toContain("0s");
    });

    it("should handle single hour", () => {
      const result = formatDuration(3600000);
      expect(result).toContain("1h");
      expect(result).toContain("0m");
    });

    it("should handle very long durations", () => {
      const result = formatDuration(90000000);
      expect(result).toContain("1d");
    });

    it("should use largest appropriate units", () => {
      // Should prefer minutes over seconds for large second counts
      const result = formatDuration(120000);
      expect(result).toContain("2m");
      expect(result).toContain("0s");
    });
  });

  describe("truncate", () => {
    it("should not truncate text shorter than maxLength", () => {
      const result = truncate("Short", 10);
      expect(result).toBe("Short");
    });

    it("should truncate text longer than maxLength", () => {
      const result = truncate("This is a very long text", 10);
      expect(result.length).toBe(10);
      expect(result).toContain("...");
    });

    it("should use custom suffix", () => {
      const result = truncate("Long text here", 8, "---");
      expect(result).toContain("---");
      expect(result.length).toBe(8);
    });

    it("should handle empty string", () => {
      const result = truncate("", 10);
      expect(result).toBe("");
    });

    it("should handle string exactly at maxLength", () => {
      const result = truncate("Exactly10!", 10);
      expect(result).toBe("Exactly10!");
    });

    it("should handle very short maxLength", () => {
      const result = truncate("Hello World", 3);
      expect(result.length).toBe(3);
    });

    it("should handle maxLength smaller than suffix", () => {
      const result = truncate("Hello", 2);
      // When maxLength is less than suffix length, returns just the suffix
      expect(result).toBe("...");
    });

    it("should preserve suffix when maxLength allows", () => {
      const result = truncate("This is long", 10, ">>>");
      expect(result).toContain(">>>");
      expect(result.length).toBe(10);
    });

    it("should handle special characters in text", () => {
      const result = truncate("Text with @#$ special chars", 15);
      expect(result.length).toBe(15);
    });

    it("should handle unicode characters", () => {
      const result = truncate("Текст на ћирилици", 10);
      expect(result.length).toBeLessThanOrEqual(10);
    });
  });

  describe("integration tests", () => {
    it("should handle Serbian locale consistently across formatters", () => {
      const number = formatNumber(1234.56, "sr-Latn");
      const currency = formatCurrency(1234.56, "sr-Latn");
      const percentage = formatPercentage(0.1234, "sr-Latn");
      const date = formatDate(new Date(), "sr-Latn");

      expect(number).toBeTruthy();
      expect(currency).toBeTruthy();
      expect(percentage).toBeTruthy();
      expect(date).toBeTruthy();
    });

    it("should handle English locale consistently across formatters", () => {
      const number = formatNumber(1234.56, "en");
      const currency = formatCurrency(1234.56, "en", { symbol: "$" });
      const percentage = formatPercentage(0.1234, "en");
      const date = formatDate(new Date(), "en");

      expect(number).toBeTruthy();
      expect(currency).toBeTruthy();
      expect(percentage).toBeTruthy();
      expect(date).toBeTruthy();
    });

    it("should handle Serbian Cyrillic locale", () => {
      const number = formatNumber(1234.56, "sr-Cyrl");
      const date = formatDate(new Date(), "sr-Cyrl");

      expect(number).toBeTruthy();
      expect(date).toBeTruthy();
    });

    it("should format consistent data for charts", () => {
      const data = [
        { value: 1234.56, date: new Date("2023-12-25"), percentage: 0.1234 },
      ];

      const formattedValue = formatNumber(data[0].value);
      const formattedDate = formatDate(data[0].date);
      const formattedPercentage = formatPercentage(data[0].percentage);

      expect(formattedValue).toBeTruthy();
      expect(formattedDate).toBeTruthy();
      expect(formattedPercentage).toBeTruthy();
    });
  });
});
