// Move to vanilla-js client class, remove from react-auth
export enum FlowStep {
  START = "start",
  SIGNUP = "signup",
  SIGNUP_PASSWORD = "signup/password",
  SIGNUP_SOCIAL = "signup/social",
  VERIFY_SOCIAL = "verify/social",
  VERIFY_PASSWORD = "verify/password",
  VERIFY_CAPTCHA = "verify/captcha",
  VERIFY_EMAIL = "verify/email",
  ENROLL_MFA_SELECT = "enroll/mfa/select", // UI-only state
  ENROLL_MFA_START = "enroll/mfa/start",
  ENROLL_MFA_COMPLETE = "enroll/mfa/complete",
  VERIFY_MFA_SELECT = "verify/mfa/select",
  VERIFY_MFA_START = "verify/mfa/start",
  VERIFY_MFA_COMPLETE = "verify/mfa/complete",
  VERIFY_RESET = "verify/password_reset",
  RESET_PASSWORD = "reset/password",
  MFA_SELECT = "mfa/select",
  FLOW_GET = "get",
  VERIFY_EULA = "verify/eula",
  COMPLETE = "complete",
  FLOW_RETURN = "return", // UI-only state
  INVALID_AUTH_METHOD = "invalid/auth", // UI-only state
  INVALID_STATE = "invalid/state", // UI-only state
}

// Options for customizing AuthFlowView components
export interface AuthFlowViewOptions {
  submitLabel?: string;
  showEmail?: boolean;
  showReset?: boolean;
  resetLabel?: string;
  showSocialIcons?: boolean;
  brandName?: string;
}

// Pass custom components to AuthFlow
export type AuthFlowComponents = {
  EnrollMfaComplete?: JSX.Element;
  EnrollMfaStart?: JSX.Element;
  ResetPassword?: JSX.Element;
  SelectMfa?: JSX.Element;
  Signup?: JSX.Element;
  Start?: JSX.Element;
  VerifyCaptcha?: JSX.Element;
  VerifyEmail?: JSX.Element;
  VerifyMfaComplete?: JSX.Element;
  VerifyPassword?: JSX.Element;
  VerifySocial?: JSX.Element;
  InvalidState?: JSX.Element;
  InvalidAuth?: JSX.Element;
};

export interface AuthFlowViewProps {
  options?: AuthFlowViewOptions;
  components?: AuthFlowComponents;
}

export interface ViewComponentProps {
  options: AuthFlowViewOptions;
  data: any;
  loading: boolean;
  error: any;
  next: (path: FlowStep, payload: any) => void;
  reset?: () => void;
  step?: FlowStep;
  cbParams?: {
    state: string;
    code: string;
  };
}
