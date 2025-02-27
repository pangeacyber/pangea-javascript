import { ButtonGroup, Stack } from "@mui/material";
import { FC, useMemo } from "react";
import { useAuditContext } from "../../hooks/context";
import {
  FilterOptions,
  SelectField,
  StringField,
  UnControlledSelectField,
} from "@pangeacyber/react-mui-shared";

import find from "lodash/find";
import { getFieldValueOptions } from "../../hooks/schema";

export interface AuditFieldFilter {
  id: string;
  operator: ":" | "=" | ">" | "<";
  value: string;
}

interface Props {
  value: AuditFieldFilter;
  onValueChange: (value: AuditFieldFilter) => void;

  options: FilterOptions<any>;
}

const FilterField: FC<Props> = ({
  value,
  onValueChange,

  options,
}) => {
  const { schema } = useAuditContext();

  const field = useMemo(() => {
    if (value.id) {
      const field = find(schema?.fields ?? [], (f) => f.id === value.id);
      if (field) {
        return field;
      }
    }

    return undefined;
  }, [value, schema]);

  const fieldOptions = useMemo(() => {
    return Object.keys(options).map((fieldId) => ({
      value: fieldId,
      label: options[fieldId]?.label ?? fieldId,
    }));
  }, [schema.fields, options]);

  const operationOptions = useMemo(() => {
    if (!field || field.type === "boolean") {
      return [
        {
          value: "=",
          label: "is",
        },
      ];
    }

    if (field.type === "integer" || field.type === "datetime") {
      return [
        {
          value: "=",
          label: "is",
        },
        {
          value: ">",
          label: "greater than",
        },
        {
          value: "<",
          label: "less than",
        },
      ];
    }

    return [
      {
        value: "=",
        label: "is",
      },
      {
        value: ":",
        label: "contains",
      },
    ];
  }, [field]);

  const valueOptions = useMemo(() => {
    const option = options[value.id];
    if (!field || !!option?.valueOptions) {
      return option?.valueOptions;
    }

    return getFieldValueOptions(field, undefined);
  }, [value.id, field, options]);

  return (
    <Stack width="calc(100% - 50px)">
      <ButtonGroup
        sx={{
          width: "100%",
          ".MuiFormControl-root": {
            marginTop: 0,
            width: "80px",
            minWidth: "80px",
          },
          ".MuiFormControl-root:first-child": {
            marginTop: 0,
            width: "100%",
          },
          ".MuiFormControl-root:last-child": {
            marginTop: 0,
            width: "100%",
          },
        }}
        onClick={(event) => event.preventDefault()}
      >
        <Stack width="37%">
          <UnControlledSelectField
            value={value.id}
            onValueChange={(fieldId) =>
              onValueChange({
                ...value,
                id: fieldId,
              })
            }
            FieldProps={{
              type: "singleSelect",
              options: {
                valueOptions: fieldOptions,
              },
            }}
            autoFocus={true}
            sx={{
              height: "40px",
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
            }}
          />
        </Stack>
        <Stack width="26%">
          <SelectField
            onValueChange={(operator) =>
              onValueChange({
                ...value,
                operator,
              })
            }
            value={value.operator}
            FieldProps={{
              type: "singleSelect",
              options: {
                valueOptions: operationOptions,
              },
            }}
            LabelProps={{
              TypographyProps: {
                variant: "body2",
              },
            }}
            sx={{
              height: "40px",
              borderRadius: 0,
            }}
          />
        </Stack>
        <Stack width="37%">
          <StringField
            value={value.value}
            onValueChange={(v) =>
              onValueChange({
                ...value,
                value: v,
              })
            }
            FieldProps={{
              type: "text",
              options: {
                valueOptions,
              },
            }}
            sx={{
              minWidth: "140px",
              marginTop: 0,
              ".MuiInputBase-root": {
                height: "40px",
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
              },
            }}
          />
        </Stack>
      </ButtonGroup>
    </Stack>
  );
};

export default FilterField;
