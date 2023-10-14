import { FC } from "react";
import { Stack, Typography } from "@mui/material";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import Button from "@src/components/core/Button";
import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";

const MismatchEmailView: FC<AuthFlowComponentProps> = ({
  options,
  data,
  error,
  update,
  reset,
}) => {
  const doUpdate = () => {
    update(AuthFlow.Choice.NONE, {});
  };

  return (
    <Stack gap={2}>
      <Typography variant="h6">Mismatched Email</Typography>
      <Stack alignItems="center" gap={2}>
        <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
          The social provider email doesn't match your account email.
        </Typography>
        <Button
          color="primary"
          variant="contained"
          fullWidth={true}
          onClick={doUpdate}
        >
          Select a different method
        </Button>
      </Stack>
      <Stack direction="row" justifyContent="center" gap={2}>
        <Button variant="text" onClick={reset}>
          {options.cancelLabel}
        </Button>
      </Stack>
    </Stack>
  );
};

export default MismatchEmailView;
