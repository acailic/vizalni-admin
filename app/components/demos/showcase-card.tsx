// app/components/demos/showcase-card.tsx
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useState } from "react";

import { Icon } from "@/icons";
import { buildAbsolutePublicUrl } from "@/utils/public-paths";

type ShowcaseCardProps = {
  title: string;
  description: string;
  demoUrl: string;
  embedUrl: string;
  shareUrl: string;
  locale?: "sr" | "sr-Cyrl" | "en";
  onEmbed?: () => void;
  onShare?: () => void;
  thumbnail?: string;
};

export const ShowcaseCard = ({
  title,
  description,
  demoUrl,
  embedUrl,
  shareUrl,
  locale = "en",
  onEmbed,
  onShare,
  thumbnail,
}: ShowcaseCardProps) => {
  const [shareCopied, setShareCopied] = useState(false);
  const isCyrillic = locale === "sr-Cyrl";
  const isSerbian = locale.startsWith("sr");

  const embedLabel = isCyrillic ? "Уградите" : isSerbian ? "Ugradite" : "Embed";
  const shareLabel = shareCopied
    ? isCyrillic
      ? "Копирано"
      : isSerbian
        ? "Kopirano"
        : "Copied"
    : isCyrillic
      ? "Подели"
      : isSerbian
        ? "Podeli"
        : "Share";
  const viewLabel = isCyrillic ? "Погледај" : isSerbian ? "Pogledaj" : "View";

  const handleEmbed = () => {
    if (onEmbed) {
      onEmbed();
      return;
    }
    if (typeof window !== "undefined") {
      window.open(embedUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleShare = async () => {
    if (onShare) {
      onShare();
      return;
    }
    if (typeof window === "undefined") {
      return;
    }

    const resolvedShareUrl = buildAbsolutePublicUrl(
      window.location.origin,
      shareUrl
    );

    if (navigator.share) {
      try {
        await navigator.share({ title, url: resolvedShareUrl });
        return;
      } catch {
        // Fall through to clipboard/open behavior.
      }
    }

    try {
      await navigator.clipboard.writeText(resolvedShareUrl);
      setShareCopied(true);
      window.setTimeout(() => setShareCopied(false), 2000);
    } catch {
      window.open(resolvedShareUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        overflow: "hidden",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
        },
      }}
    >
      {/* Preview area */}
      <Box
        sx={{
          height: 200,
          background:
            "linear-gradient(135deg, rgba(12,64,118,0.08) 0%, rgba(14,165,233,0.16) 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: thumbnail ? `url(${thumbnail})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {!thumbnail && (
          <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1.25 }}>
            <Box
              sx={{
                width: 14,
                height: 42,
                borderRadius: 2,
                bgcolor: "#0c4076",
              }}
            />
            <Box
              sx={{
                width: 14,
                height: 68,
                borderRadius: 2,
                bgcolor: "#0ea5e9",
              }}
            />
            <Box
              sx={{
                width: 14,
                height: 54,
                borderRadius: 2,
                bgcolor: "#38bdf8",
              }}
            />
            <Box sx={{ ml: 1, color: "#0c4076" }}>
              <Icon name="chartBar" size={26} />
            </Box>
          </Box>
        )}
      </Box>

      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 2 }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
          {description}
        </Typography>

        {/* Action buttons */}
        <Stack direction="row" spacing={1} sx={{ mt: "auto" }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<Icon name="embed" size={16} />}
            onClick={handleEmbed}
            aria-label={`${embedLabel} ${title}`}
            sx={{ textTransform: "none" }}
          >
            {embedLabel}
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<Icon name="share" size={16} />}
            onClick={handleShare}
            aria-label={`${shareLabel} ${title}`}
            sx={{ textTransform: "none" }}
          >
            {shareLabel}
          </Button>
          <Button
            size="small"
            variant="contained"
            component={Link}
            href={demoUrl}
            sx={{ textTransform: "none", ml: "auto" }}
          >
            {viewLabel}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};
