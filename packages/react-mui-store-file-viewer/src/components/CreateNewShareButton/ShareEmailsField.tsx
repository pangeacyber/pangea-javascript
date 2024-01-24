import {
  Chip,
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

import AddIcon from "@mui/icons-material/Add";

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
    <Stack spacing={1} width="100%">
      <Stack width="100%" direction="row" alignItems="center" spacing={1}>
        <TextField
          value={newValue}
          name="recipient_email"
          label="Add email"
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
          onBlur={handleAddNewValue}
          size="small"
        />
        <IconButton size="small" title="Add email" onClick={handleAddNewValue}>
          <AddIcon fontSize="small" />
        </IconButton>
      </Stack>
      <Stack
        direction="row"
        gap={0.5}
        sx={{
          flexWrap: "wrap",
          minHeight: "80px",
          overflow: "hidden",
          overflowY: "auto",
          maxHeight: "calc(100vh - 600px)",
        }}
      >
        {value.map((email, idx) => {
          return (
            <Chip
              key={`email-${idx}-${email}`}
              label={email}
              onDelete={() => handleRemoveValue(email)}
            />
          );
        })}
      </Stack>
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
