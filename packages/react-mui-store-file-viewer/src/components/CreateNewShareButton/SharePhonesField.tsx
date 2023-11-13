import {
  IconButton,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import {
  FieldComponentProps,
  FieldControl,
} from "@pangeacyber/react-mui-shared";
import { FC, useEffect, useMemo, useState } from "react";
import findIndex from "lodash/findIndex";
import * as yup from "yup";

import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

const PHONE_REGEXP =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|(1|[0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const UnControlledSharePhonesField: FC<FieldComponentProps> = ({
  onValueChange = () => {},
  ...props
}) => {
  const value = useMemo<string[]>(() => {
    const value: string[] = props.value || props.default || [];
    const valueSet = new Set(value);
    return Array.from(valueSet);
  }, [props.value, props.default]);

  const [newValue, setNewValue] = useState("");
  const [newValueError, setNewValueError] = useState<string | undefined>(
    undefined
  );

  const validate = () => {
    yup
      .string()
      .matches(PHONE_REGEXP, "Phone number is not valid")
      .required("Phone number is a required field")
      .isValid(newValue)
      .then((isValid) => {
        if (!isValid) setNewValueError("Must be a valid phone number");
        else setNewValueError(undefined);
      });
  };

  useEffect(() => {
    if (newValue === "") {
      setNewValueError(undefined);
      return;
    }

    validate();
  }, [newValue]);

  const handleAddNewValue = () => {
    if (!newValue || !!newValueError) return;

    const newValue_ = !newValue.startsWith("+1") ? `+1${newValue}` : newValue;

    let value_ = [...value];
    value_.push(newValue_);

    const valueSet = new Set(value_);
    value_ = Array.from(valueSet);

    onValueChange(value_);
    setNewValue("");
  };

  const handleRemoveValue = (email: string) => {
    const idx = findIndex(value, (v) => v === email);
    if (idx === -1) return;

    const value_ = value.slice(0, idx).concat(value.slice(idx + 1));
    onValueChange(value_);
  };

  return (
    <Stack spacing={1} width="100%">
      <TextField
        value={newValue}
        label="Add recipient phone number"
        onChange={(e) => {
          let value = e.target.value;
          setNewValue(value);

          e.stopPropagation();
        }}
        error={!!newValueError}
        helperText={newValueError}
        onKeyDown={(event) => event.stopPropagation()}
        autoComplete="off"
        fullWidth
        onKeyUp={(event) => {
          if (event.key === "Enter") {
            handleAddNewValue();
            event.preventDefault();
          }
        }}
      />
      {value.map((email) => {
        return (
          <Stack
            key={`share-email-${email}`}
            spacing={1}
            direction="row"
            width="100%"
            alignItems="center"
          >
            <LocalPhoneIcon fontSize="small" />
            <Typography variant="body2" sx={{ width: "100%" }}>
              {email}
            </Typography>
            <IconButton size="small" onClick={() => handleRemoveValue(email)}>
              <RemoveCircleOutlineIcon fontSize="small" />
            </IconButton>
          </Stack>
        );
      })}
    </Stack>
  );
};

const SharePhonesField: FC<FieldComponentProps> = (props) => {
  return (
    <FieldControl {...props}>
      <UnControlledSharePhonesField {...props} />
    </FieldControl>
  );
};

export default SharePhonesField;
