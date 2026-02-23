import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import type { Dataset } from "@/types/topics";

import { DatasetCard } from "../DatasetCard";

const mockDataset: Dataset = {
  id: "republic-budget-2024",
  title: {
    sr: "Републички буџет за 2024. годину",
    en: "Republic Budget for 2024",
  },
  description: {
    sr: "Приходи и расходи Републике Србије",
    en: "Revenues and expenditures of the Republic of Serbia",
  },
  dataGovRsId: "budzet-republike-srbije",
  dataGovRsUrl: "https://data.gov.rs/sr/datasets/budzet-republike-srbije/",
  tags: ["budget", "annual", "finance"],
  lastUpdated: "2024-01-15",
  format: "CSV",
  recommendedChart: "bar",
};

describe("DatasetCard", () => {
  it("renders dataset title in English", () => {
    render(<DatasetCard dataset={mockDataset} locale="en" />);
    expect(screen.getByText("Republic Budget for 2024")).toBeInTheDocument();
  });

  it("renders dataset title in Serbian", () => {
    render(<DatasetCard dataset={mockDataset} locale="sr" />);
    expect(
      screen.getByText("Републички буџет за 2024. годину")
    ).toBeInTheDocument();
  });

  it("renders format badge", () => {
    render(<DatasetCard dataset={mockDataset} locale="en" />);
    expect(screen.getByText("CSV")).toBeInTheDocument();
  });

  it("renders open button", () => {
    render(<DatasetCard dataset={mockDataset} locale="en" />);
    expect(
      screen.getByRole("link", { name: /open on data.gov.rs/i })
    ).toBeInTheDocument();
  });

  it("links to data.gov.rs dataset page", () => {
    render(<DatasetCard dataset={mockDataset} locale="en" />);
    const link = screen.getByRole("link", { name: /open on data.gov.rs/i });
    expect(link).toHaveAttribute(
      "href",
      "https://data.gov.rs/sr/datasets/budzet-republike-srbije/"
    );
  });

  it("renders open button in Serbian", () => {
    render(<DatasetCard dataset={mockDataset} locale="sr" />);
    expect(
      screen.getByRole("link", { name: /отвори на data.gov.rs/i })
    ).toBeInTheDocument();
  });
});
