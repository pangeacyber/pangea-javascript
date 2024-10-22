import { FC, useEffect, useState } from "react";
import { Stack } from "@mui/material";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import Button from "@src/components/core/Button";
import ErrorMessage from "../ErrorMessage";
import { BodyText, ErrorText } from "@src/components/core/Text";
import EmailForm from "../EmailForm";

const AuthMagicLink: FC<AuthFlowComponentProps> = (props) => {
  const { data, error, loading, update, restart } = props;

  const [checked, setChecked] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");
  const [showEmail, setShowEmail] = useState<boolean>(false);

  useEffect(() => {
    if (checked) {
      setStatus("Verification has not been completed");
      setTimeout(() => {
        setStatus("");
      }, 3000);
    }

    if (!data?.magiclink?.need_email) {
      setShowEmail(false);
    }
  }, [data]);

  const checkState = () => {
    setChecked(true);
    update(AuthFlow.Choice.NONE, {});
  };

  const sendLink = () => {
    restart(AuthFlow.Choice.MAGICLINK);
  };

  const changeEmail = () => {
    setShowEmail(true);
  };

  useEffect(() => {
    if (!data?.magiclink?.sent && !data?.magiclink?.need_email) {
      sendLink();
    }
  }, []);

  if (!!data?.magiclink?.need_email || showEmail) {
    return (
      <Stack gap={1}>
        <BodyText sxProps={{ padding: "0 16px" }}>
          Enter an email for Magic Link verification.
        </BodyText>
        <EmailForm {...props} choice={AuthFlow.Choice.MAGICLINK} />
      </Stack>
    );
  }

  return (
    <Stack gap={1}>
      <BodyText sxProps={{ padding: "0 16px" }}>
        A Magic Link has been sent to your email, click the link in the message
        to continue.
      </BodyText>
      {error && <ErrorMessage response={error} />}
      {status && <ErrorText>{status}</ErrorText>}
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
      {data.usernameFormat !== AuthFlow.UsernameFormat.EMAIL &&
        data.emailOtp?.enrollment && (
          <Button variant="text" onClick={changeEmail}>
            Change email address
          </Button>
        )}
    </Stack>
  );
};

export default AuthMagicLink;
