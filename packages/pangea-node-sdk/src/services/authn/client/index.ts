import BaseService from "../../base.js";
import PangeaConfig from "../../../config.js";
import PangeaResponse from "../../../response.js";
import { AuthN } from "../../../types.js";

import ClientSession from "./session.js";
import ClientPassword from "./password.js";
import ClientToken from "./token.js";

export default class Client extends BaseService {
  session: ClientSession;
  password: ClientPassword;
  clientToken: ClientToken;

  constructor(token: string, config: PangeaConfig) {
    super("authn", token, config, false);
    this.apiVersion = "v1";

    this.session = new ClientSession(token, config);
    this.password = new ClientPassword(token, config);
    this.clientToken = new ClientToken(token, config);
  }

  // authn::/v1/client/userinfo
  /**
   * @summary Get User (client token)
   * @description Retrieve the logged in user's token and information.
   * @operationId authn_post_v1_client_userinfo
   * @param {String} code - A one-time ticket
   * @returns {Promise<PangeaResponse<AuthN.Client.UserinfoResult>>} - A promise
   * representing an async call to the endpoint
   * @example
   * ```js
   * const response = await authn.client.userinfo(
   *   "pmc_d6chl6qulpn3it34oerwm3cqwsjd6dxw",
   * );
   * ```
   */
  userinfo(code: string): Promise<PangeaResponse<AuthN.Client.UserinfoResult>> {
    const data: AuthN.Client.UserinfoRequest = {
      code: code,
    };
    return this.post("client/userinfo", data);
  }

  // authn::/v1/client/jwks
  /**
   * @summary Get JWT verification keys
   * @description Get JWT verification keys.
   * @operationId authn_post_v1_client_jwks
   * @returns {Promise<PangeaResponse<AuthN.Client.JWKSResult>>} - A promise
   * representing an async call to the endpoint
   * @example
   * ```js
   * const response = await authn.client.jwks();
   * ```
   */
  jwks(): Promise<PangeaResponse<AuthN.Client.JWKSResult>> {
    return this.post("client/jwks", {});
  }
}
