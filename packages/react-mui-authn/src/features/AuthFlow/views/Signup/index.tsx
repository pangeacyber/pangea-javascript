import { FC } from "react";
import { Stack, Typography } from "@mui/material";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";

import { AuthOptions, SocialOptions } from "../../components";
import Disclaimer from "../../components/Disclaimer";

const SignupView: FC<AuthFlowComponentProps> = (props) => {
  const { options, data, reset } = props;

  return (
    <Stack gap={2}>
      <Typography variant="h6">{options.signupHeading}</Typography>
      <Typography variant="body2" mb={1} sx={{ wordBreak: "break-word" }}>
        Create an account with {data.email}
      </Typography>
      <AuthOptions {...props} />
      {data.invite && <SocialOptions data={data} options={options} />}
      {data.disclaimer && <Disclaimer content={data.disclaimer} />}
    </Stack>
  );
};

export default SignupView;
