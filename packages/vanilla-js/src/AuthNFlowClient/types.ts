/** Flow start options */
export interface AuthNFlowOptions {
  signin?: boolean;
  signup?: boolean;
}

/** Callback parameters */
export interface CallbackParams {
  code: string;
  state: string;
}

/**
  Flow data types
*/

export namespace AuthFlow {
  /** Flow endpoints */
  export enum Endpoint {
    START = "start",
    UPDATE = "update",
    COMPLETE = "complete",
    RESTART = "restart",
  }

  /** Flow choice options */
  export enum Choice {
    SET_EMAIL = "set_email",
    SET_USERNAME = "set_username",
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
    CONSENT = "oauth_consent",
    COMPLETE = "complete",
    NONE = "",
  }

  /** Username formats */
  export enum UsernameFormat {
    EMAIL = "email",
    STRING = "string",
    PHONE = "phone",
  }

  /** Password policy definition */
  export interface PasswordPolicy {
    chars_min: number;
    chars_max: number;
    lower_min: number;
    upper_min: number;
    punct_min: number;
    number_min: number;
  }

  /** Flow start parameters */
  export interface StartParams {
    email?: string;
    device_id?: string;
    client_id?: string;
  }

  /** Choice response */
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

  /** Choice parameters */
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
    | ConsentParams
    | ProfileParams;

  export type EmptyObject = {};

  /**
    Password choice definitions
  */

  /** Password choice response */
  export interface PasswordResponse {
    enrollment: boolean;
    password_policy: PasswordPolicy;
    need_email?: boolean;
  }

  /** Password choice result */
  export interface PasswordResult {
    choice: Choice.PASSWORD;
    data: PasswordResponse;
  }

  /** Set password response */
  export interface SetPasswordResponse {
    password_policy: PasswordPolicy;
  }

  /** Set password result */
  export interface SetPasswordResult {
    choice: Choice.SET_PASSWORD;
    data: SetPasswordResponse;
  }

  /** Reset password response */
  export interface ResetPasswordResponse {
    sent: boolean;
    resend_time: string;
    state: string;
  }

  /** Reeset password result */
  export interface ResetPasswordResult {
    choice: Choice.RESET_PASSWORD;
    data: ResetPasswordResponse;
  }

  /** Password parameters */
  export interface PasswordParams {
    password: string;
    email?: string;
  }

  /** Password verify request */
  export interface PasswordRequest {
    flow_id: string;
    choice: Choice.PASSWORD;
    data: PasswordParams;
  }

  /** Set password request */
  export interface SetPasswordRequest {
    flow_id: string;
    choice: Choice.SET_PASSWORD;
    data: PasswordParams;
  }

  /** Reset password request */
  export interface ResetPasswordRequest {
    flow_id: string;
    choice: Choice.RESET_PASSWORD;
    data: EmptyObject;
  }

  /**
    Social choice definitions
  */

  /** Social choice response */
  export interface SocialResponse {
    enrollment: boolean;
    social_provider: string;
    state: string;
    redirect_uri: string;
  }

  /** Social choice result */
  export interface SocialResult {
    choice: Choice.SOCIAL;
    data: SocialResponse;
  }

  /** Social choice parameters */
  export interface SocialParams {
    social_provider: string;
    uri: string;
  }

  /** Social choice request */
  export interface SocialRequest {
    flow_id: string;
    choice: Choice.SOCIAL;
    data: SocialParams;
  }

  /**
    SAML choice definitions
  */

  /** SAML choice response */
  export interface SamlResponse {
    enrollment: boolean;
    provider_name: string;
    provider_id: string;
    state: string;
    redirect_uri: string;
    idp_init_flow?: boolean;
  }

  /** SAML choice result */
  export interface SamlResult {
    choice: Choice.SAML;
    data: SamlResponse;
  }

  /** SAML choice data */
  export interface SamlParams {
    provider_id: string;
    provider_name: string;
    uri?: string;
    idp_flow_state?: string;
  }

