import {
  Card as MuiCard,
  CardContent as MuiCardContent,
  CardHeader as MuiCardHeader,
  CardProps as MuiCardProps,
  CardContentProps as MuiCardContentProps,
  CardHeaderProps as MuiCardHeaderProps,
  Typography,
} from "@mui/material";
import React from "react";

export interface CardProps extends MuiCardProps {
  children?: React.ReactNode;
}

export interface CardContentProps extends MuiCardContentProps {
  children?: React.ReactNode;
}

export interface CardHeaderProps extends MuiCardHeaderProps {
  title?: React.ReactNode;
  subheader?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  ...props
}) => {
  return (
    <MuiCard
      variant="outlined"
      {...props}
    >
      {children}
    </MuiCard>
  );
};

export const CardContent: React.FC<CardContentProps> = ({
  children,
  ...props
}) => {
  return (
    <MuiCardContent {...props}>
      {children}
    </MuiCardContent>
  );
};

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subheader,
  children,
  ...props
}) => {
  return (
    <MuiCardHeader
      title={
        title && (
          <Typography variant="h6" component="h2">
            {title}
          </Typography>
        )
      }
      subheader={subheader}
      {...props}
    >
      {children}
    </MuiCardHeader>
  );
};

export const CardTitle: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <Typography
      variant="h6"
      component="h3"
      className={className}
      sx={{ fontWeight: 600 }}
    >
      {children}
    </Typography>
  );
};