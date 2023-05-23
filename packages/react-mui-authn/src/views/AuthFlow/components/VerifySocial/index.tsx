import { FC } from "react";
import { Box, Stack, Typography } from "@mui/material";

import { ViewComponentProps } from "@src/views/AuthFlow/types";
import { getProviderIcon, getProviderLabel } from "@src/views/AuthFlow/utils";
import Button from "@src/components/core/Button";

const VerifySocialView: FC<ViewComponentProps> = ({ options, data, reset }) => {
  const redirectUri = data.verifyProvider?.redirect_uri || "";
  const providerName = data.verifyProvider?.provider || "";

  const socialLogin = (redirect: string) => {
    window.location.href = redirect;
  };

  return (
    <Stack gap={2}>
      <Typography variant="h6" mb={3}>
        Login with Social Authentication
      </Typography>
      <Box>
        <Typography variant="body2" component="span">
          The email
        </Typography>{" "}
        <Typography variant="body2" component="span" sx={{ fontWeight: "400" }}>
          {data.email}
        </Typography>{" "}
        <Typography variant="body2" component="span">
          is registered with
        </Typography>{" "}
        <Typography variant="body2" component="span" sx={{ fontWeight: "400" }}>
          {getProviderLabel(providerName)}.
        </Typography>
      </Box>
      <Button
        variant="contained"
        color="secondary"
        fullWidth={true}
        onClick={() => {
          socialLogin(redirectUri);
        }}
      >
        {options.showSocialIcons && (
          <>
            {getProviderIcon(providerName)}
            <Box component="span" sx={{ marginRight: 1 }} />
          </>
        )}
        Continue with {getProviderLabel(providerName)}
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
