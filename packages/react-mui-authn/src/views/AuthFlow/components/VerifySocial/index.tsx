import { FC } from "react";
import { Button, Stack, Typography } from "@mui/material";

import { useAuthFlow } from "@pangeacyber/react-auth";

import { ViewComponentProps } from "@src/views/AuthFlow/types";

const VerifySocialView: FC<ViewComponentProps> = ({ options }) => {
  const { flowData, reset } = useAuthFlow();
  const redirectUri = flowData.verifyProvider?.redirect_uri || "";

  const socialLogin = (redirect: string) => {
    window.location.href = redirect;
  };

  return (
    <Stack gap={2}>
      <Typography variant="h6">Login with Social Authentication</Typography>
      {options.showEmail && (
        <Typography variant="caption">{flowData.email}</Typography>
      )}
      <Typography variant="body1">
        This email is registered with Social Authentication
      </Typography>
      <Button
        variant="outlined"
        onClick={() => {
          socialLogin(redirectUri);
        }}
      >
        Continue with social
      </Button>
      <Stack direction="row" gap={2} mt={2}>
        {options.showReset && (
          <Button color="primary" variant="outlined" onClick={reset}>
            {options.resetLabel}
          </Button>
        )}
      </Stack>
    </Stack>
  );
};

export default VerifySocialView;
