import "@testing-library/jest-dom/vitest";
import { describe, expect, it } from "vitest";

import { buildStaticLocaleChangeUrl } from "@/components/language-picker";

describe("LanguagePicker static export routing", () => {
  it("preserves the GitHub Pages base path when switching locale", () => {
    const nextUrl = buildStaticLocaleChangeUrl(
      "https://example.com/vizualni-admin/embed?type=bar&dataset=budget",
      "en"
    );

    expect(nextUrl).toBe(
      "https://example.com/vizualni-admin/embed?type=bar&dataset=budget&uiLocale=en"
    );
  });
});
