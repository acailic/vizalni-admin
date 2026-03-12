// app/components/demos/sticky-share-bar.tsx
import { Box, Button, Slide, useScrollTrigger } from "@mui/material";

import { Icon } from "@/icons";

type StickyShareBarProps = {
  chartTitle: string;
  shareUrl: string;
  onShare: () => void;
  onEmbed: () => void;
};

export const StickyShareBar = ({
  chartTitle: _chartTitle,
  shareUrl: _shareUrl,
  onShare,
  onEmbed,
}: StickyShareBarProps) => {
  const trigger = useScrollTrigger({ threshold: 300 });

  return (
    <Slide appear={false} direction="up" in={trigger}>
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: "background.paper",
          borderTop: 1,
          borderColor: "divider",
          py: 2,
          px: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          boxShadow: "0 -4px 20px rgba(0,0,0,0.1)",
          zIndex: 1000,
        }}
      >
        <Button
          variant="outlined"
          startIcon={<Icon name="share" size={18} />}
          onClick={onShare}
        >
          Share
        </Button>
        <Button
          variant="contained"
          startIcon={<Icon name="embed" size={18} />}
          onClick={onEmbed}
        >
          Embed this chart
        </Button>
      </Box>
    </Slide>
  );
};
