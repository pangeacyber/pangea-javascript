import { FC } from "react";
import { useAuthFlow, FlowStep } from "@pangeacyber/react-auth";

import {
  EnrollMfaCompleteView,
  EnrollMfaStartView,
  ResetPasswordView,
  SelectMfaView,
  SignupView,
  StartView,
  VerifyCaptchaView,
  VerifyEmailView,
  VerifyMfaCompleteView,
  VerifyPasswordView,
  VerifySocialView,
} from "./components";

import { AuthFlowViewOptions, AuthFlowViewProps } from "./types";

const DEAULT_OPTIONS: AuthFlowViewOptions = {
  submitLabel: "Submit",
  showEmail: true,
  showReset: true,
  resetLabel: "Start Over",
};

const AuthFlowView: FC<AuthFlowViewProps> = ({ options, components }) => {
  const { step } = useAuthFlow();

  const viewOptions = {
    ...DEAULT_OPTIONS,
    ...options,
  };

  switch (step) {
    case FlowStep.START:
      return components?.EnrollMfaStart || <StartView options={viewOptions} />;
    case FlowStep.SIGNUP:
      return components?.Signup || <SignupView options={viewOptions} />;
    case FlowStep.VERIFY_PASSWORD:
      return (
        components?.VerifyPassword || (
          <VerifyPasswordView options={viewOptions} />
        )
      );
    case FlowStep.VERIFY_SOCIAL:
      return (
        components?.VerifySocial || <VerifySocialView options={viewOptions} />
      );
    case FlowStep.VERIFY_EMAIL:
      return (
        components?.VerifyEmail || <VerifyEmailView options={viewOptions} />
      );
    case FlowStep.VERIFY_CAPTCHA:
      return (
        components?.VerifyCaptcha || <VerifyCaptchaView options={viewOptions} />
      );
    case FlowStep.ENROLL_MFA_START:
      return (
        components?.EnrollMfaStart || (
          <EnrollMfaStartView options={viewOptions} />
        )
      );
    case FlowStep.ENROLL_MFA_COMPLETE:
      return (
        components?.EnrollMfaComplete || (
          <EnrollMfaCompleteView options={viewOptions} />
        )
      );
    case FlowStep.ENROLL_MFA_SELECT:
    case FlowStep.VERIFY_MFA_SELECT:
      return components?.SelectMfa || <SelectMfaView options={viewOptions} />;
    case FlowStep.VERIFY_MFA_START:
    case FlowStep.VERIFY_MFA_COMPLETE:
      return (
        components?.VerifyMfaComplete || (
          <VerifyMfaCompleteView options={viewOptions} />
        )
      );
    case FlowStep.RESET_PASSWORD:
      return (
        components?.ResetPassword || <ResetPasswordView options={viewOptions} />
      );
    default:
      return <></>;
  }
};

export default AuthFlowView;
