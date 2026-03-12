import { Box } from "@mui/material";
import React from "react";

const SkipLink = () => {
  const handleSkip = (e: React.MouseEvent) => {
    e.preventDefault();
    const main = document.querySelector("#main-content") as HTMLElement;
    if (main) {
      main.focus();
      main.scrollIntoView();
    }
  };

  return (
    <Box
      component="a"
      href="#main-content"
      onClick={handleSkip}
      sx={{
        position: "absolute",
        top: "-40px",
        left: 6,
        backgroundColor: "primary.main",
        color: "white",
        padding: "8px",
        textDecoration: "none",
        borderRadius: 1,
        zIndex: 9999,
        "&:focus": {
          top: 6,
        },
      }}
    >
      Skip to main content
    </Box>
  );
};

export default SkipLink;
