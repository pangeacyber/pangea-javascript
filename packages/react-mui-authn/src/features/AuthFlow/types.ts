import { AuthFlow } from "@pangeacyber/vanilla-js";

// Options for customizing AuthFlowView components
export interface AuthFlowViewOptions {
  brandName?: string;
  startHeading?: string;
  startButtonLabel?: string;
  signupHeading?: string;
  signupButtonLabel?: string;
  passwordHeading?: string;
  passwordButtonLabel?: string;
  socialHeading?: string;
  showSocialIcons?: boolean;
  otpButtonLabel?: string;
  captchaHeading?: string;
  eulaHeading?: string;
  privacyHeading?: string;
  submitLabel?: string;
  cancelLabel?: string;
  compactSignup?: boolean; // show password and captcha on signup
  rememberUser?: boolean; // show remember username on signin
}

export enum FlowPhase {
  START = "start",
  PASSWORD = "password",
  SET_PASSWORD = "set_password",
  RESET_PASSWORD = "reset_password",
  SOCIAL = "social",
  CAPTCHA = "captcha",
  VERIFY_EMAIL = "verify_email",
  EMAIL_OTP = "email_otp",
  SMS_OTP = "sms_otp",
  TOTP = "totp",
  MAGICLINK = "magiclink",
  AGREEMENTS = "agreements",
  PROFILE = "profile",
  COMPLETE = "complete",
  FLOW_RETURN = "return",
  INVALID_AUTH_METHOD = "invalid_auth",
  INVALID_STATE = "invalid_state",
}

export interface AuthFlowComponentProps {
  phase: FlowPhase;
  options: AuthFlowViewOptions;
  data: AuthFlow.StateData;
  loading?: boolean;
  error: any;
  cbParams?: {
    state: string;
    code: string;
  };
  update: (choice: AuthFlow.Choice, data: any, extra?: any) => void;
  restart: (choice: AuthFlow.RestartChoice, data?: any) => void;
  reset: () => void;
}
