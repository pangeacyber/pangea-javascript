import { FC } from "react";
import { Stack, Typography } from "@mui/material";

import { FlowStep } from "@pangeacyber/react-auth";

import { ViewComponentProps } from "@src/views/AuthFlow/types";
import Button from "@src/components/core/Button";
import ErrorMessage from "../ErrorMessage";

const VerifyEmailView: FC<ViewComponentProps> = ({
  options,
  data,
  loading,
  error,
  next,
  reset,
}) => {
  const resendEmail = () => {
    next(FlowStep.VERIFY_EMAIL, {
      flowId: data.flowId,
      cb_state: null,
      cb_code: null,
    });
  };

  const checkFlow = () => {
    // TODO: Update once AuthNClient is updated
    // next(FlowStep.FLOW_GET);
  };

  return (
    <Stack gap={2}>
      <Typography variant="h6">Verify your email</Typography>
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
        <Button color="primary" onClick={checkFlow} disabled={loading}>
          Verification Complete
        </Button>
      </Stack>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="center"
        gap={{ xs: 0, sm: 1 }}
      >
        <Button variant="text" onClick={resendEmail} disabled={loading}>
          Resend Email
        </Button>
        <Button variant="text" onClick={reset}>
          {options.cancelLabel}
        </Button>
      </Stack>
    </Stack>
  );
};

export default VerifyEmailView;
