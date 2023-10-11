import PangeaResponse from "@src/response.js";
import BaseService from "@src/services/base.js";
import PangeaConfig from "@src/config.js";
import { AuthN } from "@src/types.js";
import UserProfile from "./profile.js";
import UserAuthenticators from "./authenticators.js";
import UserInvites from "./invites.js";

export default class User extends BaseService {
  profile: UserProfile;
  authenticators: UserAuthenticators;
  invites: UserInvites;

  constructor(token: string, config: PangeaConfig) {
    super("authn", token, config);

    this.profile = new UserProfile(token, config);
    this.authenticators = new UserAuthenticators(token, config);
    this.invites = new UserInvites(token, config);
  }

  // authn::/v1/user/delete
  /**
   * @summary Delete User
   * @description Delete a user.
   * @operationId authn_post_v1_user_delete
   * @param {Object} request - Supported options:
   *   - email (string): An email address
   *   - id (string): The identity of a user or a service
   * @returns {Promise<PangeaResponse<{}>>} - A promise
   * representing an async call to the endpoint.
   * @example
   * await authn.user.delete(
   *   { email: "example@example.com" }
   * );
   */
  delete(
    request: AuthN.User.Delete.EmailRequest | AuthN.User.Delete.IDRequest
  ): Promise<PangeaResponse<{}>> {
    return this.post("v2/user/delete", request);
  }

  // authn::/v1/user/create
  /**
   * @summary Create User
   * @description Create a user.
   * @operationId authn_post_v1_user_create
   * @param FIXME:
   * @returns {Promise<PangeaResponse<AuthN.User.CreateResult>>} - A promise
   * representing an async call to the endpoint.
   * @example
   * ```js
   * FIXME:
   * ```
   */
  create(request: AuthN.User.CreateRequest): Promise<PangeaResponse<AuthN.User.CreateResult>> {
    return this.post("v2/user/create", request);
  }

  // authn::/v1/user/list
  /**
   * @summary List Users
   * @description Look up users by scopes.
   * @operationId authn_post_v1_user_list
   * @param {Object} options - Supported options:
   *   - filter (object)
   *   - last (string): Reflected value from a previous response to
   * obtain the next page of results.
   *   - order (AuthN.ItemOrder): Order results asc(ending) or desc(ending).
   *   - order_by (AuthN.User.ListOrderBy): Which field to order results by.
   *   - size (number): Maximum results to include in the response.
   * @returns {Promise<PangeaResponse<AuthN.User.ListResult>>} - A promise
   * representing an async call to the endpoint.
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
  list(request: AuthN.User.ListRequest): Promise<PangeaResponse<AuthN.User.ListResult>> {
    return this.post("v2/user/list", request);
  }

  // authn::/v1/user/update
  /**
   * @summary Update user's settings
   * @description Update user's settings.
   * @operationId authn_post_v1_user_update
   * @param {Object} request - Supported request:
   *   - email (string): An email address
   *   - id (string): The identity of a user or a service
   * @param {Object} options - Supported options:
   *   - authenticator (string): New value for a user's authenticator.
   *   - disabled (boolean): New disabled value.
   * Disabling a user account will prevent them from logging in.
   *   - require_mfa (boolean): New require_mfa value
   *   - verified (boolean): New verified value
   * @returns {Promise<PangeaResponse<AuthN.User.UpdateResult>>} - A promise
   * representing an async call to the endpoint.
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
    request: AuthN.User.Update.EmailRequest | AuthN.User.Update.IDRequest
  ): Promise<PangeaResponse<AuthN.User.UpdateResult>> {
    return this.post("v2/user/update", request);
  }

  /**
   * @summary Invite User
   * @description Send an invitation to a user.
   * @operationId authn_post_v1_user_invite
  // FIXME:
   * @returns {Promise<PangeaResponse<AuthN.User.InviteResult>>} - A promise
   * representing an async call to the endpoint.
   * @example
   * ```js
      // FIXME:
   * );
   * ```
   */
  invite(request: AuthN.User.InviteRequest): Promise<PangeaResponse<AuthN.User.InviteResult>> {
    return this.post("v2/user/invite", request);
  }
}
