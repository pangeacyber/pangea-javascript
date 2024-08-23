import { FC, useEffect, useState } from "react";
import * as yup from "yup";
import { Button, Stack, TextField, Typography } from "@mui/material";

import {
  FieldComponentProps,
  FieldControl,
} from "@pangeacyber/react-mui-shared";

import { formatPhoneNumber, validatePhoneNumber } from "../../utils";
import { useCreateShareContext } from "../../hooks/context";

const UnControlledGetPhoneLinkField: FC<FieldComponentProps> = ({
  onValueChange = () => {},
}) => {
  const { loading, setSent } = useCreateShareContext();
  const [newValue, setNewValue] = useState("");
  const [newValueError, setNewValueError] = useState<string | undefined>(
    undefined
  );

  const validate = () => {
    yup
      .string()
      .test(
        "validate-phone",
        "Must be a valid phone number",
        validatePhoneNumber
      )
      .isValid(newValue)
      .then((isValid) => {
        if (!isValid) setNewValueError("Must be a valid phone number");
        else setNewValueError(undefined);
      });
  };

  const handleSubmitValue = () => {
    if (!newValue || !!newValueError) return;
    const phoneValue_ = formatPhoneNumber(newValue);

    onValueChange(phoneValue_);
  };

  useEffect(() => {
    if (newValue === "") {
      setNewValueError(undefined);
      return;
    }

    if (!loading) {
      setSent(false);
      validate();
    }
  }, [newValue]);

  return (
    <Stack gap={1} width="100%">
      <Typography variant="caption" color="textSecondary" mt={1}>
        Enter a phone number to recieve the authentication code
      </Typography>
      <Stack width="100%" direction="row" spacing={1}>
        <TextField
          value={newValue}
          name="recipient_phone"
          label="Phone number"
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
          onBlur={validate}
          onKeyUp={(event) => {
            if (event.key === "Enter") {
              handleSubmitValue();
              event.preventDefault();
            }
          }}
          size="small"
          disabled={loading}
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
          onClick={handleSubmitValue}
          disabled={!newValue || !!newValueError || loading}
          sx={{ minWidth: "100px" }}
        >
          {loading ? "Saving..." : "Get Link"}
        </Button>
      </Stack>
    </Stack>
  );
};

const GetPhoneLinkField: FC<FieldComponentProps> = (props) => {
  return (
    <FieldControl {...props}>
      <UnControlledGetPhoneLinkField {...props} />
    </FieldControl>
  );
};

export default GetPhoneLinkField;
