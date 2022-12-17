import PangeaResponse from "../response";
import BaseService from "./base";
import PangeaConfig from "../config";
import { AuthN } from "../types";

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
  passwordUpdate(email: string, oldSecret: string, newSecret: string): Promise<PangeaResponse<{}>> {
    if (typeof email !== "string" || email.trim() === "") {
      throw "passwordUpdate was called without supplying an email";
    }
    if (typeof oldSecret !== "string" || oldSecret.trim() === "") {
      throw "passwordUpdate was called without supplying an oldSecret";
    }
    if (typeof newSecret !== "string" || newSecret.trim() === "") {
      throw "passwordUpdate was called without supplying an newSecret";
    }

    const data: AuthN.PasswordUpdateRequest = {
      email,
      old_secret: oldSecret,
      new_secret: newSecret,
    };

    return this.post("password/update", data);
  }

  // authn::/v1/user/create

  // authn::/v1/user/delete

  // authn::/v1/user/invite

  // authn::/v1/user/invite/list

  // authn::/v1/user/invite/delete

  // authn::/v1/user/list

  // authn::/v1/user/login

  // authn::/v1/user/update

  // authn::/v1/user/profile/get

  // authn::/v1/user/profile/update

  // authn::/v1/userinfo
}

export default AuthnService;
