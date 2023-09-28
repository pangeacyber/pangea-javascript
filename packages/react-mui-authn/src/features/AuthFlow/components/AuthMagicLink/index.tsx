import { FC, useEffect } from "react";
import { Stack, Typography } from "@mui/material";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import Button from "@src/components/core/Button";
import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";

const AuthMagicLink: FC<AuthFlowComponentProps> = (props) => {
  const { options, data, loading, reset, restart } = props;

  const sendLink = () => {
    restart(AuthFlow.Choice.MAGICLINK);
  };

  useEffect(() => {
    if (data?.magiclink?.sent === false) {
      sendLink();
    }
  }, []);

  return (
    <Stack gap={1}>
      <Typography variant="body1">Magic Link sent to your email</Typography>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="center"
        gap={{ xs: 0, sm: 1 }}
      >
        <Button variant="text" onClick={sendLink} disabled={loading}>
          Resend Magic Link
        </Button>
      </Stack>
    </Stack>
  );
};

export default AuthMagicLink;
