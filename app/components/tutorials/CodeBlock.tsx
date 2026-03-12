import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Alert, Box, Button, Chip, Snackbar, Typography } from "@mui/material";
import { Highlight, themes } from "prism-react-renderer";
import React, { useState } from "react";

interface CodeBlockProps {
  code: string;
  language: string;
  fileName?: string;
  maxLines?: number;
  showLineNumbers?: boolean;
  copyLabel?: string;
  copiedLabel?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language,
  fileName,
  maxLines = 20,
  showLineNumbers = true,
  copyLabel = "Copy code",
  copiedLabel = "Copied!",
}) => {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const lines = code.split("\n").length;
  const showExpand = lines > maxLines;
  const displayCode =
    showExpand && !expanded
      ? code.split("\n").slice(0, maxLines).join("\n") + "\n..."
      : code;

  const handleCopy = async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      return;
    }

    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Swallow clipboard failures to avoid breaking SSR/SSG
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <Box
      sx={{
        border: "1px solid #e0e0e0",
        borderRadius: 1,
        overflow: "hidden",
        fontFamily: "monospace",
        backgroundColor: "#f8f8f8",
      }}
    >
      {fileName && (
        <Box
          sx={{
            backgroundColor: "#e0e0e0",
            padding: "8px 16px",
            borderBottom: "1px solid #d0d0d0",
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            {fileName}
          </Typography>
        </Box>
      )}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 16px",
          backgroundColor: "#f0f0f0",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Chip
          label={language.toUpperCase()}
          size="small"
          sx={{
            backgroundColor: "#007acc",
            color: "white",
            fontSize: "0.75rem",
          }}
        />
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            size="small"
            onClick={handleCopy}
            sx={{ color: "#666", textTransform: "none", minWidth: "auto" }}
            disabled={typeof navigator === "undefined"}
            aria-label={copied ? "Code copied" : `${copyLabel} to clipboard`}
            title={copyLabel}
            startIcon={<ContentCopyIcon fontSize="small" />}
          >
            {copied ? "Copied" : copyLabel}
          </Button>
          {copied && (
            <Typography variant="caption" sx={{ color: "#007acc" }}>
              Copied!
            </Typography>
          )}
        </Box>
      </Box>
      <Box sx={{ position: "relative" }}>
        <Highlight theme={themes.github} code={displayCode} language={language}>
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              style={{
                ...style,
                margin: 0,
                padding: "16px",
                overflow: "auto",
                fontSize: "14px",
                lineHeight: "1.5",
              }}
              className={className}
            >
              {tokens.map((line, i) => (
                <div
                  key={i}
                  {...getLineProps({ line })}
                  style={{ display: "flex" }}
                >
                  {showLineNumbers && (
                    <span
                      style={{
                        display: "inline-block",
                        width: "40px",
                        textAlign: "right",
                        color: "#999",
                        userSelect: "none",
                        marginRight: "16px",
                      }}
                    >
                      {i + 1}
                    </span>
                  )}
                  <span>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </span>
                </div>
              ))}
            </pre>
          )}
        </Highlight>
        {showExpand && (
          <Box
            sx={{
              textAlign: "center",
              padding: "8px",
              backgroundColor: "#f0f0f0",
            }}
          >
            <Button
              size="small"
              onClick={() => setExpanded(!expanded)}
              endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              sx={{ textTransform: "none" }}
            >
              {expanded ? "Show Less" : "Show More"}
            </Button>
          </Box>
        )}
      </Box>
      <Snackbar
        open={copied}
        autoHideDuration={2000}
        onClose={() => setCopied(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setCopied(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {copiedLabel}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CodeBlock;
