import PangeaResponse from "@src/response.js";
import BaseService from "@src/services/base.js";
import PangeaConfig from "@src/config.js";
import { AuthN } from "@src/types.js";

export default class UserAuthenticators extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("authn", token, config);
  }

  // TODO: Docs
  /**
   * @summary Delete MFA Enrollment
   * @description Delete MFA enrollment for a user.
   * @operationId authn_post_v1_user_mfa_delete
   * @param {String} userID - The identity of a user or a service
   * @param {AuthN.MFAProvider} mfaProvider - Additional mechanism for authenticating
   * a user's identity
   * @returns {Promise<PangeaResponse<{}>>} - A promise
   * representing an async call to the endpoint.
   * @example
   * ```js
   * await authn.user.mfa.delete(
   *   "pui_zgp532cx6opljeavvllmbi3iwmq72f7f",
   *   AuthN.MFAProvider.TOTP
   * );
   * ```
   */
  delete(userID: string, mfaProvider: AuthN.MFAProvider): Promise<PangeaResponse<{}>> {
    const data: AuthN.User.Authenticators.DeleteRequest = {
      user_id: userID,
      mfa_provider: mfaProvider,
    };
    return this.post("v2/user/authenticators/delete", data);
  }

  // TODO: Docs
  list(
    request: AuthN.User.Authenticators.ListRequest
  ): Promise<PangeaResponse<AuthN.User.Authenticators.ListResult>> {
    return this.post("v2/user/authenticators/list", request);
  }
}
