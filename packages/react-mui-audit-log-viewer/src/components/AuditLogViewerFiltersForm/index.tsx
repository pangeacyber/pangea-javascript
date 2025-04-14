import { FC, useState, useMemo, Fragment } from "react";
import {
  Grid2 as Grid,
  Button,
  Stack,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { lighten } from "@mui/material/styles";
import { FilterOptions } from "@pangeacyber/react-mui-shared";
import JoinDivider, { RemoveButton } from "./JoinDivider";

import AddIcon from "@mui/icons-material/Add";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

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

  const [operand, setOperand] = useState("OR");
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

  const isValid = useMemo(() => {
    return !!fields.filter(
      (filter) => !!filter.id && !!filter.operator && !!filter.value
    ).length;
  }, [fields]);

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
    setQuery(getAppliedFiltersQuery(query, values.fields, operand));

    const updated: any = {};
    const timeKeys = ["since", "before", "after", "active"];

    // Filter component directly updates the query, remove filters from query object
    Object.keys(filters).forEach((key) => {
      if (timeKeys.indexOf(key) !== -1) {
        // @ts-ignore
        updated[key] = filters[key];
      }
    });

    onFilterChange(updated);
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
                    <JoinChip
                      value={operand}
                      onValueChange={setOperand}
                      key={`condition-join-${idx}`}
                    />
                  </>
                )}
              </Fragment>
            );
          })}
          {!!fields?.length && <JoinDivider />}
          <IconButton
            sx={{
              backgroundColor: (theme) => theme.palette.secondary.main,
              color: (theme) => theme.palette.secondary.contrastText,
              ":hover": {
                backgroundColor: (theme) =>
                  lighten(theme.palette.secondary.main, 0.2),
              },
            }}
            onClick={handleAddCondition}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Stack>
        <Stack marginLeft="auto!important" spacing={1} direction="row">
          {!isValid && (
            <Tooltip title="Must have at least one complete filter to apply filters appending to the existing query.">
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography color="warning" variant="body2">
                  At least one complete filter required
                </Typography>
                <WarningAmberIcon color={"warning"} fontSize="small" />
              </Stack>
            </Tooltip>
          )}
          <Button
            color="primary"
            variant="contained"
            type="submit"
            disabled={!isValid}
            sx={{
              width: "fit-content",
            }}
          >
            Apply Filters
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};

export default AuditLogViewerFiltersForm;
