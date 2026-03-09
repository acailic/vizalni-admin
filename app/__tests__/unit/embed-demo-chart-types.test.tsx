import "@testing-library/jest-dom/vitest";
import { describe, expect, it, vi } from "vitest";

import DemoEmbed from "@/pages/embed/demo";
import { render, screen, waitFor } from "@/test-utils";

vi.mock("next/script", () => ({
  __esModule: true,
  default: () => null,
}));

describe("embed demo chart smoke tests", () => {
  it.each([
    { type: "line", dataset: "air" },
    { type: "bar", dataset: "students" },
    { type: "column", dataset: "budget" },
    { type: "pie", dataset: "vaccination" },
  ])(
    "renders $type charts without triggering the error boundary",
    async ({ type, dataset }) => {
      window.history.replaceState(
        {},
        "",
        `/embed/demo?type=${type}&dataset=${dataset}&dataSource=Prod&theme=light&lang=en`
      );

      const { container, unmount } = render(<DemoEmbed />);

      await waitFor(() => {
        expect(
          screen.queryByText(/Chart failed to load/i)
        ).not.toBeInTheDocument();
      });

      expect(
        screen.getByText(new RegExp(`Dataset:\\s*${dataset}`, "i"))
      ).toBeVisible();
      expect(screen.getByText(/Source:\s*Prod/i)).toBeVisible();
      expect(container.querySelector("svg")).toBeTruthy();

      unmount();
    }
  );
});
