import PangeaResponse from "@src/response.js";
import BaseService from "@src/services/base.js";
import PangeaConfig from "@src/config.js";
import { AuthN, PangeaToken } from "@src/types.js";
import UserProfile from "./profile.js";
import UserAuthenticators from "./authenticators.js";
import UserInvites from "./invites.js";

export default class User extends BaseService {
  profile: UserProfile;
  authenticators: UserAuthenticators;
  invites: UserInvites;

  constructor(token: PangeaToken, config: PangeaConfig) {
    super("authn", token, config);

    this.profile = new UserProfile(token, config);
    this.authenticators = new UserAuthenticators(token, config);
    this.invites = new UserInvites(token, config);
  }

  /**
   * @summary Delete User
   * @description Delete a user.
   * @operationId authn_post_v2_user_delete
   * @param request Supported options:
   *   - email (string): An email address.
   *   - id (string): The identity of a user or a service.
   *   - username (string): A username.
   * @returns A promise representing an async call to the endpoint. Contains an
   * empty object.
   * @example
   * await authn.user.delete({
   *   id: "pui_xpkhwpnz2cmegsws737xbsqnmnuwtbm5",
   * });
   */
  delete(
    request:
      | AuthN.User.Delete.EmailRequest
      | AuthN.User.Delete.IDRequest
      | AuthN.User.Delete.UsernameRequest
  ): Promise<PangeaResponse<{}>> {
    return this.post("v2/user/delete", request);
  }

  /**
   * @summary Create User
   * @description Create a user.
   * @operationId authn_post_v2_user_create
   * @param {AuthN.User.CreateRequest} request
   * @returns {Promise<PangeaResponse<AuthN.User.CreateResult>>} - A promise
   * representing an async call to the endpoint. Available response fields can be found in our
   * [API Documentation](https://pangea.cloud/docs/api/authn/user#/v2/user/create).
   * @example
   * ```js
   * const response = await authn.user.create({
   *   email: "joe.user@email.com",
   *   profile: {
   *     first_name: "Joe",
   *     last_name: "User",
   *   },
   * });
   * ```
   */
  create(
    request: AuthN.User.CreateRequest
  ): Promise<PangeaResponse<AuthN.User.CreateResult>> {
    return this.post("v2/user/create", request);
  }

  /**
   * @summary List Users
   * @description Look up users by scopes.
   * @operationId authn_post_v2_user_list
   * @param {AuthN.User.ListRequest} request - Supported options:
   *   - filter (object)
   *   - last (string): Reflected value from a previous response to
   * obtain the next page of results.
   *   - order (AuthN.ItemOrder): Order results asc(ending) or desc(ending).
   *   - order_by (AuthN.User.ListOrderBy): Which field to order results by.
   *   - size (number): Maximum results to include in the response.
   * @returns {Promise<PangeaResponse<AuthN.User.ListResult>>} - A promise
   * representing an async call to the endpoint. Available response fields can be found in our
   * [API Documentation](https://pangea.cloud/docs/api/authn/user#/v2/user/list).
   * @example
   * ```js
   * const response = await authn.user.list(
   *   {
   *     order: AuthN.ItemOrder.ASC,
   *     order_by: AuthN.User.ListOrderBy.ID,
   *     size: 20,
   *   }
   * );
   * ```
   */
  list(
    request: AuthN.User.ListRequest
  ): Promise<PangeaResponse<AuthN.User.ListResult>> {
    return this.post("v2/user/list", request);
  }

  /**
   * @summary Update user's settings
   * @description Update user's settings.
   * @operationId authn_post_v2_user_update
   * @param request Supported request parameters:
   *   - email (string): An email address.
   *   - id (string): The identity of a user or a service.
   *   - username (string): A username.
   *   - disabled (boolean): Disabling a user account will prevent them from logging in.
   *   - unlock (boolean): Unlock a user account if it has been locked out due to failed authentication attempts.
   * @returns A promise representing an async call to the endpoint. Available
   * response fields can be found in our [API Documentation](https://pangea.cloud/docs/api/authn/user#/v2/user/update).
   * @example
   * ```js
   * const response = await authn.user.update(
   *   {
   *    email: "joe.user@email.com",
   *    disabled: false,
   *   }
   * );
   * ```
   */
  update(
    request:
      | AuthN.User.Update.EmailRequest
      | AuthN.User.Update.IDRequest
      | AuthN.User.Update.UsernameRequest
  ): Promise<PangeaResponse<AuthN.User.UpdateResult>> {
    return this.post("v2/user/update", request);
  }

  /**
   * @summary Invite User
   * @description Send an invitation to a user.
   * @operationId authn_post_v2_user_invite
   * @param {AuthN.User.InviteRequest} request
   * @returns {Promise<PangeaResponse<AuthN.User.InviteResult>>} - A promise
   * representing an async call to the endpoint. Available response fields can be found in our
   * [API Documentation](https://pangea.cloud/docs/api/authn/invite#/v2/user/invite).
   * @example
   * ```js
   * const response = await authn.user.invite({
   *   inviter: "admin@email.com",
   *   email: "joe.user@email.com",
   *   callback: "https://www.myserver.com/callback",
   *   state: "pcb_zurr3lkcwdp5keq73htsfpcii5k4zgm7",
   * });
   * ```
   */
  invite(
    request: AuthN.User.InviteRequest
  ): Promise<PangeaResponse<AuthN.User.InviteResult>> {
    return this.post("v2/user/invite", request);
  }
}
