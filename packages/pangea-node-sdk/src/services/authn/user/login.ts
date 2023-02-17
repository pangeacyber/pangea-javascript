import PangeaResponse from "../../../response";
import BaseService from "../../base";
import PangeaConfig from "../../../config";
import { AuthN } from "../../../types";

export default class UserLogin extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("authn", token, config);
    this.apiVersion = "v1";
  }

  // `/v1/user/login/password`
  password(
    email: string,
    password: string,
    { extra_profile }: AuthN.User.Login.PasswordOptions
  ): Promise<PangeaResponse<AuthN.User.Login.LoginResult>> {
    const data: AuthN.User.Login.PasswordRequest = {
      email: email,
      password: password,
    };

    if (typeof extra_profile === "object" && extra_profile !== null) {
      data.extra_profile = extra_profile;
    }

    return this.post("user/login/password", data);
  }

  // `/v1/user/login/social`
  social(
    provider: AuthN.MFAProvider,
    email: string,
    socialID: string,
    { extra_profile }: AuthN.User.Login.SocialOptions
  ): Promise<PangeaResponse<AuthN.User.Login.LoginResult>> {
    const data: AuthN.User.Login.SocialRequest = {
      provider: provider,
      email: email,
      social_id: socialID,
    };

    if (typeof extra_profile === "object" && extra_profile !== null) {
      data.extra_profile = extra_profile;
    }

    return this.post("user/login/social", data);
  }
}
