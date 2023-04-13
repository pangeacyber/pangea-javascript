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

export interface AuthConfig {
  /**
   * clientToken: required string
   *
   * A Pangea client acccess token.
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

  callbackUri?: string;
}

export interface AuthUser {
  email: string;
  profile: Profile;
  active_token?: Token;
  refresh_token?: Token;
  payload?: JWTPayload;
  protectedHeader?: JWTHeaderParameters;
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
