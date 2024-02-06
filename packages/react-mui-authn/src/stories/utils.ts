export const getOptions = (data: any) => {
  const options = {
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
