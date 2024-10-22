import PangeaResponse from "@src/response.js";
import BaseService from "@src/services/base.js";
import PangeaConfig from "@src/config.js";
import { AuthN, PangeaToken } from "@src/types.js";

export default class ClientPassword extends BaseService {
  constructor(token: PangeaToken, config: PangeaConfig) {
    super("authn", token, config);
  }

  /**
   * @summary Change a user's password
   * @description Change a user's password given the current password.
   * @operationId authn_post_v2_client_password_change
   * @param {String} token - An user token value
   * @param {String} oldPassword - The old password
   * @param {String} newPassword - The new password
   * @returns {Promise<PangeaResponse<{}>>} - A promise representing an async call to the endpoint.
   * Contains an empty object.
   * @example
   * ```js
   * await authn.client.password.change(
   *   "ptu_wuk7tvtpswyjtlsx52b7yyi2l7zotv4a",
   *   "hunter2",
   *   "My2n+Password"
   * );
   * ```
   */
  change(
    token: string,
    oldPassword: string,
    newPassword: string
  ): Promise<PangeaResponse<{}>> {
    const data: AuthN.Client.Password.UpdateRequest = {
      token: token,
      old_password: oldPassword,
      new_password: newPassword,
    };
    return this.post("v2/client/password/change", data);
  }

  /**
   * @summary Expire a user's password
   * @description Expire a user's password.
   * @operationId authn_post_v2_user_password_expire
   * @param id The identity of a user or a service.
   * @returns A `Promise` of an empty response.
   * @example
   * ```js
   * await authn.client.password.expire("pui_[...]");
   * ```
   */
  expire(id: string): Promise<PangeaResponse<{}>> {
    return this.post("v2/user/password/expire", { id });
  }
}
