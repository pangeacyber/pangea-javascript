import PangeaResponse from "../response";
import BaseService from "./base";
import PangeaConfig from "../config";
import { AuthN } from "../types";

import { schema } from "../utils/validation";
/**
 * AuthnService class provides methods for interacting with the AuthN Service
 * @extends BaseService
 */
class AuthnService extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("authn", token, config);
    this.apiVersion = "v1";
  }

  // authn::/v1/password/update
  /**
   * @summary Change a user's password
   * @description Change a user's password given the current password
   * @param {String} email - An email address
   * @param {String} oldSecret - The old password
   * @param {String} newSecret - The new password
   * @returns {Promise<PangeaResponse<{}>>} - A promise representing an async call to the endpoint
   * @example
   * const response = await authn.passwordUpdate(
   *   "example@example.com",
   *   "hunter2",
   *   "My2n+Password"
   * );
   */
  passwordUpdate(o: AuthN.PasswordUpdateRequest): Promise<PangeaResponse<{}>> {
    if (!schema.string(o.email)) {
      throw "passwordUpdate was called without supplying an email";
    }
    if (!schema.string(o.old_secret)) {
      throw "passwordUpdate was called without supplying an oldSecret";
    }
    if (!schema.string(o.new_secret)) {
      throw "passwordUpdate was called without supplying an newSecret";
    }

    return this.post("password/update", o);
  }

  // authn::/v1/user/create
  userCreate(user: AuthN.UserCreateRequest): Promise<PangeaResponse<AuthN.UserCreateResult>> {
    // TODO: validate user

    return this.post("user/create", user);
  }

  // authn::/v1/user/delete
  userDelete(email: string): Promise<PangeaResponse<{}>> {
    if (!schema.string(email)) {
      throw "userDelete was called without supplying an email";
    }

    const data: AuthN.UserDeleteRequest = {
      email,
    };

    return this.post("user/delete", data);
  }

  // authn::/v1/user/invite
  userInvite(userInvite: AuthN.UserInviteRequest): Promise<PangeaResponse<AuthN.UserInvite>> {
    // TODO: Validate userInvite

    return this.post("user/invite", userInvite);
  }

  // authn::/v1/user/invite/list
  userInviteList(): Promise<PangeaResponse<AuthN.UserInviteListResult>> {
    return this.post("user/invite/list", {});
  }

  // authn::/v1/user/invite/delete
  userInviteDelete(id: string): Promise<PangeaResponse<{}>> {
    if (!schema.string(id)) {
      throw "userInviteDelete was called without supplying an id";
    }

    const data: AuthN.UserInviteDeleteRequest = {
      id,
    };

    return this.post("user/invite/delete", data);
  }

  // authn::/v1/user/list
  userList(options: AuthN.UserListRequest): Promise<PangeaResponse<AuthN.UserListResult>> {
    // TODO: validate options

    return this.post("user/list", options);
  }

  // authn::/v1/user/login
  userLogin(options: AuthN.UserLoginRequest): Promise<PangeaResponse<AuthN.UserLoginResult>> {
    const valid = schema.object().shape({
      email: schema.string(options.email),
      secret: schema.string(options.secret),
      scopes: schema.optional().array().string(options.scopes),
    });

    if (!valid.email) {
      throw "userLogin was called without supplying an email";
    }
    if (!valid.secret) {
      throw "userLogin was called without supplying a secret";
    }
    if (!valid.scopes) {
      throw "userLogin was called without supplying valid scopes";
    }

    return this.post("user/login", options);
  }

  // authn::/v1/user/profile/get
  userProfileGet(
    options: AuthN.UserProfileGetRequest = {}
  ): Promise<PangeaResponse<AuthN.UserProfile>> {
    const valid = schema.object().shape({
      identity: schema.optional().string(options.identity),
      email: schema.optional().string(options.email),
    });

    if (!valid.identity) {
      throw "userProfileGet was called without supplying a valid identity";
    }
    if (!valid.email) {
      throw "userProfileGet was called without supplying a valid email";
    }

    return this.post("user/profile/get", options);
  }

  // authn::/v1/user/profile/update
  userProfileUpdate(
    options: AuthN.UserProfileUpdateRequest
  ): Promise<PangeaResponse<AuthN.UserProfile>> {
    // TODO: validate options

    return this.post("user/profile/update", options);
  }

  // authn::/v1/user/update
  // authn::/v1/userinfo
}

export default AuthnService;
