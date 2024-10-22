import { FC, useEffect, useState } from "react";
import { Stack } from "@mui/material";
import ReCAPTCHA from "react-google-recaptcha-enterprise";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";

interface CaptchaComponentProps extends AuthFlowComponentProps {
  submitHandler: (code: string) => void;
  errorHandler?: () => void;
}

const VerifyCaptchaView: FC<CaptchaComponentProps> = (props) => {
  const { data, error, submitHandler, errorHandler } = props;
  const [viewKey, setViewKey] = useState<string>("");

  useEffect(() => {
    updateViewKey();
  }, [error]);

  const updateViewKey = () => {
    const newKey = new Date().valueOf().toString();
    setViewKey(newKey);
  };

  const handleChange = async (value: string): Promise<void> => {
    submitHandler(value);
  };

  const handleError = async (): Promise<void> => {
    !!errorHandler && errorHandler();
  };

  // don't render until viewKey is set
  if (!viewKey) {
    return <></>;
  }

  return (
    <Stack key={`recaptcha-view-${viewKey}`}>
      <ReCAPTCHA
        sitekey={data?.captcha?.site_key}
        onChange={handleChange}
        onErrored={handleError}
        className="recaptcha"
      />
    </Stack>
  );
};

export default VerifyCaptchaView;
