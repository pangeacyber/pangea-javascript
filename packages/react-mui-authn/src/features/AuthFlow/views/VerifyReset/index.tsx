import { FC, useEffect, useState } from "react";
import { Stack, Typography } from "@mui/material";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import AuthFlowLayout from "../Layout";
import Button from "@src/components/core/Button";
import IdField from "@src/components/fields/IdField";
import ErrorMessage from "../../components/ErrorMessage";
import { BodyText, ErrorText } from "@src/components/core/Text";

const VerifyResetView: FC<AuthFlowComponentProps> = ({
  options,
  data,
  error,
  update,
  reset,
  restart,
}) => {
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

  const sendEmail = () => {
    restart(AuthFlow.Choice.RESET_PASSWORD, {});
  };

  const buttons = (
    <>
      <Button fullWidth color="secondary" onClick={sendEmail}>
        Resend email
      </Button>
      <Button fullWidth color="primary" onClick={checkState}>
        Verify
      </Button>
    </>
  );

  return (
    <AuthFlowLayout title="Reset Password" buttons={buttons}>
      <Stack gap={1}>
        <IdField
          value={data?.username || data?.email}
          resetCallback={reset}
          resetLabel={options.cancelLabel}
        />
        <BodyText sxProps={{ padding: "0 16px" }}>
          Email sent. Click the link to reset. If using another browser, come
          back and click the button below.
        </BodyText>
      </Stack>
      {status && <ErrorText>{status}</ErrorText>}
      {error && <ErrorMessage response={error} />}
    </AuthFlowLayout>
  );
};

export default VerifyResetView;
