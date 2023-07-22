import { FC } from "react";
import { Stack, Typography } from "@mui/material";

import { Button, ViewComponentProps } from "@pangeacyber/react-mui-authn";

const getProviderName = (provider: string) => {
  switch (provider) {
    case "google":
      return "Google";
    case "github":
      return "GitHub";
    case "microsoftonline":
      return "Microsoft";
    case "facebook":
      return "Facebook";
    case "webauthn":
      return "passwordless (WebAuthn)";
    case "password":
      return "a password";
    default:
      return provider;
  }
};

const InvalidAuth: FC<ViewComponentProps> = ({ options, error, reset }) => {
  return (
    <Stack gap={2}>
      <Typography variant="h6">Incorrect Method</Typography>
      <Stack direction="row" justifyContent="center" gap={2}>
        <Typography variant="body2" color="error">
          You must log in using{" "}
          {getProviderName(error.result?.correct_provider)}.
        </Typography>
      </Stack>
      <Stack direction="row" justifyContent="center" gap={2}>
        <Button variant="text" onClick={reset}>
          {options.resetLabel}
        </Button>
      </Stack>
    </Stack>
  );
};

export default InvalidAuth;
