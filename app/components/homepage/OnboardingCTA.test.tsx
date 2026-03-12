import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { OnboardingCTA } from "./OnboardingCTA";

describe("OnboardingCTA", () => {
  it("renders call-to-action with link to onboarding", () => {
    render(<OnboardingCTA />);
    const link = screen.getByRole("link", { name: /get started/i });
    expect(link).toHaveAttribute("href", "/onboarding");
  });

  it("shows localized title", () => {
    render(<OnboardingCTA locale="sr" />);
    expect(screen.getByText(/Prvi put ovde/i)).toBeInTheDocument();
  });

  it("has prominent styling", () => {
    render(<OnboardingCTA />);
    const card = screen.getByRole("link").closest("div");
    expect(card).toHaveStyle({ backgroundColor: "primary.light" });
  });
});
