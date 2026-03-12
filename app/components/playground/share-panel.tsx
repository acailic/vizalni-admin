import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import {
  Alert,
  Box,
  Button,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useCallback, useState } from "react";

interface SharePanelProps {
  getShareUrl: () => string;
  getEmbedCode: () => string;
}

/**
 * SharePanel component for the interactive playground.
 * Provides share URL, embed code, and download functionality.
 */
export const SharePanel = ({ getShareUrl, getEmbedCode }: SharePanelProps) => {
  const theme = useTheme();
  const [linkCopied, setLinkCopied] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);

  const shareUrl = getShareUrl();
  const embedCode = getEmbedCode();

  /**
   * Handle copying share URL to clipboard
   */
  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setLinkCopied(true);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  }, [shareUrl]);

  /**
   * Handle copying embed code to clipboard
   */
  const handleCopyEmbed = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setEmbedCopied(true);
    } catch (err) {
      console.error("Failed to copy embed code:", err);
    }
  }, [embedCode]);

  /**
   * Close the link copied snackbar
   */
  const handleLinkSnackbarClose = useCallback(() => {
    setLinkCopied(false);
  }, []);

  /**
   * Close the embed copied snackbar
   */
  const handleEmbedSnackbarClose = useCallback(() => {
    setEmbedCopied(false);
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {/* Share URL Section */}
      <Box>
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.text.secondary,
            fontWeight: 500,
            mb: 1,
            display: "block",
          }}
        >
          Share URL
        </Typography>
        <TextField
          fullWidth
          size="small"
          value={shareUrl}
          InputProps={{
            readOnly: true,
          }}
          sx={{
            mb: 1.5,
            "& .MuiInputBase-input": {
              fontFamily: "monospace",
              fontSize: "0.875rem",
            },
          }}
          inputProps={{
            "aria-label": "Shareable URL",
          }}
        />
        <Button
          variant="outlined"
          size="small"
          startIcon={<ContentCopyIcon />}
          onClick={handleCopyLink}
          sx={{
            textTransform: "none",
          }}
        >
          Copy Link
        </Button>
      </Box>

      {/* Embed Code Section */}
      <Box>
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.text.secondary,
            fontWeight: 500,
            mb: 1,
            display: "block",
          }}
        >
          Embed Code
        </Typography>
        <TextField
          fullWidth
          multiline
          minRows={3}
          maxRows={6}
          value={embedCode}
          InputProps={{
            readOnly: true,
          }}
          sx={{
            mb: 1.5,
            "& .MuiInputBase-root": {
              fontFamily: "monospace",
              fontSize: "0.75rem",
            },
          }}
          inputProps={{
            "aria-label": "Iframe embed code",
          }}
        />
        <Button
          variant="outlined"
          size="small"
          startIcon={<ContentCopyIcon />}
          onClick={handleCopyEmbed}
          sx={{
            textTransform: "none",
          }}
        >
          Copy Embed Code
        </Button>
      </Box>

      {/* Download Section */}
      <Box>
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.text.secondary,
            fontWeight: 500,
            mb: 1,
            display: "block",
          }}
        >
          Download
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="outlined"
            size="small"
            startIcon={<DownloadIcon />}
            disabled
            sx={{
              textTransform: "none",
            }}
          >
            Download as PNG
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<DownloadIcon />}
            disabled
            sx={{
              textTransform: "none",
            }}
          >
            Download as SVG
          </Button>
        </Box>
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.text.disabled,
            mt: 0.5,
            display: "block",
          }}
        >
          Coming soon
        </Typography>
      </Box>

      {/* Copy Link Confirmation Snackbar */}
      <Snackbar
        open={linkCopied}
        autoHideDuration={2000}
        onClose={handleLinkSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="success"
          sx={{ width: "100%" }}
          onClose={handleLinkSnackbarClose}
        >
          Link copied to clipboard!
        </Alert>
      </Snackbar>

      {/* Copy Embed Code Confirmation Snackbar */}
      <Snackbar
        open={embedCopied}
        autoHideDuration={2000}
        onClose={handleEmbedSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="success"
          sx={{ width: "100%" }}
          onClose={handleEmbedSnackbarClose}
        >
          Embed code copied to clipboard!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SharePanel;
