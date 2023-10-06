import PangeaResponse from "@src/response.js";
import BaseService from "@src/services/base.js";
import PangeaConfig from "@src/config.js";
import { AuthN } from "@src/types.js";

export default class ClientPassword extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("authn", token, config);
  }

  // authn::/v1/client/password/change
  /**
   * @summary Change a user's password
   * @description Change a user's password given the current password.
   * @operationId authn_post_v1_client_password_change
   * @param {String} token - An user token
   * @param {String} oldPassword - The old password
   * @param {String} newPassword - The new password
   * @returns {Promise<PangeaResponse<{}>>} - A promise representing an async call to the endpoint
   * @example
   * ```js
   * const response = await authn.client.password.change(
   *   "ptu_wuk7tvtpswyjtlsx52b7yyi2l7zotv4a",
   *   "hunter2",
   *   "My2n+Password"
   * );
   * ```
   */
  change(token: string, oldPassword: string, newPassword: string): Promise<PangeaResponse<{}>> {
    const data: AuthN.Client.Password.UpdateRequest = {
      token: token,
      old_password: oldPassword,
      new_password: newPassword,
    };
    return this.post("v2/client/password/change", data);
  }
}
