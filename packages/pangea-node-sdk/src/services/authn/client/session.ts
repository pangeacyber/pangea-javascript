import PangeaResponse from "@src/response.js";
import BaseService from "@src/services/base.js";
import PangeaConfig from "@src/config.js";
import { AuthN, PangeaToken } from "@src/types.js";

export default class ClientSession extends BaseService {
  constructor(token: PangeaToken, config: PangeaConfig) {
    super("authn", token, config);
  }

  /**
   * @summary Invalidate Session | Client
   * @description Invalidate a session by session ID using a client token.
   * @operationId authn_post_v2_client_session_invalidate
   * @param {String} token - A user token value
   * @param {String} sessionID - An ID for a token
   * @returns {Promise<PangeaResponse<{}>>} - A promise
   * representing an async call to the endpoint. Contains an empty object.
   * @example
   * ```js
   * await authn.client.session.invalidate(
   *   "ptu_wuk7tvtpswyjtlsx52b7yyi2l7zotv4a",
   *   "pmt_zppkzrjguxyblaia6itbiesejn7jejnr"
   * );
   * ```
   */
  invalidate(token: string, sessionID: string): Promise<PangeaResponse<{}>> {
    const data: AuthN.Client.Session.InvalidateRequest = {
      token: token,
      session_id: sessionID,
    };

    return this.post("v2/client/session/invalidate", data);
  }

  /**
   * @summary List sessions (client token)
   * @description List sessions using a client token.
   * @operationId authn_post_v2_client_session_list
   * @param {String} token - A user token value
   * @param {Object} options - Supported options:
   *   - filter (object): A filter object
   *   - last (string): Reflected value from a previous response to obtain the next page of results.
   *   - order (string): Order results asc(ending) or desc(ending).
   *   - order_by (string): Which field to order results by. One of:
   *     `id`, `created_at`, `type`, `identity`, `email`, `expire`, `active_token_id`
   *   - size (integer): Maximum results to include in the response. Minimum is `1`.
   * @returns {Promise<PangeaResponse<AuthN.Session.ListResult>>} - A promise
   * representing an async call to the endpoint. Available response fields can be found in our
   * [API Documentation](https://pangea.cloud/docs/api/authn/session#/v2/client/session/list).
   * @example
   * ```js
   * const response = await authn.client.session.list(
   *   "ptu_wuk7tvtpswyjtlsx52b7yyi2l7zotv4a",
   *   { order_by: "id" }
   * );
   * ```
   */
  list(
    token: string,
    options: AuthN.Client.Session.ListOptions = {}
  ): Promise<PangeaResponse<AuthN.Session.ListResult>> {
    const data: AuthN.Client.Session.ListRequest = {
      token,
    };
    Object.assign(data, options);
    return this.post("v2/client/session/list", data);
  }

  /**
   * @summary Log out (client token)
   * @description Log out the current user's session.
   * @operationId authn_post_v2_client_session_logout
   * @param {String} token - A user token value
   * @returns {Promise<PangeaResponse<{}>>} - A promise
   * representing an async call to the endpoint. Contains an empty object.
   * @example
   * ```js
   * await authn.client.session.logout(
   *   "ptu_wuk7tvtpswyjtlsx52b7yyi2l7zotv4a"
   * );
   * ```
   */
  logout(token: string): Promise<PangeaResponse<{}>> {
    return this.post("v2/client/session/logout", { token });
  }

  /**
   * @summary Refresh a Session
   * @description Refresh a session token.
   * @operationId authn_post_v2_client_session_refresh
   * @param {String} refreshToken - A refresh token value
   * @param {Object} options -  Supported options:
   *   - user_token (string): A user token value
   * @returns {Promise<PangeaResponse<AuthN.Client.Session.RefreshResult>>} - A promise
   * representing an async call to the endpoint. Available response fields can be found in our
   * [API Documentation](https://pangea.cloud/docs/api/authn/session#/v2/client/session/refresh).
   * @example
   * ```js
   * const response = await authn.client.session.refresh(
   *   "ptr_xpkhwpnz2cmegsws737xbsqnmnuwtbm5",
   *   { user_token: "ptu_wuk7tvtpswyjtlsx52b7yyi2l7zotv4a" }
   * );
   * ```
   */
  refresh(
    refreshToken: string,
    { user_token }: AuthN.Client.Session.RefreshOptions
  ): Promise<PangeaResponse<AuthN.Client.Session.RefreshResult>> {
    const data: AuthN.Client.Session.RefreshRequest = {
      refresh_token: refreshToken,
    };

    if (user_token) data.user_token = user_token;

    return this.post("v2/client/session/refresh", data);
  }
}
