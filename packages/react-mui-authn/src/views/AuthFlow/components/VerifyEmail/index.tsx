import { Button, Stack, Typography } from "@mui/material";

import { useAuthFlow, FlowStep } from "@pangeacyber/react-auth";

import ErrorMessage from "../ErrorMessage";

const VerifyEmailView = () => {
  const { reset, loading, error, flowData, callNext } = useAuthFlow();

  const resendEmail = () => {
    callNext(FlowStep.VERIFY_EMAIL, {
      flowId: flowData.flowId,
      cb_state: null,
      cb_code: null,
    });
  };

  return (
    <Stack gap={2}>
      <Stack>
        <Typography variant="h6">Verify your email</Typography>
        <Typography variant="caption">{flowData.email}</Typography>
      </Stack>
      <Typography variant="body1">
        An email message has been sent to your inbox.
      </Typography>
      {error && <ErrorMessage response={error} />}
      <Stack direction="row" gap={2} mt={2}>
        <Button
          variant="contained"
          color="secondary"
          onClick={resendEmail}
          disabled={loading}
        >
          Resend Email
        </Button>
        <Button color="primary" variant="outlined" onClick={reset}>
          Start Over
        </Button>
      </Stack>
    </Stack>
  );
};

export default VerifyEmailView;
