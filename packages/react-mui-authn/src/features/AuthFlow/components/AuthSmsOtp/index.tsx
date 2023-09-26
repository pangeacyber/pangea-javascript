import { FC } from "react";

import { Stack, Typography, useTheme } from "@mui/material";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import OtpForm from "../OtpForm";

const AuthSmsOtp: FC<AuthFlowComponentProps> = (props) => {
  return (
    <Stack>
      <Typography variant="h6">Enter the code sent to your email</Typography>
      <OtpForm {...props} otpType="sms_otp" />
    </Stack>
  );
};

export default AuthSmsOtp;