  /** SAML request parameters */
  export interface SamlRequest {
    flow_id: string;
    choice: Choice.SAML;
    data: SamlParams;
  }

  /**
    Passkey choice definitions
  */

  /** Passkey choice data */
  export interface PasskeyData {
    publicKey: any;
  }

  /** Passkey choice response */
  export interface PasskeyResponse {
    enrollment: boolean;
    started: boolean;
    discovery: boolean;
    authentication?: PasskeyData;
    registration?: PasskeyData;
  }

  /** Passkey choice result */
  export interface PasskeyResult {
    choice: Choice.PASSKEY;
    data: PasskeyResponse;
  }

  /** Passkey request parameters */
  export interface PasskeyRequest {
    flow_id: string;
    choice: Choice.PASSKEY;
    data: EmptyObject;
  }

  /**
    Set Email choice definitions
  */

  /** Set Email choice response */
  export interface SetEmailResponse {
    required_for: string[];
  }

  /** Set Email choice result */
  export interface SetEmailResult {
    choice: Choice.SET_EMAIL;
    data: SetEmailResponse;
  }

  /** Set Email choice data */
  export interface EmailParams {
    email: string;
  }

  /** Set Email request parameters */
  export interface SetEmailRequest {
    flow_id: string;
    choice: Choice.SET_EMAIL;
    data: EmailParams;
  }

  /**
    Set Username choice definitions
  */

  /** Set Username choice response */
  export interface SetUsernameResponse {
    required_for: string[];
  }

  /** Set Username choice result */
  export interface SetUsernameResult {
    choice: Choice.SET_USERNAME;
    data: SetUsernameResponse;
  }

  /** Set Username choice data */
  export interface UsernameParams {
    username: string;
  }

  /** Set Username request parameters */
  export interface SetUsernameRequest {
    flow_id: string;
    choice: Choice.SET_USERNAME;
    data: UsernameParams;
  }

  /**
    Set Phone choice definitions
  */

  /** Set Phone choice result */
  export interface SetPhoneResult {
    choice: Choice.SET_PHONE;
    data: EmptyObject;
  }

  /** Set Phone choice data */
  export interface PhoneParams {
    phone: string;
  }

  /** Set Phone request parameters */
  export interface SetPhoneRequest {
    flow_id: string;
    choice: Choice.SET_PHONE;
    data: PhoneParams;
  }

  /**
    Verify Email choice definitions
  */

  /**  Verify Email choice result */
  export interface VerifyEmailResult {
    choice: Choice.VERIFY_EMAIL;
    data: VerifyEmailResponse;
  }

  /**  Verify Email chocie request parameters */
  export interface VerifyEmailRequest {
    flow_id: string;
    choice: Choice.VERIFY_EMAIL;
    data: EmptyObject;
  }

  /**  Verify Email choice response */
  export interface VerifyEmailResponse {
    sent: boolean;
    resend_time?: string;
    state: string;
    need_email?: boolean;
  }

  /**  Verify Email chocie result */
  export interface ResultVerifyEmail {
    choice: Choice.VERIFY_EMAIL;
    data: VerifyEmailResponse;
  }

  /**  Verify Email restart parameters */
  export interface VerifyEmailRestart {
    email?: string;
  }

  /**
    Captcha choice definitions
  */

  /** Captcha choice response */
  export interface CaptchaResponse {
    site_key: string;
  }

  /** Captcha choice result */
  export interface CaptchaResult {
    choice: Choice.CAPTCHA;
    data: CaptchaResponse;
  }

  /** Captcha choice data */
  export interface CaptchaParams {
    code: string;
  }

  /** Captcha request parameters */
  export interface CaptchaRequest {
    flow_id: string;
    choice: Choice.CAPTCHA;
    data: CaptchaParams;
  }

  /**
    Email OTP choice definitions
  */

  /** Email OTP choice response */
  export interface EmailOtpResponse {
    sent: boolean;
    enrollment: boolean;
    resend_time?: string;
    need_email?: boolean;
  }

  /** Email OTP choice result */
  export interface EmailOtpResult {
    choice: Choice.EMAIL_OTP;
    data: EmailOtpResponse;
  }

