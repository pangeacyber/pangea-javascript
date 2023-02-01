import PangeaResponse from "../../response";
import BaseService from "../base";
import PangeaConfig from "../../config";
import { AuthN } from "../../types";
import AuthNProfile from "./profile";
import AuthNInvites from "./invites";

export default class AuthNUser extends BaseService {
  profile: AuthNProfile;
  invites: AuthNInvites;

  constructor(token: string, config: PangeaConfig) {
    super("authnuser", token, config);
    this.apiVersion = "v1";

    this.profile = new AuthNProfile(token, config);
    this.invites = new AuthNInvites(token, config);
  }

  // authn::/v1/user/delete
  /**
   * @summary Delete a user
   * @description Delete a user
   * @param {String} email - An email address
   * @returns {Promise<PangeaResponse<{}>>} - A promise representing an async call to the endpoint
   * @example
   * await authn.userDelete("example@example.com");
   */
  delete(email: string): Promise<PangeaResponse<{}>> {
    const data: AuthN.UserDeleteRequest = {
      email,
    };

    return this.post("user/delete", data);
  }

  // authn::/v1/user/create
  /**
   * @summary Create a user
   * @description Create a user
   * @param {String} user.email - An email address
   * @param {String} user.authenticator - A provider-specific authenticator, such as a password or a social identity
   * @param {String} user.id_provider - Mechanism for authenticating a user's identity
   * @param {Boolean} user.verified - True if the user's email has been verified
   * @param {Boolean} user.require_mfa - True if the user must use MFA during authentication
   * @param {Object} user.profile - A user profile as a collection of string properties
   * @param {Array<String>} user.scopes - A list of scopes
   * @returns {Promise<PangeaResponse<{}>>} - A promise representing an async call to the endpoint
   * @example
   * const response = await authn.userCreate({
   *   email: "example@example.com",
   *   authenticator: "My1s+Password",
   *   id_provider: "password",
   *   verified: false,
   *   require_mfa: false,
   *   profile: {
   *     first_name: "Joe",
   *     last_name: "User",
   *   },
   *   scopes: ["scope1", "scope2"]
   * });
   */
  create(user: AuthN.UserCreateRequest): Promise<PangeaResponse<AuthN.UserCreateResult>> {
    return this.post("user/create", user);
  }

  // authn::/v1/user/invite
  /**
   * @summary Invite a user
   * @description Send an invitation to a user
   * @param {String} userInvite.inviter - An email address
   * @param {String} userInvite.email - An email address
   * @param {String} userInvite.callback - A login callback URI
   * @param {String} userInvite.state - State tracking string for login callbacks
   * @param {String} userInvite.invite_org - Optional invite org
   * @param {String} userInvite.require_mfa - Optional boolean setting for requiring mfa
   * @returns {Promise<PangeaResponse<AuthN.UserInvite>>} - A promise representing an async call to the endpoint
   * @example
   * const response = await authn.userInvite({
   *   inviter: "kat.user@email.com",
   *   email: "joe.user@email.com",
   *   callback: "https://www.myserver.com/callback",
   *   state: "C8VTNjY2icUMeiDHFHUxBwiAstEGqaayU4",
   * });
   */
  invite(userInvite: AuthN.UserInviteRequest): Promise<PangeaResponse<AuthN.UserInvite>> {
    return this.post("user/invite", userInvite);
  }

  // authn::/v1/user/list
  /**
   * @summary List users
   * @description Lookup users by scopes
   * @param {Array<String>} o.scopes - A list of scopes
   * @param {Array<String>} o.glob_scopes - A list of scopes
   * @returns {Promise<PangeaResponse<AuthN.UserListResult>>} - A promise representing an async call to the endpoint
   * @example
   * const response = await authn.userList({
   *   scopes: ["scope1", "scope2"],
   *   glob_scopes: ["scope1", "scope2"],
   * });
   */
  list(o: AuthN.UserListRequest): Promise<PangeaResponse<AuthN.UserListResult>> {
    return this.post("user/list", o);
  }

  // authn::/v1/user/login
  /**
   * @summary User login
   * @description Log a user in and return the user's token and information
   * @param {String} o.email - An email address
   * @param {String} o.secret - User's authentication secret
   * @param {Array<String>} o.scopes - An optional list of scopes
   * @returns {Promise<PangeaResponse<AuthN.UserLoginResult>>} - A promise representing an async call to the endpoint
   * @example
   * const response = await authn.userLogin({
   *   email: "joe.user@email.com",
   *   secret: "My1s+Password",
   *   scopes: ["scope1", "scope2"],
   * });
   */
  login(o: AuthN.UserLoginRequest): Promise<PangeaResponse<AuthN.UserLoginResult>> {
    return this.post("user/login", o);
  }

  // authn::/v1/user/update
  /**
   * @summary Administration user update
   * @description Update user's settings
   * @param {String | null} o.identity - The identity of a user or a service
   * @param {String | null} o.email - An email address
   * @param {String | null} o.authenticator - New value for a user's authenticator
   * @param {Boolean | null} o.disabled - New disabled value. Disabling a user account will prevent them from logging in.
   * @param {Boolean | null} o.require_mfa - New require_mfa value
   * @returns {Promise<PangeaResponse<AuthN.UserUpdateResult>>} - A promise representing an async call to the endpoint
   * @example
   * const response = await authn.userUpdate({
   *   email: "joe.user@email.com",
   *   require_mfa: true,
   * });
   */
  update(o: AuthN.UserUpdateRequest): Promise<PangeaResponse<AuthN.UserUpdateResult>> {
    return this.post("user/update", o);
  }
}
