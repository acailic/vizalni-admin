import { Box, Button, Typography } from "@mui/material";

import { ContentWrapper } from "@/components/content-wrapper";
import { Icon } from "@/icons";

type ActionElementProps = {
  headline: string;
  description: string;
  buttonLabel: string;
  buttonUrl: string;
};

export const Actions = ({
  contribute,
  newsletter,
  bugReport,
  featureRequest,
}: {
  contribute: ActionElementProps;
  newsletter: ActionElementProps;
  bugReport: ActionElementProps;
  featureRequest: ActionElementProps;
}) => {
  const actions = [contribute, newsletter, bugReport, featureRequest];

  return (
    <Box sx={{ backgroundColor: "background.paper" }}>
      <ContentWrapper
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, minmax(0, 1fr))",
          },
          gap: 4,
          py: { xs: 10, md: 14, lg: 16 },
        }}
      >
        {actions.map((action, index) => (
          <Action key={action.headline} index={index} {...action} />
        ))}
      </ContentWrapper>
    </Box>
  );
};

const Action = ({
  index,
  headline,
  description,
  buttonLabel,
  buttonUrl,
}: ActionElementProps & { index: number }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-start",
        width: "100%",
        minHeight: 260,
        p: { xs: 4, md: 5 },
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        background:
          "linear-gradient(180deg, rgba(248,250,252,1) 0%, rgba(255,255,255,1) 100%)",
        boxShadow: "0 20px 40px rgba(15, 23, 42, 0.06)",
      }}
    >
      <Box sx={{ mb: 8 }}>
        <Typography
          variant="overline"
          sx={{
            color: "primary.main",
            fontWeight: 700,
            letterSpacing: "0.08em",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </Typography>
        <Typography variant="h2" sx={{ mt: 1.5, mb: 3 }}>
          {headline}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {description}
        </Typography>
      </Box>
      <Button
        href={buttonUrl}
        size="sm"
        endIcon={<Icon name="arrowRight" size={20} />}
        target="_blank"
        rel="noopener noreferrer"
        sx={{ mt: "auto" }}
      >
        {buttonLabel}
      </Button>
    </Box>
  );
};
