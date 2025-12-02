import { CalendarToday as CalendarTodayIcon } from "@mui/icons-material";
import { Tooltip, Typography } from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import { useMemo } from "react";

import { useFormatDate } from "@/formatters";

export const DateFormat = ({ date }: { date: string }) => {
  const formatter = useFormatDate();
  const formatted = useMemo(() => formatter(date), [formatter, date]);
  const relative = useMemo(
    () => formatDistanceToNow(new Date(date), { addSuffix: true }),
    [date]
  );
  const dateObj = new Date(date);

  return (
    <Tooltip title={formatted}>
      <Typography
        component="time"
        dateTime={dateObj.toISOString()}
        sx={{ display: "flex", alignItems: "center", color: "text.secondary" }}
      >
        <CalendarTodayIcon sx={{ mr: 0.5, fontSize: "1rem" }} />
        {relative}
      </Typography>
    </Tooltip>
  );
};
