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
   * @summary Delete a user
   * @description Delete a user
   * @param {Request} request - An email/id delete request
   * @returns {Promise<PangeaResponse<{}>>} - A promise representing an async call to the endpoint
   * @example
   * await authn.user.delete({email: "example@example.com"});
   */
  delete(
    request: AuthN.User.Delete.EmailRequest | AuthN.User.Delete.IDRequest
  ): Promise<PangeaResponse<{}>> {
    return this.post("user/delete", request);
  }

  // authn::/v1/user/create
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
  list(request: AuthN.User.ListRequest): Promise<PangeaResponse<AuthN.User.ListResult>> {
    request.use_new = true;
    return this.post("user/list", request);
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
