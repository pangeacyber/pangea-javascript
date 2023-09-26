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

export namespace AuthFlow {
  export enum Endpoint {
    START = "start",
    UPDATE = "update",
    COMPLETE = "complete",
    RESTART = "restart",
  }

  export enum Choice {
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
    NONE = "",
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
    | EmptyObject
    | PasswordResponse
    | SocialResponse
    | CaptchaResponse
    | VerifyEmailResponse
    | EmailOtpResponse
    | SmsOtpResponse
    | TotpResponse
    | ProfileResponse;

  export type ChoiceParams =
    | EmptyObject
    | StartParams
    | PasswordParams
    | SocialParams
    | EmailParams
    | EmailOtpParams
    | SmsOtpParams
    | TotpParams
    | AgreementsParams
    | ProfileParams;

  export type EmptyObject = {};

  // Password

  export interface PasswordResponse {
    enrollment: boolean;
    password_policy: PasswordPolicy;
  }

  export interface PasswordResult {
    choice: Choice.PASSWORD | Choice.SET_PASSWORD;
    data: PasswordResponse;
  }

  export interface ResetPasswordResult {
    choice: Choice.RESET_PASSWORD;
    data: EmptyObject;
  }

  export interface PasswordParams {
    password: string;
  }

  export interface PasswordRequest {
    flow_id: string;
    choice: Choice.PASSWORD;
    data: PasswordParams;
  }

  export interface SetPasswordRequest {
    flow_id: string;
    choice: Choice.SET_PASSWORD;
    data: PasswordParams;
  }

  export interface ResetPasswordRequest {
    flow_id: string;
    choice: Choice.RESET_PASSWORD;
    data: EmptyObject;
  }

  // Social

  export interface SocialResponse {
    enrollment: boolean;
    social_provider: string;
    state: string;
    redirect_uri: string;
  }

  export interface SocialResult {
    choice: Choice.SOCIAL;
    data: SocialResponse;
  }

  export interface SocialParams {
    social_provider: string;
    uri: string;
  }

  export interface SocialRequest {
    flow_id: string;
    choice: Choice.SOCIAL;
    data: SocialParams;
  }

  // Set Email

  export interface SetEmailResult {
    choice: Choice.SET_EMAIL;
    data: EmptyObject;
  }

  export interface EmailParams {
    email: string;
  }

  export interface SetEmailRequest {
    flow_id: string;
    choice: Choice.SET_EMAIL;
    data: EmailParams;
  }

  // Verify Email

  export interface VerifyEmailResult {
    choice: Choice.VERIFY_EMAIL;
    data: VerifyEmailResponse;
  }

  export interface VerifyEmailRequest {
    flow_id: string;
    choice: Choice.VERIFY_EMAIL;
    data: EmptyObject;
  }

  // Captcha

  export interface CaptchaResponse {
    site_key: string;
  }

  export interface CaptchaResult {
    choice: Choice.CAPTCHA;
    data: CaptchaResponse;
  }

  export interface CaptchaParams {
    code: string;
  }

  export interface CaptchaRequest {
    flow_id: string;
    choice: Choice.CAPTCHA;
    data: CaptchaParams;
  }

  // Verify Email

  export interface VerifyEmailResponse {
    sent: string;
    resend_time?: string;
    state: string;
  }

  export interface ResultVerifyEmail {
    choice: Choice.VERIFY_EMAIL;
    data: VerifyEmailResponse;
  }

  // Email OTP

  export interface EmailOtpResponse {
    sent: boolean;
    enrollment: boolean;
    resend_time?: string;
  }

  export interface EmailOtpResult {
    choice: Choice.EMAIL_OTP;
    data: EmailOtpResponse;
  }

  export interface EmailOtpParams {
    code: string;
  }

  export interface EmailOtpRequest {
    flow_id: string;
    choice: Choice.EMAIL_OTP;
    data: EmailOtpParams;
  }

  // SMS OTP

  export interface SmsOtpResponse {
    sent: boolean;
    enrollment: boolean;
    resend_time?: string;
    need_phone?: string;
  }

  export interface SmsOtpResult {
    choice: Choice.SMS_OTP;
    data: SmsOtpResponse;
  }

  export interface SmsOtpParams {
    code: string;
  }

