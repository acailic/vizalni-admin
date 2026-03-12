// app/components/navigation/NavItem.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { NavItem } from "./NavItem";

describe("NavItem", () => {
  it("renders link with label", () => {
    render(<NavItem href="/browse" label="Browse" />);
    expect(screen.getByRole("link", { name: "Browse" })).toBeInTheDocument();
  });

  it("shows active state when isActive is true", () => {
    render(<NavItem href="/browse" label="Browse" isActive />);
    const link = screen.getByRole("link");
    expect(link).toHaveStyle({ fontWeight: 600 });
  });

  it("applies inactive style by default", () => {
    render(<NavItem href="/browse" label="Browse" />);
    const link = screen.getByRole("link");
    expect(link).not.toHaveStyle({ fontWeight: 600 });
  });

  it("supports external links", () => {
    render(<NavItem href="https://example.com" label="External" external />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
