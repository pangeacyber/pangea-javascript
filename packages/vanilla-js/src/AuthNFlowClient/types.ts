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
    SET_PHONE = "set_phone",
    RESET_PASSWORD = "reset_password",
    SOCIAL = "social",
    SAML = "saml",
    PASSKEY = "passkey",
    CAPTCHA = "captcha",
    VERIFY_EMAIL = "verify_email",
    EMAIL_OTP = "email_otp",
    SMS_OTP = "sms_otp",
    TOTP = "totp",
    MAGICLINK = "magiclink",
    AGREEMENTS = "agreements",
    PROFILE = "profile",
    PROVISIONAL = "provisional_enrollment",
    COMPLETE = "complete",
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
    | SamlResponse
    | PasskeyResponse
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
    | SamlParams
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

  export interface ResetPasswordResponse {
    sent: boolean;
    resend_time: string;
    state: string;
  }

  export interface ResetPasswordResult {
    choice: Choice.RESET_PASSWORD;
    data: ResetPasswordResponse;
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

  // SAML

  export interface SamlResponse {
    enrollment: boolean;
    provider_name: string;
    provider_id: string;
    state: string;
    redirect_uri: string;
    idp_init_flow?: boolean;
  }

  export interface SamlResult {
    choice: Choice.SAML;
    data: SamlResponse;
  }

  export interface SamlParams {
    provider_id: string;
    provider_name: string;
    uri?: string;
    idp_flow_state?: string;
  }

  export interface SamlRequest {
    flow_id: string;
    choice: Choice.SAML;
    data: SamlParams;
  }

  // Passkey

  export interface PasskeyData {
    publicKey: any;
  }

  export interface PasskeyResponse {
    enrollment: boolean;
    started: boolean;
    discovery: boolean;
    authentication?: PasskeyData;
    registration?: PasskeyData;
  }

  export interface PasskeyResult {
    choice: Choice.PASSKEY;
    data: PasskeyResponse;
  }

  export interface PasskeyRequest {
    flow_id: string;
    choice: Choice.PASSKEY;
    data: EmptyObject;
  }

  // Set Email

  export interface SetEmailResponse {
    required_for: string[];
  }

  export interface SetEmailResult {
    choice: Choice.SET_EMAIL;
    data: SetEmailResponse;
  }

  export interface EmailParams {
    email: string;
  }

  export interface SetEmailRequest {
    flow_id: string;
    choice: Choice.SET_EMAIL;
    data: EmailParams;
  }

  // Set Phone

  export interface SetPhoneResult {
    choice: Choice.SET_PHONE;
    data: EmptyObject;
  }

  export interface PhoneParams {
    phone: string;
  }

  export interface SetPhoneRequest {
    flow_id: string;
    choice: Choice.SET_PHONE;
    data: PhoneParams;
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
    sent: boolean;
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

  export interface MagiclinkResponse {
    sent: boolean;
    resend_time?: string;
    state: string;
  }

  // Provisional

  export interface ProvisionalResult {
    choice: Choice.PROVISIONAL;
    data: ProvisionalResponse;
  }

  export interface ProvisionalResponse {
    sent: boolean;
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
    agreements: { [key: string]: AgreementData };
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
    fields: ProfileField[];
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
    | SetPhoneResult
    | PasswordResult
    | ResetPasswordResult
    | SocialResult
    | SamlResult
    | PasskeyResult
    | CaptchaResult
    | VerifyEmailResult
    | EmailOtpResult
    | SmsOtpResult
    | TotpResult
    | MagiclinkResult
    | AgreementsResult
    | ProfileResult
    | ProvisionalResult;

  export interface StateData {
    flowId: string;
    flowType: string[];
    flowChoices: Result[];
    phase?: string;
    email?: string;
    phone?: string;
    invite?: boolean;
    complete?: boolean;
    disclaimer?: string;
    authChoices: string[];
    socialChoices: SocialResponse[];
    socialProviderMap: { [key: string]: SocialResponse };
    samlChoices: SamlResponse[];
    samlProviderMap: { [key: string]: SamlResponse };
    callbackStateMap: { [key: string]: string };
    passkey?: PasskeyResponse;
    agreements: AgreementData[];
    setEmail?: SetEmailResponse;
    setPhone?: EmptyObject;
    password?: PasswordResponse;
    setPassword?: EmptyObject;
    resetPassword?: ResetPasswordResponse;
    verifyEmail?: VerifyEmailResponse;
    captcha?: CaptchaResponse;
    emailOtp?: EmailOtpResponse;
    smsOtp?: SmsOtpResponse;
    totp?: TotpResponse;
    magiclink?: MagiclinkResponse;
    profile?: ProfileResponse;
    provisional?: ProvisionalResponse;
  }

  export interface StartRequest {
    cb_uri: string;
    flow_types: string[];
    email?: string;
    invitation?: string;
  }

  export type UpdateRequest =
    | SetEmailRequest
    | SetPhoneRequest
    | VerifyEmailRequest
    | PasswordRequest
    | SamlRequest
    | SetPasswordRequest
    | ResetPasswordRequest
    | CaptchaRequest
    | SocialRequest
    | SamlRequest
    | EmailOtpRequest
    | SmsOtpRequest
    | TotpRequest
    | AgreementsRequest
    | ProfileRequest
    | StatusRequest
    | ProfileRequest;

  export interface BaseRequest {
    flow_id: string;
    choice: "";
    data: {};
  }

  export interface CompleteRequest {
    flow_id: string;
  }

  export type RestartChoice =
    | Choice.EMAIL_OTP
    | Choice.SMS_OTP
    | Choice.TOTP
    | Choice.PASSKEY
    | Choice.VERIFY_EMAIL
    | Choice.RESET_PASSWORD
    | Choice.MAGICLINK
    | Choice.PROVISIONAL;

  export interface RestartRequest {
    flow_id: string;
    choice: RestartChoice;
    data: {};
  }
}
