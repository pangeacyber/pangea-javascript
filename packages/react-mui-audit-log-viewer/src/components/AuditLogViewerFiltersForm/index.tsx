import { FC, useState, useEffect, useMemo, Fragment } from "react";
import { Grid2 as Grid, Button, Stack } from "@mui/material";
import { FilterOptions } from "@pangeacyber/react-mui-shared";
import JoinDivider, { RemoveButton } from "./JoinDivider";

import AddIcon from "@mui/icons-material/Add";
import FilterField, { AuditFieldFilter } from "./FilterField";
import JoinChip from "./JoinChip";
import { useAuditContext } from "../../hooks/context";
import { getAppliedFiltersQuery } from "./utils";

interface AuditQueryFilters {
  fields: AuditFieldFilter[];
}

interface Props<FiltersObj = AuditQueryFilters> {
  filters: FiltersObj;
  options: FilterOptions<FiltersObj>;
  onFilterChange: (filter: FiltersObj) => void;
}

const AuditLogViewerFiltersForm: FC<Props> = ({
  filters,
  options,
  onFilterChange,
}) => {
  const { query, setQuery } = useAuditContext();

  const [values, setValues] = useState<AuditQueryFilters>({
    fields: [],
  });

  const fields = useMemo(() => {
    if (!values?.fields?.length) {
      const options_ = Object.keys(options);
      return [
        {
          id: !!options_?.length ? options_[0] : "",
          operator: "=",
          value: "",
        },
      ] as AuditFieldFilter[];
    }

    return values.fields;
  }, [values, options]);

  const handleAddCondition = () => {
    const options_ = Object.keys(options);
    setValues({
      fields: [
        ...fields,
        {
          id: !!options_?.length ? options_[0] : "",
          operator: "=",
          value: "",
        },
      ],
    });
  };

  const handleRemoveCondition = (idx: number) => {
    const updates = [...fields];
    if (idx > -1 && idx < updates.length) {
      updates.splice(idx, 1);
    }

    return setValues({
      fields: updates,
    });
  };

  const handleUpdate = (field: AuditFieldFilter, idx: number) => {
    const updates = [...fields];

    if (idx >= 0 && idx < updates.length) {
      updates[idx] = field;
    }

    return setValues({
      fields: updates,
    });
  };

  const handleSubmit = () => {
    setQuery(getAppliedFiltersQuery(query, values.fields));
    onFilterChange(filters);
  };

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
        <Stack width="100%" alignItems="center">
          {fields.map((f, idx) => {
            return (
              <Fragment key={`join-logic-block-${idx}`}>
                <Stack
                  direction="row"
                  width="100%"
                  justifyContent="space-between"
                >
                  <FilterField
                    value={f}
                    onValueChange={(f) => handleUpdate(f, idx)}
                    options={options}
                  />
                  {idx !== 0 && (
                    <RemoveButton onClick={() => handleRemoveCondition(idx)} />
                  )}
                </Stack>
                {idx < (fields?.length ?? 0) - 1 && (
                  <>
                    <JoinChip label={"OR"} key={`condition-join-${idx}`} />
                  </>
                )}
              </Fragment>
            );
          })}
          {!!fields?.length && <JoinDivider />}
          <Button
            variant="contained"
            startIcon={<AddIcon fontSize="small" />}
            sx={{ backgroundColor: (theme) => theme.palette.secondary.main }}
            onClick={handleAddCondition}
          >
            OR
          </Button>
        </Stack>
        <Button
          color="primary"
          variant="contained"
          type="submit"
          sx={{
            marginLeft: "auto!important",
            width: "fit-content",
          }}
        >
          Apply Filters
        </Button>
      </Stack>
    </form>
  );
};

export default AuditLogViewerFiltersForm;
