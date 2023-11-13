import { TextField, IconButton, TextFieldProps } from "@mui/material";
import { FC, useState } from "react";
import isEmpty from "lodash/isEmpty";
import { InputFieldComponentProps, StringFieldSchemaProps } from "../types";
import Autocomplete from "@mui/material/Autocomplete";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FieldControl from "../FieldControl";
import { useValueOptions } from "../hooks/useValueOptions";

interface StringFieldProps
  extends InputFieldComponentProps<StringFieldSchemaProps> {}

export const UnControlledStringField: FC<StringFieldProps> = ({
  name,

  value,
  onValueChange,
  onChange,
  onBlur = () => {},
  onFocus = () => {},
  errors,
  disabled,
  size = "small",
  variant,
  sx = {},
  autoFocus,

  FieldProps,
}) => {
  const {
    placeholder,
    type = "text",
    InputProps,
    TextFieldProps,
    dataTestId,
  } = FieldProps ?? {};
  const [show, setShow] = useState(false);

  const propOverrides: Partial<TextFieldProps> = {
    InputProps,
  };
  if (type === "password") {
    propOverrides.InputProps = {
      ...propOverrides?.InputProps,
      endAdornment: (
        <IconButton
          onClick={() => {
            setShow(!show);
          }}
          key={`password-visibility-${name}`}
        >
          {show ? (
            <VisibilityOff fontSize="small" />
          ) : (
            <Visibility fontSize="small" />
          )}
        </IconButton>
      ),
    };
    propOverrides.type = show ? "text" : "password";
  }

  if (type === "number") {
    propOverrides.type = "number";
    // FIXME: This is force specific for matcher
    propOverrides.InputProps = {
      onKeyDown: (event) => event.stopPropagation(),
      ...(InputProps ?? {}),
    };
  }

  if (type === "date") {
    try {
      // @ts-ignore
      const formattedDate = new Date(value).toISOString().split("T")[0];
      propOverrides.value = formattedDate;
    } catch {}

    propOverrides.InputLabelProps = {
      shrink: true,
    };
  }

  return (
    <TextField
      id={name}
      name={name}
      value={value}
      size={size}
      variant={variant}
      onChange={(e) => {
        let value = e.target.value;
        if (onChange) onChange(e);
        if (onValueChange) {
          onValueChange(value);
        }

        e.stopPropagation();
      }}
      disabled={disabled}
      placeholder={placeholder}
      autoFocus={autoFocus}
      onBlur={onBlur}
      onFocus={onFocus}
      error={!isEmpty(errors)}
      helperText={errors}
      sx={{
        marginTop: 0,
        ...sx,
      }}
      type={type}
      fullWidth
      onKeyDown={(event) => event.stopPropagation()}
      autoComplete="off"
      data-testid={dataTestId}
      {...propOverrides}
      {...TextFieldProps}
    />
  );
};

export const UnControlledAutocompleteStringField: FC<StringFieldProps> = (
  props
) => {
  const { value, values, onValueChange } = props;
  const valueOptions = useValueOptions({
    values,
    options: props?.FieldProps?.options,
  });

  return (
    <>
      {Array.isArray(valueOptions) && valueOptions.length ? (
        <Autocomplete
          disablePortal
          options={valueOptions}
          fullWidth
          freeSolo
          value={value ?? ""}
          onChange={(_, autoCompleteValue: any) => {
            if (!onValueChange) return;

            if (autoCompleteValue) onValueChange(autoCompleteValue.value);
            else onValueChange("");
          }}
          size="small"
          renderInput={(params) => {
            return <UnControlledStringField {...props} />;
          }}
        />
      ) : (
        <UnControlledStringField {...props} />
      )}
    </>
  );
};

const StringField: FC<StringFieldProps> = (props) => {
  return (
    <FieldControl
      {...props}
      FieldControlProps={{
        ignoreErrors: true,
      }}
    >
      <UnControlledAutocompleteStringField {...props} />
    </FieldControl>
  );
};

export default StringField;
