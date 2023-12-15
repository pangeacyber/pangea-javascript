import {
  IconButton,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Tooltip,
} from "@mui/material";
import uniqBy from "lodash/uniqBy";
import {
  FieldComponentProps,
  FieldControl,
} from "@pangeacyber/react-mui-shared";
import { FC, useEffect, useMemo, useState } from "react";
import findIndex from "lodash/findIndex";
import * as yup from "yup";

import AddIcon from "@mui/icons-material/Add";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

const PHONE_REGEXP =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|(1|[0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

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

  const validateEmail = (email: string) => {
    return yup
      .string()
      .trim()
      .email("Must be a valid email address")
      .isValid(email)
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

    const newValue_ = !newValue.startsWith("+1") ? `+1${newValue}` : newValue;

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
    <Stack spacing={1} width="100%" sx={{ minHeight: "300px" }}>
      <Stack width="100%" direction="row" alignItems="center" spacing={1}>
        <TextField
          value={newValue}
          name="recipient_phone"
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
      {value.map((phone, idx) => {
        return (
          <Stack
            key={`share-email-${phone.phone_number}`}
            spacing={1}
            direction="row"
            width="100%"
            alignItems="center"
          >
            <LocalPhoneIcon fontSize="small" />
            <Typography variant="body2" sx={{ width: "100%" }}>
              {phone.phone_number}
            </Typography>
            <TextField
              value={phone.recipient}
              placeholder="Add recipient email"
              sx={{ minWidth: "250px" }}
              onChange={(e) => {
                let value = e.target.value;
                handleUpdateRecipient(phone, idx, value);

                e.stopPropagation();
              }}
              InputProps={{
                startAdornment: (
                  <Tooltip
                    sx={{ marginLeft: -0.5, marginRight: 0.5 }}
                    title="Add an optional email recipient, that will get the shared link sent to them automatically on 'Create and Send'."
                  >
                    <InfoOutlinedIcon color="info" fontSize="small" />
                  </Tooltip>
                ),
              }}
              size="small"
            />
            <IconButton size="small" onClick={() => handleRemoveValue(phone)}>
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
