import { Button, Stack, Typography } from "@mui/material";

import { useAuthFlow } from "@pangeacyber/react-auth";

const VerifySocialView = () => {
  const { flowData, reset } = useAuthFlow();
  const redirectUri = flowData.redirectUri || "";

  const socialLogin = (redirect: string) => {
    window.location.href = redirect;
  };

  return (
    <Stack gap={2}>
      <Typography variant="h6">Verify Social</Typography>
      <Button
        variant="outlined"
        onClick={() => {
          socialLogin(redirectUri);
        }}
      >
        Continue with social
      </Button>
      <Stack direction="row" gap={2} my={2}>
        <Button variant="text" onClick={reset} sx={{ alignSelf: "flex-start" }}>
          Start Over
        </Button>
      </Stack>
    </Stack>
  );
};

export default VerifySocialView;
