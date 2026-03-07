import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import type { Topic } from "@/types/topics";

import { TopicCard } from "../TopicCard";

const mockTopic: Topic = {
  id: "economy",
  title: {
    sr: "Економија и финансије",
    "sr-Latn": "Ekonomija i finansije",
    en: "Economy & Finance",
  },
  icon: "AttachMoney",
  description: {
    sr: "Буджети, порези, јавни дуг",
    "sr-Latn": "Budžeti, porezi, javni dug",
    en: "Budgets, taxes, public debt",
  },
  datasetCount: 5,
};

describe("TopicCard", () => {
  it("renders topic title in English", () => {
    render(<TopicCard topic={mockTopic} locale="en" />);
    expect(screen.getByText("Economy & Finance")).toBeInTheDocument();
  });

  it("renders topic title in Serbian", () => {
    render(<TopicCard topic={mockTopic} locale="sr-Cyrl" />);
    expect(screen.getByText("Економија и финансије")).toBeInTheDocument();
  });

  it("renders dataset count", () => {
    render(<TopicCard topic={mockTopic} locale="en" />);
    expect(screen.getByText("5 datasets")).toBeInTheDocument();
  });

  it("links to topic page", () => {
    render(<TopicCard topic={mockTopic} locale="en" />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/topics/economy");
  });
});
