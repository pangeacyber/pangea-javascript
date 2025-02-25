import { FC, useMemo } from "react";
import pick from "lodash/pick";

import { useTheme } from "@mui/material/styles";
import {
  FilterFormProps,
  getDisplayDateRange,
  getHalfRelativeDateRange,
  getRelativeDate,
  getRelativeDateRange,
  RelativeRange,
  TimeRangeSelect,
} from "@pangeacyber/react-mui-shared";
import { AuditQuery } from "../../types/query";
import { useAuditContext } from "../../hooks/context";
import { Alert, Typography } from "@mui/material";

export interface TimeRangeObject {
  after?: string;
  before?: string;
  since?: string;

  active?: "after" | "before" | "between" | "since";
}

const getTimeRangeObjectDate = (value: TimeRangeObject) => {
  if (value?.active === "since") {
    return getRelativeDate(value?.since ?? "");
  }

  if (value?.active === "between") {
    return new Date(value?.after ?? "");
  }

  if (value?.active === "after") {
    return new Date(value.after ?? "");
  }

  if (value?.active === "before") {
    return new Date(value?.before ?? "");
  }

  return new Date();
};

export const AuditTimeWarning: FC<{
  value: TimeRangeObject;
  setValue: (value: TimeRangeObject) => void;
}> = ({ value, setValue }) => {
  const { filterOptions } = useAuditContext();

  const warning = useMemo(() => {
    const filterDate = getTimeRangeObjectDate(value);
    if (!!filterOptions?.hotStorageRange) {
      const hotStorageDate = getRelativeDate(filterOptions.hotStorageRange);
      if (hotStorageDate.getTime() > filterDate.getTime()) {
        // FIXME: Need info icon?
        return `Current time range exceeds optimal hot storage search window of the last ${getDisplayDateRange(filterOptions.hotStorageRange)}.`;
      }
    }

    return "";
  }, [value, filterOptions?.hotStorageRange]);

  if (!warning) return null;

  return (
    <Alert severity="warning">
      <Typography variant="body2">{warning}</Typography>
    </Alert>
  );
};

const AuditTimeFilterButton: FC<FilterFormProps<AuditQuery>> = ({
  filters,
  onFilterChange,
}) => {
  const { filterOptions } = useAuditContext();
  const theme = useTheme();

  const quickTimeRanges = useMemo(() => {
    if (!!filterOptions?.quickTimeRanges) {
      return filterOptions.quickTimeRanges;
    }

    if (!!filterOptions?.hotStorageRange) {
      const { amount, relativeRange } = getRelativeDateRange(
        filterOptions.hotStorageRange
      );
      if (!amount) {
        return undefined;
      }

      const ranges = ["1day"];
      const half = getHalfRelativeDateRange(filterOptions.hotStorageRange);
      if (
        !!half.amount &&
        !(half.amount === 1 && half.relativeRange === RelativeRange.Day)
      ) {
        ranges.push(`${half.amount}${half.relativeRange}`);
      }
      ranges.push(filterOptions.hotStorageRange);

      // Dynamic warm storage ranges
      return ranges;
    }

    return undefined;
  }, [filterOptions?.hotStorageRange, filterOptions?.quickTimeRanges]);

  const timeRangeObject = useMemo(() => {
    return pick(filters, ["after", "before", "since", "active"]) ?? {};
  }, [filters]);

  return (
    <TimeRangeSelect
      value={timeRangeObject}
      setValue={(rangeObj) => onFilterChange({ ...filters, ...rangeObj })}
      quickTimeRanges={quickTimeRanges}
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
      EndAdornment={AuditTimeWarning}
    />
  );
};

export default AuditTimeFilterButton;
