import { AuthFlow } from "@pangeacyber/vanilla-js";

export interface SessionData {
  flow_id?: string;
  phase?: string;
  email?: string;
  invite?: boolean;
  callbackState?: { [key: string]: string };
}

export enum FlowPhase {
  INIT = "init",
  START = "start",
  SIGNUP = "signup",
  LOGIN = "login",
  PASSWORD = "password",
  SET_PASSWORD = "set_password",
  RESET_PASSWORD = "reset_password",
  PROVISIONAL = "provisional",
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
  MISMATCH_EMAIL = "mismatch_email",
  RESTART_STATE = "restart_state",
  ERROR = "internal_error",
}

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
  update: (choice: AuthFlow.Choice, data: any) => void;
  restart: (choice: AuthFlow.RestartChoice, data?: any) => void;
  reset: () => void;
}
