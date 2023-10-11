import PangeaResponse from "@src/response.js";
import BaseService from "@src/services/base.js";
import PangeaConfig from "@src/config.js";
import { AuthN } from "@src/types.js";

export default class UserInvites extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("authn", token, config);
  }

  // authn::/v1/user/invite/list
  /**
   * @summary List invites
   * @description Look up active invites for the userpool.
   * @operationId authn_post_v1_user_invite_list
   * @param {Object} request - Supported options:
   *   - filter (object)
   *   - last (string): Reflected value from a previous response to
   * obtain the next page of results.
   *   - order (AuthN.ItemOrder): Order results asc(ending) or desc(ending).
   *   - order_by (AuthN.User.Invite.OrderBy): Which field to order results by.
   *   - size (number): Maximum results to include in the response.
   * @returns {Promise<PangeaResponse<AuthN.User.Invite.ListResult>>} - A list of pending user invitations
   * @example
   * ```js
   * const response = await authn.user.invites.list(
   *   {
   *     order: AuthN.ItemOrder.ASC,
   *     order_by: AuthN.User.Invite.OrderBy.ID,
   *     size: 20,
   *   }
   * );
   * ```
   */
  list(
    request: AuthN.User.Invite.ListRequest = {}
  ): Promise<PangeaResponse<AuthN.User.Invite.ListResult>> {
    return this.post("v2/user/invite/list", request);
  }

  // authn::/v1/user/invite/delete
  /**
   * @summary Delete Invite
   * @description Delete a user invitation.
   * @operationId authn_post_v1_user_invite_delete
   * @param {String} id - A one-time ticket
   * @returns {Promise<PangeaResponse<{}>>} - A promise
   * representing an async call to the endpoint.
   * @example
   * ```js
   * await authn.user.invites.delete(
   *   "pmc_wuk7tvtpswyjtlsx52b7yyi2l7zotv4a"
   * );
   * ```
   */
  delete(id: string): Promise<PangeaResponse<{}>> {
    const data: AuthN.User.Invite.DeleteRequest = {
      id,
    };

    return this.post("v2/user/invite/delete", data);
  }
}
