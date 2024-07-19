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
 * Describes the parent repsonse object for a remote Pangea request
 */
export interface ClientResponse {
  /**
   * Whether or not the request was succesful
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
   * TODO
   */
  identity: string;

  /**
   * The token string itself
   */
  token: string;

  /**
   * TODO
   */
  type: string;

  /**
   * TODO
   */
  life: string;

  /**
   * TODO
   */
  expire: string;

  /**
   * TODO
   */
  created_at: string;

  /**
   * TODO
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
}

/**
 * Describes a user and their session
 */
export interface AuthUser {
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
   * TODO
   */
  payload?: JWTPayload;

  /**
   * TODO
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
