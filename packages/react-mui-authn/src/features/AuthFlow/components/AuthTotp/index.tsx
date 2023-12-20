import { FC, ReactNode, useEffect, useState } from "react";
import { Chip, Stack, Typography } from "@mui/material";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import Button from "@src/components/core/Button";
import OtpForm from "../OtpForm";
import { BodyText } from "@src/components/core/Text";

const TOTP_BULLETS = [
  "Open Authenticator app",
  "Scan the QR Code",
  "Enter code below",
];

const AuthTotp: FC<AuthFlowComponentProps> = (props) => {
  const { data, options, reset } = props;
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<ReactNode>();
  const [fullCode, setFullCode] = useState<boolean>(false);

  useEffect(() => {
    if (data?.totp?.enrollment) {
      setTitle("Enroll Authenticator App");
      setContent(
        <Stack direction="row" gap={1} mb={1} alignItems="center">
          <Stack gap={1}>
            {TOTP_BULLETS.map((item, idx) => {
              return (
                <Stack
                  direction="row"
                  gap={1}
                  alignItems="center"
                  justifyContent="flex-start"
                >
                  <Chip label={idx + 1} />
                  <BodyText>{item}</BodyText>
                </Stack>
              );
            })}
          </Stack>
          <Stack
            alignItems="center"
            sx={{ cursor: "pointer" }}
            onClick={() => {
              setFullCode(true);
            }}
          >
            <img
              src={data?.totp?.totp_secret?.qr_image}
              width="120px"
              alt="TOTP QR Code"
            />
          </Stack>
        </Stack>
      );
    } else {
      setTitle("Enter Authenticator App Code");
      setContent(null);
    }
  }, [data]);

  if (fullCode) {
    return (
      <Stack
        gap={1}
        sx={{
          width: "100%",
        }}
      >
        <img src={data?.totp?.totp_secret?.qr_image} alt="TOTP QR Code" />
        <Button
          color="secondary"
          onClick={() => {
            setFullCode(false);
          }}
        >
          Go back
        </Button>
      </Stack>
    );
  }

  return (
    <Stack gap={1} width="100%">
      <BodyText>{title}</BodyText>
      {content}
      <OtpForm {...props} otpType="totp" />
    </Stack>
  );
};

export default AuthTotp;
