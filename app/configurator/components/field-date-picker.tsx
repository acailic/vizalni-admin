import { t } from "@lingui/macro";
import { Box, IconButton } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { timeFormat } from "d3-time-format";
import { ChangeEvent, ReactNode, useCallback } from "react";

import { Flex } from "@/components/flex";
import { Label } from "@/components/form";
import { FIELD_VALUE_NONE } from "@/configurator/constants";
import { TimeUnit } from "@/graphql/resolver-types";
import { Icon } from "@/icons";

import type { DatePickerProps } from "@mui/x-date-pickers/DatePicker";
import type { DateView } from "@mui/x-date-pickers/models";

export type DatePickerFieldProps = {
  name: string;
  label?: ReactNode;
  value: Date | null;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  isDateDisabled: (date: Date) => boolean;
  sideControls?: ReactNode;
  timeUnit?: DatePickerTimeUnit;
  dateFormat?: (d: Date) => string;
  parseDate: (s: string) => Date | null;
  showClearButton?: boolean;
} & Omit<
  DatePickerProps<Date>,
  "value" | "onChange" | "shouldDisableDate" | "format" | "slots" | "slotProps"
>;

export const DatePickerField = ({
  name,
  label,
  value,
  onChange,
  disabled,
  isDateDisabled,
  sideControls,
  timeUnit = TimeUnit.Day,
  dateFormat = timeFormat("%Y-%m-%d"),
  parseDate,
  showClearButton,
  ...rest
}: DatePickerFieldProps) => {
  const handleChange = useCallback(
    (date: Date | null) => {
      if (!date || isDateDisabled(date)) {
        return;
      }

      const e = {
        target: {
          value: dateFormat(date),
        },
      } as ChangeEvent<HTMLSelectElement>;

      onChange(e);
    },
    [isDateDisabled, onChange, dateFormat]
  );

  const handleNoFilter = useCallback(() => {
    const e = {
      target: {
        value: FIELD_VALUE_NONE,
      },
    } as ChangeEvent<HTMLSelectElement>;

    onChange(e);
  }, [onChange]);

  const dateLimitProps = getDateRenderProps(timeUnit, isDateDisabled);

  return (
    <Flex sx={{ flexDirection: "column", gap: 1 }}>
      {label && name && <Label htmlFor={name}>{label}</Label>}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <DatePicker<Date>
          {...rest}
          {...dateLimitProps}
          slots={{
            openPickerIcon: () => <Icon name="calendar" />,
            day: (dayProps) => (
              <PickersDay
                {...dayProps}
                selected={value?.getTime() === dayProps.day.getTime()}
              />
            ),
          }}
          slotProps={{
            popper: {
              sx: {
                "& .MuiPaper-root": {
                  elevation: 4,
                },
              },
            },
            textField: {
              hiddenLabel: true,
              size: "small",
              inputProps: {
                value: value
                  ? dateFormat(value)
                  : t({
                      id: "controls.dimensionvalue.select",
                      message: "Select filter",
                    }),
              },
              onChange: (e) => {
                handleChange(parseDate(e.target.value));
              },
              sx: {
                width: "100%",

                "& input": {
                  height: 40,
                  typography: "h6",
                },

                "& .MuiIconButton-root": {
                  p: 1,
                },

                "& .MuiOutlinedInput-input": {
                  py: 0,
                  pl: 4,
                },

                "& svg": {
                  color: "text.primary",
                },
              },
              InputProps: {
                endAdornment: (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {showClearButton && value && (
                      <IconButton
                        size="small"
                        onClick={handleNoFilter}
                        sx={{
                          p: 1,
                          mr: -0.5,
                        }}
                      >
                        <Icon name="close" />
                      </IconButton>
                    )}
                  </Box>
                ),
              },
            },
          }}
          format={getInputFormat(timeUnit)}
          views={getViews(timeUnit)}
          value={value}
          onAccept={handleChange}
          onChange={(date) => {
            if (date) {
              handleChange(date);
            }
          }}
          disabled={disabled}
        />
        {sideControls}
      </Box>
    </Flex>
  );
};

export type DatePickerTimeUnit =
  | TimeUnit.Day
  | TimeUnit.Week
  | TimeUnit.Month
  | TimeUnit.Year;

export const canRenderDatePickerField = (
  timeUnit: TimeUnit
): timeUnit is DatePickerTimeUnit => {
  return [TimeUnit.Day, TimeUnit.Week, TimeUnit.Month, TimeUnit.Year].includes(
    timeUnit
  );
};

const getDateRenderProps = (
  timeUnit: DatePickerTimeUnit,
  isDateDisabled: (d: any) => boolean
): any => {
  switch (timeUnit) {
    case TimeUnit.Day:
    case TimeUnit.Week:
    case TimeUnit.Month:
      return { shouldDisableDate: isDateDisabled };
    case TimeUnit.Year:
      return { shouldDisableYear: isDateDisabled };
    default:
      const _exhaustiveCheck: never = timeUnit as never;
      return _exhaustiveCheck;
  }
};

const getInputFormat = (timeUnit: DatePickerTimeUnit): string => {
  switch (timeUnit) {
    case TimeUnit.Day:
    case TimeUnit.Week:
      return "dd.MM.yyyy";
    case TimeUnit.Month:
      return "MM.yyyy";
    case TimeUnit.Year:
      return "yyyy";
    default:
      const _exhaustiveCheck: never = timeUnit;
      return _exhaustiveCheck;
  }
};

const getViews = (timeUnit: DatePickerTimeUnit): DateView[] => {
  switch (timeUnit) {
    case TimeUnit.Day:
    case TimeUnit.Week:
      return ["year", "month", "day"];
    case TimeUnit.Month:
      return ["year", "month"];
    case TimeUnit.Year:
      return ["year"];
    default:
      const _exhaustiveCheck: never = timeUnit;
      return _exhaustiveCheck;
  }
};
