import { FC } from "react";

import { Stack, Typography, useTheme } from "@mui/material";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import OtpForm from "../OtpForm";

const AuthEmailOtp: FC<AuthFlowComponentProps> = (props) => {
  const { data } = props;

  return (
    <Stack>
      <Typography variant="h6">Enter the code sent to your email</Typography>
      <OtpForm {...props} otpType="email_otp" />
    </Stack>
  );
};

export default AuthEmailOtp;
