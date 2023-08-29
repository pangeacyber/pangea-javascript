import { FlowStep } from "@pangeacyber/react-auth";

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
  next: (endpoint: FlowStep, data: any) => void;
  reset?: () => void;
  step?: FlowStep;
  cbParams?: {
    state: string;
    code: string;
  };
}
