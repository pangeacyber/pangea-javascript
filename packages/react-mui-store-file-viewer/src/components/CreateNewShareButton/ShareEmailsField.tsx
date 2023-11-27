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

import MailOutlineIcon from "@mui/icons-material/MailOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

const UnControlledShareEmailsField: FC<FieldComponentProps> = ({
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
      .trim()
      .email("Must be a valid email address")
      .isValid(newValue)
      .then((isValid) => {
        if (!isValid) setNewValueError("Must be a valid email address");
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

    let value_ = [...value];
    value_.push(newValue);

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
    <Stack spacing={1} width="100%" sx={{ minHeight: "300px" }}>
      <TextField
        value={newValue}
        label="Add recipient email"
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
        size="small"
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
            <MailOutlineIcon fontSize="small" />
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

const ShareEmailsField: FC<FieldComponentProps> = (props) => {
  return (
    <FieldControl {...props}>
      <UnControlledShareEmailsField {...props} />
    </FieldControl>
  );
};

export default ShareEmailsField;
