import { FC } from "react";
import { Stack } from "@mui/material";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import OtpForm from "../OtpForm";
import { BodyText } from "@src/components/core/Text";

const AuthEmailOtp: FC<AuthFlowComponentProps> = (props) => {
  return (
    <Stack gap={1}>
      <BodyText>Enter the code sent to your email.</BodyText>
      <OtpForm {...props} otpType="email_otp" />
    </Stack>
  );
};

export default AuthEmailOtp;
