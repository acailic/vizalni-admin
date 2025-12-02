import {
  TabContext as MuiTabContext,
  TabList as MuiTabList,
  TabPanel as MuiTabPanel,
} from "@mui/lab";
import {
  Tab as MuiTab,
  TabProps as MuiTabProps,
  Box,
} from "@mui/material";
import React from "react";

export interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export interface TabsTriggerProps extends Omit<MuiTabProps, "value"> {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  value,
  onValueChange,
  children,
  className,
}) => {
  return (
    <MuiTabContext value={value}>
      <Box className={className}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { onValueChange } as any);
          }
          return child;
        })}
      </Box>
    </MuiTabContext>
  );
};

export const TabsList: React.FC<TabsListProps & { onValueChange?: (value: string) => void }> = ({
  children,
  onValueChange,
  className,
}) => {
  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  // Extract the active value from context or find it from children
  const activeValue = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && (child as any).props?.value
  ) as any;

  return (
    <MuiTabList
      onChange={handleChange}
      className={className}
      value={activeValue?.props?.value || ""}
    >
      {children}
    </MuiTabList>
  );
};

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  children,
  className,
  ...props
}) => {
  return (
    <MuiTab
      value={value}
      label={children}
      className={className}
      {...props}
    />
  );
};

export const TabsContent: React.FC<TabsContentProps> = ({
  value,
  children,
  className,
}) => {
  return (
    <MuiTabPanel
      value={value}
      className={className}
      sx={{ padding: 0 }}
    >
      {children}
    </MuiTabPanel>
  );
};