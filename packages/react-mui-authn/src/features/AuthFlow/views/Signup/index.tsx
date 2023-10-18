import { FC } from "react";
import { Stack, Typography } from "@mui/material";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import {
  AuthFlowComponentProps,
  AuthFlowViewOptions,
} from "@src/features/AuthFlow/types";
import { AuthOptions, SocialOptions } from "../../components";
import Button from "@src/components/core/Button";
import Disclaimer from "../../components/Disclaimer";

const getDisplayData = (
  data: AuthFlow.StateData,
  options: AuthFlowViewOptions
): [string, string] => {
  if (data.phase === "phase_secondary") {
    return ["Secondary Authentication", "Setup a secondary method for "];
  }

  return [options.signupHeading || "", "Create an account with"];
};

const SignupView: FC<AuthFlowComponentProps> = (props) => {
  const { options, data, reset } = props;
  const [title, description] = getDisplayData(data, options);

  return (
    <Stack gap={2}>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
        {description} {data.email}
      </Typography>
      <AuthOptions {...props} />
      {data.authChoices.length === 0 && data.socialChoices.length === 0 && (
        <Typography variant="body2" color="error">
          There are no valid authentication methods available
        </Typography>
      )}
      {(data.invite || data.phase === "phase_secondary") && (
        <SocialOptions {...props} />
      )}
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
      {data.disclaimer && data.phase !== "phase_secondary" && (
        <Disclaimer content={data.disclaimer} />
      )}
    </Stack>
  );
};

export default SignupView;
