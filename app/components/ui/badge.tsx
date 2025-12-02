import { styled } from "@mui/material/styles";
import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
  style?: React.CSSProperties;
}

const StyledBadge = styled("span")<{ variant: string }>(({ theme, variant }) => {
  const baseStyles = {
    display: "inline-flex",
    alignItems: "center",
    padding: "0.25rem 0.5rem",
    borderRadius: theme.shape.borderRadius,
    fontSize: "0.75rem",
    fontWeight: 500,
    textAlign: "center",
    whiteSpace: "nowrap",
    verticalAlign: "middle",
  };

  switch (variant) {
    case "secondary":
      return {
        ...baseStyles,
        backgroundColor: theme.palette.grey[200],
        color: theme.palette.text.secondary,
      };
    case "destructive":
      return {
        ...baseStyles,
        backgroundColor: theme.palette.error.main,
        color: theme.palette.error.contrastText,
      };
    case "outline":
      return {
        ...baseStyles,
        backgroundColor: "transparent",
        color: theme.palette.text.primary,
        border: `1px solid ${theme.palette.divider}`,
      };
    default:
      return {
        ...baseStyles,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
      };
  }
});

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  className,
  style
}) => {
  return (
    <StyledBadge
      variant={variant}
      className={className}
      style={style}
    >
      {children}
    </StyledBadge>
  );
};