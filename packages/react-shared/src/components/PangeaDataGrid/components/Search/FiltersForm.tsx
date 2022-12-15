import { FC, useState, useEffect } from "react";
import get from "lodash/get";
import { Grid, TextField, Button, Stack, ChipProps } from "@mui/material";

interface FilterOption {
  label: string;
  type?: "string";
  includeInQuery?: boolean;
}

export interface FilterOptions<FiltersObj> {
  [key: string]: FilterOption;
}

export interface FilterFormProps<FiltersObj> {
  filters: FiltersObj;
  options: FilterOptions<FiltersObj>;
  onFilterChange: (filter: FiltersObj) => void;
  showFilterChips?: boolean;
  ChipProps?: ChipProps;
}

const FiltersForm = <FiltersObj extends { [key: string]: string }>({
  filters,
  options,
  onFilterChange,
}: FilterFormProps<FiltersObj>): JSX.Element => {
  const [values, setValues] = useState<FiltersObj>(filters || {});

  const handleSubmit = () => {
    onFilterChange(values);
  };

  useEffect(() => {
    if (filters) setValues(filters);
  }, [filters]);

  return (
    <form
      onSubmit={(event) => {
        event.stopPropagation();
        event.preventDefault();
        handleSubmit();
      }}
      style={{ height: "100%" }}
    >
      <Stack spacing={1}>
        <Grid container spacing={1}>
          {Object.keys(options).map((fieldName) => {
            const field = options[fieldName];

            return (
              <Grid xs={6} item key={`audit-field-${fieldName}`}>
                <TextField
                  value={get(values, fieldName, "")}
                  onChange={(event) => {
                    const newValue = event.target.value;
                    setValues((state) => ({
                      ...state,
                      [fieldName]: newValue,
                    }));
                  }}
                  label={field.label}
                  variant="outlined"
                  size="small"
                  sx={{
                    width: "100%",
                  }}
                />
              </Grid>
            );
          })}
        </Grid>
        <Button
          color="primary"
          variant="contained"
          type="submit"
          sx={{
            marginLeft: "auto!important",
            width: "fit-content",
          }}
        >
          Search
        </Button>
      </Stack>
    </form>
  );
};

export default FiltersForm;
