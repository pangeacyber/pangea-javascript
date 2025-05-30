import { FC, useState, useEffect } from "react";
import get from "lodash/get";
import { Grid, Button, Stack, ChipProps } from "@mui/material";
import { ValueOptions } from "../../../PangeaFields/FieldsForm/types";
import { StringField } from "../../../PangeaFields";

interface FilterOption {
  label: string;
  type?: "string" | "csv" | "date" | "number" | string;

  valueOptions?: ValueOptions[];

  [key: string]: any;
}

export interface FilterOptions<FiltersObj> {
  [key: string]: FilterOption;
}

export interface FilterFormComponentProps<FiltersObj> {
  filters: FiltersObj;
  options: FilterOptions<FiltersObj>;
  onFilterChange: (filter: FiltersObj) => void;
}

export interface FilterFormProps<FiltersObj> {
  filters: FiltersObj;
  options: FilterOptions<FiltersObj>;
  FiltersFormComponent?: FC<FilterFormComponentProps<FiltersObj>>;
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

            const value: any = get(
              values,
              fieldName,
              field.type === "csv" ? [] : ""
            );
            return (
              <Grid
                size={{
                  xs: 6,
                }}
                key={`audit-field-${fieldName}`}
              >
                <StringField
                  value={field.type === "csv" ? value.join(",") : value}
                  onValueChange={(newValue) => {
                    setValues((state) => ({
                      ...state,
                      [fieldName]:
                        field.type === "csv"
                          ? newValue.split(",").map((v: string) => v.trim())
                          : newValue,
                    }));
                  }}
                  label={field.label}
                  LabelProps={{
                    placement: "top",
                  }}
                  FieldProps={{
                    type:
                      field.type === "date"
                        ? "date"
                        : field.type === "number"
                          ? "number"
                          : "text",
                    options: {
                      valueOptions: field.valueOptions,
                    },
                  }}
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
