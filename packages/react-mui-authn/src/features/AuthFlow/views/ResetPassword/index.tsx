import { FC } from "react";
import { Stack, Typography } from "@mui/material";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import { AuthPassword } from "../../components";

const ResetPasswordView: FC<AuthFlowComponentProps> = (props) => {
  const { data } = props;

  return (
    <Stack gap={2}>
      <Typography variant="h6">Reset Password</Typography>
      <Typography variant="body2" mb={1}>
        {data.email}
      </Typography>
      <AuthPassword {...props} />
    </Stack>
  );
};

export default ResetPasswordView;
