/**
 * DemoCodeBlock Component
 *
 * Displays copyable code snippets in demo pages.
 * Framework-agnostic component with optional Material-UI integration.
 *
 * @example
 * ```tsx
 * import { DemoCodeBlock } from '@/components/demos/demo-code-block';
 *
 * <DemoCodeBlock
 *   title="Reproduce this chart"
 *   code={`import { LineChart } from '@acailic/vizualni-admin/charts';`}
 *   language="tsx"
 * />
 * ```
 */

import { useState } from "react";

export interface DemoCodeBlockProps {
  /** Code to display */
  code: string;
  /** Programming language for syntax highlighting label */
  language?: string;
  /** Title for the code block */
  title?: string;
  /** Initially collapsed */
  defaultCollapsed?: boolean;
  /** Optional custom className */
  className?: string;
  /** Show line numbers */
  showLineNumbers?: boolean;
}

/**
 * DemoCodeBlock - A collapsible code block with copy functionality
 */
export function DemoCodeBlock({
  code,
  language = "tsx",
  title = "Code",
  defaultCollapsed = true,
  className = "",
  showLineNumbers = false,
}: DemoCodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(!defaultCollapsed);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split("\n");

  return (
    <div
      className={`demo-code-block ${className}`}
      style={{
        marginTop: "12px",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 12px",
          backgroundColor: "#f9fafb",
          borderBottom: expanded ? "1px solid #e5e7eb" : "none",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: expanded ? "12px" : "14px" }}>
            {expanded ? "▼" : "▶"}
          </span>
          <span
            style={{
              fontWeight: 600,
              fontSize: "14px",
              color: "#1f2937",
            }}
          >
            {title}
          </span>
          <span
            style={{
              padding: "2px 8px",
              backgroundColor: "#6366f1",
              color: "white",
              borderRadius: "4px",
              fontSize: "11px",
              fontWeight: 500,
            }}
          >
            {language}
          </span>
          {showLineNumbers && (
            <span
              style={{
                padding: "2px 8px",
                backgroundColor: "#e5e7eb",
                color: "#4b5563",
                borderRadius: "4px",
                fontSize: "11px",
                fontWeight: 500,
              }}
            >
              {lines.length} lines
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCopy();
          }}
          style={{
            padding: "4px 12px",
            border: "1px solid #d1d5db",
            borderRadius: "4px",
            backgroundColor: copied ? "#10b981" : "white",
            color: copied ? "white" : "#374151",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: 500,
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            if (!copied) {
              e.currentTarget.style.backgroundColor = "#f9fafb";
            }
          }}
          onMouseLeave={(e) => {
            if (!copied) {
              e.currentTarget.style.backgroundColor = "white";
            }
          }}
        >
          {copied ? "✓ Copied!" : "Copy code"}
        </button>
      </div>

      {/* Code Content */}
      {expanded && (
        <div
          style={{
            position: "relative",
            backgroundColor: "#1e1e1e",
          }}
        >
          <pre
            style={{
              margin: 0,
              padding: "16px",
              overflow: "auto",
              fontSize: "13px",
              lineHeight: 1.5,
              fontFamily: 'Consolas, Monaco, "Andale Mono", monospace',
              maxHeight: "400px",
              color: "#d4d4d4",
            }}
          >
            <code>
              {showLineNumbers ? (
                <div style={{ display: "flex" }}>
                  <div
                    style={{
                      marginRight: "16px",
                      color: "#858585",
                      textAlign: "right",
                      userSelect: "none",
                      minWidth: "32px",
                    }}
                  >
                    {lines.map((_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}
                  </div>
                  <div>{code}</div>
                </div>
              ) : (
                code
              )}
            </code>
          </pre>
        </div>
      )}
    </div>
  );
}

export default DemoCodeBlock;
