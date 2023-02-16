import ReCAPTCHA from "react-google-recaptcha-enterprise";
import { Button, Stack, Typography } from "@mui/material";

import { useAuthFlow, FlowStep } from "@pangeacyber/react-auth";

const VerifyCaptchaView = () => {
  const { callNext, reset, flowData } = useAuthFlow();

  const handleChange = (value: string) => {
    const payload = {
      captchaCode: value,
    };
    callNext(FlowStep.VERIFY_CAPTCHA, payload);
  };

  return (
    <Stack gap={2}>
      <Stack>
        <Typography variant="h6">Prove you're human</Typography>
        <Typography variant="caption">{flowData.email}</Typography>
      </Stack>
      <ReCAPTCHA sitekey={flowData.recaptchaKey} onChange={handleChange} />
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

export default VerifyCaptchaView;
