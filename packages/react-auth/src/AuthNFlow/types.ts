/**
 * Describes the possible options to configure AuthN's flow
 *
 * @hidden
 */
export interface AuthNFlowOptions {
  /**
   * Whether or not to allow sign in options
   */
  signin?: boolean;

  /**
   * Whether or not to allow sign up options
   */
  signup?: boolean;
}

/**
 * Describes the structure of our flow state to be saved in Localstorage
 *
 * @hidden
 */
export interface FlowStorage {
  /**
   * The flow step to store
   */
  step?: FlowStep;

  /**
   * The ID of the flow state to store
   */
  flow_id?: string;

  /**
   * The email address related to the flow
   */
  email?: string;

  /**
   * The selected MFA options
   */
  selected_mfa?: string;

  /**
   * The available MFA providers
   */
  mfa_providers?: string[];

  /**
   * The token or key returned from Google Recaptcha (? TODO: Is this accurate?)
   */
  recaptcha_key?: string;

  /**
   * TODO
   */
  qr_code?: string;
}

/**
 * Describes the possible flow steps
 *
 * @hidden
 */
export enum FlowStep {
  START = "start",
  SIGNUP = "signup",
  SIGNUP_PASSWORD = "signup/password",
  SIGNUP_SOCIAL = "signup/social",
  VERIFY_SOCIAL = "verify/social",
  VERIFY_PASSWORD = "verify/password",
  VERIFY_CAPTCHA = "verify/captcha",
  VERIFY_EMAIL = "verify/email",
  ENROLL_MFA_SELECT = "enroll/mfa/select", // UI-only state
  ENROLL_MFA_START = "enroll/mfa/start",
  ENROLL_MFA_COMPLETE = "enroll/mfa/complete",
  VERIFY_MFA_SELECT = "verify/mfa/select", // UI-only state
  VERIFY_MFA_START = "verify/mfa/start",
  VERIFY_MFA_COMPLETE = "verify/mfa/complete",
  VERIFY_RESET = "verify/password_reset",
  RESET_PASSWORD = "reset/password",
  MFA_SELECT = "mfa/select",
  VERIFY_EULA = "verify/eula", // TODO: Remove when verify/agreement is used
  VERIFY_AGREEMENT = "verify/agreement",
  FLOW_GET = "get",
  COMPLETE = "complete",
  FLOW_RETURN = "return", // UI-only state
  INVALID_AUTH_METHOD = "invalid/auth", // UI-only state
  INVALID_STATE = "invalid/state", // UI-only state
}

/**
 * The current state of the authentication flow
 *
 * @hidden
 */
export interface FlowState {
  /**
   * The current step in the flow
   */
  step?: FlowStep;

  /**
   * The current flow ID
   */
  flowId?: string;

  /**
   * The email address of the user related to the flow
   */
  email?: string;

  /**
   * The multi-factor authentication options selected
   */
  selectedMfa?: string;

  /**
   * The providers available for multi-factor authentication
   */
  mfaProviders?: string[];

  /**
   * TODO
   */
  cancelMfa?: boolean;

  /**
   * The code returned from Google Recaptcha to be used for validation later
   */
  recaptchaKey?: string;

  /**
   * TODO
   */
  qrCode?: string;

  /**
   * TODO
   */
  passwordSignup?: boolean;

  /**
   * TODO
   */
  socialSignup?: any;

  /**
   * TODO
   */
  verifyProvider?: any;

  /**
   * The URI to redirect the user to on a successful authentication
   */
  redirectUri?: string;
}

/**
 * Describes the data required to start any flow
 *
 * @hidden
 */
export interface FlowStart {
  /**
   * The email address to use to start the flow
   */
  email?: string;
}

/**
 * Describes the parent flow data required for any step
 *
 * @hidden
 */
export interface FlowBase {
  /**
   * The ID of the flow being used
   */
  flowId?: string;
}

/**
 * Describes the data required for a password signup flow
 *
 * @hidden
 */
export interface FlowSignupPassword extends FlowBase {
  /**
   * The first name of the user
   */
  firstName: string;

  /**
   * The last name of the user
   */
  lastName: string;

  /**
   * The user's password
   */
  password: string;
}

/**
 * Describes the data required for a password verification flow
 *
 * @hidden
 */
export interface FlowVerifyPassword extends FlowBase {
  /**
   * The password to veify
   */
  password?: string;

  /**
   * The password to reset it to (TODO: Is this correct?)
   */
  reset?: string;
}

/**
 * Describes the data required for a verification callback
 *
 * @hidden
 */
export interface FlowVerifyCallback extends FlowBase {
  /**
   * The code to veify
   */
  cbCode: string;

  /**
   * The state value to verify
   */
  cbState: string;
}

/**
 * Describes the data required to verify the recaptcha request
 *
 * @hidden
 */
export interface FlowVerifyCaptcha extends FlowBase {
  /**
   * The code received from Google Recaptcha to verify
   */
  captchaCode: string;
}

/**
 * Describes the data required to start an MFA flow
 */
export interface FlowMfaStart extends FlowBase {
  /**
   * The provider to use
   */
  mfaProvider: string;

  /**
   * The phone to send SMS codes to
   */
  phoneNumber?: string;
}

/**
 * Describes the data required to complete an MFA flow
 *
 * @hidden
 */
export interface FlowMfaComplete extends FlowBase {
  /**
   * The code from the MFA process
   */
  code?: string;

  /**
   * The provider for MFA
   */
  mfaProvider?: string;

  /**
   * TODO
   */
  cancel?: boolean;
}

/**
 * Describes the data required to reset a password
 *
 * @hidden
 */
export interface FlowResetPassword extends FlowBase {
  /**
   * The new password to use
   */
  password?: string;

  /**
   * The callback code for the reset
   */
  cbCode?: string;

  /**
   * The callback state for the reset
   */
  cbState?: string;

  /**
   * TODO
   */
  cancel?: boolean;
}
