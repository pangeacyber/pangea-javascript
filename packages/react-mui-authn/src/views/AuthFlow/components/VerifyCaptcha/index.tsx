import { FC } from "react";
import ReCAPTCHA from "react-google-recaptcha-enterprise";
import { Stack, Typography } from "@mui/material";

import { FlowStep } from "@pangeacyber/react-auth";

import { ViewComponentProps } from "@src/views/AuthFlow/types";
import Button from "@src/components/core/Button";
import ErrorMessage from "../ErrorMessage";

const VerifyCaptchaView: FC<ViewComponentProps> = ({
  options,
  data,
  error,
  next,
  reset,
}) => {
  const handleChange = (value: string) => {
    const payload = {
      captchaCode: value,
    };
    next(FlowStep.VERIFY_CAPTCHA, payload);
  };

  return (
    <Stack gap={2}>
      <Stack>
        <Typography variant="h6" mb={1}>
          Prove you're human
        </Typography>
      </Stack>
      <ReCAPTCHA sitekey={data.recaptchaKey} onChange={handleChange} />
      {error && <ErrorMessage response={error} />}
      {options.showReset && (
        <Stack direction="row" justifyContent="center" gap={2} mt={2}>
          <Button color="primary" variant="text" onClick={reset}>
            {options.resetLabel}
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

export default VerifyCaptchaView;
