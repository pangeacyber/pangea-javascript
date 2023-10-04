import { FC, useEffect } from "react";
import { Stack, Typography } from "@mui/material";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import Button from "@src/components/core/Button";
import ErrorMessage from "../../components/ErrorMessage";

const ProvisionedView: FC<AuthFlowComponentProps> = ({
  options,
  data,
  loading,
  error,
  update,
  restart,
  reset,
}) => {
  const sendEmail = () => {
    restart(AuthFlow.Choice.PROVISIONAL);
  };

  const checkState = () => {
    update(AuthFlow.Choice.NONE, {});
  };

  useEffect(() => {
    if (data?.provisional?.sent === false) {
      // FIXME: add a resend time check
      sendEmail();
    }
  }, [data]);

  return (
    <Stack gap={2}>
      <Typography variant="h6">Account Setup</Typography>
      <Stack gap={1}>
        <Typography variant="body2">
          An email message has been sent to {data.email}, click the link in the
          message to continue.
        </Typography>
        <Typography variant="body2">
          If you open the link in a different browser, return here and click the
          button below.
        </Typography>
        {error && <ErrorMessage response={error} />}
        <Button color="primary" onClick={checkState} disabled={loading}>
          Verification Complete
        </Button>
      </Stack>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="center"
        gap={{ xs: 0, sm: 1 }}
      >
        <Button variant="text" onClick={sendEmail} disabled={loading}>
          Resend email
        </Button>
        <Button variant="text" onClick={reset}>
          {options.cancelLabel}
        </Button>
      </Stack>
    </Stack>
  );
};

export default ProvisionedView;
