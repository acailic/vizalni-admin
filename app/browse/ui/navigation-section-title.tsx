import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";

export const NavigationSectionTitle = ({
  label,
  backgroundColor,
  icon,
}: {
  label: ReactNode;
  backgroundColor: string;
  icon?: ReactNode;
}) => {
  return (
    <Box
      sx={{
        mb: 2,
        px: 2,
        py: 3,
        borderRadius: "6px",
        backgroundColor,
        borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {icon && <Box sx={{ mr: 1 }}>{icon}</Box>}
        <Typography
          variant="h3"
          component="h2"
          sx={{
            fontWeight: 800,
            letterSpacing: 0.5,
            textTransform: "uppercase",
          }}
        >
          {label}
        </Typography>
      </Box>
    </Box>
  );
};
