// Copyright 2021 Pangea Cyber Corporation
// Author: Pangea Cyber Corporation

import { JWTPayload, JWTHeaderParameters } from "jose";

export interface Token {
  id: string;
  identity: string;
  token: string;
  type: string;
  life: string;
  expire: string;
  created_at: string;
  scopes?: string[];
}

export interface Profile {
  first_name: string;
  last_name: string;
  phone: string;
}

export interface AuthConfig {
  /**
   * clientToken: required string
   *
   * A Pangea client access token.
   */
  clientToken: string;

  /**
   * domain: required string
   *
   * The domain where the Pangea project was created.
   * i.e. aws.us.pangea.cloud
   */
  domain: string;

  /**
   * callbackUri: optional string
   *
   * The URI that the hosted pages will redirect to after login
   *
   * Defaults to window.location.orgin
   */
  callbackUri?: string;

  /**
   * useJwt: optional boolean
   *
   * If set to true, expect the token to be in JWT format and
   * use client-side token verification.
   */
  useJwt?: boolean;

  /**
   * sessionKey: optional string
   *
   * Sets the name of the session data key in local or session
   * storage.
   *
   * Defaults to "pangea-session" if not set.
   */
  sessionKey?: string;
}

export interface AuthUser {
  email: string;
  profile: Profile;
  active_token?: Token;
  refresh_token?: Token;
  payload?: JWTPayload;
  header?: JWTHeaderParameters;
}

export interface SessionData {
  user?: AuthUser;
}

export interface AppState {
  userData?: AuthUser;
  returnPath: string;
}

export interface JwtToken {
  header: any;
  payload: any;
  signature: any;
}

export interface CallbackParams {
  code: string;
  state: string;
}

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
