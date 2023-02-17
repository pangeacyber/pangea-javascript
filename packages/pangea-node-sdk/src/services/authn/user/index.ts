import PangeaResponse from "../../../response";
import BaseService from "../../base";
import PangeaConfig from "../../../config";
import { AuthN } from "../../../types";
import AuthNUserProfile from "./profile";
import AuthNUserInvites from "./invites";
import AuthNUserLogin from "./login";
import AuthNUserMFA from "./mfa";

export default class AuthNUser extends BaseService {
  profile: AuthNUserProfile;
  invites: AuthNUserInvites;
  login: AuthNUserLogin;
  mfa: AuthNUserMFA;

  constructor(token: string, config: PangeaConfig) {
    super("authnuser", token, config);
    this.apiVersion = "v1";

    this.profile = new AuthNUserProfile(token, config);
    this.invites = new AuthNUserInvites(token, config);
    this.login = new AuthNUserLogin(token, config);
    this.mfa = new AuthNUserMFA(token, config);
  }

  // authn::/v1/user/delete
  /**
   * @summary Delete a user
   * @description Delete a user
   * @param {String} email - An email address
   * @returns {Promise<PangeaResponse<{}>>} - A promise representing an async call to the endpoint
   * @example
   * await authn.user.delete("example@example.com");
   */
  delete(email: string): Promise<PangeaResponse<{}>> {
    const data: AuthN.User.Delete.Request = {
      email,
    };

    return this.post("user/delete", data);
  }

  // authn::/v1/user/create
  create(
    { email, authenticator }: AuthN.User.Create.RequiredParams,
    { id_provider, verified, require_mfa, profile, scopes }: AuthN.User.Create.OptionalParams
  ): Promise<PangeaResponse<AuthN.User.Create.Response>> {
    const data: AuthN.User.Create.Request = {
      email,
      authenticator,
    };

    if (id_provider) data.id_provider = id_provider;
    if (typeof verified === "boolean") data.verified = verified;
    if (typeof require_mfa === "boolean") data.require_mfa = require_mfa;
    if (profile) data.profile = profile;
    if (scopes) data.scopes = scopes;

    return this.post("user/create", data);
  }

  // authn::/v1/user/invite
  invite(
    { inviter, email, callback, state }: AuthN.User.Invite.RequiredParams,
    { invite_org, require_mfa }: AuthN.User.Invite.OptionalParams
  ): Promise<PangeaResponse<AuthN.User.Invite.Response>> {
    const data: AuthN.User.Invite.Request = {
      inviter,
      email,
      callback,
      state,
    };

    if (invite_org) data.invite_org = invite_org;
    if (typeof require_mfa === "boolean") data.require_mfa = require_mfa;

    return this.post("user/invite", data);
  }

  // authn::/v1/user/list
  list({
    scopes,
    glob_scopes,
  }: AuthN.User.List.Request): Promise<PangeaResponse<AuthN.User.List.Response>> {
    return this.post("user/list", { scopes, glob_scopes });
  }

  // authn::/v1/user/verify
  verify({
    id_provider,
    email,
    authenticator,
  }: AuthN.User.Verify.Request): Promise<PangeaResponse<AuthN.User.Verify.Response>> {
    return this.post("user/verify", { id_provider, email, authenticator });
  }

  // authn::/v1/user/update
  update(
    request: AuthN.User.Update.EmailRequest | AuthN.User.Update.IdentityRequest,
    optionalParams: AuthN.User.Update.OptionalParams
  ): Promise<PangeaResponse<AuthN.User.Update.Response>> {
    const data: AuthN.User.Update.EmailRequest | AuthN.User.Update.IdentityRequest = {
      ...request,
      ...optionalParams,
    };

    return this.post("user/update", data);
  }
}