  /** Email OTP choice data */
  export interface EmailOtpParams {
    code: string;
  }

  /** Email OTP request parameters */
  export interface EmailOtpRequest {
    flow_id: string;
    choice: Choice.EMAIL_OTP;
    data: EmailOtpParams;
  }

  /** Email OTP restart parameters */
  export interface EmailOtpRestart {
    email: string;
  }

  /**
    SMS OTP choice definitions
  */

  /** SMS OTP choice response */
  export interface SmsOtpResponse {
    sent: boolean;
    enrollment: boolean;
    resend_time?: string;
    need_phone?: string;
  }

  /** SMS OTP choice result */
  export interface SmsOtpResult {
    choice: Choice.SMS_OTP;
    data: SmsOtpResponse;
  }

  /** SMS OTP choice data */
  export interface SmsOtpParams {
    code: string;
  }

  /** SMS OTP request parameters */
  export interface SmsOtpRequest {
    flow_id: string;
    choice: Choice.SMS_OTP;
    data: SmsOtpParams;
  }

  /** SMS OTP Restart parameters */
  export interface SmsOtpRestart {
    phone: string;
  }

  /**
    TOTP choice definitions
  */

  /** TOTP QR Code parameters */
  export interface TotpSecret {
    qr_image: string;
    secret: string;
  }

  /** TOTP choice response */
  export interface TotpResponse {
    enrollment: string;
    totp_secret?: TotpSecret;
  }

  /** TOTP choice result */
  export interface TotpResult {
    choice: Choice.TOTP;
    data: TotpResponse;
  }

  /** TOTP choice data */
  export interface TotpParams {
    code: string;
  }

  /** TOTP request parameters */
  export interface TotpRequest {
    flow_id: string;
    choice: Choice.TOTP;
    data: TotpParams;
  }

  /**
    Magiclink choice definitions
  */

  /** Magiclink choice result */
  export interface MagiclinkResult {
    choice: Choice.MAGICLINK;
    data: MagiclinkResponse;
  }

  /** Magiclink choice response */
  export interface MagiclinkResponse {
    sent: boolean;
    resend_time?: string;
    state: string;
    need_email?: boolean;
  }

  /** Magiclink restart parameters */
  export interface MagiclinkRestart {
    email: string;
  }

  /**
    Provisional choice definitions
  */

  /** Provisional choice result */
  export interface ProvisionalResult {
    choice: Choice.PROVISIONAL;
    data: ProvisionalResponse;
  }

  /** Provisional choice response */
  export interface ProvisionalResponse {
    sent: boolean;
    resend_time?: string;
    state: string;
  }

  /**
    Agreements choice definitions
  */

  /** Agreeement definition */
  export interface AgreementData {
    id: string;
    type: string;
    created_at: string;
    updated_at: string;
    published_at?: string;
    name: string;
    text: string;
  }

  /** Agreement choice response */
  export interface AgreementsResponse {
    agreements: { [key: string]: AgreementData };
  }

  /** Agreement choice result */
  export interface AgreementsResult {
    choice: Choice.AGREEMENTS;
    data: AgreementsResponse;
  }

  /** Agreement parameter list */
  export interface AgreementsParams {
    agreed: string[];
  }

  /** Agreement choice request parameters */
  export interface AgreementsRequest {
    flow_id: string;
    choice: Choice.AGREEMENTS;
    data: AgreementsParams;
  }

  /**
    User Consent choice definitions - for OAuth
  */

  /** Scope parameters */
  export interface SelectedScope {
    scope: string;
    is_allowed: boolean;
  }

  /** Consent choice response */
  export interface ConsentResponse {
    scopes: Scope[];
  }

  /** Consent choice result */
  export interface ConsentResult {
    choice: Choice.CONSENT;
    data: ConsentResponse;
  }

  /** Selected scope parameter list */
  export interface ConsentParams {
    scope_selections: SelectedScope[];
  }

