import { FC } from "react";
import { useAuthFlow, FlowStep } from "@pangeacyber/react-auth";

import {
  AgreementAcceptView,
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
  showSocialIcons: true,
};

const AuthFlowView: FC<AuthFlowViewProps> = ({ options, components }) => {
  const { step, flowData, loading, error, callNext, reset } = useAuthFlow();

  const viewOptions = {
    ...DEAULT_OPTIONS,
    ...options,
  };

  switch (step) {
    case FlowStep.START:
      return (
        components?.EnrollMfaStart || (
          <StartView
            options={viewOptions}
            data={flowData}
            loading={loading}
            error={error}
            next={callNext}
          />
        )
      );
    case FlowStep.SIGNUP:
      return (
        components?.Signup || (
          <SignupView
            options={viewOptions}
            data={flowData}
            loading={loading}
            error={error}
            next={callNext}
            reset={reset}
          />
        )
      );
    case FlowStep.VERIFY_PASSWORD:
      return (
        components?.VerifyPassword || (
          <VerifyPasswordView
            options={viewOptions}
            data={flowData}
            loading={loading}
            error={error}
            next={callNext}
            reset={reset}
          />
        )
      );
    case FlowStep.VERIFY_SOCIAL:
      return (
        components?.VerifySocial || (
          <VerifySocialView
            options={viewOptions}
            data={flowData}
            loading={loading}
            error={error}
            next={callNext}
            reset={reset}
          />
        )
      );
    case FlowStep.VERIFY_EMAIL:
      return (
        components?.VerifyEmail || (
          <VerifyEmailView
            options={viewOptions}
            data={flowData}
            loading={loading}
            error={error}
            next={callNext}
            reset={reset}
          />
        )
      );
    case FlowStep.VERIFY_CAPTCHA:
      return (
        components?.VerifyCaptcha || (
          <VerifyCaptchaView
            options={viewOptions}
            data={flowData}
            loading={loading}
            error={error}
            next={callNext}
            reset={reset}
          />
        )
      );
    case FlowStep.ENROLL_MFA_START:
      return (
        components?.EnrollMfaStart || (
          <EnrollMfaStartView
            options={viewOptions}
            data={flowData}
            loading={loading}
            error={error}
            next={callNext}
            reset={reset}
          />
        )
      );
    case FlowStep.ENROLL_MFA_COMPLETE:
      return (
        components?.EnrollMfaComplete || (
          <EnrollMfaCompleteView
            options={viewOptions}
            data={flowData}
            loading={loading}
            error={error}
            next={callNext}
            reset={reset}
          />
        )
      );
    case FlowStep.VERIFY_EULA:
      return (
        <AgreementAcceptView
          options={viewOptions}
          data={flowData}
          loading={loading}
          error={error}
          next={callNext}
          reset={reset}
        />
      );
    case FlowStep.ENROLL_MFA_SELECT:
    case FlowStep.VERIFY_MFA_SELECT:
      return (
        components?.SelectMfa || (
          <SelectMfaView
            step={step}
            options={viewOptions}
            data={flowData}
            loading={loading}
            error={error}
            next={callNext}
            reset={reset}
          />
        )
      );
    case FlowStep.VERIFY_MFA_START:
    case FlowStep.VERIFY_MFA_COMPLETE:
      return (
        components?.VerifyMfaComplete || (
          <VerifyMfaCompleteView
            options={viewOptions}
            data={flowData}
            loading={loading}
            error={error}
            next={callNext}
            reset={reset}
          />
        )
      );
    case FlowStep.RESET_PASSWORD:
      return (
        components?.ResetPassword || (
          <ResetPasswordView
            options={viewOptions}
            data={flowData}
            loading={loading}
            error={error}
            next={callNext}
            reset={reset}
          />
        )
      );
    default:
      return <></>;
  }
};

export {
  EnrollMfaCompleteView,
  EnrollMfaStartView,
  AgreementAcceptView,
  InvalidAuthView,
  InvalidStateView,
  ResetPasswordView,
  SelectMfaView,
  SignupView,
  StartView,
  VerifyCaptchaView,
  VerifyEmailView,
  VerifyMfaCompleteView,
  VerifyPasswordView,
  VerifySocialView,
  ErrorMessage,
  Disclaimer,
} from "./components";

export default AuthFlowView;
