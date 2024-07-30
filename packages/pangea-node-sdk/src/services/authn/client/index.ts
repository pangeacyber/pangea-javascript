import BaseService from "@src/services/base.js";
import PangeaConfig from "@src/config.js";
import PangeaResponse from "@src/response.js";
import { AuthN, PangeaToken } from "@src/types.js";

import ClientSession from "./session.js";
import ClientPassword from "./password.js";
import ClientToken from "./token.js";

export default class Client extends BaseService {
  session: ClientSession;
  password: ClientPassword;
  clientToken: ClientToken;

  constructor(token: PangeaToken, config: PangeaConfig) {
    super("authn", token, config);

    this.session = new ClientSession(token, config);
    this.password = new ClientPassword(token, config);
    this.clientToken = new ClientToken(token, config);
  }

  /**
   * @summary Get User (client token)
   * @description Retrieve the logged in user's token and information.
   * @operationId authn_post_v2_client_userinfo
   * @param {String} code - Login code returned by the login callback
   * @returns {Promise<PangeaResponse<AuthN.Client.UserinfoResult>>} - A promise
   * representing an async call to the endpoint. Available response fields can be found in our
   * [API Documentation](https://pangea.cloud/docs/api/authn/user#/v2/client/userinfo).
   * @example
   * ```js
   * const response = await authn.client.userinfo(
   *   "pmc_d6chl6qulpn3it34oerwm3cqwsjd6dxw"
   * );
   * ```
   */
  userinfo(code: string): Promise<PangeaResponse<AuthN.Client.UserinfoResult>> {
    const data: AuthN.Client.UserinfoRequest = {
      code: code,
    };
    return this.post("v2/client/userinfo", data);
  }

  /**
   * @summary Get JWT verification keys
   * @description Get JWT verification keys.
   * @operationId authn_post_v2_client_jwks
   * @returns {Promise<PangeaResponse<AuthN.Client.JWKSResult>>} - A promise
   * representing an async call to the endpoint. Available response fields can be found in our
   * [API Documentation](https://pangea.cloud/docs/api/authn/jwt#/v2/client/jwks).
   * @example
   * ```js
   * const response = await authn.client.jwks();
   * ```
   */
  jwks(): Promise<PangeaResponse<AuthN.Client.JWKSResult>> {
    return this.post("v2/client/jwks", {});
  }
}
