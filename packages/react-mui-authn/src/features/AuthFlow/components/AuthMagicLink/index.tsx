import { FC } from "react";

import { Stack, Typography, useTheme } from "@mui/material";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";

const AuthMagicLink: FC<AuthFlowComponentProps> = (props) => {
  const { data } = props;

  return (
    <Stack>
      <Typography variant="body2">Magic Link sent</Typography>
      {/* FIXME: add messaging and resend */}
    </Stack>
  );
};

export default AuthMagicLink;
