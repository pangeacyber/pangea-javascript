import { IconButton, Stack, TextField, Typography, Chip } from "@mui/material";
import uniqBy from "lodash/uniqBy";
import {
  FieldComponentProps,
  FieldControl,
} from "@pangeacyber/react-mui-shared";
import { FC, useEffect, useMemo, useState } from "react";
import findIndex from "lodash/findIndex";
import * as yup from "yup";

import AddIcon from "@mui/icons-material/Add";

const PHONE_REGEXP =
  /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|(1|[0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;

export interface PhoneValue {
  phone_number: string;
  recipient: string;
}

const UnControlledSharePhonesField: FC<FieldComponentProps> = ({
  onValueChange = () => {},
  ...props
}) => {
  const value = useMemo<PhoneValue[]>(() => {
    const value: PhoneValue[] = props.value || props.default || [];
    return uniqBy(value, "phone_number");
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

    // strip leading +1, remove non-digits, add +1
    const newValue_ = `+1${newValue.replace(/^\+1/, "").replace(/\D/g, "")}`;

    let value_ = [...value];
    value_.push({
      phone_number: newValue_,
      recipient: "",
    });

    value_ = uniqBy(value_, "phone_number");
    onValueChange(value_);
    setNewValue("");
  };

  const handleUpdateRecipient = (
    phone: PhoneValue,
    idx: number,
    recipient: string
  ) => {
    if (idx < 0 || idx >= value.length) return;

    let value_ = [...value];
    value_[idx] = {
      ...value_[idx],
      recipient,
    };

    value_ = uniqBy(value_, "phone_number");
    onValueChange(value_);
    setNewValue("");
  };

  const handleRemoveValue = (phone: PhoneValue) => {
    const idx = findIndex(value, (v) => v.phone_number === phone.phone_number);
    if (idx === -1) return;

    const value_ = value.slice(0, idx).concat(value.slice(idx + 1));
    onValueChange(value_);
  };

  return (
    <Stack spacing={1} width="100%">
      <Stack width="100%" direction="row" alignItems="center" spacing={1}>
        <TextField
          value={newValue}
          name="recipient_phone"
          label="Add phone number"
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
          onBlur={handleAddNewValue}
          onKeyUp={(event) => {
            if (event.key === "Enter") {
              handleAddNewValue();
              event.preventDefault();
            }
          }}
          size="small"
          InputProps={{
            startAdornment: (
              <Typography color="textSecondary" sx={{ paddingRight: 1 }}>
                +1
              </Typography>
            ),
          }}
        />
        <IconButton
          size="small"
          title="Add phone number"
          onClick={handleAddNewValue}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Stack>
      <Stack
        direction="row"
        gap={1}
        sx={{
          flexWrap: "wrap",
          minHeight: "80px",
          overflow: "hidden",
          overflowY: "auto",
          maxHeight: "calc(100vh - 600px)",
        }}
      >
        {value.map((phone, idx) => {
          return (
            <Chip
              key={`phone-${idx}-${phone.phone_number}`}
              label={phone.phone_number}
              onDelete={() => handleRemoveValue(phone)}
            />
          );
        })}
      </Stack>
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
