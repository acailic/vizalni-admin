import {
  Palette as ThemeIcon,
  Business as OrganizationIcon,
  Straighten as DimensionIcon,
  Lightbulb as ConceptIcon,
  Drafts as DraftIcon,
} from "@mui/icons-material";
import { BoxProps, styled, Typography, TypographyProps } from "@mui/material";
import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import clsx from "clsx";
import { forwardRef, ReactNode } from "react";

type TagType =
  | "draft"
  | "theme"
  | "organization"
  | "termset"
  | "dimension"
  | "unknown";

type TagSize = "small" | "medium" | "large";

const TagTypography = styled(Typography)<{ size: TagSize }>(({
  theme,
  size,
}) => {
  const sizeStyles = {
    small: {
      padding: `${theme.spacing(0.5)} ${theme.spacing(1)}`,
      borderRadius: "12px",
      minHeight: 20,
    },
    medium: {
      padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
      borderRadius: "16px",
      minHeight: 24,
    },
    large: {
      padding: `${theme.spacing(1.5)} ${theme.spacing(3)}`,
      borderRadius: "20px",
      minHeight: 32,
    },
  };
  return {
    display: "inline-flex",
    alignItems: "center",
    width: "fit-content",
    border: `1px solid ${theme.palette.grey[300]}`,
    transition: "all 0.2s ease",
    ...sizeStyles[size],
  };
});

const useStyles = makeStyles((theme: Theme) => ({
  themeType: {
    backgroundColor: "#e8f5e8",
    color: "#2e7d32",
  },
  organizationType: {
    backgroundColor: "#e3f2fd",
    color: "#1565c0",
  },
  termsetType: {
    backgroundColor: "#f3e5f5",
    color: "#7b1fa2",
  },
  unknownType: {
    backgroundColor: "#f5f5f5",
    color: "#616161",
  },
  dimensionType: {
    backgroundColor: "#fff3e0",
    color: "#ef6c00",
  },
  draftType: {
    backgroundColor: "#ffebee",
    color: "#c62828",
  },
  clickable: {
    cursor: "pointer",
    "&:hover": {
      boxShadow: theme.shadows[4],
      transform: "scale(1.05)",
    },
    "&:focus": {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: 2,
    },
  },
}));

export const Tag = forwardRef<
  HTMLParagraphElement,
  {
    children: ReactNode;
    type?: TagType;
    size?: TagSize;
  } & TypographyProps & {
      component?: BoxProps["component"];
    }
>(({ children, type = "unknown", size = "medium", ...props }, ref) => {
  const classes = useStyles();

  const renderIcon = () => {
    switch (type) {
      case "theme":
        return <ThemeIcon fontSize="small" sx={{ mr: 0.5 }} />;
      case "organization":
        return <OrganizationIcon fontSize="small" sx={{ mr: 0.5 }} />;
      case "dimension":
        return <DimensionIcon fontSize="small" sx={{ mr: 0.5 }} />;
      case "termset":
        return <ConceptIcon fontSize="small" sx={{ mr: 0.5 }} />;
      case "draft":
        return <DraftIcon fontSize="small" sx={{ mr: 0.5 }} />;
      default:
        return null;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === " ") && props.onClick) {
      e.preventDefault();
      props.onClick(e as any);
    }
  };

  return (
    <TagTypography
      ref={ref}
      variant={size === "large" ? "body2" : "caption"}
      size={size}
      {...props}
      className={clsx(
        props.className,
        classes[`${type}Type` as const],
        props.onClick ? classes.clickable : null
      )}
      aria-label={`Tag type: ${type}`}
      role={props.onClick ? "button" : undefined}
      tabIndex={props.onClick ? 0 : undefined}
      onKeyDown={handleKeyDown}
    >
      {renderIcon()}
      {children}
    </TagTypography>
  );
});
