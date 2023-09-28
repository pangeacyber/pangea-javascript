import { FC } from "react";
import { Stack, Typography } from "@mui/material";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import Button from "@src/components/core/Button";
import { AuthPassword } from "../../components";

const ResetPasswordView: FC<AuthFlowComponentProps> = (props) => {
  const { options, data, update, reset } = props;

  const cancelReset = () => {
    update(AuthFlow.Choice.RESET_PASSWORD, { cancel: true });
  };

  return (
    <Stack gap={2}>
      <Stack>
        <Typography variant="h6">Reset Password</Typography>
        <Typography variant="body2">{data.email}</Typography>
      </Stack>
      <AuthPassword {...props} />
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="center"
        gap={{ xs: 0, sm: 1 }}
      >
        <Button variant="text" onClick={cancelReset}>
          Cancel Reset
        </Button>
        <Button variant="text" onClick={reset}>
          {options.cancelLabel}
        </Button>
      </Stack>
    </Stack>
  );
};

export default ResetPasswordView;
