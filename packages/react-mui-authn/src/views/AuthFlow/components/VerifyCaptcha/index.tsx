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
        <Typography variant="h6">{options.captchaHeading}</Typography>
      </Stack>
      <Stack gap={1}>
        <ReCAPTCHA
          sitekey={data.ç}
          onChange={handleChange}
          className="recaptcha"
        />
        {error && <ErrorMessage response={error} />}
      </Stack>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="center"
        gap={{ xs: 0, sm: 1 }}
      >
        <Button color="primary" variant="text" onClick={reset}>
          {options.cancelLabel}
        </Button>
      </Stack>
    </Stack>
  );
};

export default VerifyCaptchaView;
