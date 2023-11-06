import { FC, ReactNode, useEffect, useState } from "react";
import { Stack } from "@mui/material";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import OtpForm from "../OtpForm";
import { BodyText } from "@src/components/core/Text";

const AuthTotp: FC<AuthFlowComponentProps> = (props) => {
  const { data, options, reset } = props;
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<ReactNode>();

  useEffect(() => {
    if (data?.totp?.enrollment) {
      setTitle("Enroll Authenticator App");
      setContent(
        <>
          <BodyText>
            <ul style={{ margin: "0", listStyle: "circle", textAlign: "left" }}>
              <li>Open the Authenticator app</li>
              <li>Scan the QR Code below in the app</li>
              <li>Enter the code from your Authenticator app</li>
            </ul>
          </BodyText>
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
    <Stack gap={1} width="100%">
      <BodyText>{title}</BodyText>
      {content}
      <OtpForm {...props} otpType="totp" />
    </Stack>
  );
};

export default AuthTotp;
