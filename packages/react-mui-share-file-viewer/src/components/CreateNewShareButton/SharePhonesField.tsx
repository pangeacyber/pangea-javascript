import { FC, useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { EditOutlined, RemoveCircleOutline } from "@mui/icons-material";
import * as yup from "yup";
import uniqBy from "lodash/uniqBy";
import findIndex from "lodash/findIndex";

import {
  FieldComponentProps,
  FieldControl,
} from "@pangeacyber/react-mui-shared";
import { ObjectStore } from "../../types";
import {
  cleanPhoneNumber,
  formatPhoneNumber,
  validatePhoneNumber,
} from "../../utils";

const UnControlledSharePhonesField: FC<FieldComponentProps> = ({
  onValueChange = () => {},
  ...props
}) => {
  const value = useMemo<ObjectStore.Recipient[]>(() => {
    const value_: ObjectStore.Recipient[] = props.value || props.default || [];
    return uniqBy(value_, "email");
  }, [props.value, props.default]);

  const [emailValue, setEmailValue] = useState("");
  const [phoneValue, setPhoneValue] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [phoneError, setPhoneError] = useState<string | undefined>(undefined);
  const [editRow, setEditRow] = useState<number | undefined>(undefined);

  const minHeight = !value?.length
    ? "0"
    : value.length >= 3
      ? "148px"
      : `${value.length * 48}px`;

  const validatePhone = () => {
    yup
      .string()
      .test(
        "validate-phone",
        "Must be a valid phone number",
        validatePhoneNumber
      )
      .required("Phone number is field")
      .isValid(phoneValue)
      .then((isValid) => {
        if (!isValid) setPhoneError("Must be a valid phone number");
        else setPhoneError(undefined);
      });
  };
  const validateEmail = () => {
    yup
      .string()
      .email("Must be a valid email")
      .required("Email is required")
      .isValid(emailValue)
      .then((isValid) => {
        if (!isValid) setEmailError("Must be a valid email");
        else setEmailError(undefined);
      });
  };

  useEffect(() => {
    if (phoneValue === "" && emailValue === "") {
      setEmailError(undefined);
      setPhoneError(undefined);
      setEditRow(undefined);
      return;
    }

    if (!!phoneValue) {
      validatePhone();
    }

    if (!!emailValue) {
      validateEmail();
    }
  }, [emailValue, phoneValue]);

  const handleAddOption = () => {
    if (!emailValue || !phoneValue || !!emailError || !!phoneError) return;

    const phoneValue_ = cleanPhoneNumber(phoneValue);

    let value_ = [...value];
    if (editRow === undefined) {
      value_.push({
        phone_number: phoneValue_,
        email: emailValue,
      });
    } else {
      const update = {
        ...value_[editRow],
        phone_number: phoneValue_,
        email: emailValue,
      };
      value_[editRow] = update;
    }

    value_ = uniqBy(value_, "email");
    onValueChange(value_);
    setPhoneValue("");
    setEmailValue("");
    setEditRow(undefined);
  };

  const handleRemoveOption = (recipient: ObjectStore.Recipient) => {
    const idx = findIndex(value, (v) => v.email === recipient.email);
    if (idx === -1) return;

    const value_ = value.slice(0, idx).concat(value.slice(idx + 1));
    onValueChange(value_);
  };

  const handleEditOption = (phone: ObjectStore.Recipient) => {
    const idx = findIndex(value, (v) => v.email === phone.email);
    if (idx === -1) return;
    setEditRow(idx);
    setPhoneValue(phone.phone_number);
    setEmailValue(phone.email);
  };

  return (
    <Stack gap={1} width="100%">
      <Stack
        width="100%"
        direction="row"
        mt={1}
        gap={0.5}
        alignItems="flex-start"
      >
        <TextField
          value={emailValue}
          name="recipient_email"
          label="Email"
          onChange={(e) => {
            let value = e.target.value;
            setEmailValue(value);
            e.stopPropagation();
          }}
          error={!!emailError}
          helperText={emailError}
          onKeyDown={(event) => event.stopPropagation()}
          autoComplete="off"
          fullWidth
          onBlur={handleAddOption}
          onKeyUp={(event) => {
            if (event.key === "Enter") {
              handleAddOption();
              event.preventDefault();
            }
          }}
          size="small"
          sx={{
            "& .MuiFormHelperText-sizeSmall": {
              marginLeft: 1,
            },
          }}
        />
        <TextField
          value={phoneValue}
          name="recipient_phone"
          label="Add phone number"
          onChange={(e) => {
            let value = e.target.value;
            setPhoneValue(value);
            e.stopPropagation();
          }}
          error={!!phoneError}
          helperText={phoneError}
          onKeyDown={(event) => event.stopPropagation()}
          autoComplete="off"
          fullWidth
          onBlur={handleAddOption}
          onKeyUp={(event) => {
            if (event.key === "Enter") {
              handleAddOption();
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
        <Button
          variant="outlined"
          title="Add recipient"
          onClick={handleAddOption}
          sx={{ minWidth: "100px" }}
        >
          {editRow === undefined ? "Add" : "Update"}
        </Button>
      </Stack>
      <Stack
        direction="row"
        alignItems="flex-start"
        gap={1}
        mb={1}
        sx={{
          flexWrap: "wrap",
          overflow: "hidden",
          overflowY: "auto",
          minHeight: minHeight,
          maxHeight: "calc(100vh - 600px)",
        }}
      >
        {value.map((recipient, idx) => {
          return (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              width="100%"
              key={`email-${idx}-${recipient.email}`}
            >
              <Stack direction="row" gap={1}>
                <Avatar>{recipient.email.charAt(0).toLocaleUpperCase()}</Avatar>
                <Stack>
                  <Typography variant="body2">{recipient.email}</Typography>
                  <Typography
                    variant="body2"
                    color={!recipient.phone_number ? "error" : "textSecondary"}
                  >
                    {!recipient.phone_number
                      ? "Phone number required"
                      : formatPhoneNumber(recipient.phone_number)}
                  </Typography>
                </Stack>
              </Stack>
              <Stack direction="row">
                <IconButton onClick={() => handleEditOption(recipient)}>
                  <EditOutlined fontSize="small" />
                </IconButton>
                <IconButton onClick={() => handleRemoveOption(recipient)}>
                  <RemoveCircleOutline fontSize="small" />
                </IconButton>
              </Stack>
            </Stack>
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
