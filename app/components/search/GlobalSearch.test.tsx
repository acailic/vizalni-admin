// app/components/search/GlobalSearch.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { GlobalSearch } from "./GlobalSearch";

describe("GlobalSearch", () => {
  it("renders search bar with placeholder", () => {
    render(<GlobalSearch />);
    const searchInput = screen.getByRole("search");
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute("placeholder");
  });

  it("has accessible label", () => {
    render(<GlobalSearch />);
    const searchInput = screen.getByRole("search");
    expect(searchInput).toHaveAttribute("aria-label", "Search");
  });

  it("supports localized placeholders", () => {
    render(<GlobalSearch locale="sr" />);
    const searchInput = screen.getByRole("search");
    expect(searchInput.getAttribute("placeholder")).toBe("Pretraga...");
  });

  it("updates value on change", () => {
    render(<GlobalSearch />);
    const searchInput = screen.getByRole("search");
    fireEvent.change(searchInput, { target: { value: "test query" } });
    expect(searchInput).toHaveValue("test query");
  });
});
