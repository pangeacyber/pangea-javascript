import { Stack, Chip, ChipProps } from "@mui/material";
import get from "lodash/get";
import { FilterOptions } from "./FiltersForm";

interface FiltersBarProps<FiltersObj> {
  filters: FiltersObj;
  options: FilterOptions<FiltersObj>;
  onFilterChange: (filter: FiltersObj) => void;
  showFilterChips?: boolean;
  ChipProps?: Partial<ChipProps>;
}

const FiltersBar = <FiltersObj extends { [key: string]: string }>({
  filters,
  options,
  onFilterChange,
  ChipProps = {},
}: FiltersBarProps<FiltersObj>): JSX.Element | null => {
  if (!filters || !Object.keys(filters).length) return null;

  return (
    <Stack direction="row" spacing={1}>
      {Object.keys(filters)
        .filter((fk) => !!options[fk])
        .map((filterKey) => {
          return (
            <Chip
              key={`fitler-chip-${filterKey}`}
              label={`${get(options, filterKey, { label: filterKey }).label}: ${
                filters[filterKey]
              }`}
              size="small"
              onDelete={() => {
                const filters_ = { ...filters };
                delete filters_[filterKey];
                onFilterChange(filters_);
              }}
              {...ChipProps}
            />
          );
        })}
    </Stack>
  );
};

export default FiltersBar;
