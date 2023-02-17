import PangeaResponse from "../../../response";
import BaseService from "../../base";
import PangeaConfig from "../../../config";
import { AuthN } from "../../../types";

export default class AuthNUserInvites extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("authninvite", token, config);
    this.apiVersion = "v1";
  }

  // authn::/v1/user/invite/list
  /**
   * @summary List invites
   * @description Lookup active invites for the userpool
   * @returns {Promise<PangeaResponse<AuthN.User.Invite.List.Response>>} - A list of pending user invitations
   * @example
   * const response = await authn.user.invites.list();
   */
  list(): Promise<PangeaResponse<AuthN.User.Invite.List.Response>> {
    return this.post("user/invite/list", {});
  }

  // authn::/v1/user/invite/delete
  /**
   * @summary Delete an invite
   * @description Delete a user invitation
   * @param {String} id - A one-time ticket
   * @returns {Promise<PangeaResponse<{}>>} - A promise representing an async call to the endpoint
   * @example
   * await authn.user.invites.delete("pmc_wuk7tvtpswyjtlsx52b7yyi2l7zotv4a");
   */
  delete(id: string): Promise<PangeaResponse<{}>> {
    const data: AuthN.User.Invite.Delete.Request = {
      id,
    };

    return this.post("user/invite/delete", data);
  }
}
