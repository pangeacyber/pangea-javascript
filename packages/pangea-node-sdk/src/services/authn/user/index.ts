import PangeaResponse from "../../../response";
import BaseService from "../../base";
import PangeaConfig from "../../../config";
import { AuthN } from "../../../types";
import UserProfile from "./profile";
import UserInvites from "./invites";
import UserLogin from "./login";
import UserMFA from "./mfa";

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
   * @summary Delete a user
   * @description Delete a user
   * @param {String} email - An email address
   * @returns {Promise<PangeaResponse<{}>>} - A promise representing an async call to the endpoint
   * @example
   * await authn.user.delete("example@example.com");
   */
  delete(email: string): Promise<PangeaResponse<{}>> {
    const data: AuthN.User.DeleteRequest = {
      email: email,
    };

    return this.post("user/delete", data);
  }

  // authn::/v1/user/create
  create(
    email: string,
    authenticator: string,
    { id_provider, verified, require_mfa, profile, scopes }: AuthN.User.CreateOptions
  ): Promise<PangeaResponse<AuthN.User.CreateResult>> {
    const data: AuthN.User.CreateRequest = {
      email: email,
      authenticator: authenticator,
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
    inviter: string,
    email: string,
    callback: string,
    state: string,
    { invite_org, require_mfa }: AuthN.User.InviteOptions
  ): Promise<PangeaResponse<AuthN.User.InviteResult>> {
    const data: AuthN.User.InviteRequest = {
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
  }: AuthN.User.ListRequest): Promise<PangeaResponse<AuthN.User.ListResult>> {
    return this.post("user/list", { scopes, glob_scopes });
  }

  // authn::/v1/user/verify
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
  update(
    request: AuthN.User.Update.EmailRequest | AuthN.User.Update.IdentityRequest,
    options: AuthN.User.Update.Options
  ): Promise<PangeaResponse<AuthN.User.UpdateResult>> {
    const data: AuthN.User.Update.EmailRequest | AuthN.User.Update.IdentityRequest = {
      ...request,
      ...options,
    };

    return this.post("user/update", data);
  }
}
