import { FC } from "react";
import pick from "lodash/pick";

import { useTheme } from "@mui/material/styles";
import {
  FilterFormProps,
  TimeRangeSelect,
} from "@pangeacyber/react-mui-shared";
import { AuditQuery } from "../../types/query";

const AuditTimeFilterButton: FC<FilterFormProps<AuditQuery>> = ({
  filters,
  onFilterChange,
}) => {
  const theme = useTheme();
  return (
    <TimeRangeSelect
      value={pick(filters, ["after", "before", "since", "active"]) ?? {}}
      setValue={(rangeObj) => onFilterChange({ ...filters, ...rangeObj })}
      ButtonProps={{
        className: "PangeaInput-root",
        sx: {
          borderLeft: "none",
          borderLeftStyle: "solid",
          borderLeftWidth: 1,
          borderLeftColor: theme.palette.secondary.dark,
          borderBottomLeftRadius: "0!important",
          borderTopLeftRadius: "0!important",
          borderColor: theme.palette.secondary.dark,
          ":hover": {
            borderColor: theme.palette.secondary.contrastText,
            borderLeftColor: theme.palette.secondary.contrastText,
            borderLeft: "none",
            borderLeftStyle: "solid",
            borderLeftWidth: 1,
          },
          ":active": {
            borderLeft: "none",
            borderLeftStyle: "solid",
            borderLeftWidth: 1,
            borderLeftColor: theme.palette.secondary.dark,
          },
        },
      }}
    />
  );
};

export default AuditTimeFilterButton;
