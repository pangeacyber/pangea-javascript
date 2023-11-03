import { FC, useEffect } from "react";
import { Stack, Typography } from "@mui/material";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import Button from "@src/components/core/Button";
import OtpForm from "../OtpForm";

const AuthEmailOtp: FC<AuthFlowComponentProps> = (props) => {
  const { options, data, loading, restart, reset } = props;

  const sendCode = () => {
    restart(AuthFlow.Choice.EMAIL_OTP);
  };

  useEffect(() => {
    if (data?.emailOtp?.sent === false) {
      sendCode();
    }
  }, []);

  return (
    <Stack gap={1}>
      <Typography variant="body2">Enter the code sent to your email</Typography>
      <OtpForm {...props} otpType="email_otp" />
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="center"
        gap={{ xs: 0, sm: 1 }}
      >
        <Button variant="text" onClick={sendCode} disabled={loading}>
          Resend code
        </Button>
        {data.phase !== "phase_one_time" && (
          <Button variant="text" onClick={reset}>
            {options.cancelLabel}
          </Button>
        )}
      </Stack>
    </Stack>
  );
};

export default AuthEmailOtp;
