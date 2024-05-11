import { FC, useEffect, useState } from "react";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import AuthFlowLayout from "../Layout";
import IdField from "@src/components/fields/IdField";
import Button from "@src/components/core/Button";
import ErrorMessage from "../../components/ErrorMessage";
import { BodyText, ErrorText } from "@src/components/core/Text";

// TODO: Remove this view, it should no longer be used.
// the same functionality is in `../../components/AuthMagicLink`

const MagiclinkView: FC<AuthFlowComponentProps> = ({
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
    restart(AuthFlow.Choice.MAGICLINK);
  };

  const checkState = () => {
    setChecked(true);
    update(AuthFlow.Choice.NONE, {});
  };

  useEffect(() => {
    if (data?.magiclink?.sent === false) {
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
        Resend Email
      </Button>
      <Button
        fullWidth
        color="primary"
        onClick={checkState}
        disabled={loading}
        sx={{ whiteSpace: "nowrap" }}
      >
        Verification Complete
      </Button>
    </>
  );

  return (
    <AuthFlowLayout title="Magic Link Verification" buttons={buttons}>
      <IdField
        value={data?.username || data?.email}
        resetCallback={reset}
        resetLabel={options.cancelLabel}
      />
      <BodyText>
        Email sent. Click link to verify. If using another browser, come back
        and click the button below.
      </BodyText>
      {status && <ErrorText>{status}</ErrorText>}
      {error && <ErrorMessage response={error} />}
    </AuthFlowLayout>
  );
};

export default MagiclinkView;
