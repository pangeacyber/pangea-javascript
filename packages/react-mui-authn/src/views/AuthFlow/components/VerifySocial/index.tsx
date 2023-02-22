import { Button, Stack, Typography } from "@mui/material";

import { useAuthFlow } from "@pangeacyber/react-auth";

const VerifySocialView = () => {
  const { flowData, reset } = useAuthFlow();
  const redirectUri = flowData.verifyProvider?.redirect_uri || "";

  const socialLogin = (redirect: string) => {
    window.location.href = redirect;
  };

  return (
    <Stack gap={2}>
      <Typography variant="h6">Login with Social Authentication</Typography>
      <Typography variant="caption">{flowData.email}</Typography>
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
        <Button color="primary" variant="outlined" onClick={reset}>
          Start Over
        </Button>
      </Stack>
    </Stack>
  );
};

export default VerifySocialView;
