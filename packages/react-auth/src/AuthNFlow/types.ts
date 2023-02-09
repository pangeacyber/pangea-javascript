export interface AuthNFlowOptions {
  signin?: boolean;
  signup?: boolean;
}

/*
  Flow data types
*/

export interface FlowStorage {
  step?: FlowStep;
  flow_id?: string;
  email?: string;
  selected_mfa?: string;
  mfa_providers?: string[];
  recaptcha_key?: string;
  qr_code?: string;
}

export enum FlowStep {
  START = "start",
  SIGNUP = "signup",
  SIGNUP_PASSWORD = "signup/password",
  SIGNUP_SOCIAL = "signup/social",
  VERIFY_SOCIAL = "verify/social",
  VERIFY_PASSWORD = "verify/password",
  VERIFY_CAPTCHA = "verify/captcha",
  VERIFY_EMAIL = "verify/email",
  ENROLL_MFA_SELECT = "enroll/mfa/select",
  ENROLL_MFA_START = "enroll/mfa/start",
  ENROLL_MFA_COMPLETE = "enroll/mfa/complete",
  VERIFY_MFA_SELECT = "verify/mfa/select",
  VERIFY_MFA_START = "verify/mfa/start",
  VERIFY_MFA_COMPLETE = "verify/mfa/complete",
  COMPLETE = "complete",
}

export interface FlowState {
  step?: FlowStep;
  flowId?: string;
  email?: string;
  selectedMfa?: string;
  mfaProviders?: string[];
  recaptchaKey?: string;
  qrCode?: string;
  passwordSignup?: boolean;
  socialSignup?: any;
  redirectUri?: string;
}

export interface FlowStart {
  email?: string;
}

export interface FlowBase {
  flowId?: string;
}

export interface FlowSignupPassword extends FlowBase {
  firstName: string;
  lastName: string;
  password: string;
}

export interface FlowVerifyPassword extends FlowBase {
  password: string;
}

export interface FlowVerifyCallback extends FlowBase {
  cbCode: string;
  cbState: string;
}

export interface FlowVerifyCaptcha extends FlowBase {
  captchaCode: string;
}

export interface FlowMfaStart extends FlowBase {
  mfaProvider: string;
  phoneNumber?: string;
}

export interface FlowMfaComplete extends FlowBase {
  code: string;
  cancel?: boolean;
}
