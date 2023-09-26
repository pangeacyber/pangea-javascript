import { FC, ReactNode, useEffect, useState } from "react";

import { Stack, Typography, useTheme } from "@mui/material";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import OtpForm from "../OtpForm";

const AuthTotp: FC<AuthFlowComponentProps> = (props) => {
  const { data } = props;
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<ReactNode>();

  // TODO: get totp choice from data.flow_choices

  useEffect(() => {
    if (data?.totp?.enrollment) {
      setTitle("Enroll Authenticator App");
      setContent(
        <>
          <Typography component="div" variant="body2">
            <ul style={{ listStyle: "circle", textAlign: "left" }}>
              <li>Open the Authenticator app</li>
              <li>Scan the QR Code below in the app</li>
              <li>Enter the code from your Authenticator app</li>
            </ul>
          </Typography>
          {data?.totp?.totp_secret?.qr_image}
        </>
      );
    } else {
      setTitle("Enter Authenticator App Code");
      setContent(null);
    }
  }, [data]);

  return (
    <Stack>
      <Typography variant="h6">{title}</Typography>
      {content}
      <OtpForm {...props} otpType="totp" />
    </Stack>
  );
};

export default AuthTotp;
