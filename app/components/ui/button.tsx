import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
} from "@mui/material";
import React from "react";

export interface ButtonProps extends Omit<MuiButtonProps, "size" | "variant"> {
  size?: "xs" | "sm" | "md" | "lg";
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
}

const sizeMap = {
  xs: "small",
  sm: "small",
  md: "medium",
  lg: "large",
} as const;

const variantMap = {
  default: "contained",
  destructive: "contained",
  outline: "outlined",
  secondary: "outlined",
  ghost: "text",
  link: "text",
} as const;

export const Button: React.FC<ButtonProps> = ({
  size = "md",
  variant = "default",
  children,
  sx,
  ...props
}) => {
  const mappedSize = sizeMap[size] || "medium";
  const mappedVariant = variantMap[variant] || "contained";

  const buttonSx = {
    ...(variant === "destructive" && {
      backgroundColor: "error.main",
      "&:hover": {
        backgroundColor: "error.dark",
      },
    }),
    ...(variant === "ghost" && {
      "&:hover": {
        backgroundColor: "action.hover",
      },
    }),
    ...(variant === "link" && {
      textDecoration: "underline",
      "&:hover": {
        backgroundColor: "transparent",
        textDecoration: "underline",
      },
    }),
    ...sx,
  };

  return (
    <MuiButton
      size={mappedSize}
      variant={mappedVariant}
      sx={buttonSx}
      {...props}
    >
      {children}
    </MuiButton>
  );
};
