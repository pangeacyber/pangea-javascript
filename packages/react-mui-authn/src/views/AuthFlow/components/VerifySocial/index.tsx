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
        <Button
          variant="contained"
          color="secondary"
          onClick={reset}
          sx={{ alignSelf: "flex-start" }}
        >
          Reset
        </Button>
      </Stack>
    </Stack>
  );
};

export default VerifySocialView;
