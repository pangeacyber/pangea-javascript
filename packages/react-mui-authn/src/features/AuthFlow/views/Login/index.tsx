import { FC } from "react";
import { Stack, Typography } from "@mui/material";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import {
  AuthFlowComponentProps,
  AuthFlowViewOptions,
} from "@src/features/AuthFlow/types";
import Disclaimer from "../../components/Disclaimer";
import { AuthOptions, SocialOptions } from "../../components";
import Button from "@src/components/core/Button";

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
  const { options, data, reset } = props;

  return (
    <Stack gap={2}>
      <Typography variant="h6">{getTitle(data, options)}</Typography>
      <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
        {data.email}
      </Typography>
      <AuthOptions {...props} />
      {data.authChoices.length === 0 && data.socialChoices.length === 0 && (
        <Typography variant="body2" color="error">
          There are no valid authentication methods available
        </Typography>
      )}
      <SocialOptions {...props} />
      {data.authChoices.length === 0 && (
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="center"
          gap={{ xs: 0, sm: 1 }}
        >
          <Button variant="text" onClick={reset}>
            {options.cancelLabel}
          </Button>
        </Stack>
      )}
      {data.disclaimer && <Disclaimer content={data.disclaimer} />}
    </Stack>
  );
};

export default LoginView;
