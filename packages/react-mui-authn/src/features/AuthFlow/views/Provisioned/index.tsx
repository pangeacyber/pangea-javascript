import { FC, useEffect, useState } from "react";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import AuthFlowLayout from "../Layout";
import IdField from "@src/components/fields/IdField";
import Button from "@src/components/core/Button";
import ErrorMessage from "../../components/ErrorMessage";
import { BodyText, ErrorText } from "@src/components/core/Text";

const ProvisionedView: FC<AuthFlowComponentProps> = ({
  options,
  data,
  loading,
  error,
  update,
  restart,
  reset,
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

  const sendEmail = () => {
    restart(AuthFlow.Choice.PROVISIONAL);
  };

  const checkState = () => {
    setChecked(true);
    update(AuthFlow.Choice.NONE, {});
  };

  useEffect(() => {
    if (data?.provisional?.sent === false) {
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
        Verify
      </Button>
    </>
  );

  return (
    <AuthFlowLayout title="Verify account" buttons={buttons}>
      <IdField
        value={data?.email}
        resetCallback={reset}
        resetLabel={options.cancelLabel}
      />
      <BodyText sxProps={{ padding: "0 16px" }}>
        Email sent. Click the link to continue. If using another browser, come
        back and click the verify button.
      </BodyText>
      {status && <ErrorText>{status}</ErrorText>}
      {error && <ErrorMessage response={error} />}
    </AuthFlowLayout>
  );
};

export default ProvisionedView;
