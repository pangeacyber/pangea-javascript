import PangeaResponse from "@src/response.js";
import BaseService from "@src/services/base.js";
import PangeaConfig from "@src/config.js";
import { AuthN, PangeaToken } from "@src/types.js";

export default class ClientToken extends BaseService {
  constructor(token: PangeaToken, config: PangeaConfig) {
    super("authn", token, config);
  }

  /**
   * @summary Check a token
   * @description Look up a token and return its contents.
   * @operationId authn_post_v2_client_token_check
   * @param {String} token - A token value
   * @returns {Promise<PangeaResponse<AuthN.Client.Token.CheckResult>>} - A promise
   * representing an async call to the endpoint. Available response fields can be found in our
   * [API Documentation](https://pangea.cloud/docs/api/authn/flow#/v2/client/token/check).
   * @example
   * ```js
   * const response = await authn.client.clientToken.check(
   *   "ptu_wuk7tvtpswyjtlsx52b7yyi2l7zotv4a",
   * );
   * ```
   */
  check(
    token: string
  ): Promise<PangeaResponse<AuthN.Client.Token.CheckResult>> {
    const data: AuthN.Client.Token.CheckRequest = {
      token: token,
    };
    return this.post("v2/client/token/check", data);
  }
}
