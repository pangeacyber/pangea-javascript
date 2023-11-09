import { FC, useEffect, useState } from "react";
import { Stack } from "@mui/material";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import Button from "@src/components/core/Button";
import ErrorMessage from "../ErrorMessage";
import { BodyText, ErrorText } from "@src/components/core/Text";

const AuthMagicLink: FC<AuthFlowComponentProps> = (props) => {
  const { options, data, error, loading, update, reset, restart } = props;

  const [checked, setChecked] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    if (checked) {
      setStatus("Verification has not been completed");
      setTimeout(() => {
        setStatus("");
      }, 3000);
    }
  }, [data]);

  const checkState = () => {
    setChecked(true);
    update(AuthFlow.Choice.NONE, {});
  };

  const sendLink = () => {
    restart(AuthFlow.Choice.MAGICLINK);
  };

  useEffect(() => {
    if (data?.magiclink?.sent === false) {
      sendLink();
    }
  }, []);

  return (
    <Stack>
      <Stack gap={1}>
        <BodyText sxProps={{ padding: "0 16px" }}>
          A Magic Link has been sent to your email, click the link in the
          message to continue.
        </BodyText>
        {error && <ErrorMessage response={error} />}
        {status && <ErrorText>{status}</ErrorText>}
        {error && <ErrorMessage response={error} />}
      </Stack>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="center"
        gap={{ xs: 0, sm: 1 }}
      >
        <Button
          fullWidth
          color="secondary"
          onClick={sendLink}
          disabled={loading}
        >
          Resend link
        </Button>
        <Button
          fullWidth
          color="primary"
          onClick={checkState}
          disabled={loading}
        >
          Verify
        </Button>
      </Stack>
    </Stack>
  );
};

export default AuthMagicLink;
