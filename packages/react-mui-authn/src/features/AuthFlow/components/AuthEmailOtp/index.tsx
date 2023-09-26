import { FC, useEffect } from "react";
import { Stack, Typography } from "@mui/material";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import OtpForm from "../OtpForm";

const AuthEmailOtp: FC<AuthFlowComponentProps> = (props) => {
  const { data, restart } = props;

  useEffect(() => {
    if (data?.emailOtp?.sent === false) {
      restart(AuthFlow.Choice.EMAIL_OTP);
    }
  }, [data]);

  return (
    <Stack>
      <Typography variant="h6">Enter the code sent to your email</Typography>
      <OtpForm {...props} otpType="email_otp" />
    </Stack>
  );
};

export default AuthEmailOtp;
