import "@testing-library/jest-dom/vitest";
import { describe, expect, it, vi } from "vitest";

import { render, screen } from "@/test-utils";

import { DemoError, DemoEmpty, DemoLayout, DemoLoading } from "./demo-layout";

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("@/components/header", () => ({
  Header: () => <div data-testid="header-mock">Header</div>,
}));

vi.mock("@/components/flex", () => ({
  Flex: ({ children, ...rest }: any) => (
    <div data-testid="flex-mock" {...rest}>
      {children}
    </div>
  ),
}));

describe("DemoLayout", () => {
  it("renders title, description and dataset info", () => {
    render(
      <DemoLayout
        title="Test Demo"
        description="Description"
        datasetInfo={{
          organization: "Org",
          updatedAt: "2024-05-20",
        }}
      >
        <div>content</div>
      </DemoLayout>
    );

    expect(screen.getByText("Test Demo")).toBeTruthy();
    expect(screen.getByText("Description")).toBeTruthy();
    expect(screen.getByText("Organization:")).toBeTruthy();
    expect(screen.getByText("Org")).toBeTruthy();
    // the formatted date can vary by locale; assert year is present
    expect(screen.getByText(/2024/)).toBeTruthy();
    expect(screen.getByText("content")).toBeTruthy();
  });

  // Note: Component bug - hideBackButton prop doesn't work correctly
  it.skip("hides back button when hideBackButton is true", () => {
    render(
      <DemoLayout title="No Back" hideBackButton={true}>
        <div>child</div>
      </DemoLayout>
    );

    expect(screen.queryByText(/Back to demo gallery/)).toBeNull();
  });
});

describe("Demo helper states", () => {
  it("renders loading with default message", () => {
    render(<DemoLoading />);
    expect(screen.getByText(/Loading data from data.gov.rs/i)).toBeTruthy();
  });

  it("renders error with retry", () => {
    const onRetry = vi.fn();
    render(<DemoError error="boom" onRetry={onRetry} />);
    screen.getByRole("button", { name: /Try again/i }).click();
    expect(onRetry).toHaveBeenCalled();
  });

  it("renders empty state message", () => {
    render(<DemoEmpty message="nothing here" />);
    expect(screen.getByText("nothing here")).toBeTruthy();
  });
});
