import { FC } from "react";
import { Stack, Typography } from "@mui/material";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import {
  AuthFlowComponentProps,
  AuthFlowViewOptions,
} from "@src/features/AuthFlow/types";
import { AuthOptions, SocialOptions } from "../../components";
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
  const { options, data } = props;
  const [title, description] = getDisplayData(data, options);

  return (
    <Stack gap={2}>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="body2" mb={1} sx={{ wordBreak: "break-word" }}>
        {description} {data.email}
      </Typography>
      <AuthOptions {...props} />
      {(data.invite || data.phase === "phase_secondary") && (
        <SocialOptions {...props} />
      )}
      {data.disclaimer && data.phase !== "phase_secondary" && (
        <Disclaimer content={data.disclaimer} />
      )}
    </Stack>
  );
};

export default SignupView;
