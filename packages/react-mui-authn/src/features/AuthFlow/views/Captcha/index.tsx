import { FC, useEffect, useState } from "react";
import { Stack, Typography } from "@mui/material";
import ReCAPTCHA from "react-google-recaptcha-enterprise";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import AuthFlowLayout from "../Layout";
import IdField from "@src/components/fields/IdField";
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
    <AuthFlowLayout title={options.captchaHeading}>
      <IdField
        value={data.email}
        resetCallback={reset}
        resetLabel={options.cancelLabel}
      />
      <Stack gap={1} key={`recaptcha-view-${viewKey}`}>
        <ReCAPTCHA
          sitekey={data.captcha?.site_key}
          onChange={handleChange}
          className="recaptcha"
        />
        {error && <ErrorMessage response={error} />}
      </Stack>
    </AuthFlowLayout>
  );
};

export default CaptchaView;
