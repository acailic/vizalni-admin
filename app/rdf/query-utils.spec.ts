import { describe, expect, it } from "vitest";

import { buildLocalizedSubQuery } from "./query-utils";

describe("buildLocalizedSubQuery", () => {
  it("should build a subquery with the given locale", () => {
    const subQuery = buildLocalizedSubQuery("s", "p", "o", {
      locale: "it",
    });

    const expectedLines = [
      'OPTIONAL { ?s p ?o_it . FILTER(LANG(?o_it) = "it") }',
      'OPTIONAL { ?s p ?o_sr-Latn . FILTER(LANG(?o_sr-Latn) = "sr-Latn") }',
      'OPTIONAL { ?s p ?o_sr-Cyrl . FILTER(LANG(?o_sr-Cyrl) = "sr-Cyrl") }',
      'OPTIONAL { ?s p ?o_en . FILTER(LANG(?o_en) = "en") }',
      'OPTIONAL { ?s p ?o_ . FILTER(LANG(?o_) = "") }',
    ];

    expectedLines.forEach((line) => {
      expect(subQuery).toContain(line);
    });

    expect(subQuery.indexOf(expectedLines[0])).toBeLessThan(
      subQuery.indexOf(expectedLines[1])
    );
    expect(subQuery).toContain(
      "BIND(COALESCE(?o_it, ?o_sr-Latn, ?o_sr-Cyrl, ?o_en, ?o_) AS ?o)"
    );
  });

  it("should build a subquery with fallback to non-localized property", () => {
    const subQuery = buildLocalizedSubQuery("s", "p", "o", {
      locale: "en",
      fallbackToNonLocalized: true,
    });

    expect(subQuery).toContain(
      'OPTIONAL { ?s p ?o_en . FILTER(LANG(?o_en) = "en") }'
    );
    expect(subQuery).toContain("OPTIONAL {\n  ?s p ?o_raw .\n}");
    expect(subQuery).toContain(
      "BIND(COALESCE(?o_en, ?o_sr-Latn, ?o_sr-Cyrl, ?o_, ?o_raw) AS ?o)"
    );
  });
});
