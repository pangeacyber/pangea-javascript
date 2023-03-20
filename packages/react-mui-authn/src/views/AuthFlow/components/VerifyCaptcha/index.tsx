import { FC } from "react";
import ReCAPTCHA from "react-google-recaptcha-enterprise";
import { Button, Stack, Typography } from "@mui/material";

import { useAuthFlow, FlowStep } from "@pangeacyber/react-auth";

import { ViewComponentProps } from "@src/views/AuthFlow/types";
import ErrorMessage from "../ErrorMessage";

const VerifyCaptchaView: FC<ViewComponentProps> = ({ options }) => {
  const { callNext, reset, error, flowData } = useAuthFlow();

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
        {options.showEmail && (
          <Typography variant="caption">{flowData.email}</Typography>
        )}
      </Stack>
      <ReCAPTCHA sitekey={flowData.recaptchaKey} onChange={handleChange} />
      {error && <ErrorMessage response={error} />}
      {options.showReset && (
        <Stack direction="row" gap={2} mt={2}>
          <Button color="primary" variant="outlined" onClick={reset}>
            {options.resetLabel}
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

export default VerifyCaptchaView;
