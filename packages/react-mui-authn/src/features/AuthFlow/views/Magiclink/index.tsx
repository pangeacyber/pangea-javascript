import { FC, useEffect, useState } from "react";
import { Stack, Typography } from "@mui/material";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import Button from "@src/components/core/Button";
import ErrorMessage from "../../components/ErrorMessage";

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

  return (
    <Stack gap={2}>
      <Typography variant="h6">Magic Link Verification</Typography>
      <Stack gap={1}>
        <Typography variant="body2">
          An email message has been sent to {data.email}, click the link in the
          message to continue.
        </Typography>
        <Typography variant="body2">
          If you open the link in a different browser, return here and click the
          button below.
        </Typography>
        <Button color="primary" onClick={checkState} disabled={loading}>
          Verification Complete
        </Button>
        {status && (
          <Typography variant="body2" color="error">
            {status}
          </Typography>
        )}
        {error && <ErrorMessage response={error} />}
      </Stack>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="center"
        gap={{ xs: 0, sm: 1 }}
      >
        <Button variant="text" onClick={sendEmail} disabled={loading}>
          Resend Email
        </Button>
        <Button variant="text" onClick={reset}>
          {options.cancelLabel}
        </Button>
      </Stack>
    </Stack>
  );
};

export default MagiclinkView;
