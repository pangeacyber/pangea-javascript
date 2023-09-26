import { FC, useEffect } from "react";
import { Button, Stack, Typography } from "@mui/material";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import OtpForm from "../OtpForm";

const AuthSmsOtp: FC<AuthFlowComponentProps> = (props) => {
  const { data, options, loading, restart, reset } = props;

  const sendCode = () => {
    restart(AuthFlow.Choice.SMS_OTP);
  };

  useEffect(() => {
    if (data?.smsOtp?.sent === false) {
      sendCode();
    }
  }, [data]);

  return (
    <Stack>
      <Typography variant="h6">Enter the code sent to your email</Typography>
      <OtpForm {...props} otpType="sms_otp" />
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="center"
        gap={{ xs: 0, sm: 1 }}
      >
        <Button variant="text" onClick={sendCode} disabled={loading}>
          Resend Code
        </Button>
        <Button variant="text" onClick={reset}>
          {options.cancelLabel}
        </Button>
      </Stack>
    </Stack>
  );
};

export default AuthSmsOtp;
