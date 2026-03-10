// app/components/navigation/MainNav.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { MainNav } from "./MainNav";

// Mock useRouter
vi.mock("next/router", () => ({
  useRouter: () => ({
    pathname: "/browse",
    asPath: "/browse",
  }),
}));

describe("MainNav", () => {
  it("renders all navigation items", () => {
    render(<MainNav />);
    expect(screen.getByRole("link", { name: "Browse" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Create" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Topics" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Gallery" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Docs" })).toBeInTheDocument();
  });

  it("highlights active navigation item based on pathname", () => {
    render(<MainNav />);
    const browseLink = screen.getByRole("link", { name: "Browse" });
    expect(browseLink).toHaveStyle({ fontWeight: 600 });
  });

  it("supports localized labels", () => {
    render(<MainNav locale="sr-Latn" />);
    expect(screen.getByRole("link", { name: "Pretraga" })).toBeInTheDocument();
  });
});
