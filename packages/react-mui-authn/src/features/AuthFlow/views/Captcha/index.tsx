import { FC, useEffect, useState } from "react";
import { Stack, Typography } from "@mui/material";
import ReCAPTCHA from "react-google-recaptcha-enterprise";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import ErrorMessage from "../../components/ErrorMessage";
import Button from "@src/components/core/Button";

const CaptchaView: FC<AuthFlowComponentProps> = (props) => {
  const { options, data, error, update, reset } = props;
  const [viewKey, setViewKey] = useState<string>("");

  useEffect(() => {
    updateViewKey();
  }, [error]);

  const updateViewKey = () => {
    const newKey = new Date().valueOf().toString();
    setViewKey(newKey);
  };

  const handleChange = async (value: string): Promise<void> => {
    if (value) {
      const payload: AuthFlow.CaptchaParams = {
        code: value,
      };
      update(AuthFlow.Choice.CAPTCHA, payload);
    }
  };

  // don't render until viewKey is set
  if (!viewKey) {
    return <></>;
  }

  return (
    <Stack gap={2}>
      <Typography variant="h6">{options.captchaHeading}</Typography>
      <Typography variant="body2" mb={1} sx={{ wordBreak: "break-word" }}>
        {data.email}
      </Typography>
      <Stack gap={1} key={`recaptcha-view-${viewKey}`}>
        <ReCAPTCHA
          sitekey={data.captcha?.site_key}
          onChange={handleChange}
          className="recaptcha"
        />
        {error && <ErrorMessage response={error} />}
      </Stack>
      <Stack direction="row" justifyContent="center" gap={1}>
        <Button variant="text" onClick={reset}>
          {options.cancelLabel}
        </Button>
      </Stack>
    </Stack>
  );
};

export default CaptchaView;
