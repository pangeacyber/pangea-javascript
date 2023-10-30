import { FC } from "react";
import { Stack, Typography } from "@mui/material";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import Button from "@src/components/core/Button";
import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";

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
    case "password":
      return "a password";
    default:
      return provider;
  }
};

const InvalidAuthView: FC<AuthFlowComponentProps> = ({
  options,
  error,
  update,
  reset,
}) => {
  const providerLabel = getProviderName(error.result?.correct_provider);
  const emailAddress = error.result?.email || "selected";

  const doUpdate = () => {
    update(AuthFlow.Choice.NONE, {});
  };

  return (
    <Stack gap={2}>
      <Stack alignItems="center" gap={2}>
        <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
          To sign in to the {emailAddress} account you must authenticate with{" "}
          {providerLabel}.
        </Typography>
        {error.result?.correct_provider && (
          <Button
            color="primary"
            variant="contained"
            fullWidth={true}
            onClick={doUpdate}
          >
            Continue with {providerLabel}
          </Button>
        )}
      </Stack>
      <Stack direction="row" justifyContent="center" gap={2}>
        <Button variant="text" onClick={reset}>
          {options.cancelLabel}
        </Button>
      </Stack>
    </Stack>
  );
};

export default InvalidAuthView;
