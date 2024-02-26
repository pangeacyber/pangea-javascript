import { FC } from "react";
import { Stack, Typography } from "@mui/material";

import Button from "@src/components/core/Button";
import { AuthOptionsProps } from "../AuthOptions";
import OtpForm from "../OtpForm";
import { BodyText } from "@src/components/core/Text";

const AuthSmsOtp: FC<AuthOptionsProps> = (props) => {
  const { data, updateView } = props;

  const changeNumber = () => {
    updateView("phone_number");
  };

  return (
    <Stack gap={1}>
      <BodyText>Enter the code sent to your phone.</BodyText>
      {data.phase === "phase_one_time" && (
        <Typography variant="body2">{data.phone}</Typography>
      )}
      <OtpForm {...props} otpType="sms_otp" />
      {!!data.smsOtp?.enrollment && data.phase !== "phase_one_time" && (
        <Button variant="text" onClick={changeNumber}>
          Change phone number
        </Button>
      )}
    </Stack>
  );
};

export default AuthSmsOtp;
