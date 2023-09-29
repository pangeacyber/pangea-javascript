import { FC } from "react";
import { Stack, Typography } from "@mui/material";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import {
  AuthFlowComponentProps,
  AuthFlowViewOptions,
} from "@src/features/AuthFlow/types";
import Disclaimer from "../../components/Disclaimer";
import { AuthOptions } from "../../components";

const getTitle = (
  data: AuthFlow.StateData,
  options: AuthFlowViewOptions
): string => {
  if (
    data.password?.enrollment ||
    data.smsOtp?.enrollment ||
    data.emailOtp?.enrollment ||
    data.totp?.enrollment
  ) {
    if (data.phase === "phase_secondary") {
      return "Enroll Secondary Method";
    } else {
      return "Enroll Primary Method";
    }
  }

  return options.passwordHeading || "";
};

const LoginView: FC<AuthFlowComponentProps> = (props) => {
  const { options, data } = props;

  return (
    <Stack gap={2}>
      <Typography variant="h6">{getTitle(data, options)}</Typography>
      <Typography variant="body2" mb={1} sx={{ wordBreak: "break-word" }}>
        {data.email}
      </Typography>
      <AuthOptions {...props} />
      {data.disclaimer && <Disclaimer content={data.disclaimer} />}
    </Stack>
  );
};

export default LoginView;
