import PangeaResponse from "../../response";
import BaseService from "../base";
import PangeaConfig from "../../config";
import { AuthN } from "../../types";
import AuthNUser from "./user";

import { schema } from "../../utils/validation";
/**
 * AuthnService class provides methods for interacting with the AuthN Service
 * @extends BaseService
 */
export default class AuthNService extends BaseService {
  // Needed for ts type
  user: AuthNUser;

  constructor(token: string, config: PangeaConfig) {
    super("authn", token, config);
    this.apiVersion = "v1";

    this.user = new AuthNUser(token, config);
  }

  // authn::/v1/password/update
  /**
   * @summary Change a user's password
   * @description Change a user's password given the current password
   * @param {String} o.email - An email address
   * @param {String} o.old_secret - The old password
   * @param {String} o.new_secret - The new password
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
      throw "passwordUpdate was called without supplying an old_secret";
    }
    if (!schema.string(o.new_secret)) {
      throw "passwordUpdate was called without supplying a new_secret";
    }

    return this.post("password/update", o);
  }

  // authn::/v1/userinfo
  /**
   * @summary Complete a login
   * @description Retrieve the logged in user's token and information
   * @param {String} code - A one-time ticket
   * @returns {Promise<PangeaResponse<AuthN.UserInfoResult>>} - A token and its information
   * @example
   * const response = await authn.userinfo(
   *   "pmc_wuk7tvtpswyjtlsx52b7yyi2l7zotv4a"
   * );
   */
  userinfo(code: string): Promise<PangeaResponse<AuthN.UserInfoResult>> {
    if (!schema.string(code)) {
      throw "userinfo was called without supplying a code";
    }

    return this.post("userinfo", { code });
  }
}
