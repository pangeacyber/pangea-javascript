import { FilterSharp } from "@mui/icons-material";
import { Stack, Chip } from "@mui/material";
import get from "lodash/get";
import { FilterOptions } from "./FiltersForm";

interface FiltersBarProps<FiltersObj> {
  filters: FiltersObj;
  options: FilterOptions<FiltersObj>;
  onFilterChange: (filter: FiltersObj) => void;
  showFilterChips?: boolean;
}

const FiltersBar = <FiltersObj extends { [key: string]: string }>({
  filters,
  options,
  onFilterChange,
}: FiltersBarProps<FiltersObj>): JSX.Element | null => {
  if (!filters.length) return null;

  return (
    <Stack direction="row" spacing={1}>
      {Object.keys(filters).map((filterKey) => {
        return (
          <Chip
            key={`fitler-chip-${filterKey}`}
            label={`${get(options, filterKey, { label: filterKey }).label}: ${
              filters[filterKey]
            }`}
            onDelete={() => {
              const filters_ = { ...filters };
              delete filters_[filterKey];
              onFilterChange(filters_);
            }}
          />
        );
      })}
    </Stack>
  );
};

export default FiltersBar;
