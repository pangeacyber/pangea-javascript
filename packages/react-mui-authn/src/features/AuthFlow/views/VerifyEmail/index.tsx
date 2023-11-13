import { FC, useEffect, useState } from "react";
import { Stack, Typography, useTheme } from "@mui/material";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import AuthFlowLayout from "../Layout";
import Button from "@src/components/core/Button";
import IdField from "@src/components/fields/IdField";
import ErrorMessage from "../../components/ErrorMessage";
import { BodyText, ErrorText } from "@src/components/core/Text";

const VerifyEmailView: FC<AuthFlowComponentProps> = ({
  options,
  data,
  loading,
  error,
  update,
  restart,
  reset,
}) => {
  const theme = useTheme();
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

  const sendEmail = () => {
    restart(AuthFlow.Choice.VERIFY_EMAIL);
  };

  const checkState = () => {
    setChecked(true);
    update(AuthFlow.Choice.NONE, {});
  };

  useEffect(() => {
    if (data?.verifyEmail?.sent === false) {
      // FIXME: add a resend time check
      sendEmail();
    }
  }, [data]);

  const buttons = (
    <>
      <Button
        fullWidth
        color="secondary"
        onClick={sendEmail}
        disabled={loading}
      >
        Resend email
      </Button>
      <Button fullWidth color="primary" onClick={checkState} disabled={loading}>
        I'm verified
      </Button>
    </>
  );

  return (
    <AuthFlowLayout title="Verify your email" buttons={buttons}>
      <Stack gap={1}>
        <IdField
          value={data?.email}
          resetCallback={reset}
          resetLabel={options.cancelLabel}
        />
        <BodyText sxProps={{ padding: "0 16px" }}>
          Email sent. Click link to verify. If using another browser, come back
          and click the button below.
        </BodyText>

        {status && <ErrorText>{status}</ErrorText>}
        {error && <ErrorMessage response={error} />}
      </Stack>
    </AuthFlowLayout>
  );
};

export default VerifyEmailView;
