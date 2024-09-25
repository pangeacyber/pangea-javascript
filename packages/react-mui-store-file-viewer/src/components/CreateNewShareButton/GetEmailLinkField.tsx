import { FC, useEffect, useState } from "react";
import * as yup from "yup";
import { Button, Stack, TextField, Typography } from "@mui/material";

import {
  FieldComponentProps,
  FieldControl,
} from "@pangeacyber/react-mui-shared";

import { useCreateShareContext } from "../../hooks/context";

const UnControlledGetEmailLinkField: FC<FieldComponentProps> = ({
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
      .trim()
      .email("Must be a valid email address")
      .isValid(newValue)
      .then((isValid) => {
        if (!isValid) setNewValueError("Must be a valid email address");
        else setNewValueError(undefined);
      });
  };

  const handleSubmitValue = () => {
    if (!newValue || !!newValueError) return;

    onValueChange(newValue);
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
        Enter an email to protect the link with a one-time authentication code
      </Typography>
      <Stack width="100%" direction="row" spacing={1} alignItems="flex-start">
        <TextField
          value={newValue}
          name="recipient_email"
          label="Email"
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
              handleSubmitValue();
              event.preventDefault();
            }
          }}
          onBlur={validate}
          disabled={loading}
          size="small"
        />
        <Button
          variant="outlined"
          onClick={handleSubmitValue}
          disabled={!newValue || !!newValueError || loading}
          sx={{
            minWidth: "100px",
            textWrap: "nowrap",
          }}
        >
          {loading ? "Saving..." : "Get Link"}
        </Button>
      </Stack>
    </Stack>
  );
};

const GetEmailLinkField: FC<FieldComponentProps> = (props) => {
  return (
    <FieldControl {...props}>
      <UnControlledGetEmailLinkField {...props} />
    </FieldControl>
  );
};

export default GetEmailLinkField;
