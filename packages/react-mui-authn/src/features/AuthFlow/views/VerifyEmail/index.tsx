import { FC, useEffect, useState } from "react";
import { Stack } from "@mui/material";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import AuthFlowLayout from "../Layout";
import Button from "@src/components/core/Button";
import IdField from "@src/components/fields/IdField";
import { BodyText, ErrorText } from "@src/components/core/Text";
import ErrorMessage from "../../components/ErrorMessage";
import EmailForm from "../../components/EmailForm";

const VerifyEmailView: FC<AuthFlowComponentProps> = (props) => {
  const { options, data, loading, error, update, restart, reset } = props;
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

    if (!data?.verifyEmail?.need_email) {
      setShowEmail(false);
    }
  }, [data]);

  const sendEmail = () => {
    restart(AuthFlow.Choice.VERIFY_EMAIL);
  };

  const checkState = () => {
    setChecked(true);
    update(AuthFlow.Choice.NONE, {});
  };

  const changeEmail = () => {
    setShowEmail(true);
  };

  useEffect(() => {
    if (!data?.verifyEmail?.sent && !data?.verifyEmail?.need_email) {
      // FIXME: add a resend time check
      sendEmail();
    }
  }, [data]);

  return (
    <AuthFlowLayout title="Verify your email">
      <Stack gap={1}>
        <IdField
          value={data?.username || data?.email}
          resetCallback={reset}
          resetLabel={options.cancelLabel}
        />
        {!!data?.verifyEmail?.need_email || showEmail ? (
          <>
            <BodyText sxProps={{ padding: "0 16px" }}>
              Enter an email for verification.
            </BodyText>
            <EmailForm {...props} choice={AuthFlow.Choice.VERIFY_EMAIL} />
          </>
        ) : (
          <>
            <BodyText sxProps={{ padding: "0 16px" }}>
              Email sent. Click link to verify. If using another browser, come
              back and click the button below.
            </BodyText>
            {status && <ErrorText>{status}</ErrorText>}
            {error && <ErrorMessage response={error} />}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="center"
              gap={{ xs: 0, sm: 1 }}
            >
              <Button
                fullWidth
                color="secondary"
                onClick={sendEmail}
                disabled={loading}
              >
                Resend email
              </Button>
              <Button
                fullWidth
                color="primary"
                onClick={checkState}
                disabled={loading}
              >
                I'm verified
              </Button>
            </Stack>
            {/* Allow changing email for verification, if email is not the username */}
            {data.usernameFormat !== AuthFlow.UsernameFormat.EMAIL && (
              <Button variant="text" onClick={changeEmail}>
                Change email address
              </Button>
            )}
          </>
        )}
      </Stack>
    </AuthFlowLayout>
  );
};

export default VerifyEmailView;
