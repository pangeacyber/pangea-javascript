import { FC } from "react";
import { Stack, Typography } from "@mui/material";

import { FlowStep } from "@pangeacyber/react-auth";

import { ViewComponentProps } from "@src/views/AuthFlow/types";
import Button from "@src/components/core/Button";
import ErrorMessage from "../ErrorMessage";

const SelectMfaView: FC<ViewComponentProps> = ({
  options,
  data,
  error,
  step,
  next,
  reset,
}) => {
  const nextStep =
    step === FlowStep.ENROLL_MFA_SELECT
      ? FlowStep.ENROLL_MFA_COMPLETE
      : FlowStep.VERIFY_MFA_COMPLETE;

  const selectProvider = (provider: string) => {
    if (data.cancelMfa) {
      next(nextStep, { mfaProvider: provider, cancel: true });
    } else {
      next(FlowStep.ENROLL_MFA_START, { mfaProvider: provider });
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
        <Typography variant="h6" mb={4}>
          Select MFA method
        </Typography>
        {options.showEmail && (
          <Typography variant="body2">{data.email}</Typography>
        )}
      </Stack>
      <Stack gap={2}>
        {data.mfaProviders?.map((provider: string) => {
          return (
            <Button
              variant="contained"
              color="secondary"
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
        <Stack direction="row" justifyContent="center" gap={2} mt={2}>
          <Button variant="text" onClick={reset}>
            {options.resetLabel}
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

export default SelectMfaView;
