// Copyright 2021 Pangea Cyber Corporation
// Author: Pangea Cyber Corporation

import { JWTPayload, JWTHeaderParameters } from "jose";

/**
 * Describes the body of a response object for a remote Pangea request
 */
export interface APIResponse {
  /**
   * The status of the response from the server
   */
  status: string;

  /**
   * A description of the response status
   */
  summary: string;

  /**
   * The functional payload returned from the server
   */
  result: any;
}

/**
 * Describes the parent response object for a remote Pangea request
 */
export interface ClientResponse {
  /**
   * Whether or not the request was successful
   */
  success: boolean;

  /**
   * The response body passed to the client
   */
  response: APIResponse;
}

/**
 * Describes the structure of a token object
 */
export interface Token {
  /**
   * The token identifier
   */
  id: string;

  /**
   * User ID of the token owner
   */
  identity: string;

  /**
   * The token string itself
   */
  token: string;

  /**
   * Type of token: 'user' for an active token, 'session' for a refresh token
   */
  type: string;

  /**
   * Time in seconds until the token expires
   */
  life: string;

  /**
   * Token expiration timestamp in ISO 8601 format
   */
  expire: string;

  /**
   * When the token was created, in ISO 8601 format
   */
  created_at: string;

  /**
   * @hidden
   */
  scopes?: string[];
}

/**
 * Describes the profile data related to a user
 */
export interface Profile {
  /**
   * The first name of the user
   */
  first_name: string;

  /**
   * The last name of the user
   */
  last_name: string;

  /**
   * The phone number of the user
   */
  phone: string;
}

/**
 * Describes the options available to configure AuthN
 */
export interface AuthConfig {
  /**
   * A Pangea client access token.
   */
  clientToken: string;

  /**
   * The domain where the Pangea project was created.
   * @example aws.us.pangea.cloud
   */
  domain: string;

  /**
   * The URI that the hosted pages will redirect to after login
   *
   * Defaults to window.location.orgin
   */
  callbackUri?: string;

  /**
   * If set to true, expect the token to be in JWT format and
   * use client-side token verification.
   */
  useJwt?: boolean;

  /**
   * Sets the name of the session data key in local or session
   * storage.
   *
   * Defaults to "pangea-session" if not set.
   */
  sessionKey?: string;

  /**
   * Use path-based API routing, for private cloud only.
   */
  usePathApi?: boolean;
}

/**
 * Describes a user and their session
 */
export interface AuthUser {
  /**
   * The user's username, may be the same as the email
   */
  username: string;

  /**
   * The email address of the user
   */
  email: string;

  /**
   * The related profile data of the user
   */
  profile: Profile;

  /**
   * The current token for this user
   */
  active_token?: Token;

  /**
   * The refresh token for this user
   */
  refresh_token?: Token;

  /**
   * The decoded contents of a JWT (JSON Web Token)
   *
   * JWTPayload is defined by the `jose` package.
   */
  payload?: JWTPayload;

  /**
   * Recognized Signed JWT Header Parameters
   *
   * JWTHeaderParameters is defined by the `jose` package.
   */
  header?: JWTHeaderParameters;
}

/**
 * Describes session data
 */
export interface SessionData {
  /**
   * The user related to the session
   */
  user?: AuthUser;
}

/**
 * Data passed to the onLogin callback.
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

/**
 * @hidden
 */
export interface JwtToken {
  header: any;
  payload: any;
  signature: any;
}

/**
 * Describes the parameters required for a callback
 */
export interface CallbackParams {
  /**
   * The authentication code, usually captured from the query parameters
   */
  code: string;

  /**
   * The authentication state value, usually captured from the query parameters
   */
  state: string;
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

/**
 * @hidden
 */
export interface AuthOptions extends CookieOptions {
  useJwt?: boolean;
  sessionKey: string;
}

/**
 * @hidden
 */
export interface VerifyResponse {
  user?: AuthUser;
  error?: string;
}
