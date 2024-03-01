import { FC, useEffect, useState } from "react";
import { Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { HourglassBottomRounded, WarningRounded } from "@mui/icons-material";
import { startRegistration } from "@simplewebauthn/browser";

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
    if (data.passkey?.enrollment && !data.passkey?.started) {
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

    const publicKey = data.passkey?.registration?.publicKey;

    try {
      const authResp = await startRegistration(publicKey);
      update(AuthFlow.Choice.PASSKEY, { registration: authResp });
    } catch (e) {
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
    return <PasskeyError label="Retry passkey" onClick={passkeyAuth} />;
  }

  return (
    <Button fullWidth onClick={passkeyAuth}>
      Add passkey
    </Button>
  );
};

export default PasskeyAuth;
