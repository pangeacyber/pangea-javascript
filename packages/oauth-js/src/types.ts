import { JWTPayload, JWTHeaderParameters } from "jose";

export interface ClientConfig {
  /**
   * clientId: required string
   *
   * The OAuth clientId, obtained from AuthN settings in Pangea Console
   */
  clientId: string;

  /**
   * domain: required string
   *
   * The client hosted domain, obtained from AuthN settings in Pangea Console
   *
   */
  domain: string;

  /**
   * callbackUri: optional string
   *
   * The URL to redirect to after authentication
   *
   * Defaults to the current hostname in the browser
   */
  callbackUri?: string;

  /**
   * scope: optional string
   *
   * A space separated list of requested scopes
   *
   */
  scope?: string;

  /**
   * sessionKey: optional string
   *
   * The key used to store session data in the browser
   *
   * Defaults to ""
   */
  sessionKey?: string;

  /**
   * onLogin: optional callback function
   *
   * If defined, the function is called on successful login with the AppState data
   *
   * Defaults to undefined
   */
  onLogin?: (appState: AppState) => void;

  /**
   * onStateChange: optional callback function
   *
   * If defined, the function is called on state change with the current
   * state data
   *
   * Defaults to undefined
   *
   */
  onStateChange?: (state: StateData) => void;
}

/**
 * Describes the possible cookie options to determine the cookie behavior through Authentication
 */
export interface CookieOptions {
  /**
   * useCookie: optional boolean
   *
   * Option for using a cookie to keep the auth token around.
   * Default is false.
   *
   * When useCookie is false, all other CookieOptions are ignored,
   * and we will use localStorage instead of sessionStorage to keep
   * the auth token around.
   */
  useCookie: boolean;

  /**
   * cookieMaxAge: optional number (in seconds)
   *
   * This sets the max-age on the cookie (in seconds). Will only be used
   * if useCookie is true.
   *
   * Defaults to 48 hours.
   */
  cookieMaxAge?: number;

  /**
   * tokenCookieName: optional string
   *
   * The name to be used when setting/getting the user token cookie.
   *
   * Defaults to "pangea-token" if not set.
   */
  tokenCookieName?: string;

  /**
   * refreshCookieName: optional string
   *
   * The name used when setting/getting the refresh token cookie.
   *
   * Defaults to "pangea-refresh" if not set.
   */
  refreshCookieName?: string;

  /**
   * expiresName: optional string
   *
   * The name used when setting/getting the access token expires cookie.
   *
   * Defaults to "pangea-expires" if not set.
   */
  expiresCookieName?: string;

  /**
   * cookieDomain: optional string
   *
   * The domain to set on the cookie.
   */
  cookieDomain?: string;
}

export interface AuthOptions extends CookieOptions {
  sessionKey: string;
}

/**
 * The global app state
 */
export interface AppState {
  /**
   * The current user data
   */
  userData?: AuthUser;

  /**
   * The path to return the user to after authentication
   */
  returnPath: string;
}

export type AuthState =
  | "INIT"
  | "LOADING"
  | "REFRESH"
  | "AUTHENTICATED"
  | "NOAUTH"
  | "ERROR";

export interface StateData {
  state: AuthState;
  user?: AuthUser;
  error: string;
}

export interface Profile {
  [key: string]: string;
}

export interface Intelligence {
  [key: string]: string;
}

export interface AuthUser {
  id?: string;
  username?: string;
  email?: string;
  profile?: Profile;
  intelligence?: Intelligence;
  payload?: JWTPayload;
  header?: JWTHeaderParameters;
}

export interface SessionData {
  user?: AuthUser;
  access_token?: string;
  refresh_token?: string;
  scope?: string;
  id_token?: string;
  expires_at?: string;
}

export interface AuthUrlOptions {
  clientId: string;
  redirectUri: string;
  state: string;
  challenge: string;
  challengeMethod: "plain" | "S256";
  responseType: "code";
  scope?: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: "Bearer";
  expires_in: number;
  refresh_token: string;
  scope: string;
  id_token?: string;
}
