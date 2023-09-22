export interface AuthNFlowOptions {
  signin?: boolean;
  signup?: boolean;
}

export interface CallbackParams {
  code: string;
  state: string;
}

/*
  Flow data types
*/

export enum FlowEndpoint {
  START = "start",
  UPDATE = "update",
  COMPLETE = "complete",
  RESTART = "restart",
}

export enum FlowChoice {
  START = "start",
  SET_EMAIL = "set_email",
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
  GET_STATUS = "",
}

export interface PasswordPolicy {
  chars_min: number;
  chars_max: number;
  lower_min: number;
  upper_min: number;
  punct_min: number;
  number_min: number;
}

export interface StartParams {
  email?: string;
}

export type ChoiceResponse =
  | PasswordResponse
  | SocialResponse
  | CaptchaResponse
  | VerifyEmailResponse
  | EmailOtpResponse
  | SmsOtpResponse
  | TotpResponse;

export type ChoiceParams =
  | {}
  | PasswordParams
  | EmailParams
  | SocialParams
  | CaptchaParams
  | SocialParams
  | EmailOtpParams
  | SmsOtpParams
  | TotpParams
  | MagiclinkParams
  | AgreementsParams
  | ProfileParams;

export interface PasswordResponse {
  enrollment: boolean;
  password_policy: PasswordPolicy;
}

export interface FlowResultPassword {
  choice: FlowChoice.PASSWORD;
  data: PasswordResponse;
}

export interface PasswordParams {
  password: string;
}

export interface SocialResponse {
  enrollment: boolean;
  social_provider: string;
  state: string;
  redirect_uri: string;
}

export interface FlowResultSocial {
  choice: FlowChoice.SOCIAL;
  data: SocialResponse;
}

export interface SocialParams {
  social_provider: string;
  uri: string;
}

export interface EmailParams {
  email: string;
}

export interface CaptchaResponse {
  site_key: string;
}

export interface CaptchaParams {
  code: string;
}

export interface FlowResultCaptcha {
  choice: FlowChoice.CAPTCHA;
  data: CaptchaResponse;
}

export interface VerifyEmailResponse {
  sent: string;
  resend_time?: string;
  state: string;
}

export interface FlowResultVerifyEmail {
  choice: FlowChoice.VERIFY_EMAIL;
  data: VerifyEmailResponse;
}

export interface EmailOtpResponse {
  sent: boolean;
  enrollment: boolean;
  resend_time?: string;
}

export interface FlowResultEmailOtp {
  choice: FlowChoice.EMAIL_OTP;
  data: EmailOtpResponse;
}

export interface EmailOtpParams {
  code: string;
}

export interface SmsOtpResponse {
  sent: boolean;
  enrollment: boolean;
  resend_time?: string;
  need_phone?: string;
}

export interface FlowResultSmsOtp {
  choice: FlowChoice.SMS_OTP;
  data: SmsOtpResponse;
}

export interface SmsOtpParams {
  code: string;
}

export interface SmsOtpRestart {
  phone: string;
}

export interface TotpSecret {
  qr_image: string;
  secret: string;
}

export interface TotpResponse {
  enrollment: string;
  totp_secret?: TotpSecret;
}

export interface FlowResultTotp {
  choice: FlowChoice.TOTP;
  data: TotpResponse;
}

export interface TotpParams {
  code: string;
}

export interface MagiclinkParams {
  uri: string;
}

export interface AgreementData {
  id: string;
  type: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
  name: string;
  text: string;
}

export interface AgreementsResponse {
  agreements: AgreementData[];
}

export interface FlowResultAgreements {
  choice: FlowChoice.AGREEMENTS;
  data: AgreementsResponse;
}

export interface AgreementsParams {
  agreed: string[];
}

export interface ProfileResponse {
  // TODO: data format will change
  profile: { [key: string]: string };
}

export interface ProfileParams {
  profile: { [key: string]: string };
}

export interface FlowResultProfile {
  choice: FlowChoice.PROFILE;
  data: AgreementsResponse;
}

export type FlowResult =
  | FlowResultPassword
  | FlowResultSocial
  | FlowResultCaptcha
  | FlowResultVerifyEmail
  | FlowResultEmailOtp
  | FlowResultSmsOtp
  | FlowResultTotp
  | FlowResultAgreements
  | FlowResultProfile;

export interface FlowData {
  flow_id: string;
  flow_type: string[];
  flow_choices: FlowChoice[];
  phase?: string;
  email?: string;
  auth_choices: string[];
  social_choices: SocialResponse[];
  agreements: AgreementData[];
  choice_map: { [key: string]: ChoiceResponse };
}

export interface FlowStartRequest {
  cb_uri: string;
  flow_types: string[];
  email?: string;
  invitation?: string;
}

export interface FlowUpdateRequest {
  flow_id: string;
  choice: FlowChoice;
  data: ChoiceParams;
}

export interface FlowBaseRequest {
  flow_id: string;
}
