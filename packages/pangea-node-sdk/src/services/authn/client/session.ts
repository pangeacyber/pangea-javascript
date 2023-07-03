import PangeaResponse from "../../../response.js";
import BaseService from "../../base.js";
import PangeaConfig from "../../../config.js";
import { AuthN } from "../../../types.js";

export default class ClientSession extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("authn", token, config);
    this.apiVersion = "v1";
  }

  // authn::/v1/client/session/invalidate
  /**
   * @summary Invalidate Session | Client
   * @description Invalidate a session by session ID using a client token.
   * @operationId authn_post_v1_client_session_invalidate
   * @param {String} token - A user token value
   * @param {String} sessionID - An ID for a token
   * @returns {Promise<PangeaResponse<{}>>} - A promise
   * representing an async call to the endpoint. Contains an empty object
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

    return this.post("client/session/invalidate", data);
  }

  // authn::/v1/client/session/list
  /**
   * @summary List sessions (client token)
   * @description List sessions using a client token.
   * @operationId authn_post_v1_client_session_list
   * @param {String} token - A user token value
   * @param {Object} options - Supported options:
   *   - filter (object): A filter object
   *   - last (string): Reflected value from a previous response to obtain the next page of results.
   *   - order (string): Order results asc(ending) or desc(ending).
   *   - order_by (string): Which field to order results by. One of:
   *     `id`, `created_at`, `type`, `identity`, `email`, `expire`, `active_token_id`
   *   - size (integer): Maximum results to include in the response. Minimum is `1`.
   * @returns {Promise<PangeaResponse<AuthN.Session.ListResult>>} - A promise
   * representing an async call to the endpoint.
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
    return this.post("client/session/list", data);
  }

  // authn::/v1/client/session/logout
  /**
   * @summary Log out (client token)
   * @description Log out the current user's session.
   * @operationId authn_post_v1_client_session_logout
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
    return this.post("client/session/logout", { token });
  }

  // authn::/v1/client/session/refresh
  /**
   * @summary Refresh a Session
   * @description Refresh a session token.
   * @operationId authn_post_v1_client_session_refresh
   * @param {String} refreshToken - A refresh token value
   * @param {Object} options -  Supported options:
   *   - user_token (string): A user token value
   * @returns {Promise<PangeaResponse<AuthN.Client.Session.RefreshResult>>} - A promise
   * representing an async call to the endpoint.
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

    return this.post("client/session/refresh", data);
  }
}
