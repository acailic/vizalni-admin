import { Box, Typography, Tooltip } from "@mui/material";
import { QRCodeSVG } from "qrcode.react";

type QRCodeShareProps = {
  url: string;
  size?: number;
};

export const QRCodeShare = ({ url, size = 128 }: QRCodeShareProps) => {
  return (
    <Tooltip title="Scan to open on mobile">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 2,
          border: 1,
          borderColor: "divider",
          borderRadius: 2,
          bgcolor: "white",
        }}
      >
        <QRCodeSVG value={url} size={size} level="H" />
        <Typography variant="caption" sx={{ mt: 1, color: "text.secondary" }}>
          Scan for mobile
        </Typography>
      </Box>
    </Tooltip>
  );
};
