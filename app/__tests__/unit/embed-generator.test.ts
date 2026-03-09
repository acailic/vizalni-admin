import { describe, expect, it } from "vitest";

import { buildIframeSnippet } from "@/lib/embed-generator";
import {
  buildEmbedPassthroughParams,
  DEFAULT_LAYOUT_PARAMS,
  resolveEmbedStateFromQuery,
} from "@/lib/embed-generator";

describe("embed generator helpers", () => {
  it("preserves dataSource and non-form query params in iframe URLs", () => {
    expect(
      buildEmbedPassthroughParams({
        chartType: "bar",
        dataset: "budget",
        dataSource: "Prod",
        layoutParams: {
          ...DEFAULT_LAYOUT_PARAMS,
          optimizeSpace: true,
        },
        resolvedQuery: {
          previewMode: "compact",
          lang: "en",
          theme: "light",
          removeBorder: "false",
        },
      })
    ).toEqual({
      previewMode: "compact",
      type: "bar",
      dataset: "budget",
      dataSource: "Prod",
      optimizeSpace: "true",
    });
  });

  it("uses URL-provided values when resolving initial form state", () => {
    expect(
      resolveEmbedStateFromQuery(
        {
          type: "pie",
          dataset: "vaccination",
          dataSource: "Prod",
          width: "720px",
          height: "360px",
          lang: "sr",
          theme: "dark",
          removeBorder: "true",
        },
        "en"
      )
    ).toMatchObject({
      chartType: "pie",
      dataset: "vaccination",
      dataSource: "Prod",
      width: "720px",
      height: "360px",
      lang: "sr",
      theme: "dark",
      layoutParams: expect.objectContaining({
        removeBorder: true,
      }),
    });
  });

  it("builds complete iframe snippets and only removes the border when requested", () => {
    expect(
      buildIframeSnippet({
        iframeSrc: "https://example.com/embed/demo?type=bar&dataSource=Prod",
        width: "100%",
        height: "520px",
        removeBorder: false,
      })
    ).toContain("border: 1px solid rgba(15, 23, 42, 0.16);");

    expect(
      buildIframeSnippet({
        iframeSrc: "https://example.com/embed/demo?type=bar&dataSource=Prod",
        width: "100%",
        height: "520px",
        removeBorder: true,
      })
    ).toContain("border: 0;");

    expect(
      buildIframeSnippet({
        iframeSrc: "https://example.com/embed/demo?type=bar&dataSource=Prod",
        width: "100%",
        height: "520px",
        removeBorder: true,
      }).trim()
    ).toMatch(/<\/iframe>$/);
  });

  it("reduces height when optimizeSpace is true and height is default", () => {
    // With optimizeSpace=true and default height, should reduce to 320px
    expect(
      buildIframeSnippet({
        iframeSrc: "https://example.com/embed/demo?type=bar",
        width: "100%",
        height: "520px",
        removeBorder: false,
        optimizeSpace: true,
      })
    ).toContain("height: 320px");

    // With optimizeSpace=false, should keep original height
    expect(
      buildIframeSnippet({
        iframeSrc: "https://example.com/embed/demo?type=bar",
        width: "100%",
        height: "520px",
        removeBorder: false,
        optimizeSpace: false,
      })
    ).toContain("height: 520px");

    // With optimizeSpace=true but custom height, should keep custom height
    expect(
      buildIframeSnippet({
        iframeSrc: "https://example.com/embed/demo?type=bar",
        width: "100%",
        height: "720px",
        removeBorder: false,
        optimizeSpace: true,
      })
    ).toContain("height: 720px");
  });
});
