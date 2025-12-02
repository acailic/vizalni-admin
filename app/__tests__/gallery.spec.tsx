import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

import GalleryPage from "@/pages/gallery";

vi.mock("next/router", () => ({
  useRouter: () => ({ locale: "sr" }),
}));

const mockDatasets = [
  {
    id: "test-dataset-1",
    title: "Test Dataset 1",
    notes: "Description of test dataset 1",
    resources: [
      {
        id: "resource-1",
        name: "Resource 1",
        format: "CSV",
        url: "https://example.com/data.csv",
      },
    ],
    tags: [{ name: "statistics" }, { name: "population" }],
    organization: {
      title: "Test Organization",
      image_url: "https://example.com/logo.png",
    },
  },
  {
    id: "test-dataset-2",
    title: "Test Dataset 2",
    notes: "Description of test dataset 2",
    resources: [],
    tags: [{ name: "economy" }],
    // No organization field to test null safety
  },
];

describe("GalleryPage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders loading state initially", () => {
    global.fetch = vi.fn(() => new Promise(() => {})) as any;
    render(<GalleryPage />);
    expect(screen.getByText(/Loading datasets.../i)).toBeTruthy();
  });

  it("renders datasets after successful fetch", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            success: true,
            result: { results: mockDatasets },
          }),
      })
    ) as any;

    render(<GalleryPage />);

    await waitFor(() => {
      expect(screen.getByText("Test Dataset 1")).toBeTruthy();
    });

    expect(screen.getByText("Test Dataset 2")).toBeTruthy();
    expect(screen.getByText("Test Organization")).toBeTruthy();
    expect(screen.getByText("Unknown Organization")).toBeTruthy();
  });

  it("renders error state when fetch fails", async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error("Network error"))) as any;

    render(<GalleryPage />);

    await waitFor(() => {
      expect(
        screen.getByText(/Failed to load datasets. Please try again later./i)
      ).toBeTruthy();
    });
  });

  it("renders page title and description", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            success: true,
            result: { results: [] },
          }),
      })
    ) as any;

    render(<GalleryPage />);

    await waitFor(() => {
      expect(screen.getByText("Serbia Open Data Gallery")).toBeTruthy();
    });

    expect(screen.getByText(/Exploring datasets from data.gov.rs/i)).toBeTruthy();
  });

  it("renders external links with proper security attributes", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            success: true,
            result: { results: [mockDatasets[0]] },
          }),
      })
    ) as any;

    const { container } = render(<GalleryPage />);

    await waitFor(() => {
      expect(screen.getByText("Test Dataset 1")).toBeTruthy();
    });

    const externalLinks = container.querySelectorAll('a[target="_blank"]');
    externalLinks.forEach((link) => {
      expect(link.getAttribute("rel")).toContain("noopener");
      expect(link.getAttribute("rel")).toContain("noreferrer");
    });
  });

  it("handles datasets with no resources", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            success: true,
            result: { results: [mockDatasets[1]] },
          }),
      })
    ) as any;

    render(<GalleryPage />);

    await waitFor(() => {
      expect(screen.getByText("Test Dataset 2")).toBeTruthy();
    });

    // Should not render download button when no resources
    expect(screen.queryByText(/Download/i)).toBeNull();
  });
});
