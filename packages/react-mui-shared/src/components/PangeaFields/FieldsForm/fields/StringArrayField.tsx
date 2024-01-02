import { Button, Stack, Chip, Typography } from "@mui/material";
import { FC, useState, useMemo } from "react";
import FieldControl from "../FieldControl";
import { UnControlledAutocompleteStringField } from "./StringField";
import { FieldComponentProps, StringArrayFieldSchemaProps } from "../types";

export const UnControlledStringArrayField: FC<
  FieldComponentProps<StringArrayFieldSchemaProps>
> = (props) => {
  const { dedup = false, InputProps = {} } = props.FieldProps ?? {};

  const value = useMemo<string[]>(() => {
    const value: string[] = props.value || props.default || [];

    if (dedup) {
      const valueSet = new Set(value);
      return Array.from(valueSet);
    }

    return value;
  }, [props.value, props.default, dedup]);

  const [newValue, setNewValue] = useState("");

  const addNewValue = () => {
    if (!newValue) return;

    let value_ = [...value];
    value_.push(newValue);

    if (dedup) {
      const valueSet = new Set(value_);
      value_ = Array.from(valueSet);
    }

    if (!!props?.onValueChange) {
      props?.onValueChange(value_);
      setNewValue("");
    }
  };

  return (
    <Stack spacing={1} width="100%">
      {!props.disabled && (
        <Stack direction="row" spacing={1} width="100%">
          <UnControlledAutocompleteStringField
            value={newValue}
            name={props.name}
            onValueChange={(val: string) => {
              setNewValue(val);
            }}
            FieldProps={{
              type: "text",
              InputProps: {
                ...InputProps,
                onKeyPress: (event) => {
                  if (event.key === "Enter") {
                    addNewValue();
                    event.preventDefault();
                  }
                },
              },
            }}
          />
          <Button
            data-testid={`${props.name}-Add-Btn`}
            onClick={addNewValue}
            variant="contained"
            color="secondary"
          >
            Add
          </Button>
        </Stack>
      )}
      {!!props.disabled && !value.length && (
        <Typography variant="body2" color="textSecondary">
          None
        </Typography>
      )}
      <Stack
        direction="row"
        spacing={1}
        pb={value.length ? 0.5 : 0}
        sx={{
          flexWrap: "wrap",
        }}
      >
        {value.map((val, idx) => {
          return (
            <Chip
              key={`${props.name}-fitler-chip-${idx}`}
              label={val}
              sx={{ mb: "4px!important" }}
              onDelete={
                !props.disabled
                  ? () => {
                      const value_ = value
                        .slice(0, idx)
                        .concat(value.slice(idx + 1));
                      if (!!props?.onValueChange) {
                        props?.onValueChange(value_);
                      }
                    }
                  : undefined
              }
            />
          );
        })}
      </Stack>
    </Stack>
  );
};

const StringArrayField: FC<FieldComponentProps<StringArrayFieldSchemaProps>> = (
  props
) => {
  return (
    <FieldControl {...props}>
      <UnControlledStringArrayField {...props} />
    </FieldControl>
  );
};

export default StringArrayField;
