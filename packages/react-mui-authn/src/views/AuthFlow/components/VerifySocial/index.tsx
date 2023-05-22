import { FC } from "react";
import { Stack, Typography } from "@mui/material";

import { ViewComponentProps } from "@src/views/AuthFlow/types";
import Button from "@src/components/core/Button";

const VerifySocialView: FC<ViewComponentProps> = ({ options, data, reset }) => {
  const redirectUri = data.verifyProvider?.redirect_uri || "";

  const socialLogin = (redirect: string) => {
    window.location.href = redirect;
  };

  return (
    <Stack gap={2}>
      <Typography variant="h6" mb={3}>
        Login with Social Authentication
      </Typography>
      {options.showEmail && (
        <Typography variant="body2">{data.email}</Typography>
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
      <Stack direction="row" justifyContent="center" gap={2} mt={2}>
        {options.showReset && (
          <Button variant="text" onClick={reset}>
            {options.resetLabel}
          </Button>
        )}
      </Stack>
    </Stack>
  );
};

export default VerifySocialView;
