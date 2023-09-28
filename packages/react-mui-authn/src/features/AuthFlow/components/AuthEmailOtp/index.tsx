import { FC, useEffect } from "react";
import { Stack, Typography } from "@mui/material";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import Button from "@src/components/core/Button";
import OtpForm from "../OtpForm";

const AuthEmailOtp: FC<AuthFlowComponentProps> = (props) => {
  const { data, loading, restart } = props;

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
      <Typography variant="body1">Enter the code sent to your email</Typography>
      <OtpForm {...props} otpType="email_otp" />
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="center"
        gap={{ xs: 0, sm: 1 }}
      >
        <Button
          variant="text"
          fullWidth={true}
          onClick={sendCode}
          disabled={loading}
        >
          Resend Code
        </Button>
      </Stack>
    </Stack>
  );
};

export default AuthEmailOtp;
