import { Typography } from "@mui/material";
import { PDG } from "@pangeacyber/react-mui-shared";
import { FC } from "react";

import DateTimeFilter from "./DateTimeFilter";

const DateTimeFilterCell: FC<any> = (params) => {
  const { value, field } = params;

  const date = new Date(value);
  if (date.toString() === "Invalid Date") {
    return <Typography variant="body2">Never</Typography>;
  }

  return (
    <DateTimeFilter value={value} field={field}>
      <Typography variant="body2">
        {date.toLocaleString(undefined, {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: undefined,
        })}
      </Typography>
    </DateTimeFilter>
  );
};

export default DateTimeFilterCell;
