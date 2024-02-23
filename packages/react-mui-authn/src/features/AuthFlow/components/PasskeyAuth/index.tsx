import { FC, useEffect, useState } from "react";
import { Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  HourglassBottomRounded,
  VpnKeyRounded,
  WarningRounded,
} from "@mui/icons-material";
import {
  browserSupportsWebAuthn,
  startAuthentication,
  // startRegistration,
} from "@simplewebauthn/browser";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import Button from "@src/components/core/Button";
import PasskeyError from "@src/components/fields/PasskeyError";

const PasskeyAuth: FC<AuthFlowComponentProps> = ({
  options,
  update,
  restart,
  data,
  error,
}) => {
  const theme = useTheme();
  const [stage, setStage] = useState<string>("start");

  useEffect(() => {
    if (data.passkey?.enrollment === false && !data.passkey?.started) {
      console.log("Call passkey restart");
      restart(AuthFlow.Choice.PASSKEY);
    }
  }, []);

  useEffect(() => {
    if (stage === "wait" && error) {
      setStage("error");
    }
  }, [error]);

  const passkeyAuth = async () => {
    setStage("wait");
    try {
      const publicKey = data.passkey?.authentication?.publicKey;
      const autofill = data.passkey?.discovery;
      const authResp = await startAuthentication(publicKey);
      update(AuthFlow.Choice.PASSKEY, { authentication: authResp });
    } catch (e) {
      console.warn(e);
      setStage("error");
    }
  };

  if (stage === "wait") {
    return (
      <Button
        variant="text"
        fullWidth
        sx={{
          color: theme.palette.text.primary,
          cursor: "default",
        }}
      >
        <Stack
          direction="row"
          gap={1}
          alignItems="center"
          justifyContent="center"
        >
          <HourglassBottomRounded sx={{ fontSize: "20px" }} />
          Waiting for input from the browser...
        </Stack>
      </Button>
    );
  }

  if (stage === "error") {
    return (
      <PasskeyError
        label="Retry passkey"
        showLock={true}
        onClick={passkeyAuth}
      />
    );
  }

  return (
    <Button color="secondary" fullWidth onClick={passkeyAuth}>
      <Stack direction="row" gap={1}>
        <VpnKeyRounded sx={{ fontSize: "20px" }} />
        Sign in with a Passkey
      </Stack>
    </Button>
  );
};

export default PasskeyAuth;
