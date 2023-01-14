import PangeaResponse from "../../response";
import BaseService from "../base";
import PangeaConfig from "../../config";
import { AuthN } from "../../types";
import { schema } from "../../utils/validation";

export default class AuthNInvites extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("authninvite", token, config);
    this.apiVersion = "v1";
  }

  // authn::/v1/user/invite/list
  /**
   * @summary List invites
   * @description Lookup active invites for the userpool
   * @returns {Promise<PangeaResponse<AuthN.UserInviteListResult>>} - A list of pending user invitations
   * @example
   * const response = await authn.userInviteList();
   */
  list(): Promise<PangeaResponse<AuthN.UserInviteListResult>> {
    return this.post("user/invite/list", {});
  }

  // authn::/v1/user/invite/delete
  /**
   * @summary Delete an invite
   * @description Delete a user invitation
   * @param {String} id - A one-time ticket
   * @returns {Promise<PangeaResponse<{}>>} - A promise representing an async call to the endpoint
   * @example
   * await authn.userInviteDelete("pmc_wuk7tvtpswyjtlsx52b7yyi2l7zotv4a");
   */
  delete(id: string): Promise<PangeaResponse<{}>> {
    if (!schema.string(id)) {
      throw "userInviteDelete was called without supplying an id";
    }

    const data: AuthN.UserInviteDeleteRequest = {
      id,
    };

    return this.post("user/invite/delete", data);
  }
}
