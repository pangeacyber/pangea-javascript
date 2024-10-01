import { FC, useEffect, useMemo, useState } from "react";
import {
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
  Avatar,
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

const UnControlledSharePasswordField: FC<FieldComponentProps> = ({
  onValueChange = () => {},
  ...props
}) => {
  const value = useMemo<ObjectStore.Recipient[]>(() => {
    const value: ObjectStore.Recipient[] = props.value || props.default || [];
    return uniqBy(value, "email");
  }, [props.value, props.default]);

  const [emailValue, setEmailValue] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [editRow, setEditRow] = useState<number | undefined>(undefined);

  const minHeight = !value?.length
    ? "0"
    : value.length >= 3
      ? "148px"
      : `${value.length * 48}px`;

  const validate = () => {
    yup
      .string()
      .required("Email is a required field")
      .email("A valid email is required")
      .isValid(emailValue)
      .then((isValid) => {
        if (!isValid) setEmailError("Must be a valid email address");
        else setEmailError(undefined);
      });
  };

  useEffect(() => {
    if (emailValue === "") {
      setEmailError(undefined);
      setEditRow(undefined);
      return;
    }

    validate();
  }, [emailValue]);

  const handleAddOption = () => {
    if (!emailValue || !!emailError) return;

    let value_ = [...value];
    if (editRow === undefined) {
      value_.push({
        phone_number: "",
        email: emailValue,
      });
    } else {
      const update = {
        ...value_[editRow],
        email: emailValue,
      };
      value_[editRow] = update;
    }

    value_ = uniqBy(value_, "email");
    onValueChange(value_);
    setEmailValue("");
    setEditRow(undefined);
  };

  const handleRemoveOption = (recipient: ObjectStore.Recipient) => {
    const idx = findIndex(value, (v) => v.email === recipient.email);
    if (idx === -1) return;

    const value_ = value.slice(0, idx).concat(value.slice(idx + 1));
    onValueChange(value_);
  };

  const handleEditOption = (recipient: ObjectStore.Recipient) => {
    const idx = findIndex(value, (v) => v.email === recipient.email);
    if (idx === -1) return;
    setEditRow(idx);
    setEmailValue(recipient.email);
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
          label="Add email"
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
              <Stack direction="row" gap={1} alignItems="center">
                <Avatar>{recipient.email.charAt(0).toLocaleUpperCase()}</Avatar>
                <Typography variant="body2">{recipient.email}</Typography>
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

const SharePasswordField: FC<FieldComponentProps> = (props) => {
  return (
    <FieldControl {...props}>
      <UnControlledSharePasswordField {...props} />
    </FieldControl>
  );
};

export default SharePasswordField;
