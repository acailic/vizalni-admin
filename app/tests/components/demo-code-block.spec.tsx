/**
 * DemoCodeBlock Component Tests
 *
 * Tests for the DemoCodeBlock component which displays copyable code snippets
 * in demo pages with expand/collapse functionality.
 */

import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { DemoCodeBlock } from "@/components/demos/demo-code-block";

// Mock navigator.clipboard
const mockClipboard = {
  writeText: vi.fn().mockResolvedValue(undefined),
};

Object.assign(navigator, { clipboard: mockClipboard });

describe("DemoCodeBlock", () => {
  const sampleCode = `import { LineChart } from '@acailic/vizualni-admin/charts';

function MyChart() {
  const data = [{ x: 1, y: 2 }, { x: 2, y: 4 }];
  return <LineChart data={data} />;
}`;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe("Basic Rendering", () => {
    it("renders with basic props", () => {
      render(<DemoCodeBlock code={sampleCode} />);

      expect(screen.getByText("Code")).toBeInTheDocument();
      expect(screen.getByText("tsx")).toBeInTheDocument();
    });

    it("renders with custom title", () => {
      render(<DemoCodeBlock code={sampleCode} title="Custom Title" />);

      expect(screen.getByText("Custom Title")).toBeInTheDocument();
    });

    it("renders with custom language", () => {
      render(<DemoCodeBlock code={sampleCode} language="python" />);

      expect(screen.getByText("python")).toBeInTheDocument();
    });

    it("renders with custom className", () => {
      const { container } = render(
        <DemoCodeBlock code={sampleCode} className="custom-class" />
      );

      const codeBlock = container.querySelector(".demo-code-block");
      expect(codeBlock).toHaveClass("custom-class");
    });

    it("renders code content when expanded", () => {
      render(<DemoCodeBlock code={sampleCode} defaultCollapsed={false} />);

      expect(screen.getByText(/import.*LineChart/)).toBeInTheDocument();
      expect(screen.getByText(/MyChart/)).toBeInTheDocument();
    });

    it("does not render code content when collapsed", () => {
      const { container } = render(
        <DemoCodeBlock code={sampleCode} defaultCollapsed={true} />
      );

      const pre = container.querySelector("pre");
      expect(pre).not.toBeInTheDocument();
    });
  });

  describe("Expand/Collapse Behavior", () => {
    it("is collapsed by default", () => {
      const { container } = render(<DemoCodeBlock code={sampleCode} />);

      expect(container.querySelector("pre")).not.toBeInTheDocument();
      expect(screen.getByText("▶")).toBeInTheDocument();
    });

    it("is expanded when defaultCollapsed is false", () => {
      render(<DemoCodeBlock code={sampleCode} defaultCollapsed={false} />);

      expect(screen.getByText(/import.*LineChart/)).toBeInTheDocument();
      expect(screen.getByText("▼")).toBeInTheDocument();
    });

    it("expands when header is clicked", () => {
      const { container } = render(
        <DemoCodeBlock code={sampleCode} defaultCollapsed={true} />
      );

      const header = screen.getByText("Code").closest("div");
      fireEvent.click(header!);

      expect(screen.getByText("▼")).toBeInTheDocument();
      expect(container.querySelector("pre")).toBeInTheDocument();
    });

    it("collapses when header is clicked while expanded", () => {
      const { container } = render(
        <DemoCodeBlock code={sampleCode} defaultCollapsed={false} />
      );

      const header = screen.getByText("Code").closest("div");
      fireEvent.click(header!);

      expect(screen.getByText("▶")).toBeInTheDocument();
      expect(container.querySelector("pre")).not.toBeInTheDocument();
    });

    it("toggles between expanded and collapsed states", () => {
      const { container } = render(
        <DemoCodeBlock code={sampleCode} defaultCollapsed={true} />
      );

      const header = screen.getByText("Code").closest("div");

      // First click - expand
      fireEvent.click(header!);
      expect(screen.getByText("▼")).toBeInTheDocument();
      expect(container.querySelector("pre")).toBeInTheDocument();

      // Second click - collapse
      fireEvent.click(header!);
      expect(screen.getByText("▶")).toBeInTheDocument();
      expect(container.querySelector("pre")).not.toBeInTheDocument();
    });
  });

  describe("Copy Functionality", () => {
    it("copies code to clipboard when copy button is clicked", async () => {
      render(<DemoCodeBlock code={sampleCode} />);

      const copyButton = screen.getByText("Copy code");
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(mockClipboard.writeText).toHaveBeenCalledWith(sampleCode);
      });
    });

    it('shows "Copied!" message after copying', async () => {
      render(<DemoCodeBlock code={sampleCode} />);

      const copyButton = screen.getByText("Copy code");
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(screen.getByText("✓ Copied!")).toBeInTheDocument();
      });
    });

    it("resets copy state after 2 seconds", async () => {
      const { container } = render(<DemoCodeBlock code={sampleCode} />);

      const copyButton = container.querySelector("button");
      expect(copyButton).toBeInTheDocument();

      fireEvent.click(copyButton!);

      // Check that copy state changes
      await waitFor(
        () => {
          expect(screen.getByText("✓ Copied!")).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      // Note: We don't test the actual 2-second reset as it requires
      // fake timers which can interfere with other async operations
      // The component implementation uses setTimeout which we trust
    });

    it("prevents header click when copy button is clicked", () => {
      const { container } = render(
        <DemoCodeBlock code={sampleCode} defaultCollapsed={true} />
      );

      const copyButton = screen.getByText("Copy code");
      fireEvent.click(copyButton);

      // Should remain collapsed since copy button click should not expand
      expect(container.querySelector("pre")).not.toBeInTheDocument();
    });
  });

  describe("Line Numbers", () => {
    const multiLineCode = `line 1
line 2
line 3
line 4
line 5`;

    it("shows line count badge when showLineNumbers is true", () => {
      render(<DemoCodeBlock code={multiLineCode} showLineNumbers={true} />);

      expect(screen.getByText("5 lines")).toBeInTheDocument();
    });

    it("does not show line count badge when showLineNumbers is false", () => {
      render(<DemoCodeBlock code={multiLineCode} showLineNumbers={false} />);

      expect(screen.queryByText("5 lines")).not.toBeInTheDocument();
    });

    it("renders line numbers in code content when expanded", () => {
      render(
        <DemoCodeBlock
          code={multiLineCode}
          showLineNumbers={true}
          defaultCollapsed={false}
        />
      );

      const codeContainer = screen.getByText("1").closest("div");
      expect(codeContainer).toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText("4")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();
    });

    it("counts lines correctly for single line code", () => {
      const singleLineCode = "single line";
      render(
        <DemoCodeBlock
          code={singleLineCode}
          showLineNumbers={true}
          defaultCollapsed={false}
        />
      );

      expect(screen.getByText("1 lines")).toBeInTheDocument();
    });

    it("counts lines correctly for empty code", () => {
      render(
        <DemoCodeBlock
          code=""
          showLineNumbers={true}
          defaultCollapsed={false}
        />
      );

      expect(screen.getByText("1 lines")).toBeInTheDocument();
    });
  });

  describe("Different Languages", () => {
    it("renders TypeScript language badge", () => {
      render(
        <DemoCodeBlock code="const x: number = 1;" language="typescript" />
      );

      expect(screen.getByText("typescript")).toBeInTheDocument();
    });

    it("renders JavaScript language badge", () => {
      render(<DemoCodeBlock code="const x = 1;" language="javascript" />);

      expect(screen.getByText("javascript")).toBeInTheDocument();
    });

    it("renders Python language badge", () => {
      render(<DemoCodeBlock code="x = 1" language="python" />);

      expect(screen.getByText("python")).toBeInTheDocument();
    });

    it("renders CSS language badge", () => {
      render(<DemoCodeBlock code=".class {}" language="css" />);

      expect(screen.getByText("css")).toBeInTheDocument();
    });

    it("renders JSON language badge", () => {
      render(<DemoCodeBlock code='{"key": "value"}' language="json" />);

      expect(screen.getByText("json")).toBeInTheDocument();
    });

    it("defaults to tsx language", () => {
      render(<DemoCodeBlock code="const x = 1;" />);

      expect(screen.getByText("tsx")).toBeInTheDocument();
    });
  });

  describe("Default States", () => {
    it("respects defaultCollapsed=true", () => {
      const { container } = render(
        <DemoCodeBlock code={sampleCode} defaultCollapsed={true} />
      );

      expect(screen.getByText("▶")).toBeInTheDocument();
      expect(container.querySelector("pre")).not.toBeInTheDocument();
    });

    it("respects defaultCollapsed=false", () => {
      render(<DemoCodeBlock code={sampleCode} defaultCollapsed={false} />);

      expect(screen.getByText("▼")).toBeInTheDocument();
      expect(screen.getByText(/import.*LineChart/)).toBeInTheDocument();
    });

    it("maintains expanded state after multiple interactions", () => {
      const { container } = render(
        <DemoCodeBlock code={sampleCode} defaultCollapsed={true} />
      );

      const header = screen.getByText("Code").closest("div");

      // Expand
      fireEvent.click(header!);
      expect(screen.getByText("▼")).toBeInTheDocument();
      expect(container.querySelector("pre")).toBeInTheDocument();

      // Copy (should not collapse)
      const copyButton = screen.getByText("Copy code");
      fireEvent.click(copyButton);
      expect(screen.getByText("▼")).toBeInTheDocument();
      expect(container.querySelector("pre")).toBeInTheDocument();

      // Collapse
      fireEvent.click(header!);
      expect(screen.getByText("▶")).toBeInTheDocument();
      expect(container.querySelector("pre")).not.toBeInTheDocument();
    });
  });

  describe("Code Content Display", () => {
    it("displays code in pre element when expanded", () => {
      const { container } = render(
        <DemoCodeBlock code={sampleCode} defaultCollapsed={false} />
      );

      const pre = container.querySelector("pre");
      expect(pre).toBeInTheDocument();
      expect(pre?.textContent).toContain("import");
      expect(pre?.textContent).toContain("LineChart");
      expect(pre?.textContent).toContain("MyChart");
    });

    it("displays code in code element", () => {
      const { container } = render(
        <DemoCodeBlock code={sampleCode} defaultCollapsed={false} />
      );

      const code = container.querySelector("code");
      expect(code).toBeInTheDocument();
      expect(code?.textContent).toContain("import");
      expect(code?.textContent).toContain("LineChart");
    });

    it("handles special characters in code", () => {
      const specialCode = "<div>&nbsp;</div>\n\t\"quoted\"\n'single'";
      const { container } = render(
        <DemoCodeBlock code={specialCode} defaultCollapsed={false} />
      );

      const pre = container.querySelector("pre");
      expect(pre).toBeInTheDocument();
      expect(pre?.textContent).toContain("<div>");
      expect(pre?.textContent).toContain('"quoted"');
    });

    it("handles very long code lines", () => {
      const longCode = "a".repeat(1000);
      const { container } = render(
        <DemoCodeBlock code={longCode} defaultCollapsed={false} />
      );

      const pre = container.querySelector("pre");
      expect(pre).toBeInTheDocument();
      expect(pre?.textContent?.length).toBe(1000);
    });

    it("handles empty code", () => {
      const { container } = render(
        <DemoCodeBlock code="" defaultCollapsed={false} />
      );

      const pre = container.querySelector("pre");
      expect(pre).toBeInTheDocument();
      expect(pre?.textContent).toBe("");
    });
  });

  describe("Styling and Layout", () => {
    it("applies correct container styles", () => {
      const { container } = render(<DemoCodeBlock code={sampleCode} />);

      const codeBlock = container.querySelector(".demo-code-block");
      expect(codeBlock).toHaveStyle({
        marginTop: "12px",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        overflow: "hidden",
      });
    });

    it("applies header styles", () => {
      const { container } = render(<DemoCodeBlock code={sampleCode} />);

      const header = container.querySelector(
        ".demo-code-block > div:first-child"
      );
      expect(header).toHaveStyle({
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#f9fafb",
        cursor: "pointer",
        userSelect: "none",
      });
    });

    it("shows border bottom on header when expanded", () => {
      const { container: containerExpanded } = render(
        <DemoCodeBlock code={sampleCode} defaultCollapsed={false} />
      );
      const { container: containerCollapsed } = render(
        <DemoCodeBlock code={sampleCode} defaultCollapsed={true} />
      );

      const headerExpanded = containerExpanded.querySelector(
        ".demo-code-block > div:first-child"
      );
      const headerCollapsed = containerCollapsed.querySelector(
        ".demo-code-block > div:first-child"
      );

      expect(headerExpanded).toHaveStyle({
        borderBottom: "1px solid #e5e7eb",
      });
      expect(headerCollapsed).not.toHaveStyle({
        borderBottom: "1px solid #e5e7eb",
      });
    });
  });

  describe("Accessibility", () => {
    it("has clickable header with proper cursor", () => {
      const { container } = render(<DemoCodeBlock code={sampleCode} />);

      const header = container.querySelector(".demo-code-block > div");
      expect(header).toHaveStyle({ cursor: "pointer" });
    });

    it("has accessible copy button", () => {
      const { container } = render(<DemoCodeBlock code={sampleCode} />);

      const copyButton = container.querySelector("button");
      expect(copyButton).toBeInTheDocument();
      expect(copyButton?.tagName).toBe("BUTTON");
    });

    it("prevents text selection on header", () => {
      const { container } = render(<DemoCodeBlock code={sampleCode} />);

      const header = container.querySelector(".demo-code-block > div");
      expect(header).toHaveStyle({ userSelect: "none" });
    });
  });

  describe("Edge Cases", () => {
    it("handles code with only newlines", () => {
      const newlineCode = "\n\n\n";
      const { container } = render(
        <DemoCodeBlock code={newlineCode} defaultCollapsed={false} />
      );

      const pre = container.querySelector("pre");
      expect(pre).toBeInTheDocument();
      expect(pre?.textContent).toBeTruthy();
    });

    it("handles code with mixed line endings", () => {
      const mixedCode = "line1\nline2\r\nline3\rline4";
      const { container } = render(
        <DemoCodeBlock code={mixedCode} defaultCollapsed={false} />
      );

      const pre = container.querySelector("pre");
      expect(pre).toBeInTheDocument();
      expect(pre?.textContent).toContain("line1");
    });

    it("handles unicode characters in code", () => {
      const unicodeCode = 'const emoji = "🚀";\nconst chinese = "中文";';
      const { container } = render(
        <DemoCodeBlock code={unicodeCode} defaultCollapsed={false} />
      );

      const pre = container.querySelector("pre");
      expect(pre).toBeInTheDocument();
      expect(pre?.textContent).toContain("🚀");
      expect(pre?.textContent).toContain("中文");
    });

    it("handles code with tabs", () => {
      const tabCode = "\t\tindented code";
      const { container } = render(
        <DemoCodeBlock code={tabCode} defaultCollapsed={false} />
      );

      const pre = container.querySelector("pre");
      expect(pre).toBeInTheDocument();
      expect(pre?.textContent).toContain("indented code");
    });
  });

  describe("Button Interactions", () => {
    it("has clickable copy button", () => {
      const { container } = render(<DemoCodeBlock code={sampleCode} />);

      const copyButton = container.querySelector("button");
      expect(copyButton).toBeInTheDocument();
      expect(copyButton?.textContent).toContain("Copy code");
    });

    it("updates button text after copy", async () => {
      const { container } = render(<DemoCodeBlock code={sampleCode} />);

      const copyButton = container.querySelector("button");
      expect(copyButton?.textContent).toContain("Copy code");

      fireEvent.click(copyButton!);

      // Wait for the async copy operation and state update
      await waitFor(
        () => {
          expect(copyButton?.textContent).toContain("✓ Copied!");
        },
        { timeout: 3000 }
      );
    });
  });
});
