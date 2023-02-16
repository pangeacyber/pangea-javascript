import { ReactNode } from "react";
import { Button, Stack, Typography } from "@mui/material";

import { useAuthFlow, FlowStep } from "@pangeacyber/react-auth";

import ErrorMessage from "../ErrorMessage";

const SelectMfaView = () => {
  const { callNext, reset, flowData, error, step } = useAuthFlow();
  const nextStep =
    step === (FlowStep.ENROLL_MFA_START || FlowStep.ENROLL_MFA_COMPLETE)
      ? FlowStep.ENROLL_MFA_START
      : FlowStep.VERIFY_MFA_START;

  const selectProvider = (provider: string) => {
    callNext(nextStep, { mfaProvider: provider, cancel: true });
  };

  const selectMfaContent = (provider: string): ReactNode => {
    switch (provider) {
      case "sms_otp":
        return <p>Text me a one time security code</p>;
      case "email_otp":
        return <p>Email me a one time security code</p>;
      case "totp":
        return <p>Verify with an Authenticator App</p>;
      default:
        return <p>Send a code by {provider}</p>;
    }
  };

  return (
    <Stack gap={2}>
      <Stack>
        <Typography variant="h6">Select MFA method</Typography>
        <Typography variant="caption">{flowData.email}</Typography>
        {/* <Typography variant="body1">
        Choose how you want to sign in by selecting a verification method below.
        </Typography> */}
      </Stack>
      <Stack gap={2}>
        {flowData.mfaProviders?.map((provider: string) => {
          return (
            <Button
              variant="outlined"
              color="primary"
              key={provider}
              onClick={() => selectProvider(provider)}
            >
              {selectMfaContent(provider)}
            </Button>
          );
        })}
      </Stack>
      {error && <ErrorMessage response={error} />}
      <Stack direction="row" gap={2} mt={2}>
        <Button
          variant="contained"
          color="secondary"
          onClick={reset}
          sx={{ alignSelf: "flex-start" }}
        >
          Reset
        </Button>
      </Stack>
    </Stack>
  );
};

export default SelectMfaView;