  export interface SmsOtpRequest {
    flow_id: string;
    choice: Choice.SMS_OTP;
    data: SmsOtpParams;
  }

  export interface SmsOtpRestart {
    phone: string;
  }

  // TOTP

  export interface TotpSecret {
    qr_image: string;
    secret: string;
  }

  export interface TotpResponse {
    enrollment: string;
    totp_secret?: TotpSecret;
  }

  export interface TotpResult {
    choice: Choice.TOTP;
    data: TotpResponse;
  }

  export interface TotpParams {
    code: string;
  }

  export interface TotpRequest {
    flow_id: string;
    choice: Choice.TOTP;
    data: TotpParams;
  }

  // Magiclink

  export interface MagiclinkResult {
    choice: Choice.MAGICLINK;
    data: MagiclinkResponse;
  }

  export interface MagiclinkRequest {
    flow_id: string;
    choice: Choice.MAGICLINK;
    data: MagiclinkParams;
  }

  export interface MagiclinkParams {
    uri: string;
  }

  export interface MagiclinkResponse {
    sent: string;
    resend_time?: string;
    state: string;
  }

  // Agreements

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

  export interface AgreementsResult {
    choice: Choice.AGREEMENTS;
    data: AgreementsResponse;
  }

  export interface AgreementsParams {
    agreed: string[];
  }

  export interface AgreementsRequest {
    flow_id: string;
    choice: Choice.AGREEMENTS;
    data: AgreementsParams;
  }

  // Profile

  export interface ProfileField {
    id: string;
    label: string;
    type: string;
    required: boolean;
    builtin: boolean;
    show_on_signup: boolean;
  }

  export interface ProfileResponse {
    profile: ProfileField[];
  }

  export interface ProfileResult {
    choice: Choice.PROFILE;
    data: ProfileResponse;
  }

  export interface ProfileParams {
    profile: { [key: string]: string };
  }

  export interface ProfileRequest {
    flow_id: string;
    choice: Choice.PROFILE;
    data: ProfileParams;
  }

  // Status

  export interface StatusRequest {
    flow_id: string;
    choice: Choice.NONE;
    data: EmptyObject;
  }

  // Result, Request and State types

  export type Result =
    | SetEmailResult
    | PasswordResult
    | ResetPasswordResult
    | SocialResult
    | CaptchaResult
    | VerifyEmailResult
    | EmailOtpResult
    | SmsOtpResult
    | TotpResult
    | MagiclinkResult
    | AgreementsResult
    | ProfileResult;

  export interface StateData {
    flowId: string;
    flowType: string[];
    flowChoices: Result[];
    phase?: string;
    email?: string;
    invite?: boolean;
    disclaimer?: string;
    authChoices: string[];
    socialChoices: SocialResponse[];
    socialMap: { [key: string]: SocialResponse };
    agreements: AgreementData[];
    setEmail?: EmptyObject;
    password?: PasswordResponse;
    setPassword?: EmptyObject;
    resetPassword?: EmptyObject;
    verifyEmail?: VerifyEmailResponse;
    captcha?: CaptchaResponse;
    emailOtp?: EmailOtpResponse;
    smsOtp?: SmsOtpResponse;
    totp?: TotpResponse;
    magiclink?: MagiclinkResponse;
    profile?: ProfileResponse;
  }

  export interface StartRequest {
    cb_uri: string;
    flow_types: string[];
    email?: string;
    invitation?: string;
  }

  export type UpdateRequest =
    | SetEmailRequest
    | VerifyEmailRequest
    | PasswordRequest
    | SetPasswordRequest
    | ResetPasswordRequest
    | CaptchaRequest
    | SocialRequest
    | EmailOtpRequest
    | SmsOtpRequest
    | TotpRequest
    | MagiclinkRequest
    | AgreementsRequest
    | ProfileRequest
    | StatusRequest;

  export interface BaseRequest {
    flow_id: string;
    choice: "";
    data: {};
  }

  export type RestartChoice =
    | Choice.EMAIL_OTP
    | Choice.SMS_OTP
    | Choice.TOTP
    | Choice.VERIFY_EMAIL
    | Choice.RESET_PASSWORD;

  export interface RestartRequest {
    flow_id: string;
    choice: RestartChoice;
    data: {};
  }
}
