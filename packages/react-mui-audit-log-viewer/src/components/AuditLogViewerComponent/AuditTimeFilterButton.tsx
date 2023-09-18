import { FC } from "react";
import pick from "lodash/pick";

import {
  FilterFormProps,
  TimeRangeSelect,
} from "@pangeacyber/react-mui-shared";
import { AuditQuery } from "../../types/query";

const AuditTimeFilterButton: FC<FilterFormProps<AuditQuery>> = ({
  filters,
  onFilterChange,
}) => {
  return (
    <TimeRangeSelect
      value={pick(filters, ["after", "before", "since", "active"]) ?? {}}
      setValue={(rangeObj) => onFilterChange({ ...filters, ...rangeObj })}
      ButtonProps={{
        className: "PangeaInput-root",
        sx: {
          borderLeft: "none",
          borderBottomLeftRadius: "0!important",
          borderTopLeftRadius: "0!important",
          maxHeight: "42px",
        },
      }}
    />
  );
};

export default AuditTimeFilterButton;
