import { FC, useEffect, useState } from "react";
import { Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { HourglassBottomRounded, VpnKeyRounded } from "@mui/icons-material";
import {
  startAuthentication,
  browserSupportsWebAuthn,
  WebAuthnError,
} from "@simplewebauthn/browser";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import Button from "@src/components/core/Button";
import PasskeyError from "@src/components/fields/PasskeyError";
import { base64UrlDecode } from "@src/utils";

const PasskeyAuth: FC<AuthFlowComponentProps> = ({
  update,
  restart,
  data,
  error,
}) => {
  const theme = useTheme();
  const [stage, setStage] = useState<string>("start");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const passkeyEnabled = !!data?.passkey && browserSupportsWebAuthn();

  useEffect(() => {
    if (data.passkey?.enrollment === false && !data.passkey?.started) {
      restart(AuthFlow.Choice.PASSKEY);
    } else if (
      data.passkey?.enrollment === false &&
      data.passkey?.started &&
      data.passkey?.discovery
    ) {
      passkeyDiscovery();
    }
  }, [data]);

  useEffect(() => {
    if (stage === "wait" && error) {
      setStage("error");
    }
  }, [error]);

  const passkeyDiscovery = async () => {
    try {
      const publicKey = data.passkey?.authentication?.publicKey;
      const authResp = await startAuthentication({
        optionsJSON: publicKey,
        useBrowserAutofill: true,
      });
      authResp.response.userHandle = base64UrlDecode(
        authResp.response.userHandle || ""
      );
      update(AuthFlow.Choice.PASSKEY, { authentication: authResp });
    } catch (err: any) {
      if (err instanceof WebAuthnError) {
        if (err.name !== "AbortError") {
          setStage("error");
          setErrorMsg(err.message);
        }
      } else {
        setStage("error");
        console.debug("PASSKEY ERROR:", err);
      }
    }
  };

  const passkeyAuth = async () => {
    setStage("wait");
    try {
      const publicKey = data.passkey?.authentication?.publicKey;
      const authResp = await startAuthentication({ optionsJSON: publicKey });
      authResp.response.userHandle = base64UrlDecode(
        authResp.response.userHandle || ""
      );
      update(AuthFlow.Choice.PASSKEY, { authentication: authResp });
    } catch (err) {
      if (err instanceof WebAuthnError) {
        if (err.name !== "AbortError") {
          setStage("error");
          setErrorMsg(err.message);
        }
      } else {
        setStage("error");
        console.debug("PASSKEY ERROR:", err);
      }
    }
  };

  // show nothing if passkeys not avaialable
  if (!passkeyEnabled) {
    return null;
  }

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
        error={errorMsg}
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
