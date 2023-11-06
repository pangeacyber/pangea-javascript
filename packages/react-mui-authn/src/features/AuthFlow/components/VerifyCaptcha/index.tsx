import { FC } from "react";
import ReCAPTCHA from "react-google-recaptcha-enterprise";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import ErrorMessage from "../ErrorMessage";
import AuthFlowLayout from "../../views/Layout";
import IdField from "@src/components/fields/IdField";

const VerifyCaptchaView: FC<AuthFlowComponentProps> = ({
  options,
  data,
  error,
  update,
  reset,
}) => {
  const handleChange = (value: string) => {
    const payload: AuthFlow.CaptchaParams = {
      code: value,
    };
    update(AuthFlow.Choice.CAPTCHA, payload);
  };

  return (
    <AuthFlowLayout title={options.captchaHeading}>
      <IdField
        value={data.email}
        resetCallback={reset}
        resetLabel={options.cancelLabel}
      />
      <ReCAPTCHA
        sitekey={data?.captcha?.site_key}
        onChange={handleChange}
        className="recaptcha"
      />
      {error && <ErrorMessage response={error} />}
    </AuthFlowLayout>
  );
};

export default VerifyCaptchaView;
