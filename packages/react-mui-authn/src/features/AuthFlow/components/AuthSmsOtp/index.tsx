import { FC } from "react";
import { Stack, Typography } from "@mui/material";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import Button from "@src/components/core/Button";
import { BodyText } from "@src/components/core/Text";
import { AuthOptionsProps } from "../AuthOptions";
import OtpForm from "../OtpForm";
import { formatPhoneNumber } from "@src/utils";

const AuthSmsOtp: FC<AuthOptionsProps> = (props) => {
  const { data, updateView } = props;

  const changeNumber = () => {
    updateView("phone_number");
  };

  return (
    <Stack gap={1}>
      <BodyText>Enter the code sent to your phone.</BodyText>
      {data.phase === "phase_one_time" && (
        <Typography variant="body2">{formatPhoneNumber(data.phone)}</Typography>
      )}
      <OtpForm {...props} otpType="sms_otp" />
      {!!data.smsOtp?.enrollment &&
        data.phase !== "phase_one_time" &&
        data.usernameFormat != AuthFlow.UsernameFormat.PHONE && (
          <Button variant="text" onClick={changeNumber}>
            Change phone number
          </Button>
        )}
    </Stack>
  );
};

export default AuthSmsOtp;
