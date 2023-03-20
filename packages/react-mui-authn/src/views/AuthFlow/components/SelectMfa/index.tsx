import { FC } from "react";
import { Button, Stack, Typography } from "@mui/material";

import { useAuthFlow, FlowStep } from "@pangeacyber/react-auth";

import { ViewComponentProps } from "@src/views/AuthFlow/types";
import ErrorMessage from "../ErrorMessage";

const SelectMfaView: FC<ViewComponentProps> = ({ options }) => {
  const { callNext, reset, flowData, error, step } = useAuthFlow();
  const nextStep =
    step === FlowStep.ENROLL_MFA_SELECT
      ? FlowStep.ENROLL_MFA_COMPLETE
      : FlowStep.VERIFY_MFA_COMPLETE;

  const selectProvider = (provider: string) => {
    if (flowData.cancelMfa) {
      callNext(nextStep, { mfaProvider: provider, cancel: true });
    } else {
      callNext(FlowStep.ENROLL_MFA_START, { mfaProvider: provider });
    }
  };

  const selectMfaContent = (provider: string) => {
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
        {options.showEmail && (
          <Typography variant="caption">{flowData.email}</Typography>
        )}
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
      {options.showReset && (
        <Stack direction="row" gap={2} mt={2}>
          <Button color="primary" variant="outlined" onClick={reset}>
            {options.resetLabel}
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

export default SelectMfaView;
