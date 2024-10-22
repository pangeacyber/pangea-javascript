import { FC, useEffect, useState } from "react";
import { Stack, Typography } from "@mui/material";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import Button from "@src/components/core/Button";
import { BodyText } from "@src/components/core/Text";
import OtpForm from "../OtpForm";
import EmailForm from "../EmailForm";

const AuthEmailOtp: FC<AuthFlowComponentProps> = (props) => {
  const { data } = props;
  const [showEmail, setShowEmail] = useState<boolean>(false);

  useEffect(() => {
    if (!data?.emailOtp?.need_email) {
      setShowEmail(false);
    }
  }, [data]);

  const changeEmail = () => {
    setShowEmail(true);
  };

  if (!!data?.emailOtp?.need_email || showEmail) {
    return (
      <>
        <BodyText sxProps={{ padding: "0 16px" }}>
          Enter an email for SMS verification.
        </BodyText>
        <EmailForm {...props} choice={AuthFlow.Choice.EMAIL_OTP} />
      </>
    );
  }

  return (
    <Stack gap={1}>
      <BodyText>Enter the code sent to your email.</BodyText>
      {data.phase === "phase_one_time" && (
        <Typography variant="body2">{data.email}</Typography>
      )}
      <OtpForm {...props} otpType="email_otp" />
      {data.usernameFormat !== AuthFlow.UsernameFormat.EMAIL &&
        data.emailOtp?.enrollment && (
          <Button variant="text" onClick={changeEmail}>
            Change email address
          </Button>
        )}
    </Stack>
  );
};

export default AuthEmailOtp;
