import { AuthUser } from "@src/types";

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
   * cookieName: optional string
   *
   * The name to be used when setting/getting the user token cookie.
   *
   * Defaults to "pangea-token" if not set.
   */
  cookieName?: string;

  /**
   * refreshCookieName: optional strinal
   *
   * The name to be used when setting/getting the refresh token cookie.
   *
   * Defaults to "pangea-refresh" if not set.
   */
  refreshCookieName?: string;

  /**
   * cookieDomain: optional string
   *
   * The domain to set on the cookie.
   */
  cookieDomain?: string;
}

export interface AuthOptions extends CookieOptions {
  useJwt?: boolean;
  sessionKey: string;
}

export interface VerifyResponse {
  user?: AuthUser;
  error?: string;
}
