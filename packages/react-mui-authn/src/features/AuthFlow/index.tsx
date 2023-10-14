import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";

import StartView from "./views/Start";
import LoginView from "./views/Login";
import SignupView from "./views/Signup";
import CaptchaView from "./views/Captcha";
import ProfileView from "./views/Profile";
import ProvisionedView from "./views/Provisioned";
import AgreementView from "./views/Agreement";
import StatusMessageView from "./components/StatusMessage";
import VerifyEmailView from "./views/VerifyEmail";
import VerifyResetView from "./views/VerifyReset";
import ResetPasswordView from "./views/ResetPassword";
import InvalidAuthView from "./views/InvalidAuth";
import MismatchEmailView from "./views/MismatchEmail";
import ErrorView from "./views/Error";

export {
  AuthFlowComponentProps,
  StartView,
  LoginView,
  SignupView,
  CaptchaView,
  ProfileView,
  ProvisionedView,
  AgreementView,
  VerifyEmailView,
  VerifyResetView,
  ResetPasswordView,
  StatusMessageView,
  MismatchEmailView,
  InvalidAuthView,
  ErrorView,
};
