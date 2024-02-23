import { FC, useEffect, useState } from "react";
import { Stack, Typography } from "@mui/material";
import { browserSupportsWebAuthn } from "@simplewebauthn/browser";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import AuthFlowLayout from "../Layout";
import Button from "@src/components/core/Button";
import { BodyText } from "@src/components/core/Text";
import PasskeyReg from "../../components/PasskeyReg";

const PasskeyView: FC<AuthFlowComponentProps> = (props) => {
  const { options, data, error, loading, update, reset } = props;
  const passkeyEnabled =
    !!data?.passkey?.registration && browserSupportsWebAuthn();

  useEffect(() => {}, []);

  const complete = (suppress: boolean) => {
    update(AuthFlow.Choice.COMPLETE, { suppress });
  };

  return (
    <AuthFlowLayout title="Add a passkey">
      <Stack gap={1}>
        <BodyText>
          Your device supports passkeys, a password replacement that validates
          your identity using touch, facial recognition, a device password, or a
          PIN.
        </BodyText>
        <BodyText>
          Passkeys can be used for sign-in as a simple and secure alternative to
          your password and two-factor credentials.
        </BodyText>
      </Stack>
      <PasskeyReg {...props} />
      <Button
        color="secondary"
        onClick={() => {
          complete(false);
        }}
      >
        Ask again later
      </Button>
      <Button
        variant="text"
        onClick={() => {
          complete(true);
        }}
      >
        Don't ask again for this browser
      </Button>
    </AuthFlowLayout>
  );
};

export default PasskeyView;
