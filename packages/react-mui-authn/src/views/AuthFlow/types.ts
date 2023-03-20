// Options for customizing AuthFlowView components
export interface AuthFlowViewOptions {
  submitLabel?: string;
  showEmail?: boolean;
  showReset?: boolean;
  resetLabel?: string;
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
};

export interface AuthFlowViewProps {
  options?: AuthFlowViewOptions;
  components?: AuthFlowComponents;
}

export interface ViewComponentProps {
  options: AuthFlowViewOptions;
}
