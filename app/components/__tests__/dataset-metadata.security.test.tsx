/**
 * @vitest-environment jsdom
 * Tests for DatasetMetadata XSS Prevention
 * Tests that malicious HTML is properly sanitized while preserving safe content
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";

import { DatasetMetadata } from "../dataset-metadata";

// Mock dependencies
vi.mock("@lingui/macro", () => ({
  Trans: ({ id }: { id: string }) => <span>{id}</span>,
}));

vi.mock("@/charts/shared/chart-helpers", () => ({
  useQueryFilters: () => [null],
}));

vi.mock("@/components/data-download", () => ({
  DataDownloadMenu: () => null,
}));

vi.mock("@/components/tag", () => ({
  Tag: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="tag">{children}</span>
  ),
}));

vi.mock("@/formatters", () => ({
  useFormatDate: () => (date: string) => date,
}));

vi.mock("@/icons", () => ({
  Icon: ({ name }: { name: string }) => <span data-testid={`icon-${name}`} />,
}));

vi.mock("@/locales/use-locale", () => ({
  useLocale: () => "en",
}));

vi.mock("@/utils/opendata", () => ({
  makeOpenDataLink: () => null,
}));

describe("DatasetMetadata XSS Prevention", () => {
  const mockCube = {
    title: "Test Dataset",
    publisher:
      '<script>alert("xss")</script><a href="#">Publisher</a>',
    datePublished: "2024-01-01",
    themes: [],
    contactPoints: [],
  };

  const mockDataSource = { type: "sparql" as const, url: "http://example.org" };

  it("should escape malicious HTML in publisher field", () => {
    render(
      <DatasetMetadata
        cube={mockCube as any}
        showTitle={false}
        dataSource={mockDataSource}
      />
    );

    // Script tags should be escaped/removed
    expect(document.querySelector("script")).toBeNull();
  });

  it("should preserve safe links in publisher field", () => {
    const safeCube = {
      ...mockCube,
      publisher: '<a href="https://example.org">Safe Publisher</a>',
    };

    render(
      <DatasetMetadata
        cube={safeCube as any}
        showTitle={false}
        dataSource={mockDataSource}
      />
    );

    // Safe anchor tags should be preserved
    const link = document.querySelector('a[href="https://example.org"]');
    expect(link).toBeInTheDocument();
    expect(link?.textContent).toBe("Safe Publisher");
  });

  it("should remove javascript: URLs from href attributes", () => {
    const maliciousCube = {
      ...mockCube,
      publisher:
        '<a href="javascript:alert(\'xss\')">Malicious Link</a>',
    };

    render(
      <DatasetMetadata
        cube={maliciousCube as any}
        showTitle={false}
        dataSource={mockDataSource}
      />
    );

    // The link should not have a javascript: href (it should be removed)
    const link = document.querySelector("a");
    const href = link?.getAttribute("href");
    // href should either be null (removed) or not contain javascript:
    expect(href === null || !href.includes("javascript:")).toBe(true);
  });

  it("should add safe rel attributes to links", () => {
    const cubeWithLink = {
      ...mockCube,
      publisher: '<a href="https://example.org">Link</a>',
    };

    render(
      <DatasetMetadata
        cube={cubeWithLink as any}
        showTitle={false}
        dataSource={mockDataSource}
      />
    );

    const link = document.querySelector("a");
    expect(link?.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("should set target=_blank on links", () => {
    const cubeWithLink = {
      ...mockCube,
      publisher: '<a href="https://example.org">Link</a>',
    };

    render(
      <DatasetMetadata
        cube={cubeWithLink as any}
        showTitle={false}
        dataSource={mockDataSource}
      />
    );

    const link = document.querySelector("a");
    expect(link?.getAttribute("target")).toBe("_blank");
  });

  it("should remove onclick and other event handlers", () => {
    const maliciousCube = {
      ...mockCube,
      publisher:
        '<a href="https://example.org" onclick="alert(\'xss\')">Link</a>',
    };

    render(
      <DatasetMetadata
        cube={maliciousCube as any}
        showTitle={false}
        dataSource={mockDataSource}
      />
    );

    const link = document.querySelector("a");
    expect(link?.getAttribute("onclick")).toBeNull();
  });
});
