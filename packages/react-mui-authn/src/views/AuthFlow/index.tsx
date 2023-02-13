import { useAuthFlow, FlowStep } from "@pangeacyber/react-auth";

import {
  EnrollMfaCompleteView,
  EnrollMfaStartView,
  SelectMfaView,
  SignupView,
  StartView,
  VerifyCaptchaView,
  VerifyEmailView,
  VerifyMfaCompleteView,
  VerifyPasswordView,
  VerifySocialView,
} from "./components";

const AuthFlowView = () => {
  const { step } = useAuthFlow();

  switch (step) {
    case FlowStep.START:
      return <StartView />;
    case FlowStep.SIGNUP:
      return <SignupView />;
    case FlowStep.VERIFY_PASSWORD:
      return <VerifyPasswordView />;
    case FlowStep.VERIFY_SOCIAL:
      return <VerifySocialView />;
    case FlowStep.VERIFY_EMAIL:
      return <VerifyEmailView />;
    case FlowStep.VERIFY_CAPTCHA:
      return <VerifyCaptchaView />;
    case FlowStep.ENROLL_MFA_START:
      return <EnrollMfaStartView />;
    case FlowStep.ENROLL_MFA_COMPLETE:
      return <EnrollMfaCompleteView />;
    case FlowStep.ENROLL_MFA_SELECT:
    case FlowStep.VERIFY_MFA_SELECT:
      return <SelectMfaView />;
    case FlowStep.VERIFY_MFA_START:
    case FlowStep.VERIFY_MFA_COMPLETE:
      return <VerifyMfaCompleteView />;
    default:
      return <></>;
  }
};

export default AuthFlowView;
