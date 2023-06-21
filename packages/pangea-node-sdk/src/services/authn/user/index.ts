import PangeaResponse from "../../../response.js";
import BaseService from "../../base.js";
import PangeaConfig from "../../../config.js";
import { AuthN } from "../../../types.js";
import UserProfile from "./profile.js";
import UserInvites from "./invites.js";
import UserLogin from "./login.js";
import UserMFA from "./mfa.js";

export default class User extends BaseService {
  profile: UserProfile;
  invites: UserInvites;
  login: UserLogin;
  mfa: UserMFA;

  constructor(token: string, config: PangeaConfig) {
    super("authn", token, config);
    this.apiVersion = "v1";

    this.profile = new UserProfile(token, config);
    this.invites = new UserInvites(token, config);
    this.login = new UserLogin(token, config);
    this.mfa = new UserMFA(token, config);
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
    return this.post("user/delete", request);
  }

  // authn::/v1/user/create
  /**
   * @summary Create User
   * @description Create a user.
   * @operationId authn_post_v1_user_create
   * @param {String} email - An email address
   * @param {String} authenticator - A provider-specific authenticator,
   * such as a password or a social identity.
   * @param {AuthN.IDProvider} idProvider - Mechanism for authenticating a
   * user's identity
   * @param {Object} options - Supported options:
   *   - verified (boolean):  True if the user's email has been verified
   *   - require_mfa (boolean): True if the user must use MFA
   * during authentication
   *   - profile (object): A user profile as a collection of string properties
   *   - scopes (string[]): A list of scopes
   * @returns {Promise<PangeaResponse<AuthN.User.CreateResult>>} - A promise
   * representing an async call to the endpoint.
   * @example
   * ```js
   * const response = await authn.user.create(
   *   "joe.user@email.com",
   *   "My1s+Password",
   *   AuthN.IDProvider.PASSWORD,
   *   {
   *     verified: false,
   *     require_mfa: false,
   *     profile: {
   *       first_name: "Joe",
   *       last_name: "User",
   *     }
   *     scopes: ["scope1", "scope2"],
   *   }
   * );
   * ```
   */
  create(
    email: string,
    authenticator: string,
    idProvider: AuthN.IDProvider,
    { verified, require_mfa, profile, scopes }: AuthN.User.CreateOptions = {}
  ): Promise<PangeaResponse<AuthN.User.CreateResult>> {
    const data: AuthN.User.CreateRequest = {
      email: email,
      authenticator: authenticator,
      id_provider: idProvider,
    };

    if (typeof verified === "boolean") data.verified = verified;
    if (typeof require_mfa === "boolean") data.require_mfa = require_mfa;
    if (profile) data.profile = profile;
    if (scopes) data.scopes = scopes;

    return this.post("user/create", data);
  }

  // authn::/v1/user/invite
  /**
   * @summary Invite User
   * @description Send an invitation to a user.
   * @operationId authn_post_v1_user_invite
   * @param {String} inviter - An email address
   * @param {String} email - An email address
   * @param {String} callback - A login callback URI
   * @param {String} state - State tracking string fo login callbacks
   * @param {Object} options - Supported options:
   *   - require_mfa (boolean): Require the user to authenticate with MFA
   * @returns {Promise<PangeaResponse<AuthN.User.InviteResult>>} - A promise
   * representing an async call to the endpoint.
   * @example
   * ```js
   * const response = await authn.user.invite(
   *   "admin@email.com",
   *   "joe.user@email.com",
   *   "/callback",
   *   "pcb_zurr3lkcwdp5keq73htsfpcii5k4zgm7",
   *   { require_mfa: false }
   * );
   * ```
   */
  invite(
    inviter: string,
    email: string,
    callback: string,
    state: string,
    options: AuthN.User.InviteOptions = {}
  ): Promise<PangeaResponse<AuthN.User.InviteResult>> {
    const data: AuthN.User.InviteRequest = {
      inviter,
      email,
      callback,
      state,
    };
    Object.assign(data, options);
    return this.post("user/invite", data);
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
    request.use_new = true;
    return this.post("user/list", request);
  }

  // authn::/v1/user/verify
  /**
   * @summary Verify User
   * @description Verify a user's primary authentication.
   * @operationId authn_post_v1_user_verify
   * @param {AuthN.IDProvider} idProvider - Mechanism for authenticating a
   * user's identity
   * @param {String} email - An email address
   * @param {String} authenticator - A provider-specific authenticator,
   * such as a password or a social identity.
   * @returns {Promise<PangeaResponse<AuthN.User.VerifyResult>>} - A promise
   * representing an async call to the endpoint.
   * @example
   * ```js
   * const response = await authn.user.verify(
   *   AuthN.IDProvider.PASSWORD,
   *   "joe.user@email.com",
   *   "My1s+Password"
   * );
   * ```
   */
  verify(
    idProvider: AuthN.IDProvider,
    email: string,
    authenticator: string
  ): Promise<PangeaResponse<AuthN.User.VerifyResult>> {
    const data: AuthN.User.VerifyRequest = {
      id_provider: idProvider,
      email: email,
      authenticator: authenticator,
    };
    return this.post("user/verify", data);
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
   *   { email: "joe.user@email.com" },
   *   {
   *     disabled: false,
   *     require_mfa: true,
   *   }
   * );
   * ```
   */
  update(
    request: AuthN.User.Update.EmailRequest | AuthN.User.Update.IDRequest,
    options: AuthN.User.Update.Options
  ): Promise<PangeaResponse<AuthN.User.UpdateResult>> {
    const data: AuthN.User.Update.EmailRequest | AuthN.User.Update.IDRequest = {
      ...request,
      ...options,
    };

    return this.post("user/update", data);
  }
}
