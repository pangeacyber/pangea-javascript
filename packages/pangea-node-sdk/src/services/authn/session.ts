import PangeaResponse from "../../response.js";
import BaseService from "../base.js";
import PangeaConfig from "../../config.js";
import { AuthN } from "../../types.js";

export default class Session extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("authn", token, config);
    this.apiVersion = "v1";
  }

  // - path: authn::/v1/session/invalidate
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
    return this.post("session/invalidate", { session_id: sessionID });
  }

  // - path: authn::/v1/session/list
  /**
   * @summary List session (service token)
   * @description List sessions.
   * @operationId authn_post_v1_session_list
   * @param {AuthN.Session.ListRequest} options - An object of options:
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
  list({
    filter,
    last,
    order,
    order_by,
    size,
  }: AuthN.Session.ListRequest): Promise<PangeaResponse<AuthN.Session.ListResult>> {
    const data: AuthN.Session.ListRequest = {};

    if (filter) data.filter = filter;
    if (last) data.last = last;
    if (order) data.order = order;
    if (order_by) data.order_by = order_by;
    if (typeof size === "number") data.size = size;

    return this.post("session/list", data);
  }

  // - path: authn::/v1/session/logout
  /**
   * @summary Log out (service token)
   * @description Invalidate all sessions belonging to a user.
   * @operationId authn_post_v1_session_logout
   * @param {String} user_id - The identity of a user or a service
   * @returns {Promise} - A promise representing an async call to
   * the session logout endpoint. Contains an empty object.
   * @example
   * ```js
   * await logout(
   *   "pui_xpkhwpnz2cmegsws737xbsqnmnuwtvm5"
   * );
   * ```
   */
  logout(user_id: string): Promise<PangeaResponse<{}>> {
    return this.post("session/logout", { user_id });
  }
}
