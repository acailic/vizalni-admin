import { KeyboardArrowDown } from "@mui/icons-material";
import {
  Select as MuiSelect,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  SelectProps as MuiSelectProps,
  OutlinedInput,
  Chip,
  Box,
  InputAdornment,
} from "@mui/material";
import React, { useId } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<MuiSelectProps<string>, "children"> {
  options: SelectOption[];
  label?: string;
  helperText?: string;
  placeholder?: string;
  multiple?: boolean;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  options,
  label,
  helperText,
  placeholder,
  multiple = false,
  className,
  value,
  onChange,
  ...props
}) => {
  const labelId = useId();
  const id = useId();

  return (
    <FormControl className={className} fullWidth>
      {label && <InputLabel id={labelId}>{label}</InputLabel>}
      <MuiSelect
        id={id}
        labelId={labelId}
        value={value}
        onChange={onChange}
        multiple={multiple}
        input={
          <OutlinedInput id={id} label={label} placeholder={placeholder} />
        }
        renderValue={(selected) => {
          if (multiple) {
            const selectedValues = selected as unknown as string[];
            return (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selectedValues.map((value) => {
                  const option = options.find((opt) => opt.value === value);
                  return (
                    <Chip
                      key={value}
                      label={option?.label || value}
                      size="small"
                    />
                  );
                })}
              </Box>
            );
          }

          const selectedValue = selected as string;
          const option = options.find((opt) => opt.value === selectedValue);
          return option?.label || selectedValue;
        }}
        {...props}
      >
        {placeholder && !multiple && (
          <MenuItem value="" disabled>
            <em>{placeholder}</em>
          </MenuItem>
        )}
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

// shadcn/ui style components for compatibility
export const SelectTrigger = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    // @ts-expect-error - OutlinedInput doesn't accept children but we need them for SelectTrigger
    <OutlinedInput
      className={className}
      endAdornment={
        <InputAdornment position="end">
          <KeyboardArrowDown />
        </InputAdornment>
      }
      {...props}
    >
      {children}
    </OutlinedInput>
  );
};

export const SelectValue = ({
  placeholder,
  children,
  ...props
}: {
  placeholder?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLSpanElement>) => {
  return <span {...props}>{children || placeholder}</span>;
};

export const SelectContent = ({
  children,
  ...props
}: {
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) => {
  return <div {...props}>{children}</div>;
};

export const SelectItem = ({
  value,
  children,
  ...props
}: {
  value: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLLIElement>) => {
  return (
    <MenuItem value={value} {...props}>
      {children}
    </MenuItem>
  );
};
