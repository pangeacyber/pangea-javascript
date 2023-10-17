import PangeaResponse from "@src/response.js";
import BaseService from "@src/services/base.js";
import PangeaConfig from "@src/config.js";
import { AuthN } from "@src/types.js";

export default class Session extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("authn", token, config);
  }

  // authn::/v1/session/invalidate
  /**
   * @summary Invalidate Session
   * @description Invalidate a session by session ID.
   * @operationId authn_post_v1_session_invalidate
   * @param {String} sessionID - An ID for a token
   * @returns {Promise} - A promise representing an async call to
   * the invalidate session endpoint. Contains an empty object.
   * @example
   * ```js
   * await authn.session.invalidate(
   *   "pmt_zppkzrjguxyblaia6itbiesejn7jejnr"
   * );
   * ```
   */
  invalidate(sessionID: string): Promise<PangeaResponse<{}>> {
    return this.post("v2/session/invalidate", { session_id: sessionID });
  }

  // authn::/v1/session/list
  /**
   * @summary List session (service token)
   * @description List sessions.
   * @operationId authn_post_v1_session_list
   * @param {AuthN.Session.ListRequest} request - An object of options:
   *   - filter (object): A filter object
   *   - last (string): Reflected value from a previous response to obtain the next page of results.
   *   - order (string): Order results asc(ending) or desc(ending).
   *   - order_by (string): Which field to order results by. One of:
   *     `id`, `created_at`, `type`, `identity`, `email`, `expire`, `active_token_id`
   *   - size (integer): Maximum results to include in the response. Minimum is `1`.
   * @returns {Promise} - A promise representing an async call to
   * the list session endpoint. Contains an array of sessions.
   * @example
   * ```js
   * const response = await authn.session.list({
   *   order: "desc",
   *   order_by: "created_at"
   * });
   * ```
   */
  list(request: AuthN.Session.ListRequest = {}): Promise<PangeaResponse<AuthN.Session.ListResult>> {
    return this.post("v2/session/list", request);
  }

  // authn::/v1/session/logout
  /**
   * @summary Log out (service token)
   * @description Invalidate all sessions belonging to a user.
   * @operationId authn_post_v1_session_logout
   * @param {String} user_id - The identity of a user or a service
   * @returns {Promise} - A promise representing an async call to
   * the session logout endpoint. Contains an empty object.
   * @example
   * ```js
   * await authn.session.logout(
   *   "pui_xpkhwpnz2cmegsws737xbsqnmnuwtvm5"
   * );
   * ```
   */
  logout(user_id: string): Promise<PangeaResponse<{}>> {
    return this.post("v2/session/logout", { user_id });
  }
}