  /** Consent request parameters */
  export interface ConsentRequest {
    flow_id: string;
    choice: Choice.CONSENT;
    data: ConsentParams;
  }

  /**
    Profile choice definitions
  */

  /** Profile field parameters */
  export interface ProfileField {
    id: string;
    label: string;
    type: string;
    required: boolean;
    builtin: boolean;
    show_on_signup: boolean;
  }

  /** Profile choice response */
  export interface ProfileResponse {
    fields: ProfileField[];
  }

  /** Profile choice result */
  export interface ProfileResult {
    choice: Choice.PROFILE;
    data: ProfileResponse;
  }

  /** Profile field list parameters */
  export interface ProfileParams {
    profile: { [key: string]: string };
  }

  /** Profile request parameters */
  export interface ProfileRequest {
    flow_id: string;
    choice: Choice.PROFILE;
    data: ProfileParams;
  }

  /**
    Misc definitions
  */

  /** Status choice request */
  export interface StatusRequest {
    flow_id: string;
    choice: Choice.NONE;
    data: EmptyObject;
  }

  /** Conditional MFA  parameters */
  export interface ConditionalMfaConfig {
    strict_mode: boolean;
    lifetime: number;
  }

  /** OAuth Scope definition */
  export interface Scope {
    name: string;
    display_name: string;
    description: string;
  }

  /**
    Result, Request and State types
  */

  /** Result definition */
  export type Result =
    | SetEmailResult
    | SetUsernameResult
    | SetPhoneResult
    | PasswordResult
    | SetPasswordResult
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
    | ProvisionalResult
    | ConsentResult;

  /** State data definition */
  export interface StateData {
    flowId: string;
    flowType: string[];
    flowChoices: Result[];
    phase?: string;
    email?: string;
    username?: string;
    phone?: string;
    invite?: boolean;
    complete?: boolean;
    disclaimer?: string;
    usernameFormat?: UsernameFormat;
    authChoices: string[];
    socialChoices: SocialResponse[];
    socialProviderMap: { [key: string]: SocialResponse };
    samlChoices: SamlResponse[];
    samlProviderMap: { [key: string]: SamlResponse };
    callbackStateMap: { [key: string]: string };
    passkey?: PasskeyResponse;
    agreements: AgreementData[];
    setEmail?: SetEmailResponse;
    setUsername?: SetUsernameResponse;
    setPhone?: EmptyObject;
    password?: PasswordResponse;
    setPassword?: SetPasswordResponse;
    resetPassword?: ResetPasswordResponse;
    verifyEmail?: VerifyEmailResponse;
    captcha?: CaptchaResponse;
    emailOtp?: EmailOtpResponse;
    smsOtp?: SmsOtpResponse;
    totp?: TotpResponse;
    magiclink?: MagiclinkResponse;
    profile?: ProfileResponse;
    provisional?: ProvisionalResponse;
    conditionalMfa?: ConditionalMfaConfig;
    scopes?: Scope[];
  }

  /** Start request parameters */
  export interface StartRequest {
    cb_uri: string;
    flow_types: string[];
    email?: string;
    invitation?: string;
    device_id?: string;
    client_id?: string;
  }

  /** Update request options */
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
    | ProfileRequest
    | ConsentRequest;

  /** Base flow request parameters */
  export interface BaseRequest {
    flow_id: string;
    choice: "";
    data: {};
  }

  /** Complete request parameters */
  export interface CompleteRequest {
    flow_id: string;
    device_id?: string;
  }

  /** Restart choice options */
  export type RestartChoice =
    | Choice.EMAIL_OTP
    | Choice.SMS_OTP
    | Choice.TOTP
    | Choice.PASSKEY
    | Choice.VERIFY_EMAIL
    | Choice.RESET_PASSWORD
    | Choice.MAGICLINK
    | Choice.PROVISIONAL;

  /** Restart choice parameters */
  export interface RestartRequest {
    flow_id: string;
    choice: RestartChoice;
    data: EmptyObject | SmsOtpRestart | EmailOtpRestart | MagiclinkRestart;
  }
}
