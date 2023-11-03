import { FC, useEffect, useState } from "react";
import { Stack, Typography } from "@mui/material";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import Button from "@src/components/core/Button";
import ErrorMessage from "../ErrorMessage";

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
        <Typography variant="body2">
          A Magic Link has been sent to your email, click the link in the
          message to continue.
        </Typography>
        {error && <ErrorMessage response={error} />}
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
        <Button variant="text" onClick={sendLink} disabled={loading}>
          Resend link
        </Button>
        {data.phase !== "phase_one_time" && (
          <Button variant="text" onClick={reset}>
            {options.cancelLabel}
          </Button>
        )}
      </Stack>
    </Stack>
  );
};

export default AuthMagicLink;
