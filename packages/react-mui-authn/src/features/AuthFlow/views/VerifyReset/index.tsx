import { FC, useEffect, useState } from "react";
import { Stack, Typography } from "@mui/material";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import Button from "@src/components/core/Button";
import ErrorMessage from "../../components/ErrorMessage";

const VerifyResetView: FC<AuthFlowComponentProps> = ({
  options,
  data,
  error,
  update,
  reset,
  restart,
}) => {
  const [checked, setChecked] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    if (checked) {
      setStatus("Verification has not been completed");
      setTimeout(() => {
        setStatus("");
      }, 3000);
    }
  }, [data]);

  const checkState = () => {
    setChecked(true);
    update(AuthFlow.Choice.NONE, {});
  };

  const sendEmail = () => {
    restart(AuthFlow.Choice.RESET_PASSWORD, {});
  };

  return (
    <Stack gap={2}>
      <Typography variant="h6">Reset Password</Typography>
      <Stack gap={1}>
        <Typography variant="body2">
          An email has been sent to {data.email}, click the link in the message
          to reset your password.
        </Typography>
        <Typography variant="body2">
          If you click the link in a different browser, return here and click
          the button below.
        </Typography>
      </Stack>
      <Stack gap={1}>
        <Button color="primary" onClick={checkState}>
          Verification Complete
        </Button>
        {status && (
          <Typography variant="body2" color="error">
            {status}
          </Typography>
        )}
        {error && <ErrorMessage response={error} />}
      </Stack>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="center"
        gap={{ xs: 0, sm: 1 }}
      >
        <Button variant="text" onClick={sendEmail}>
          Resend email
        </Button>
        <Button variant="text" onClick={reset}>
          {options.cancelLabel}
        </Button>
      </Stack>
    </Stack>
  );
};

export default VerifyResetView;
