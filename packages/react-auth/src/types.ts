// Copyright 2021 Pangea Cyber Corporation
// Author: Pangea Cyber Corporation

import { JWTPayload, JWTHeaderParameters } from "jose";

export interface APIResponse {
  status: string;
  summary: string;
  result: any;
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

/** interface description */
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
