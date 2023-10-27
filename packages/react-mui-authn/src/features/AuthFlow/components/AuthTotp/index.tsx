import { FC, ReactNode, useEffect, useState } from "react";
import { Stack, Typography } from "@mui/material";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import Button from "@src/components/core/Button";
import OtpForm from "../OtpForm";

const AuthTotp: FC<AuthFlowComponentProps> = (props) => {
  const { data, options, reset } = props;
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<ReactNode>();

  useEffect(() => {
    if (data?.totp?.enrollment) {
      setTitle("Enroll Authenticator App");
      setContent(
        <>
          <Typography component="div" variant="body2">
            <ul style={{ margin: "0", listStyle: "circle", textAlign: "left" }}>
              <li>Open the Authenticator app</li>
              <li>Scan the QR Code below in the app</li>
              <li>Enter the code from your Authenticator app</li>
            </ul>
          </Typography>
          <Stack alignItems="center" textAlign="center">
            <img src={data?.totp?.totp_secret?.qr_image} alt="TOTP QR CODE" />
          </Stack>
        </>
      );
    } else {
      setTitle("Enter Authenticator App Code");
      setContent(null);
    }
  }, [data]);

  return (
    <Stack gap={2} width="100%">
      <Typography variant="body2">{title}</Typography>
      {content}
      <OtpForm {...props} otpType="totp" />
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="center"
        gap={{ xs: 0, sm: 1 }}
      >
        <Button variant="text" onClick={reset}>
          {options.cancelLabel}
        </Button>
      </Stack>
    </Stack>
  );
};

export default AuthTotp;
