import PangeaResponse from "@src/response.js";
import BaseService from "@src/services/base.js";
import PangeaConfig from "@src/config.js";
import { AuthN } from "@src/types.js";

export default class UserAuthenticators extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("authn", token, config);
  }

  /**
   * @summary Delete user authenticator
   * @description Delete a user's authenticator.
   * @operationId authn_post_v2_user_authenticators_delete
   * @param {AuthN.User.Authenticators.Delete.EmailRequest | AuthN.User.Authenticators.Delete.IDRequest} request
   * @returns {Promise<PangeaResponse<{}>>} - A promise
   * representing an async call to the endpoint. Contains an empty object.
   * @example
   * ```js
   * await authn.authenticators.delete({
   *   id: "pui_xpkhwpnz2cmegsws737xbsqnmnuwtbm5",
   *   authenticator_id: "pau_wuk7tvtpswyjtlsx52b7yyi2l7zotv4a",
   * });
   * ```
   */
  delete(
    request:
      | AuthN.User.Authenticators.Delete.EmailRequest
      | AuthN.User.Authenticators.Delete.IDRequest
  ): Promise<PangeaResponse<{}>> {
    return this.post("v2/user/authenticators/delete", request);
  }

  /**
   * @summary Get user authenticators
   * @description Get user's authenticators by identity or email.
   * @operationId authn_post_v2_user_authenticators_list
   * @param {AuthN.User.Authenticators.ListRequest} request
   * @returns {Promise<PangeaResponse<AuthN.User.Authenticators.ListResult>>} - A promise
   * representing an async call to the endpoint. Available response fields can be found in our
   * [API Documentation](https://pangea.cloud/docs/api/authn/user#/v2/user/authenticators/list).
   * @example
   * ```js
   * const response = await authn.user.authenticators.list({
   *   id: "pui_xpkhwpnz2cmegsws737xbsqnmnuwtbm5",
   * });
   * ```
   */
  list(
    request: AuthN.User.Authenticators.ListRequest
  ): Promise<PangeaResponse<AuthN.User.Authenticators.ListResult>> {
    return this.post("v2/user/authenticators/list", request);
  }
}
