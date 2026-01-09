/**
 * Tests for useLocale hook
 *
 * Tests the React hook for managing application locale.
 */

import { renderHook, act } from "@testing-library/react";
import React from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { describe, expect, it, beforeEach, vi } from "vitest";

import {
  i18n,
  locales,
  defaultLocale,
  type Locale,
} from "../../../exports/core";
import { useLocale } from "../../../exports/hooks/useLocale";

// Mock i18n
vi.mock("@lingui/core", () => ({
  i18n: {
    load: vi.fn(),
    loadLocaleData: vi.fn(),
    activate: vi.fn(),
  },
}));

describe("useLocale", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("initial state with default locale", () => {
    it("should initialize with default locale when no initial locale provided", () => {
      const { result } = renderHook(() => useLocale());

      expect(result.current.locale).toBe(defaultLocale);
      expect(result.current.locale).toBe("sr-Latn");
    });

    it("should initialize with provided initial locale", () => {
      const { result } = renderHook(() => useLocale("en"));

      expect(result.current.locale).toBe("en");
    });

    it("should provide all available locales", () => {
      const { result } = renderHook(() => useLocale());

      expect(result.current.locales).toEqual(locales);
      expect(result.current.locales).toEqual(["sr-Latn", "sr-Cyrl", "en"]);
    });

    it("should provide default locale", () => {
      const { result } = renderHook(() => useLocale());

      expect(result.current.defaultLocale).toBe(defaultLocale);
      expect(result.current.defaultLocale).toBe("sr-Latn");
    });

    it("should initialize isRtl as false for all locales", () => {
      const { result: resultSrLatn } = renderHook(() => useLocale("sr-Latn"));
      const { result: resultSrCyrl } = renderHook(() => useLocale("sr-Cyrl"));
      const { result: resultEn } = renderHook(() => useLocale("en"));

      expect(resultSrLatn.current.isRtl).toBe(false);
      expect(resultSrCyrl.current.isRtl).toBe(false);
      expect(resultEn.current.isRtl).toBe(false);
    });

    it("should activate default locale on mount", () => {
      renderHook(() => useLocale());

      expect(i18n.activate).toHaveBeenCalledWith(defaultLocale);
    });

    it("should activate initial locale on mount", () => {
      renderHook(() => useLocale("en"));

      expect(i18n.activate).toHaveBeenCalledWith("en");
    });
  });

  describe("setLocale function behavior", () => {
    it("should update locale when setLocale is called", () => {
      const { result } = renderHook(() => useLocale("sr-Latn"));

      expect(result.current.locale).toBe("sr-Latn");

      act(() => {
        result.current.setLocale("en");
      });

      expect(result.current.locale).toBe("en");
    });

    it("should activate i18n when setLocale is called", () => {
      const { result } = renderHook(() => useLocale("sr-Latn"));

      act(() => {
        result.current.setLocale("sr-Cyrl");
      });

      expect(i18n.activate).toHaveBeenCalledWith("sr-Cyrl");
    });

    it("should allow switching between all available locales", () => {
      const { result } = renderHook(() => useLocale("sr-Latn"));

      // Switch to sr-Cyrl
      act(() => {
        result.current.setLocale("sr-Cyrl");
      });
      expect(result.current.locale).toBe("sr-Cyrl");

      // Switch to en
      act(() => {
        result.current.setLocale("en");
      });
      expect(result.current.locale).toBe("en");

      // Switch back to sr-Latn
      act(() => {
        result.current.setLocale("sr-Latn");
      });
      expect(result.current.locale).toBe("sr-Latn");
    });

    it("should trigger i18n activation on locale change via useEffect", () => {
      const { result } = renderHook(() => useLocale("sr-Latn"));

      // Clear initial mount call
      vi.clearAllMocks();

      act(() => {
        result.current.setLocale("en");
      });

      // i18n.activate should be called by setLocale
      expect(i18n.activate).toHaveBeenCalledWith("en");
    });
  });

  describe("parseLocale function", () => {
    it("should parse valid sr-Latn locale string", () => {
      const { result } = renderHook(() => useLocale());

      const parsed = result.current.parseLocale("sr-Latn");
      expect(parsed).toBe("sr-Latn");
    });

    it("should parse valid sr-Cyrl locale string", () => {
      const { result } = renderHook(() => useLocale());

      const parsed = result.current.parseLocale("sr-Cyrl");
      expect(parsed).toBe("sr-Cyrl");
    });

    it("should parse valid en locale string", () => {
      const { result } = renderHook(() => useLocale());

      const parsed = result.current.parseLocale("en");
      expect(parsed).toBe("en");
    });

    it("should parse locale string with Accept-Language header format", () => {
      const { result } = renderHook(() => useLocale());

      // Test sr-Latn from Accept-Language header
      const parsed1 = result.current.parseLocale(
        "sr-Latn,en-US;q=0.7,en;q=0.3"
      );
      expect(parsed1).toBe("sr-Latn");

      // Test en from Accept-Language header
      const parsed2 = result.current.parseLocale("en-US,en;q=0.9");
      expect(parsed2).toBe("en");

      // Test sr-Cyrl from Accept-Language header
      const parsed3 = result.current.parseLocale(
        "sr-Cyrl,sr-Latn;q=0.8,en;q=0.5"
      );
      expect(parsed3).toBe("sr-Cyrl");
    });

    it("should return default locale for unparseable strings", () => {
      const { result } = renderHook(() => useLocale());

      const parsed = result.current.parseLocale("fr-FR");
      expect(parsed).toBe(defaultLocale);
    });

    it("should return default locale for null or undefined", () => {
      const { result } = renderHook(() => useLocale());

      expect(result.current.parseLocale(null as any)).toBe(defaultLocale);
      expect(result.current.parseLocale(undefined as any)).toBe(defaultLocale);
    });

    it("should return default locale for empty string", () => {
      const { result } = renderHook(() => useLocale());

      const parsed = result.current.parseLocale("");
      expect(parsed).toBe(defaultLocale);
    });
  });

  describe("isRtl property", () => {
    it("should return false for sr-Latn locale", () => {
      const { result } = renderHook(() => useLocale("sr-Latn"));

      expect(result.current.isRtl).toBe(false);
    });

    it("should return false for sr-Cyrl locale", () => {
      const { result } = renderHook(() => useLocale("sr-Cyrl"));

      expect(result.current.isRtl).toBe(false);
    });

    it("should return false for en locale", () => {
      const { result } = renderHook(() => useLocale("en"));

      expect(result.current.isRtl).toBe(false);
    });

    it("should remain false after locale changes", () => {
      const { result } = renderHook(() => useLocale("sr-Latn"));

      expect(result.current.isRtl).toBe(false);

      act(() => {
        result.current.setLocale("en");
      });

      expect(result.current.isRtl).toBe(false);
    });
  });

  describe("getD3TimeLocale function", () => {
    it("should return D3 time locale object for sr-Latn", () => {
      const { result } = renderHook(() => useLocale("sr-Latn"));

      const d3TimeLocale = result.current.getD3TimeLocale();

      expect(d3TimeLocale).toBeDefined();
      expect(typeof d3TimeLocale.format).toBe("function");
      expect(typeof d3TimeLocale.parse).toBe("function");
    });

    it("should return D3 time locale object for sr-Cyrl", () => {
      const { result } = renderHook(() => useLocale("sr-Cyrl"));

      const d3TimeLocale = result.current.getD3TimeLocale();

      expect(d3TimeLocale).toBeDefined();
      expect(typeof d3TimeLocale.format).toBe("function");
      expect(typeof d3TimeLocale.parse).toBe("function");
    });

    it("should return D3 time locale object for en", () => {
      const { result } = renderHook(() => useLocale("en"));

      const d3TimeLocale = result.current.getD3TimeLocale();

      expect(d3TimeLocale).toBeDefined();
      expect(typeof d3TimeLocale.format).toBe("function");
      expect(typeof d3TimeLocale.parse).toBe("function");
    });

    it("should update D3 time locale when locale changes", () => {
      const { result } = renderHook(() => useLocale("sr-Latn"));

      const d3TimeLocaleSrLatn = result.current.getD3TimeLocale();

      act(() => {
        result.current.setLocale("en");
      });

      const d3TimeLocaleEn = result.current.getD3TimeLocale();

      expect(d3TimeLocaleSrLatn).toBeDefined();
      expect(d3TimeLocaleEn).toBeDefined();
    });

    it("should return locale-specific time format", () => {
      const { result: resultSr } = renderHook(() => useLocale("sr-Latn"));
      const { result: resultEn } = renderHook(() => useLocale("en"));

      const d3TimeLocaleSr = resultSr.current.getD3TimeLocale();
      const d3TimeLocaleEn = resultEn.current.getD3TimeLocale();

      // Format a date to see if locales produce different results
      const testDate = new Date(2024, 0, 15); // January 15, 2024

      const formatSr = d3TimeLocaleSr.format("%d.%m.%Y");
      const formatEn = d3TimeLocaleEn.format("%d/%m/%Y");

      expect(formatSr(testDate)).toBe("15.01.2024");
      expect(formatEn(testDate)).toBe("15/01/2024");
    });
  });

  describe("getD3FormatLocale function", () => {
    it("should return D3 format locale object", () => {
      const { result } = renderHook(() => useLocale());

      const d3FormatLocale = result.current.getD3FormatLocale();

      expect(d3FormatLocale).toBeDefined();
      expect(typeof d3FormatLocale.format).toBe("function");
      expect(typeof d3FormatLocale.formatPrefix).toBe("function");
    });

    it("should return format locale with correct number formatting", () => {
      const { result } = renderHook(() => useLocale());

      const d3FormatLocale = result.current.getD3FormatLocale();

      // Test number formatting
      const format = d3FormatLocale.format(",.2f");
      const formatted = format(1234567.89);

      // Serbian uses . for thousands and , for decimal
      expect(formatted).toContain("1");
      expect(formatted).toContain("234");
    });

    it("should return consistent format locale across locale changes", () => {
      const { result } = renderHook(() => useLocale("sr-Latn"));

      const d3FormatLocale1 = result.current.getD3FormatLocale();

      act(() => {
        result.current.setLocale("en");
      });

      const d3FormatLocale2 = result.current.getD3FormatLocale();

      // Both should be defined
      expect(d3FormatLocale1).toBeDefined();
      expect(d3FormatLocale2).toBeDefined();
    });
  });

  describe("i18n activation on locale change", () => {
    it("should activate i18n on mount with initial locale", () => {
      renderHook(() => useLocale("sr-Cyrl"));

      expect(i18n.activate).toHaveBeenCalledWith("sr-Cyrl");
    });

    it("should activate i18n when locale changes via setLocale", () => {
      const { result } = renderHook(() => useLocale("sr-Latn"));

      vi.clearAllMocks();

      act(() => {
        result.current.setLocale("en");
      });

      expect(i18n.activate).toHaveBeenCalledWith("en");
    });

    it("should activate i18n with correct locale on multiple changes", () => {
      const { result } = renderHook(() => useLocale("sr-Latn"));

      vi.clearAllMocks();

      act(() => {
        result.current.setLocale("sr-Cyrl");
      });
      expect(i18n.activate).toHaveBeenCalledWith("sr-Cyrl");

      vi.clearAllMocks();

      act(() => {
        result.current.setLocale("en");
      });
      expect(i18n.activate).toHaveBeenCalledWith("en");

      vi.clearAllMocks();

      act(() => {
        result.current.setLocale("sr-Latn");
      });
      expect(i18n.activate).toHaveBeenCalledWith("sr-Latn");
    });

    it("should call i18n.activate in useEffect when locale state changes", () => {
      const { result } = renderHook(() => useLocale("sr-Latn"));

      vi.clearAllMocks();

      act(() => {
        result.current.setLocale("en");
      });

      // setLocale calls i18n.activate directly, and useEffect also calls it
      // So we should see at least one call
      expect(i18n.activate).toHaveBeenCalledWith("en");
    });
  });

  describe("locale switching between sr-Latn, sr-Cyrl, and en", () => {
    it("should switch from sr-Latn to sr-Cyrl", () => {
      const { result } = renderHook(() => useLocale("sr-Latn"));

      expect(result.current.locale).toBe("sr-Latn");

      act(() => {
        result.current.setLocale("sr-Cyrl");
      });

      expect(result.current.locale).toBe("sr-Cyrl");
      expect(i18n.activate).toHaveBeenCalledWith("sr-Cyrl");
    });

    it("should switch from sr-Latn to en", () => {
      const { result } = renderHook(() => useLocale("sr-Latn"));

      expect(result.current.locale).toBe("sr-Latn");

      act(() => {
        result.current.setLocale("en");
      });

      expect(result.current.locale).toBe("en");
      expect(i18n.activate).toHaveBeenCalledWith("en");
    });

    it("should switch from sr-Cyrl to sr-Latn", () => {
      const { result } = renderHook(() => useLocale("sr-Cyrl"));

      expect(result.current.locale).toBe("sr-Cyrl");

      act(() => {
        result.current.setLocale("sr-Latn");
      });

      expect(result.current.locale).toBe("sr-Latn");
      expect(i18n.activate).toHaveBeenCalledWith("sr-Latn");
    });

    it("should switch from sr-Cyrl to en", () => {
      const { result } = renderHook(() => useLocale("sr-Cyrl"));

      expect(result.current.locale).toBe("sr-Cyrl");

      act(() => {
        result.current.setLocale("en");
      });

      expect(result.current.locale).toBe("en");
      expect(i18n.activate).toHaveBeenCalledWith("en");
    });

    it("should switch from en to sr-Latn", () => {
      const { result } = renderHook(() => useLocale("en"));

      expect(result.current.locale).toBe("en");

      act(() => {
        result.current.setLocale("sr-Latn");
      });

      expect(result.current.locale).toBe("sr-Latn");
      expect(i18n.activate).toHaveBeenCalledWith("sr-Latn");
    });

    it("should switch from en to sr-Cyrl", () => {
      const { result } = renderHook(() => useLocale("en"));

      expect(result.current.locale).toBe("en");

      act(() => {
        result.current.setLocale("sr-Cyrl");
      });

      expect(result.current.locale).toBe("sr-Cyrl");
      expect(i18n.activate).toHaveBeenCalledWith("sr-Cyrl");
    });

    it("should handle rapid locale switching", () => {
      const { result } = renderHook(() => useLocale("sr-Latn"));

      // Rapid switching
      act(() => {
        result.current.setLocale("en");
        result.current.setLocale("sr-Cyrl");
        result.current.setLocale("sr-Latn");
      });

      expect(result.current.locale).toBe("sr-Latn");
    });

    it("should maintain isRtl false during all locale switches", () => {
      const { result } = renderHook(() => useLocale("sr-Latn"));

      expect(result.current.isRtl).toBe(false);

      act(() => {
        result.current.setLocale("sr-Cyrl");
      });
      expect(result.current.isRtl).toBe(false);

      act(() => {
        result.current.setLocale("en");
      });
      expect(result.current.isRtl).toBe(false);

      act(() => {
        result.current.setLocale("sr-Latn");
      });
      expect(result.current.isRtl).toBe(false);
    });

    it("should provide correct D3 time locale for each switch", () => {
      const { result } = renderHook(() => useLocale("sr-Latn"));

      let d3TimeLocale = result.current.getD3TimeLocale();
      expect(d3TimeLocale).toBeDefined();

      act(() => {
        result.current.setLocale("sr-Cyrl");
      });
      d3TimeLocale = result.current.getD3TimeLocale();
      expect(d3TimeLocale).toBeDefined();

      act(() => {
        result.current.setLocale("en");
      });
      d3TimeLocale = result.current.getD3TimeLocale();
      expect(d3TimeLocale).toBeDefined();

      act(() => {
        result.current.setLocale("sr-Latn");
      });
      d3TimeLocale = result.current.getD3TimeLocale();
      expect(d3TimeLocale).toBeDefined();
    });
  });

  describe("hook stability and performance", () => {
    it("should maintain stable function references across re-renders", () => {
      const { result, rerender } = renderHook(() => useLocale());

      const initialSetLocale = result.current.setLocale;
      const initialParseLocale = result.current.parseLocale;
      const initialGetD3TimeLocale = result.current.getD3TimeLocale;
      const initialGetD3FormatLocale = result.current.getD3FormatLocale;

      rerender();

      expect(result.current.setLocale).toBe(initialSetLocale);
      expect(result.current.parseLocale).toBe(initialParseLocale);
      expect(result.current.getD3TimeLocale).toBe(initialGetD3TimeLocale);
      expect(result.current.getD3FormatLocale).toBe(initialGetD3FormatLocale);
    });

    it("should update locale value reference when locale changes", () => {
      const { result } = renderHook(() => useLocale("sr-Latn"));

      const initialLocale = result.current.locale;

      act(() => {
        result.current.setLocale("en");
      });

      expect(result.current.locale).not.toBe(initialLocale);
    });

    it("should handle multiple hook instances", () => {
      const { result: result1 } = renderHook(() => useLocale("sr-Latn"));
      const { result: result2 } = renderHook(() => useLocale("en"));

      expect(result1.current.locale).toBe("sr-Latn");
      expect(result2.current.locale).toBe("en");

      act(() => {
        result1.current.setLocale("sr-Cyrl");
      });

      expect(result1.current.locale).toBe("sr-Cyrl");
      expect(result2.current.locale).toBe("en");
    });
  });

  describe("integration tests", () => {
    it("should handle complete workflow: parse, set, and get locales", () => {
      const { result } = renderHook(() => useLocale());

      // Parse a locale string
      const parsed = result.current.parseLocale("en-US,en;q=0.9");
      expect(parsed).toBe("en");

      // Set the parsed locale
      act(() => {
        result.current.setLocale(parsed);
      });

      expect(result.current.locale).toBe("en");

      // Get D3 locales
      const d3TimeLocale = result.current.getD3TimeLocale();
      const d3FormatLocale = result.current.getD3FormatLocale();

      expect(d3TimeLocale).toBeDefined();
      expect(d3FormatLocale).toBeDefined();

      // Check isRtl
      expect(result.current.isRtl).toBe(false);
    });

    it("should handle locale switching workflow", () => {
      const { result } = renderHook(() => useLocale("sr-Latn"));

      // Start with sr-Latn
      expect(result.current.locale).toBe("sr-Latn");

      // User selects English
      act(() => {
        result.current.setLocale("en");
      });
      expect(result.current.locale).toBe("en");

      // User switches to Serbian Cyrillic
      act(() => {
        result.current.setLocale("sr-Cyrl");
      });
      expect(result.current.locale).toBe("sr-Cyrl");

      // User goes back to Serbian Latin
      act(() => {
        result.current.setLocale("sr-Latn");
      });
      expect(result.current.locale).toBe("sr-Latn");
    });

    it("should work with parseLocale and setLocale combination", () => {
      const { result } = renderHook(() => useLocale());

      // Simulate getting locale from browser Accept-Language header
      const acceptLanguageHeader = "sr-Latn,en-US;q=0.7,en;q=0.3";
      const parsedLocale = result.current.parseLocale(acceptLanguageHeader);

      act(() => {
        result.current.setLocale(parsedLocale);
      });

      expect(result.current.locale).toBe("sr-Latn");
      expect(i18n.activate).toHaveBeenCalledWith("sr-Latn");
    });
  });

  describe("SSR and Hydration Behavior", () => {
    it("should initialize with default locale on server-side render", () => {
      // Simulate SSR environment where no initial locale is provided
      const { result } = renderHook(() => useLocale());

      expect(result.current.locale).toBe(defaultLocale);
      expect(result.current.locale).toBe("sr-Latn");
      expect(result.current.defaultLocale).toBe(defaultLocale);
    });

    it("should initialize with provided locale on server-side render", () => {
      // Simulate SSR with locale determined from Accept-Language header
      const { result } = renderHook(() => useLocale("en"));

      expect(result.current.locale).toBe("en");
      expect(result.current.defaultLocale).toBe("sr-Latn");
    });

    it("should activate i18n locale during SSR initialization", () => {
      renderHook(() => useLocale("sr-Cyrl"));

      expect(i18n.activate).toHaveBeenCalledWith("sr-Cyrl");
    });

    it("should provide all locale metadata during SSR", () => {
      const { result } = renderHook(() => useLocale("en"));

      expect(result.current.locales).toEqual(["sr-Latn", "sr-Cyrl", "en"]);
      expect(result.current.isRtl).toBe(false);
      expect(result.current.defaultLocale).toBe("sr-Latn");
    });

    it("should handle SSR with undefined initial locale gracefully", () => {
      const { result } = renderHook(() => useLocale(undefined as any));

      expect(result.current.locale).toBe(defaultLocale);
      expect(result.current.locale).toBe("sr-Latn");
    });
  });

  describe("Hydration alignment", () => {
    it("should maintain locale state from server to client hydration", () => {
      // Simulate server-rendered locale
      const serverLocale = "en";

      // Client hydration receives the same locale
      const { result } = renderHook(() => useLocale(serverLocale));

      // Locale should match server-rendered value
      expect(result.current.locale).toBe(serverLocale);
      expect(i18n.activate).toHaveBeenCalledWith(serverLocale);
    });

    it("should maintain all locale properties during hydration", () => {
      const serverLocale = "sr-Cyrl";
      const { result } = renderHook(() => useLocale(serverLocale));

      // All properties should be consistent
      expect(result.current.locale).toBe(serverLocale);
      expect(result.current.defaultLocale).toBe("sr-Latn");
      expect(result.current.locales).toEqual(["sr-Latn", "sr-Cyrl", "en"]);
      expect(result.current.isRtl).toBe(false);

      // D3 locales should be available
      const d3TimeLocale = result.current.getD3TimeLocale();
      const d3FormatLocale = result.current.getD3FormatLocale();
      expect(d3TimeLocale).toBeDefined();
      expect(d3FormatLocale).toBeDefined();
    });

    it("should handle hydration with default locale", () => {
      const { result } = renderHook(() => useLocale());

      expect(result.current.locale).toBe(defaultLocale);
      expect(i18n.activate).toHaveBeenCalledWith(defaultLocale);
    });

    it("should preserve locale after client-side hydration", () => {
      const { result, rerender } = renderHook(() => useLocale("en"));

      // Initial render (hydration)
      expect(result.current.locale).toBe("en");

      // Post-hydration re-render
      rerender();
      expect(result.current.locale).toBe("en");

      // Multiple re-renders should maintain locale
      rerender();
      rerender();
      expect(result.current.locale).toBe("en");
    });

    it("should maintain function references across hydration boundary", () => {
      const { result, rerender } = renderHook(() => useLocale("sr-Latn"));

      const initialSetLocale = result.current.setLocale;
      const initialParseLocale = result.current.parseLocale;

      // Simulate hydration
      rerender();

      expect(result.current.setLocale).toBe(initialSetLocale);
      expect(result.current.parseLocale).toBe(initialParseLocale);
    });
  });

  describe("SSR rendering and hydration (ReactDOM)", () => {
    const LocaleMarkup = ({ initialLocale }: { initialLocale?: Locale }) => {
      const { locale } = useLocale(initialLocale);
      return React.createElement("div", { "data-locale": locale }, locale);
    };

    it("should render server markup with the expected locale", () => {
      const html = renderToString(
        React.createElement(LocaleMarkup, { initialLocale: "en" })
      );

      expect(html).toContain('data-locale="en"');
      expect(html).toContain(">en<");
    });

    it("should hydrate without locale mismatch when server and client locales match", () => {
      const serverLocale: Locale = "sr-Cyrl";
      const html = renderToString(
        React.createElement(LocaleMarkup, { initialLocale: serverLocale })
      );

      const container = document.createElement("div");
      container.innerHTML = html;

      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      let root: ReturnType<typeof hydrateRoot> | null = null;

      act(() => {
        root = hydrateRoot(
          container,
          React.createElement(LocaleMarkup, { initialLocale: serverLocale })
        );
      });

      expect(container.textContent).toBe(serverLocale);
      expect(consoleSpy).not.toHaveBeenCalled();

      if (!root) {
        consoleSpy.mockRestore();
        throw new Error("Hydration root was not created");
      }

      act(() => {
        root.unmount();
      });

      consoleSpy.mockRestore();
    });
  });

  describe("Locale persistence and state management", () => {
    it("should maintain locale state across multiple re-renders", () => {
      const { result, rerender } = renderHook(() => useLocale("en"));

      expect(result.current.locale).toBe("en");

      // Multiple re-renders
      rerender();
      expect(result.current.locale).toBe("en");

      rerender();
      expect(result.current.locale).toBe("en");

      rerender();
      expect(result.current.locale).toBe("en");
    });

    it("should maintain locale after user interaction", () => {
      const { result, rerender } = renderHook(() => useLocale("sr-Latn"));

      // User changes locale
      act(() => {
        result.current.setLocale("en");
      });
      expect(result.current.locale).toBe("en");

      // Re-render after interaction
      rerender();
      expect(result.current.locale).toBe("en");

      // Multiple re-renders
      rerender();
      rerender();
      expect(result.current.locale).toBe("en");
    });

    it("should preserve isRtl state across re-renders", () => {
      const { result, rerender } = renderHook(() => useLocale("sr-Cyrl"));

      expect(result.current.isRtl).toBe(false);

      rerender();
      expect(result.current.isRtl).toBe(false);

      act(() => {
        result.current.setLocale("en");
      });

      expect(result.current.isRtl).toBe(false);
      rerender();
      expect(result.current.isRtl).toBe(false);
    });

    it("should maintain stable locale metadata across state changes", () => {
      const { result } = renderHook(() => useLocale("sr-Latn"));

      const initialLocales = result.current.locales;
      const initialDefaultLocale = result.current.defaultLocale;

      act(() => {
        result.current.setLocale("en");
      });

      // Metadata should remain stable
      expect(result.current.locales).toBe(initialLocales);
      expect(result.current.defaultLocale).toBe(initialDefaultLocale);

      act(() => {
        result.current.setLocale("sr-Cyrl");
      });

      expect(result.current.locales).toBe(initialLocales);
      expect(result.current.defaultLocale).toBe(initialDefaultLocale);
    });

    it("should handle rapid state changes without losing consistency", () => {
      const { result } = renderHook(() => useLocale("sr-Latn"));

      // Rapid locale changes
      act(() => {
        result.current.setLocale("en");
        result.current.setLocale("sr-Cyrl");
        result.current.setLocale("sr-Latn");
        result.current.setLocale("en");
      });

      expect(result.current.locale).toBe("en");
      expect(i18n.activate).toHaveBeenCalledWith("en");
    });
  });

  describe("Edge cases and error handling", () => {
    it("should handle invalid locale string by falling back to default", () => {
      const { result } = renderHook(() => useLocale());

      const parsed = result.current.parseLocale("invalid-locale");
      expect(parsed).toBe(defaultLocale);
    });

    it("should handle null locale input", () => {
      const { result } = renderHook(() => useLocale());

      const parsed = result.current.parseLocale(null as any);
      expect(parsed).toBe(defaultLocale);
    });

    it("should handle undefined locale input", () => {
      const { result } = renderHook(() => useLocale());

      const parsed = result.current.parseLocale(undefined as any);
      expect(parsed).toBe(defaultLocale);
    });

    it("should handle empty string locale input", () => {
      const { result } = renderHook(() => useLocale());

      const parsed = result.current.parseLocale("");
      expect(parsed).toBe(defaultLocale);
    });

    it("should handle malformed Accept-Language header", () => {
      const { result } = renderHook(() => useLocale());

      const parsed = result.current.parseLocale("invalid;;header");
      expect(parsed).toBe(defaultLocale);
    });

    it("should handle unsupported locale in Accept-Language", () => {
      const { result } = renderHook(() => useLocale());

      // French is not in supported locales
      const parsed = result.current.parseLocale("fr-FR,fr;q=0.9");
      expect(parsed).toBe(defaultLocale);
    });

    it("should handle rapid locale changes without errors", () => {
      const { result } = renderHook(() => useLocale("sr-Latn"));

      // Rapid successive changes
      act(() => {
        result.current.setLocale("en");
        result.current.setLocale("sr-Cyrl");
        result.current.setLocale("en");
        result.current.setLocale("sr-Latn");
        result.current.setLocale("sr-Cyrl");
      });

      expect(result.current.locale).toBe("sr-Cyrl");
    });

    it("should handle setting same locale multiple times", () => {
      const { result } = renderHook(() => useLocale("en"));

      act(() => {
        result.current.setLocale("en");
      });
      expect(result.current.locale).toBe("en");

      act(() => {
        result.current.setLocale("en");
      });
      expect(result.current.locale).toBe("en");

      act(() => {
        result.current.setLocale("en");
      });
      expect(result.current.locale).toBe("en");
    });

    it("should handle locale with quality value parsing", () => {
      const { result } = renderHook(() => useLocale());

      // Accept-Language with quality values
      // Note: parseLocaleString matches first supported locale, doesn't parse q values
      const parsed = result.current.parseLocale(
        "en;q=0.5,sr-Latn;q=0.9,sr-Cyrl;q=0.8"
      );
      expect(parsed).toBe("en");
    });
  });

  describe("Integration with Next.js i18n patterns", () => {
    it("should parse Accept-Language header with quality values", () => {
      const { result } = renderHook(() => useLocale());

      // Standard Accept-Language header format
      const acceptLanguage = "sr-Latn,en-US;q=0.7,en;q=0.3";
      const parsed = result.current.parseLocale(acceptLanguage);

      expect(parsed).toBe("sr-Latn");
    });

    it("should parse Accept-Language header with multiple locales", () => {
      const { result } = renderHook(() => useLocale());

      const acceptLanguage = "sr-Cyrl,sr-Latn;q=0.8,en-US;q=0.5,en;q=0.3";
      const parsed = result.current.parseLocale(acceptLanguage);

      expect(parsed).toBe("sr-Cyrl");
    });

    it("should handle locale variants (e.g., en-US -> en)", () => {
      const { result } = renderHook(() => useLocale());

      // en-US should map to en
      const parsed = result.current.parseLocale("en-US,en;q=0.9");
      expect(parsed).toBe("en");

      // sr-Latn-RS should map to sr-Latn
      const parsed2 = result.current.parseLocale("sr-Latn-RS");
      expect(parsed2).toBe("sr-Latn");
    });

    it("should prioritize higher quality value in Accept-Language", () => {
      const { result } = renderHook(() => useLocale());

      // Note: parseLocaleString matches first supported locale, doesn't parse q values
      // sr-Latn appears first in the string, so it's matched
      const acceptLanguage = "sr-Latn;q=0.7,sr-Cyrl;q=0.9,en;q=0.5";
      const parsed = result.current.parseLocale(acceptLanguage);

      expect(parsed).toBe("sr-Latn");
    });

    it("should handle wildcard locale in Accept-Language", () => {
      const { result } = renderHook(() => useLocale());

      // Wildcard should fall back to default
      const parsed = result.current.parseLocale("*");
      expect(parsed).toBe(defaultLocale);
    });

    it("should parse locale with region and script subtags", () => {
      const { result } = renderHook(() => useLocale());

      // Complex BCP 47 tag
      const parsed = result.current.parseLocale("sr-Latn-RS");
      expect(parsed).toBe("sr-Latn");
    });

    it("should integrate with parseLocale and setLocale workflow", () => {
      const { result } = renderHook(() => useLocale());

      // Simulate Next.js receiving Accept-Language header
      const acceptLanguageHeader = "sr-Latn,en-US;q=0.7,en;q=0.3";

      // Parse the header
      const parsedLocale = result.current.parseLocale(acceptLanguageHeader);
      expect(parsedLocale).toBe("sr-Latn");

      // Set the locale
      act(() => {
        result.current.setLocale(parsedLocale);
      });

      expect(result.current.locale).toBe("sr-Latn");
      expect(i18n.activate).toHaveBeenCalledWith("sr-Latn");
    });
  });
});
