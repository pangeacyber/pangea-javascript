import { FC } from "react";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import { ErrorMessage } from "@src/features/AuthFlow/components";
import InvalidState from "./views/InvalidState";
import StartView from "./views/Start";
import SignupView from "./views/Signup";
import SigninView from "./views/Signin";
import CaptchaView from "./views/Captcha";
import ProfileView from "./views/Profile";
import AgreementView from "./views/Agreement";
import StatusMessage from "./components/StatusMessage";
import VerifyEmailView from "./views/VerifyEmail";

const AuthFlowComponent: FC<AuthFlowComponentProps> = (props) => {
  const { data, loading } = props;

  if (loading) {
    return <StatusMessage message="Loading..." />;
  }

  // Start View - email entry and social options
  if (!data?.email && (data?.setEmail || data?.socialChoices?.length > 0)) {
    return <StartView {...props} />;
  }

  // Signup View - auth mehtod selection
  if (data?.flowType.includes("signup") && data?.authChoices.length > 0) {
    return <SignupView {...props} />;
  }

  // Sigin/Login View - auth methond selection
  if (data?.flowType.includes("signin") && data?.authChoices.length > 0) {
    return <SigninView {...props} />;
  }

  // Agreements acceptance
  if (data?.agreements && data.agreements.length > 0) {
    return <AgreementView {...props} />;
  }

  // Verify email
  if (data?.verifyEmail) {
    return <VerifyEmailView {...props} />;
  }

  // Profile form
  if (data?.profile?.fields && data.profile.fields.length > 0) {
    return <ProfileView {...props} />;
  }

  // Catpcha View
  if (data?.captcha) {
    return <CaptchaView {...props} />;
  }

  return <InvalidState {...props} />;
};

export { ErrorMessage };

export default AuthFlowComponent;
