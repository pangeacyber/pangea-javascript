// Copyright 2021 Pangea Cyber Corporation
// Author: Pangea Cyber Corporation

export interface AuthConfig {
  clientToken: string;
  domain: string;
  callbackUri?: string;
}

export interface APIResponse {
  status: string;
  summary: string;
  result: any;
}

export interface CallbackParams {
  code: string;
  state: string;
}

export interface ClientResponse {
  success: boolean;
  response: APIResponse;
}

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

export interface AuthUser {
  email: string;
  profile: Profile;
  active_token: Token;
  refresh_token: Token;
}

export interface SessionData {
  user?: AuthUser;
}

export interface AppState {
  userData?: AuthUser;
  returnPath: string;
}

export interface CookieOptions {
  /**
   * cookieMaxAge: optional number, default is 48 hours (in seconds)
   *
   * This sets the max-age on the cookie (in seconds). Will only be used
   * if useCookie is true.
   */
  cookieMaxAge?: number;

  /**
   * cookieName: The name to be used when setting/getting the cookie
   *
   * Defaults to "pangea-authn" if not set
   */
  cookieName?: string;

  /**
   * cookieDomain: The domain to set on the cookie
   */
  cookieDomain?: string;
}
