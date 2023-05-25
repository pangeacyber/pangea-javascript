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

  return (
    <Stack gap={2}>
      <Stack>
        <Typography variant="h6" mb={3}>
          Verify your email
        </Typography>
        {options.showEmail && (
          <Typography variant="body2">{data.email}</Typography>
        )}
      </Stack>
      <Typography variant="body1">
        An email message has been sent to your inbox.
      </Typography>
      {error && <ErrorMessage response={error} />}
      <Stack direction="row" justifyContent="center" gap={2} mt={2}>
        <Button variant="text" onClick={resendEmail} disabled={loading}>
          Resend Email
        </Button>
        {options.showReset && (
          <Button color="primary" variant="outlined" onClick={reset}>
            {options.resetLabel}
          </Button>
        )}
      </Stack>
    </Stack>
  );
};

export default VerifyEmailView;
