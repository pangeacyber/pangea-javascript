import PangeaResponse from "../../../response.js";
import BaseService from "../../base.js";
import PangeaConfig from "../../../config.js";
import { AuthN } from "../../../types.js";

export default class UserPassword extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("authn", token, config);
    this.apiVersion = "v1";
  }

  // authn::/v1/user/password/reset
  /**
   * @summary Password Reset
   * @description Manually reset a user's password.
   * @operationId authn_post_v1_user_password_reset
   * @param {Object} data - Required fields:
   *   - user_id (string): The identity of a user or a service
   *   - new_password (string)
   * @returns {Promise<PangeaResponse<{}>>} - A promise
   * representing an async call to the endpoint.
   * @example
   * ```js
   * await authn.user.password.reset(
   *   {
   *     user_id: "pui_zgp532cx6opljeavvllmbi3iwmq72f7f",
   *     new_password: "My2n+Password",
   *   }
   * );
   * ```
   */
  reset(data: AuthN.User.Password.ResetRequest): Promise<PangeaResponse<{}>> {
    return this.post("user/password/reset", data);
  }
}
