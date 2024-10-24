import { FC, useEffect, useState } from "react";
import { Button, Stack, Typography } from "@mui/material";
import {
  FieldComponentProps,
  FieldControl,
} from "@pangeacyber/react-mui-shared";
import * as yup from "yup";

import GeneratePasswordField from "../GeneratePasswordField";
import { useCreateShareContext } from "../../hooks/context";

const UnControlledGetPasswordLinkField: FC<FieldComponentProps> = ({
  onValueChange = () => {},
}) => {
  const { password, loading, setSent } = useCreateShareContext();
  const [error, setError] = useState<boolean>();
  const [passwordError, setPasswordError] = useState<string | undefined>(
    undefined
  );

  const validate = () => {
    yup
      .string()
      .trim()
      .required("Password must meet requirements")
      .isValid(password)
      .then((isValid) => {
        if (!isValid) setPasswordError("Password must meet requirements");
        else setPasswordError(undefined);
      });
  };

  const handleSubmitValue = () => {
    if (!password || !!passwordError) return;
    onValueChange(password);
  };

  const onValidatePassword = (error: boolean) => {
    setError(error);
  };

  useEffect(() => {
    if (password === "") {
      setPasswordError(undefined);
      return;
    }

    if (!loading) {
      setSent(false);
      validate();
    }
  }, [password]);

  return (
    <Stack gap={1} width="100%">
      <Typography variant="caption" color="textSecondary" mt={1}>
        Enter a password to protect access to the link
      </Typography>
      <Stack
        width="100%"
        direction="row"
        gap={1}
        alignItems="flex-start"
        sx={{
          "& .MuiFormGroup-root": {
            width: "calc(100% - 100px)",
          },
        }}
      >
        <GeneratePasswordField
          value={password}
          FieldProps={{
            disabled: loading,
            errorCallback: onValidatePassword,
          }}
        />
        <Button
          variant="outlined"
          onClick={handleSubmitValue}
          disabled={!password || !!passwordError || error || loading}
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

const GetPasswordLinkField: FC<FieldComponentProps> = (props) => {
  return (
    <FieldControl {...props}>
      <UnControlledGetPasswordLinkField {...props} />
    </FieldControl>
  );
};

export default GetPasswordLinkField;
