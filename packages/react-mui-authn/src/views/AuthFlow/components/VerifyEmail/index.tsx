import { Button, Stack, Typography } from "@mui/material";

import { useAuthFlow } from "@pangeacyber/react-auth";

const VerifyEmailView = () => {
  const { reset, flowData } = useAuthFlow();

  // const resendEmail = () => {
  //   callNext(FlowStep.VERIFY_EMAIL, { flowId: flowData.flowId, cb_state: null, cb_code: null });
  // }

  return (
    <Stack gap={2}>
      <Stack>
        <Typography variant="h6">Verify your email</Typography>
        <Typography variant="caption">{flowData.email}</Typography>
      </Stack>
      <Typography variant="body1">
        An email message has been sent to your inbox
      </Typography>
      <Stack direction="row" gap={2} my={2}>
        {/*
        <Button variant="text" onClick={resendEmail} disabled={loading}>Resend Email</Button>
        */}
        <Button variant="text" onClick={reset} sx={{ alignSelf: "flex-start" }}>
          Start Over
        </Button>
      </Stack>
    </Stack>
  );
};

export default VerifyEmailView;
