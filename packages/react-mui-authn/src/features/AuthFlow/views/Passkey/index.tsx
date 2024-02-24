import { FC } from "react";
import { Stack, Typography } from "@mui/material";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import AuthFlowLayout from "../Layout";
import Button from "@src/components/core/Button";
import PasskeyReg from "../../components/PasskeyReg";

const PasskeyView: FC<AuthFlowComponentProps> = (props) => {
  const { update } = props;

  const complete = (suppress: boolean) => {
    update(AuthFlow.Choice.COMPLETE, { suppress });
  };

  return (
    <AuthFlowLayout title="Add a passkey">
      <Stack>
        <Typography variant="body2">
          Your device supports passkeys, a passwordless approach secured by
          biometrics or a PIN.
        </Typography>
        <Typography variant="body2">
          Note: Your biometrics are never shared.
        </Typography>
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
