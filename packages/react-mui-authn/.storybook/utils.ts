import { AuthFlowViewOptions } from "../src/features/AuthFlow/types";
import { PANGEA } from "../src/stories/themes/config/pangea";
import { BROWSERFLIX } from "../src/stories/themes/config/browserflix";
import { GENERIC } from "../src/stories/themes/config/generic";

export const getBrandingData = (theme: string) => {
  if (theme === "browserflix") {
    return BROWSERFLIX;
  }

  if (theme === "pangea") {
    return PANGEA;
  }

  return GENERIC;
};

export const getOptions = (data: any): AuthFlowViewOptions => {
  const options: AuthFlowViewOptions = {
    brandName: data.brand_name || "",
    startHeading: data.start_heading || "Log in or Sign up",
    startButtonLabel: data.start_button_label || "Continue with email",
    signupHeading: data.signup_heading || "Signup",
    signupButtonLabel: data.signup_button_label || "Continue",
    passwordHeading: data.password_heading || "Welcome back!",
    passwordButtonLabel: data.password_button_label || "Sign in",
    socialHeading: data.social_heading || "Other ways",
    showSocialIcons: data.authn_show_social_icons ?? true,
    otpButtonLabel: data.otp_button_label || "Submit",
    captchaHeading: data.captcha_heading || "Prove you're human",
    eulaHeading: data.eula_heading || "License Agreement",
    privacyHeading: data.privacy_heading || "Privacy Policy",
    submitLabel: data.authn_submit_label || "Submit",
    cancelLabel: data.authn_cancel_label || "Start over",
  };

  return options;
};
